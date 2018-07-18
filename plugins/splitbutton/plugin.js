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

	function createButtons( editor, definition ) {
		var allItems = definition.items,
			properties = { items: {}, buttons: {}, groups: {} },
			face = definition.face,
			i,
			item,
			previousButton,
			defaultButton;

		if ( face ) {
			// Split Button can be defined with simpler definition via strings, needed by (#2091).
			if ( typeof face === 'string' ) {
				face = CKEDITOR.tools.clone( editor.ui.items[ face ] );
			}
			face.click = face.click || face.onClick ||  function() {
				editor.execCommand( face.command, face.commandData );
			};

			properties.face = new CKEDITOR.ui.button( face );
			editor.addFeature( properties.face );
		}

		for ( i in allItems ) {
			item = allItems[ i ];

			// Split Button can be defined with simpler definition via strings, needed by (#2091).
			if ( typeof item === 'string' ) {
				item = CKEDITOR.tools.clone( editor.ui.items[ item ] );

				if ( !item.icon ) {
					item.icon = item.name || item.command;
				}

				allItems[ i ] = item;
			}

			item.name = item.name || item.command;

			if ( !item.group ) {
				item.group = definition.label + '_default';
			}

			if ( properties.groups[ item.group ] === undefined ) {
				properties.groups[ item.group ] = 0;
			} else {
				properties.groups[ item.group ]++;
			}
			item.order = properties.groups[ item.group ];

			if ( !item.id ) {
				item.id = item.command + item.order;
			}

			item.role = 'menuitemcheckbox';

			// We need both 'click' and 'onClick', because this definition can be used for setting both buttons and menu items.
			// Button uses 'click' property, menu item uses 'onClick' property.
			item.onClick = item.onClick || item.click ||  function() {
				editor.execCommand( this.command, this.commandData );
			};
			item.click = item.onClick;

			if ( item.command ) {
				editor.getCommand( item.command ).on( 'state', function() {
					var activeCommand = getLastActiveCommands( editor, allItems ), activeButton;
					if ( activeCommand ) {
						activeButton = properties.buttons[ activeCommand.id ];
					}

					if ( !properties.buttons[ defaultButton.id ]._.id ) {
						// Button without id isn't in DOM tree, eg. when it is in balloon toolbar which didn't show yet.
						// So don't update anything.
						return;
					}
					if ( previousButton ) {
						previousButton.hide();
					}

					if ( activeButton ) {
						defaultButton.hide();
						activeButton.show();
						previousButton = activeButton;
					} else {
						defaultButton.show();
						previousButton = defaultButton;
					}
				} );
			}

			properties.items[ item.id ] = item;
			properties.buttons[ item.id ] = new CKEDITOR.ui.button( CKEDITOR.tools.extend( {
				click: item.onClick, label: definition.label + ' ' + item.label
			}, item ) );

			editor.addFeature( properties.buttons[ item.id ] );

			// If no default button was defined then first button will act as default.
			if ( !defaultButton && !definition[ 'default' ] ) {
				defaultButton = properties.buttons[ item.id ];
			} else if ( definition[ 'default' ] && definition[ 'default' ].toLowerCase() === item.name ) {
				defaultButton = properties.buttons[ item.id ];
			} else {
				properties.buttons[ item.id ].hide();
			}
		}
		return properties;
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
				 * @since 4.11.0
				 * @constructor
				 * @param {Object} definition The Split Button definition
				 * @param {Object[]/String[]} definition.items An array of Split Button dropdown items
				 * @param {Object/String} [definition.face] Item which will be Split Button face
				 * @param {String} [definition.default] Item which will be Split Button face when there is no face defined and none of items is currently active
				 */
				$: function( definition ) {
					var properties = createButtons( editor, definition, this ),
						onMenu,
						context;

					if ( !definition.onMenu ) {
						definition.onMenu = function() {
							var activeItems = {};
							for ( var i in properties.items ) {
								activeItems[ i ] = ( editor.getCommand( properties.items[ i ].command ).state === CKEDITOR.TRISTATE_ON ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
							}
							return activeItems;
						};
					} else {
						onMenu = definition.onMenu;
						context = this;
						definition.onMenu = function() {
							return onMenu.apply( context, arguments );
						};
					}

					this.base( definition );
					this.icon = false;

					this.items = properties.items;
					this.buttons = properties.buttons;

					if ( properties.face ) {
						this.face = properties.face;
					}

					this.offsetParent = function() {
						return this.rendered && this.rendered[ 0 ] && CKEDITOR.document.getById( this.rendered[ 0 ].id ).getParent();
					};

					definition.toolbar += 1;
					var counter = 0;
					for ( var j in properties.groups ) {
						editor.addMenuGroup( j, counter++ );
					}

					editor.addMenuItems( this.items );
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

				this.rendered = [];

				if ( this.face ) {
					this.rendered.push( this.face.render( editor, output ) );
				} else {
					for ( var key in this.buttons ) {
						this.rendered.push( this.buttons[ key ].render( editor, output ) );
					}
				}

				var splitButton = CKEDITOR.ui.button.prototype.render.call( this, editor, output );
				output.push( '</span>' );
				return splitButton;
			};
			editor.ui.addHandler( CKEDITOR.UI_SPLITBUTTON, CKEDITOR.ui.splitButton.handler );
		}
	} );

	/**
	 * Split Button UI element.
	 *
	 * @readonly
	 * @property {String} [='splitbutton']
	 * @member CKEDITOR
	 */

	CKEDITOR.UI_SPLITBUTTON = 'splitbutton';

} )();
