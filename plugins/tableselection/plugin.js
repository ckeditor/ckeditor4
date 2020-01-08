/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var fakeSelectedClass = 'cke_table-faked-selection',
		fakeSelectedEditorClass = fakeSelectedClass + '-editor',
		fakeSelectedTableDataAttribute = 'cke-table-faked-selection-table',
		ignoredTableAttribute = 'data-cke-tableselection-ignored',
		fakeSelection = { active: false },
		tabletools,
		getSelectedCells,
		getCellColIndex,
		insertRow,
		insertColumn;

	function isWidget( element ) {
		return CKEDITOR.plugins.widget && CKEDITOR.plugins.widget.isDomWidget( element );
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

	function detectLeftMouseButton( evt ) {
		return CKEDITOR.tools.getMouseButton( evt ) === CKEDITOR.MOUSE_BUTTON_LEFT;
	}

	// Checks whether a given range fully contains a table element (cell/tbody/table etc).
	// @param {CKEDITOR.dom.range} range
	// @returns {Boolean}
	function rangeContainsTableElement( range ) {
		if ( range ) {
			// Clone the range as we're going to enlarge it, and we don't want to modify the input.
			range = range.clone();

			range.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			var enclosedNode = range.getEnclosedNode();

			return enclosedNode && enclosedNode.is && enclosedNode.is( CKEDITOR.dtd.$tableContent );
		}
	}

	function getFakeSelectedTable( editor ) {
		var selectedCell = editor.editable().findOne( '.' + fakeSelectedClass );

		return selectedCell && selectedCell.getAscendant( 'table' );
	}

	function clearFakeCellSelection( editor, reset ) {
		var selectedCells = editor.editable().find( '.' + fakeSelectedClass ),
			selectedTable = editor.editable().findOne( '[data-' + fakeSelectedTableDataAttribute + ']' ),
			i;

		editor.fire( 'lockSnapshot' );

		editor.editable().removeClass( fakeSelectedEditorClass );

		for ( i = 0; i < selectedCells.count(); i++ ) {
			selectedCells.getItem( i ).removeClass( fakeSelectedClass );
		}

		// Table may be selected even though no cells are selected (e.g. after deleting cells.)
		if ( selectedTable ) {
			selectedTable.data( fakeSelectedTableDataAttribute, false );
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

		// We should check if the newly selected cell is still inside the same table (https://dev.ckeditor.com/ticket/17052, #493).
		if ( cell && fakeSelection.first.getAscendant( 'table' ).equals( cell.getAscendant( 'table' ) ) ) {
			cells = getCellsBetween( fakeSelection.first, cell );

			// The selection is inside one cell, so we should allow native selection,
			// but only in case if no other cell between mousedown and mouseup
			// was selected.
			// We don't want to clear selection if widget is event target (#1027).
			if ( !fakeSelection.dirty && cells.length === 1 && !( isWidget( evt.data.getTarget() ) ) ) {
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
			enclosedNode = ranges && ranges[ 0 ].getEnclosedNode(),
			isEnclosedNodeAnImage = enclosedNode && ( enclosedNode.type == CKEDITOR.NODE_ELEMENT ) && enclosedNode.is( 'img' ),
			cells,
			table,
			iterator;

		if ( !selection ) {
			return;
		}

		clearFakeCellSelection( editor );

		if ( !selection.isInTable() || !selection.isFake ) {
			return;
		}

		// Don't perform fake selection when image is selected (#2235).
		if ( isEnclosedNodeAnImage ) {
			editor.getSelection().reset();
			return;
		}

		// (#2945)
		if ( ranges[ 0 ]._getTableElement( { table: 1 } ).hasAttribute( ignoredTableAttribute ) ) {
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

		for ( iterator = 0; iterator < cells.length; iterator++ ) {
			cells[ iterator ].addClass( fakeSelectedClass );
		}

		if ( cells.length > 0 ) {
			editor.editable().addClass( fakeSelectedEditorClass );
			cells[ 0 ].getAscendant( 'table' ).data( fakeSelectedTableDataAttribute, '' );
		}

		editor.fire( 'unlockSnapshot' );
	}

	function getRowIndex( rowOrCell ) {
		return rowOrCell.getAscendant( 'tr', true ).$.rowIndex;
	}

	function fakeSelectionMouseHandler( evt ) {
		// Prevent of throwing error in console if target is undefined (#515).
		if ( !evt.data.getTarget().getName ) {
			return;
		}
		// Prevent applying table selection when widget is selected.
		// Mouseup remains a possibility to finish table selection when user release mouse button above widget in table.
		if ( evt.name !== 'mouseup' && isWidget( evt.data.getTarget() ) ) {
			return;
		}

		var editor = evt.editor || evt.listenerData.editor,
			selection = editor.getSelection( 1 ),
			selectedTable = getFakeSelectedTable( editor ),
			target = evt.data.getTarget(),
			cell = target && target.getAscendant( { td: 1, th: 1 }, true ),
			table = target && target.getAscendant( 'table', true ),
			tableElements = { table: 1, thead: 1, tbody: 1, tfoot: 1, tr: 1, td: 1, th: 1 };

		// (#2945)
		if ( table && table.hasAttribute( ignoredTableAttribute ) ) {
			return;
		}

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

			var isProperMouseEvent = evt.name === ( CKEDITOR.env.gecko ? 'mousedown' : 'mouseup' );
			// Covers a case when:
			// 1. User releases mouse button outside the table.
			// 2. User opens context menu outside of selection.
			// Use 'mousedown' for Firefox, as it doesn't fire 'mouseup' when mouse is released in context menu.
			return isProperMouseEvent && !isOutsideTable( evt.data.getTarget() ) &&
				!isInSelectedCell( evt.data.getTarget(), fakeSelectedClass );
		}

		function isInSelectedCell( target, fakeSelectedClass ) {
			var cell = target.getAscendant( { td: 1, th: 1 }, true );

			return cell && cell.hasClass( fakeSelectedClass );
		}

		if ( canClearSelection( evt, selection, selectedTable, table ) ) {
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
		var table = evt.data.getTarget().getAscendant( 'table', true );

		// (#2945)
		if ( table && table.hasAttribute( ignoredTableAttribute ) ) {
			return;
		}

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

		// (#2945)
		if ( selection.getRanges()[ 0 ]._getTableElement( { table: 1 } ).hasAttribute( ignoredTableAttribute ) ) {
			return;
		}


		copyTable( editor, evt.name === 'cut' );
	}

	// A helper object abstracting table selection.
	// By calling setSelectedCells() method it will automatically determine what's
	// the first/last cell or row.
	//
	// Note: ATM the type does not make an actual selection, it just holds the data.
	//
	// @param {CKEDITOR.dom.element[]} [cells] An array of cells considered to be selected.
	function TableSelection( cells ) {
		this._reset();

		if ( cells ) {
			this.setSelectedCells( cells );
		}
	}

	TableSelection.prototype = {};

	// Resets the initial state of table selection.
	TableSelection.prototype._reset = function() {
		this.cells = {
			first: null,
			last: null,
			all: []
		};

		this.rows = {
			first: null,
			last: null
		};
	};

	// Sets the cells that are selected in the table. Based on this it figures out what cell is
	// the first, and the last. Also sets rows property accordingly.
	// Note: ATM the type does not make an actual selection, it just holds the data.
	//
	// @param {CKEDITOR.dom.element[]} [cells] An array of cells considered to be selected.
	TableSelection.prototype.setSelectedCells = function( cells ) {
		this._reset();
		// Make sure we're not modifying input array.
		cells = cells.slice( 0 );
		this._arraySortByDOMOrder( cells );

		this.cells.all = cells;

		this.cells.first = cells[ 0 ];
		this.cells.last = cells[ cells.length - 1 ];

		this.rows.first = cells[ 0 ].getAscendant( 'tr' );
		this.rows.last = this.cells.last.getAscendant( 'tr' );
	};

	// Returns a table map, returned by {@link CKEDITOR.tools#buildTableMap}.
	// @returns {HTMLElement[]}
	TableSelection.prototype.getTableMap = function() {
		function getRealCellPosition( cell ) {
			var table = cell.getAscendant( 'table' ),
				rowIndex = getRowIndex( cell ),
				map = CKEDITOR.tools.buildTableMap( table ),
				i;

			for ( i = 0; i < map[ rowIndex ].length; i++ ) {
				if ( new CKEDITOR.dom.element( map[ rowIndex ][ i ] ).equals( cell ) ) {
					return i;
				}
			}
		}

		var startIndex = getCellColIndex( this.cells.first ),
			endIndex = getRealCellPosition( this.cells.last );

		return CKEDITOR.tools.buildTableMap( this._getTable(), getRowIndex( this.rows.first ), startIndex,
			getRowIndex( this.rows.last ), endIndex );
	};

	TableSelection.prototype._getTable = function() {
		return this.rows.first.getAscendant( 'table' );
	};

	// @param {Number} count Number of rows to be inserted.
	// @param {Boolean} [insertBefore=false] If set to `true` new rows will be prepended.
	// @param {Boolean} [clearSelection=false] If set to `true`, it will set selected cells to the one inserted.
	TableSelection.prototype.insertRow = function( count, insertBefore, clearSelection ) {
		if ( typeof count === 'undefined' ) {
			count = 1;
		} else if ( count <= 0 ) {
			return;
		}

		var cellIndexFirst = this.cells.first.$.cellIndex,
			cellIndexLast = this.cells.last.$.cellIndex,
			selectedCells = clearSelection ? [] : this.cells.all,
			row,
			newCells;

		for ( var i = 0; i < count; i++ ) {
			// In case of clearSelection we need explicitly use cached cells, as selectedCells is empty.
			row = insertRow( clearSelection ? this.cells.all : selectedCells, insertBefore );

			// Append cells from added row.
			newCells = CKEDITOR.tools.array.filter( row.find( 'td, th' ).toArray(), function( cell ) {
				return clearSelection ?
					true : cell.$.cellIndex >= cellIndexFirst && cell.$.cellIndex <= cellIndexLast;
			} );

			// setSelectedCells will take care of refreshing the whole state at once.
			if ( insertBefore ) {
				selectedCells = newCells.concat( selectedCells );
			} else {
				selectedCells = selectedCells.concat( newCells );
			}
		}

		this.setSelectedCells( selectedCells );
	};

	// @param {Number} count Number of columns to be inserted.
	TableSelection.prototype.insertColumn = function( count ) {
		if ( typeof count === 'undefined' ) {
			count = 1;
		} else if ( count <= 0 ) {
			return;
		}

		var cells = this.cells,
			selectedCells = cells.all,
			minRowIndex = getRowIndex( cells.first ),
			maxRowIndex = getRowIndex( cells.last );

		function limitCells( cell ) {
			var parentRowIndex = getRowIndex( cell );

			return parentRowIndex >= minRowIndex && parentRowIndex <= maxRowIndex;
		}

		for ( var i = 0; i < count; i++ ) {
			// Prepend added cells, then pass it to setSelectionCells so that it will take care of refreshing
			// the whole state. Note that returned cells needs to be filtered, so that only cells that
			// should get selected are added to the selectedCells array.
			selectedCells = selectedCells.concat( CKEDITOR.tools.array.filter( insertColumn( selectedCells ), limitCells ) );
		}

		this.setSelectedCells( selectedCells );
	};

	// Clears the content of selected cells.
	//
	// @param {CKEDITOR.dom.element[]} [cells] If given, this cells will be cleared.
	TableSelection.prototype.emptyCells =  function( cells ) {
		cells = cells || this.cells.all;

		for ( var i = 0; i < cells.length; i++ ) {
			cells[ i ].setHtml( '' );
		}
	};

	// Sorts given arr according to DOM position.
	//
	// @param {CKEDITOR.dom.node[]} arr
	TableSelection.prototype._arraySortByDOMOrder = function( arr ) {
		arr.sort( function( el1, el2 ) {
			return el1.getPosition( el2 ) & CKEDITOR.POSITION_PRECEDING ? -1 : 1;
		} );
	};

	var fakeSelectionPasteHandler = {
		onPaste: pasteListener,
		// Check if the selection is collapsed on the beginning of the row (1) or at the end (2).
		isBoundarySelection: function( selection ) {
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
		},

		// Looks for a table in a given pasted content string. Returns it as a
		// CKEDITOR.dom.element instance or null if mixed content, or more than one table found.
		findTableInPastedContent: function( editor, dataValue ) {
			var dataProcessor = editor.dataProcessor,
				tmpContainer = new CKEDITOR.dom.element( 'body' );

			if ( !dataProcessor ) {
				dataProcessor = new CKEDITOR.htmlDataProcessor( editor );
			}

			// Pasted value must be filtered using dataProcessor to strip all unsafe code
			// before inserting it into temporary container.
			tmpContainer.setHtml( dataProcessor.toHtml( dataValue ), {
				fixForBody: false
			} );

			return tmpContainer.getChildCount() > 1 ? null : tmpContainer.findOne( 'table' );
		},

		// Performs an actual paste into selectedTableMap based on content in pastedTableMap.
		pasteTable: function( tableSel, selectedTableMap, pastedTableMap ) {
			var cellToReplace,
				// Index of first selected cell, it needs to be reused later, to calculate the
				// proper position of newly pasted cells.
				startIndex = getCellColIndex( tableSel.cells.first ),
				selectedTable = tableSel._getTable(),
				markers = {},
				currentRow,
				prevCell,
				cellToPaste,
				i,
				j;

			// And now paste!
			for ( i = 0; i < pastedTableMap.length; i++ ) {
				currentRow = new CKEDITOR.dom.element( selectedTable.$.rows[ tableSel.rows.first.$.rowIndex + i ] );

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
								// It might happen that there's no cell with startIndex, as it might be used by a rowspan.
								if ( currentRow.$.cells[ startIndex ] ) {
									cellToPaste.insertAfter( new CKEDITOR.dom.element( currentRow.$.cells[ startIndex ] ) );
								} else {
									// Since rowspans are erased from current selection, we want need to append a cell.
									currentRow.append( cellToPaste );
								}
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
		}
	};

	function pasteListener( evt ) {
		var editor = evt.editor,
			selection = editor.getSelection(),
			selectedCells = getSelectedCells( selection ),
			boundarySelection = selection.isInTable( true ) && this.isBoundarySelection( selection ),
			pastedTable = this.findTableInPastedContent( editor, evt.data.dataValue ),
			tableSel,
			selectedTable,
			selectedTableMap,
			pastedTableMap;

		if ( !isCustomPaste( selection, selectedCells, pastedTable, boundarySelection ) ) {
			return;
		}

		selectedTable = selectedCells[ 0 ].getAscendant( 'table' );
		tableSel = new TableSelection( getSelectedCells( selection, selectedTable ) );

		// Schedule selecting appropriate table cells after pasting. It covers both table and not-table
		// content (#520).
		editor.once( 'afterPaste', function() {
			var toSelect = pastedTableMap ?
				getCellsBetween( new CKEDITOR.dom.element( pastedTableMap[ 0 ][ 0 ] ),
					new CKEDITOR.dom.element( getLastArrayItem( getLastArrayItem( pastedTableMap ) ) ) ) :
				tableSel.cells.all;

			fakeSelectCells( editor, toSelect );
		} );


		// In case of mixed content or non table content just select first cell, and erase content of other selected cells.
		// Selection is left in first cell, so that default CKEditor logic puts pasted content in the selection (#520).
		if ( !pastedTable ) {
			selectCellContents( tableSel.cells.first );

			// Due to limitations of our undo manager, in case of mixed content
			// cells must be emptied after pasting (#520).
			editor.once( 'afterPaste', function() {
				editor.fire( 'lockSnapshot' );
				tableSel.emptyCells( tableSel.cells.all.slice( 1 ) );
				// Reselecting cells allows to create correct undo snapshot (#763).
				fakeSelectCells( editor, tableSel.cells.all );
				editor.fire( 'unlockSnapshot' );
			} );

			return;
		}

		// Preventing other paste handlers should be done after all early returns (#520).
		evt.stop();

		// In case of boundary selection, insert new row before/after selected one, select it
		// and resume the rest of the algorithm.
		if ( boundarySelection ) {
			tableSel.insertRow( 1, boundarySelection === 1, true );
			selection.selectElement( tableSel.rows.first );
		} else {
			// Otherwise simply clear all the selected cells.
			tableSel.emptyCells();
			// Reselecting cells allows to create correct undo snapshot (#763).
			fakeSelectCells( editor, tableSel.cells.all );
		}

		// Build table map only for selected fragment.
		selectedTableMap = tableSel.getTableMap();
		pastedTableMap = CKEDITOR.tools.buildTableMap( pastedTable );

		tableSel.insertRow( pastedTableMap.length - selectedTableMap.length );

		// Now we compare the dimensions of the pasted table and the selected one.
		// If the pasted one is bigger, we add missing rows and columns.
		tableSel.insertColumn( getLongestRowLength( pastedTableMap ) - getLongestRowLength( selectedTableMap ) );

		// Rebuild map for selected table.
		selectedTableMap = tableSel.getTableMap();

		this.pasteTable( tableSel, selectedTableMap, pastedTableMap );

		editor.fire( 'saveSnapshot' );

		// Manually fire afterPaste event as we stop pasting to handle everything via our custom handler.
		setTimeout( function() {
			editor.fire( 'afterPaste' );
		}, 0 );

		function isCustomPaste( selection, selectedCells, pastedTable, boundarySelection ) {
			var ranges = selection.getRanges(),
				table = ranges.length && ranges[ 0 ]._getTableElement( { table: 1 } );

			// Do not customize paste process in following cases:
			// 1. No cells are selected.
			if ( !selectedCells.length ) {
				return false;
			}

			// 2. Table is ignoring tableselection (#2945).
			if ( table && table.hasAttribute( ignoredTableAttribute ) ) {
				return false;
			}

			// 3. It's a boundary selection but with no table pasted.
			if ( boundarySelection && !pastedTable ) {
				return false;
			}

			// 4. It isn't a boundary selection (if it is, at this point we know that table is pasted so it should be
			// handled by custom paste to correctly insert rows etc.) and it either exceeds table or doesn't contain
			// whole table cell (#875).
			if ( !boundarySelection && !rangeContainsTableElement( ranges[ 0 ] ) ) {
				return false;
			}

			return true;
		}

		function getLastArrayItem( arr ) {
			return arr[ arr.length - 1 ];
		}

		function selectCellContents( cell ) {
			var range = editor.createRange();

			range.selectNodeContents( cell );
			range.select();
		}

		function getLongestRowLength( map ) {
			return Math.max.apply( null, CKEDITOR.tools.array.map( map, function( rowMap ) {
				return rowMap.length;
			}, 0 ) );
		}
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
	 * Namespace providing a set of helper functions for working with tables, exposed by the
	 * [Table Selection](https://ckeditor.com/cke4/addon/tableselection) plugin.
	 *
	 * **Note:** Since 4.12.0 you can use the `cke-tableselection-ignored` attribute to disable
	 * the table selection feature for the given table.
	 *
	 * ```javascript
	 * var table = new CKEDITOR.dom.element( 'table' );
	 *
	 * table.data( 'cke-tableselection-ignored', 1 );
	 * ```
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
			// Handle left, up, right, down, delete, backspace and enter keystrokes inside table fake selection.
			function getTableOnKeyDownListener( editor ) {
				var keystrokes = {
						37: 1, // Left Arrow
						38: 1, // Up Arrow
						39: 1, // Right Arrow,
						40: 1, // Down Arrow
						8: 1, // Backspace
						46: 1, // Delete
						13: 1 // Enter
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
								// Technically none of startNode children should be visited but it will due to https://dev.ckeditor.com/ticket/12191.
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
					// Justification: https://dev.ckeditor.com/ticket/11861#comment:13
					var key = evt.data.getKey(),
						keystroke = evt.data.getKeystroke(),
						selection,
						toStart = key === 37 || key == 38,
						ranges,
						firstCell,
						lastCell,
						i;

					// Handle only left/right/del/bspace keys.
					// Disable editing cells in readonly mode (#1489).
					if ( !keystrokes[ key ] || editor.readOnly ) {
						return;
					}

					selection = editor.getSelection();

					if ( !selection || !selection.isInTable() || !selection.isFake ) {
						return;
					}

					ranges = selection.getRanges();
					firstCell = ranges[ 0 ]._getTableElement();
					lastCell = ranges[ ranges.length - 1 ]._getTableElement();

					// Only prevent event when tableselection handle it. Which is non-enter button, or pressing enter button with enterkey plugin present (#1816).
					if ( key !== 13 || editor.plugins.enterkey ) {
						evt.data.preventDefault();
						evt.cancel();
					}

					if ( key > 36 && key < 41 ) {
						// Arrows.
						ranges[ 0 ].moveToElementEditablePosition( toStart ? firstCell : lastCell, !toStart );
						selection.selectRanges( [ ranges[ 0 ] ] );
					} else {
						// Delete, backspace, enter.

						// Do nothing for Enter with modifiers different than shift.
						if ( key === 13 && !( keystroke === 13 || keystroke === CKEDITOR.SHIFT + 13 ) ) {
							return;
						}

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

						if ( key === 13 && editor.plugins.enterkey ) {
							// We need to lock undoManager to consider clearing table and inserting new paragraph as single operation, and have only one undo step (#1816).
							editor.fire( 'lockSnapshot' );
							keystroke === 13 ? editor.execCommand( 'enter' ) : editor.execCommand( 'shiftEnter' );
							editor.fire( 'unlockSnapshot' );
							editor.fire( 'saveSnapshot' );
						} else if ( key !== 13 ) {
							// Backspace and delete key should have saved snapshot.
							editor.fire( 'saveSnapshot' );
						}
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

				// Disable editing cells in readonly mode (#1489).
				if ( editor.readOnly ) {
					return;
				}

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

				// In case of selection of table element, there won't be any cell (#867).
				if ( firstCell ) {
					ranges[ 0 ].moveToElementEditablePosition( firstCell );
					selection.selectRanges( [ ranges[ 0 ] ] );
				}
			}

			function clearCellInRange( range ) {
				var node = range.getEnclosedNode();

				// Set text only in case of table cells, otherwise remove whole element (#867).
				// Check if `node.is` is function, as returned node might be CKEDITOR.dom.text (#2089).
				if ( node && typeof node.is === 'function' && node.is( { td: 1, th: 1 } ) ) {
					node.setText( '' );
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
		}
	};

	CKEDITOR.plugins.add( 'tableselection', {
		requires: 'clipboard,tabletools',

		isSupportedEnvironment: function() {
			return !( CKEDITOR.env.ie && CKEDITOR.env.version < 11 );
		},

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
			if ( !this.isSupportedEnvironment() ) {
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

			editor.on( 'paste', fakeSelectionPasteHandler.onPaste, fakeSelectionPasteHandler );

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
