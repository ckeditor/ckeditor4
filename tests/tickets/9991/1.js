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
		ticketTests = {
			'13021testdoc': [ 'word2013' ],
			'5808Word_test': [ 'word2013' ],
			'6241Sample_word_doc': [ 'word2013' ],
			'6286Sample_6286': [ 'word2013' ],
			'6362Numbering': [ 'word2013' ],
			'6449Sample': [ 'word2013' ],
			//'6493Questions_and_answers': [ 'word2013' ], // Really edgy case.
			'6533test_doc': [ 'word2013' ],
			'6570ordered_list': [ 'word2013' ],
			'6594': [ 'word2013' ],
			'6608': [ 'word2013' ],
			'6639nested_list_with_empty_lines': [ 'word2013' ],
			'6658CKEditor_Word_tabs_between_list_items_Sample': [ 'word2013' ],
			'6662': [ 'word2013' ],
			//'6662bullets': [ 'word2013' ], // Wierdness
			//'6711Text_Boxes': [ 'word2013' ], // Okay, wow.
			'6751': [ 'word2013' ],
			'6751disappearing_spaces_example2': [ 'word2013' ],
			//'7131': [ 'word2013' ], // Really?
			'7131TC_7131_2': [ 'word2013' ],
			//'7262preformatted_list': [ 'word2013' ],
			//'7269Test_with_footnote': [ 'word2013' ],
			'7371BugReport_Example': [ 'word2013' ]
			//'7581Numbering': [ 'word2013' ],
			//'7581stupidList': [ 'word2013' ]
			//'7918Numbering': [ 'word2013' ],
			//'7950Sample_word_doc': [ 'word2013' ]
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
				specialCasePath = [ tickets ? '_fixtures/Tickets' : '_fixtures', fixtureName, wordVersion, 'expected_' + browser ].join( '/' ) + '.html';

			bender.editorBot.create( {
				name: [ fixtureName, wordVersion, browser ].join( ' ' ),
				config: {
					//pasteFromWordCleanupFile: 'plugins/pastefromword/filter/legacy.js'
				}
			}, function( bot ) {
				//bot.editor.filter.allow( 'p[style]{margin,margin-*,line-height};' );

				loadFixture( inputPath, function( input ) {

					loadFixture( outputPath, function( output ) {

						loadFixture( specialCasePath, function( specialCaseOutput ) {

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
