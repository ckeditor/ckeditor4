/* global assertWordFilter,Q */
/* bender-include: _helpers/pfwTools.js */
/* exported createTestCase */

// @param {boolean} [compareRawData=false] If `true` test case will assert against raw paste's `data.dataValue` rather than
// what will appear in the editor after all transformations and filtering.
function createTestCase( fixtureName, wordVersion, browser, tickets, compareRawData, customFilters ) {
	return function() {
		var inputPath = [ tickets ? '_fixtures/Tickets' : '_fixtures', fixtureName, wordVersion, browser ].join( '/' ) + '.html',
			outputPath = [ tickets ? '_fixtures/Tickets' : '_fixtures', fixtureName, '/expected.html' ].join( '/' ),
			specialCasePath = [ tickets ? '_fixtures/Tickets' : '_fixtures', fixtureName, wordVersion, 'expected_' + browser ].join( '/' ) + '.html',
			deCasher = '?' + Math.random().toString( 36 ).replace( /^../, '' ), // Used to trick the browser into not caching the html files.
			editor = this.editor,
			load = function( path ) {
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
			var inputFixture = values[ 0 ],
				// If browser-customized expected result was found, use it. Otherwise go with the regular expected.
				expectedValue = values[ 2 ] !== null ? values[ 2 ] : values[ 1 ];

			if ( inputFixture === null ) {
				// null means that fixture file was not found - skipping test.

				resume( function() {
					assert.ignore();
				} );
				return;
			}

			var nbspListener = editor.once( 'paste', function( evt ) {
				// Clipboard strips white spaces from pasted content if those are not encoded.
				// This is **needed only for non-IE/Edge fixtures**, as these browsers doesn't encode nbsp char on
				// it's own.
				if ( CKEDITOR.env.ie &&
					CKEDITOR.tools.array.indexOf( [ 'chrome', 'firefox', 'safari' ], browser ) !== -1 ) {
					evt.data.dataValue = evt.data.dataValue.replace( / /g, '&nbsp;' );
				}
			}, null, null, 5 );

			assert.isNotNull( expectedValue, '"expected.html" missing.' );

			assertWordFilter( editor, compareRawData )( inputFixture, expectedValue )
				.then( function( values ) {
					resume( function() {
						nbspListener.removeListener();

						assert.beautified.html( values[ 0 ], values[ 1 ], {
							fixStyles: true,
							sortAttributes: true,
							customFilters: customFilters
						} );
					} );
				}, function( err ) {
					if ( console && console.error ) {
						console.error( 'err', err );
					}
				} );
		} );


		wait();
	};
}
