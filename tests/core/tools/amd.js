/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		'test promise implementation is loaded': function() {
			var iframe = document.createElement( 'iframe' );

			setTimeout( function() {
				resume( function() {
					assert.isNotUndefined( iframe.contentWindow.CKEDITOR.tools.promise );
				} );
			}, 500 );

			iframe.src = '%BASE_PATH%core/tools/_assets/amdtest.html';
			document.body.appendChild( iframe );
			wait();
		}
	} );
} )();
