/* bender-tags: editor, tableselection */
/* bender-ckeditor-plugins: entities,dialog,tabletools,clipboard,toolbar,tableselection */
/* bender-ckeditor-remove-plugins: basicstyles */
/* bender-include: ../../_helpers/tableselection.js */
/* global tableSelectionHelpers */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {}
		},

		inline: {
			creator: 'inline',
			config: {}
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		'test apply to/remove from multiple table cell selection': function( editor, editorBot ) {
			var selection = editor.getSelection(),
				ranges = [],
				style = new CKEDITOR.style( { element: 'i' } );

			editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'table' ).getValue() );
			ranges = tableSelectionHelpers.getRangesForCells( editor, [ 0, 1 ] );

			selection.selectRanges( ranges );

			style.apply( editor );

			assert.isTrue( !!selection.isFake, 'selection is fake' );
			assert.isTrue( selection.isInTable(), 'selection is in table' );
			assert.areSame( 2, selection.getRanges().length, 'all ranges are selected' );
			assert.beautified.html( CKEDITOR.document.getById( 'table-output' ).getValue(), editor.getData(),
				'test style apply to the editor' );

			style.remove( editor );

			assert.isTrue( !!selection.isFake, 'selection is fake' );
			assert.isTrue( selection.isInTable(), 'selection is in table' );
			assert.areSame( 2, selection.getRanges().length, 'all ranges are selected' );
			assert.beautified.html( CKEDITOR.document.getById( 'table' ).getValue(), editor.getData(),
				'test style remove from the editor' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
}() );
