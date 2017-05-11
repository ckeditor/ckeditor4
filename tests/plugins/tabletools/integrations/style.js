/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,clipboard,toolbar */
/* bender-include: ../_helpers/tabletools.js */
/* global tableToolsHelpers */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				tableImprovements: true
			}
		},

		inline: {
			creator: 'inline',
			config: {
				tableImprovements: true
			}
		}
	};

	var tests = {
		'test apply to/remove from multiple table cell selection': function( editor, editorBot ) {
			var selection = editor.getSelection(),
				ranges = [],
				style = new CKEDITOR.style( { element: 'i' } );

			editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'table' ).getValue() );
			ranges = tableToolsHelpers.getRangesForCells( editor, [ 0, 1 ] );

			selection.selectRanges( ranges );

			style.apply( editor );

			assert.isTrue( !!selection.isFake, 'selection is fake' );
			assert.isTrue( selection.isInTable(), 'selection is in table' );
			assert.areSame( 2, selection.getRanges().length, 'all ranges are selected' );
			assert.areSame( bender.tools.compatHtml( CKEDITOR.document.getById( 'table-output' ).getValue(), 0, 0, 1 ),
				editor.getData(), 'test style apply to the editor' );

			style.remove( editor );

			assert.isTrue( !!selection.isFake, 'selection is fake' );
			assert.isTrue( selection.isInTable(), 'selection is in table' );
			assert.areSame( 2, selection.getRanges().length, 'all ranges are selected' );
			assert.areSame( bender.tools.compatHtml( CKEDITOR.document.getById( 'table' ).getValue(), 0, 0, 1 ),
				editor.getData(), 'test style remove from the editor' );
		}
	};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
}() );
