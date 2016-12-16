/* bender-tags: editor,unit */

( function() {
	'use strict';

	// We're gonna do that later, manually.
	CKEDITOR.disableAutoInline = true;

	bender.test( {
		'inline duplicates': function() {
			var fail = false;

			CKEDITOR.inlineAll();

			try {
				CKEDITOR.inline( 'editable' );
				fail = true;
			} catch ( e ) {}

			assert.isFalse( fail, 'Expected error not thrown.' );
		},

		'themedui duplicates': function() {
			var fail = false;

			CKEDITOR.replace( 'editor' );

			try {
				CKEDITOR.replace( 'editor' );
				fail = true;
			} catch ( e ) {}

			assert.isFalse( fail, 'Expected error not thrown.' );
		}
	} );

} )();