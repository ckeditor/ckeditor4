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
		config: {
			language: 'en',
			plugins: [
				'wysiwygarea',
				'toolbar',
				'pastefromword',
				'sourcearea',
				'elementspath',
				'pagebreak'
			]
		}
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie8',
			'safari'
		],
		wordVersions: [
			'office365',
			'word2013'
		],
		tests: {
			'Page_break_simple': true
		},
		testData: {
			_should: {
				ignore: {
					'test Page_break_simple office365 chrome': CKEDITOR.env.ie && CKEDITOR.env.version < 11,
					'test Page_break_simple office365 firefox': CKEDITOR.env.ie && CKEDITOR.env.version < 11,
					'test Page_break_simple office365 safari': CKEDITOR.env.ie && CKEDITOR.env.version < 11,
					'test Page_break_simple word2013 ie8': !CKEDITOR.env.ie || CKEDITOR.env.version >= 11
				}
			}
		}
	} ) );
} )();
