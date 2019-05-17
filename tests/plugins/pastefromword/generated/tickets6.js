/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'edge'
		],
		wordVersions: [
			'word2016'
		],
		tests: {
			'Ordered_list': true,
			'Ordered_list_multiple': true,
			'Unordered_list': true,
			'Unordered_list_multiple': true,
			'Unordered_list_adjusted_margin': true,
			'Tickets/16745MixedListsAndParagraphs': true,
			'Tickets/16682listWithMargin': true,
			'Tickets/16682noIndentation': true
		},
		testData: {
			_should: {
				ignore: {
					'test Ordered_list word2016 edge': !CKEDITOR.env.edge,
					'test Ordered_list_multiple word2016 edge': !CKEDITOR.env.edge,
					'test Unordered_list word2016 edge': !CKEDITOR.env.edge,
					'test Unordered_list_multiple word2016 edge': !CKEDITOR.env.edge,
					'test Unordered_list_adjusted_margin word2016 edge': !CKEDITOR.env.edge,
					'test Tickets/16745MixedListsAndParagraphs word2016 edge': !CKEDITOR.env.edge,
					'test Tickets/16682listWithMargin word2016 edge': !CKEDITOR.env.edge,
					'test Tickets/16682noIndentation word2016 edge': !CKEDITOR.env.edge
				}
			}
		},
		compareRawData: true,
		ignoreAll: ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) || bender.tools.env.mobile
	} ) );
} )();
