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

	pfwTools.defaultConfig.disallowedContent = ( pfwTools.defaultConfig.disallowedContent ? pfwTools.defaultConfig.disallowedContent + ';' : '' ) + 'span[lang,dir]';

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
			'ie11'
		],
		wordVersions: [
			'word2013'
		],
		tests: {
			'Tickets/7661Multilevel_lists': [ 'word2013' ],
			'Tickets/7696empty_table': [ 'word2013' ],
			'Tickets/7797fonts': [ 'word2013' ],
			'Tickets/7857pasting_RTL_lists_from_word_defect': [ 'word2013' ],
			'Tickets/7872lists': [ 'word2013' ],
			'Tickets/7918Numbering': [ 'word2013' ],
			'Tickets/7950Sample_word_doc': [ 'word2013' ],
			'Tickets/8437WORD_ABC': [ 'word2013' ],
			'Tickets/8501FromWord': [ 'word2013' ],
			'Tickets/8665Tartalom': [ 'word2013' ],
			'Tickets/8734list_test2': [ 'word2013' ],
			'Tickets/8734list_test': [ 'word2013' ],
			'Tickets/8780ckeditor_tablebug_document': [ 'word2013' ],
			'Tickets/9144test': [ 'word2013' ],
			'Tickets/9274CKEditor_formating_issue': [ 'word2013' ],
			'Tickets/9330Sample_Anchor_Document': [ 'word2013' ],
			'Tickets/9331ckBugWord1': [ 'word2013' ],
			'Tickets/9340test_ckeditor': [ 'word2013' ],
			'Tickets/9422for_cke': [ 'word2013' ],
			'Tickets/9426CK_Sample_word_document': [ 'word2013' ],
			'Tickets/9456Stuff_to_get': [ 'word2013' ],
			'Tickets/9456text-with-bullet-list-example': [ 'word2013' ],
			'Tickets/9475list2003': [ 'word2013' ],
			'Tickets/9475List2010': [ 'word2013' ],
			'Tickets/9616word_table': [ 'word2013' ],
			'Tickets/9685ckeditor_tablebug_document': [ 'word2013' ],
			'Tickets/9685testResumeTest': [ 'word2013' ]
		},
		customFilters: [
			pfwTools.filters.span
		],
		ignoreAll: CKEDITOR.env.ie && CKEDITOR.env.version <= 11
	} ) );
} )();
