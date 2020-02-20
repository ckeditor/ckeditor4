/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "openlink" plugin.
 *
 */

'use strict';

( function() {

	CKEDITOR.plugins.add( 'openlink', {
		lang: 'bg,en,de,pl,ru', // %REMOVE_LINE_CORE%
		icons: 'openLink', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'link,contextmenu',

		onLoad: function() {
			CKEDITOR.addCss( '.openlink a:hover{ cursor: pointer; }' );
		},

		init: function( editor ) {
			var target = editor.config.openlink_target || '_blank',
				openLinkInstance = new OpenLinkPlugin( editor, editor.config );

			// Register openLink command.
			editor.addCommand( 'openLink', {
				exec: function( editor ) {
					var anchor = getActiveLink( editor ),
						href;

					if ( anchor ) {
						href = anchor.getAttribute( 'href' );
					}

					if ( href ) {
						window.open( href, target );
					}
				}
			} );

			// Register menu items.
			if ( editor.addMenuItems ) {
				editor.addMenuItems( {
					openLink: {
						label: editor.lang.openlink.menu,
						command: 'openLink',
						group: 'link',
						order: -1
					}
				} );
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			editor.contextMenu.addListener( function( element, selection ) {
				if ( !element ) {
					return null;
				}

				var anchor = getActiveLink( editor );

				if ( anchor && anchor.getAttribute( 'href' ) ) {
					return {
						openLink: CKEDITOR.TRISTATE_OFF
					};
				}

				return {};
			} );

			// A quick workaround for issue #11842.
			editor.on( 'contentDom', function( evt ) {
				var editable = editor.editable();

				// We want to be able to open links also in read-only mode. This
				// listener will open link in new tab.
				editable.attachListener( editable, 'click', function( evt ) {
					// This feature should be available in:
					// * wysywigmode in read-only
					// * wysywigmode when ctrl key is down
					var target = evt.data.getTarget(),
						clickedAnchor = ( new CKEDITOR.dom.elementPath( target, editor.editable() ) ).contains( 'a' ),
						href = clickedAnchor && clickedAnchor.getAttribute( 'href' ),
						modifierPressed = openLinkInstance.properModifierPressed( evt );

					if ( editor.readOnly && !editor.config.openlink_enableReadOnly ) {
						return;
					}

					if ( href && modifierPressed ) {
						window.open( href, target );

						// We need to prevent it for Firefox, as it has it's own handling (#8).
						evt.data.preventDefault();
					}
				} );

				if ( openLinkInstance.modifierRequired() ) {
					// Keyboard listeners are needed only if any modifier is required to open clicked link.
					editable.attachListener( editable, 'keydown', openLinkInstance.onKeyPress, openLinkInstance );
					editable.attachListener( editable, 'keyup', openLinkInstance.onKeyPress, openLinkInstance );
				} else {
					// If any clicks should trigger link open, then just add the class to the editable.
					editor.editable().addClass( 'openlink' );
				}

			} );
		}
	} );

	// Returns the element of active (currently focused) link.
	// It has also support for linked image2 instance.
	// @return {CKEDITOR.dom.element}
	function getActiveLink( editor ) {
		var anchor = CKEDITOR.plugins.link.getSelectedLink( editor ),
			// We need to do some special checking against widgets availability.
			activeWidget = editor.widgets && editor.widgets.focused;

		// If default way of getting links didn't return anything useful
		if ( !anchor && activeWidget && activeWidget.name == 'image' && activeWidget.parts.link ) {
			// Since CKEditor 4.4.0 image widgets may be linked.
			anchor = activeWidget.parts.link;
		}

		return anchor;
	}

	/**
	 * OpenLink plugin type, groups all the functions related to plugin.
	 *
	 * @class CKEDITOR.plugins.openlink
	 * @param {CKEDITOR.editor} editor
	 * @param {CKEDITOR.config} config
	 */
	function OpenLinkPlugin( editor, config ) {
		this.editor = editor;
		this.modifier = typeof config.openlink_modifier != 'undefined' ? config.openlink_modifier : CKEDITOR.CTRL;
	}

	/**
	 * Whether configuration requires __any__ modifier key to be hold in order to open the link.
	 *
	 * @returns {Boolean}
	 */
	OpenLinkPlugin.prototype.modifierRequired = function() {
		return this.modifier !== 0;
	};

	/**
	 * Tells if `evt` has proper modifier keys pressed.
	 *
	 * **Note:** it will return `true` if modifier is not required.
	 *
	 * @param {CKEDITOR.dom.event} evt
	 * @returns {Boolean}
	 */
	OpenLinkPlugin.prototype.properModifierPressed = function( evt ) {
		return !this.modifierRequired() || ( evt.data.getKeystroke() & this.modifier );
	};

	/**
	 * Method to be called upon `keydown`, `keyup` events.
	 *
	 * @param {CKEDITOR.dom.event} evt
	 */
	OpenLinkPlugin.prototype.onKeyPress = function( evt ) {
		if ( this.properModifierPressed( evt ) ) {
			this.editor.editable().addClass( 'openlink' );
		} else {
			this.editor.editable().removeClass( 'openlink' );
		}
	};

	CKEDITOR.plugins.openlink = OpenLinkPlugin;
} )();
