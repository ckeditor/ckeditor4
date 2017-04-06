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
			'chrome',
			'firefox',
			'ie8',
			'ie11'
		],
		wordVersions: [
			'word2013'
		],
		tests: {
			'Tickets/13590ckeditor-numberlist': [ 'word2013' ],
			'Tickets/13616': [ 'word2013' ],
			'Tickets/13810test': [ 'word2013' ],
			'Tickets/1457list-test': [ 'word2013' ],
			'Tickets/1707bug_fckeditor': [ 'word2013' ],
			'Tickets/3039blog_test_2003_(2)': [ 'word2013' ],
			'Tickets/3828TestList': [ 'word2013' ],
			'Tickets/3959Test_doc_with_date': [ 'word2013' ],
			'Tickets/3959Test_doc_without_date': [ 'word2013' ],
			'Tickets/4427test-document': [ 'word2013' ],
			'Tickets/445Spanish_5-2-07': [ 'word2013' ],
			'Tickets/4883_Test': [ 'word2013' ],
			'Tickets/4894CustomStyleTest': [ 'word2013' ], //
			'Tickets/4895ListFontSizeTests': [ 'word2013' ],
			'Tickets/5134Sample': [ 'word2013' ],
			'Tickets/5300Sample': [ 'word2013' ],
			'Tickets/5399This_is_a_line_of_text': [ 'word2013' ],
			'Tickets/5808Word_test': [ 'word2013' ],
			'Tickets/6086test': [ 'word2013' ],
			'Tickets/6241Sample_word_doc': [ 'word2013' ],
			'Tickets/6286Sample_6286': [ 'word2013' ],
			'Tickets/6330bullets': [ 'word2013' ],
			'Tickets/6449Sample': [ 'word2013' ],
			'Tickets/6493Questions_and_answers': [ 'word2013' ],
			'Tickets/6533test_doc': [ 'word2013' ],
			'Tickets/6570ordered_list_97': [ 'word2013' ],
			'Tickets/6570ordered_list': [ 'word2013' ]
		},
		customFilters: [
			pfwTools.filters.span
		],
		ignoreAll: CKEDITOR.env.ie && CKEDITOR.env.version <= 11
	} ) );
} )();
