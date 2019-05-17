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
		config: CKEDITOR.tools.extend( {}, pfwTools.defaultConfig, {
			pasteFromWord_heuristicsEdgeList: false
		} )
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie8',
			'ie11',
			'edge'
		],
		wordVersions: [
			'word2013',
			'word2016'
		],
		tests: {
			'Tickets/14867examples': [ 'word2013' ],
			'Tickets/16593regular_paste': [ 'word2013' ],
			'Tickets/16833Numbered_lists': [ 'word2013' ],
			'Tickets/16817SampleDocForDataLossBug': [ 'word2013', 'word2016' ],
			'Tickets/16860Faked_list': true
		},
		testData: {
			_should: {
				ignore: {
					'test Tickets/16833Numbered_lists word2016 edge': !CKEDITOR.env.edge,
					'test Tickets/16833Numbered_lists word2013 ie11': !CKEDITOR.env.ie || CKEDITOR.env.edge
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
