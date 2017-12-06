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
			$: function( definition, items ) {
				var groups = {},
					button = this,
					defaultIcon,
					activeItem = null,
					item;

				for ( var i in items ) {
					item = items[ i ];

					if ( !item.group ) {
						item.group = 'default';
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
							if ( this.state === CKEDITOR.TRISTATE_ON ) {
								var buttonEl = CKEDITOR.document.getById( button._.id ).findOne( '.cke_button_icon' );
								if ( buttonEl ) {
									activeItem = currentItem;
									buttonEl.setAttribute( 'style', CKEDITOR.skin.getIconStyle( currentItem.icon, ( editor.lang.dir == 'rtl' ) ) );
								}
							}
						};
					} )() );
				}

				if ( !definition.onMenu ) {
					definition.onMenu = function() {
						var activeItems = {};
						for ( var i in items ) {
							activeItems[ i ] = ( activeItem && items[ i ].id === activeItem.id ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
						}

						return activeItems;
					};
				}

				if ( !definition.icon && defaultIcon ) {
					definition.icon = defaultIcon;
				}

				editor.addCommand( definition.label + '_group', {} );


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
