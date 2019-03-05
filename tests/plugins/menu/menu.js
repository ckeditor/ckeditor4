/* bender-tags: editor */
/* bender-ckeditor-plugins: menubutton,toolbar */

( function() {
	'use strict';

	var customCls = 'my_menu';

	bender.editor = {
		config: {
			toolbar: [ [ 'custom_menubutton' ] ],
			on: {
				pluginsLoaded: function( evt ) {
					var ed = evt.editor;
					ed.ui.add( 'custom_menubutton', CKEDITOR.UI_MENUBUTTON, {
						className: customCls,
						onRender: function() {},
						onMenu: function() {
							return {
								custom_menuitem: CKEDITOR.TRISTATE_OFF
							};
						}
					} );

					ed.addMenuGroup( 'custom_group', 100 );
					ed.addMenuItem( 'custom_menuitem', {
						label: 'My Custom Menu Item',
						className: customCls,
						group: 'custom_group'
					} );
				}
			}
		}
	};

	bender.test( {
		'test menu item class names': function() {
			this.editorBot.menu( 'custom_menubutton', function( menu ) {
				var panelDoc = menu._.panel._.iframe.getFrameDocument();
				var menuItemEl = panelDoc.getById( menu.id + 0 );
				menu.hide();

				assert.isTrue( menuItemEl.hasClass( 'cke_menubutton' ), 'check ui type class name' );
				assert.isTrue( menuItemEl.hasClass( 'cke_menubutton__custom_menuitem' ), 'check named ui type class name' );
				assert.isTrue( menuItemEl.hasClass( customCls ), 'check ui item custom class name' );
			} );
		},

		// (#2307)
		'test menu events': function() {
			var menu = this.editorBot.editor.ui.get( 'custom_menubutton' ).getMenu(),
				spy = sinon.spy();

			menu.once( 'show', spy );
			this.editorBot.menu( 'custom_menubutton', function( menu ) {
				assert.isTrue( spy.called );
				spy.reset();

				menu.once( 'hide', spy );
				menu.hide();

				assert.isTrue( spy.called );
			} );
		}
	} );
} )();
