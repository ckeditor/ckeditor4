/* bender-tags: editor */

// editor language detect will need a standalone clean suite.
bender.test( {
	// https://dev.ckeditor.com/ticket/4219
	'test fallback to use default language': function() {
		var tc = this;
		var editor = new CKEDITOR.editor( {
			language: 'unknown',
			defaultLanguage: 'fr'
		} );

		editor.on( 'loaded', function( evt ) {
			evt.removeListener();
			tc.resume( function() {
				assert.areSame( 'fr', editor.langCode );
			} );
		} );
		tc.wait();
	}
} );
