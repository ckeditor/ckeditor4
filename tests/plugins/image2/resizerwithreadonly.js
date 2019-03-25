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
		'test resizer creation without readOnly': testResizerVisibility( { name: 'editor1' } ),

		// #719, #2874
		'test resizer creation with readOnly at initialization': testResizerVisibility( { name: 'editor2', config: { readOnly: true } } ),

		// #719, #2874
		'test resizer creation with readOnly after initialization': testResizerVisibility( { name: 'editor3' }, true ),

		// #719, #2816
		'test hovering in read-only': function() {
			bender.editorBot.create( { name: 'editor4', config: { readOnly: true } } , function( bot ) {
				var editor = bot.editor;
				editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
					resume( function() {
						var wrapper = editor.editable().findOne( '.cke_widget_wrapper' ),
							resizer = editor.editable().findOne( '.cke_widget_image .cke_image_resizer' );
						wrapper.addClass( 'hover' );
						assert.isTrue( Boolean( !resizer.isVisible() ) );
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
						assert.isTrue( Boolean( resizer.isVisible() ) );
					} );
				} );
				wait();
			} );
		}
	} );
}() );

function testResizerVisibility( profile, readOnly ) {
	return function() {
		bender.editorBot.create( profile, function( bot ) {
			var editor = bot.editor;

			editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
				resume( function() {
					if ( readOnly ) {
						editor.setReadOnly( readOnly );
					}
					var resizer = editor.editable().findOne( '.cke_widget_image .cke_image_resizer' );
					assert.isTrue( Boolean( resizer ), 'Resizer should be created'  );
				} );
			} );

			wait();
		} );
	};
}
