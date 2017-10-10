/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar */

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
		'test disabled image resizer': function( editor, bot ) {
			bot.setData( widgetHtml, function() {
				assert.isNull( editor.editable().findOne( '[class=cke_image_resizer]' ) );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
