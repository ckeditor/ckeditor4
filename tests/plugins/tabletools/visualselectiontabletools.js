/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,toolbar,undo,floatingspace */
/* bender-include: _helpers/tabletools.js,../undo/_helpers/tools.js */
/* global tableToolsHelpers, undoEventDispatchTestsTools */

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

	var getRangesForCells = tableToolsHelpers.getRangesForCells;

	function _getTableElementFromRange( range ) {
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

	/*
	 * Adds a class to selected cells in editable, so that it can be compared in assertions.
	 *
	 * @param {CKEDITOR.dom.range} ranges[] Ranges which cells should be marked.
	 * @param {boolean} [addSelected] Whether to apply `selected` class instead `cke_marked` to the selected cells.
	 */
	function markCells( ranges, addSelected ) {
		var i;

		for ( i = 0; i < ranges.length; i++ ) {
			_getTableElementFromRange( ranges[ i ] ).addClass( addSelected ? 'selected' : 'cke_marked' );
		}
	}

	function prepareFocusFrame() {
		// prepare focus iframe
		var frame = CKEDITOR.document.findOne( '#focusIframe' );
		frame.getFrameDocument().write( '<div contenteditable="true">foo</div>' );
	}

	/*
	 *
	 * @param {Object} bot Editor bot object.
	 * @param {String/Function} action If string: editor command name to be executed. If string simply a function to be
	 * called before the assertion.
	 * @param {Object} options
	 * @param {String} options.case **Required** - id of element provided to `bender.tools.testInputOut`.
	 * @param {Number[]} [options.cells] Indexes of cells to be selected before executing `action`.
	 * @param {Boolean} [options.markCells] Whether selected cells should get `'selected'` class in the output.
	 * @param {Function} [options.customCheck] Custom assertion. Gets editor as an argument.
	 * @param {Boolean} [options.skipCheckingSelection] If `true` no selection will be chekced.
	 */
	function doTest( bot, action, options ) {
		var editor = bot.editor,
			ranges = [],
			output,
			afterRanges,
			i;

		bender.tools.testInputOut( options[ 'case' ], function( source, expected ) {
			bot.setHtmlWithSelection( source );

			if ( options.cells ) {
				ranges = getRangesForCells( editor, options.cells );
				editor.getSelection().selectRanges( ranges );
				markCells( ranges );
			}

			if ( typeof action == 'string' ) {
				bot.execCommand( action );
			} else {
				action();
				ranges = editor.getSelection().getRanges();
			}

			if ( options.markCells ) {
				// Mark selected cells to be able later to check if new selection
				// is containing the appropriate cells.
				markCells( ranges, options.markCells );
			}

			output = bot.getData( true );
			output = output.replace( /\u00a0/g, '&nbsp;' );
			assert.beautified.html( expected, output );

			if ( options.customCheck ) {
				options.customCheck( editor );
			} else if ( !options.skipCheckingSelection ) {
				afterRanges = editor.getSelection().getRanges();
				assert.isTrue( !!editor.getSelection().isFake, 'selection after is fake' );
				assert.isTrue( editor.getSelection().isInTable(), 'selection after is in table' );

				if ( typeof action != 'string' || action.toLowerCase().indexOf( 'merge' ) === -1 ) {
					assert.areSame( ranges.length, afterRanges.length, 'appropriate number of ranges is selected' );

					for ( i = 0; i < ranges.length; i++ ) {
						assert.isTrue( _getTableElementFromRange( afterRanges[ i ] ).hasClass( 'cke_marked' ),
							'appropriate ranges are selected' );
					}
				} else {
					assert.areSame( 1, afterRanges.length, 'appropriate number of ranges is selected' );
				}
			}
		} );
	}

	var tests = {
		'test insert row before': function( editor, bot ) {
			doTest( bot, 'rowInsertBefore', { 'case': 'add-row-before', cells: [ 0 ] } );
			doTest( bot, 'rowInsertBefore', { 'case': 'add-row-before-2', cells: [ 1 ] } );
			doTest( bot, 'rowInsertBefore', { 'case': 'add-row-before-3', cells: [ 0 ] } );
			doTest( bot, 'rowInsertBefore', { 'case': 'add-row-before-multi', cells: [ 0, 1 ] } );
		},

		'test insert row after': function( editor, bot ) {
			doTest( bot, 'rowInsertAfter', { 'case': 'add-row-after', cells: [ 0 ] } );
			doTest( bot, 'rowInsertAfter', { 'case': 'add-row-after-2', cells: [ 1 ] } );
			doTest( bot, 'rowInsertAfter', { 'case': 'add-row-after-3', cells: [ 0 ] } );
			doTest( bot, 'rowInsertAfter', { 'case': 'add-row-after-multi', cells: [ 0, 1 ] } );
		},

		'test insert col before': function( editor, bot ) {
			doTest( bot, 'columnInsertBefore', { 'case': 'add-col-before', cells: [ 0 ] } );
			doTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-2', cells: [ 1 ] } );
			doTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-3', cells: [ 0 ] } );
			doTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-4', cells: [ 1 ] } );
			doTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-multi', cells: [ 0, 1 ] } );
			doTest( bot, 'columnInsertBefore', { 'case': 'add-col-before-multi2', cells: [ 1 ] } );
		},

		'test insert col after': function( editor, bot ) {
			doTest( bot, 'columnInsertAfter', { 'case': 'add-col-after', cells: [ 0 ] } );
			doTest( bot, 'columnInsertAfter', { 'case': 'add-col-after-2', cells: [ 1 ] } );
			doTest( bot, 'columnInsertAfter', { 'case': 'add-col-after-3', cells: [ 0 ] } );
			doTest( bot, 'columnInsertAfter', { 'case': 'add-col-after-4', cells: [ 1 ] } );
			doTest( bot, 'columnInsertAfter', { 'case': 'add-col-after-multi', cells: [ 0, 1 ] } );
		},

		'test merge cells': function( editor, bot ) {
			doTest( bot, 'cellMerge', { 'case': 'merge-cells', cells: [ 0, 1, 2, 3, 4, 5 ] } );
			doTest( bot, 'cellMerge', { 'case': 'merge-cells-2', cells: [ 0, 1 ] } );
			doTest( bot, 'cellMerge', { 'case': 'merge-cells-3', cells: [ 2, 3, 5 ] } );
			doTest( bot, 'cellMerge', { 'case': 'merge-cells-5', cells: [ 0, 1 ] } );
		},

		'test merge cells (4)': function( editor, bot ) {
			if ( !CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			doTest( bot, 'cellMerge', { 'case': 'merge-cells-4', cells: [ 0, 1 ] } );
		},

		'test split cells': function( editor, bot ) {
			doTest( bot, 'cellHorizontalSplit', { 'case': 'split-cells', cells: [ 0 ], skipCheckingSelection: true } );
			doTest( bot, 'cellHorizontalSplit', { 'case': 'split-cells-2', cells: [ 3 ], skipCheckingSelection: true } );
			doTest( bot, 'cellHorizontalSplit', { 'case': 'split-cells-3', cells: [ 2 ], skipCheckingSelection: true } );
			doTest( bot, 'cellVerticalSplit', { 'case': 'split-cells-4', cells: [ 1 ], skipCheckingSelection: true } );
			doTest( bot, 'cellVerticalSplit', { 'case': 'split-cells-5', cells: [ 0 ], skipCheckingSelection: true } );
			doTest( bot, 'cellVerticalSplit', { 'case': 'split-cells-6', cells: [ 3 ], skipCheckingSelection: true } );
		},

		'test merge one cell': function( editor, bot ) {
			doTest( bot, 'cellMergeRight', { 'case': 'merge-cell-right', cells: [ 0 ] } );
			doTest( bot, 'cellMergeDown', { 'case': 'merge-cell-down', cells: [ 0 ] } );
			doTest( bot, 'cellMergeDown', { 'case': 'merge-cell-down-2', cells: [ 1 ] } );
		},

		'test merge one cell (collapsed selection)': function( editor, bot ) {
			doTest( bot, 'cellMergeRight', { 'case': 'merge-cell-right' } );
			doTest( bot, 'cellMergeDown', { 'case': 'merge-cell-down' } );
			doTest( bot, 'cellMergeDown', { 'case': 'merge-cell-down-2' } );
		},

		'test delete nested cells': function( editor, bot ) {
			doTest( bot, 'cellDelete', { 'case': 'delete-nested-cells', cells: [ 1, 2 ], skipCheckingSelection: true } );
			doTest( bot, 'cellDelete', { 'case': 'delete-nested-cells-2', cells: [ 2, 3 ], skipCheckingSelection: true } );
			doTest( bot, 'cellDelete', { 'case': 'delete-nested-cells-3', cells: [ 1, 2, 3, 4 ], skipCheckingSelection: true } );
		},

		// (#10308, #11058)
		// To reproduce #11058 we need 4 rows in the table.
		'test remove row from middle row': function( editor, bot ) {
			doTest( bot, 'rowDelete', { 'case': 'delete-row-from-middle', cells: [ 1 ], skipCheckingSelection: true } );
		},

		'test remove all rows': function( editor, bot ) {
			doTest( bot, 'rowDelete', { 'case': 'delete-all-cells', cells: [ 0, 1, 2, 3 ], skipCheckingSelection: true } );
		},

		'test remove all rows partial selection': function( editor, bot ) {
			doTest( bot, 'rowDelete', { 'case': 'delete-all-cells', cells: [ 0, 2 ], skipCheckingSelection: true } );
		},

		// (#10308)
		'test remove trailing column': function( editor, bot ) {
			doTest( bot, 'columnDelete', { 'case': 'delete-column-trailing', cells: [ 3 ], skipCheckingSelection: true } );
		},

		// (#10308)
		'test remove trailing cell': function( editor, bot ) {
			doTest( bot, 'cellDelete', { 'case': 'delete-cell-trailing', cells: [ 3 ], skipCheckingSelection: true } );
		},

		'test backspace in the middle': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTable', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 1, 2 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace whole first row': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableDeleteFirstRow', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace whole second row': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableDeleteSecondRow', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 2, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace multiple rows': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableDeleteFewRows', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1, 2, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace whole table': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableRemoveWhole', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1, 2, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace whole table multiple tables': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableSibling', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 2, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace column': function( editor, bot ) {
			// Make sure that backspace in one column of many, doesnt remove whole table.
			doTest( bot, function() {
				editor.getSelection().selectRanges( getRangesForCells( editor, [ 1, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );
			}, { 'case': 'emptyTableSingleColumn', markCells: true, skipCheckingSelection: true } );
		},

		'test delete in the middle': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTable', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 1, 2 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.DELETE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test delete whole table with sibling paragraph': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableParagraphSibling', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
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

		// #tp-2217
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

		'test delete all cells': function( editor, bot ) {
			doTest( bot, 'cellDelete', { 'case': 'delete-all-cells', cells: [ 0, 1, 2, 3 ], skipCheckingSelection: true } );
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

			assert.isArray( cells );
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

			assert.isArray( cells );
			assert.areSame( 4, cells.length );

			assert.isTrue( first.equals( cells[ 0 ] ) );
			assert.isTrue( editable.findOne( '#second' ).equals( cells[ 1 ] ) );
			assert.isTrue( editable.findOne( '#third' ).equals( cells[ 2 ] ) );
			assert.isTrue( last.equals( cells[ 3 ] ) );
		},

		'test getCellsBetween (irregular cells number in rows)': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getCellsBetween-irregular' ).getValue() );

			var inputCells = editor.editable().find( 'td' ),
				cells;

			cells = CKEDITOR.plugins.tabletools.getCellsBetween( inputCells.getItem( inputCells.count() - 1 ), inputCells.getItem( 0 ) );

			assert.isArray( cells );
			assert.areSame( 13, cells.length );
		},

		// tp2218
		'test getCellsBetween (caption)': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getCellsBetween-caption' ).getValue() );

			var inputCells = editor.editable().find( 'td' ),
				cells;

			try {
				cells = CKEDITOR.plugins.tabletools.getCellsBetween( inputCells.getItem( 0 ), inputCells.getItem( 2 ) );
			} catch ( e ) {
				assert.fail( 'Invalid indexes for rows were returned.' );
			}

			assert.isArray( cells );
			assert.areSame( 2, cells.length );
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

					var selection = editor.getSelection(),
						rangesAfterCommand = selection.getRanges(),
						expectedSelectionHolder = editor.editable().find( 'td' ).getItem( 1 );

					assert.areSame( 1, rangesAfterCommand.length, 'Range count' );
					assert.isTrue( !!selection.isFake, 'Selection is fake' );
					assert.isTrue( selection.isInTable(), 'Selection is in table' );
					assert.areSame( _getTableElementFromRange( rangesAfterCommand[ 0 ] ), expectedSelectionHolder, 'Correct cell is selected' );

					assert.areSame( expected, editor.getData(), 'Editor data' );
				} );
			} );

			wait();
		},

		// (#258, #tp2247)
		'test overriding cell background': function( editor ) {
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'cellBackground' ).getValue() );

			var cells = editor.editable().find( 'td' ),
				ranges = getRangesForCells( editor, [ 0, 1 ] ),
				// Different browsers produce various formats.
				acceptableValues = [ 'rgb(0, 118, 203)', '#0076cb' ],
				acceptableBlurValues = [ 'rgb(169, 169, 169)', '#a9a9a9', 'darkgray' ],
				blurColor;

			editor.getSelection().selectRanges( ranges );

			arrayAssert.contains(
				cells.getItem( 1 ).getComputedStyle( 'background-color' ).toLowerCase(),
				acceptableValues,
				'Computed background is a known good color'
			);

			// Focus other textarea to blur the editor.
			CKEDITOR.document.getById( 'cellBackground' ).focus();

			blurColor = cells.getItem( 1 ).getComputedStyle( 'background-color' ).toLowerCase();

			// It's important to put focus back to the editor, in case if subsequent tests expect it.
			editor.focus();

			arrayAssert.contains(
				blurColor,
				acceptableBlurValues,
				'Computed blur background is a known color'
			);
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
			assert.areSame( 1,  editor.getSelection().isFake, 'Selection remains faked' );
		}
	};

	// Prepare focus iframe before starting tests.
	prepareFocusFrame();

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
