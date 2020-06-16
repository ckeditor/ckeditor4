/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language: 'en',
			pasteFilter: null
		}
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'ie8'
		],
		wordVersions: [
			'word2013'
		],
		tests: {
			'Multi_dig_list': [ 'word2013' ],
			'List_skipped_numbering': [ 'word2013' ]
		},
		ignoreAll: bender.tools.env.mobile
	} ) );
} )();
