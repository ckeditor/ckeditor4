/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: preview */

bender.editor = {
	startupData: '<p>Foo</p>'
};

bender.test( {
	'test processing of data on contentPreview': function() {
		var tc = this,
			editor = tc.editor;

		editor.once( 'contentPreview', function( event ) {
			event.data.dataValue = event.data.dataValue.replace( 'Foo', 'Bar' );
		}, null, null, 1 );

		editor.once( 'contentPreview', function( event ) {
			tc.resume( function() {
				assert.isArray( event.data.dataValue.match( '<p>Bar</p>' ), 'Content has been altered.' );
			} );

			event.cancel();	// Don't open preview window.
		}, null, null, 2 );

		editor.execCommand( 'preview' );

		tc.wait();
	}
} );