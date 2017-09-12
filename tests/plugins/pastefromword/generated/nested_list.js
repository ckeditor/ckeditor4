/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,toolbar,list */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js */
/* global createTestSuite */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'safari',
			'ie11'
		],
		wordVersions: [
			'onenote'
		],
		tests: {
			'Unordered_nested_list': true
		},

		compareRawData: false
	} ) );
} )();
