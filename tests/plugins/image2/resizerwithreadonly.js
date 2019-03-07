/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2,toolbar */

( function() {
	'use strict';

	bender.test( {
		// #719, #2816, #2874
		'test readOnly set to false': function() {
			bender.editorBot.create( {
				name: 'editor1'
			}, function( bot ) {
				var editor = bot.editor;

				editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
					resume( function() {
						var resizer = editor.editable().findOne( '.cke_widget_image .cke_image_resizer' );
						assert.isTrue( Boolean( resizer ), 'Resizer should be enabled'  );
					} );
				} );

				wait();
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
				var editor = bot.editor;

				editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
					resume( function() {
						var resizer = editor.editable().findOne( '.cke_widget_image .cke_image_resizer' );
						assert.isTrue( Boolean( resizer ), 'Resizer should be enabled'  );
					} );
				} );

				wait();
			} );
		},

		// #719, #2816
		'test readOnly set to true after initialization': function() {
			bender.editorBot.create( {
				name: 'editor3'
			}, function( bot ) {
				var editor = bot.editor;

				editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
					resume( function() {
						editor.setReadOnly( true );
						var resizer = editor.editable().findOne( '.cke_widget_image .cke_image_resizer' );
						assert.isTrue( Boolean( resizer ), 'Resizer should be enabled'  );
					} );
				} );

				wait();
			} );
		}
	} );
}() );
