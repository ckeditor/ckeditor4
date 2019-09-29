/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		'test promise implementation is loaded': function() {
			var iframe = document.createElement( 'iframe' );

			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) {
				iframe.onreadystatechange = function() {
					if ( iframe.contentDocument.readyState !== 'complete' ) {
						return;
					}

					callback();
				};
			} else {
				iframe.onload = callback;
			}

			iframe.src = '%BASE_PATH%core/tools/_assets/amdtest.html';
			document.body.appendChild( iframe );
			wait();

			function callback() {
				resume( function() {
					wait( function() {
						assert.isNotUndefined( iframe.contentWindow.CKEDITOR.tools.promise );
					}, 500 );
				} );
			}
		}
	} );
} )();
