/* global createTestCase */
/* exported createTestSuite */

// Creates a test suite based on the options provided. The test suite then should be passed to `bender.test` to run tests.
//
// @param {Object} options
// @param {Array} options.browsers Array of browser names.
// @param {Array} options.wordVersions Array of word version names.
// @param {Object} options.tests Object containing tests to be generated. It contains key - value pairs, where key is name of the test file and value
// is an array of wordVersions name for which tests should be generated or a boolean indicating: true - generate for all versions, false - for none.
// @param {Object} [options.ticketTests] Object containing tests to be generated. It has same structure as `options.tests`.
// @param {Array} [options.testData] Test data object (may contain e.g. information about ignored tests). All created tests will be added into testData object.
// @param {Array} [options.customFilters] Array of custom filters (like [ pfwTools.filters.font ]) which will be used during assertions.
// @param {Boolean} [options.compareRawData=false] If `true` test case will assert against raw paste's `data.dataValue` rather than
// what will appear in the editor after all transformations and filtering.
// @param {Boolean} [options.ignoreAll=false] Whenever to ignore all tests.
// @returns {Object} Test data object which should be passed to `bender.test` function.
function createTestSuite( options ) {

	var browsers = options.browsers || [],
		wordVersions = options.wordVersions || [],
		tests = options.tests || [],
		ticketTests = options.ticketTests || [],
		testData = options.testData || { _should: { ignore: {} } },
		ignoreAll = options.ignoreAll === true,
		compareRawData = options.compareRawData === true,
		customFilters = options.customFilters ? options.customFilters : null;

	_prepareTests( testData, tests, browsers, wordVersions, compareRawData, customFilters, false, ignoreAll );

	_prepareTests( testData, ticketTests, browsers, wordVersions, compareRawData, customFilters, true, ignoreAll );

	return testData;
}

// Iterates over given tests, browsers and wordVersions creating tests based on all possible combinations.
//
// @private
// @param {Object} testData
// @param {Array} tests
// @param {Array} browsers
// @param {Array} wordVersions
// @param {Boolean} compareRawData
// @param {Array} customFilters
// @param {Boolean} areTicketsTests Whenever tests should be generated using `tickets/` directory.
// @param {Boolean} ignoreAll
function _prepareTests( testData, tests, browsers, wordVersions, compareRawData, customFilters, areTicketsTests, ignoreAll ) {
	var testsKeys = CKEDITOR.tools.objectKeys( tests ),
		wordVersion, testKey, testName, i, k, j;

	if ( testsKeys.length ) {
		for ( i = 0; i < testsKeys.length; i++ ) {
			for ( k = 0; k < browsers.length; k++ ) {
				for ( j = 0; j < wordVersions.length; j++ ) {

					wordVersion = wordVersions[ j ];
					testKey = testsKeys[ i ];

					if ( tests[ testKey ] === true || CKEDITOR.tools.indexOf( tests[ testKey ], wordVersion ) !== -1 ) {

						testName = [ 'test', testKey, wordVersion, browsers[ k ] ].join( ' ' );

						if ( ignoreAll ) {
							testData._should.ignore[ testName ] = true;
						}

						testData[ testName ] = createTestCase( testKey, wordVersion, browsers[ k ], areTicketsTests, compareRawData, customFilters );
					}
				}
			}
		}
	}
}
