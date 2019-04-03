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

	var config = pfwTools.defaultConfig;
	config.pasteFromWord_heuristicsEdgeList = false;

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'edge'
		],
		wordVersions: [
			'word2013'
		],
		tests: {
			'No_heuristics/Ordered_list': true,
			'No_heuristics/Ordered_list_multiple': true,
			'No_heuristics/Unordered_list': true,
			'No_heuristics/Unordered_list_multiple': true,
			'No_heuristics/Tickets/16745MixedListsAndParagraphs': true
		},
		testData: {
			_should: {
				ignore: {
					'test No_heuristics/Ordered_list word2013 edge': !CKEDITOR.env.edge,
					'test No_heuristics/Ordered_list_multiple word2013 edge': !CKEDITOR.env.edge,
					'test No_heuristics/Unordered_list word2013 edge': !CKEDITOR.env.edge,
					'test No_heuristics/Unordered_list_multiple word2013 edge': !CKEDITOR.env.edge,
					'test No_heuristics/Tickets/16745MixedListsAndParagraphs word2013 edge': !CKEDITOR.env.edge
				}
			}
		},
		customFilters: [
			pfwTools.filters.font
		],
		compareRawData: true,
		ignoreAll: ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) || bender.tools.env.mobile
	} ) );
} )();
