/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: imagebase,toolbar, link,contextmenu */

( function() {
	'use strict';

	bender.editors = {
		classic: {},

		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		},

		inline: {
			creator: 'inline'
		}
	};


	var widgetHtml = '<figure><img src="%BASE_PATH%_assets/logo.png"></figure>',
		tests = {
			tearDown: function() {
				var currentDialog = CKEDITOR.dialog.getCurrent();

				if ( currentDialog ) {
					currentDialog.hide();
				}
			},
			setUp: function() {
				var plugin = CKEDITOR.plugins.imagebase,
					editors = this.editors;
				CKEDITOR.tools.array.forEach( CKEDITOR.tools.objectKeys( editors ), function( editor ) {
					plugin.addImageWidget( editors[ editor ], 'testWidget', plugin.addFeature( editors[ editor ], 'link', {} ) );
				} );
			},

			'test link option in context menu': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

					widget.focus();
					editor.contextMenu.open( editor.editable() );
					var itemsExist = 0;
					for ( var i = 0; i < editor.contextMenu.items.length; ++i )
						if ( editor.contextMenu.items[ i ].command == 'link' )
							itemsExist += 1;

					editor.contextMenu.hide();

					assert.areSame( 1, itemsExist, 'there is one link item in context menu' );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
