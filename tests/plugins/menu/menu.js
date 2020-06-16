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

		// (#2858)
		'test right-clicking menu items': function() {
			if ( !CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var bot = this.editorBot;

			bot.menu( 'custom_menubutton', function( menu ) {
				var item = menu._.element.findOne( 'a' ),
					spy = sinon.spy( menu._, 'onClick' );

				bender.tools.dispatchMouseEvent( item, 'mouseup', CKEDITOR.MOUSE_BUTTON_RIGHT );
				spy.restore();
				menu.hide();
				assert.areSame( 0, spy.callCount, 'item command was not fired' );
			} );
		},

		// (#3413)
		'test context menu with item containing double quotes': function() {
			var label = 'Custom "Item" Foo<suggestion>Bar<suggestion>';

			bender.editorBot.create( {
				name: 'editor_quotes-contextmenu',
				config: {
					plugins: 'wysiwygarea,contextmenu',
					on: {
						pluginsLoaded: function( evt ) {
							var editor = evt.editor;

							editor.addMenuGroup( 'testGroup' );
							editor.addMenuItem( 'test', {
								label: label,
								group: 'testGroup',
								order: 0
							} );

							editor.contextMenu.addListener( function() {
								return {
									test: CKEDITOR.TRISTATE_OFF
								};
							} );
						}
					}
				}
			}, function( bot ) {
				bot.contextmenu( function( menu ) {
					assertMenuItemAttrs( menu, label );
				} );
			} );
		},

		// (#3413)
		'test menubutton with item containing double quotes': function() {
			var label = 'Custom "Item" Foo<suggestion>Bar<suggestion>';

			bender.editorBot.create( {
				name: 'editor_quotes-menubutton',
				config: {
					plugins: 'wysiwygarea,toolbar,menubutton',
					toolbar: [ [ 'Menubutton' ] ],
					on: {
						pluginsLoaded: function( evt ) {
							var editor = evt.editor;

							editor.addMenuGroup( 'testGroup' );
							editor.addMenuItem( 'test', {
								label: label,
								group: 'testGroup',
								order: 0
							} );

							editor.ui.add( 'Menubutton', CKEDITOR.UI_MENUBUTTON, {
								label: 'Menu button',
								onMenu: function() {
									return {
										test: CKEDITOR.TRISTATE_OFF
									};
								}
							} );
						}
					}
				}
			}, function( bot ) {
				bot.menu( 'Menubutton', function( menu ) {
					assertMenuItemAttrs( menu, label );
				} );
			} );
		}
	} );
} )();

function assertMenuItemAttrs( menu, label ) {
	var html = [],
		encoded = CKEDITOR.tools.htmlEncodeAttr( label ),
		ariaLabelRegex = new RegExp( 'aria-label="' + encoded + '"' ),
		titleRegex = new RegExp( 'title="' + encoded + '"' ),
		hrefRegex = new RegExp( 'href="javascript:void\\(\'' + encoded + '\'\\)"' );

	menu.items[ 0 ].render( menu, 0, html );

	assert.isMatching( ariaLabelRegex, html[ 0 ] );
	assert.isMatching( titleRegex, html[ 0 ] );
	assert.isMatching( hrefRegex, html[ 0 ] );
}
