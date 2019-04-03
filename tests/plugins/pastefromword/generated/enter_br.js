/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,toolbar */
/* jshint ignore:end */
/* bender-include: _helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js */
/* global createTestSuite */

( function() {
	'use strict';

	var config = {
		language: 'en',
		colorButton_normalizeBackground: false,
		allowedContent: 'p strong em',
		enterMode: CKEDITOR.ENTER_BR
	};

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie11',
			'ie8'
		],
		wordVersions: [
			'word2016'
		],
		tests: {
			'Enter_BR': true
		},

		compareRawData: false,
		ignoreAll: bender.tools.env.mobile
	} ) );
} )();
