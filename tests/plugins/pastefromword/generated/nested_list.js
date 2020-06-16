/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,toolbar,list */
/* bender-include: _helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js */
/* global createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// Built version of editor includes plugins that allow too much markup.
			// Also indenting list on built version is wrecking test.
			// Therefore all rogue plugins and indentation are switched off (#1252).
			removePlugins: 'liststyle,font,div,format',
			indentClasses: []
		}
	};

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

		compareRawData: false,
		ignoreAll: bender.tools.env.mobile
	} ) );
} )();
