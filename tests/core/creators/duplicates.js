/* bender-tags: editor */

( function() {
	'use strict';

	// We're gonna do that later, manually.
	CKEDITOR.disableAutoInline = true;

	bender.test( {
		'inline duplicates': function() {
			var fail = false;

			CKEDITOR.inlineAll();

			wait( function() {
				try {
					CKEDITOR.inline( 'editable' );
					fail = true;
				} catch ( e ) {}

				assert.isFalse( fail, 'Expected error not thrown.' );
			}, 100 );
		},

		'themedui duplicates': function() {
			var fail = false;

			CKEDITOR.replace( 'editor' );

			wait( function() {
				try {
					CKEDITOR.replace( 'editor' );
					fail = true;
				} catch ( e ) {}

				assert.isFalse( fail, 'Expected error not thrown.' );
			}, 100 );
		}
	} );

} )();
