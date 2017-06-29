/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	var fakeSelectedClass = 'cke_table-faked-selection',
		fakeSelectedTableClass = fakeSelectedClass + '-table',
		fakeSelectedEditorClass = fakeSelectedClass + '-editor',
		fakeSelectedTableDatasetClass = 'cke-table-faked-selection-table',
		fakeSelection = { active: false },
		tabletools,
		getSelectedCells,
		getCellColIndex,
		insertRow,
		insertColumn;

	function getCellsBetween( first, last ) {
		var firstTable = first.getAscendant( 'table' ),
			lastTable = last.getAscendant( 'table' ),
			map = CKEDITOR.tools.buildTableMap( firstTable ),
			startRow = getRowIndex( first ),
			endRow = getRowIndex( last ),
			cells = [],
			markers = {},
			start,
			end,
			i,
			j,
			cell;

		function getRowIndex( rowOrCell ) {
			return rowOrCell.getAscendant( 'tr', true ).$.rowIndex;
		}

		// Support selection that began in outer's table, but ends in nested one.
		if ( firstTable.contains( lastTable ) ) {
			last = last.getAscendant( { td: 1, th: 1 } );
			endRow = getRowIndex( last );
		}

		// First fetch start and end offset.
		if ( startRow > endRow ) {
			i = startRow;
			startRow = endRow;
			endRow = i;

			i = first;
			first = last;
			last = i;
		}

		for ( i = 0; i < map[ startRow ].length; i++ ) {
			if ( first.$ === map[ startRow ][ i ] ) {
				start = i;
				break;
			}
		}

		for ( i = 0; i < map[ endRow ].length; i++ ) {
			if ( last.$ === map[ endRow ][ i ] ) {
				end = i;
				break;
			}
		}

		if ( start > end ) {
			i = start;
			start = end;
			end = i;
		}

		for ( i = startRow; i <= endRow; i++ ) {
			for ( j = start; j <= end; j++ ) {
				// Table maps treat cells with colspan/rowspan as a separate cells, e.g.
				// td[colspan=2] produces two adjacent cells in map. Therefore we mark
				// all cells to know which were already processed.
				cell = new CKEDITOR.dom.element( map[ i ][ j ] );

				if ( cell.$ && !cell.getCustomData( 'selected_cell' ) ) {
					cells.push( cell );
					CKEDITOR.dom.element.setMarker( markers, cell, 'selected_cell', true );
				}
			}
		}

		CKEDITOR.dom.element.clearAllMarkers( markers );

		return cells;
	}

	// Detects if the left mouse button was pressed:
	// * In all browsers and IE 9+ we use event.button property with standard compliant values.
	// * In IE 8- we use event.button with IE's proprietary values.
	function detectLeftMouseButton( evt ) {
		var domEvent = evt.data.$;

		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			return domEvent.button === 1;
		}

		return domEvent.button === 0;
	}

	function getFakeSelectedTable( editor ) {
		var selectedCell = editor.editable().findOne( '.' + fakeSelectedClass );

		return selectedCell && selectedCell.getAscendant( 'table' );
	}

	function clearFakeCellSelection( editor, reset ) {
		var selectedCells = editor.editable().find( '.' + fakeSelectedClass ),
			i;

		editor.fire( 'lockSnapshot' );

		editor.editable().removeClass( fakeSelectedEditorClass );

		for ( i = 0; i < selectedCells.count(); i++ ) {
			selectedCells.getItem( i ).removeClass( fakeSelectedClass );
		}

		if ( selectedCells.count() > 0 ) {
			selectedCells.getItem( 0 ).getAscendant( 'table' ).data( fakeSelectedTableDatasetClass, false );
		}

		editor.fire( 'unlockSnapshot' );

		if ( reset ) {
			fakeSelection = { active: false };

			// Reset fake selection only if it's really a table one.
			// Otherwise we'll make widget selection unusable.
			if ( editor.getSelection().isInTable() ) {
				editor.getSelection().reset();
			}
		}
	}

	function fakeSelectCells( editor, cells ) {
		var ranges = [],
			range,
			i;

		for ( i = 0; i < cells.length; i++ ) {
			range = editor.createRange();

			range.setStartBefore( cells[ i ] );
			range.setEndAfter( cells[ i ] );

			ranges.push( range );
		}

		editor.getSelection().selectRanges( ranges );
	}

	function restoreFakeSelection( editor ) {
		var cells = editor.editable().find( '.' + fakeSelectedClass );

		if ( cells.count() < 1 ) {
			return;
		}

		cells = getCellsBetween( cells.getItem( 0 ), cells.getItem( cells.count() - 1 ) );

		fakeSelectCells( editor, cells );
	}

	function fakeSelectByMouse( editor, cellOrTable, evt ) {
		var selectedCells = getSelectedCells( editor.getSelection( true ) ),
			cell = !cellOrTable.is( 'table' ) ? cellOrTable : null,
			cells;

		// getSelectedCells treats cells with cursor in them as also selected.
		// We don't.
		function areCellsReallySelected( selection, selectedCells ) {
			var ranges = selection.getRanges();

			if ( selectedCells.length > 1 || ( ranges[ 0 ] && !ranges[ 0 ].collapsed ) ) {
				return true;
			}

			return false;
		}

		// Only start selecting when the fakeSelection.active is true (left mouse button is pressed)
		// and there are some cells selected or the click was done in the table cell.
		if ( fakeSelection.active && !fakeSelection.first &&
			( cell || areCellsReallySelected( editor.getSelection(), selectedCells ) ) ) {
			fakeSelection.first = cell || selectedCells[ 0 ];
			fakeSelection.dirty = cell ? false : ( selectedCells.length !== 1 );

			return;
		}

		if ( !fakeSelection.active ) {
			return;
		}

		// We should check if the newly selected cell is still inside the same table (http://dev.ckeditor.com/ticket/17052, #493).
		if ( cell && fakeSelection.first.getAscendant( 'table' ).equals( cell.getAscendant( 'table' ) ) ) {
			cells = getCellsBetween( fakeSelection.first, cell );

			// The selection is inside one cell, so we should allow native selection,
			// but only in case if no other cell between mousedown and mouseup
			// was selected.
			if ( !fakeSelection.dirty && cells.length === 1 ) {
				return clearFakeCellSelection( editor, evt.name === 'mouseup' );
			}

			fakeSelection.dirty = true;
			fakeSelection.last = cell;

			fakeSelectCells( editor, cells );
		}
	}

	function fakeSelectionChangeHandler( evt ) {
		var editor = evt.editor || evt.sender.editor,
			selection = editor && editor.getSelection(),
			ranges = selection && selection.getRanges() || [],
			cells,
			table,
			i;

		if ( !selection ) {
			return;
		}

		clearFakeCellSelection( editor );

		if ( !selection.isInTable() || !selection.isFake ) {
			return;
		}

		// In case of whole nested table selection, getSelectedCells returns also
		// cell which contains the table. We should filter it.
		if ( ranges.length === 1 && ranges[ 0 ]._getTableElement() &&
			ranges[ 0 ]._getTableElement().is( 'table' ) ) {
			table = ranges[ 0 ]._getTableElement();
		}

		cells = getSelectedCells( selection, table );

		editor.fire( 'lockSnapshot' );

		for ( i = 0; i < cells.length; i++ ) {
			cells[ i ].addClass( fakeSelectedClass );
		}

		if ( cells.length > 0 ) {
			editor.editable().addClass( fakeSelectedEditorClass );
			cells[ 0 ].getAscendant( 'table' ).data( fakeSelectedTableDatasetClass, fakeSelectedTableClass );
		}

		editor.fire( 'unlockSnapshot' );
	}

	function fakeSelectionMouseHandler( evt ) {
		// Prevent of throwing error in console if target is undefined (#515).
		if ( !evt.data.getTarget().getName ) {
			return;
		}

		var editor = evt.editor || evt.listenerData.editor,
			selection = editor.getSelection( 1 ),
			selectedTable = getFakeSelectedTable( editor ),
			target = evt.data.getTarget(),
			cell = target && target.getAscendant( { td: 1, th: 1 }, true ),
			table = target && target.getAscendant( 'table', true ),
			tableElements = { table: 1, thead: 1, tbody: 1, tfoot: 1, tr: 1, td: 1, th: 1 },
			canClear;

		// Nested tables should be treated as the same one (e.g. user starts dragging from outer table
		// and ends in inner one).
		function isSameTable( selectedTable, table ) {
			if ( !selectedTable || !table ) {
				return false;
			}

			return selectedTable.equals( table ) || selectedTable.contains( table ) || table.contains( selectedTable ) ||
				selectedTable.getCommonAncestor( table ).is( tableElements );
		}

		function isOutsideTable( node ) {
			return !node.getAscendant( 'table', true ) && node.getDocument().equals( editor.document );
		}

		function canClearSelection( evt, selection, selectedTable, table ) {
			// User starts click outside the table or not in the same table as in the previous selection.
			if ( evt.name === 'mousedown' && ( detectLeftMouseButton( evt ) || !table ) ) {
				return true;
			}

			// Covers a case when:
			// 1. User releases mouse button outside the table.
			// 2. User opens context menu not in the selected table.
			if ( evt.name === 'mouseup' && !isOutsideTable( evt.data.getTarget() ) && !isSameTable( selectedTable, table ) ) {
				return true;
			}

			return false;
		}

		if ( canClear = canClearSelection( evt, selection, selectedTable, table ) ) {
			clearFakeCellSelection( editor, true );
		}

		// Start fake selection only if the left mouse button is really pressed inside the table.
		if ( !fakeSelection.active && evt.name === 'mousedown' && detectLeftMouseButton( evt ) && table ) {
			fakeSelection = { active: true };

			// This listener covers case when mouse button is released outside the editor.
			CKEDITOR.document.on( 'mouseup', fakeSelectionMouseHandler, null, { editor: editor } );
		}

		// The separate condition for table handles cases when user starts/stop dragging from/in
		// spacing between cells.
		if ( cell || table ) {
			fakeSelectByMouse( editor, cell || table, evt );
		}

		if ( evt.name === 'mouseup' ) {
			// If the selection ended outside of the table, there's a chance that selection was messed,
			// e.g. by including text after the table. We should also cover selection inside nested tables
			// that ends in outer table. In these cases, we just reselect cells.
			if ( detectLeftMouseButton( evt ) &&
				( isOutsideTable( evt.data.getTarget() ) || isSameTable( selectedTable, table ) ) ) {
				restoreFakeSelection( editor );
			}

			fakeSelection = { active: false };

			CKEDITOR.document.removeListener( 'mouseup', fakeSelectionMouseHandler );
		}
	}

	function fakeSelectionDragHandler( evt ) {
		var cell = evt.data.getTarget().getAscendant( { td: 1, th: 1 }, true );

		if ( !cell || cell.hasClass( fakeSelectedClass ) ) {
			return;
		}

		// We're not supporting dragging in our table selection for the time being.
		evt.cancel();
		evt.data.preventDefault();
	}

	function copyTable( editor, isCut ) {
		var selection = editor.getSelection(),
			bookmarks = selection.createBookmarks(),
			doc = editor.document,
			range = editor.createRange(),
			docElement = doc.getDocumentElement().$,
			needsScrollHack = CKEDITOR.env.ie && CKEDITOR.env.version < 9,
			// [IE] Use span for copybin and its container to avoid bug with expanding editable height by
			// absolutely positioned element.
			copybinName = ( editor.blockless || CKEDITOR.env.ie ) ? 'span' : 'div',
			copybin,
			copybinContainer,
			scrollTop,
			listener;

		function cancel( evt ) {
			evt.cancel();
		}

		// We're still handling previous copy/cut.
		// When keystroke is used to copy/cut this will also prevent
		// conflict with copyTable called again for native copy/cut event.
		if ( doc.getById( 'cke_table_copybin' ) ) {
			return;
		}


		copybin = doc.createElement( copybinName );
		copybinContainer = doc.createElement( copybinName );

		copybinContainer.setAttributes( {
			id: 'cke_table_copybin',
			'data-cke-temp': '1'
		} );

		// Position copybin element outside current viewport.
		copybin.setStyles( {
			position: 'absolute',
			width: '1px',
			height: '1px',
			overflow: 'hidden'
		} );

		copybin.setStyle( editor.config.contentsLangDirection == 'ltr' ? 'left' : 'right', '-5000px' );

		copybin.setHtml( editor.getSelectedHtml( true ) );

		// Ignore copybin.
		editor.fire( 'lockSnapshot' );

		copybinContainer.append( copybin );
		editor.editable().append( copybinContainer );

		listener = editor.on( 'selectionChange', cancel, null, null, 0 );

		if ( needsScrollHack ) {
			scrollTop = docElement.scrollTop;
		}

		// Once the clone of the table is inside of copybin, select
		// the entire contents. This selection will be copied by the
		// native browser's clipboard system.
		range.selectNodeContents( copybin );
		range.select();

		if ( needsScrollHack ) {
			docElement.scrollTop = scrollTop;
		}

		setTimeout( function() {
			copybinContainer.remove();

			selection.selectBookmarks( bookmarks );
			listener.removeListener();

			editor.fire( 'unlockSnapshot' );

			if ( isCut ) {
				editor.extractSelectedHtml();
				editor.fire( 'saveSnapshot' );
			}
		}, 100 );
	}

	function fakeSelectionCopyCutHandler( evt ) {
		var editor = evt.editor || evt.sender.editor,
		selection = editor.getSelection();

		if ( !selection.isInTable() ) {
			return;
		}

		copyTable( editor, evt.name === 'cut' );
	}

	function fakeSelectionPasteHandler( evt ) {
		var editor = evt.editor,
			dataProcessor = editor.dataProcessor,
			selection = editor.getSelection(),
			tmpContainer = new CKEDITOR.dom.element( 'body' ),
			newRowsCount = 0,
			newColsCount = 0,
			pastedTableColCount = 0,
			selectedTableColCount = 0,
			markers = {},
			boundarySelection,
			selectedTable,
			selectedTableMap,
			selectedCells,
			pastedTable,
			pastedTableMap,
			firstCell,
			startIndex,
			firstRow,
			lastCell,
			endIndex,
			lastRow,
			currentRow,
			prevCell,
			cellToPaste,
			cellToReplace,
			i,
			j;

		// Check if the selection is collapsed on the beginning of the row (1) or at the end (2).
		function isBoundarySelection( selection ) {
			var ranges = selection.getRanges(),
				range = ranges[ 0 ],
				row = range.endContainer.getAscendant( 'tr', true );

			if ( row && range.collapsed ) {
				if ( range.checkBoundaryOfElement( row, CKEDITOR.START ) ) {
					return 1;
				} else if ( range.checkBoundaryOfElement( row, CKEDITOR.END ) ) {
					return 2;
				}
			}

			return 0;
		}

		function getLongestRowLength( map ) {
			var longest = 0,
				i;

			for ( i = 0; i < map.length; i++ ) {
				if ( map[ i ].length > longest ) {
					longest = map[ i ].length;
				}
			}

			return longest;
		}

		function getRealCellPosition( cell ) {
			var table = cell.getAscendant( 'table' ),
				rowIndex = cell.getParent().$.rowIndex,
				map = CKEDITOR.tools.buildTableMap( table ),
				i;

			for ( i = 0; i < map[ rowIndex ].length; i++ ) {
				if ( new CKEDITOR.dom.element( map[ rowIndex ][ i ] ).equals( cell ) ) {
					return i;
				}
			}
		}

		if ( !dataProcessor ) {
			dataProcessor = new CKEDITOR.htmlDataProcessor( editor );
		}

		// Pasted value must be filtered using dataProcessor to strip all unsafe code
		// before inserting it into temporary container.
		tmpContainer.setHtml( dataProcessor.toHtml( evt.data.dataValue ), {
			fixForBody: false
		} );
		pastedTable = tmpContainer.findOne( 'table' );

		if ( !selection.getRanges().length || !selection.isInTable() && !( boundarySelection = isBoundarySelection( selection ) ) ) {
			return;
		}

		selectedCells = getSelectedCells( selection );

		if ( !selectedCells.length ) {
			return;
		}

		evt.stop();

		selectedTable = selectedCells[ 0 ].getAscendant( 'table' );
		selectedCells = getSelectedCells( selection, selectedTable );
		firstCell = selectedCells[ 0 ];
		firstRow = firstCell.getParent();
		lastCell = selectedCells[ selectedCells.length - 1 ];
		lastRow = lastCell.getParent();

		// Empty all selected cells.
		if ( !boundarySelection ) {
			for ( i = 0; i < selectedCells.length; i++ ) {
				selectedCells[ i ].setHtml( '' );
			}
		}

		// Handle mixed content (if the table is not the only child in the tmpContainer, we
		// are probably dealing with mixed content). We handle also non-table content here.
		if ( tmpContainer.getChildCount() > 1 || !pastedTable ) {
			selectedCells[ 0 ].setHtml( tmpContainer.getHtml() );

			editor.fire( 'saveSnapshot' );

			return;
		}

		// In case of boundary selection, insert new row before/after selected one, select it
		// and resume the rest of the algorithm.
		if ( boundarySelection ) {
			endIndex = firstRow.getChildCount();
			firstRow = lastRow = new CKEDITOR.dom.element( 'tr' );
			firstRow[ 'insert' + ( boundarySelection === 1 ? 'Before' : 'After' ) ]( firstCell.getParent() );

			for ( i = 0; i < endIndex; i++ ) {
				firstCell = new CKEDITOR.dom.element( 'td' );
				firstCell.appendTo( firstRow );
			}

			firstCell = firstRow.getFirst();
			lastCell = firstRow.getLast();

			selection.selectElement( firstRow );
			selectedCells = getSelectedCells( selection );
		}

		// Build table map only for selected fragment.
		selectedTableMap = CKEDITOR.tools.buildTableMap( selectedTable, firstRow.$.rowIndex,
			getCellColIndex( firstCell, true ), lastRow.$.rowIndex, getRealCellPosition( lastCell ) );
		pastedTableMap = CKEDITOR.tools.buildTableMap( pastedTable );


		// Now we compare the dimensions of the pasted table and the selected one.
		// If the pasted one is bigger, we add missing rows and columns.
		pastedTableColCount = getLongestRowLength( pastedTableMap );
		selectedTableColCount = getLongestRowLength( selectedTableMap );

		if ( pastedTableMap.length > selectedTableMap.length ) {
			newRowsCount = pastedTableMap.length - selectedTableMap.length;

			for ( i = 0; i < newRowsCount; i++ ) {
				insertRow( selectedCells );
			}
		}

		if ( pastedTableColCount > selectedTableColCount ) {
			newColsCount = pastedTableColCount - selectedTableColCount;

			for ( i = 0; i < newColsCount; i++ ) {
				insertColumn( selectedCells );
			}
		}

		// Get all selected cells (original ones + newly inserted ones).
		firstCell = selectedCells[ 0 ];
		firstRow = firstCell.getParent();
		lastCell = selectedCells[ selectedCells.length - 1 ];
		lastRow = new CKEDITOR.dom.element( selectedTable.$.rows[ lastCell.getParent().$.rowIndex + newRowsCount ] );
		lastCell = lastRow.getChild( lastCell.$.cellIndex + newColsCount );

		// These indexes would be reused later, to calculate the proper position of newly pasted cells.
		startIndex = getCellColIndex( selectedCells[ 0 ], true );
		endIndex = getRealCellPosition( lastCell );

		// Rebuild map for selected table.
		selectedTableMap = CKEDITOR.tools.buildTableMap( selectedTable, firstRow.$.rowIndex, startIndex,
			lastRow.$.rowIndex, endIndex );

		// And now paste!
		for ( i = 0; i < pastedTableMap.length; i++ ) {
			currentRow = new CKEDITOR.dom.element( selectedTable.$.rows[ firstRow.$.rowIndex + i ] );

			for ( j = 0; j < pastedTableMap[ i ].length; j++ ) {
				cellToPaste = new CKEDITOR.dom.element( pastedTableMap[ i ][ j ] );

				if ( selectedTableMap[ i ] && selectedTableMap[ i ][ j ] ) {
					cellToReplace = new CKEDITOR.dom.element( selectedTableMap[ i ][ j ] );
				} else {
					cellToReplace = null;
				}

				// Only try to paste cells that aren't already pasted (it can occur if the pasted cell
				// has [colspan] or [rowspan]).
				if ( cellToPaste && !cellToPaste.getCustomData( 'processed' ) ) {
					// If the cell to being replaced has [colspan], it could have been already
					// replaced. In that case, it won't have parent.
					if ( cellToReplace && cellToReplace.getParent() ) {
						cellToPaste.replace( cellToReplace );
					} else if ( j === 0 || pastedTableMap[ i ][ j - 1 ] ) {
						if ( j !== 0 ) {
							prevCell = new CKEDITOR.dom.element( pastedTableMap[ i ][ j - 1 ] );
						} else {
							prevCell = null;
						}

						// If the cell that should be replaced is not in the table, we must cover at least 3 cases:
						// 1. Pasting cell in the same row as the previous pasted cell.
						// 2. Pasting cell into the next row at the proper position.
						// 3. If the selection started from the left edge of the table,
						// prepending the proper row with the cell.
						if ( prevCell && currentRow.equals( prevCell.getParent() ) ) {
							cellToPaste.insertAfter( prevCell );
						} else if ( startIndex > 0 ) {
							cellToPaste.insertAfter( new CKEDITOR.dom.element( currentRow.$.cells[ startIndex ] ) );
						} else {
							currentRow.append( cellToPaste, true );
						}
					}

					CKEDITOR.dom.element.setMarker( markers, cellToPaste, 'processed', true );
				} else if ( cellToPaste.getCustomData( 'processed' ) && cellToReplace ) {
					// If the cell was already pasted, but the cell to replace still exists (e.g. pasted
					// cell has [colspan]), remove it.
					cellToReplace.remove();
				}
			}
		}

		CKEDITOR.dom.element.clearAllMarkers( markers );

		// Select newly pasted cells.
		fakeSelectCells( editor,
				getCellsBetween( new CKEDITOR.dom.element( pastedTableMap[ 0 ][ 0 ] ), cellToPaste ) );

		editor.fire( 'saveSnapshot' );

		// Manually fire afterPaste event as we stop pasting to handle everything via our custom handler.
		setTimeout( function() {
			editor.fire( 'afterPaste' );
		}, 0 );
	}

	function customizeTableCommand( editor, cmds, callback ) {
		editor.on( 'beforeCommandExec', function( evt ) {
			if ( CKEDITOR.tools.array.indexOf( cmds, evt.data.name ) !== -1 ) {
				evt.data.selectedCells = getSelectedCells( editor.getSelection() );
			}
		} );

		editor.on( 'afterCommandExec', function( evt ) {
			if ( CKEDITOR.tools.array.indexOf( cmds, evt.data.name ) !== -1 ) {
				callback( editor, evt.data );
			}
		} );
	}

	/**
	 * Namespace providing a set of helper functions for working with tables, exposed by
	 * [Table Selection](http://ckeditor.com/addon/tableselection) plugin.
	 *
	 * @since 4.7.0
	 * @singleton
	 * @class CKEDITOR.plugins.tableselection
	 */
	CKEDITOR.plugins.tableselection = {
		/**
		 * Fetches all cells between cells passed as parameters, including these cells.
		 *
		 * @param {CKEDITOR.dom.element} first The first cell to fetch.
		 * @param {CKEDITOR.dom.element} last The last cell to fetch.
		 * @return {CKEDITOR.dom.element[]} Array of fetched cells.
		 */
		getCellsBetween: getCellsBetween,

		/**
		 * Adds keyboard integration for table selection in a given editor.
		 *
		 * @param {CKEDITOR.editor} editor
		 * @private
		 */
		keyboardIntegration: function( editor ) {
			// Handle left, up, right, down, delete and backspace keystrokes inside table fake selection.
			function getTableOnKeyDownListener( editor ) {
				var keystrokes = {
						37: 1, // Left Arrow
						38: 1, // Up Arrow
						39: 1, // Right Arrow,
						40: 1, // Down Arrow
						8: 1, // Backspace
						46: 1 // Delete
					},
					tags = CKEDITOR.tools.extend( { table: 1 }, CKEDITOR.dtd.$tableContent );

				delete tags.td;
				delete tags.th;

				// Called when removing empty subseleciton of the table.
				// It should not allow for removing part of table, e.g. when user attempts to remove 2 cells
				// out of 4 in row. It should however remove whole row or table, if it was fully selected.
				function deleteEmptyTablePart( node, ranges ) {
					if ( !ranges.length ) {
						return null;
					}

					var rng = editor.createRange(),
						mergedRanges = CKEDITOR.dom.range.mergeRanges( ranges );

					// Enlarge each range, so that it wraps over tr.
					CKEDITOR.tools.array.forEach( mergedRanges, function( mergedRange ) {
						mergedRange.enlarge( CKEDITOR.ENLARGE_ELEMENT );
					} );

					var boundaryNodes = mergedRanges[ 0 ].getBoundaryNodes(),
						startNode = boundaryNodes.startNode,
						endNode = boundaryNodes.endNode;

					if ( startNode && startNode.is && startNode.is( tags ) ) {
						// A node that will receive selection after the firstRangeContainedNode is removed.
						var boundaryTable = startNode.getAscendant( 'table', true ),
							targetNode = startNode.getPreviousSourceNode( false, CKEDITOR.NODE_ELEMENT, boundaryTable ),
							selectBeginning = false,
							matchingElement = function( elem ) {
								// We're interested in matching only td/th but not contained by the startNode since it will be removed.
								// Technically none of startNode children should be visited but it will due to http://dev.ckeditor.com/ticket/12191.
								return !startNode.contains( elem ) && elem.is && elem.is( 'td', 'th' );
							};

						while ( targetNode && !matchingElement( targetNode ) ) {
							targetNode = targetNode.getPreviousSourceNode( false, CKEDITOR.NODE_ELEMENT, boundaryTable );
						}

						if ( !targetNode && endNode && endNode.is && !endNode.is( 'table' ) && endNode.getNext() ) {
							// Special case: say we were removing the first row, so there are no more tds before, check if there's a cell after removed row.
							targetNode = endNode.getNext().findOne( 'td, th' );
							// In that particular case we want to select beginning.
							selectBeginning = true;
						}

						if ( !targetNode ) {
							// As a last resort of defence we'll put the selection before (about to be) removed table.
							rng.setStartBefore( startNode.getAscendant( 'table', true ) );
							rng.collapse( true );
						} else {
							rng[ 'moveToElementEdit' + ( selectBeginning ? 'Start' : 'End' ) ]( targetNode );
						}

						mergedRanges[ 0 ].deleteContents();

						return [ rng ];
					}

					// By default return a collapsed selection in a first cell.
					if ( startNode ) {
						rng.moveToElementEditablePosition( startNode );
						return [ rng ];
					}
				}

				return function( evt ) {
					// Use getKey directly in order to ignore modifiers.
					// Justification: http://dev.ckeditor.com/ticket/11861#comment:13
					var keystroke = evt.data.getKey(),
						selection,
						toStart = keystroke === 37 || keystroke == 38,
						ranges,
						firstCell,
						lastCell,
						i;

					// Handle only left/right/del/bspace keys.
					if ( !keystrokes[ keystroke ] ) {
						return;
					}

					selection = editor.getSelection();

					if ( !selection || !selection.isInTable() || !selection.isFake ) {
						return;
					}

					ranges = selection.getRanges();
					firstCell = ranges[ 0 ]._getTableElement();
					lastCell = ranges[ ranges.length - 1 ]._getTableElement();

					evt.data.preventDefault();
					evt.cancel();

					if ( keystroke > 8 && keystroke < 46 ) {
						// Arrows.
						ranges[ 0 ].moveToElementEditablePosition( toStart ? firstCell : lastCell, !toStart );
						selection.selectRanges( [ ranges[ 0 ] ] );
					} else {
						// Delete.
						for ( i = 0; i < ranges.length; i++ ) {
							clearCellInRange( ranges[ i ] );
						}

						var newRanges = deleteEmptyTablePart( firstCell, ranges );

						if ( newRanges ) {
							ranges = newRanges;
						} else {
							// If no new range was returned fallback to selecting first cell.
							ranges[ 0 ].moveToElementEditablePosition( firstCell );
						}

						selection.selectRanges( ranges );
						editor.fire( 'saveSnapshot' );
					}
				};
			}

			function tableKeyPressListener( evt ) {
				var selection = editor.getSelection(),
					// Enter key also produces character, but Firefox doesn't think so (gh#415).
					isCharKey = evt.data.$.charCode || ( evt.data.getKey() === 13 ),
					ranges,
					firstCell,
					i;

				// We must check if the event really did not produce any character as it's fired for all keys in Gecko.
				if ( !selection || !selection.isInTable() || !selection.isFake || !isCharKey ||
					evt.data.getKeystroke() & CKEDITOR.CTRL ) {
					return;
				}

				ranges = selection.getRanges();
				firstCell = ranges[ 0 ].getEnclosedNode().getAscendant( { td: 1, th: 1 }, true );

				for ( i = 0; i < ranges.length; i++ ) {
					clearCellInRange( ranges[ i ] );
				}

				ranges[ 0 ].moveToElementEditablePosition( firstCell );
				selection.selectRanges( [ ranges[ 0 ] ] );
			}

			function clearCellInRange( range ) {
				if ( range.getEnclosedNode() ) {
					range.getEnclosedNode().setText( '' );
				} else {
					range.deleteContents();
				}

				CKEDITOR.tools.array.forEach( range._find( 'td' ), function( cell ) {
					// Cells that were not removed, need to contain bogus BR (if needed), otherwise row might
					// collapse. (tp#2270)
					cell.appendBogus();
				} );
			}

			// Automatically select non-editable element when navigating into
			// it by left/right or backspace/del keys.
			var editable = editor.editable();
			editable.attachListener( editable, 'keydown', getTableOnKeyDownListener( editor ), null, null, -1 );
			editable.attachListener( editable, 'keypress', tableKeyPressListener, null, null, -1 );
		},

		/*
		 * Determines whether table selection is supported in the current environment.
		 *
		 * @property {Boolean}
		 * @private
		 */
		isSupportedEnvironment: !( CKEDITOR.env.ie && CKEDITOR.env.version < 11 )
	};

	CKEDITOR.plugins.add( 'tableselection', {
		requires: 'clipboard,tabletools',

		onLoad: function() {
			// We can't alias these features earlier, as they could be still not loaded.
			tabletools = CKEDITOR.plugins.tabletools;
			getSelectedCells = tabletools.getSelectedCells;
			getCellColIndex = tabletools.getCellColIndex;
			insertRow = tabletools.insertRow;
			insertColumn = tabletools.insertColumn;

			CKEDITOR.document.appendStyleSheet( this.path + 'styles/tableselection.css' );
		},

		init: function( editor ) {
			// Disable unsupported browsers.
			if ( !CKEDITOR.plugins.tableselection.isSupportedEnvironment ) {
				return;
			}

			// Add styles for fake visual selection.
			if ( editor.addContentsCss ) {
				editor.addContentsCss( this.path + 'styles/tableselection.css' );
			}

			editor.on( 'contentDom', function() {
				var editable = editor.editable(),
					mouseHost = editable.isInline() ? editable : editor.document,
					evtInfo = { editor: editor };

				// Explicitly set editor as DOM events generated on document does not convey information about it.
				editable.attachListener( mouseHost, 'mousedown', fakeSelectionMouseHandler, null, evtInfo );
				editable.attachListener( mouseHost, 'mousemove', fakeSelectionMouseHandler, null, evtInfo );
				editable.attachListener( mouseHost, 'mouseup', fakeSelectionMouseHandler, null, evtInfo );

				editable.attachListener( editable, 'dragstart', fakeSelectionDragHandler );
				editable.attachListener( editor, 'selectionCheck', fakeSelectionChangeHandler );

				CKEDITOR.plugins.tableselection.keyboardIntegration( editor );

				// Setup copybin.
				if ( CKEDITOR.plugins.clipboard && !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
					editable.attachListener( editable, 'cut', fakeSelectionCopyCutHandler );
					editable.attachListener( editable, 'copy', fakeSelectionCopyCutHandler );
				}
			} );

			editor.on( 'paste', fakeSelectionPasteHandler );

			customizeTableCommand( editor, [
				'rowInsertBefore',
				'rowInsertAfter',
				'columnInsertBefore',
				'columnInsertAfter',
				'cellInsertBefore',
				'cellInsertAfter'
			], function( editor, data ) {
				fakeSelectCells( editor, data.selectedCells );
			} );

			customizeTableCommand( editor, [
				'cellMerge',
				'cellMergeRight',
				'cellMergeDown'
			], function( editor, data ) {
				fakeSelectCells( editor, [ data.commandData.cell ] );
			} );

			customizeTableCommand( editor, [
				'cellDelete'
			], function( editor ) {
				clearFakeCellSelection( editor, true );
			} );
		}
	} );
}() );
