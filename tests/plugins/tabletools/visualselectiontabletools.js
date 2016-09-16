/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			tableImprovements: true
		},
		allowedForTests: 'table[width];td[id]'
	};

	function getRangesForCells( editor, cellsIndexes ) {
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

	function markCells( ranges ) {
		var i;

		for ( i = 0; i < ranges.length; i++ ) {
			ranges[ i ].getEnclosedNode().addClass( 'cke_marked' );
		}
	}

	bender.test( {
		doTest: function( name, command, cellsIndexes, skipCheckingSelection ) {
			var bot = this.editorBot,
				editor = this.editor,
				ranges = [],
				output,
				afterRanges,
				i;

			bender.tools.testInputOut( name, function( source, expected ) {
				bot.setHtmlWithSelection( source );

				ranges = getRangesForCells( editor, cellsIndexes );
				editor.getSelection().selectRanges( ranges );
				// Mark selected cells to be able later to check if new selection
				// is containing the appropriate cells.
				markCells( ranges );

				bot.execCommand( command );

				output = bot.getData( true );
				output = output.replace( /\u00a0/g, '&nbsp;' );
				assert.areSame( bender.tools.compatHtml( expected ), output );

				if ( !skipCheckingSelection ) {
					afterRanges = editor.getSelection().getRanges();
					assert.isTrue( !!editor.getSelection().isFake, 'selection after is fake' );
					assert.isTrue( editor.getSelection().isInTable(), 'selection after is in table' );
					assert.areSame( ranges.length, afterRanges.length, 'appropriate number of ranges is selected' );

					for ( i = 0; i < ranges.length; i++ ) {
						assert.isTrue( afterRanges[ i ].getEnclosedNode().hasClass( 'cke_marked' ),
							'appropriate ranges are selected' );
					}
				}
			} );
		},

		'test insert row before': function() {
			this.doTest( 'add-row-before', 'rowInsertBefore', [ 0 ] );
			this.doTest( 'add-row-before-2', 'rowInsertBefore', [ 1 ] );
			this.doTest( 'add-row-before-3', 'rowInsertBefore', [ 0 ] );
			this.doTest( 'add-row-before-multi', 'rowInsertBefore', [ 0, 1 ] );
		},

		'test insert row after': function() {
			this.doTest( 'add-row-after', 'rowInsertAfter', [ 0 ] );
			this.doTest( 'add-row-after-2', 'rowInsertAfter', [ 1 ] );
			this.doTest( 'add-row-after-3', 'rowInsertAfter', [ 0 ] );
			this.doTest( 'add-row-after-multi', 'rowInsertAfter', [ 0, 1 ] );
		},

		'test insert col before': function() {
			this.doTest( 'add-col-before', 'columnInsertBefore', [ 0 ] );
			this.doTest( 'add-col-before-2', 'columnInsertBefore', [ 1 ] );
			this.doTest( 'add-col-before-3', 'columnInsertBefore', [ 0 ] );
			this.doTest( 'add-col-before-4', 'columnInsertBefore', [ 1 ] );
			this.doTest( 'add-col-before-multi', 'columnInsertBefore', [ 0, 1 ] );
			this.doTest( 'add-col-before-multi2', 'columnInsertBefore', [ 1 ] );
		},

		'test insert col after': function() {
			this.doTest( 'add-col-after', 'columnInsertAfter', [ 0 ] );
			this.doTest( 'add-col-after-2', 'columnInsertAfter', [ 1 ] );
			this.doTest( 'add-col-after-3', 'columnInsertAfter', [ 0 ] );
			this.doTest( 'add-col-after-4', 'columnInsertAfter', [ 1 ] );
			this.doTest( 'add-col-after-multi', 'columnInsertAfter', [ 0, 1 ] );
		},

		'test merge cells': function() {
			this.doTest( 'merge-cells', 'cellMerge', [ 0, 1, 2, 3, 4, 5 ], true );
			this.doTest( 'merge-cells-2', 'cellMerge', [ 0, 1 ], true );
			this.doTest( 'merge-cells-3', 'cellMerge', [ 2, 3, 5 ], true );
			this.doTest( 'merge-cells-5', 'cellMerge', [ 0, 1 ], true );
		},

		'test merge cells (4)': function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			this.doTest( 'merge-cells-4', 'cellMerge', [ 0, 1 ], true );
		},

		'test split cells': function() {
			this.doTest( 'split-cells', 'cellHorizontalSplit', [ 0 ], true );
			this.doTest( 'split-cells-2', 'cellHorizontalSplit', [ 3 ], true );
			this.doTest( 'split-cells-3', 'cellHorizontalSplit', [ 2 ], true );
			this.doTest( 'split-cells-4', 'cellVerticalSplit', [ 1 ], true );
			this.doTest( 'split-cells-5', 'cellVerticalSplit', [ 0 ], true );
			this.doTest( 'split-cells-6', 'cellVerticalSplit', [ 3 ], true );
		},

		'test merge one cell': function() {
			this.doTest( 'merge-cell-right', 'cellMergeRight', [ 0 ], true );
			this.doTest( 'merge-cell-down', 'cellMergeDown', [ 0 ], true );
			this.doTest( 'merge-cell-down-2', 'cellMergeDown', [ 1 ], true );
		},

		'test delete nested cells': function() {
			this.doTest( 'delete-nested-cells', 'cellDelete', [ 1, 2 ], true );
			this.doTest( 'delete-nested-cells-2', 'cellDelete', [ 2, 3 ], true );
			this.doTest( 'delete-nested-cells-3', 'cellDelete', [ 1, 2, 3, 4 ], true );
		},

		// (#10308, #11058)
		// To reproduce #11058 we need 4 rows in the table.
		'test remove row from middle row': function() {
			this.doTest( 'delete-row-from-middle', 'rowDelete', [ 1 ], true );
		},

		// (#10308)
		'test remove trailing column': function() {
			this.doTest( 'delete-column-trailing', 'columnDelete', [ 3 ], true );
		},

		// (#10308)
		'test remove trailing cell': function() {
			this.doTest( 'delete-cell-trailing', 'cellDelete', [ 3 ], true );
		}
	} );
} )();
