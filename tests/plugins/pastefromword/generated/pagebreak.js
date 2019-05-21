/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog,pagebreak*/
/* jshint ignore:end */
/* bender-include: _helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'ie8',
			'safari',
			'edge'
		],
		wordVersions: [
			'office365',
			'word2013'
		],
		tests: {
			'Page_break': true
		},
		testData: {
			_should: {
				ignore: {
					'test Page_break office365 chrome': CKEDITOR.env.ie && CKEDITOR.env.version < 11,
					'test Page_break office365 safari': CKEDITOR.env.ie && CKEDITOR.env.version < 11,
					'test Page_break office365 edge': CKEDITOR.env.ie && CKEDITOR.env.version < 11,
					'test Page_break word2013 ie8': !CKEDITOR.env.ie || CKEDITOR.env.version >= 11
				}
			}
		},
	} ) );
} )();
