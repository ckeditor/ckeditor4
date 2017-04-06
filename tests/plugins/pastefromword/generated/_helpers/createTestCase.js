/* global assertWordFilter,Q,console */
/* exported createTestCase */

/**
 * Creates a single test case based on the options provided. It uses files located in `../_fixtures/` directory to build
 * a proper assertions. The input file should be located in `../fixtures/options.name/options.wordVersion/options.browser.html`,
 * and the expected output in `../_fixtures/options.name/expected.html`. If the expected output is different for the given
 * browser (`options.browser`) than in the most cases the separate file can be used - it should be located
 * under `../_fixtures/options.name/options.wordVersion/expected_options.browser.html`.
 *
 * @param {Object} options
 * @param {String} options.name Fixture name.
 * @param {String} options.wordVersion Fixture word version.
 * @param {String} options.browser Browser name.
 * @param {Boolean} [options.compareRawData=false] If `true` test case will assert against raw paste's `data.dataValue` rather than
 * what will appear in the editor after all transformations and filtering.
 * @param {Array} [options.customFilters] Array of custom filters (like [ pfwTools.filters.font ]) which will be used during assertions.
 * @returns {Function}
 */
function createTestCase( options ) {
	return function() {
		var inputPath = [ '_fixtures', options.name, options.wordVersion, options.browser ].join( '/' ) + '.html',
			outputPath = [ '_fixtures', options.name, '/expected.html' ].join( '/' ),
			specialCasePath = [ '_fixtures', options.name, options.wordVersion, 'expected_' + options.browser ].join( '/' ) + '.html',
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

			// null means that fixture file was not found - skipping test.
			if ( inputFixture === null ) {
				resume( function() {
					assert.ignore();
				} );
				return;
			}

			var nbspListener = editor.once( 'paste', function( evt ) {
				// Clipboard strips white spaces from pasted content if those are not encoded.
				// This is **needed only for non-IE/Edge fixtures**, as these browsers doesn't encode nbsp char on it's own.
				if ( CKEDITOR.env.ie && CKEDITOR.tools.array.indexOf( [ 'chrome', 'firefox', 'safari' ], options.browser ) !== -1 ) {
					var encodedData;
					/* jshint ignore:start */
					encodedData = evt.data.dataValue.replace( / /g, '&nbsp;' );
					/* jshint ignore:end */
					evt.data.dataValue = encodedData;
				}
			}, null, null, 5 );

			assert.isNotNull( expectedValue, '"expected.html" missing.' );

			assertWordFilter( editor, options.compareRawData )( inputFixture, expectedValue )
				.then( function( values ) {
					resume( function() {
						nbspListener.removeListener();

						assert.beautified.html( values[ 0 ], values[ 1 ], {
							fixStyles: true,
							sortAttributes: true,
							customFilters: options.customFilters
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
