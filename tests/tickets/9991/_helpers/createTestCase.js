/* global assertWordFilter,Q */
/* exported createTestCase */
function createTestCase( fixtureName, wordVersion, browser, tickets ) {
	return function() {
		var inputPath = [ tickets ? '_fixtures/Tickets' : '_fixtures' , fixtureName, wordVersion, browser ].join( '/' ) + '.html',
			outputPath = [ tickets ? '_fixtures/Tickets' : '_fixtures' , fixtureName, '/expected.html' ].join( '/' ),
			specialCasePath = [ tickets ? '_fixtures/Tickets' : '_fixtures', fixtureName, wordVersion, 'expected_' + browser ].join( '/' ) + '.html',
			deCasher = '?' + Math.random().toString( 36 ).replace( /^../, '' ); // Used to trick the browser into not caching the html files.

		bender.editorBot.create( {
			name: [ fixtureName, wordVersion, browser ].join( ' ' ),
			config: {
				//pasteFromWordCleanupFile: 'plugins/pastefromword/filter/legacy.js'
			}
		}, function( bot ) {

			var load = function( path ) {
				assert.isObject( CKEDITOR.ajax, 'Ajax plugin is required' );

				var deferred = Q.defer();

				CKEDITOR.ajax.load( path, function( data ) {
					deferred.resolve( data );
				} );

				return deferred.promise;
			};

			Q.all( [
				load( inputPath + deCasher ),
				load( outputPath + deCasher ),
				load( specialCasePath + deCasher )
			] ).done( function( values ) {
				// null means file not found - skipping test.
				if ( values[ 0 ] === null ) {
					resume( function() {
						bot.editor.destroy();
						assert.ignore();
					} );
					return;
				}

				if ( values[ 2 ] !== null ) {
					assertWordFilter( bot.editor )( values[ 0 ], values[ 2 ] )
						.then( function( values ) {
							resume( function() {
								assert.areSame( values[ 0 ], values[ 1 ] );
							} );
						} );
				} else {
					assert.isNotNull( values[ 1 ], '"expected.html" missing.' );

					assertWordFilter( bot.editor )( values[ 0 ], values[ 1 ] )
						.then( function( values ) {
							resume( function() {
								assert.areSame( values[ 0 ], values[ 1 ] );
							} );
						} );
				}
			} );

			wait();
		} );
	};
}
