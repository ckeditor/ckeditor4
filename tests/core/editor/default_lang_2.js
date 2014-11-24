/* bender-tags: editor,unit */

// editor language detect will need a standalone clean suite.
bender.test( {
	// #4219
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