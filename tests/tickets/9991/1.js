/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,font,link,toolbar,colorbutton,image,list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
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
		/** Some tickets are commented out because of the following known issues:
			PFW001. Multi-paragraph lists are not recognized.
			PFW002. Bullet font is not supported.
			PFW003. IE seperates list items into individual lists.

			Solutions:
			PFW001, PFW003: Join lists with similar mso-list styles.
		*/
		ticketTests = {
			'13021testdoc': [ 'word2013' ],
			'5808Word_test': [ 'word2013' ],
			'6241Sample_word_doc': [ 'word2013' ],
			'6286Sample_6286': [ 'word2013' ],
			'6362Numbering': [ 'word2013' ],
			'6449Sample': [ 'word2013' ],
			//'6493Questions_and_answers': [ 'word2013' ], // PFW001
			'6533test_doc': [ 'word2013' ],
			'6570ordered_list': [ 'word2013' ], // Somewhat related to PFW001.
			'6594': [ 'word2013' ],
			'6608': [ 'word2013' ],
			'6639nested_list_with_empty_lines': [ 'word2013' ],
			'6658CKEditor_Word_tabs_between_list_items_Sample': [ 'word2013' ],
			'6662': [ 'word2013' ],
			'6662bullets': [ 'word2013' ], // Chrome and FF don't paste list symbols.
			//'6711Text_Boxes': [ 'word2013' ], // Okay, wow.
			'6751': [ 'word2013' ],
			'6751disappearing_spaces_example2': [ 'word2013' ],
			//'7131': [ 'word2013' ], // PFW003
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
			//'9426CK_Sample_word_document': [ 'word2013' ], // PFW001
			//'9424CK_Sample_word_document': [ 'word2013' ], // PFW001
			'9422for_cke': [ 'word2013' ],
			'9340test_ckeditor': [ 'word2013' ],
			'9331ckBugWord1': [ 'word2013' ],
			'9330Sample_Anchor_Document': [ 'word2013' ], //
			//'9322Sample_Document2': [ 'word2013' ], // Not closed - new feature
			'9144test': [ 'word2013' ],
			'8780ckeditor_tablebug_document': [ 'word2013' ],
			'8734list_test2': [ 'word2013' ],
			'8734list_test': [ 'word2013' ],
			//'11054CKEditor-Bug': [ 'word2013' ], // "Wont fix"
			'11005Test_WordDoc': [ 'word2013' ],
			'10784line_missing': [ 'word2013' ], // IE11 consistently generates this weird output.
			//'10783list-break2': [ 'word2013' ], // PFW001 - Extreme case.
			'10780word_margin_bug': [ 'word2013' ],
			'10672Lists_Test': [ 'word2013' ],
			'10643sample1': [ 'word2013' ],
			'10285test': [ 'word2013' ],
			'10053doubles': [ 'word2013' ],
			'10011CMSPasteTest-1': [ 'word2013' ]
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
