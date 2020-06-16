/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2 */

( function() {
	'use strict';

	bender.test( {
		init: function() {
			var css = CKEDITOR.getCss();
			css = css.replace( '.cke_widget_wrapper:hover .cke_image_resizer', '.cke_widget_wrapper.hover .cke_image_resizer' );
			CKEDITOR.addCss( css );
		},

		// #719, #2874
		'test resizer creation without readOnly': testResizerPresence( { name: 'editor1' } ),

		// #719, #2874
		'test resizer creation with readOnly at initialization': testResizerPresence( { name: 'editor2', config: { readOnly: true } } ),

		// #719, #2874
		'test resizer creation with readOnly after initialization': testResizerPresence( { name: 'editor3' }, true ),

		// #719, #2816
		'test hovering in read-only': function() {
			bender.editorBot.create( { name: 'editor4', config: { readOnly: true } } , function( bot ) {
				var editor = bot.editor;
				editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
					resume( function() {
						var wrapper = editor.editable().findOne( '.cke_widget_wrapper' ),
							resizer = wrapper.findOne( '.cke_image_resizer' );

						wrapper.addClass( 'hover' );
						assert.isTrue( !resizer.isVisible() );
					} );
				} );
				wait();
			} );
		},

		// #719, #2816
		'test hovering without read-only': function() {
			bender.editorBot.create( { name: 'editor5', config: { readOnly: false } } , function( bot ) {
				var editor = bot.editor;
				editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
					resume( function() {
						var wrapper = editor.editable().findOne( '.cke_widget_wrapper' ),
							resizer = editor.editable().findOne( '.cke_widget_image .cke_image_resizer' );
						wrapper.addClass( 'hover' );
						assert.isTrue( resizer.isVisible() );
					} );
				} );
				wait();
			} );
		}
	} );
}() );

function testResizerPresence( profile, readOnly ) {
	return function() {
		bender.editorBot.create( profile, function( bot ) {
			var editor = bot.editor;

			editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
				resume( function() {
					if ( readOnly ) {
						editor.setReadOnly( readOnly );
					}
					assert.isNotNull( editor.editable().findOne( '.cke_widget_image .cke_image_resizer' ), 'Resizer should be created'  );
				} );
			} );
			wait();
		} );
	};
}
