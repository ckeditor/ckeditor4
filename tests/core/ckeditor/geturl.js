/* bender-tags: editor */

( function() {
	'use strict';

	var FAKE_BASE_PATH = 'http://some.example:1030/subdir/ckeditor/',
		testCases = [
			{
				url: 'just.js',
				expected: FAKE_BASE_PATH + 'just.js',
				timestamp: ''
			},

			{
				url: 'just.js',
				expected: FAKE_BASE_PATH + 'just.js?t=347',
				timestamp: '347'
			},

			{
				url: './test.css',
				expected: FAKE_BASE_PATH + './test.css',
				timestamp: ''
			},

			{
				url: './test.css',
				expected: FAKE_BASE_PATH + './test.css?t=tr4',
				timestamp: 'tr4'
			},

			{
				url: '../whatever.js',
				expected: FAKE_BASE_PATH + '../whatever.js',
				timestamp: ''
			},

			{
				url: '../whatever.js',
				expected: FAKE_BASE_PATH + '../whatever.js?t=qwerty',
				timestamp: 'qwerty'
			},

			{
				url: '/file',
				expected: '/file',
				timestamp: ''
			},

			{
				url: '/file',
				expected: '/file?t=cke4',
				timestamp: 'cke4'
			},

			{
				url: 'http://some.site:47/file.js',
				expected: 'http://some.site:47/file.js',
				timestamp: ''
			},

			{
				url: 'http://some.site:47/file.js',
				expected: 'http://some.site:47/file.js?t=cv3',
				timestamp: 'cv3'
			},

			{
				url: 'https://whatever/file',
				expected: 'https://whatever/file',
				timestamp: ''
			},

			{
				url: 'https://whatever/file',
				expected: 'https://whatever/file?t=1er',
				timestamp: '1er'
			},

			{
				url: '//cksource.com/file.css',
				expected: '//cksource.com/file.css',
				timestamp: ''
			},

			{
				url: '//cksource.com/file.css',
				expected: '//cksource.com/file.css?t=try6',
				timestamp: 'try6'
			},

			{
				url: 'file.t?something=here',
				expected: FAKE_BASE_PATH + 'file.t?something=here&t=wer',
				timestamp: 'wer'
			},

			{
				url: '/file.t?something=here',
				expected: '/file.t?something=here&t=wer',
				timestamp: 'wer'
			},

			{
				url: 'http://dot.example/file.t?something=here',
				expected: 'http://dot.example/file.t?something=here&t=wer',
				timestamp: 'wer'
			},

			{
				url: 'https://dot.example/file.t?something=here',
				expected: 'https://dot.example/file.t?something=here&t=wer',
				timestamp: 'wer'
			},

			{
				url: '//dot.example/file.t?something=here',
				expected: '//dot.example/file.t?something=here&t=wer',
				timestamp: 'wer'
			}
		],
		tests = createGetUrlTests( testCases );

	bender.test( tests );

	function createGetUrlTests( testCases ) {
		return CKEDITOR.tools.array.reduce( testCases, function( tests, testCase ) {
			var test = {},
				testName = 'test CKEDITOR.getUrl( \'' + testCase.url + '\' ) with timestamp \'' +
					testCase.timestamp + '\'';

			test[ testName ] = createTest( testCase );

			return CKEDITOR.tools.object.merge( tests, test );
		}, {} );

		function createTest( options ) {
			var url = options.url,
				expected = options.expected,
				timestamp = options.timestamp;

			return function() {
				var originalBasePath = CKEDITOR.basePath,
					originalTimestamp = CKEDITOR.timestamp,
					actualResult;

				CKEDITOR.basePath = FAKE_BASE_PATH;
				CKEDITOR.timestamp = timestamp;
				actualResult = CKEDITOR.getUrl( url );
				CKEDITOR.basePath = originalBasePath;
				CKEDITOR.timestamp = originalTimestamp;

				assert.areSame( expected, actualResult, 'Invalid URL generated from the ' + url );
			};
		}
	}
} )();
