/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,toolbar */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js */
/* global createTestSuite */

( function() {
	'use strict';

	var config = {
		language: 'en',
		colorButton_normalizeBackground: false,
		allowedContent: 'p ul li'
	};

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'safari',
			'ie11'
		],
		wordVersions: [
			'OneNote'
		],
		tests: {
			'OneNote': true
		},

		compareRawData: false
	} ) );
} )();
