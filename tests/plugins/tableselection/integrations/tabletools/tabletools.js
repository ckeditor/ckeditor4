/* bender-tags: tableselection, tabletools */
/* bender-ckeditor-plugins: entities,dialog,tableselection,toolbar,undo,floatingspace */
/* bender-include: ../../_helpers/tableselection.js,../../../undo/_helpers/tools.js */
/* global doCommandTest */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {},
			allowedForTests: 'table[width];td[id]'
		},

		inline: {
			config: {},
			allowedForTests: 'table[width];td[id]',
			creator: 'inline'
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		'test insert row before': function( editor, bot ) {
			doCommandTest( bot, 'rowInsertBefore', { 'case': 'add-row-before', cells: [ 0 ] } );
			doCommandTest( bot, 'rowInsertBefore', { 'case': 'add-row-before-2', cells: [ 1 ] } );
			doCommandTest( bot, 'rowInsertBefore', { 'case': 'add-row-before-3', cells: [ 0 ] } );
			doCommandTest( bot, 'rowInsertBefore', { 'case': 'add-row-before-multi', cells: [ 0, 1 ] } );
		},

		'test insert row after': function( editor, bot ) {
			doCommandTest( bot, 'rowInsertAfter', { 'case': 'add-row-after', cells: [ 0 ] } );
			doCommandTest( bot, 'rowInsertAfter', { 'case': 'add-row-after-2', cells: [ 1 ] } );
			doCommandTest( bot, 'rowInsertAfter', { 'case': 'add-row-after-3', cells: [ 0 ] } );
			doCommandTest( bot, 'rowInsertAfter', { 'case': 'add-row-after-multi', cells: [ 0, 1 ] } );
		},

		'test insert col before': function( editor, bot ) {
			doCommandTest( bot, 'columnInsertBefore', { 'case': 'add-col-before', cells: [ 0 ] } );
			doCommandTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-2', cells: [ 1 ] } );
			doCommandTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-3', cells: [ 0 ] } );
			doCommandTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-4', cells: [ 1 ] } );
			doCommandTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-multi', cells: [ 0, 1 ] } );
			doCommandTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-multi2', cells: [ 1 ] } );

			// (#591)
			doCommandTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-vertical-split', cells: [ 3 ] } );
		},

		'test insert col after': function( editor, bot ) {
			doCommandTest( bot, 'columnInsertAfter', { 'case': 'add-col-after', cells: [ 0 ] } );
			doCommandTest( bot, 'columnInsertAfter', { 'case': 'add-col-after-2', cells: [ 1 ] } );
			doCommandTest( bot, 'columnInsertAfter', { 'case': 'add-col-after-3', cells: [ 0 ] } );
			doCommandTest( bot, 'columnInsertAfter', { 'case': 'add-col-after-4', cells: [ 1 ] } );
			doCommandTest( bot, 'columnInsertAfter', { 'case': 'add-col-after-multi', cells: [ 0, 1 ] } );
		},

		'test merge cells': function( editor, bot ) {
			doCommandTest( bot, 'cellMerge', { 'case': 'merge-cells', cells: [ 0, 1, 2, 3, 4, 5 ] } );
			doCommandTest( bot, 'cellMerge', { 'case': 'merge-cells-2', cells: [ 0, 1 ] } );
			doCommandTest( bot, 'cellMerge', { 'case': 'merge-cells-3', cells: [ 2, 3, 5 ] } );
			doCommandTest( bot, 'cellMerge', { 'case': 'merge-cells-5', cells: [ 0, 1 ] } );
		},

		'test merge cells (4)': function( editor, bot ) {
			if ( !CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			doCommandTest( bot, 'cellMerge', { 'case': 'merge-cells-4', cells: [ 0, 1 ] } );
		},

		'test split cells': function( editor, bot ) {
			doCommandTest( bot, 'cellHorizontalSplit', { 'case': 'split-cells', cells: [ 0 ], skipCheckingSelection: true } );
			doCommandTest( bot, 'cellHorizontalSplit', { 'case': 'split-cells-2', cells: [ 3 ], skipCheckingSelection: true } );
			doCommandTest( bot, 'cellHorizontalSplit', { 'case': 'split-cells-3', cells: [ 2 ], skipCheckingSelection: true } );
			doCommandTest( bot, 'cellVerticalSplit', { 'case': 'split-cells-4', cells: [ 1 ], skipCheckingSelection: true } );
			doCommandTest( bot, 'cellVerticalSplit', { 'case': 'split-cells-5', cells: [ 0 ], skipCheckingSelection: true } );
			doCommandTest( bot, 'cellVerticalSplit', { 'case': 'split-cells-6', cells: [ 3 ], skipCheckingSelection: true } );
		},

		'test merge one cell': function( editor, bot ) {
			doCommandTest( bot, 'cellMergeRight', { 'case': 'merge-cell-right', cells: [ 0 ] } );
			doCommandTest( bot, 'cellMergeDown', { 'case': 'merge-cell-down', cells: [ 0 ] } );
			doCommandTest( bot, 'cellMergeDown', { 'case': 'merge-cell-down-2', cells: [ 1 ] } );
		},

		'test merge one cell (collapsed selection)': function( editor, bot ) {
			doCommandTest( bot, 'cellMergeRight', { 'case': 'merge-cell-right' } );
			doCommandTest( bot, 'cellMergeDown', { 'case': 'merge-cell-down' } );
			doCommandTest( bot, 'cellMergeDown', { 'case': 'merge-cell-down-2' } );
		},

		'test delete nested cells': function( editor, bot ) {
			doCommandTest( bot, 'cellDelete', { 'case': 'delete-nested-cells', cells: [ 1, 2 ], skipCheckingSelection: true } );
			doCommandTest( bot, 'cellDelete', { 'case': 'delete-nested-cells-2', cells: [ 2, 3 ], skipCheckingSelection: true } );

			// Test fails due to issue in the Safari (#4306).
			if ( !CKEDITOR.env.safari ) {
				doCommandTest( bot, 'cellDelete', { 'case': 'delete-nested-cells-3', cells: [ 1, 2, 3, 4 ], skipCheckingSelection: true } );
			}
		},

		// To reproduce https://dev.ckeditor.com/ticket/11058 we need 4 rows
		// in the table (https://dev.ckeditor.com/ticket/10308, https://dev.ckeditor.com/ticket/11058).
		'test remove row from middle row': function( editor, bot ) {
			doCommandTest( bot, 'rowDelete', { 'case': 'delete-row-from-middle', cells: [ 1 ], skipCheckingSelection: true } );
		},

		'test remove all rows': function( editor, bot ) {
			doCommandTest( bot, 'rowDelete', { 'case': 'delete-all-cells', cells: [ 0, 1, 2, 3 ], skipCheckingSelection: true } );
		},

		'test remove all rows partial selection': function( editor, bot ) {
			doCommandTest( bot, 'rowDelete', { 'case': 'delete-all-cells', cells: [ 0, 2 ], skipCheckingSelection: true } );
		},

		// (https://dev.ckeditor.com/ticket/10308)
		'test remove trailing column': function( editor, bot ) {
			doCommandTest( bot, 'columnDelete', { 'case': 'delete-column-trailing', cells: [ 3 ], skipCheckingSelection: true } );
		},

		// (https://dev.ckeditor.com/ticket/10308)
		'test remove trailing cell': function( editor, bot ) {
			doCommandTest( bot, 'cellDelete', { 'case': 'delete-cell-trailing', cells: [ 3 ], skipCheckingSelection: true } );
		},

		'test getSelectedCells restricted to the given table': function( editor, bot ) {
			var editable = editor.editable(),
				table,
				expectedCells,
				selectedCells;

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getSelectedCells-nested' ).getValue() );

			table = editable.findOne( '#inner' );
			expectedCells = table.find( 'td' );

			editor.getSelection().selectElement( table );

			selectedCells = CKEDITOR.plugins.tabletools.getSelectedCells( editor.getSelection(), table );

			assert.isArray( selectedCells );
			assert.areSame( 2, selectedCells.length );

			assert.isTrue( expectedCells.getItem( 0 ).equals( selectedCells[ 0 ] ) );
			assert.isTrue( expectedCells.getItem( 1 ).equals( selectedCells[ 1 ] ) );
		},

		// (#tp-2217)
		'test getSelectedCells for nested table header cell': function( editor, bot ) {
			var editable = editor.editable(),
				table,
				expectedCell,
				selectedCells;

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getSelectedCells-nestedHeader' ).getValue() );

			table = editable.findOne( '#inner' );
			expectedCell = table.findOne( 'th' );

			editor.getSelection().selectElement( expectedCell );

			selectedCells = CKEDITOR.plugins.tabletools.getSelectedCells( editor.getSelection() );

			assert.isArray( selectedCells );
			assert.areSame( 1, selectedCells.length, 'Only header is selected.' );

			assert.isTrue( expectedCell.equals( selectedCells[ 0 ] ), 'Correct table cell is selected.' );
		},

		'test getSelectedCells API': function() {
			arrayAssert.itemsAreEqual( [], CKEDITOR.plugins.tabletools.getSelectedCells( null ), 'Return for null' );

			var emptySelectionMock = { getRanges: sinon.stub().returns( [ ] ) };

			arrayAssert.itemsAreEqual( [], CKEDITOR.plugins.tabletools.getSelectedCells( emptySelectionMock ), 'Ret for empty range list' );
		},

		'test delete all cells': function( editor, bot ) {
			doCommandTest( bot, 'cellDelete', { 'case': 'delete-all-cells', cells: [ 0, 1, 2, 3 ], skipCheckingSelection: true } );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	// Ignores for Edge (#1944).
	var shouldIgnore = CKEDITOR.env.edge;
	tests._should = tests._should || {};
	tests._should.ignore = tests._should.ignore || {};
	tests._should.ignore[ 'test merge cells (classic)' ] = shouldIgnore;
	tests._should.ignore[ 'test merge cells (inline)' ] = shouldIgnore;
	tests._should.ignore[ 'test merge one cell (classic)' ] = shouldIgnore;
	tests._should.ignore[ 'test merge one cell (inline)' ] = shouldIgnore;
	tests._should.ignore[ 'test merge one cell (collapsed selection) (classic)' ] = shouldIgnore;
	tests._should.ignore[ 'test merge one cell (collapsed selection) (inline)' ] = shouldIgnore;
	tests._should.ignore[ 'test delete nested cells (classic)' ] = shouldIgnore;
	tests._should.ignore[ 'test delete nested cells (inline)' ] = shouldIgnore;

	bender.test( tests );
} )();
