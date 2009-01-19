/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview API initialization code.
 */

// Load core plugins.
CKEDITOR.plugins.load( CKEDITOR.config.corePlugins.split( ',' ), function() {
	CKEDITOR.status = 'loaded';
	CKEDITOR.fire( 'loaded' );

	// Process all instances created by the "basic" implementation.
	var pending = CKEDITOR._.pending;
	if ( pending ) {
		delete CKEDITOR._.pending;

		for ( var i = 0; i < pending.length; i++ )
			CKEDITOR.add( pending[ i ] );
	}
});

/*
TODO: Enable the following and check if effective.

if ( CKEDITOR.env.ie )
{
	// Remove IE mouse flickering on IE6 because of background images.
	try
	{
		document.execCommand( 'BackgroundImageCache', false, true );
	}
	catch (e)
	{
		// We have been reported about loading problems caused by the above
		// line. For safety, let's just ignore errors.
	}
}
*/
