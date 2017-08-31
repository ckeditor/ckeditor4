/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	var pxUnit = CKEDITOR.tools.cssLength,
		needsIEHacks = CKEDITOR.env.ie && ( CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks );

	function getWidth( el ) {
		return CKEDITOR.env.ie ? el.$.clientWidth : parseInt( el.getComputedStyle( 'width' ), 10 );
	}

	function getHeight( el ) {
		return CKEDITOR.env.ie ? el.$.clientHeight : parseInt( el.getComputedStyle( 'height' ), 10 );
	}

	function getBorderWidth( element, side ) {
		var computed = element.getComputedStyle( 'border-' + side + '-width' ),
			borderMap = {
				thin: '0px',
				medium: '1px',
				thick: '2px'
			};

		if ( computed.indexOf( 'px' ) < 0 ) {
			// look up keywords
			if ( computed in borderMap && element.getComputedStyle( 'border-style' ) != 'none' )
				computed = borderMap[ computed ];
			else
				computed = 0;
		}

		return parseInt( computed, 10 );
	}

	// Gets the table row that contains the most columns.
	function getMasterPillarRow( table ) {
		var $rows = table.$.rows,
			maxCells = 0,
			cellsCount, $elected, $tr;

		for ( var i = 0, len = $rows.length; i < len; i++ ) {
			$tr = $rows[ i ];
			cellsCount = $tr.cells.length;

			if ( cellsCount > maxCells ) {
				maxCells = cellsCount;
				$elected = $tr;
			}
		}

		return $elected;
	}

	function buildTableColumnPillars( table ) {
		var pillars = [],
			pillarIndex = -1,
			pillarHeight = 0,
			pillarPosition = null,
			rtl = ( table.getComputedStyle( 'direction' ) == 'rtl' );

		// Get the raw row element that contains the most columns.
		var $tr = getMasterPillarRow( table );

		// Sets pillar height and position based on given table element (head, body, footer).
		function setPillarDimensions( nativeTableElement ) {
			if ( nativeTableElement ) {
				var tableElement = new CKEDITOR.dom.element( nativeTableElement );
				pillarHeight += tableElement.$.offsetHeight;

				if ( !pillarPosition ) {
					pillarPosition = tableElement.getDocumentPosition();
				}
			}
		}

		// Table may contain only one of thead, tbody or tfoot elements so its existence should be checked (#417).
		setPillarDimensions( table.$.tHead );
		setPillarDimensions( table.$.tBodies[ 0 ] );
		setPillarDimensions( table.$.tFoot );

		if ( $tr ) {
			// Loop thorugh all cells, building pillars after each one of them.
			for ( var i = 0, len = $tr.cells.length; i < len; i++ ) {
				// Both the current cell and the successive one will be used in the
				// pillar size calculation.
				var td = new CKEDITOR.dom.element( $tr.cells[ i ] ),
					nextTd = $tr.cells[ i + 1 ] && new CKEDITOR.dom.element( $tr.cells[ i + 1 ] );

				pillarIndex += td.$.colSpan || 1;

				// Calculate the pillar boundary positions.
				var pillarLeft, pillarRight, pillarWidth;

				var x = td.getDocumentPosition().x;

				// Calculate positions based on the current cell.
				rtl ? pillarRight = x + getBorderWidth( td, 'left' ) : pillarLeft = x + td.$.offsetWidth - getBorderWidth( td, 'right' );

				// Calculate positions based on the next cell, if available.
				if ( nextTd ) {
					x = nextTd.getDocumentPosition().x;

					rtl ? pillarLeft = x + nextTd.$.offsetWidth - getBorderWidth( nextTd, 'right' ) : pillarRight = x + getBorderWidth( nextTd, 'left' );
				}
				// Otherwise calculate positions based on the table (for last cell).
				else {
					x = table.getDocumentPosition().x;

					rtl ? pillarLeft = x : pillarRight = x + table.$.offsetWidth;
				}

				pillarWidth = Math.max( pillarRight - pillarLeft, 3 );

				// The pillar should reflects exactly the shape of the hovered
				// column border line.
				pillars.push( {
					table: table,
					index: pillarIndex,
					x: pillarLeft,
					y: pillarPosition.y,
					width: pillarWidth,
					height: pillarHeight,
					rtl: rtl
				} );
			}
		}

		return pillars;
	}

	function getPillarAtPosition( pillars, positionX ) {
		for ( var i = 0, len = pillars.length; i < len; i++ ) {
			var pillar = pillars[ i ];

			if ( positionX >= pillar.x && positionX <= ( pillar.x + pillar.width ) )
				return pillar;
		}

		return null;
	}

	function cancel( evt ) {
		( evt.data || evt ).preventDefault();
	}

	function columnResizer( editor ) {
		var pillar, document, resizer, isResizing, startOffset, currentShift, move;

		var leftSideCells, rightSideCells, leftShiftBoundary, rightShiftBoundary;

		function detach() {
			pillar = null;
			currentShift = 0;
			isResizing = 0;

			document.removeListener( 'mouseup', onMouseUp );
			resizer.removeListener( 'mousedown', onMouseDown );
			resizer.removeListener( 'mousemove', onMouseMove );

			document.getBody().setStyle( 'cursor', 'auto' );

			// Hide the resizer (remove it on IE7 - http://dev.ckeditor.com/ticket/5890).
			needsIEHacks ? resizer.remove() : resizer.hide();
		}

		function resizeStart() {
			// Before starting to resize, figure out which cells to change
			// and the boundaries of this resizing shift.
			var columnIndex = pillar.index,
				map = CKEDITOR.tools.buildTableMap( pillar.table ),
				leftColumnCells = [],
				rightColumnCells = [],
				leftMinSize = Number.MAX_VALUE,
				rightMinSize = leftMinSize,
				rtl = pillar.rtl;

			for ( var i = 0, len = map.length; i < len; i++ ) {
				var row = map[ i ],
					leftCell = row[ columnIndex + ( rtl ? 1 : 0 ) ],
					rightCell = row[ columnIndex + ( rtl ? 0 : 1 ) ];

				leftCell = leftCell && new CKEDITOR.dom.element( leftCell );
				rightCell = rightCell && new CKEDITOR.dom.element( rightCell );

				if ( !leftCell || !rightCell || !leftCell.equals( rightCell ) ) {
					leftCell && ( leftMinSize = Math.min( leftMinSize, getWidth( leftCell ) ) );
					rightCell && ( rightMinSize = Math.min( rightMinSize, getWidth( rightCell ) ) );

					leftColumnCells.push( leftCell );
					rightColumnCells.push( rightCell );
				}
			}

			// Cache the list of cells to be resized.
			leftSideCells = leftColumnCells;
			rightSideCells = rightColumnCells;

			// Cache the resize limit boundaries.
			leftShiftBoundary = pillar.x - leftMinSize;
			rightShiftBoundary = pillar.x + rightMinSize;
			resizer.setOpacity( 0.5 );
			startOffset = parseInt( resizer.getStyle( 'left' ), 10 );
			currentShift = 0;
			isResizing = 1;

			resizer.on( 'mousemove', onMouseMove );

			// Prevent the native drag behavior otherwise 'mousemove' won't fire.
			document.on( 'dragstart', cancel );
		}

		function resizeEnd() {
			isResizing = 0;

			resizer.setOpacity( 0 );

			currentShift && resizeColumn();

			var table = pillar.table;
			setTimeout( function() {
				table.removeCustomData( '_cke_table_pillars' );
			}, 0 );

			document.removeListener( 'dragstart', cancel );
		}

		function resizeColumn() {
			var rtl = pillar.rtl,
				cellsCount = rtl ? rightSideCells.length : leftSideCells.length,
				cellsSaved = 0;

			// Perform the actual resize to table cells, only for those by side of the pillar.
			for ( var i = 0; i < cellsCount; i++ ) {
				var leftCell = leftSideCells[ i ],
					rightCell = rightSideCells[ i ],
					table = pillar.table;

				// Defer the resizing to avoid any interference among cells.
				CKEDITOR.tools.setTimeout( function( leftCell, leftOldWidth, rightCell, rightOldWidth, tableWidth, sizeShift ) {
					// 1px is the minimum valid width (http://dev.ckeditor.com/ticket/11626).
					leftCell && leftCell.setStyle( 'width', pxUnit( Math.max( leftOldWidth + sizeShift, 1 ) ) );
					rightCell && rightCell.setStyle( 'width', pxUnit( Math.max( rightOldWidth - sizeShift, 1 ) ) );

					// If we're in the last cell, we need to resize the table as well
					if ( tableWidth )
						table.setStyle( 'width', pxUnit( tableWidth + sizeShift * ( rtl ? -1 : 1 ) ) );

					// Cells resizing is asynchronous-y, so we have to use syncing
					// to save snapshot only after all cells are resized. (http://dev.ckeditor.com/ticket/13388)
					if ( ++cellsSaved == cellsCount ) {
						editor.fire( 'saveSnapshot' );
					}
				}, 0, this, [
					leftCell, leftCell && getWidth( leftCell ),
					rightCell, rightCell && getWidth( rightCell ),
					( !leftCell || !rightCell ) && ( getWidth( table ) + getBorderWidth( table, 'left' ) + getBorderWidth( table, 'right' ) ),
					currentShift
				] );
			}
		}

		function onMouseDown( evt ) {
			cancel( evt );

			// Save editor's state before we do any magic with cells. (http://dev.ckeditor.com/ticket/13388)
			editor.fire( 'saveSnapshot' );
			resizeStart();

			document.on( 'mouseup', onMouseUp, this );
		}

		function onMouseUp( evt ) {
			evt.removeListener();

			resizeEnd();
		}

		function onMouseMove( evt ) {
			move( evt.data.getPageOffset().x );
		}

		document = editor.document;

		resizer = CKEDITOR.dom.element.createFromHtml( '<div data-cke-temp=1 contenteditable=false unselectable=on ' +
			'style="position:absolute;cursor:col-resize;filter:alpha(opacity=0);opacity:0;' +
				'padding:0;background-color:#004;background-image:none;border:0px none;z-index:10"></div>', document );

		// Clean DOM when editor is destroyed.
		editor.on( 'destroy', function() {
			resizer.remove();
		} );

		// Except on IE6/7 (http://dev.ckeditor.com/ticket/5890), place the resizer after body to prevent it
		// from being editable.
		if ( !needsIEHacks )
			document.getDocumentElement().append( resizer );

		this.attachTo = function( targetPillar ) {
			// Accept only one pillar at a time.
			if ( isResizing )
				return;

			// On IE6/7, we append the resizer everytime we need it. (http://dev.ckeditor.com/ticket/5890)
			if ( needsIEHacks ) {
				document.getBody().append( resizer );
				currentShift = 0;
			}

			pillar = targetPillar;

			resizer.setStyles( {
				width: pxUnit( targetPillar.width ),
				height: pxUnit( targetPillar.height ),
				left: pxUnit( targetPillar.x ),
				top: pxUnit( targetPillar.y )
			} );

			// In IE6/7, it's not possible to have custom cursors for floating
			// elements in an editable document. Show the resizer in that case,
			// to give the user a visual clue.
			needsIEHacks && resizer.setOpacity( 0.25 );

			resizer.on( 'mousedown', onMouseDown, this );

			document.getBody().setStyle( 'cursor', 'col-resize' );

			// Display the resizer to receive events but don't show it,
			// only change the cursor to resizable shape.
			resizer.show();
		};

		move = this.move = function( posX ) {
				if ( !pillar )
					return 0;

				if ( !isResizing && ( posX < pillar.x || posX > ( pillar.x + pillar.width ) ) ) {
					detach();
					return 0;
				}

				var resizerNewPosition = posX - Math.round( resizer.$.offsetWidth / 2 );

				if ( isResizing ) {
					if ( resizerNewPosition == leftShiftBoundary || resizerNewPosition == rightShiftBoundary )
						return 1;

					resizerNewPosition = Math.max( resizerNewPosition, leftShiftBoundary );
					resizerNewPosition = Math.min( resizerNewPosition, rightShiftBoundary );

					currentShift = resizerNewPosition - startOffset;
				}

				resizer.setStyle( 'left', pxUnit( resizerNewPosition ) );

				return 1;
			};
	}

	function clearPillarsCache( evt ) {
		var target = evt.data.getTarget();

		if ( evt.name == 'mouseout' ) {
			// Bypass interal mouse move.
			if ( !target.is( 'table' ) )
				return;

			var dest = new CKEDITOR.dom.element( evt.data.$.relatedTarget || evt.data.$.toElement );
			while ( dest && dest.$ && !dest.equals( target ) && !dest.is( 'body' ) )
				dest = dest.getParent();
			if ( !dest || dest.equals( target ) )
				return;
		}

		target.getAscendant( 'table', 1 ).removeCustomData( '_cke_table_pillars' );
		target.getAscendant( 'table', 1 ).removeCustomData( '_cke_table_row-lines' );
		evt.removeListener();
	}

	// Row resizer ------------------------------------------------------------------------------------------------------
	function rowResizerFunc( editor ) {
		var rowLine, rowResizer, document, isResizing, startOffset, currentShift, move;

		var topSideCells, bottomSideCells, topShiftBoundary, bottomShiftBoundary;

		function detach() {
			rowLine = null;
			currentShift = 0;
			isResizing = 0;

			// document.removeListener( 'mouseup', onMouseUp );
			rowResizer.removeListener( 'mousedown', onMouseDown );
			rowResizer.removeListener( 'mousemove', onMouseMove );

			// document.getBody().setStyle( 'cursor', 'auto' );

			// Hide the resizer (remove it on IE7 - http://dev.ckeditor.com/ticket/5890).
			needsIEHacks ? rowResizer.remove() : rowResizer.hide();
		}

		function resizeStart() {
			var rowIndex = rowLine.index,
				map = CKEDITOR.tools.buildTableMap( rowLine.table ),
				topMinSize = Number.MAX_VALUE,
				bottomMinSize = topMinSize,
				topRowCells = [],
				bottomRowCells = [];

			for ( var i = 0, len = map[ rowIndex ].length; i < len; i++ ) {
				var topCell = new CKEDITOR.dom.element( map[ rowIndex ][ i ] ),
					bottomCell = new CKEDITOR.dom.element( map[ rowIndex + 1 ][ i ] );

				if ( !topCell || !bottomCell || !topCell.equals( !bottomCell ) ) {
					topCell && ( topMinSize = Math.min( topMinSize, getHeight( topCell ) ) );
					bottomCell && ( bottomMinSize = Math.min( bottomMinSize, getHeight( bottomCell ) ) );

					topRowCells.push( topCell );
					bottomRowCells.push( bottomCell );
				}
			}

			topSideCells = topRowCells;
			bottomSideCells = bottomRowCells;

			topShiftBoundary = rowLine.y - topMinSize;
			bottomShiftBoundary = rowLine.y + bottomMinSize;

			rowResizer.setOpacity( 0.5 );
			startOffset = parseInt( rowResizer.getStyle( 'top' ), 10 );
			isResizing = 1;
			currentShift = 0;

			rowResizer.on( 'mousemove', onMouseMove );
		}

		function resizeEnd() {
			isResizing = 0;

			rowResizer.setOpacity( 0 );

			// currentShift && resizeRow(); TODO

			document.removeListener( 'dragstart', cancel );
		}

		function onMouseDown( evt ) {
			cancel( evt );
			editor.fire( 'saveSnapshot' );

			resizeStart();

			document.on( 'onMouseUp', onMouseUp, this );
		}

		function onMouseUp( evt ) {
			evt.removeListener();

			resizeEnd();
		}

		function onMouseMove( evt ) {
			move( evt.data.getPageOffset().y );
		}

		document = editor.document;

		rowResizer = CKEDITOR.dom.element.createFromHtml( '<div data-cke-temp=1 contenteditable=false unselectable=on ' +
		'style="position:absolute;cursor:row-resize;filter:alpha(opacity=0);opacity:0;' +
			'padding:0;background-color:#004;background-image:none;border:0px none;z-index:10"></div>', document );

		this.attachTo = function( targetRowLine ) {
			editor.document.getDocumentElement().append( rowResizer );

			rowLine = targetRowLine;

			rowResizer.setStyles( {
				width: pxUnit( targetRowLine.width ),
				height: pxUnit( targetRowLine.height ),
				left: pxUnit( targetRowLine.x ),
				top: pxUnit( targetRowLine.y )
			} );

			rowResizer.on( 'mousedown', onMouseDown, this );

			rowResizer.show();
		};

		move = this.move = function( posY ) {
				if ( !rowLine )
					return 0;

				if ( !isResizing && ( posY < rowLine.y || posY > ( rowLine.y + rowLine.height ) ) ) {
					detach();
					return 0;
				}

				var resizerNewPosition = posY - Math.round( rowResizer.$.offsetHeight / 2 );

				if ( isResizing ) {
					if ( resizerNewPosition == topShiftBoundary || resizerNewPosition == bottomShiftBoundary )
						return 1;

					resizerNewPosition = Math.max( resizerNewPosition, topShiftBoundary );
					resizerNewPosition = Math.min( resizerNewPosition, bottomShiftBoundary );

					currentShift = resizerNewPosition - startOffset;
				}

				rowResizer.setStyle( 'top', pxUnit( resizerNewPosition ) );

				return 1;
			};
	}

	function buildTableRowLines( table ) {
		var rowLines = [],
			rowLineIndex = -1,
			rowLineHeight = 0,
			rowLineWidth = 0,
			rowLinePosition = null,
			rtl = ( table.getComputedStyle( 'direction' ) == 'rtl' );

		if ( table.$.rows ) {

			for (  var i = 0, len = table.$.rows.length; i < len; i++ ) {
				var tr = new CKEDITOR.dom.element( table.$.rows[ i ] );

				rowLineIndex = rowLineIndex + 1;

				rowLineHeight = getBorderWidth( table, 'left' ) + getBorderWidth( table, 'right' ) + Number( table.$.cellSpacing );
				rowLineWidth = getWidth( table );

				rowLinePosition = tr.$.offsetTop + tr.$.offsetHeight + table.$.offsetTop;

				rowLines.push( {
					table: table,
					index: rowLineIndex,
					x: table.$.offsetLeft,
					y: rowLinePosition,
					width: rowLineWidth,
					height: rowLineHeight,
					rtl: rtl
				} );
			}
		}

		return rowLines;
	}

	function getRowLineAtPosition( rowLines, positionY ) {
		for ( var i = 0, len = rowLines.length; i < len; i++ ) {
			var rowLine = rowLines[ i ];

			if ( positionY >= rowLine.y && positionY <= ( rowLine.y + rowLine.height ) ) {
				return rowLine;
			}
		}

		return null;
	}

	CKEDITOR.plugins.add( 'tableresize', {
		requires: 'tabletools',

		init: function( editor ) {
			editor.on( 'contentDom', function() {
				var resizer,
					editable = editor.editable();

				// In Classic editor it is better to use document
				// instead of editable so event will work below body.
				editable.attachListener( editable.isInline() ? editable : editor.document, 'mousemove', function( evt ) {
					evt = evt.data;

					var target = evt.getTarget();

					// FF may return document and IE8 some UFO (object with no nodeType property...)
					// instead of an element (http://dev.ckeditor.com/ticket/11823).
					if ( target.type != CKEDITOR.NODE_ELEMENT )
						return;

					var pageX = evt.getPageOffset().x,
						pageY = evt.getPageOffset().y;

					// If we're already attached to a pillar, simply move the
					// resizer.
					if ( resizer && resizer.move( pageX ) ) {
						cancel( evt );
						return;
					}

					// Considering table, tr, td, tbody, thead, tfoot but nothing else.
					var table, pillars;

					if ( !target.is( 'table' ) && !target.getAscendant( { thead: 1, tbody: 1, tfoot: 1 }, 1 ) ) {
						return;
					}

					table = target.getAscendant( 'table', 1 );

					// Make sure the table we found is inside the container
					// (eg. we should not use tables the editor is embedded within)
					if ( !editor.editable().contains( table ) ) {
						return;
					}

					if ( !( pillars = table.getCustomData( '_cke_table_pillars' ) ) ) {
						// Cache table pillars calculation result.
						table.setCustomData( '_cke_table_pillars', ( pillars = buildTableColumnPillars( table ) ) );
						table.on( 'mouseout', clearPillarsCache );
						table.on( 'mousedown', clearPillarsCache );
					}

					var pillar = getPillarAtPosition( pillars, pageX );
					if ( pillar ) {
						!resizer && ( resizer = new columnResizer( editor ) );
						resizer.attachTo( pillar );
					}

					// Row resizer.
					var rowLines,
						rowResizer;

					if ( !( rowLines = table.getCustomData( '_cke_table_row-lines' ) ) ) {
						table.setCustomData( '_cke_table_row-lines', ( rowLines = buildTableRowLines( table ) ) );
						table.on( 'mouseout', clearPillarsCache );
						table.on( 'mousedown', clearPillarsCache );
					}

					var rowLine = getRowLineAtPosition( rowLines, pageY );
					if ( rowLine ) {
						!rowResizer && ( rowResizer = new rowResizerFunc( editor ) );
						rowResizer.attachTo( rowLine );
					}

				} );
			} );
		}
	} );

} )();

// TODO:
// * Resizing.
// * Check nested tables.
// * Change row resizer width on table width change.
// * Check column resizer height on table row size change.
// * Show/hide resizer background.
// * Code refactor. Code for row resize is similar to column resize.
