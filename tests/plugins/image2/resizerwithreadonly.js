/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2,toolbar */

( function() {
	'use strict';

	bender.test( {
		// #719, #2816, #2874
		'test readOnly set to false': function() {
			bender.editorBot.create( {
				name: 'editor1',
				config: {
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor;

				bot.dialog( 'image', function( dialog ) {
					dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
					dialog.getButton( 'ok' ).click();

					assert.sameData(
						'cke_image_resizer',
						editor.editable().getElementsByTag( 'span' ).$[ 2 ].outerHTML.match( /(cke_image_resizer)/g )[ 0 ]
					);
				} );
			} );
		},

		// #719, #2874
		'test readOnly set to true at initialization': function() {
			bender.editorBot.create( {
				name: 'editor2',
				config: {
					readOnly: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					listener;

				listener = editor.on( 'dataReady', function() {
					listener.removeListener();

					resume( function() {
						assert.areSame( 3, editor.editable().getElementsByTag( 'span' ).$.length );
					} );
				} );

				editor.setData( '<img src="_assets/foo.png" alt="" />' );
				wait();
			} );
		},

		// #719, #2816
		'test readOnly set to true after initialization': function() {
			bender.editorBot.create( {
				name: 'editor3',
				config: {
					readOnly: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					listener;

				listener = editor.on( 'dataReady', function() {
					listener.removeListener();

					resume( function() {
						assert.areSame( 3, editor.editable().getElementsByTag( 'span' ).$.length );
					} );
				} );

				editor.setData( '<img src="_assets/foo.png" alt="" />' );
				wait();
			} );
		}		
	} );
}() );
