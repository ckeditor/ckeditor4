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
			language: 'en'
		}
	};

	var browsers = [
			'chrome',
			'firefox',
			'ie8',
			//'ie9',
			//'ie10',
			'ie11'
		],
		wordVersion = 'word2013',
		ticketTests = {
			//'13590ckeditor-numberlist': [ 'word2013' ],
			'13616': [ 'word2013' ],
			'13810test': [ 'word2013' ],
			'1457list-test': [ 'word2013' ], // IE11 puts <font> tags between list elements.
			'1707bug_fckeditor': [ 'word2013' ],
			'3039blog_test_2003_(2)': [ 'word2013' ],
			'3828TestList': [ 'word2013' ],
			'3959Test_doc_with_date': [ 'word2013' ], // Will break when individual <td> borders are introduced.
			'3959Test_doc_without_date': [ 'word2013' ],
			'4427test-document': [ 'word2013' ],
			'445Spanish_5-2-07': [ 'word2013' ],
			'4883_Test': [ 'word2013' ],
			'4894CustomStyleTest': [ 'word2013' ], //
			'4895ListFontSizeTests': [ 'word2013' ],
			'5134Sample': [ 'word2013' ],
			'5300Sample': [ 'word2013' ],
			'5399This_is_a_line_of_text': [ 'word2013' ],
			// '5743bulletlist': [ 'word2013' ], // @todo
			'5808Word_test': [ 'word2013' ],
			'6086test': [ 'word2013' ],
			'6241Sample_word_doc': [ 'word2013' ],
			'6286Sample_6286': [ 'word2013' ],
			'6330bullets': [ 'word2013' ],
			// '6362Numbering': [ 'word2013' ], // @todo
			'6449Sample': [ 'word2013' ],
			'6493Questions_and_answers': [ 'word2013' ],
			'6533test_doc': [ 'word2013' ],
			'6570ordered_list_97': [ 'word2013' ],
			'6570ordered_list': [ 'word2013' ]
		},
		testData = {},
		ticketKeys = CKEDITOR.tools.objectKeys( ticketTests ),
		i, k;

	for ( i = 0; i < ticketKeys.length; i++ ) {
		for ( k = 0; k < browsers.length; k++ ) {
			if ( ticketTests[ ticketKeys[ i ] ] === true || CKEDITOR.tools.indexOf( ticketTests[ ticketKeys[ i ] ], wordVersion ) !== -1 ) {
				testData[ [ 'test', ticketKeys[ i ], wordVersion, browsers[ k ] ].join( ' ' ) ] = createTestCase( ticketKeys[ i ], wordVersion, browsers[ k ], true );
			}
		}
	}

	bender.test( testData );
} )();
