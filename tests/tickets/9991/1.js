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
			'Colors': true,
			'Fonts': true,
			'Italic': true,
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
		keys = CKEDITOR.tools.objectKeys( tests ),
		testData = {};

	for ( var i = 0; i < keys.length; i++ ) {

		for ( var j = 0; j < wordVersions.length; j++ ) {
			for ( var k = 0; k < browsers.length; k++ ) {

				// Callback hell |m|,
				testData[ 'test ' + keys[ i ] + ' ' + wordVersions[ j ] + ' ' + browsers[ k ] ] = ( function( fixtureName, wordVersion, browser ) {
					return function() {
						var that = this;

						loadFixture( [ '_fixtures', fixtureName, wordVersion, browser ].join( '/' ) + '.html', function( input ) {
							if ( input === null ) {
								assert.ignore();
							}

							loadFixture( [ '_fixtures', fixtureName, 'special_cases', wordVersion + '_' + browser ].join( '/' ) + '.html' , function( output ) {
								if ( output === null ) {
									loadFixture( '_fixtures/' + fixtureName + '/expected.html' , function( output ) {
										if ( output === null ) {
											assert.ignore();
										}

										testWordFilter( that.editor )( input, output );
									} );
								} else {
									testWordFilter( that.editor )( input, output );
								}
							} );
						} );
					};
				} )( keys[ i ], wordVersions[ j ], browsers[ k ] );
			}
		}
	}

	bender.test( testData );
} )();
