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

		var callback = sinon.spy(),
			imageMock = {
				$: { complete: true }
			};

		waitForImage( imageMock, callback );

		assert.isTrue( callback.called );
	}
} );
