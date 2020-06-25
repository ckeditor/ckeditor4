/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax, */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	var config = {
		allowedContent: true,
		language: 'en',
		removePlugins: pfwTools.defaultConfig.removePlugins,
		pasteFromWord_keepZeroMargins: true
	};

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'edge',
			'firefox',
			'safari',
			'ie11'
		],
		wordVersions: [
			'word2013',
			'word2016'
		],
		tests: {
			'Vertical_margin': true
		},

		ignoreAll: CKEDITOR.env.ie || bender.tools.env.mobile,

		customFilters: [
			pfwTools.filters.font
		]
	} ) );
} )();
