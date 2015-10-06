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

	var engines = [
		'chrome',
		'internet_explorer',
		'firefox'
	];

	var compat = bender.tools.compatHtml;

	function testWordFilter( editor ) {
		return function( input, output ) {
			assertPasteEvent( editor, { dataValue: input },
				function( data, msg ) {
					assert.areSame( compat( output ).toLowerCase(), compat( data.dataValue ).toLowerCase(), msg );
				}, 'tc1', true );
		};
	}

	var testData = {};

	var fixtureNames = [
		'Bold.docx',
		'Colors.docx',
		'Fonts.docx',
		'Italic.docx',
		'Only_paragraphs.docx',
		'Ordered_list.docx',
		'Ordered_list_multiple.docx',
		'Ordered_list_multiple_edgy.docx',
		'Paragraphs_with_headers.docx',
		'Simple_table.docx',
		'Spacing.docx',
		'Text_alignment.docx',
		'Underline.docx',
		'Unordered_list.docx',
		'Unordered_list_multiple.docx'
	];

	var engineName;
	for ( var i = 0; i < fixtureNames.length; i++ ) {
		for ( var j = 0; j < engines.length; j++ ) {
			engineName = engines[ j ];

			testData[ 'test ' + fixtureNames[ i ] + ' ' + engineName ] = ( function( fixtureName ) {
				return function() {
					if ( !engineName )
						assert.ignore();

					bender.tools.testExternalInputOutput( '_assets/' + fixtureName + '_' + engineName + '.html', testWordFilter( this.editor ) );
				};
			} )( fixtureNames[ i ] );
		}
	}

	bender.test( testData );
} )();
