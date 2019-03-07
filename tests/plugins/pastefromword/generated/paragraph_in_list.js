/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: ajax,wysiwygarea,toolbar,pastefromword,sourcearea,list,liststyle,indentblock */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	var config = CKEDITOR.tools.clone( pfwTools.defaultConfig );

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie11',
			'edge'
		],
		wordVersions: [
			'Word2013',
			'Word2016'
		],
		tests: {
			'Paragraph_in_list': true
		}
	} ) );
} )();
