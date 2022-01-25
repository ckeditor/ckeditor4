/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	var pxUnit = CKEDITOR.tools.cssLength,
		needsIEHacks = CKEDITOR.env.ie && ( CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks );

	function getWidth( el ) {
		return CKEDITOR.env.ie ? el.$.clientWidth : parseInt( el.getComputedStyle( 'width' ), 10 );
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

		return parseFloat( computed );
	}

	// Sets pillar height and position based on given table element (head, body, footer).
	function setPillarDimensions( nativeTableElement ) {
		if ( nativeTableElement ) {
			var tableElement = new CKEDITOR.dom.element( nativeTableElement );
			return { height: tableElement.$.offsetHeight, position: tableElement.getDocumentPosition() };
		}
	}

	function buildTableColumnPillars( table ) {
		var pillars = [],
			pillarIndexMap = {},
			rtl = table.getComputedStyle( 'direction' ) === 'rtl',
			// We are building table map to expand row spans (#3961).
			rows = CKEDITOR.tools.array.zip( new CKEDITOR.dom.nodeList( table.$.rows ).toArray(),
				CKEDITOR.tools.buildTableMap( table ) );

		CKEDITOR.tools.array.forEach( rows, function( item ) {
			var $tr = item[ 0 ].$,
				cells = item[ 1 ],
				pillarIndex = -1,
				pillarHeight = 0,
				pillarPosition = null,
				pillarDimensions = setPillarDimensions( $tr ),
				isIE = CKEDITOR.env.ie && !CKEDITOR.env.edge,
				isBorderCollapse = table.getComputedStyle( 'border-collapse' ) === 'collapse';

			pillarHeight = pillarDimensions.height;
			pillarPosition = pillarDimensions.position;

			// Loop thorugh all cells, building pillars after each one of them.
			for ( var i = 0; i < cells.length; i++ ) {
				// Both the current cell and the successive one will be used in the
				// pillar size calculation.
				var td = new CKEDITOR.dom.element( cells[ i ] ),
					nextTd = cells[ i + 1 ] && new CKEDITOR.dom.element( cells[ i + 1 ] ),
					pillar,
					pillarLeft,
					pillarRight,
					pillarWidth,
					x = td.getDocumentPosition().x;

				pillarIndex += td.$.colSpan || 1;

				// Calculate positions based on the current cell.
				if ( rtl ) {
					pillarRight = x + getBorderWidth( td, 'left' );
				} else {
					pillarLeft = x + td.$.offsetWidth - getBorderWidth( td, 'right' );
				}

				// Calculate positions based on the next cell, if available.
				if ( nextTd ) {
					x = nextTd.getDocumentPosition().x;

					if ( rtl ) {
						pillarLeft = x + nextTd.$.offsetWidth - getBorderWidth( nextTd, 'right' );
					} else {
						pillarRight = x + getBorderWidth( nextTd, 'left' );
					}
				}
				// Otherwise calculate positions based on the table (for last cell).
				else {
					x = table.getDocumentPosition().x;

					if ( rtl ) {
						pillarLeft = x;
					} else {
						pillarRight = x + table.$.offsetWidth;
					}
				}

				pillarWidth = Math.max( pillarRight - pillarLeft, 3 );

				// In case of IE and collapsed table border, we must substract pillarWidth
				// from the current position and recalculate pillarWidth (#2823).
				if ( isIE && isBorderCollapse ) {
					pillarLeft -= pillarWidth;

					pillarWidth = Math.max( pillarRight - pillarLeft, 3 );
				}


				// The pillar should reflects exactly the shape of the hovered
				// column border line.
				pillar = {
					table: table,
					index: pillarIndex,
					x: pillarLeft,
					y: pillarPosition.y,
					width: pillarWidth,
					height: pillarHeight,
					rtl: rtl
				};
				pillarIndexMap[ pillarIndex ] = pillarIndexMap[ pillarIndex ] || [];
				pillarIndexMap[ pillarIndex ].push( pillar );
				pillar.alignedPillars = pillarIndexMap[ pillarIndex ];

				pillars.push( pillar );
			}

		} );

		return pillars;
	}

	function checkWithinDimensions( posX, posY, element ) {
		return posX >= element.x && posX <= ( element.x + element.width ) &&
			posY >= element.y && posY <= ( element.y + element.height );
	}

	function getPillarAtPosition( pillars, position ) {
		for ( var i = 0, len = pillars.length; i < len; i++ ) {
			var pillar = pillars[ i ];

			if ( checkWithinDimensions( position.x, position.y, pillar ) ) {
				return pillar;
			}
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

			// Hide the resizer (remove it on IE7 - https://dev.ckeditor.com/ticket/5890).
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
					// 1px is the minimum valid width (https://dev.ckeditor.com/ticket/11626).
					leftCell && leftCell.setStyle( 'width', pxUnit( Math.max( leftOldWidth + sizeShift, 1 ) ) );
					rightCell && rightCell.setStyle( 'width', pxUnit( Math.max( rightOldWidth - sizeShift, 1 ) ) );

					// If we're in the last cell, we need to resize the table as well
					if ( tableWidth )
						table.setStyle( 'width', pxUnit( tableWidth + sizeShift * ( rtl ? -1 : 1 ) ) );

					// Cells resizing is asynchronous-y, so we have to use syncing
					// to save snapshot only after all cells are resized. (https://dev.ckeditor.com/ticket/13388)
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

			// Save editor's state before we do any magic with cells. (https://dev.ckeditor.com/ticket/13388)
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
				'padding:0;background-color:#004;background-image:none;border:0px none;z-index:10000"></div>', document );

		// Clean DOM when editor is destroyed.
		editor.on( 'destroy', function() {
			resizer.remove();
		} );

		// Except on IE6/7 (https://dev.ckeditor.com/ticket/5890), place the resizer after body to prevent it
		// from being editable.
		if ( !needsIEHacks )
			document.getDocumentElement().append( resizer );

		this.attachTo = function( targetPillar ) {
			var firstAligned,
				lastAligned,
				resizerHeight,
				resizerY;
			// Accept only one pillar at a time.
			if ( isResizing )
				return;

			// On IE6/7, we append the resizer everytime we need it. (https://dev.ckeditor.com/ticket/5890)
			if ( needsIEHacks ) {
				document.getBody().append( resizer );
				currentShift = 0;
			}

			pillar = targetPillar;
			firstAligned = pillar.alignedPillars[ 0 ];
			lastAligned = pillar.alignedPillars[ pillar.alignedPillars.length - 1 ];
			resizerY = firstAligned.y;
			resizerHeight = lastAligned.height + lastAligned.y - firstAligned.y;

			resizer.setStyles( {
				width: pxUnit( targetPillar.width ),
				height: pxUnit( resizerHeight ),
				left: pxUnit( targetPillar.x ),
				top: pxUnit( resizerY )
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

		move = this.move = function( posX, posY ) {
				if ( !pillar )
					return 0;

				if ( !isResizing && !checkWithinDimensions( posX, posY, pillar ) ) {
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
		evt.removeListener();
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
					// instead of an element (https://dev.ckeditor.com/ticket/11823).
					if ( target.type != CKEDITOR.NODE_ELEMENT )
						return;

					var page = {
						x: evt.getPageOffset().x,
						y: evt.getPageOffset().y
					};

					// If we're already attached to a pillar, simply move the
					// resizer.
					if ( resizer && resizer.move( page.x, page.y ) ) {
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

					var pillar = getPillarAtPosition( pillars, page );
					if ( pillar ) {
						!resizer && ( resizer = new columnResizer( editor ) );
						resizer.attachTo( pillar );
					}
				} );
			} );
		}
	} );

} )();
