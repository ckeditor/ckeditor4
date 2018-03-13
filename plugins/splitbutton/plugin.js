/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
( function() {
	'use strict';

	function getLastActiveCommands( editor, allItems ) {
		var activeItem = null;
		for ( var i in allItems ) {
			if ( editor.getCommand( allItems[ i ].command ).state === CKEDITOR.TRISTATE_ON ) {
				activeItem = allItems[ i ];
			}
		}
		return activeItem;
	}

	function createButtons( editor, definition, items, buttons, groups ) {
		var allItems = definition.items,
			i,
			item,
			previousButton,
			defaultButton;

		for ( i in allItems ) {
			item = allItems[ i ];

			if ( !item.group ) {
				item.group = definition.label + '_default';
			}

			if ( groups[ item.group ] === undefined ) {
				groups[ item.group ] = 0;
			} else {
				groups[ item.group ]++;
			}
			item.order = groups[ item.group ];

			if ( !item.id ) {
				item.id = item.command + item.order;
			}

			item.role = 'menuitemcheckbox';

			item.onClick = function() {
				editor.execCommand( this.command );
			};

			editor.getCommand( item.command ).on( 'state', function() {
				var activeButton = getLastActiveCommands( editor, allItems ),
					previousId = previousButton && buttons[ previousButton.id ]._.id;

				if ( previousId ) {
					CKEDITOR.document.getById( previousId ).setStyle( 'display', 'none' );
				}

				if ( activeButton ) {
					CKEDITOR.document.getById( buttons[ activeButton.id ]._.id ).removeStyle( 'display' );
					previousButton = activeButton;
				} else {
					CKEDITOR.document.getById( buttons[ defaultButton.id ]._.id ).removeStyle( 'display' );
					previousButton = defaultButton;
				}
			} );

			items[ item.id ] = item;
			buttons[ item.id ] = new CKEDITOR.ui.button( item );

			// First button as default. It might be overwritten by actual default button.
			if ( !defaultButton ) {
				previousButton = buttons[ item.id ];
				defaultButton = buttons[ item.id ];
			} else {
				if ( item[ 'default' ] ) {
					defaultButton = buttons[ item.id ];
				} else {
					buttons[ item.id ].style = 'display: none;';
				}
			}
		}
	}

	CKEDITOR.plugins.add( 'splitbutton', {
		requires: 'menubutton',

		beforeInit: function( editor ) {
			/**
			 * @class
			 * @extends CKEDITOR.ui.menuButton
			 */
			CKEDITOR.ui.splitButton = CKEDITOR.tools.createClass( {
				base: CKEDITOR.ui.menuButton,

				/**
				 * Creates a splitButton class instance.
				 *
				 * @since 4.10.0
				 * @constructor
				 * @param {Object} definition The splitButton definition.
				 */
				$: function( definition ) {
					var groups = {},
						items = {},
						buttons = {};

					createButtons( editor, definition, items, buttons, groups );

					if ( !definition.onMenu ) {
						definition.onMenu = function() {
							var activeItems = {};
							for ( var i in items ) {
								activeItems[ i ] = ( editor.getCommand( items[ i ].command ).state === CKEDITOR.TRISTATE_ON ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
							}
							return activeItems;
						};
					}

					this.base( definition );
					this.items = items;
					this.buttons = buttons;
					this.icon = false;

					definition.toolbar += 1;
					var counter = 0;
					for ( var j in groups ) {
						editor.addMenuGroup( j, counter++ );
					}

					editor.addMenuItems( items );
				},

				statics: {
					handler: {
						create: function( definition ) {
							return new CKEDITOR.ui.splitButton( definition, definition.items );
						}
					}
				}
			} );

			/**
			 * Renders the splitButton.
			 *
			 * @param {CKEDITOR.editor} editor The editor instance which this button is
			 * to be used by.
			 * @param {Array} output The output array to which the HTML code related to
			 * this button should be appended.
			 */
			CKEDITOR.ui.splitButton.prototype.render = function( editor, output ) {
				output.push( '<span class="cke_splitbutton">' );
				for ( var key in this.buttons ) {
					this.buttons[ key ].render( editor, output );
				}
				var splitButton = CKEDITOR.ui.button.prototype.render.call( this, editor, output );
				output.push( '</span>' );
				return splitButton;
			};
			editor.ui.addHandler( CKEDITOR.UI_SPLITBUTTON, CKEDITOR.ui.splitButton.handler );
		}
	} );

	/**
	 * Button UI element.
	 *
	 * @readonly
	 * @property {String} [='splitbutton']
	 * @member CKEDITOR
	 */

	CKEDITOR.UI_SPLITBUTTON = 'splitbutton';

} )();
