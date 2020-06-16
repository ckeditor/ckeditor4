/* exported waitForImage */

function waitForImage( image, callback ) {
	// IE needs to wait for image to be loaded so it can read width and height of the image.
	if ( CKEDITOR.env.ie ) {
		wait( callback, 100 );
		return;
	}

	if ( image.$.complete ) {
		setTimeout( function() {
			resume( callback );
		} );
	} else {
		image.once( 'load', function() {
			resume( callback );
		} );
	}
	wait();
}
