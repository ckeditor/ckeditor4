/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2 */

( function() {
	'use strict';

	bender.test( {
		// #719, #2816, #2874
		'test readOnly set to false': createResizerTest( { name: 'editor1' } ),

		// #719, #2874
		'test readOnly set to true at initialization': createResizerTest( { name: 'editor2', config: { readOnly: true } } ),

		// #719, #2816
		'test readOnly set to true after initialization': createResizerTest( { name: 'editor3' }, true )

	} );
}() );

function createResizerTest( profile, readOnly ) {
	return function() {
		bender.editorBot.create( profile, function( bot ) {
			var editor = bot.editor;

			editor.setData( '<img src="_assets/foo.png" alt="" />', function() {
				resume( function() {
					if ( readOnly ) {
						editor.setReadOnly( readOnly );
					}
					var resizer = editor.editable().findOne( '.cke_widget_image .cke_image_resizer' );
					assert.isTrue( Boolean( resizer ), 'Resizer should be enabled'  );
				} );
			} );

			wait();
		} );
	};
}
