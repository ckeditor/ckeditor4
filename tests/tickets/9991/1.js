/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: clipboard,pastefromword,format,ajax,basicstyles,font,colorbutton */
/* bender-include: ../../plugins/clipboard/_helpers/pasting.js */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null,
			pasteFromWordRemoveFontStyles: false,
			pasteFromWordRemoveStyles: false,
			allowedContent: true
		}
	};

	function loadFixture( url, fn ) {
		assert.isObject( CKEDITOR.ajax, 'Ajax plugin is required' );

		CKEDITOR.ajax.load( url, function( data ) {
			resume( function() {
				fn( data );
			} );
		} );

		wait();
	}

	var compat = bender.tools.compatHtml;

	function testWordFilter( editor ) {
		return function( input, output ) {
			assertPasteEvent( editor, { dataValue: input },
				function( data, msg ) {
					assert.areSame( compat( output ).toLowerCase(), compat( data.dataValue ).toLowerCase(), msg );
				}, 'test case', true );
		};
	}

	var browsers = [
			'chrome',
			'firefox',
			//'ie8',
			//'ie9',
			//'ie10',
			'ie11'
		],
		wordVersions = [
			'word2013'
		],
		tests = {
			'Bold': true,
			//'Colors': true,
			//'Fonts': true,
			'Italic': true,
			//'Only_paragraphs': true,
			'Ordered_list': true,
			'Ordered_list_multiple': true,
			//'Ordered_list_multiple_edgy': true,
			//'Paragraphs_with_headers': true,
			//'Simple_table': true,
			//'Spacing': true,
			//'Text_alignment': true,
			//'Underline': true,
			'Unordered_list': true,
			'Unordered_list_multiple': true
		},
		keys = CKEDITOR.tools.objectKeys( tests ),
		testData = {};

	for ( var i = 0; i < keys.length; i++ ) {

		for ( var j = 0; j < wordVersions.length; j++ ) {
			for ( var k = 0; k < browsers.length; k++ ) {
				testData[ [ 'test', keys[ i ], wordVersions[ j ], browsers[ k ] ].join(' ') ] = ( function( fixtureName, wordVersion, browser ) {
					return function() {
						var input,
							output,
							specialCaseOutput,
							inputPath = [ '_fixtures', fixtureName, wordVersion, browser ].join( '/' ) + '.html',
							outputPath = [ '_fixtures', fixtureName, '/expected.html' ].join( '/'),
							specialCasePath = [ '_fixtures', fixtureName, 'special_cases', wordVersion + '_' + browser ].join( '/' ) + '.html',
							that = this;

						var	test = function() {
							if ( input === null ) {
								assert.ignore();
							}

							if ( specialCaseOutput ) {
								testWordFilter( that.editor )( input, specialCaseOutput );
							} else {
								assert.isNotNull( output, '"expected.html" missing.' );

								testWordFilter( that.editor )( input, output );
							}
						};

						loadFixture( inputPath, function( inputContent ) {
							input = inputContent;

							loadFixture( outputPath, function( outputContent ) {
								output = outputContent;

								loadFixture( specialCasePath, function( specialCaseOutputContent ) {
									specialCaseOutput = specialCaseOutputContent;
									test();
								} );
							} );
						} );
					};
				} )( keys[ i ], wordVersions[ j ], browsers[ k ] );
			}
		}
	}

	bender.test( testData );
} )();
