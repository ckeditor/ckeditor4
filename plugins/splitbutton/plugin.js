/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
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
					button = this,
					defaultIcon,
					items = {},
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

					if ( item[ 'default' ] ) {
						defaultIcon = item.icon;
					}

					if ( !item.id ) {
						item.id = item.command + item.order;
					}

					item.role = 'menuitemcheckbox';

					item.onClick = function() {
						editor.execCommand( this.command );
					};

					editor.getCommand( item.command ).on( 'state', ( function() {
						var currentItem = item;
						return function() {
							var activeItem = getLastActiveCommands( allItems, currentItem ),
								buttonEl = CKEDITOR.document.getById( button._.id ).findOne( '.cke_button_icon' );
							if ( buttonEl ) {
								if ( activeItem ) {
									buttonEl.setAttribute( 'style', CKEDITOR.skin.getIconStyle( activeItem.icon, ( editor.lang.dir == 'rtl' ) ) );
								} else {
									buttonEl.setAttribute( 'style', CKEDITOR.skin.getIconStyle( defaultIcon, ( editor.lang.dir == 'rtl' ) ) );
								}
							}
						};
					} )() );

					items[ item.id ] = item;
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

				if ( !definition.icon && defaultIcon ) {
					definition.icon = defaultIcon;
				}

				this.base( definition );

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
