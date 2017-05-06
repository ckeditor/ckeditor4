/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	var cellNodeRegex = /^(?:td|th)$/,
		isArray = CKEDITOR.tools.isArray,
		fakeSelectedClass = 'cke_table-faked-selection',
		fakeSelectedTableClass = fakeSelectedClass + '-table',
		fakeSelectedEditorClass = fakeSelectedClass + '-editor',
		fakeSelection = { active: false };

	function getSelectedCells( selection, table ) {
		if ( !selection ) {
			return;
		}

		var ranges = selection.getRanges();
		var retval = [];
		var database = {};

		function isInTable( cell ) {
			if ( !table ) {
				return true;
			}

			return table.contains( cell ) && cell.getAscendant( 'table', true ).equals( table );
		}

		function moveOutOfCellGuard( node ) {
			// Apply to the first cell only.
			if ( retval.length > 0 )
				return;

			// If we are exiting from the first </td>, then the td should definitely be
			// included.
			if ( node.type == CKEDITOR.NODE_ELEMENT && cellNodeRegex.test( node.getName() ) && !node.getCustomData( 'selected_cell' ) ) {
				CKEDITOR.dom.element.setMarker( database, node, 'selected_cell', true );
				retval.push( node );
			}
		}

		for ( var i = 0; i < ranges.length; i++ ) {
			var range = ranges[ i ];

			if ( range.collapsed ) {
				// Walker does not handle collapsed ranges yet - fall back to old API.
				var startNode = range.getCommonAncestor();
				var nearestCell = startNode.getAscendant( { td: 1, th: 1 }, true );
				if ( nearestCell && isInTable( nearestCell ) ) {
					retval.push( nearestCell );
				}
			} else {
				var walker = new CKEDITOR.dom.walker( range );
				var node;
				walker.guard = moveOutOfCellGuard;

				while ( ( node = walker.next() ) ) {
					// If may be possible for us to have a range like this:
					// <td>^1</td><td>^2</td>
					// The 2nd td shouldn't be included.
					//
					// So we have to take care to include a td we've entered only when we've
					// walked into its children.

					if ( node.type != CKEDITOR.NODE_ELEMENT || !node.is( CKEDITOR.dtd.table ) ) {
						var parent = node.getAscendant( { td: 1, th: 1 }, true );
						if ( parent && !parent.getCustomData( 'selected_cell' ) && isInTable( parent ) ) {
							CKEDITOR.dom.element.setMarker( database, parent, 'selected_cell', true );
							retval.push( parent );
						}
					}
				}
			}
		}

		CKEDITOR.dom.element.clearAllMarkers( database );

		return retval;
	}

	function getFocusElementAfterDelCells( cellsToDelete ) {
		var i = 0,
			last = cellsToDelete.length - 1,
			database = {},
			cell, focusedCell, tr;

		while ( ( cell = cellsToDelete[ i++ ] ) )
			CKEDITOR.dom.element.setMarker( database, cell, 'delete_cell', true );

		// 1.first we check left or right side focusable cell row by row;
		i = 0;
		while ( ( cell = cellsToDelete[ i++ ] ) ) {
			if ( ( focusedCell = cell.getPrevious() ) && !focusedCell.getCustomData( 'delete_cell' ) || ( focusedCell = cell.getNext() ) && !focusedCell.getCustomData( 'delete_cell' ) ) {
				CKEDITOR.dom.element.clearAllMarkers( database );
				return focusedCell;
			}
		}

		CKEDITOR.dom.element.clearAllMarkers( database );

		// 2. then we check the toppest row (outside the selection area square) focusable cell
		tr = cellsToDelete[ 0 ].getParent();
		if ( ( tr = tr.getPrevious() ) )
			return tr.getLast();

		// 3. last we check the lowerest  row focusable cell
		tr = cellsToDelete[ last ].getParent();
		if ( ( tr = tr.getNext() ) )
			return tr.getChild( 0 );

		return null;
	}

	function insertRow( selectionOrCells, insertBefore ) {
		var cells = isArray( selectionOrCells ) ? selectionOrCells : getSelectedCells( selectionOrCells ),
			firstCell = cells[ 0 ],
			table = firstCell.getAscendant( 'table' ),
			doc = firstCell.getDocument(),
			startRow = cells[ 0 ].getParent(),
			startRowIndex = startRow.$.rowIndex,
			lastCell = cells[ cells.length - 1 ],
			endRowIndex = lastCell.getParent().$.rowIndex + lastCell.$.rowSpan - 1,
			endRow = new CKEDITOR.dom.element( table.$.rows[ endRowIndex ] ),
			rowIndex = insertBefore ? startRowIndex : endRowIndex,
			row = insertBefore ? startRow : endRow;

		var map = CKEDITOR.tools.buildTableMap( table ),
			cloneRow = map[ rowIndex ],
			nextRow = insertBefore ? map[ rowIndex - 1 ] : map[ rowIndex + 1 ],
			width = map[ 0 ].length;

		var newRow = doc.createElement( 'tr' );
		for ( var i = 0; cloneRow[ i ] && i < width; i++ ) {
			var cell;
			// Check whether there's a spanning row here, do not break it.
			if ( cloneRow[ i ].rowSpan > 1 && nextRow && cloneRow[ i ] == nextRow[ i ] ) {
				cell = cloneRow[ i ];
				cell.rowSpan += 1;
			} else {
				cell = new CKEDITOR.dom.element( cloneRow[ i ] ).clone();
				cell.removeAttribute( 'rowSpan' );
				cell.appendBogus();
				newRow.append( cell );
				cell = cell.$;
			}

			i += cell.colSpan - 1;
		}

		insertBefore ? newRow.insertBefore( row ) : newRow.insertAfter( row );
	}

	function deleteRows( selectionOrRow ) {
		if ( selectionOrRow instanceof CKEDITOR.dom.selection ) {
			var ranges = selectionOrRow.getRanges(),
				cells = getSelectedCells( selectionOrRow ),
				firstCell = cells[ 0 ],
				table = firstCell.getAscendant( 'table' ),
				map = CKEDITOR.tools.buildTableMap( table ),
				startRow = cells[ 0 ].getParent(),
				startRowIndex = startRow.$.rowIndex,
				lastCell = cells[ cells.length - 1 ],
				endRowIndex = lastCell.getParent().$.rowIndex + lastCell.$.rowSpan - 1,
				rowsToDelete = [];

			selectionOrRow.reset();

			// Delete cell or reduce cell spans by checking through the table map.
			for ( var i = startRowIndex; i <= endRowIndex; i++ ) {
				var mapRow = map[ i ],
					row = new CKEDITOR.dom.element( table.$.rows[ i ] );

				for ( var j = 0; j < mapRow.length; j++ ) {
					var cell = new CKEDITOR.dom.element( mapRow[ j ] ),
						cellRowIndex = cell.getParent().$.rowIndex;

					if ( cell.$.rowSpan == 1 )
						cell.remove();
					// Row spanned cell.
					else {
						// Span row of the cell, reduce spanning.
						cell.$.rowSpan -= 1;
						// Root row of the cell, root cell to next row.
						if ( cellRowIndex == i ) {
							var nextMapRow = map[ i + 1 ];
							nextMapRow[ j - 1 ] ? cell.insertAfter( new CKEDITOR.dom.element( nextMapRow[ j - 1 ] ) ) : new CKEDITOR.dom.element( table.$.rows[ i + 1 ] ).append( cell, 1 );
						}
					}

					j += cell.$.colSpan - 1;
				}

				rowsToDelete.push( row );
			}

			var rows = table.$.rows;

			// After deleting whole table, the selection would be broken,
			// therefore it's safer to move it outside the table first.
			ranges[ 0 ].moveToPosition( table, CKEDITOR.POSITION_BEFORE_START );

			// Where to put the cursor after rows been deleted?
			// 1. Into next sibling row if any;
			// 2. Into previous sibling row if any;
			// 3. Into table's parent element if it's the very last row.
			var cursorPosition = new CKEDITOR.dom.element( rows[ endRowIndex + 1 ] || ( startRowIndex > 0 ? rows[ startRowIndex - 1 ] : null ) || table.$.parentNode );

			for ( i = rowsToDelete.length; i >= 0; i-- ) {
				deleteRows( rowsToDelete[ i ] );
			}

			// If all the rows were removed, table gets removed too.
			if ( !table.$.parentNode ) {
				ranges[ 0 ].select();
				return null;
			}

			return cursorPosition;
		} else if ( selectionOrRow instanceof CKEDITOR.dom.element ) {
			table = selectionOrRow.getAscendant( 'table' );

			if ( table.$.rows.length == 1 ) {
				table.remove();
			} else {
				selectionOrRow.remove();
			}
		}

		return null;
	}

	function getCellColIndex( cell, isStart ) {
		var row = cell.getParent(),
			rowCells = row.$.cells;

		var colIndex = 0;
		for ( var i = 0; i < rowCells.length; i++ ) {
			var mapCell = rowCells[ i ];
			colIndex += isStart ? 1 : mapCell.colSpan;
			if ( mapCell == cell.$ )
				break;
		}

		return colIndex - 1;
	}

	function getColumnsIndices( cells, isStart ) {
		var retval = isStart ? Infinity : 0;
		for ( var i = 0; i < cells.length; i++ ) {
			var colIndex = getCellColIndex( cells[ i ], isStart );
			if ( isStart ? colIndex < retval : colIndex > retval )
				retval = colIndex;
		}
		return retval;
	}

	function insertColumn( selectionOrCells, insertBefore ) {
		var cells = isArray( selectionOrCells ) ? selectionOrCells : getSelectedCells( selectionOrCells ),
			firstCell = cells[ 0 ],
			table = firstCell.getAscendant( 'table' ),
			startCol = getColumnsIndices( cells, 1 ),
			lastCol = getColumnsIndices( cells ),
			colIndex = insertBefore ? startCol : lastCol,
			originalCell;

		var map = CKEDITOR.tools.buildTableMap( table ),
			cloneCol = [],
			nextCol = [],
			height = map.length;

		for ( var i = 0; i < height; i++ ) {
			cloneCol.push( map[ i ][ colIndex ] );
			var nextCell = insertBefore ? map[ i ][ colIndex - 1 ] : map[ i ][ colIndex + 1 ];
			nextCol.push( nextCell );
		}

		for ( i = 0; i < height; i++ ) {
			var cell;

			if ( !cloneCol[ i ] )
				continue;

			// Check whether there's a spanning column here, do not break it.
			if ( cloneCol[ i ].colSpan > 1 && nextCol[ i ] == cloneCol[ i ] ) {
				cell = cloneCol[ i ];
				cell.colSpan += 1;
			} else {
				originalCell = new CKEDITOR.dom.element( cloneCol[ i ] );
				cell = originalCell.clone();
				cell.removeAttribute( 'colSpan' );
				cell.appendBogus();
				cell[ insertBefore ? 'insertBefore' : 'insertAfter' ].call( cell, originalCell );
				cell = cell.$;
			}

			i += cell.rowSpan - 1;
		}
	}

	function deleteColumns( selectionOrCell ) {
		var ranges = selectionOrCell.getRanges(),
			cells = getSelectedCells( selectionOrCell ),
			firstCell = cells[ 0 ],
			lastCell = cells[ cells.length - 1 ],
			table = firstCell.getAscendant( 'table' ),
			map = CKEDITOR.tools.buildTableMap( table ),
			startColIndex, endColIndex,
			rowsToDelete = [];

		selectionOrCell.reset();

		// Figure out selected cells' column indices.
		for ( var i = 0, rows = map.length; i < rows; i++ ) {
			for ( var j = 0, cols = map[ i ].length; j < cols; j++ ) {
				if ( map[ i ][ j ] == firstCell.$ )
					startColIndex = j;
				if ( map[ i ][ j ] == lastCell.$ )
					endColIndex = j;
			}
		}

		// Delete cell or reduce cell spans by checking through the table map.
		for ( i = startColIndex; i <= endColIndex; i++ ) {
			for ( j = 0; j < map.length; j++ ) {
				var mapRow = map[ j ],
					row = new CKEDITOR.dom.element( table.$.rows[ j ] ),
					cell = new CKEDITOR.dom.element( mapRow[ i ] );

				if ( cell.$ ) {
					if ( cell.$.colSpan == 1 )
						cell.remove();
					// Reduce the col spans.
					else
						cell.$.colSpan -= 1;

					j += cell.$.rowSpan - 1;

					if ( !row.$.cells.length )
						rowsToDelete.push( row );
				}
			}
		}

		var firstRowCells = table.$.rows[ 0 ] && table.$.rows[ 0 ].cells;

		// Where to put the cursor after columns been deleted?
		// 1. Into next cell of the first row if any;
		// 2. Into previous cell of the first row if any;
		// 3. Into table's parent element;
		var cursorPosition = new CKEDITOR.dom.element( firstRowCells[ startColIndex ] || ( startColIndex ? firstRowCells[ startColIndex - 1 ] : table.$.parentNode ) );

		// Delete table rows only if all columns are gone (do not remove empty row).
		if ( rowsToDelete.length == rows ) {
			// After deleting whole table, the selection would be broken,
			// therefore it's safer to move it outside the table first.
			ranges[ 0 ].moveToPosition( table, CKEDITOR.POSITION_AFTER_END );
			ranges[ 0 ].select();

			table.remove();
		}

		return cursorPosition;
	}

	function insertCell( selection, insertBefore ) {
		var startElement = selection.getStartElement(),
			cell = startElement.getAscendant( 'td', 1 ) || startElement.getAscendant( 'th', 1 );

		if ( !cell )
			return;

		// Create the new cell element to be added.
		var newCell = cell.clone();
		newCell.appendBogus();

		if ( insertBefore )
			newCell.insertBefore( cell );
		else
			newCell.insertAfter( cell );
	}

	function deleteCells( selectionOrCell ) {
		if ( selectionOrCell instanceof CKEDITOR.dom.selection ) {
			var ranges = selectionOrCell.getRanges(),
				cellsToDelete = getSelectedCells( selectionOrCell ),
				table = cellsToDelete[ 0 ] && cellsToDelete[ 0 ].getAscendant( 'table' ),
				cellToFocus = getFocusElementAfterDelCells( cellsToDelete );

			selectionOrCell.reset();

			for ( var i = cellsToDelete.length - 1; i >= 0; i-- ) {
				deleteCells( cellsToDelete[ i ] );
			}

			if ( cellToFocus ) {
				placeCursorInCell( cellToFocus, true );
			} else if ( table ) {
				// After deleting whole table, the selection would be broken,
				// therefore it's safer to move it outside the table first.
				ranges[ 0 ].moveToPosition( table, CKEDITOR.POSITION_BEFORE_START );
				ranges[ 0 ].select();

				table.remove();
			}
		} else if ( selectionOrCell instanceof CKEDITOR.dom.element ) {
			var tr = selectionOrCell.getParent();
			if ( tr.getChildCount() == 1 ) {
				tr.remove();
			} else {
				selectionOrCell.remove();
			}
		}
	}

	// Remove filler at end and empty spaces around the cell content.
	function trimCell( cell ) {
		var bogus = cell.getBogus();
		bogus && bogus.remove();
		cell.trim();
	}

	function placeCursorInCell( cell, placeAtEnd ) {
		var docInner = cell.getDocument(),
			docOuter = CKEDITOR.document;

		// Fixing "Unspecified error" thrown in IE10 by resetting
		// selection the dirty and shameful way (#10308).
		// We can not apply this hack to IE8 because
		// it causes error (#11058).
		if ( CKEDITOR.env.ie && CKEDITOR.env.version == 10 ) {
			docOuter.focus();
			docInner.focus();
		}

		var range = new CKEDITOR.dom.range( docInner );
		if ( !range[ 'moveToElementEdit' + ( placeAtEnd ? 'End' : 'Start' ) ]( cell ) ) {
			range.selectNodeContents( cell );
			range.collapse( placeAtEnd ? false : true );
		}
		range.select( true );
	}

	function cellInRow( tableMap, rowIndex, cell ) {
		var oRow = tableMap[ rowIndex ];
		if ( typeof cell == 'undefined' )
			return oRow;

		for ( var c = 0; oRow && c < oRow.length; c++ ) {
			if ( cell.is && oRow[ c ] == cell.$ )
				return c;
			else if ( c == cell )
				return new CKEDITOR.dom.element( oRow[ c ] );
		}
		return cell.is ? -1 : null;
	}

	function cellInCol( tableMap, colIndex ) {
		var oCol = [];
		for ( var r = 0; r < tableMap.length; r++ ) {
			var row = tableMap[ r ];
			oCol.push( row[ colIndex ] );

			// Avoid adding duplicate cells.
			if ( row[ colIndex ].rowSpan > 1 )
				r += row[ colIndex ].rowSpan - 1;
		}
		return oCol;
	}

	function mergeCells( selection, mergeDirection, isDetect ) {
		var cells = getSelectedCells( selection );

		// Invalid merge request if:
		// 1. In batch mode despite that less than two selected.
		// 2. In solo mode while not exactly only one selected.
		// 3. Cells distributed in different table groups (e.g. from both thead and tbody).
		var commonAncestor;
		if ( ( mergeDirection ? cells.length != 1 : cells.length < 2 ) || ( commonAncestor = selection.getCommonAncestor() ) && commonAncestor.type == CKEDITOR.NODE_ELEMENT && commonAncestor.is( 'table' ) )
			return false;

		var cell,
			firstCell = cells[ 0 ],
			table = firstCell.getAscendant( 'table' ),
			map = CKEDITOR.tools.buildTableMap( table ),
			mapHeight = map.length,
			mapWidth = map[ 0 ].length,
			startRow = firstCell.getParent().$.rowIndex,
			startColumn = cellInRow( map, startRow, firstCell );

		if ( mergeDirection ) {
			var targetCell;
			try {
				var rowspan = parseInt( firstCell.getAttribute( 'rowspan' ), 10 ) || 1;
				var colspan = parseInt( firstCell.getAttribute( 'colspan' ), 10 ) || 1;

				targetCell = map[ mergeDirection == 'up' ? ( startRow - rowspan ) : mergeDirection == 'down' ? ( startRow + rowspan ) : startRow ][
					mergeDirection == 'left' ?
						( startColumn - colspan ) :
					mergeDirection == 'right' ? ( startColumn + colspan ) : startColumn ];

			} catch ( er ) {
				return false;
			}

			// 1. No cell could be merged.
			// 2. Same cell actually.
			if ( !targetCell || firstCell.$ == targetCell )
				return false;

			// Sort in map order regardless of the DOM sequence.
			cells[ ( mergeDirection == 'up' || mergeDirection == 'left' ) ? 'unshift' : 'push' ]( new CKEDITOR.dom.element( targetCell ) );
		}

		// Start from here are merging way ignorance (merge up/right, batch merge).
		var doc = firstCell.getDocument(),
			lastRowIndex = startRow,
			totalRowSpan = 0,
			totalColSpan = 0,
			// Use a documentFragment as buffer when appending cell contents.
			frag = !isDetect && new CKEDITOR.dom.documentFragment( doc ),
			dimension = 0;

		for ( var i = 0; i < cells.length; i++ ) {
			cell = cells[ i ];

			var tr = cell.getParent(),
				cellFirstChild = cell.getFirst(),
				colSpan = cell.$.colSpan,
				rowSpan = cell.$.rowSpan,
				rowIndex = tr.$.rowIndex,
				colIndex = cellInRow( map, rowIndex, cell );

			// Accumulated the actual places taken by all selected cells.
			dimension += colSpan * rowSpan;
			// Accumulated the maximum virtual spans from column and row.
			totalColSpan = Math.max( totalColSpan, colIndex - startColumn + colSpan );
			totalRowSpan = Math.max( totalRowSpan, rowIndex - startRow + rowSpan );

			if ( !isDetect ) {
				// Trim all cell fillers and check to remove empty cells.
				if ( trimCell( cell ), cell.getChildren().count() ) {
					// Merge vertically cells as two separated paragraphs.
					if ( rowIndex != lastRowIndex && cellFirstChild && !( cellFirstChild.isBlockBoundary && cellFirstChild.isBlockBoundary( { br: 1 } ) ) ) {
						var last = frag.getLast( CKEDITOR.dom.walker.whitespaces( true ) );
						if ( last && !( last.is && last.is( 'br' ) ) )
							frag.append( 'br' );
					}

					cell.moveChildren( frag );
				}
				i ? cell.remove() : cell.setHtml( '' );
			}
			lastRowIndex = rowIndex;
		}

		if ( !isDetect ) {
			frag.moveChildren( firstCell );

			firstCell.appendBogus();

			if ( totalColSpan >= mapWidth )
				firstCell.removeAttribute( 'rowSpan' );
			else
				firstCell.$.rowSpan = totalRowSpan;

			if ( totalRowSpan >= mapHeight )
				firstCell.removeAttribute( 'colSpan' );
			else
				firstCell.$.colSpan = totalColSpan;

			// Swip empty <tr> left at the end of table due to the merging.
			var trs = new CKEDITOR.dom.nodeList( table.$.rows ),
				count = trs.count();

			for ( i = count - 1; i >= 0; i-- ) {
				var tailTr = trs.getItem( i );
				if ( !tailTr.$.cells.length ) {
					tailTr.remove();
					count++;
					continue;
				}
			}

			return firstCell;
		}
		// Be able to merge cells only if actual dimension of selected
		// cells equals to the caculated rectangle.
		else {
			return ( totalRowSpan * totalColSpan ) == dimension;
		}
	}

	function horizontalSplitCell( selection, isDetect ) {
		var cells = getSelectedCells( selection );
		if ( cells.length > 1 )
			return false;
		else if ( isDetect )
			return true;

		var cell = cells[ 0 ],
			tr = cell.getParent(),
			table = tr.getAscendant( 'table' ),
			map = CKEDITOR.tools.buildTableMap( table ),
			rowIndex = tr.$.rowIndex,
			colIndex = cellInRow( map, rowIndex, cell ),
			rowSpan = cell.$.rowSpan,
			newCell, newRowSpan, newCellRowSpan, newRowIndex;

		if ( rowSpan > 1 ) {
			newRowSpan = Math.ceil( rowSpan / 2 );
			newCellRowSpan = Math.floor( rowSpan / 2 );
			newRowIndex = rowIndex + newRowSpan;
			var newCellTr = new CKEDITOR.dom.element( table.$.rows[ newRowIndex ] ),
				newCellRow = cellInRow( map, newRowIndex ),
				candidateCell;

			newCell = cell.clone();

			// Figure out where to insert the new cell by checking the vitual row.
			for ( var c = 0; c < newCellRow.length; c++ ) {
				candidateCell = newCellRow[ c ];
				// Catch first cell actually following the column.
				if ( candidateCell.parentNode == newCellTr.$ && c > colIndex ) {
					newCell.insertBefore( new CKEDITOR.dom.element( candidateCell ) );
					break;
				} else {
					candidateCell = null;
				}
			}

			// The destination row is empty, append at will.
			if ( !candidateCell )
				newCellTr.append( newCell );
		} else {
			newCellRowSpan = newRowSpan = 1;

			newCellTr = tr.clone();
			newCellTr.insertAfter( tr );
			newCellTr.append( newCell = cell.clone() );

			var cellsInSameRow = cellInRow( map, rowIndex );
			for ( var i = 0; i < cellsInSameRow.length; i++ )
				cellsInSameRow[ i ].rowSpan++;
		}

		newCell.appendBogus();

		cell.$.rowSpan = newRowSpan;
		newCell.$.rowSpan = newCellRowSpan;
		if ( newRowSpan == 1 )
			cell.removeAttribute( 'rowSpan' );
		if ( newCellRowSpan == 1 )
			newCell.removeAttribute( 'rowSpan' );

		return newCell;
	}

	function verticalSplitCell( selection, isDetect ) {
		var cells = getSelectedCells( selection );
		if ( cells.length > 1 )
			return false;
		else if ( isDetect )
			return true;

		var cell = cells[ 0 ],
			tr = cell.getParent(),
			table = tr.getAscendant( 'table' ),
			map = CKEDITOR.tools.buildTableMap( table ),
			rowIndex = tr.$.rowIndex,
			colIndex = cellInRow( map, rowIndex, cell ),
			colSpan = cell.$.colSpan,
			newCell, newColSpan, newCellColSpan;

		if ( colSpan > 1 ) {
			newColSpan = Math.ceil( colSpan / 2 );
			newCellColSpan = Math.floor( colSpan / 2 );
		} else {
			newCellColSpan = newColSpan = 1;
			var cellsInSameCol = cellInCol( map, colIndex );
			for ( var i = 0; i < cellsInSameCol.length; i++ )
				cellsInSameCol[ i ].colSpan++;
		}
		newCell = cell.clone();
		newCell.insertAfter( cell );
		newCell.appendBogus();

		cell.$.colSpan = newColSpan;
		newCell.$.colSpan = newCellColSpan;
		if ( newColSpan == 1 )
			cell.removeAttribute( 'colSpan' );
		if ( newCellColSpan == 1 )
			newCell.removeAttribute( 'colSpan' );

		return newCell;
	}

	// ### Table improvements

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
			selectedCells.getItem( 0 ).getAscendant( 'table' ).removeClass( fakeSelectedTableClass );
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

	function getRowIndex( rowOrCell ) {
		return rowOrCell.getAscendant( 'tr', true ).$.rowIndex;
	}

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

		if ( cell ) {
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
			cells[ 0 ].getAscendant( 'table' ).addClass( fakeSelectedTableClass );
		}

		editor.fire( 'unlockSnapshot' );
	}

	function fakeSelectionMouseHandler( evt ) {
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

		tmpContainer.setHtml( evt.data.dataValue );
		pastedTable = tmpContainer.findOne( 'table' );

		if ( !selection.isInTable() && !( boundarySelection = isBoundarySelection( selection ) ) ) {
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

	CKEDITOR.plugins.tabletools = {
		requires: 'table,dialog,contextmenu',
		onLoad: function() {
			CKEDITOR.document.appendStyleSheet( this.path + '/styles/tabletools.css' );
		},

		init: function( editor ) {
			var lang = editor.lang.table,
				styleParse = CKEDITOR.tools.style.parse;

			function createDef( def ) {
				return CKEDITOR.tools.extend( def || {}, {
					contextSensitive: 1,
					refresh: function( editor, path ) {
						this.setState( path.contains( { td: 1, th: 1 }, 1 ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
					}
				} );
			}
			function addCmd( name, def ) {
				var cmd = editor.addCommand( name, def );
				editor.addFeature( cmd );
			}

			addCmd( 'cellProperties', new CKEDITOR.dialogCommand( 'cellProperties', createDef( {
				allowedContent: 'td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]',
				requiredContent: 'table',
				contentTransformations: [ [ {
						element: 'td',
						left: function( element ) {
							return element.styles.background && styleParse.background( element.styles.background ).color;
						},
						right: function( element ) {
							element.styles[ 'background-color' ] = styleParse.background( element.styles.background ).color;
						}
					}, {
						element: 'td',
						check: 'td{vertical-align}',
						left: function( element ) {
							return element.attributes && element.attributes.valign;
						},
						right: function( element ) {
							element.styles[ 'vertical-align' ] = element.attributes.valign;
							delete element.attributes.valign;
						}
					}
					], [
						{
							// (#16818)
							element: 'tr',
							check: 'td{height}',
							left: function( element ) {
								return element.styles && element.styles.height;
							},
							right: function( element ) {
								CKEDITOR.tools.array.forEach( element.children, function( node ) {
									if ( node.name in { td: 1, th: 1 } ) {
										node.attributes[ 'cke-row-height' ] = element.styles.height;
									}
								} );

								delete element.styles.height;
							}
						}
					], [
						{
							// (#16818)
							element: 'td',
							check: 'td{height}',
							left: function( element ) {
								var attributes = element.attributes;
								return attributes && attributes[ 'cke-row-height' ];
							},
							right: function( element ) {
								element.styles.height = element.attributes[ 'cke-row-height' ];
								delete element.attributes[ 'cke-row-height' ];
							}
						}
					] ]
			} ) ) );
			CKEDITOR.dialog.add( 'cellProperties', this.path + 'dialogs/tableCell.js' );

			addCmd( 'rowDelete', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cursorPosition = deleteRows( selection );

					if ( cursorPosition ) {
						placeCursorInCell( cursorPosition );
					}
				}
			} ) );

			addCmd( 'rowInsertBefore', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertRow( cells, true );

					// Restore original fake selection.
					if ( editor.config.tableImprovements ) {
						fakeSelectCells( editor, cells );
					}
				}
			} ) );

			addCmd( 'rowInsertAfter', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertRow( cells );

					// Restore original fake selection.
					if ( editor.config.tableImprovements ) {
						fakeSelectCells( editor, cells );
					}
				}
			} ) );

			addCmd( 'columnDelete', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection();
					var element = deleteColumns( selection );
					element && placeCursorInCell( element, true );
				}
			} ) );

			addCmd( 'columnInsertBefore', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertColumn( cells, true );

					// Restore original fake selection.
					if ( editor.config.tableImprovements ) {
						fakeSelectCells( editor, cells );
					}
				}
			} ) );

			addCmd( 'columnInsertAfter', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertColumn( cells );

					// Restore original fake selection.
					if ( editor.config.tableImprovements ) {
						fakeSelectCells( editor, cells );
					}
				}
			} ) );

			addCmd( 'cellDelete', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection();

					deleteCells( selection );

					// Restore original fake selection.
					if ( editor.config.tableImprovements ) {
						clearFakeCellSelection( editor, true );
					}
				}
			} ) );

			addCmd( 'cellMerge', createDef( {
				allowedContent: 'td[colspan,rowspan]',
				requiredContent: 'td[colspan,rowspan]',
				exec: function( editor ) {
					var cell = mergeCells( editor.getSelection() );

					// If table improvements are enabled, fake select new cell.
					// Otherwise place cursor inside it.
					if ( editor && editor.config.tableImprovements ) {
						fakeSelectCells( editor, [ cell ] );
					} else {
						placeCursorInCell( cell, true );
					}
				}
			} ) );

			addCmd( 'cellMergeRight', createDef( {
				allowedContent: 'td[colspan]',
				requiredContent: 'td[colspan]',
				exec: function( editor ) {
					var cell = mergeCells( editor.getSelection(), 'right' );

					// If table improvements are enabled, then select the new cell.
					// Otherwise place cursor inside it.
					if ( editor && editor.config.tableImprovements ) {
						fakeSelectCells( editor, [ cell ] );
					} else {
						placeCursorInCell( cell, true );
					}
				}
			} ) );

			addCmd( 'cellMergeDown', createDef( {
				allowedContent: 'td[rowspan]',
				requiredContent: 'td[rowspan]',
				exec: function( editor ) {
					var cell = mergeCells( editor.getSelection(), 'down' );

					// If table improvements are enabled, then select the new cell.
					// Otherwise place cursor inside it.
					if ( editor && editor.config.tableImprovements ) {
						fakeSelectCells( editor, [ cell ] );
					} else {
						placeCursorInCell( cell, true );
					}
				}
			} ) );

			addCmd( 'cellVerticalSplit', createDef( {
				allowedContent: 'td[rowspan]',
				requiredContent: 'td[rowspan]',
				exec: function( editor ) {
					placeCursorInCell( verticalSplitCell( editor.getSelection() ) );
				}
			} ) );

			addCmd( 'cellHorizontalSplit', createDef( {
				allowedContent: 'td[colspan]',
				requiredContent: 'td[colspan]',
				exec: function( editor ) {
					placeCursorInCell( horizontalSplitCell( editor.getSelection() ) );
				}
			} ) );

			addCmd( 'cellInsertBefore', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertCell( selection, true );

					// Restore original fake selection.
					if ( editor.config.tableImprovements ) {
						fakeSelectCells( editor, cells );
					}
				}
			} ) );

			addCmd( 'cellInsertAfter', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertCell( selection );

					// Restore original fake selection.
					if ( editor.config.tableImprovements ) {
						fakeSelectCells( editor, cells );
					}
				}
			} ) );

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems ) {
				editor.addMenuItems( {
					tablecell: {
						label: lang.cell.menu,
						group: 'tablecell',
						order: 1,
						getItems: function() {
							var selection = editor.getSelection(),
								cells = getSelectedCells( selection );
							return {
								tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablecell_delete: CKEDITOR.TRISTATE_OFF,
								tablecell_merge: mergeCells( selection, null, true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_merge_right: mergeCells( selection, 'right', true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_merge_down: mergeCells( selection, 'down', true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_split_vertical: verticalSplitCell( selection, true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_split_horizontal: horizontalSplitCell( selection, true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
								tablecell_properties: cells.length > 0 ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
							};
						}
					},

					tablecell_insertBefore: {
						label: lang.cell.insertBefore,
						group: 'tablecell',
						command: 'cellInsertBefore',
						order: 5
					},

					tablecell_insertAfter: {
						label: lang.cell.insertAfter,
						group: 'tablecell',
						command: 'cellInsertAfter',
						order: 10
					},

					tablecell_delete: {
						label: lang.cell.deleteCell,
						group: 'tablecell',
						command: 'cellDelete',
						order: 15
					},

					tablecell_merge: {
						label: lang.cell.merge,
						group: 'tablecell',
						command: 'cellMerge',
						order: 16
					},

					tablecell_merge_right: {
						label: lang.cell.mergeRight,
						group: 'tablecell',
						command: 'cellMergeRight',
						order: 17
					},

					tablecell_merge_down: {
						label: lang.cell.mergeDown,
						group: 'tablecell',
						command: 'cellMergeDown',
						order: 18
					},

					tablecell_split_horizontal: {
						label: lang.cell.splitHorizontal,
						group: 'tablecell',
						command: 'cellHorizontalSplit',
						order: 19
					},

					tablecell_split_vertical: {
						label: lang.cell.splitVertical,
						group: 'tablecell',
						command: 'cellVerticalSplit',
						order: 20
					},

					tablecell_properties: {
						label: lang.cell.title,
						group: 'tablecellproperties',
						command: 'cellProperties',
						order: 21
					},

					tablerow: {
						label: lang.row.menu,
						group: 'tablerow',
						order: 1,
						getItems: function() {
							return {
								tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablerow_delete: CKEDITOR.TRISTATE_OFF
							};
						}
					},

					tablerow_insertBefore: {
						label: lang.row.insertBefore,
						group: 'tablerow',
						command: 'rowInsertBefore',
						order: 5
					},

					tablerow_insertAfter: {
						label: lang.row.insertAfter,
						group: 'tablerow',
						command: 'rowInsertAfter',
						order: 10
					},

					tablerow_delete: {
						label: lang.row.deleteRow,
						group: 'tablerow',
						command: 'rowDelete',
						order: 15
					},

					tablecolumn: {
						label: lang.column.menu,
						group: 'tablecolumn',
						order: 1,
						getItems: function() {
							return {
								tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
								tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
								tablecolumn_delete: CKEDITOR.TRISTATE_OFF
							};
						}
					},

					tablecolumn_insertBefore: {
						label: lang.column.insertBefore,
						group: 'tablecolumn',
						command: 'columnInsertBefore',
						order: 5
					},

					tablecolumn_insertAfter: {
						label: lang.column.insertAfter,
						group: 'tablecolumn',
						command: 'columnInsertAfter',
						order: 10
					},

					tablecolumn_delete: {
						label: lang.column.deleteColumn,
						group: 'tablecolumn',
						command: 'columnDelete',
						order: 15
					}
				} );
			}

			// If the "contextmenu" plugin is laoded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element, selection, path ) {
					var cell = path.contains( { 'td': 1, 'th': 1 }, 1 );
					if ( cell && !cell.isReadOnly() ) {
						return {
							tablecell: CKEDITOR.TRISTATE_OFF,
							tablerow: CKEDITOR.TRISTATE_OFF,
							tablecolumn: CKEDITOR.TRISTATE_OFF
						};
					}

					return null;
				} );
			}

			// Allow overwriting the native table selection with our custom one.
			if ( editor.config.tableImprovements ) {
				// Add styles for fake visual selection.
				editor.addContentsCss( this.path + '/styles/tabletools.css' );

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
					// Setup copybin.
					if ( CKEDITOR.plugins.clipboard && !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
						editable.attachListener( editable, 'cut', fakeSelectionCopyCutHandler );
						editable.attachListener( editable, 'copy', fakeSelectionCopyCutHandler );
					}
				} );

				editor.on( 'paste', fakeSelectionPasteHandler );
			}
		},

		getSelectedCells: getSelectedCells,
		getCellsBetween: getCellsBetween,

		/**
		 * @param {CKEDITOR.dom.range[]} ranges
		 * @returns {CKEDITOR.dom.range[]}
		 * @member CKEDITOR.plugins.tabletools
		 */
		mergeRanges: function( ranges ) {
			function rangeEnlargeOverText( rng ) {
				rng.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				var nextNode = rng.endContainer.getChild( rng.endOffset ),
					prevNode;

				if ( rng.startOffset > 0 ) {
					prevNode = rng.startContainer.getChild( rng.startOffset - 1 );
				}

				if ( nextNode && nextNode.type === CKEDITOR.NODE_TEXT && nextNode.getText().match( /^\s+$/m ) ) {
					rng.setEnd( rng.endContainer, rng.endOffset + 1 );
					rng.enlarge( CKEDITOR.ENLARGE_ELEMENT );
				}

				if ( prevNode && prevNode.type === CKEDITOR.NODE_TEXT && prevNode.getText().match( /^\s+$/m ) ) {
					rng.setStart( rng.startContainer, rng.startOffset - 1 );
					rng.enlarge( CKEDITOR.ENLARGE_ELEMENT );
				}
			}

			return CKEDITOR.tools.array.reduce( ranges, function( ret, rng ) {
				// Last range ATM.
				var lastRange = ret[ ret.length - 1 ],
					isContinuation = false,
					gapRange;

				// Make a clone, we don't want to modify input.
				rng = rng.clone();
				rng.enlarge( CKEDITOR.ENLARGE_ELEMENT );

				// if ( lastRange ) {
				// 	lastRangeEnlarged = lastRange.clone();
				// 	rangeEnlargeOverText( lastRangeEnlarged );

				// 	curRangeEnlarged = rng.clone();
				// 	curRangeEnlarged.enlarge( CKEDITOR.ENLARGE_ELEMENT );
				// }

				// if ( lastRange && lastRangeEnlarged._equalEnd( curRangeEnlarged.startContainer, curRangeEnlarged.startOffset ) ) {
				// 	// If last range ends, where the current range starts, then let's merge it.
				// 	lastRange.setEnd( curRangeEnlarged.endContainer, curRangeEnlarged.endOffset );
				// } else {
				// 	ret.push( rng.clone() );
				// }

				if ( lastRange ) {
					gapRange = new CKEDITOR.dom.range( rng.root );
					gapRange.setStart( lastRange.endContainer, lastRange.endOffset );
					gapRange.setEnd( rng.startContainer, rng.startOffset );

					var walker = new CKEDITOR.dom.walker( gapRange ),
						isWhitespace = CKEDITOR.dom.walker.whitespaces();

					var contentInBetween = walker.next();

					while ( isWhitespace( contentInBetween ) || rng.endContainer.equals( contentInBetween ) ) {
						// We don't care about whitespaces, and range container.
						contentInBetween = walker.next();
					}

					// Simply, if anything has been found there's a content in between the two.
					isContinuation = !contentInBetween;

					// if ( !isContinuation ) {
					// 	debugger;
					// }
				}

				if ( isContinuation ) {
					// If last range ends, where the current range starts, then let's merge it.
					lastRange.setEnd( rng.endContainer, rng.endOffset );
				} else {
					ret.push( rng );
				}

				return ret;
			}, [] );
		}
	};
	CKEDITOR.plugins.add( 'tabletools', CKEDITOR.plugins.tabletools );
} )();

