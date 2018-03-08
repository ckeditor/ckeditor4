/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

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
			 * Creates a menuButton class instance.
			 *
			 * @constructor
			 * @param Object definition
			 */
			$: function( definition, allItems ) {

				var groups = {},
					previousButton,
					defaultButton,
					items = {},
					buttons = {},
					item;

				function getLastActiveCommands( allItems ) {
					var activeItem = null;
					for ( var i in allItems ) {
						if ( editor.getCommand( allItems[ i ].command ).state === CKEDITOR.TRISTATE_ON ) {
							activeItem = allItems[ i ];
						}
					}
					return activeItem;
				}
				// Items are required to only have label and command.
				// Group is optional. If not assigned 'default' group is added.
				// If item has `default=true` property, its icon is used as default splitbutton icon.
				// Item id is generated automatically for internal purposes.
				// Item role is automatically set to 'menuitemcheckbox'.
				// Item onClick method is automatically added, it calls item.command on click.
				// On 'state' listener is automatically added, so splitbutton icon is updated when command is called
				// or selection changes (which causes commands to refresh so they fire state event).
				for ( var i in allItems ) {
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

					editor.getCommand( item.command ).on( 'state',
						// (
						// 	function() {
						// return
								function() {
							var activeButton = getLastActiveCommands( allItems, item ),
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
						}
					// } )()
					);

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

				// TODO add allowedContent and requiredContent from each command to ACF manually.
				// TODO there might be problem with refresh so split button should manually refresh commands.
				// TODO See #678.
				// // Registers command.
				// editor.addCommand( 'justifysplit', {
				// 	contextSensitive: true,
				// 	refresh: function( editor, path ) {
				// 		for ( var prop in items ) {
				// 			editor.getCommand( 'justifyright' ).refresh( editor, path );
				// 		}
				// 	}
				// } );

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
				this.noicon = true;

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
