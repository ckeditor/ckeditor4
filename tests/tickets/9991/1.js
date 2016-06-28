/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: ../../plugins/clipboard/_helpers/pasting.js */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'b; i; p[style]{margin};'
		}
	};

	function assertWordFilter( editor ) {
		return function( input, output ) {
			assertPasteEvent( editor, { dataValue: input }, function( data ) {
				var compat = bender.tools.compatHtml;
				// Old IE versions paste the HTML tags in uppercase.
				assert.areSame( compat( output ).toLowerCase(), compat( editor.dataProcessor.toHtml( data.dataValue ) ).toLowerCase() );
			}, null, true );
		};
	}

	var browsers = [
			'chrome',
			'firefox',
			'ie8',
			//'ie9',
			//'ie10',
			'ie11'
		],
		wordVersions = [
			'word2007',
			'word2013'
		],
		// To test only particular word versions set the key value to an array in the form: [ 'word2007', 'word2013' ].
		tests = {
			'Bold': true,
			'Colors': true,
			'Custom_list_markers': true,
			'Fonts': true,
			'Image': true,
			'Italic': true,
			'Link': true,
			'Only_paragraphs': true,
			'Ordered_list': true,
			'Ordered_list_multiple': true,
			'Ordered_list_multiple_edgy': true,
			'Paragraphs_with_headers': true,
			'Simple_table': true,
			'Spacing': true,
			'Text_alignment': true,
			'Underline': true,
			'Unordered_list': true,
			'Unordered_list_multiple': true
		},
		/** TODOs:
			1. 'v:shape' filter function needs to take into account, that the element's parent
			may be the document fragment.
		*/
		ticketTests = {
			'5808Word_test': [ 'word2013' ],
			'6241Sample_word_doc': [ 'word2013' ],
			'6286Sample_6286': [ 'word2013' ],
			'6362Numbering': [ 'word2013' ],
			'6449Sample': [ 'word2013' ],
			'6493Questions_and_answers': [ 'word2013' ],
			'6533test_doc': [ 'word2013' ],
			'6570ordered_list': [ 'word2013' ],
			'6594': [ 'word2013' ],
			'6608': [ 'word2013' ],
			'6639nested_list_with_empty_lines': [ 'word2013' ],
			'6658CKEditor_Word_tabs_between_list_items_Sample': [ 'word2013' ],
			'6662': [ 'word2013' ],
			'6662bullets': [ 'word2013' ], // Chrome and FF don't paste list symbols.
			//'6711Text_Boxes': [ 'word2013' ], // Okay, wow.
			'6751': [ 'word2013' ],
			'6751disappearing_spaces_example2': [ 'word2013' ],
			'7131': [ 'word2013' ], // Will break. Input from IE11 requires attention.
			'7131customNumbering': [ 'word2013' ],
			'7131TC_7131_2': [ 'word2013' ],
			'7262preformatted_list': [ 'word2013' ],
			//'7269Test_with_footnote': [ 'word2013' ], // Circular dependencies in anchors.
			'7371BugReport_Example': [ 'word2013' ],
			'7581Numbering': [ 'word2013' ],
			'7581stupidList': [ 'word2013' ], // IE drops some list numbering information.
			'7918Numbering': [ 'word2013' ],
			'7950Sample_word_doc': [ 'word2013' ],
			'9685testResumeTest': [ 'word2013' ],
			'9685ckeditor_tablebug_document': [ 'word2013' ],
			'9616word_table': [ 'word2013' ],
			'9475List2010': [ 'word2013' ],
			'9456Stuff_to_get': [ 'word2013' ],
			//'9456list_paste_from_msword': [ 'word2013' ], // Not supported
			'9426CK_Sample_word_document': [ 'word2013' ], // "lists" made by tabs.
			//'9424CK_Sample_word_document': [ 'word2013' ], // Same file as in 9426.
			'9422for_cke': [ 'word2013' ],
			'9340test_ckeditor': [ 'word2013' ],
			'9331ckBugWord1': [ 'word2013' ],
			'9330Sample_Anchor_Document': [ 'word2013' ],
			//'9322Sample_Document2': [ 'word2013' ], // Not closed - new feature
			'9144test': [ 'word2013' ],
			'8780ckeditor_tablebug_document': [ 'word2013' ],
			'8734list_test2': [ 'word2013' ],
			'8734list_test': [ 'word2013' ],
			//'11054CKEditor-Bug': [ 'word2013' ], // "Won't fix"
			'11005Test_WordDoc': [ 'word2013' ],
			'10784line_missing': [ 'word2013' ], // IE11 consistently generates this weird output.
			'10783list-break2': [ 'word2013' ], // Wrong list levels.
			'10780word_margin_bug': [ 'word2013' ],
			'10672Lists_Test': [ 'word2013' ],
			'10643sample1': [ 'word2013' ],
			'10285test': [ 'word2013' ],
			'10053doubles': [ 'word2013' ],
			'10011CMSPasteTest-1': [ 'word2013' ],
			'11136bugged_file': [ 'word2013' ],
			'11215sample_error_word': [ 'word2013' ],
			//'11218sample': [ 'word2013' ], // Did not paste whole
			'11294NotesFormatting': [ 'word2013' ],
			'11376bullets_v1': [ 'word2013' ],
			'11477Table_in_word': [ 'word2013' ],
			'11529Table_OO': [ 'word2013' ], // Will break when individual <td> borders are introduced.
			//'11683CKEditor_Source': [ 'word2013' ], // Error in IE8, also not supported.
			'11683pasteData': [ 'word2013' ],
			'11699PasteExample-1': [ 'word2013' ],
			'11950Test_Table': [ 'word2013' ], // Paste from Excel!
			//'11987sample1': [ 'word2013' ], // "Won't fix"
			'12385number_list': [ 'word2013' ],
			'12406Doc1': [ 'word2013' ], // Really large file.
			'12406Document1_(3)': [ 'word2013' ],
			'12740CKEditor_-_Internal_Error_on_Paste_as_CTRL-V(1)': [ 'word2013' ],
			'12740WSGCN-3550_Test_document_minimal': [ 'word2013' ],
			'12821ELL_Forum_Invitation': [ 'word2013' ],
			'13021testdoc': [ 'word2013' ],
			'13174Testdocument': [ 'word2013' ],
			'13174Testdocument2': [ 'word2013' ], // Not fully supported(and will break), but contains a significant edge case (compound "<!-- [if...]")
			//'13174Testdocument3': [ 'word2013' ], // Not supported
			'13339Internal_Error_on_Paste_as_CTRL-V': [ 'word2013' ],
			'13590ckeditor-numberlist': [ 'word2013' ],
			'13616': [ 'word2013' ],
			//'13634example': [ 'word2013' ], // Not closed.
			//'13651ckeditor_report_bug': [ 'word2013' ], // Mother of tickets (o_o)>u-u - not closed.
			'13810test': [ 'word2013' ],
			//'14257test2': [ 'word2013' ] // Not closed.
			'6973This_is_a_line_of_text.2': [ 'word2013' ],
			'11237borderBug': [ 'word2013' ],
			'3959Test_doc_without_date': [ 'word2013' ],
			'7797fonts': [ 'word2013' ],
			'4427test-document': [ 'word2013' ],
			'7494Numbers_&_Bulltes_lists': [ 'word2013' ],
			'7843Multi_level_Numbered_list': [ 'word2013' ],
			'6973CKEditor_pasting_issue': [ 'word2013' ],
			'7610Multi_level_Numbered_list': [ 'word2013' ], // Probably the same file as in 7843.
			'4894CustomStyleTest': [ 'word2013' ], //
			'6973TestNegativeHeadingIndent': [ 'word2013' ],
			'5743bulletlist': [ 'word2013' ],
			//'7807BL_13_individual_map_template_with_mouseover_def': [ 'word2013' ], // Not closed.
			//'9441AGUIRRE,_Algunas_cuestiones_sobre_el_seguro_ambiental2_editor': [ 'word2013' ], // Circular dependencies in anchors.
			'8437WORD_ABC': [ 'word2013' ],
			//'7484IndentedParagraphs2': [ 'word2013' ], // text-indent? Not closed.
			//'7954list_with_Roman_Numerals_&_Start_Value_5': [ 'word2013' ], Not closed, but no bug.
			'8665Tartalom': [ 'word2013' ],
			'4883_Test': [ 'word2013' ],
			'7857pasting_RTL_lists_from_word_defect': [ 'word2013' ],
			'3828TestList': [ 'word2013' ],
			//'2507fcktest': [ 'word2013' ], // Not closed.
			//'7482IndentedNumberedList': [ 'word2013' ], // Not closed.
			//'7209test': [ 'word2013' ], // Not closed.
			//'7662Multilevel_lists': [ 'word2013' ], // Not closed.
			//'3336test': [ 'word2013' ], // Not closed.
			'5399This_is_a_line_of_text': [ 'word2013' ],
			'7696empty_table': [ 'word2013' ],
			'445Spanish_5-2-07': [ 'word2013' ],
			//'7982lists': [ 'word2013' ], // Not closed.
			'3959Test_doc_with_date': [ 'word2013' ], // Will break when individual <td> borders are introduced.
			//'8009CKEditor-comment-test-2011-06-08': [ 'word2013' ], // Not closed.
			//'7646testcase': [ 'word2013' ], // Not closed - in review for the past 2 years. :D
			//'8231listTest': [ 'word2013' ], // Not closed.
			'7593Numbere_&_Bullet_list_with_list_styles_applied': [ 'word2013' ],
			'5750bulletlist': [ 'word2013' ],
			'4895ListFontSizeTests': [ 'word2013' ],
			//'8186text_box': [ 'word2013' ], // Not closed.
			'6956CKEditor_pasting_issue': [ 'word2013' ],
			'5300Sample': [ 'word2013' ],
			'7872lists': [ 'word2013' ], // IE11 creates distorted lists.
			//'7839Multi_level_Numbered_list': [ 'word2013' ], // Same file as 7843
			'7209test2': [ 'word2013' ], // In IE11 no indication, that the second list is multi-level.
			//'7646testcase_V1.0': [ 'word2013' ], // Not closed.
			'7584Numbered_list_with_diff_start_value': [ 'word2013' ], // IE11 drops some list data.
			//'7484IndentedParagraphs1': [ 'word2013' ], // Not closed.
			'7661Multilevel_lists': [ 'word2013' ],
			'7480BulletedList': [ 'word2013' ],
			'6086test': [ 'word2013' ],
			//'3744BigWikiArticle': [ 'word2013' ], // More a stress test than a real test.
			'9274CKEditor_formating_issue': [ 'word2013' ],
			'6330bullets': [ 'word2013' ],
			'1707bug_fckeditor': [ 'word2013' ],
			'10485sample_test_doc': [ 'word2013' ],
			'3039blog_test_2003_(2)': [ 'word2013' ],
			//'6956screenshots': [ 'word2013' ], // Only screenshot.
			//'3336FCK': [ 'word2013' ], // Not closed.
			//'8390test1': [ 'word2013' ], // Won't fix.
			//'8266test': [ 'word2013' ], // Not closed.
			'5134Sample': [ 'word2013' ],
			//'8983wordtest_align': [ 'word2013' ], // Not closed.
			'9475list2003': [ 'word2013' ],
			'8501FromWord': [ 'word2013' ], // IE8 drops some formatting data.
			'7521simple_table': [ 'word2013' ],
			'7620AlphabeticNumberingLists': [ 'word2013' ],
			'9456text-with-bullet-list-example': [ 'word2013' ],
			'1457list-test': [ 'word2013' ], // IE11 puts <font> tags between list elements.
			//'11985sample1': [ 'word2013' ], // Won't fix.
			//'218shrev-gibberish-test': [ 'word2013' ], // Won't fix.
			'6751TextToPaste': [ 'word2013' ],
			//'7982lists_and_desc': [ 'word2013' ], // Duplicate of 7982lists, also not closed.
			'6595': [ 'word2013' ],
			//'6789test': [ 'word2013' ], // Not closed.
			'6570ordered_list_97': [ 'word2013' ],
			//'12784test': [ 'word2013' ], // Not closed.
			'682tester': [ 'word2013' ]
		},
		loadFixture = bender.tools.testExternalInput,
		keys = CKEDITOR.tools.objectKeys( tests ),
		ticketKeys = CKEDITOR.tools.objectKeys( ticketTests ),
		testData = {};

	for ( var i = 0; i < keys.length; i++ ) {
		for ( var j = 0; j < wordVersions.length; j++ ) {
			for ( var k = 0; k < browsers.length; k++ ) {
				if ( tests[ keys[ i ] ] === true || CKEDITOR.tools.indexOf( tests[ keys[ i ] ], wordVersions[ j ] ) !== -1 ) {
					testData[ [ 'test', keys[ i ], wordVersions[ j ], browsers[ k ] ].join( ' ' ) ] = createTestCase( keys[ i ], wordVersions[ j ], browsers[ k ] );
				}
			}
		}
	}

	for ( i = 0; i < ticketKeys.length; i++ ) {
		for ( j = 0; j < wordVersions.length; j++ ) {
			for ( k = 0; k < browsers.length; k++ ) {
				if ( ticketTests[ ticketKeys[ i ] ] === true || CKEDITOR.tools.indexOf( ticketTests[ ticketKeys[ i ] ], wordVersions[ j ] ) !== -1 ) {
					testData[ [ 'test', ticketKeys[ i ], wordVersions[ j ], browsers[ k ] ].join( ' ' ) ] = createTestCase( ticketKeys[ i ], wordVersions[ j ], browsers[ k ], true );
				}
			}
		}
	}


	function createTestCase( fixtureName, wordVersion, browser, tickets ) {
		return function() {
			var inputPath = [ tickets ? '_fixtures/Tickets' : '_fixtures' , fixtureName, wordVersion, browser ].join( '/' ) + '.html',
				outputPath = [ tickets ? '_fixtures/Tickets' : '_fixtures' , fixtureName, '/expected.html' ].join( '/' ),
				specialCasePath = [ tickets ? '_fixtures/Tickets' : '_fixtures', fixtureName, wordVersion, 'expected_' + browser ].join( '/' ) + '.html',
				deCasher = '?' + Math.random().toString( 36 ).replace( /^../, '' ); // Used to trick the browser into not caching the html files.

			bender.editorBot.create( {
				name: [ fixtureName, wordVersion, browser ].join( ' ' ),
				config: {
					//pasteFromWordCleanupFile: 'plugins/pastefromword/filter/legacy.js'
				}
			}, function( bot ) {

				//bot.editor.filter.allow( 'p[style]{margin,margin-*,line-height};' );

				loadFixture( inputPath + deCasher, function( input ) {

					loadFixture( outputPath + deCasher, function( output ) {

						loadFixture( specialCasePath + deCasher, function( specialCaseOutput ) {

							// null means file not found - skipping test.
							if ( input === null ) {
								assert.ignore();
							}

							if ( specialCaseOutput !== null ) {
								assertWordFilter( bot.editor )( input, specialCaseOutput );
							} else {
								assert.isNotNull( output, '"expected.html" missing.' );

								assertWordFilter( bot.editor )( input, output );
							}
						} );
					} );
				} );
			} );
		};
	}

	bender.test( testData );
} )();
