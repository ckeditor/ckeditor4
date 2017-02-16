/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js,_helpers/pfwTools.js */
/* global createTestCase,pfwTools */

( function() {
	'use strict';

	var config = {};
	config.prototype = pfwTools.defaultConfig;
	config.pasteFromWord_heuristicsEdgeList = false;

	bender.editor = {
		config: config
	};

	var browsers = [
			'chrome',
			'edge'
		],
		wordVersion = 'word2016',
		ticketTests = {
			'No_heuristics/Ordered_list': true,
			'No_heuristics/Ordered_list_multiple': true,
			'No_heuristics/Unordered_list': true,
			'No_heuristics/Unordered_list_multiple': true,
			'No_heuristics/Tickets/16745MixedListsAndParagraphs': true
		},
		testData = {
			_should: {
				ignore: {
					'test Ordered_list word2016 edge': !CKEDITOR.env.edge,
					'test Ordered_list_multiple word2016 edge': !CKEDITOR.env.edge,
					'test Unordered_list word2016 edge': !CKEDITOR.env.edge,
					'test Unordered_list_multiple word2016 edge': !CKEDITOR.env.edge,
					'test Tickets/16745MixedListsAndParagraphs word2016 edge': !CKEDITOR.env.edge
				}
			}
		},
		ticketKeys = CKEDITOR.tools.objectKeys( ticketTests ),
		i, k;

	for ( i = 0; i < ticketKeys.length; i++ ) {
		for ( k = 0; k < browsers.length; k++ ) {
			if ( ticketTests[ ticketKeys[ i ] ] === true ) {
				var testName = [ 'test', ticketKeys[ i ], wordVersion, browsers[ k ] ].join( ' ' );

				if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) {
					testData._should.ignore[ testName ] = true;
				}

				testData[ testName ] = createTestCase( ticketKeys[ i ], wordVersion, browsers[ k ], false, true );
			}
		}
	}

	bender.test( testData );
} )();
