/* exported tableToolsHelpers, createPasteTestCase */

( function() {
	'use strict';

	window.tableToolsHelpers = {
		getRangesForCells: function( editor, cellsIndexes ) {
			var ranges = [],
				cells = editor.editable().find( 'td, th' ),
				range,
				cell,
				i;

			for ( i = 0; i < cellsIndexes.length; i++ ) {
				range = editor.createRange();
				cell = cells.getItem( cellsIndexes[ i ] );

				range.setStartBefore( cell );
				range.setEndAfter( cell );

				ranges.push( range );
			}

			return ranges;
		}
	};

	function shrinkSelections( editor ) {
		// Shrinks each range into it's inner element, so that range markers are not outside `td` elem.
		var ranges = editor.getSelection().getRanges(),
			i;

		for ( i = 0; i < ranges.length; i++ ) {
			ranges[ i ].shrink( CKEDITOR.SHRINK_TEXT, false );
		}
	}

	/*
	 * Returns a function that will set editor's content to fixtureId, and will emulate paste
	 * of pasteFixtureId into it.
	 */
	window.createPasteTestCase = function( fixtureId, pasteFixtureId ) {
		return function( editor, bot ) {
			bender.tools.testInputOut( fixtureId, function( source, expected ) {
				editor.once( 'paste', function() {
					resume( function() {
						shrinkSelections( editor );
						bender.assert.beautified.html( expected, bender.tools.getHtmlWithSelection( editor ) );
					} );
				}, null, null, 1 );

				bot.setHtmlWithSelection( source );

				bender.tools.emulatePaste( editor, CKEDITOR.document.getById( pasteFixtureId ).getOuterHtml() );

				wait();
			} );
		};
	};
} )();
