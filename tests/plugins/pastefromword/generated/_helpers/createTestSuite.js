/* global createTestCase */
/* exported createTestSuite */

/**
 * Creates a test suite based on the options provided. The test suite then should be passed to `bender.test` to run tests.
 *
 * @param {Object} options
 * @param {Array} options.browsers Array of browser names.
 * @param {Array} options.wordVersions Array of word version names.
 * @param {Object} options.tests Object containing tests to be generated. It contains key - value pairs, where key is name of the test file and value
 * is an array of wordVersions name for which tests should be generated or a boolean indicating: true - generate for all versions, false - for none.
 * @param {Array} [options.testData] Test data object (may contain e.g. information about ignored tests). All created tests will be added into testData object.
 * @param {Array} [options.customFilters] Array of custom filters (like [ pfwTools.filters.font ]) which will be used during assertions.
 * @param {Boolean} [options.compareRawData=false] If `true` test case will assert against raw paste's `data.dataValue` rather than
 * what will appear in the editor after all transformations and filtering.
 * @param {Boolean} [options.ignoreAll=false] Whenever to ignore all tests.
 * @param {Boolean} [options.includeRTF=false] Whether RTF clipboard should be loaded in test case.
 * @returns {Object} Test data object which should be passed to `bender.test` function.
 */
function createTestSuite( options ) {
	options = CKEDITOR.tools.extend( options, {
		browsers: [],
		wordVersions: [],
		tests: [],
		testData: { _should: { ignore: {} } },
		ignoreAll: false,
		compareRawData: false,
		customFilters: null,
		includeRTF: false
	} );

	var testData = options.testData,
		testsKeys = CKEDITOR.tools.object.keys( options.tests ),
		wordVersion, testKey, testName, i, j, k;

	if ( testsKeys.length ) {
		for ( i = 0; i < testsKeys.length; i++ ) {
			for ( j = 0; j < options.browsers.length; j++ ) {
				for ( k = 0; k < options.wordVersions.length; k++ ) {

					wordVersion = options.wordVersions[ k ];
					testKey = testsKeys[ i ];

					if ( options.tests[ testKey ] === true || CKEDITOR.tools.indexOf( options.tests[ testKey ], wordVersion ) !== -1 ) {

						testName = [ 'test', testKey, wordVersion, options.browsers[ j ] ].join( ' ' );

						if ( options.ignoreAll ) {
							testData._should.ignore[ testName ] = true;
						}

						testData[ testName ] = createTestCase( {
							name: testKey,
							wordVersion: wordVersion,
							browser: options.browsers[ j ],
							compareRawData: options.compareRawData,
							customFilters: options.customFilters,
							includeRTF: options.includeRTF
						} );
					}
				}
			}
		}
	}

	return testData;
}
