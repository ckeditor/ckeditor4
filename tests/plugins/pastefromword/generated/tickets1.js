/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js,_helpers/pfwTools.js */
/* global createTestCase,pfwTools */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.defaultConfig
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
			'10011CMSPasteTest-1': [ 'word2013' ],
			'10053doubles': [ 'word2013' ],
			'10285test': [ 'word2013' ],
			'10485sample_test_doc': [ 'word2013' ],
			'10643sample1': [ 'word2013' ],
			'10672Lists_Test': [ 'word2013' ],
			'10780word_margin_bug': [ 'word2013' ],
			// '10783list-break2': [ 'word2013' ], // Wrong list levels. @todo
			'10784line_missing': [ 'word2013' ], // IE11 consistently generates this weird output.
			'11005Test_WordDoc': [ 'word2013' ],
			'11136bugged_file': [ 'word2013' ],
			'11215sample_error_word': [ 'word2013' ],
			'11237borderBug': [ 'word2013' ],
			'11294NotesFormatting': [ 'word2013' ],
			'11376bullets_v1': [ 'word2013' ],
			'11477Table_in_word': [ 'word2013' ],
			'11529Table_OO': [ 'word2013' ], // Will break when individual <td> borders are introduced.
			'11683pasteData': [ 'word2013' ],
			'11699PasteExample-1': [ 'word2013' ],
			'11950Test_Table': [ 'word2013' ], // Paste from Excel!
			'12385number_list': [ 'word2013' ],
			'12406Doc1': [ 'word2013' ], // Really large file.
			'12406Document1_(3)': [ 'word2013' ],
			'12740CKEditor_-_Internal_Error_on_Paste_as_CTRL-V(1)': [ 'word2013' ],
			'12740WSGCN-3550_Test_document_minimal': [ 'word2013' ],
			'12821ELL_Forum_Invitation': [ 'word2013' ],
			'13021testdoc': [ 'word2013' ],
			'13174Testdocument2': [ 'word2013' ], // Not fully supported(and will break), but contains a significant edge case (compound "<!-- [if...]")
			'13174Testdocument': [ 'word2013' ],
			'13339Internal_Error_on_Paste_as_CTRL-V': [ 'word2013' ]
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
				var testName = [ 'test', ticketKeys[ i ], wordVersion, browsers[ k ] ].join( ' ' );

				if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) {
					testData._should.ignore[ testName ] = true;
				}

				testData[ testName ] = createTestCase( ticketKeys[ i ], wordVersion, browsers[ k ], true );
			}
		}
	}

	bender.test( testData );
} )();
