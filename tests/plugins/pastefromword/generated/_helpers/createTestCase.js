/* global assertWordFilter,console */
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
 * @param {Boolean} [options.includeRTF=false] Whether RTF clipboard should be loaded in test case.
 * @returns {Function}
 */
function createTestCase( options ) {
	return function() {
		var inputPath = [ '_fixtures', options.name, options.wordVersion, options.browser ].join( '/' ),
			inputPathHtml = inputPath + '.html',
			inputPathRtf = inputPath + '.rtf',
			outputPath = [ '_fixtures', options.name, '/expected.html' ].join( '/' ),
			specialCasePath = [ '_fixtures', options.name, options.wordVersion, 'expected_' + options.browser ].join( '/' ) + '.html',
			deCasher = '?' + Math.random().toString( 36 ).replace( /^../, '' ), // Used to trick the browser into not caching the html files.
			editor = this.editor,
			load = function( path ) {
				assert.isObject( CKEDITOR.ajax, 'Ajax plugin is required' );

				return new CKEDITOR.tools.promise( function( resolve ) {
					CKEDITOR.ajax.load( path, function( data ) {
						resolve( data );
					} );
				} );
			},
			loadQueue = [
				load( inputPathHtml + deCasher ),
				load( outputPath + deCasher ),
				load( specialCasePath + deCasher )
			];
		if ( options.includeRTF ) {
			loadQueue.push( load( inputPathRtf + deCasher ) );
		}


		CKEDITOR.tools.promise.all( loadQueue ).then( function( values ) {
			var inputFixtureHtml = values[ 0 ],
				inputFixtureRtf = options.includeRTF ? values[ 3 ] : null ,
				// If browser-customized expected result was found, use it. Otherwise go with the regular expected.
				expectedValue = values[ 2 ] !== null ? values[ 2 ] : values[ 1 ];

			// Null means that fixture file was not found in case of regular test - skipping test.
			// In case of using RTF clipboard it's required to have both nulls.
			if ( inputFixtureHtml === null && ( !options.includeRTF || inputFixtureRtf === null ) ) {
				resume( function() {
					assert.ignore();
				} );
				return;
			}
			// Single null when RTF is available means that one of 2 required files is missing.
			else if ( options.includeRTF && ( inputFixtureHtml === null || inputFixtureRtf === null ) ) {
				resume( function() {
					assert.isNotNull( inputFixtureHtml, '"' + inputPathHtml + '" file is missing' );
					assert.isNotNull( inputFixtureRtf, '"' + inputPathRtf + '" file is missing' );
				} );
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

			assertWordFilter( editor, options.compareRawData )( { 'text/html': inputFixtureHtml, 'text/rtf': inputFixtureRtf }, expectedValue )
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