/**
 * Create a two-dimension array that reflects the actual layout of table cells,
 * with cell spans, with mappings to the original td elements.
 *
 * It could also create the map for the specified fragment of the table.
 *
 * @param {CKEDITOR.dom.element} table
 * @param {Number} startRow Row's index from which the map should be created.
 * @param {Number} startCell Cell's index from which the map should be created.
 * @param {Number} endRow Row's index to which the map should be created.
 * @param {Number} endCell Cell's index to which the map should be created.
 * @member CKEDITOR.tools
 */
CKEDITOR.tools.buildTableMap = function( table, startRow, startCell, endRow, endCell ) {
	var aRows = table.$.rows;

	startRow = startRow || 0;
	startCell = startCell || 0;
	endRow = typeof endRow === 'number' ? endRow : aRows.length - 1;
	endCell = typeof endCell === 'number' ? endCell : -1;

	// Row and Column counters.
	var r = -1;

	var aMap = [];

	for ( var i = startRow; i <= endRow; i++ ) {
		r++;
		!aMap[ r ] && ( aMap[ r ] = [] );

		var c = -1;

		for ( var j = startCell; j <= ( endCell === -1 ? ( aRows[ i ].cells.length - 1 ) : endCell ); j++ ) {
			var oCell = aRows[ i ].cells[ j ];

			if ( !oCell ) {
				break;
			}

			c++;
			while ( aMap[ r ][ c ] )
				c++;

			var iColSpan = isNaN( oCell.colSpan ) ? 1 : oCell.colSpan;
			var iRowSpan = isNaN( oCell.rowSpan ) ? 1 : oCell.rowSpan;

			for ( var rs = 0; rs < iRowSpan; rs++ ) {
				if ( i + rs > endRow ) {
					break;
				}

				if ( !aMap[ r + rs ] )
					aMap[ r + rs ] = [];

				for ( var cs = 0; cs < iColSpan; cs++ ) {
					aMap[ r + rs ][ c + cs ] = aRows[ i ].cells[ j ];
				}
			}

			c += iColSpan - 1;

			if ( endCell !== -1 && c >= endCell ) {
				break;
			}
		}
	}
	return aMap;
};
