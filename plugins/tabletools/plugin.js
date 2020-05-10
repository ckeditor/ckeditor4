/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	var isArray = CKEDITOR.tools.isArray;

	function getSelectedCells( selection, table ) {
		var retval = [],
			database = {};

		if ( !selection ) {
			return retval;
		}

		var ranges = selection.getRanges();

		function isInTable( cell ) {
			if ( !table ) {
				return true;
			}

			return table.contains( cell ) && cell.getAscendant( 'table', true ).equals( table );
		}

		function moveOutOfCellGuard( node ) {
			var cellNodeRegex = /^(?:td|th)$/;

			// Apply to the first cell only.
			if ( retval.length > 0 ) {
				return;
			}

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
				var startNode = range.getCommonAncestor(),
					nearestCell = startNode.getAscendant( { td: 1, th: 1 }, true );

				if ( nearestCell && isInTable( nearestCell ) ) {
					retval.push( nearestCell );
				}
			} else {
				var walker = new CKEDITOR.dom.walker( range ),
					node;

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
			cell,
			focusedCell,
			tr;

		while ( ( cell = cellsToDelete[ i++ ] ) ) {
			CKEDITOR.dom.element.setMarker( database, cell, 'delete_cell', true );
		}

		// 1. At first we check left or right side focusable cell row by row;
		i = 0;
		while ( ( cell = cellsToDelete[ i++ ] ) ) {
			if ( ( focusedCell = cell.getPrevious() ) && !focusedCell.getCustomData( 'delete_cell' ) || ( focusedCell = cell.getNext() ) && !focusedCell.getCustomData( 'delete_cell' ) ) {
				CKEDITOR.dom.element.clearAllMarkers( database );
				return focusedCell;
			}
		}

		CKEDITOR.dom.element.clearAllMarkers( database );

		// 2. then we check the toppest row (outside the selection area square) focusable cell;
		tr = cellsToDelete[ 0 ].getParent();
		if ( ( tr = tr.getPrevious() ) ) {
			return tr.getLast();
		}

		// 3. last we check the lowerest row focusable cell.
		tr = cellsToDelete[ last ].getParent();
		if ( ( tr = tr.getNext() ) ) {
			return tr.getChild( 0 );
		}

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
			row = insertBefore ? startRow : endRow,
			map = CKEDITOR.tools.buildTableMap( table ),
			cloneRow = map[ rowIndex ],
			nextRow = insertBefore ? map[ rowIndex - 1 ] : map[ rowIndex + 1 ],
			width = map[ 0 ].length,
			newRow = doc.createElement( 'tr' );

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

		return newRow;
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

					if ( cell.$.rowSpan == 1 ) {
						cell.remove();
					}
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

	function getCellColIndex( cell ) {
		var row = cell.getParent(),
			rowCells = row.$.cells;

		var colIndex = 0;
		for ( var i = 0; i < rowCells.length; i++ ) {
			var mapCell = rowCells[ i ];

			// Not always adding colSpan results in wrong position
			// of newly inserted column. (#591) (https://dev.ckeditor.com/ticket/13729)
			colIndex += mapCell.colSpan;
			if ( mapCell == cell.$ ) {
				break;
			}
		}

		return colIndex - 1;
	}

	function getColumnsIndices( cells, isStart ) {
		var retval = isStart ? Infinity : 0;

		for ( var i = 0; i < cells.length; i++ ) {
			var colIndex = getCellColIndex( cells[ i ] );

			if ( isStart ? colIndex < retval : colIndex > retval ) {
				retval = colIndex;
			}
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
			map = CKEDITOR.tools.buildTableMap( table ),
			cloneCol = [],
			nextCol = [],
			addedCells = [],
			height = map.length,
			originalCell;

		for ( var i = 0; i < height; i++ ) {
			var nextCell = insertBefore ? map[ i ][ colIndex - 1 ] : map[ i ][ colIndex + 1 ];

			cloneCol.push( map[ i ][ colIndex ] );
			nextCol.push( nextCell );
		}

		for ( i = 0; i < height; i++ ) {
			var cell;

			if ( !cloneCol[ i ] ) {
				continue;
			}

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
				addedCells.push( cell );
				cell = cell.$;
			}

			i += cell.rowSpan - 1;
		}

		return addedCells;
	}

	function deleteColumns( selection ) {
		function processSelection( selection ) {
			// If selection leak to next td/th cell, then preserve it in previous cell.

			var ranges = selection.getRanges(),
				range,
				endNode,
				endNodeName,
				previous;

			if ( ranges.length !== 1 ) {
				return selection;
			}

			range = ranges[0];
			if ( range.collapsed || range.endOffset !== 0 ) {
				return selection;
			}

			endNode = range.endContainer;
			endNodeName = endNode.getName().toLowerCase();
			if ( !( endNodeName === 'td' || endNodeName === 'th' ) ) {
				return selection;
			}

			// Get previous td/th element or the last from previous row.
			previous = endNode.getPrevious();
			if ( !previous ) {
				previous = endNode.getParent().getPrevious().getLast();
			}

			// Get most inner text node or br in case of empty cell.
			while ( previous.type !== CKEDITOR.NODE_TEXT && previous.getName().toLowerCase() !== 'br' ) {
				previous = previous.getLast();
				// Generraly previous should never be null, if statement is just for possible weird edge cases.
				if ( !previous ) {
					return selection;
				}
			}

			range.setEndAt( previous, CKEDITOR.POSITION_BEFORE_END );
			return range.select();
		}

		// Problem occures only on webkit in case of native selection (#577).
		// Upstream: https://bugs.webkit.org/show_bug.cgi?id=175131, https://bugs.chromium.org/p/chromium/issues/detail?id=752091
		if ( CKEDITOR.env.webkit && !selection.isFake ) {
			selection = processSelection( selection );
		}

		var ranges = selection.getRanges(),
			cells = getSelectedCells( selection ),
			firstCell = cells[ 0 ],
			lastCell = cells[ cells.length - 1 ],
			table = firstCell.getAscendant( 'table' ),
			map = CKEDITOR.tools.buildTableMap( table ),
			startColIndex, endColIndex,
			rowsToDelete = [];

		selection.reset();

		// Figure out selected cells' column indices.
		for ( var i = 0, rows = map.length; i < rows; i++ ) {
			for ( var j = 0, cols = map[ i ].length; j < cols; j++ ) {
				// #577
				// Map might contain multiple times this same element, because of existings collspan.
				// We don't want to overwrite startIndex in such situation and take first one.
				if ( startColIndex === undefined && map[ i ][ j ] == firstCell.$ ) {
					startColIndex = j;
				}
				if ( map[ i ][ j ] == lastCell.$ ) {
					endColIndex = j;
				}
			}
		}

		// Delete cell or reduce cell spans by checking through the table map.
		for ( i = startColIndex; i <= endColIndex; i++ ) {
			for ( j = 0; j < map.length; j++ ) {
				var mapRow = map[ j ],
					row = new CKEDITOR.dom.element( table.$.rows[ j ] ),
					cell = new CKEDITOR.dom.element( mapRow[ i ] );

				if ( cell.$ ) {
					if ( cell.$.colSpan == 1 ) {
						cell.remove();
					} else {
						// Reduce the col spans.
						cell.$.colSpan -= 1;
					}

					j += cell.$.rowSpan - 1;

					if ( !row.$.cells.length ) {
						rowsToDelete.push( row );
					}
				}
			}
		}

		// Where to put the cursor after columns been deleted?
		// 1. Into next cell of the first row if any;
		// 2. Into previous cell of the first row if any;
		// 3. Into table's parent element;
		var cursorPosition;
		if ( map[ 0 ].length - 1 > endColIndex ) {
			cursorPosition = new CKEDITOR.dom.element( map[ 0 ][ endColIndex + 1 ] );
		} else if ( startColIndex && map[ 0 ][ startColIndex - 1 ].cellIndex !== -1 ) {
			cursorPosition = new CKEDITOR.dom.element( map[ 0 ][ startColIndex - 1 ] );
		} else {
			cursorPosition = new CKEDITOR.dom.element( table.$.parentNode );
		}

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
			cell = startElement.getAscendant( { td: 1, th: 1 }, true );

		if ( !cell ) {
			return;
		}

		// Create the new cell element to be added.
		var newCell = cell.clone();
		newCell.appendBogus();

		if ( insertBefore ) {
			newCell.insertBefore( cell );
		} else {
			newCell.insertAfter( cell );
		}
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
		// selection the dirty and shameful way (https://dev.ckeditor.com/ticket/10308).
		// We can not apply this hack to IE8 because
		// it causes error (https://dev.ckeditor.com/ticket/11058).
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

		if ( typeof cell == 'undefined' ) {
			return oRow;
		}

		for ( var c = 0; oRow && c < oRow.length; c++ ) {
			if ( cell.is && oRow[ c ] == cell.$ ) {
				return c;
			} else if ( c == cell ) {
				return new CKEDITOR.dom.element( oRow[ c ] );
			}
		}
		return cell.is ? -1 : null;
	}

	function cellInCol( tableMap, colIndex ) {
		var oCol = [];
		for ( var r = 0; r < tableMap.length; r++ ) {
			var row = tableMap[ r ];
			oCol.push( row[ colIndex ] );

			// Avoid adding duplicate cells.
			if ( row[ colIndex ].rowSpan > 1 ) {
				r += row[ colIndex ].rowSpan - 1;
			}
		}
		return oCol;
	}

	function mergeCells( selection, mergeDirection, isDetect ) {
		var cells = getSelectedCells( selection ),
			commonAncestor;

		// Invalid merge request if:
		// 1. In batch mode despite that less than two selected.
		// 2. In solo mode while not exactly only one selected.
		// 3. Cells distributed in different table groups (e.g. from both thead and tbody).
		if ( ( mergeDirection ? cells.length != 1 : cells.length < 2 ) ||
			( commonAncestor = selection.getCommonAncestor() ) &&
			commonAncestor.type == CKEDITOR.NODE_ELEMENT && commonAncestor.is( 'table' ) ) {
			return false;
		}

		var firstCell = cells[ 0 ],
			table = firstCell.getAscendant( 'table' ),
			map = CKEDITOR.tools.buildTableMap( table ),
			mapHeight = map.length,
			mapWidth = map[ 0 ].length,
			startRow = firstCell.getParent().$.rowIndex,
			startColumn = cellInRow( map, startRow, firstCell ),
			cell;

		if ( mergeDirection ) {
			var targetCell;
			try {
				var rowspan = parseInt( firstCell.getAttribute( 'rowspan' ), 10 ) || 1,
					colspan = parseInt( firstCell.getAttribute( 'colspan' ), 10 ) || 1;

				targetCell = map[ mergeDirection == 'up' ? ( startRow - rowspan ) : mergeDirection == 'down' ? ( startRow + rowspan ) : startRow ][
					mergeDirection == 'left' ?
						( startColumn - colspan ) :
					mergeDirection == 'right' ? ( startColumn + colspan ) : startColumn ];

			} catch ( er ) {
				return false;
			}

			// 1. No cell could be merged.
			// 2. Same cell actually.
			if ( !targetCell || firstCell.$ == targetCell ) {
				return false;
			}

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
						if ( last && !( last.is && last.is( 'br' ) ) ) {
							frag.append( 'br' );
						}
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

			if ( totalColSpan >= mapWidth ) {
				firstCell.removeAttribute( 'rowSpan' );
			} else {
				firstCell.$.rowSpan = totalRowSpan;
			}

			if ( totalRowSpan >= mapHeight ) {
				firstCell.removeAttribute( 'colSpan' );
			} else {
				firstCell.$.colSpan = totalColSpan;
			}

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

	CKEDITOR.plugins.tabletools = {
		requires: 'table,dialog,contextmenu',

		init: function( editor ) {
			var lang = editor.lang.table,
				styleParse = CKEDITOR.tools.style.parse,
				requiredContent = [
					'td{width}', 'td{height}', 'td{border-color}', 'td{background-color}', 'td{white-space}', 'td{vertical-align}', 'td{text-align}',
					'td[colspan]', 'td[rowspan]', 'th' ];

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
				requiredContent: requiredContent,
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
							// (https://dev.ckeditor.com/ticket/16818)
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
							// (https://dev.ckeditor.com/ticket/16818)
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
				}
			} ) );

			addCmd( 'rowInsertAfter', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertRow( cells );
				}
			} ) );

			addCmd( 'columnDelete', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						element = deleteColumns( selection );

					if ( element ) {
						placeCursorInCell( element, true );
					}
				}
			} ) );

			addCmd( 'columnInsertBefore', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertColumn( cells, true );
				}
			} ) );

			addCmd( 'columnInsertAfter', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection(),
						cells = getSelectedCells( selection );

					insertColumn( cells );
				}
			} ) );

			addCmd( 'cellDelete', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection();

					deleteCells( selection );
				}
			} ) );

			addCmd( 'cellMerge', createDef( {
				allowedContent: 'td[colspan,rowspan]',
				requiredContent: 'td[colspan,rowspan]',
				exec: function( editor, data ) {
					data.cell = mergeCells( editor.getSelection() );

					placeCursorInCell( data.cell, true );
				}
			} ) );

			addCmd( 'cellMergeRight', createDef( {
				allowedContent: 'td[colspan]',
				requiredContent: 'td[colspan]',
				exec: function( editor, data ) {
					data.cell = mergeCells( editor.getSelection(), 'right' );

					placeCursorInCell( data.cell, true );
				}
			} ) );

			addCmd( 'cellMergeDown', createDef( {
				allowedContent: 'td[rowspan]',
				requiredContent: 'td[rowspan]',
				exec: function( editor, data ) {
					data.cell = mergeCells( editor.getSelection(), 'down' );

					placeCursorInCell( data.cell, true );
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
					var selection = editor.getSelection();

					insertCell( selection, true );
				}
			} ) );

			addCmd( 'cellInsertAfter', createDef( {
				requiredContent: 'table',
				exec: function( editor ) {
					var selection = editor.getSelection();

					insertCell( selection );
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
								cells = getSelectedCells( selection ),
								items = {
									tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
									tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
									tablecell_delete: CKEDITOR.TRISTATE_OFF,
									tablecell_merge: mergeCells( selection, null, true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
									tablecell_merge_right: mergeCells( selection, 'right', true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
									tablecell_merge_down: mergeCells( selection, 'down', true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
									tablecell_split_vertical: verticalSplitCell( selection, true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
									tablecell_split_horizontal: horizontalSplitCell( selection, true ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
								};

							if ( editor.filter.check( requiredContent ) ) {
								items.tablecell_properties = cells.length > 0 ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
							}

							return items;
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

			// If the "contextmenu" plugin is loaded, register the listeners.
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
		},

		// These methods are needed by tableselection plugin, so we must expose them.
		getCellColIndex: getCellColIndex,
		insertRow: insertRow,
		insertColumn: insertColumn,

		getSelectedCells: getSelectedCells
	};
	CKEDITOR.plugins.add( 'tabletools', CKEDITOR.plugins.tabletools );
} )();

/**
 * Creates a two-dimension array that reflects the actual layout of table cells,
 * with cell spans, with mappings to the original `td` elements.
 *
 * It could also create a map for the specified fragment of the table.
 *
 * @param {CKEDITOR.dom.element} table
 * @param {Number} startRow Row index from which the map should be created.
 * @param {Number} startCell Cell index from which the map should be created.
 * @param {Number} endRow Row index to which the map should be created.
 * @param {Number} endCell Cell index to which the map should be created.
 * @member CKEDITOR.tools
 */
CKEDITOR.tools.buildTableMap = function( table, startRow, startCell, endRow, endCell ) {
	var aRows = table.$.rows;

	startRow = startRow || 0;
	startCell = startCell || 0;
	endRow = typeof endRow === 'number' ? endRow : aRows.length - 1;
	endCell = typeof endCell === 'number' ? endCell : -1;

	// Row and Column counters.
	var r = -1,
		aMap = [];

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
			while ( aMap[ r ][ c ] ) {
				c++;
			}

			var iColSpan = isNaN( oCell.colSpan ) ? 1 : oCell.colSpan,
				iRowSpan = isNaN( oCell.rowSpan ) ? 1 : oCell.rowSpan;

			for ( var rs = 0; rs < iRowSpan; rs++ ) {
				if ( i + rs > endRow ) {
					break;
				}

				if ( !aMap[ r + rs ] ) {
					aMap[ r + rs ] = [];
				}

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
