/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,font,link,toolbar,colorbutton,image,list,liststyle,sourcearea,format,justify,table,tableresize,tabletools */
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
		loadFixture = bender.tools.testExternalInput,
		keys = CKEDITOR.tools.objectKeys( tests ),
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

	function createTestCase( fixtureName, wordVersion, browser ) {
		return function() {
			var inputPath = [ '_fixtures', fixtureName, wordVersion, browser ].join( '/' ) + '.html',
				outputPath = [ '_fixtures', fixtureName, '/expected.html' ].join( '/' ),
				specialCasePath = [ '_fixtures', fixtureName, wordVersion, 'expected_' + browser ].join( '/' ) + '.html';

			bender.editorBot.create( {
				name: [ fixtureName, wordVersion, browser ].join( ' ' )
			}, function( bot ) {
				bot.editor.filter.allow( '*[style]{margin,margin-*,line-height};' );

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
