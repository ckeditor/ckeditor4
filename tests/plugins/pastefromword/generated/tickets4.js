/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js,_helpers/pfwTools.js */
/* global createTestCase,pfwTools */

( function() {
	'use strict';

	pfwTools.defaultConfig.disallowedContent = 'span[lang,dir]';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	var browsers = [
			'chrome',
			'firefox',
			'ie8',
			'ie11'
		],
		wordVersion = 'word2013',
		ticketTests = {
			'7661Multilevel_lists': [ 'word2013' ],
			'7696empty_table': [ 'word2013' ],
			'7797fonts': [ 'word2013' ],
			'7843Multi_level_Numbered_list': [ 'word2013' ],
			'7857pasting_RTL_lists_from_word_defect': [ 'word2013' ],
			'7872lists': [ 'word2013' ],
			'7918Numbering': [ 'word2013' ],
			'7950Sample_word_doc': [ 'word2013' ],
			'8437WORD_ABC': [ 'word2013' ],
			'8501FromWord': [ 'word2013' ],
			'8665Tartalom': [ 'word2013' ],
			'8734list_test2': [ 'word2013' ],
			'8734list_test': [ 'word2013' ],
			'8780ckeditor_tablebug_document': [ 'word2013' ],
			'9144test': [ 'word2013' ],
			'9274CKEditor_formating_issue': [ 'word2013' ],
			'9330Sample_Anchor_Document': [ 'word2013' ],
			'9331ckBugWord1': [ 'word2013' ],
			'9340test_ckeditor': [ 'word2013' ],
			'9422for_cke': [ 'word2013' ],
			'9426CK_Sample_word_document': [ 'word2013' ],
			'9456Stuff_to_get': [ 'word2013' ],
			'9456text-with-bullet-list-example': [ 'word2013' ],
			'9475list2003': [ 'word2013' ],
			'9475List2010': [ 'word2013' ],
			'9616word_table': [ 'word2013' ],
			'9685ckeditor_tablebug_document': [ 'word2013' ],
			'9685testResumeTest': [ 'word2013' ]
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
