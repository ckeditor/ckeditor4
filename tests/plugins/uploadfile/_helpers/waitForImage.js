/* exported waitForImage */

function waitForImage( image, callback ) {
	// IE needs to wait for image to be loaded so it can read width and height of the image.
	if ( CKEDITOR.env.ie ) {
		wait( callback, 100 );
	} else {
		image.on( 'load', function() {
			resume( callback );
		} );
		wait();
	}
}
