/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'datatransfer', // Firefox, Safari, Chrome
			'edge',
			'ie'
		],
		wordVersions: [
			'office365'
		],
		tests: {
			'Table_word': true,
			'Table_excel': true
		},
		testData: {
			_should: {
				ignore: {
					'test Table_word office365 datatransfer': CKEDITOR.env.ie,
					'test Table_excel office365 datatransfer': CKEDITOR.env.ie,
					'test Table_word office365 edge': !CKEDITOR.env.edge,
					'test Table_excel office365 edge': !CKEDITOR.env.edge,
					'test Table_word office365 ie': !CKEDITOR.env.ie || CKEDITOR.env.edge,
					'test Table_excel office365 ie':  !CKEDITOR.env.ie || CKEDITOR.env.edge
				}
			}
		},
		customFilters: [
			pfwTools.filters.style,
			pfwTools.filters.span,
			// IE9-10 adds br element into empty table cells. Remove it to simplify
			// test suite.
			new CKEDITOR.htmlParser.filter( {
				elements: {
					br: function() {
						if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) {
							return false;
						}
					}
				}
			} )
		],
		ignoreAll: CKEDITOR.env.ie && CKEDITOR.env.version < 9 || bender.tools.env.mobile
	} ) );
} )();
