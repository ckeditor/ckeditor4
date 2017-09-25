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
		regexResizerHtml = /class="cke_image_resizer"/g,
		tests = {

		'test disabled image resizer': function( editor, bot ) {
			bot.setData( widgetHtml, function() {
				assert.isNull( editor.editable().getHtml().match( regexResizerHtml ) );
			} );
		},

		'test image2_disableResizer disabled': function( editor, bot ) {
			editor.config.image2_disableResizer = true;

			bot.setData( widgetHtml, function() {
				assert.isNull( editor.editable().getHtml().match( regexResizerHtml ) );
			} );
		},

		'test image2_disableResizer enabled': function( editor, bot ) {
			editor.config.image2_disableResizer = false;

			bot.setData( widgetHtml, function() {
				assert.isNull( editor.editable().getHtml().match( regexResizerHtml ) );
			} );
		},

		'test readOnly disabled': function( editor, bot ) {
			editor.config.readOnly = false;

			bot.setData( widgetHtml, function() {
				assert.isNull( editor.editable().getHtml().match( regexResizerHtml ) );
			} );
		},

		'test readOnly enabled': function( editor, bot ) {
			editor.config.readOnly = true;

			bot.setData( widgetHtml, function() {
				assert.isNull( editor.editable().getHtml().match( regexResizerHtml ) );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
