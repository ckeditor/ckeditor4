( function() {
	'use strict';

	var ckTools = CKEDITOR.tools,
		arrayTools = ckTools.array,
		counter = 1;

	window.bender = {
		test: function( tests ) {
			var testKeys = arrayTools.filter( ckTools.objectKeys( tests ), function( key ) {
					return key.match( /^test/ );
				} ),
				i;

			if ( testKeys.length ) {

				if ( tests.setUp ) {
					tests.setUp();
				}

				describe( 'Test suite ' + counter, ( function( testIndex ) {
					return function() {
						for ( i = 0; i < testKeys.length; i++ ) {
							it( testKeys[ i ], ckTools.bind( tests[ testKeys[ i ] ], tests ) );
						}
					};
				} )( i ) );

				counter += 1;
			}
		}
	};
} )();