﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	var template = '<a id="{id}"' +
		' class="cke_button cke_button__{name} cke_button_{state} {cls}"' +
		( CKEDITOR.env.gecko && !CKEDITOR.env.hc ? '' : ' href="javascript:void(\'{titleJs}\')"' ) +
		' title="{title}"' +
		' tabindex="-1"' +
		' hidefocus="true"' +
		' role="button"' +
		' aria-labelledby="{id}_label"' +
		' aria-describedby="{id}_description"' +
		' aria-haspopup="{hasArrow}"' +
		' aria-disabled="{ariaDisabled}"' +
		'{hasArrowAriaHtml}' +
		'{toggleAriaHtml}';

	// Some browsers don't cancel key events in the keydown but in the
	// keypress.
	// TODO: Check if really needed.
	if ( CKEDITOR.env.gecko && CKEDITOR.env.mac )
		template += ' onkeypress="return false;"';

	// With Firefox, we need to force the button to redraw, otherwise it
	// will remain in the focus state.
	if ( CKEDITOR.env.gecko )
		template += ' onblur="this.style.cssText = this.style.cssText;"';

	// IE and Edge needs special click handler based on mouseup event with additional check
	// of which mouse button was clicked (https://dev.ckeditor.com/ticket/188, #2565).
	var specialClickHandler = '';
	if ( CKEDITOR.env.ie ) {
		specialClickHandler = 'return false;" onmouseup="CKEDITOR.tools.getMouseButton(event)==CKEDITOR.MOUSE_BUTTON_LEFT&&';
	}

	template += ' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);"' +
		' onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' +
		'onclick="' + specialClickHandler + 'CKEDITOR.tools.callFunction({clickFn},this);return false;">' +
		'<span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"';


	template += '>&nbsp;</span>' +
		'<span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>' +
		'<span id="{id}_description" class="cke_button_label" aria-hidden="false">{ariaShortcutSpace}{ariaShortcut}</span>' +
		'{arrowHtml}' +
		'</a>';

	var templateArrow = '<span class="cke_button_arrow">' +
		// BLACK DOWN-POINTING TRIANGLE
	( CKEDITOR.env.hc ? '&#9660;' : '' ) +
		'</span>';

	var btnArrowTpl = CKEDITOR.addTemplate( 'buttonArrow', templateArrow ),
		btnTpl = CKEDITOR.addTemplate( 'button', template );

	CKEDITOR.plugins.add( 'button', {
		beforeInit: function( editor ) {
			editor.ui.addHandler( CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler );
		}
	} );

	/**
	 * Button UI element.
	 *
	 * @readonly
	 * @property {String} [='button']
	 * @member CKEDITOR
	 */
	CKEDITOR.UI_BUTTON = 'button';

	/**
	 * Represents a button UI element. This class should not be called directly. To
	 * create new buttons use {@link CKEDITOR.ui#addButton} instead.
	 *
	 * @class
	 * @constructor Creates a button class instance.
	 * @param {Object} definition The button definition.
	 */
	CKEDITOR.ui.button = function( definition ) {
		CKEDITOR.tools.extend( this, definition,
		// Set defaults.
		{
			isToggle: definition.isToggle || false,
			title: definition.label,
			click: definition.click ||
			function( editor ) {
				editor.execCommand( definition.command );
			}
		} );

		this._ = {};
	};

	/**
	 * Represents the button handler object.
	 *
	 * @class
	 * @singleton
	 * @extends CKEDITOR.ui.handlerDefinition
	 */
	CKEDITOR.ui.button.handler = {
		/**
		 * Transforms a button definition into a {@link CKEDITOR.ui.button} instance.
		 *
		 * @member CKEDITOR.ui.button.handler
		 * @param {Object} definition
		 * @returns {CKEDITOR.ui.button}
		 */
		create: function( definition ) {
			return new CKEDITOR.ui.button( definition );
		}
	};

	/** @class CKEDITOR.ui.button */
	CKEDITOR.ui.button.prototype = {
		/**
		 * Renders the button.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance which this button is
		 * to be used by.
		 * @param {Array} output The output array to which the HTML code related to
		 * this button should be appended.
		 */
		render: function( editor, output ) {
			var modeStates = null;

			function updateState() {
				// "this" is a CKEDITOR.ui.button instance.
				var mode = editor.mode;

				if ( mode ) {
					// Restore saved button state.
					var state = this.modes[ mode ] ? modeStates[ mode ] !== undefined ? modeStates[ mode ] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;

					state = editor.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : state;

					this.setState( state );

					// Let plugin to disable button.
					if ( this.refresh )
						this.refresh();
				}
			}

			var env = CKEDITOR.env,
				id = this._.id = CKEDITOR.tools.getNextId(),
				stateName = '',
				command = this.command,
				// Get the command name.
				clickFn,
				keystroke,
				shortcut;

			this._.editor = editor;

			var instance = {
				id: id,
				button: this,
				editor: editor,
				focus: function() {
					var element = CKEDITOR.document.getById( id );
					element.focus();
				},
				execute: function() {
					this.button.click( editor );
				},
				attach: function( editor ) {
					this.button.attach( editor );
				}
			};

			var keydownFn = CKEDITOR.tools.addFunction( function( ev ) {
				if ( instance.onkey ) {
					ev = new CKEDITOR.dom.event( ev );
					return ( instance.onkey( instance, ev.getKeystroke() ) !== false );
				}
			} );

			var focusFn = CKEDITOR.tools.addFunction( function( ev ) {
				var retVal;

				if ( instance.onfocus )
					retVal = ( instance.onfocus( instance, new CKEDITOR.dom.event( ev ) ) !== false );

				return retVal;
			} );

			var selLocked = 0;

			instance.clickFn = clickFn = CKEDITOR.tools.addFunction( function() {

				// Restore locked selection in Opera.
				if ( selLocked ) {
					editor.unlockSelection( 1 );
					selLocked = 0;
				}
				instance.execute();

				// Fixed iOS focus issue when your press disabled button (https://dev.ckeditor.com/ticket/12381).
				if ( env.iOS ) {
					editor.focus();
				}
			} );


			// Indicate a mode sensitive button.
			if ( this.modes ) {
				modeStates = {};

				editor.on( 'beforeModeUnload', function() {
					if ( editor.mode && this._.state != CKEDITOR.TRISTATE_DISABLED )
						modeStates[ editor.mode ] = this._.state;
				}, this );

				// Update status when activeFilter, mode or readOnly changes.
				editor.on( 'activeFilterChange', updateState, this );
				editor.on( 'mode', updateState, this );
				// If this button is sensitive to readOnly state, update it accordingly.
				!this.readOnly && editor.on( 'readOnly', updateState, this );

			} else if ( command ) {
				// Get the command instance.
				command = editor.getCommand( command );

				if ( command ) {
					command.on( 'state', function() {
						this.setState( command.state );
					}, this );

					stateName += ( command.state == CKEDITOR.TRISTATE_ON ? 'on' : command.state == CKEDITOR.TRISTATE_DISABLED ? 'disabled' : 'off' );
				}
			}

			var iconName;

			// For button that has text-direction awareness on selection path.
			if ( this.directional ) {
				editor.on( 'contentDirChanged', function( evt ) {
					var el = CKEDITOR.document.getById( this._.id ),
						icon = el.getFirst();

					var pathDir = evt.data;

					// Make a minor direction change to become style-able for the skin icon.
					if ( pathDir !=  editor.lang.dir )
						el.addClass( 'cke_' + pathDir );
					else
						el.removeClass( 'cke_ltr' ).removeClass( 'cke_rtl' );

					// Inline style update for the plugin icon.
					icon.setAttribute( 'style', CKEDITOR.skin.getIconStyle( iconName, pathDir == 'rtl', this.icon, this.iconOffset ) );
				}, this );
			}

			if ( !command ) {
				stateName += 'off';
			} else {
				keystroke = editor.getCommandKeystroke( command );

				if ( keystroke ) {
					shortcut = CKEDITOR.tools.keystrokeToString( editor.lang.common.keyboard, keystroke );
				}
			}

			var name = this.name || this.command,
				iconPath = null,
				overridePath = this.icon;

			iconName = name;

			// Check if we're pointing to an icon defined by another command. (https://dev.ckeditor.com/ticket/9555)
			if ( this.icon && !( /\./ ).test( this.icon ) ) {
				iconName = this.icon;
				overridePath = null;

			} else {
				// Register and use custom icon for button (#1530).
				if ( this.icon ) {
					iconPath = this.icon;
				}
				if ( CKEDITOR.env.hidpi && this.iconHiDpi ) {
					iconPath = this.iconHiDpi;
				}
			}

			if ( iconPath ) {
				CKEDITOR.skin.addIcon( iconPath, iconPath );
				overridePath = null;
			} else {
				iconPath = iconName;
			}

			var params = {
				id: id,
				name: name,
				iconName: iconName,
				label: this.label,
				// .cke_button_expandable enables additional styling for popup buttons (#2483).
				cls:  ( this.hasArrow ? 'cke_button_expandable ' : '' ) + ( this.className || '' ),
				state: stateName,
				ariaDisabled: stateName == 'disabled' ? 'true' : 'false',
				title: this.title + ( shortcut ? ' (' + shortcut.display + ')' : '' ),
				ariaShortcutSpace: shortcut ? '&nbsp;' : '',
				ariaShortcut: shortcut ? editor.lang.common.keyboardShortcut + ' ' + shortcut.aria : '',
				titleJs: env.gecko && !env.hc ? '' : ( this.title || '' ).replace( "'", '' ),
				hasArrow: typeof this.hasArrow === 'string' && this.hasArrow || ( this.hasArrow ? 'true' : 'false' ),
				keydownFn: keydownFn,
				focusFn: focusFn,
				clickFn: clickFn,
				style: CKEDITOR.skin.getIconStyle( iconPath, ( editor.lang.dir == 'rtl' ), overridePath, this.iconOffset ),
				arrowHtml: this.hasArrow ? btnArrowTpl.output() : '',
				hasArrowAriaHtml: this.hasArrow ? ' aria-expanded="false"' : '',
				toggleAriaHtml: this.isToggle ? 'aria-pressed="false"' : ''
			};

			btnTpl.output( params, output );

			if ( this.onRender )
				this.onRender();

			return instance;
		},

		/**
		 * Sets the button state.
		 *
		 * @param {Number} state Indicates the button state. One of {@link CKEDITOR#TRISTATE_ON},
		 * {@link CKEDITOR#TRISTATE_OFF}, or {@link CKEDITOR#TRISTATE_DISABLED}.
		 */
		setState: function( state ) {
			if ( this._.state == state )
				return false;

			this._.state = state;

			var element = CKEDITOR.document.getById( this._.id );

			if ( element ) {
				element.setState( state, 'cke_button' );
				element.setAttribute( 'aria-disabled', state == CKEDITOR.TRISTATE_DISABLED );

				if ( this.isToggle && !this.hasArrow ) {
					// Note: aria-pressed attribute should not be added to menuButton instances. (https://dev.ckeditor.com/ticket/11331).
					// For other buttons, do not remove the attribute, instead set its value (#2444).
					element.setAttribute( 'aria-pressed', state === CKEDITOR.TRISTATE_ON );
				}

				return true;
			} else {
				return false;
			}
		},

		/**
		 * Gets the button state.
		 *
		 * @returns {Number} The button state. One of {@link CKEDITOR#TRISTATE_ON},
		 * {@link CKEDITOR#TRISTATE_OFF}, or {@link CKEDITOR#TRISTATE_DISABLED}.
		 */
		getState: function() {
			return this._.state;
		},

		/**
		 * Returns this button's {@link CKEDITOR.feature} instance.
		 *
		 * It may be this button instance if it has at least one of
		 * `allowedContent` and `requiredContent` properties. Otherwise,
		 * if a command is bound to this button by the `command` property, then
		 * that command will be returned.
		 *
		 * This method implements the {@link CKEDITOR.feature#toFeature} interface method.
		 *
		 * @since 4.1.0
		 * @param {CKEDITOR.editor} Editor instance.
		 * @returns {CKEDITOR.feature} The feature.
		 */
		toFeature: function( editor ) {
			if ( this._.feature )
				return this._.feature;

			var feature = this;

			// If button isn't a feature, return command if is bound.
			if ( !this.allowedContent && !this.requiredContent && this.command )
				feature = editor.getCommand( this.command ) || feature;

			return this._.feature = feature;
		}
	};

	/**
	 * Adds a button definition to the UI elements list.
	 *
	 *		editorInstance.ui.addButton( 'MyBold', {
	 *			label: 'My Bold',
	 *			command: 'bold',
	 *			toolbar: 'basicstyles,1'
	 *		} );
	 *
	 * @member CKEDITOR.ui
	 * @param {String} name The button name.
	 * @param {Object} definition The button definition.
	 * @param {String} definition.label The textual part of the button (if visible) and its tooltip.
	 * @param {String} definition.command The command to be executed once the button is activated.
	 * @param {String} definition.toolbar The {@link CKEDITOR.config#toolbarGroups toolbar group} into which
	 * the button will be added. An optional index value (separated by a comma) determines the button position within the group.
	 * @param {String} definition.icon The path to a custom icon or icon name registered by another plugin. Custom icon paths
	 * are supported since the **4.9.0** version.
	 *
	 * To use icon registered by another plugin, icon parameter should be used like:
	 *
	 * 		editor.ui.addButton( 'my_button', {
	 * 			icon: 'Link' // Uses link icon from Link plugin.
	 * 		} );
	 *
	 * If the plugin provides a HiDPI version of an icon, it will be used for HiDPI displays (so defining `iconHiDpi` is not needed
	 * in this case).
	 *
	 * To use a custom icon, the path to the icon should be provided:
	 *
	 * 		editor.ui.addButton( 'my_button', {
	 * 			icon: 'assets/icons/my_button.png'
	 * 		} )
	 *
	 * This icon will be used for both standard and HiDPI displays unless `iconHiDpi` is explicitly defined.
	 * **Important**: CKEditor will resolve relative paths based on {@link CKEDITOR#basePath}.
	 * @param {String} definition.iconHiDpi The path to the custom HiDPI icon version. Supported since **4.9.0** version.
	 * It will be used only in HiDPI environments. The usage is similar to the `icon` parameter:
	 *
	 * 		editor.ui.addButton( 'my_button', {
	 * 			iconHiDpi: 'assets/icons/my_button.hidpi.png'
	 * 		} )
	 * @param {String/Boolean} definition.hasArrow If Boolean, it indicates whether the button should have a dropdown. If a string, it acts
	 * as a value of the button's `aria-haspopup` attribute. Since **4.11.0** it supports the string as a value.
	 * @param {Boolean} [definition.isToggle=false] Indicates if the button should be treated as a toggle one
	 * (button that can be switched on and off, e.g. the "Bold" button). This option is supported since the **4.19.0** version.
	 */
	CKEDITOR.ui.prototype.addButton = function( name, definition ) {
		this.add( name, CKEDITOR.UI_BUTTON, definition );
	};

} )();
