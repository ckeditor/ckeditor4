/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: undo,tableselection */
/* bender-include: ../../_helpers/tableselection.js */
/* global createPasteTestCase */

( function() {
	'use strict';

	bender.editors = {
		classic: {}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},

		'test doesnt break regular paste': function( editor ) {
			bender.tools.setHtmlWithSelection( editor, '<p>foo^bar</p>' );
			bender.tools.emulatePaste( editor, '<p>bam</p>' );

			editor.once( 'afterPaste', function() {
				resume( function() {
					assert.areSame( '<p>foobambar</p>', editor.getData() );
				} );
			} );

			wait();
		},

		// (#2945)
		'test paste into ignored table': function( editor, bot ) {
			var table;

			bender.tools.testInputOut( 'ignored', function( source, expected ) {
				editor.once( 'afterPaste', function() {
					resume( function() {
						bender.assert.beautified.html( expected, bender.tools.getHtmlWithSelection( editor ) );
					} );
				}, null, null, 999 );

				bot.setHtmlWithSelection( source );

				table = editor.editable().findOne( 'table' );

				table.data( 'cke-tableselection-ignored', 1 );

				// Use clone, so that pasted table does not have an ID.
				bender.tools.emulatePaste( editor, CKEDITOR.document.getById( '2cells1row' ).clone( true ).getOuterHtml() );

				wait();
			} );
		},

		'test merge row after': createPasteTestCase( 'merge-row-after', '2cells1row' ),

		'test merge row before': createPasteTestCase( 'merge-row-before', '2cells1row' ),

		'test merge multi rows after': createPasteTestCase( 'merge-rows-after', '2cells2rows' ),

		'test merge multi rows before': createPasteTestCase( 'merge-rows-before', '2cells2rows' ),

		'test merge multi rows after empty cell': createPasteTestCase( 'merge-rows-after-empty', '2cells2rows' ),

		'test merge multi rows before empty cell': createPasteTestCase( 'merge-rows-before-empty', '2cells2rows' ),

		'test table expansion on larger table': createPasteTestCase( 'merge-larger-table', '3cells3rows' ),

		'test partial paste doesnt cause merge': createPasteTestCase( 'dont-merge-partial-selection', '2cells1row' ),

		'test paste bigger table into a smaller selection': createPasteTestCase( 'merge-bigger-table', '3cells3rows' ),

		// This case includes some rowspan trickery.
		'test paste smaller table into a bigger selection edge case': createPasteTestCase( 'merge-smaller-table-edge', '3cells3rows' )
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
