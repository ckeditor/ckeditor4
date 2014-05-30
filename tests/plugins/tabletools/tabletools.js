/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,toolbar */

( function() {
	'use strict';

	bender.editor = { config : {}, allowedForTests: 'table[width];td[id]' };

	bender.test(
	{
		doTest : function( name, command ) {
			var bot = this.editorBot;
			bender.tools.testInputOut( name, function( source, expected ) {
				bot.setHtmlWithSelection( source );
				bot.execCommand( command );

				var output = bot.getData( true );
				output = output.replace( /\u00a0/g, '&nbsp;' );
				assert.areSame( bender.tools.compatHtml( expected ), output )
			} )
		},

		'test insert row before': function() {
			this.doTest( 'add-row-before', 'rowInsertBefore' );
			this.doTest( 'add-row-before-2', 'rowInsertBefore' );
			this.doTest( 'add-row-before-3', 'rowInsertBefore' );
			this.doTest( 'add-row-before-multi', 'rowInsertBefore' );
		},

		'test insert row after': function() {
			this.doTest( 'add-row-after', 'rowInsertAfter' );
			this.doTest( 'add-row-after-2', 'rowInsertAfter' );
			this.doTest( 'add-row-after-3', 'rowInsertAfter' );
			this.doTest( 'add-row-after-multi', 'rowInsertAfter' );
		},

		'test insert col before': function() {
			this.doTest( 'add-col-before', 'columnInsertBefore' );
			this.doTest( 'add-col-before-2', 'columnInsertBefore' );
			this.doTest( 'add-col-before-3', 'columnInsertBefore' );
			this.doTest( 'add-col-before-4', 'columnInsertBefore' );
			this.doTest( 'add-col-before-multi', 'columnInsertBefore' );
			this.doTest( 'add-col-before-multi2', 'columnInsertBefore' );
		},

		'test insert col after': function() {
			this.doTest( 'add-col-after', 'columnInsertAfter' );
			this.doTest( 'add-col-after-2', 'columnInsertAfter' );
			this.doTest( 'add-col-after-3', 'columnInsertAfter' );
			this.doTest( 'add-col-after-4', 'columnInsertAfter' );
			this.doTest( 'add-col-after-multi', 'columnInsertAfter' );
		},

		'test merge cells': function() {
			this.doTest( 'merge-cells', 'cellMerge' );
		},

		'test merge cells (2)': function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			this.doTest( 'merge-cells-2', 'cellMerge' );
		},

		'test merge cells (3)': function() {
			this.doTest( 'merge-cells-3', 'cellMerge' );
		},

		'test merge cells (4)': function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			this.doTest( 'merge-cells-4', 'cellMerge' );
		},

		'test merge cells (5)': function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			this.doTest( 'merge-cells-5', 'cellMerge' );
		},

		'test merge cells (6)': function() {
			this.doTest( 'merge-cells-6', 'cellMerge' );
		},

		'test split cells': function() {
			this.doTest( 'split-cells', 'cellVerticalSplit' );
		},

		'test split cells (2)': function() {
			this.doTest( 'split-cells-2', 'cellVerticalSplit' );
		},

		'test split cells (3)': function() {
			this.doTest( 'split-cells-3', 'cellVerticalSplit' );
		},

		'test split cells (4)': function() {
			this.doTest( 'split-cells-4', 'cellHorizontalSplit' );
		},

		'test split cells (5)': function() {
			this.doTest( 'split-cells-5', 'cellHorizontalSplit' );
		},

		'test split cells (6)': function() {
			this.doTest( 'split-cells-6', 'cellHorizontalSplit' );
		},

		'test split cells (7)': function() {
			var bot = this.editorBot;
			bender.tools.testInputOut( 'split-cells-7', function( source, expected ) {
				bot.setHtmlWithSelection( source );
				bot.execCommand( 'cellVerticalSplit' );

				var range = new CKEDITOR.dom.range( bot.editor.document );
				range.moveToPosition( bot.editor.document.getById( 'cursor' ), CKEDITOR.POSITION_AFTER_START );
				range.select();

				bot.execCommand( 'cellHorizontalSplit' );
				assert.areSame( bender.tools.compatHtml( expected ), bot.getData( true ) );
			} )
		},

		// (#11438)
		'test split cells (8)': function() {
			this.doTest( 'split-cells-8', 'cellVerticalSplit' );
		},

		'test split cells (9)': function() {
			this.doTest( 'split-cells-9', 'cellVerticalSplit' );
		},

		// (#6111)
		'test merge one cell': function() {
			this.doTest( 'merge-cell-right', 'cellMergeRight' );
			this.doTest( 'merge-cell-down', 'cellMergeDown' );
		},

		// (#6228)
		'test merge one cell (2)': function() {
			this.doTest( 'merge-cell-down-2', 'cellMergeDown' );
		},

		// (#8675)
		'test delete nested cells': function() {
			this.doTest( 'delete-nested-cells', 'cellDelete' );
		},

		// (#8675)
		'test delete nested cells (2)': function() {
			this.doTest( 'delete-nested-cells-2', 'cellDelete' );
		},

		// (#8675)
		// Check if moveOutOfCellGuard works as expected.
		'test delete nested cells (3)': function() {
			this.doTest( 'delete-nested-cells-3', 'cellDelete' );
		},

		// (#8675)
		// Test th and caption handling while deleting cells.
		'test delete nested cells (4)': function() {
			this.doTest( 'delete-nested-cells-4', 'cellDelete' );
		},

		// (#10308, #11058)
		// To reproduce #11058 we need 4 rows in the table.
		'test remove row from middle row': function() {
			this.doTest( 'delete-row-from-middle', 'rowDelete' );
		},

		// (#10308)
		'test remove trailing column': function() {
			this.doTest( 'delete-column-trailing', 'columnDelete' );
		},

		// (#10308)
		'test remove trailing cell': function() {
			this.doTest( 'delete-cell-trailing', 'cellDelete' );
		}
	} );
} )();