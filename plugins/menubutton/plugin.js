/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'menubutton', {
	requires: 'button,menu',
	onLoad: function() {
		var clickFn = function( editor ) {
				var _ = this._,
					menu = _.menu;

				// Do nothing if this button is disabled.
				if ( _.state === CKEDITOR.TRISTATE_DISABLED )
					return;

				if ( _.on && menu ) {
					menu.hide();
					return;
				}

				_.previousState = _.state;

				// If menu couldn't be created by constructor create it now (#2307).
				if ( !menu ) {
					menu = createMenu( editor, this );
				}

				this.setState( CKEDITOR.TRISTATE_ON );
				_.on = 1;

				// This timeout is needed to give time for the panel get focus
				// when JAWS is running. (https://dev.ckeditor.com/ticket/9842)
				setTimeout( function() {
					menu.show( CKEDITOR.document.getById( _.id ), 4 );
				}, 0 );
			};

		/**
		 * @class
		 * @extends CKEDITOR.ui.button
		 * @todo
		 */
		CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass( {
			base: CKEDITOR.ui.button,

			/**
			 * Creates a menuButton class instance.
			 *
			 * @constructor
			 * @param Object definition
			 * @param CKEITOR.editor [editor] Parent editor of this menuButton.
			 * @todo
			 */
			$: function( definition, editor ) {
				// We don't want the panel definition in this object.
				delete definition.panel;

				this.base( definition );

				this.hasArrow = 'menu';

				this.click = clickFn;

				// Because of backward compatibility editor param is optional, without it we can't create menu yet (#2307).
				if ( editor ) {
					this._.menu = createMenu( editor, this );
				}
			},

			statics: {
				handler: {
					create: function( definition ) {
						return new CKEDITOR.ui.menuButton( definition, this.editor );
					}
				}
			},

			proto: {
				/**
				 * If menu was initialized returns it, otherwise returns null.
				 *
				 * @since: 4.12.0
				 * @returns {CKEDITOR.menu/null}
				 */
				getMenu: function() {
					return this._.menu || null;
				}
			}
		} );

		function createMenu( editor, menuButton ) {
			var menu = new CKEDITOR.menu( editor, {
				panel: {
					className: 'cke_menu_panel',
					attributes: { 'aria-label': editor.lang.common.options }
				}
			} );

			menu.onHide = CKEDITOR.tools.bind( function() {
				var modes = menuButton.command ? editor.getCommand( this.command ).modes : this.modes;
				this.setState( !modes || modes[ editor.mode ] ? this._.previousState : CKEDITOR.TRISTATE_DISABLED );
				this._.on = 0;
			}, menuButton );

			// Initialize the menu items at this point.
			if ( menuButton.onMenu ) {
				menu.addListener( menuButton.onMenu );
			}

			return menu;
		}
	},
	beforeInit: function( editor ) {
		editor.ui.addHandler( CKEDITOR.UI_MENUBUTTON, CKEDITOR.ui.menuButton.handler );
	}
} );

/**
 * Button UI element.
 *
 * @readonly
 * @property {String} [='menubutton']
 * @member CKEDITOR
 */
CKEDITOR.UI_MENUBUTTON = 'menubutton';
