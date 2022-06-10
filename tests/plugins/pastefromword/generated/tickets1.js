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
			'firefox',
			'ie8',
			//'ie9',
			//'ie10',
			'ie11'
		],
		wordVersions: [
			'word2013'
		],
		tests: {
			'Tickets/10011CMSPasteTest-1': [ 'word2013' ],
			'Tickets/10053doubles': [ 'word2013' ],
			'Tickets/10285test': [ 'word2013' ],
			'Tickets/10485sample_test_doc': [ 'word2013' ],
			'Tickets/10643sample1': [ 'word2013' ],
			'Tickets/10672Lists_Test': [ 'word2013' ],
			'Tickets/10780word_margin_bug': [ 'word2013' ],
			// 'Tickets/10783list-break2': [ 'word2013' ], // Wrong list levels. @todo
			'Tickets/10784line_missing': [ 'word2013' ], // IE11 consistently generates this weird output.
			'Tickets/11005Test_WordDoc': [ 'word2013' ],
			'Tickets/11136bugged_file': [ 'word2013' ],
			'Tickets/11215sample_error_word': [ 'word2013' ],
			'Tickets/11237borderBug': [ 'word2013' ],
			'Tickets/11294NotesFormatting': [ 'word2013' ],
			'Tickets/11376bullets_v1': [ 'word2013' ],
			'Tickets/11477Table_in_word': [ 'word2013' ],
			'Tickets/11529Table_OO': [ 'word2013' ], // Will break when individual <td> borders are introduced.
			'Tickets/11683pasteData': [ 'word2013' ],
			'Tickets/11699PasteExample-1': [ 'word2013' ],
			'Tickets/11950Test_Table': [ 'word2013' ], // Paste from Excel!
			'Tickets/12385number_list': [ 'word2013' ],
			'Tickets/12406Doc1': [ 'word2013' ], // Really large file.
			'Tickets/12406Document1_(3)': [ 'word2013' ],
			'Tickets/12740CKEditor_-_Internal_Error_on_Paste_as_CTRL-V(1)': [ 'word2013' ],
			'Tickets/12740WSGCN-3550_Test_document_minimal': [ 'word2013' ],
			'Tickets/12821ELL_Forum_Invitation': [ 'word2013' ],
			'Tickets/13021testdoc': [ 'word2013' ],
			'Tickets/13174Testdocument2': [ 'word2013' ], // Not fully supported(and will break), but contains a significant edge case (compound "<!-- [if...]")
			'Tickets/13174Testdocument': [ 'word2013' ],
			'Tickets/13339Internal_Error_on_Paste_as_CTRL-V': [ 'word2013' ]
		},
		customFilters: [
			pfwTools.filters.span
		],
		ignoreAll: ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) || bender.tools.env.mobile
	} ) );
} )();
