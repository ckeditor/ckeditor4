/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar, link */

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



	var widgetHtml = '<figure class="image easyimage"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>',
		tests = {
			tearDown: function() {
				var currentDialog = CKEDITOR.dialog.getCurrent();

				if ( currentDialog ) {
					currentDialog.hide();
				}
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
