/* bender-tags: editor */
/* bender-include: %BASE_PATH%/plugins/uploadfile/_helpers/waitForImage.js */
/* global waitForImage */

'use strict';

bender.test( {
	// (#2714)
	'test waitForImage when image is loaded': function() {
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var called = false,
			imageMock = {
				$: { complete: true }
			};

		setTimeout( function() {
			resume( function() {
				assert.isTrue( called, 'waitForImage callback called' );
			} );
		}, 100 );

		waitForImage( imageMock, function() {
			called = true;
			wait();
		} );
	}
} );
