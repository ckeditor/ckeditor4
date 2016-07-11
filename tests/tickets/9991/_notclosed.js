/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: ../../plugins/clipboard/_helpers/pasting.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* global createTestCase */

/**
 * All PFW tickets that were never closed are gathered in this file.
 */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'b; i; p[style]{margin};'
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
			//'6711Text_Boxes': [ 'word2013' ], // Okay, wow.
			//'7269Test_with_footnote': [ 'word2013' ], // Circular dependencies in anchors.
			//'9456list_paste_from_msword': [ 'word2013' ], // Not supported
			//'9424CK_Sample_word_document': [ 'word2013' ], // Same file as in 9426.
			//'9322Sample_Document2': [ 'word2013' ], // new feature
			//'11054CKEditor-Bug': [ 'word2013' ], // "Won't fix"
			//'11218sample': [ 'word2013' ], // Did not paste whole
			//'11683CKEditor_Source': [ 'word2013' ], // Error in IE8, also not supported.
			//'11987sample1': [ 'word2013' ], // "Won't fix"
			//'13174Testdocument3': [ 'word2013' ], // Not supported
			//'13634example': [ 'word2013' ],
			//'13651ckeditor_report_bug': [ 'word2013' ], // Mother of tickets (o_o)>u-u
			//'14257test2': [ 'word2013' ]
			//'7807BL_13_individual_map_template_with_mouseover_def': [ 'word2013' ],
			//'9441AGUIRRE,_Algunas_cuestiones_sobre_el_seguro_ambiental2_editor': [ 'word2013' ], // Circular dependencies in anchors.
			//'7484IndentedParagraphs2': [ 'word2013' ], // text-indent?
			//'7954list_with_Roman_Numerals_&_Start_Value_5': [ 'word2013' ], // No bug.
			//'2507fcktest': [ 'word2013' ],
			//'7482IndentedNumberedList': [ 'word2013' ],
			//'7209test': [ 'word2013' ],
			//'7662Multilevel_lists': [ 'word2013' ],
			//'3336test': [ 'word2013' ],
			//'7982lists': [ 'word2013' ],
			//'8009CKEditor-comment-test-2011-06-08': [ 'word2013' ],
			//'7646testcase': [ 'word2013' ], // In review for the past 2 years. :D
			//'8231listTest': [ 'word2013' ],
			//'8186text_box': [ 'word2013' ],
			//'7839Multi_level_Numbered_list': [ 'word2013' ], // Same file as 7843
			//'7646testcase_V1.0': [ 'word2013' ],
			//'7484IndentedParagraphs1': [ 'word2013' ],
			//'3744BigWikiArticle': [ 'word2013' ], // More a stress test than a real test.
			//'6956screenshots': [ 'word2013' ], // Only screenshot.
			//'3336FCK': [ 'word2013' ],
			//'8390test1': [ 'word2013' ], // Won't fix.
			//'8266test': [ 'word2013' ],
			//'8983wordtest_align': [ 'word2013' ],
			//'11985sample1': [ 'word2013' ], // Won't fix.
			//'218shrev-gibberish-test': [ 'word2013' ], // Won't fix.
			//'7982lists_and_desc': [ 'word2013' ], // Duplicate of 7982lists.
			//'6789test': [ 'word2013' ],
			//'12784test': [ 'word2013' ],
		},
		testData = {},
		ticketKeys = CKEDITOR.tools.objectKeys( ticketTests ),
		i, k;

	for ( i = 0; i < ticketKeys.length; i++ ) {
		for ( k = 0; k < browsers.length; k++ ) {
			if ( ticketTests[ ticketKeys[ i ] ] === true || CKEDITOR.tools.indexOf( ticketTests[ ticketKeys[ i ] ], wordVersion ) !== -1 ) {
				testData[ [ 'test', ticketKeys[ i ], wordVersion, browsers[ k ] ].join( ' ' ) ] = createTestCase( ticketKeys[ i ], wordVersion, browsers[ k ], bender.tools.testExternalInput, true );
			}
		}
	}

	bender.test( testData );
} )();
