/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		'test image2 does not initialize on pasted fake object': function() {
			bender.editorBot.create( {
				name: 'test_image2_upcast',
				creator: 'inline',
				startupData: '<p><iframe frameborder="0" scrolling="no" src="error404"></iframe></p>',
				config: {
					plugins: 'toolbar,floatingspace,clipboard,image2,iframe'
				}
			}, function( bot ) {
				var editor = bot.editor,
					html = editor.editable().findOne( 'p' ).getHtml();

				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.on( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 0, CKEDITOR.tools.object.keys( editor.widgets.instances ).length );
						assert.areSame( '<p>x<iframe frameborder="0" scrolling="no" src="error404"></iframe>x</p>',
							bender.tools.compatHtml( editor.getData(), true, true ) );
					} );
				} );

				wait( function() {
					editor.execCommand( 'paste', html );
				} );
			} );
		},

		'test fakeobjects plugin registers ACF rules needed for its upcasted version': function() {
			bender.editorBot.create( {
				name: 'test_fakeobjects_acf',
				creator: 'inline',
				startupData: '<p><iframe frameborder="0" scrolling="no" src="error404"></iframe></p>',
				config: {
					plugins: 'toolbar,floatingspace,clipboard,iframe',
					pasteFilter: false
				}
			}, function( bot ) {
				var editor = bot.editor,
					html = editor.editable().findOne( 'p' ).getHtml();

				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.on( 'afterPaste', function() {
					resume( function() {
						var img = editor.editable().findOne( 'img' );

						assert.isNotNull( img, 'fakeobject image was not filtered out' );
						assert.isTrue( img.hasClass( 'cke_iframe' ), 'cke_iframe' );
						assert.isTrue( img.hasAttribute( 'src' ), 'src' );
						assert.isTrue( img.hasAttribute( 'data-cke-realelement' ), 'data-cke-realelement' );
						assert.areSame( '<p>xx</p>', editor.dataProcessor.toHtml( '<p>x<img src="x">x</p>' ),
							'check that fakeobjects does not allow plain images' );
					} );
				} );

				wait( function() {
					editor.execCommand( 'paste', html );
				} );
			} );
		}
	} );
} )();
