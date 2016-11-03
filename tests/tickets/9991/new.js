/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* global createTestCase */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language: 'en',
			pasteFilter: null
		}
	};

	var browsers = [
			'chrome',
			'ie8'
		],
		wordVersion = 'word2013',
		ticketTests = {
			'Multi_dig_list': [ 'word2013' ],
			'List_skipped_numbering': [ 'word2013' ]
		},
		testData = {
			_should: {
				ignore: {}
			}
		},
		ticketKeys = CKEDITOR.tools.objectKeys( ticketTests ),
		i, k;

	for ( i = 0; i < ticketKeys.length; i++ ) {
		for ( k = 0; k < browsers.length; k++ ) {
			if ( ticketTests[ ticketKeys[ i ] ] === true || CKEDITOR.tools.indexOf( ticketTests[ ticketKeys[ i ] ], wordVersion ) !== -1 ) {
				testData[ [ 'test', ticketKeys[ i ], wordVersion, browsers[ k ] ].join( ' ' ) ] = createTestCase( ticketKeys[ i ], wordVersion, browsers[ k ] );
			}
		}
	}

	bender.test( testData );
} )();
