/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,toolbar,floatingspace */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				tableImprovements: true
			},
			allowedForTests: 'table[width];td[id]'
		},

		inline: {
			config: {
				tableImprovements: true
			},
			allowedForTests: 'table[width];td[id]',
			creator: 'inline'
		}
	};

	function getTableElementFromRange( range ) {
		var tableElements = {
				table: 1,
				tbody: 1,
				tr: 1,
				td: 1,
				th: 1
			},
			start = range.startContainer;

		if ( range.getEnclosedNode() ) {
			return range.getEnclosedNode().getAscendant( tableElements, true );
		}

		return start.getAscendant( tableElements, true );
	}

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
			getTableElementFromRange( ranges[ i ] ).addClass( 'cke_marked' );
		}
	}

	function prepareFocusFrame() {
		// prepare focus iframe
		var frame = CKEDITOR.document.findOne( '#focusIframe' );
		frame.getFrameDocument().write( '<div contenteditable="true">foo</div>' );
	}

	function doTest( editor, bot, name, command, cellsIndexes, skipCheckingSelection ) {
		var ranges = [],
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
					assert.isTrue( getTableElementFromRange( afterRanges[ i ] ).hasClass( 'cke_marked' ),
						'appropriate ranges are selected' );
				}
			}
		} );
	}

	var tests = {
		'test insert row before': function( editor, bot ) {
			doTest( editor, bot, 'add-row-before', 'rowInsertBefore', [ 0 ] );
			doTest( editor, bot, 'add-row-before-2', 'rowInsertBefore', [ 1 ] );
			doTest( editor, bot, 'add-row-before-3', 'rowInsertBefore', [ 0 ] );
			doTest( editor, bot, 'add-row-before-multi', 'rowInsertBefore', [ 0, 1 ] );
		},

		'test insert row after': function( editor, bot ) {
			doTest( editor, bot, 'add-row-after', 'rowInsertAfter', [ 0 ] );
			doTest( editor, bot, 'add-row-after-2', 'rowInsertAfter', [ 1 ] );
			doTest( editor, bot, 'add-row-after-3', 'rowInsertAfter', [ 0 ] );
			doTest( editor, bot, 'add-row-after-multi', 'rowInsertAfter', [ 0, 1 ] );
		},

		'test insert col before': function( editor, bot ) {
			doTest( editor, bot, 'add-col-before', 'columnInsertBefore', [ 0 ] );
			doTest( editor, bot, 'add-col-before-2', 'columnInsertBefore', [ 1 ] );
			doTest( editor, bot, 'add-col-before-3', 'columnInsertBefore', [ 0 ] );
			doTest( editor, bot, 'add-col-before-4', 'columnInsertBefore', [ 1 ] );
			doTest( editor, bot, 'add-col-before-multi', 'columnInsertBefore', [ 0, 1 ] );
			doTest( editor, bot, 'add-col-before-multi2', 'columnInsertBefore', [ 1 ] );
		},

		'test insert col after': function( editor, bot ) {
			doTest( editor, bot, 'add-col-after', 'columnInsertAfter', [ 0 ] );
			doTest( editor, bot, 'add-col-after-2', 'columnInsertAfter', [ 1 ] );
			doTest( editor, bot, 'add-col-after-3', 'columnInsertAfter', [ 0 ] );
			doTest( editor, bot, 'add-col-after-4', 'columnInsertAfter', [ 1 ] );
			doTest( editor, bot, 'add-col-after-multi', 'columnInsertAfter', [ 0, 1 ] );
		},

		'test merge cells': function( editor, bot ) {
			doTest( editor, bot, 'merge-cells', 'cellMerge', [ 0, 1, 2, 3, 4, 5 ], true );
			doTest( editor, bot, 'merge-cells-2', 'cellMerge', [ 0, 1 ], true );
			doTest( editor, bot, 'merge-cells-3', 'cellMerge', [ 2, 3, 5 ], true );
			doTest( editor, bot, 'merge-cells-5', 'cellMerge', [ 0, 1 ], true );
		},

		'test merge cells (4)': function( editor, bot ) {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			doTest( editor, bot, 'merge-cells-4', 'cellMerge', [ 0, 1 ], true );
		},

		'test split cells': function( editor, bot ) {
			doTest( editor, bot, 'split-cells', 'cellHorizontalSplit', [ 0 ], true );
			doTest( editor, bot, 'split-cells-2', 'cellHorizontalSplit', [ 3 ], true );
			doTest( editor, bot, 'split-cells-3', 'cellHorizontalSplit', [ 2 ], true );
			doTest( editor, bot, 'split-cells-4', 'cellVerticalSplit', [ 1 ], true );
			doTest( editor, bot, 'split-cells-5', 'cellVerticalSplit', [ 0 ], true );
			doTest( editor, bot, 'split-cells-6', 'cellVerticalSplit', [ 3 ], true );
		},

		'test merge one cell': function( editor, bot ) {
			doTest( editor, bot, 'merge-cell-right', 'cellMergeRight', [ 0 ], true );
			doTest( editor, bot, 'merge-cell-down', 'cellMergeDown', [ 0 ], true );
			doTest( editor, bot, 'merge-cell-down-2', 'cellMergeDown', [ 1 ], true );
		},

		'test delete nested cells': function( editor, bot ) {
			doTest( editor, bot, 'delete-nested-cells', 'cellDelete', [ 1, 2 ], true );
			doTest( editor, bot, 'delete-nested-cells-2', 'cellDelete', [ 2, 3 ], true );
			doTest( editor, bot, 'delete-nested-cells-3', 'cellDelete', [ 1, 2, 3, 4 ], true );
		},

		// (#10308, #11058)
		// To reproduce #11058 we need 4 rows in the table.
		'test remove row from middle row': function( editor, bot ) {
			doTest( editor, bot, 'delete-row-from-middle', 'rowDelete', [ 1 ], true );
		},

		// (#10308)
		'test remove trailing column': function( editor, bot ) {
			doTest( editor, bot, 'delete-column-trailing', 'columnDelete', [ 3 ], true );
		},

		// (#10308)
		'test remove trailing cell': function( editor, bot ) {
			doTest( editor, bot, 'delete-cell-trailing', 'cellDelete', [ 3 ], true );
		},

		'test getCellsBetween': function( editor, bot ) {
			var editable = editor.editable(),
				first,
				last,
				cells;

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getCellsBetween' ).getValue() );

			first = editable.findOne( '#first' );
			last = editable.findOne( '#last' );

			cells = CKEDITOR.plugins.tabletools.getCellsBetween( first, last );

			assert.isTrue( CKEDITOR.tools.isArray( cells ) );
			assert.areSame( 4, cells.length );

			assert.isTrue( first.equals( cells[ 0 ] ) );
			assert.isTrue( editable.findOne( '#second' ).equals( cells[ 1 ] ) );
			assert.isTrue( editable.findOne( '#third' ).equals( cells[ 2 ] ) );
			assert.isTrue( last.equals( cells[ 3 ] ) );
		},

		'test getCellsBetween (reversed)': function( editor, bot ) {
			var editable = editor.editable(),
				first,
				last,
				cells;

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getCellsBetween' ).getValue() );

			first = editable.findOne( '#first' );
			last = editable.findOne( '#last' );

			cells = CKEDITOR.plugins.tabletools.getCellsBetween( last, first );

			assert.isTrue( CKEDITOR.tools.isArray( cells ) );
			assert.areSame( 4, cells.length );

			assert.isTrue( first.equals( cells[ 0 ] ) );
			assert.isTrue( editable.findOne( '#second' ).equals( cells[ 1 ] ) );
			assert.isTrue( editable.findOne( '#third' ).equals( cells[ 2 ] ) );
			assert.isTrue( last.equals( cells[ 3 ] ) );
		},

		'Simulating merge cells from context menu ': function( editor ) {
			var selection = editor.getSelection(),
				expected = '<table><tbody><tr><td>Cell 1.1</td><td rowspan="2">Cell 1.2<br />Cell 2.2</td>' +
					'<td>Cell 1.3</td></tr><tr><td>Cell 2.1</td><td>Cell 2.3</td></tr></tbody></table>',
				realSelection,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Stub reset method to prevent overwriting fake selection on selectRanges.
			sinon.stub( CKEDITOR.dom.selection.prototype, 'reset' );

			// We must restore this method before any other selectionchange listeners
			// to be sure that selectionchange works as intended.
			editor.editable().once( 'selectionchange', function() {
				CKEDITOR.dom.selection.prototype.reset.restore();
			}, null, null, -2 );

			realSelection = editor.getSelection( 1 );
			range = getRangesForCells( editor, [ 2 ] ) [ 0 ];

			range.collapse();
			realSelection.selectRanges( [ range ] );

			editor.editable().fire( 'contextmenu', new CKEDITOR.dom.event( {
				target: editor.editable().find( 'table td' ).getItem( 2 ).$
			} ) );

			editor.once( 'menuShow', function( evt ) {
				resume( function() {
					evt.data[ 0 ].focus();

					editor.execCommand( 'cellMerge' );

					assert.isTrue( !!selection.isFake, 'isFake is set' );
					assert.isTrue( selection.isInTable(), 'isInTable is true' );
					assert.areSame( 1, selection.getRanges().length, 'New selection ranges count' );
					assert.isNull( selection.getNative(), 'getNative() should be null' );
					assert.isNotNull( selection.getSelectedText(), 'getSelectedText() should not be null' );

					assert.areSame( expected, editor.getData(), 'Editor data' );
				} );
			} );

			wait();
		},

		'test refocusing the editor': function( editor ) {
			var ranges,
				contentCells;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			contentCells = editor.editable().find( 'td' );

			ranges = getRangesForCells( editor, [ 1, 4 ] );
			editor.getSelection().selectRanges( ranges );

			// Now, the we want to move the focus into a nested iframe, so that we guarantee putting focus into another document. This will
			// force blur event inside of the editor.
			CKEDITOR.document.findOne( '#focusIframe' ).getFrameDocument().findOne( 'div' ).focus();

			editor.focus();
			// Make sure inline editable is focused.
			editor.editable().$.focus();

			// Now time to assert.
			ranges = editor.getSelection().getRanges();

			assert.areSame( 2, ranges.length, 'Range count' );
			assert.isTrue( ranges[ 0 ].getEnclosedNode().equals( contentCells.getItem( 1 ) ), 'Range[ 0 ] encloses correct element' );
			assert.isTrue( ranges[ 1 ].getEnclosedNode().equals( contentCells.getItem( 4 ) ), 'Range[ 1 ] encloses correct element' );

			// Check the real selection.
			// var realSelection = editor.getSelection( 1 ),
			// 	realRanges = realSelection.getRanges(),
			// 	realRangePath = realRanges[ 0 ].startPath();

			// This fails for the time being - the reason is that during auto fake selection upcasting, focus goes into a hidden fake selection
			// container.
			// assert.isNotNull( realRangePath.contains( contentCells.getItem( 1 ) ), 'Real range start is contained within proper element' );
		}
	};

	// Prepare focus iframe before starting tests.
	prepareFocusFrame();

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
