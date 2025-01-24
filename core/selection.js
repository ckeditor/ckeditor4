/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	var isMSSelection = typeof window.getSelection != 'function',
		nextRev = 1,
		// https://dev.ckeditor.com/ticket/13816
		fillingCharSequence = CKEDITOR.tools.repeat( '\u200b', 7 ),
		fillingCharSequenceRegExp = new RegExp( fillingCharSequence + '( )?', 'g' ),
		isSelectingTable;

	function isWidget( element ) {
		return CKEDITOR.plugins.widget && CKEDITOR.plugins.widget.isDomWidget( element );
	}

	// #### table selection : START
	// @param {CKEDITOR.dom.range[]} ranges
	// @param {Boolean} allowPartially Whether a collapsed selection within a table is recognized to be a valid selection.
	// This happens for WebKit browsers on MacOS when you right-click inside the table.
	function isTableSelection( ranges, allowPartially ) {
		if ( ranges.length === 0 ) {
			return false;
		}

		// It's not table selection when selected node is a widget (#1027).
		if ( isWidget( ranges[ 0 ].getEnclosedNode() ) ) {
			return false;
		}

		var node,
			i;

		function isPartiallySelected( range ) {
			var startCell = range.startContainer.getAscendant( { td: 1, th: 1 }, true ),
				endCell = range.endContainer.getAscendant( { td: 1, th: 1 }, true ),
				trim = CKEDITOR.tools.trim,
				selected;

			// Check if the selection is inside one cell and we don't have any nested table contents selected.
			if ( !startCell || !startCell.equals( endCell ) || startCell.findOne( 'td, th, tr, tbody, table' ) ) {
				return false;
			}

			selected = range.cloneContents();

			// Empty selection is still partially selected.
			if ( !selected.getFirst() ) {
				return true;
			}

			return trim( selected.getFirst().getText() ) !== trim( startCell.getText() );
		}

		// Edge case: partially selected text node inside one table cell or cursor inside cell.
		if ( !allowPartially && ranges.length === 1 &&
			( ranges[ 0 ].collapsed || isPartiallySelected( ranges[ 0 ] ) ) ) {
			return false;
		}

		for ( i = 0; i < ranges.length; i++ ) {
			node = ranges[ i ]._getTableElement();

			if ( !node ) {
				return false;
			}
		}

		return true;
	}

	function isSupportingTableSelectionPlugin( editor ) {
		return editor && editor.plugins.tableselection && editor.plugins.tableselection.isSupportedEnvironment( editor );
	}

	// After performing fake table selection, the real selection is limited
	// to the first selected cell. Therefore to check if the real selection
	// matches the fake selection, we check if the table cell from fake selection's
	// first range and real selection's range are the same.
	// Also if the selection is collapsed, we should check if it's placed inside the table
	// in which the fake selection is or inside nested table. Such selection occurs after right mouse click.
	function isRealTableSelection( selection, fakeSelection ) {
		var ranges = selection.getRanges(),
			fakeRanges = fakeSelection.getRanges(),
			table = ranges.length && ranges[ 0 ]._getTableElement() &&
				ranges[ 0 ]._getTableElement().getAscendant( 'table', true ),
			fakeTable = fakeRanges.length && fakeRanges[ 0 ]._getTableElement() &&
				fakeRanges[ 0 ]._getTableElement().getAscendant( 'table', true ),
			isTableRange = ranges.length === 1 && ranges[ 0 ]._getTableElement() &&
					ranges[ 0 ]._getTableElement().is( 'table' ),
			isFakeTableRange = fakeRanges.length === 1 && fakeRanges[ 0 ]._getTableElement() &&
					fakeRanges[ 0 ]._getTableElement().is( 'table' );

		function isValidTableSelection( table, fakeTable, ranges, fakeRanges ) {
			var isMenuOpen = ranges.length === 1 && ranges[ 0 ].collapsed,
				// In case of WebKit on MacOS, when checking real selection, we must allow selection to be partial.
				// Otherwise the check will fail for table selection with opened context menu.
				isInTable = isTableSelection( ranges, !!CKEDITOR.env.webkit ) && isTableSelection( fakeRanges );

			return isSameTable( table, fakeTable ) && ( isMenuOpen || isInTable );
		}

		function isSameTable( table, fakeTable ) {
			if ( !table || !fakeTable ) {
				return false;
			}

			return table.equals( fakeTable ) || fakeTable.contains( table );
		}

		// When widget is selected, then definitely it's not a table (#1027).
		if ( isWidget( fakeSelection.getSelectedElement() ) ) {
			return false;
		}

		if ( isValidTableSelection( table, fakeTable, ranges, fakeRanges ) ) {
			// Edge case: when editor contains only table and that table is selected using selectAll command,
			// then the selection is not properly refreshed and it must be done manually.
			if ( isTableRange && !isFakeTableRange ) {
				fakeSelection.selectRanges( ranges );
			}
			return true;
		}

		return false;
	}

	function getSelectedCells( ranges ) {
		var cells = [],
			node,
			i;

		function getCellsFromElement( element ) {
			var cells = element.find( 'td, th' ),
				cellsArray = [],
				i;

			for ( i = 0; i < cells.count(); i++ ) {
				cellsArray.push( cells.getItem( i ) );
			}

			return cellsArray;
		}

		for ( i = 0; i < ranges.length; i++ ) {
			node = ranges[ i ]._getTableElement();

			if ( node.is && node.is( { td: 1, th: 1 } ) ) {
				cells.push( node );
			} else {
				cells = cells.concat( getCellsFromElement( node ) );
			}
		}

		return cells;
	}

	// Cells in the same row are separated by tab and the rows are separated by new line, e.g.
	// Cell 1.1	Cell 1.2
	// Cell 2.1	Cell 2.2
	function getTextFromSelectedCells( ranges ) {
		var cells = getSelectedCells( ranges ),
			txt = '',
			currentRow = [],
			lastRow,
			i;

		for ( i = 0; i < cells.length; i++ ) {
			if ( lastRow && !lastRow.equals( cells[ i ].getAscendant( 'tr' ) ) ) {
				txt += currentRow.join( '\t' ) + '\n';
				lastRow = cells[ i ].getAscendant( 'tr' );
				currentRow = [];
			} else if ( i === 0 ) {
				lastRow = cells[ i ].getAscendant( 'tr' );
			}

			currentRow.push( cells[ i ].getText() );
		}

		txt += currentRow.join( '\t' );

		return txt;
	}

	function performFakeTableSelection( ranges ) {
		var editor = this.root.editor,
			realSelection = editor.getSelection( 1 ),
			cache;

		// Cleanup after previous selection - e.g. remove hidden sel container.
		this.reset();

		// Indicate that the table is being fake-selected to prevent infinite loop
		// inside `selectRanges`.
		isSelectingTable = true;

		// Cancel selectionchange for the real selection.
		realSelection.root.once( 'selectionchange', function( evt ) {
			evt.cancel();
		}, null, null, 0 );

		// Move real selection to the first selected range.
		realSelection.selectRanges( [ ranges[ 0 ] ] );

		cache = this._.cache;

		// Caches given ranges.
		cache.ranges = new CKEDITOR.dom.rangeList( ranges );
		cache.type = CKEDITOR.SELECTION_TEXT;
		cache.selectedElement = ranges[ 0 ]._getTableElement();

		// `selectedText` should contain text from all selected data ("plain text table")
		// to be compatible with Firefox's implementation.
		cache.selectedText = getTextFromSelectedCells( ranges );

		// Properties that will not be available when isFake.
		cache.nativeSel = null;

		this.isFake = 1;
		this.rev = nextRev++;

		// Save this selection, so it can be returned by editor.getSelection().
		editor._.fakeSelection = this;

		isSelectingTable = false;

		// Fire selectionchange, just like a normal selection.
		this.root.fire( 'selectionchange' );
	}
	// #### table selection : END

	// #### checkSelectionChange : START

	// The selection change check basically saves the element parent tree of
	// the current node and check it on successive requests. If there is any
	// change on the tree, then the selectionChange event gets fired.
	function checkSelectionChange() {
		// A possibly available fake-selection.
		var sel = this._.fakeSelection,
			realSel;

		if ( sel ) {
			realSel = this.getSelection( 1 );
			// If real (not locked/stored) selection was moved from hidden container
			// or is not a table one, then the fake-selection must be invalidated.
			if ( !realSel || ( !realSel.isHidden() && !isRealTableSelection( realSel, sel ) ) ) {
				// Remove the cache from fake-selection references in use elsewhere.
				sel.reset();

				// Have the code using the native selection.
				sel = 0;
			}
		}

		// If not fake-selection is available then get the native selection.
		if ( !sel ) {
			sel = realSel || this.getSelection( 1 );

			// Editor may have no selection at all.
			if ( !sel || sel.getType() == CKEDITOR.SELECTION_NONE )
				return;
		}

		this.fire( 'selectionCheck', sel );

		var currentPath = this.elementPath();
		if ( !currentPath.compare( this._.selectionPreviousPath ) ) {
			// Handle case when dialog inserts new element but parent block and path (so also focus context) does not change. (https://dev.ckeditor.com/ticket/13362)
			var sameBlockParent = this._.selectionPreviousPath && this._.selectionPreviousPath.blockLimit.equals( currentPath.blockLimit );
			// Cache the active element, which we'll eventually lose on Webkit and Gecko (#1113).
			if ( ( CKEDITOR.env.webkit || CKEDITOR.env.gecko ) && !sameBlockParent ) {
				this._.previousActive = this.document.getActive();
			}

			this._.selectionPreviousPath = currentPath;
			this.fire( 'selectionChange', { selection: sel, path: currentPath } );
		}
	}

	var checkSelectionChangeTimer, checkSelectionChangeTimeoutPending;

	function checkSelectionChangeTimeout() {
		// Firing the "OnSelectionChange" event on every key press started to
		// be too slow. This function guarantees that there will be at least
		// 200ms delay between selection checks.

		checkSelectionChangeTimeoutPending = true;

		if ( checkSelectionChangeTimer )
			return;

		checkSelectionChangeTimeoutExec.call( this );

		checkSelectionChangeTimer = CKEDITOR.tools.setTimeout( checkSelectionChangeTimeoutExec, 200, this );
	}

	function checkSelectionChangeTimeoutExec() {
		checkSelectionChangeTimer = null;

		if ( checkSelectionChangeTimeoutPending ) {
			// Call this with a timeout so the browser properly moves the
			// selection after the mouseup. It happened that the selection was
			// being moved after the mouseup when clicking inside selected text
			// with Firefox.
			CKEDITOR.tools.setTimeout( checkSelectionChange, 0, this );

			checkSelectionChangeTimeoutPending = false;
		}
	}

	// #### checkSelectionChange : END

	var isVisible = CKEDITOR.dom.walker.invisible( 1 );

	// May absorb the caret if:
	// * is a visible node,
	// * is a non-empty element (this rule will accept elements like <strong></strong> because they
	//	they were not accepted by the isVisible() check, not not <br> which cannot absorb the caret).
	//	See https://dev.ckeditor.com/ticket/12621.
	function mayAbsorbCaret( node ) {
		if ( isVisible( node ) )
			return true;

		if ( node.type == CKEDITOR.NODE_ELEMENT && !node.is( CKEDITOR.dtd.$empty ) )
			return true;

		return false;
	}

	function rangeRequiresFix( range ) {
		// Whether we must prevent from absorbing caret by this context node.
		// Also checks whether there's an editable position next to that node.
		function ctxRequiresFix( node, isAtEnd ) {
			// It's ok for us if a text node absorbs the caret, because
			// the caret container element isn't changed then.
			if ( !node || node.type == CKEDITOR.NODE_TEXT )
				return false;

			var testRng = range.clone();
			return testRng[ 'moveToElementEdit' + ( isAtEnd ? 'End' : 'Start' ) ]( node );
		}

		// Range root must be the editable element, it's to avoid creating filler char
		// on any temporary internal selection.
		if ( !( range.root instanceof CKEDITOR.editable ) )
			return false;

		var ct = range.startContainer;

		var previous = range.getPreviousNode( mayAbsorbCaret, null, ct ),
			next = range.getNextNode( mayAbsorbCaret, null, ct );

		// Any adjacent text container may absorb the caret, e.g.
		// <p><strong>text</strong>^foo</p>
		// <p>foo^<strong>text</strong></p>
		// <div>^<p>foo</p></div>
		if ( ctxRequiresFix( previous ) || ctxRequiresFix( next, 1 ) )
			return true;

		// Empty block/inline element is also affected. <span>^</span>, <p>^</p> (https://dev.ckeditor.com/ticket/7222)
		// If you found this line confusing check https://dev.ckeditor.com/ticket/12655.
		if ( !( previous || next ) && !( ct.type == CKEDITOR.NODE_ELEMENT && ct.isBlockBoundary() && ct.getBogus() ) )
			return true;

		return false;
	}

	function createFillingCharSequenceNode( editable ) {
		removeFillingCharSequenceNode( editable, false );

		var fillingChar = editable.getDocument().createText( fillingCharSequence );
		editable.setCustomData( 'cke-fillingChar', fillingChar );

		return fillingChar;
	}

	// Checks if a filling char has been used, eventually removing it (https://dev.ckeditor.com/ticket/1272).
	function checkFillingCharSequenceNodeReady( editable ) {
		var fillingChar = editable.getCustomData( 'cke-fillingChar' );

		if ( fillingChar ) {
			// Use this flag to avoid removing the filling char right after
			// creating it.
			if ( fillingChar.getCustomData( 'ready' ) ) {
				removeFillingCharSequenceNode( editable );
				editable.editor.fire( 'selectionCheck' );
			} else {
				fillingChar.setCustomData( 'ready', 1 );
			}
		}
	}

	function removeFillingCharSequenceNode( editable, keepSelection ) {
		var fillingChar = editable && editable.removeCustomData( 'cke-fillingChar' );

		if ( fillingChar ) {
			// Text selection position might get mangled by
			// subsequent dom modification, save it now for restoring. (https://dev.ckeditor.com/ticket/8617)
			if ( keepSelection !== false ) {
				var sel = editable.getDocument().getSelection().getNative(),
					// Be error proof.
					range = sel && sel.type != 'None' && sel.getRangeAt( 0 ),
					fillingCharSeqLength = fillingCharSequence.length;

				// If there's some text other than the sequence in the FC text node and the range
				// intersects with that node...
				if ( fillingChar.getLength() > fillingCharSeqLength && range && range.intersectsNode( fillingChar.$ ) ) {
					var bm = createNativeSelectionBookmark( sel );

					// Correct start offset anticipating the removal of FC.
					if ( sel.anchorNode == fillingChar.$ && sel.anchorOffset > fillingCharSeqLength ) {
						bm[ 0 ].offset -= fillingCharSeqLength;
					}

					// Correct end offset anticipating the removal of FC.
					if ( sel.focusNode == fillingChar.$ && sel.focusOffset > fillingCharSeqLength ) {
						bm[ 1 ].offset -= fillingCharSeqLength;
					}
				}
			}

			// We can't simply remove the filling node because the user
			// will actually enlarge it when typing, so we just remove the
			// invisible char from it.
			fillingChar.setText( removeFillingCharSequenceString( fillingChar.getText(), 1 ) );

			// Restore the bookmark preserving selection's direction.
			if ( bm ) {
				moveNativeSelectionToBookmark( editable.getDocument().$, bm );
			}
		}
	}

	// https://dev.ckeditor.com/ticket/13816
	function removeFillingCharSequenceString( str, nbspAware ) {
		if ( nbspAware ) {
			return str.replace( fillingCharSequenceRegExp, function( m, p ) {
				// https://dev.ckeditor.com/ticket/10291 if filling char is followed by a space replace it with NBSP.
				return p ? '\xa0' : '';
			} );
		} else {
			return str.replace( fillingCharSequence, '' );
		}
	}

	function createNativeSelectionBookmark( sel ) {
		return [
			{ node: sel.anchorNode, offset: sel.anchorOffset },
			{ node: sel.focusNode, offset: sel.focusOffset }
		];
	}

	function moveNativeSelectionToBookmark( document, bm ) {
		var sel = document.getSelection(),
			range = document.createRange();

		range.setStart( bm[ 0 ].node, bm[ 0 ].offset );
		range.collapse( true );
		sel.removeAllRanges();
		sel.addRange( range );
		sel.extend( bm[ 1 ].node, bm[ 1 ].offset );
	}

	// Creates cke_hidden_sel container and puts real selection there.
	function hideSelection( editor, ariaLabel ) {
		var content = ariaLabel && CKEDITOR.tools.htmlEncode( ariaLabel ) || '&nbsp;',
			style = CKEDITOR.env.ie && CKEDITOR.env.version < 14 ? 'display:none' : 'position:fixed;top:0;left:-1000px;width:0;height:0;overflow:hidden;',
			hiddenEl = CKEDITOR.dom.element.createFromHtml(
				'<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + style + '">' + content + '</div>',
				editor.document );

		editor.fire( 'lockSnapshot' );

		editor.editable().append( hiddenEl );

			// Always use real selection to avoid overriding locked one (https://dev.ckeditor.com/ticket/11104#comment:13).
		var sel = editor.getSelection( 1 ),
			range = editor.createRange(),
			// Cancel selectionchange fired by selectRanges - prevent from firing selectionChange.
			listener = sel.root.on( 'selectionchange', function( evt ) {
				evt.cancel();
			}, null, null, 0 );

		range.setStartAt( hiddenEl, CKEDITOR.POSITION_AFTER_START );
		range.setEndAt( hiddenEl, CKEDITOR.POSITION_BEFORE_END );
		sel.selectRanges( [ range ] );

		listener.removeListener();

		editor.fire( 'unlockSnapshot' );

		// Set this value at the end, so reset() executed by selectRanges()
		// will clean up old hidden selection container.
		editor._.hiddenSelectionContainer = hiddenEl;
	}

	function removeHiddenSelectionContainer( editor ) {
		var hiddenEl = editor._.hiddenSelectionContainer;

		if ( hiddenEl ) {
			var isDirty = editor.checkDirty();

			editor.fire( 'lockSnapshot' );
			hiddenEl.remove();
			editor.fire( 'unlockSnapshot' );

			!isDirty && editor.resetDirty();
		}

		delete editor._.hiddenSelectionContainer;
	}

	// Object containing keystroke handlers for fake selection.
	var fakeSelectionDefaultKeystrokeHandlers = ( function() {
		function leave( right ) {
			return function( evt ) {
				var range = evt.editor.createRange();

				// Move selection only if there's a editable place for it.
				// It no, then do nothing (keystroke will be blocked, widget selection kept).
				if ( range.moveToClosestEditablePosition( evt.selected, right ) )
					evt.editor.getSelection().selectRanges( [ range ] );

				// Prevent default.
				return false;
			};
		}

		function del( right ) {
			return function( evt ) {
				var editor = evt.editor,
					range = editor.createRange(),
					found;

				// We have to skip deletion for read only editor (#1516).
				if ( editor.readOnly ) {
					return;
				}

				// If haven't found place for caret on the default side,
				// try to find it on the other side.
				if ( !( found = range.moveToClosestEditablePosition( evt.selected, right ) ) )
					found = range.moveToClosestEditablePosition( evt.selected, !right );

				if ( found )
					editor.getSelection().selectRanges( [ range ] );

				// Save the state before removing selected element.
				editor.fire( 'saveSnapshot' );

				evt.selected.remove();

				// Haven't found any editable space before removing element,
				// try to place the caret anywhere (most likely, in empty editable).
				if ( !found ) {
					range.moveToElementEditablePosition( editor.editable() );
					editor.getSelection().selectRanges( [ range ] );
				}

				editor.fire( 'saveSnapshot' );

				// Prevent default.
				return false;
			};
		}

		var leaveLeft = leave(),
			leaveRight = leave( 1 );

		return {
			37: leaveLeft,		// LEFT
			38: leaveLeft,		// UP
			39: leaveRight,		// RIGHT
			40: leaveRight,		// DOWN
			8: del(),			// BACKSPACE
			46: del( 1 )		// DELETE
		};
	} )();

	// Handle left and right keystrokes next to non-editable elements by faking selection on them.
	// Delete and backspace keystrokes can delete empty paragraphs between the widgets (#1572).
	function getOnKeyDownListener( editor ) {
		var keystrokes = { 37: 1, 39: 1, 8: 1, 46: 1 };

		return function( evt ) {
			var keystroke = evt.data.getKeystroke();

			// Handle only left/right/del/bspace keys.
			if ( !keystrokes[ keystroke ] ) {
				return;
			}

			var sel = editor.getSelection(),
				ranges = sel.getRanges(),
				range = ranges[ 0 ],
				startElement;

			// Handle only single range and it has to be collapsed.
			if ( !sel.isCollapsed() ) {
				return;
			}

			var next = range[ keystroke < 38 ? 'getPreviousEditableNode' : 'getNextEditableNode' ]();

			if ( next && next.type == CKEDITOR.NODE_ELEMENT && next.getAttribute( 'contenteditable' ) == 'false' ) {

				// Allow removal of empty paragraphs (#1572).
				startElement = sel.getStartElement();

				if ( isEmptyBlock( startElement ) && isDeleteAction( keystroke ) ) {
					startElement.remove();

					// Save an undo restore point.
					editor.fire( 'saveSnapshot' );
				}

				editor.getSelection().fake( next );
				evt.data.preventDefault();
				evt.cancel();
			}
		};

		function isDeleteAction( keystroke ) {
			return ( keystroke === 8 || keystroke === 46 );
		}

		function isEmptyElement( element ) {
			var text = element.$.textContent === undefined ? element.$.innerText : element.$.textContent;

			// Check if the element does not contain a widget to prevent removal of the body element. (#5125)
			return text === '' && !isWidget( element.getFirst() );
		}

		function isEmptyBlock( block ) {
			return block.isBlockBoundary() && isEmptyElement( block );
		}
	}

	// If fake selection should be applied this function will return instance of
	// CKEDITOR.dom.element which should gain fake selection.
	function getNonEditableFakeSelectionReceiver( ranges ) {
		var enclosedNode, shrinkedNode, clone, range;

		if ( ranges.length == 1 && !( range = ranges[ 0 ] ).collapsed &&
			( enclosedNode = range.getEnclosedNode() ) && enclosedNode.type == CKEDITOR.NODE_ELEMENT ) {
			// So far we can't say that enclosed element is non-editable. Before checking,
			// we'll shrink range (clone). Shrinking will stop on non-editable range, or
			// innermost element (https://dev.ckeditor.com/ticket/11114).
			clone = range.clone();
			clone.shrink( CKEDITOR.SHRINK_ELEMENT, true );

			// If shrinked range still encloses an element, check this one (shrink stops only on non-editable elements).
			if ( ( shrinkedNode = clone.getEnclosedNode() ) && shrinkedNode.type == CKEDITOR.NODE_ELEMENT )
				enclosedNode = shrinkedNode;

			if ( enclosedNode.getAttribute( 'contenteditable' ) == 'false' )
				return enclosedNode;
		}
	}

	// Fix ranges which may end after hidden selection container.
	// Note: this function may only be used if hidden selection container
	// is not in DOM any more.
	function fixRangesAfterHiddenSelectionContainer( ranges, root ) {
		var range;
		for ( var i = 0; i < ranges.length; ++i ) {
			range = ranges[ i ];
			if ( range.endContainer.equals( root ) ) {
				// We can use getChildCount() because hidden selection container is not in DOM.
				range.endOffset = Math.min( range.endOffset, root.getChildCount() );
			}
		}
	}

	// Extract only editable part or ranges.
	// Note: this function modifies ranges list!
	// @param {CKEDITOR.dom.rangeList} ranges
	function extractEditableRanges( ranges ) {
		for ( var i = 0; i < ranges.length; i++ ) {
			var range = ranges[ i ];

			// Drop range spans inside one ready-only node.
			var parent = range.getCommonAncestor();
			if ( parent.isReadOnly() )
				ranges.splice( i, 1 );

			if ( range.collapsed )
				continue;

			// Range may start inside a non-editable element,
			// replace the range start after it.
			if ( range.startContainer.isReadOnly() ) {
				var current = range.startContainer,
					isElement;

				while ( current ) {
					isElement = current.type == CKEDITOR.NODE_ELEMENT;

					if ( ( isElement && current.is( 'body' ) ) || !current.isReadOnly() )
						break;

					if ( isElement && current.getAttribute( 'contentEditable' ) == 'false' )
						range.setStartAfter( current );

					current = current.getParent();
				}
			}

			var startContainer = range.startContainer,
				endContainer = range.endContainer,
				startOffset = range.startOffset,
				endOffset = range.endOffset,
				walkerRange = range.clone();

			// Enlarge range start/end with text node to avoid walker
			// being DOM destructive, it doesn't interfere our checking
			// of elements below as well.
			if ( startContainer && startContainer.type == CKEDITOR.NODE_TEXT ) {
				if ( startOffset >= startContainer.getLength() )
					walkerRange.setStartAfter( startContainer );
				else
					walkerRange.setStartBefore( startContainer );
			}

			if ( endContainer && endContainer.type == CKEDITOR.NODE_TEXT ) {
				if ( !endOffset )
					walkerRange.setEndBefore( endContainer );
				else
					walkerRange.setEndAfter( endContainer );
			}

			// Looking for non-editable element inside the range.
			var walker = new CKEDITOR.dom.walker( walkerRange );
			walker.evaluator = function( node ) {
				if ( node.type == CKEDITOR.NODE_ELEMENT && node.isReadOnly() ) {
					var newRange = range.clone();
					range.setEndBefore( node );

					// Drop collapsed range around read-only elements,
					// it make sure the range list empty when selecting
					// only non-editable elements.
					if ( range.collapsed )
						ranges.splice( i--, 1 );

					// Avoid creating invalid range.
					if ( !( node.getPosition( walkerRange.endContainer ) & CKEDITOR.POSITION_CONTAINS ) ) {
						newRange.setStartAfter( node );
						if ( !newRange.collapsed )
							ranges.splice( i + 1, 0, newRange );
					}

					return true;
				}

				return false;
			};

			walker.next();
		}

		return ranges;
	}

	// Setup all editor instances for the necessary selection hooks.
	CKEDITOR.on( 'instanceCreated', function( ev ) {
		var editor = ev.editor;

		editor.on( 'contentDom', function() {
			var doc = editor.document,
				outerDoc = CKEDITOR.document,
				editable = editor.editable(),
				body = doc.getBody(),
				html = doc.getDocumentElement();

			var isInline = editable.isInline();

			var restoreSel,
				lastSel;

			// Give the editable an initial selection on first focus,
			// put selection at a consistent position at the start
			// of the contents. (https://dev.ckeditor.com/ticket/9507)
			if ( CKEDITOR.env.gecko ) {
				editable.attachListener( editable, 'focus', function( evt ) {
					evt.removeListener();

					if ( restoreSel !== 0 ) {
						var nativ = editor.getSelection().getNative();
						// Do it only if the native selection is at an unwanted
						// place (at the very start of the editable). https://dev.ckeditor.com/ticket/10119
						if ( nativ && nativ.isCollapsed && nativ.anchorNode == editable.$ ) {
							var rng = editor.createRange();
							rng.moveToElementEditStart( editable );
							rng.select();
						}
					}
				}, null, null, -2 );
			}

			// Plays the magic here to restore/save dom selection on editable focus/blur.
			editable.attachListener( editable, CKEDITOR.env.webkit || CKEDITOR.env.gecko ? 'focusin' : 'focus' , function() {
				// On Webkit&Gecko (#1113) we use focusin which is fired more often than focus - e.g. when moving from main editable
				// to nested editable (or the opposite). Unlock selection all, but restore only when it was locked
				// for the same active element, what will e.g. mean restoring after displaying dialog.
				if ( restoreSel && ( CKEDITOR.env.webkit || CKEDITOR.env.gecko ) ) {
					restoreSel = editor._.previousActive && editor._.previousActive.equals( doc.getActive() );

					// On Webkit when editor uses divarea, native focus causes editable viewport to scroll
					// to the top (when there is no active selection inside while focusing) so the scroll
					// position should be restored after focusing back editable area. (https://dev.ckeditor.com/ticket/14659)
					var requiresScrollFix = editor._.previousScrollTop != null && editor._.previousScrollTop != editable.$.scrollTop;
					if ( CKEDITOR.env.webkit && restoreSel && requiresScrollFix ) {
						editable.$.scrollTop = editor._.previousScrollTop;
					}
				}

				editor.unlockSelection( restoreSel );
				restoreSel = 0;
			}, null, null, -1 );

			// Disable selection restoring when clicking in.
			editable.attachListener( editable, 'mousedown', function() {
				restoreSel = 0;
			} );

			// Save a cloned version of current selection.
			function saveSel() {
				lastSel = new CKEDITOR.dom.selection( editor.getSelection() );
				lastSel.lock();
			}

			// Browsers could loose the selection once the editable lost focus,
			// in such case we need to reproduce it by saving a locked selection
			// and restoring it upon focus gain.
			// Firefox native selection is lost editor.focus is triggered by click (#3136).
			if ( CKEDITOR.env.ie || CKEDITOR.env.gecko || isInline ) {
				// For old IEs, we can retrieve the last correct DOM selection upon the "beforedeactivate" event.
				// For the rest, a more frequent check is required for each selection change made.
				if ( isMSSelection ) {
					editable.attachListener( editable, 'beforedeactivate', saveSel, null, null, -1 );
				} else {
					editable.attachListener( editor, 'selectionCheck', saveSel, null, null, -1 );
				}

				// Lock the selection and mark it to be restored.
				// On Webkit&Gecko (#1113) we use focusout which is fired more often than blur. I.e. it will also be
				// fired when nested editable is blurred.
				editable.attachListener( editable, CKEDITOR.env.webkit || CKEDITOR.env.gecko ? 'focusout' : 'blur', function() {
					var isFakeOrSingleSelection = lastSel && ( lastSel.isFake || lastSel.getRanges().length < 2 );

					// Ignore cases that doesn't produce issue in Firefox (#3136).
					if ( CKEDITOR.env.gecko && !isInline && isFakeOrSingleSelection ) {
						return;
					}

					editor.lockSelection( lastSel );
					restoreSel = 1;
				}, null, null, -1 );

				// Disable selection restoring when clicking in.
				editable.attachListener( editable, 'mousedown', function() {
					restoreSel = 0;
				} );
			}

			// The following selection-related fixes only apply to classic (`iframe`-based) editable.
			if ( CKEDITOR.env.ie && !isInline ) {
				var scroll;
				editable.attachListener( editable, 'mousedown', function( evt ) {
					// IE scrolls document to top on right mousedown
					// when editor has no focus, remember this scroll
					// position and revert it before context menu opens. (https://dev.ckeditor.com/ticket/5778)
					if ( evt.data.$.button == 2 ) {
						var sel = editor.document.getSelection();
						if ( !sel || sel.getType() == CKEDITOR.SELECTION_NONE )
							scroll = editor.window.getScrollPosition();
					}
				} );

				editable.attachListener( editable, 'mouseup', function( evt ) {
					// Restore recorded scroll position when needed on right mouseup.
					if ( evt.data.$.button == 2 && scroll ) {
						editor.document.$.documentElement.scrollLeft = scroll.x;
						editor.document.$.documentElement.scrollTop = scroll.y;
					}
					scroll = null;
				} );

				// When content doc is in standards mode, IE doesn't focus the editor when
				// clicking at the region below body (on html element) content, we emulate
				// the normal behavior on old IEs. (https://dev.ckeditor.com/ticket/1659, https://dev.ckeditor.com/ticket/7932)
				if ( doc.$.compatMode != 'BackCompat' ) {
					if ( CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat ) {
						var textRng,
							startRng;

						html.on( 'mousedown', function( evt ) {
							evt = evt.data;

							// Expand the text range along with mouse move.
							function onHover( evt ) {
								evt = evt.data.$;
								if ( textRng ) {
									// Read the current cursor.
									var rngEnd = body.$.createTextRange();

									moveRangeToPoint( rngEnd, evt.clientX, evt.clientY );

									// Handle drag directions.
									textRng.setEndPoint(
										startRng.compareEndPoints( 'StartToStart', rngEnd ) < 0 ?
										'EndToEnd' : 'StartToStart', rngEnd );

									// Update selection with new range.
									textRng.select();
								}
							}

							function removeListeners() {
								outerDoc.removeListener( 'mouseup', onSelectEnd );
								html.removeListener( 'mouseup', onSelectEnd );
							}

							function onSelectEnd() {
								html.removeListener( 'mousemove', onHover );
								removeListeners();

								// Make it in effect on mouse up. (https://dev.ckeditor.com/ticket/9022)
								textRng.select();
							}


							// We're sure that the click happens at the region
							// below body, but not on scrollbar.
							if ( evt.getTarget().is( 'html' ) &&
									evt.$.y < html.$.clientHeight &&
									evt.$.x < html.$.clientWidth ) {
								// Start to build the text range.
								textRng = body.$.createTextRange();
								moveRangeToPoint( textRng, evt.$.clientX, evt.$.clientY );

								// Records the dragging start of the above text range.
								startRng = textRng.duplicate();

								html.on( 'mousemove', onHover );
								outerDoc.on( 'mouseup', onSelectEnd );
								html.on( 'mouseup', onSelectEnd );
							}
						} );
					}

					// It's much simpler for IE8+, we just need to reselect the reported range.
					// This hack does not work on IE>=11 because there's no old selection&range APIs.
					if ( CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11 ) {
						html.on( 'mousedown', function( evt ) {
							if ( evt.data.getTarget().is( 'html' ) ) {
								// Limit the text selection mouse move inside of editable. (https://dev.ckeditor.com/ticket/9715)
								outerDoc.on( 'mouseup', onSelectEnd );
								html.on( 'mouseup', onSelectEnd );
							}
						} );
					}
				}
			}

			// We check the selection change:
			// 1. Upon "selectionchange" event from the editable element. (which might be faked event fired by our code)
			// 2. After the accomplish of keyboard, mouse and touch (#2276) events.
			editable.attachListener( editable, 'selectionchange', checkSelectionChange, editor );
			editable.attachListener( editable, 'keyup', checkSelectionChangeTimeout, editor );
			editable.attachListener( editable, 'touchstart', checkSelectionChangeTimeout, editor );
			editable.attachListener( editable, 'touchend', checkSelectionChangeTimeout, editor );

			if ( CKEDITOR.env.ie ) {
				// https://dev.ckeditor.com/ticket/14407 - Don't even let anything happen if the selection is in a non-editable element.
				editable.attachListener( editable, 'keydown', disableSelectionChangeForNonEditables, editor );
			}

			// Always fire the selection change on focus gain.
			// On Webkit&Gecko (#1113) do this on focusin, because the selection is unlocked on it too and
			// we need synchronization between those listeners to not lost cached editor._.previousActive property
			// (which is updated on selectionCheck).
			editable.attachListener( editable, CKEDITOR.env.webkit || CKEDITOR.env.gecko ? 'focusin' : 'focus', function() {
				editor.forceNextSelectionCheck();
				editor.selectionChange( 1 );
			} );

			// https://dev.ckeditor.com/ticket/9699: On Webkit&Gecko in inline editor we have to check selection when it was changed
			// by dragging and releasing mouse button outside editable. Dragging (mousedown)
			// has to be initialized in editable, but for mouseup we listen on document element.
			if ( isInline && ( CKEDITOR.env.webkit || CKEDITOR.env.gecko ) ) {
				var mouseDown;
				editable.attachListener( editable, 'mousedown', function() {
					mouseDown = 1;
				} );
				editable.attachListener( doc.getDocumentElement(), 'mouseup', function() {
					if ( mouseDown )
						checkSelectionChangeTimeout.call( editor );
					mouseDown = 0;
				} );
			}
			// In all other cases listen on simple mouseup over editable, as we did before https://dev.ckeditor.com/ticket/9699.
			//
			// Use document instead of editable in non-IEs for observing mouseup
			// since editable won't fire the event if selection process started within iframe and ended out
			// of the editor (https://dev.ckeditor.com/ticket/9851).
			else {
				editable.attachListener( CKEDITOR.env.ie ? editable : doc.getDocumentElement(), 'mouseup', checkSelectionChangeTimeout, editor );
			}

			if ( CKEDITOR.env.webkit ) {
				// Before keystroke is handled by editor, check to remove the filling char.
				editable.attachListener( doc, 'keydown', function( evt ) {
					var key = evt.data.getKey();
					// Remove the filling char before some keys get
					// executed, so they'll not get blocked by it.
					switch ( key ) {
						case 13: // ENTER
						case 33: // PAGEUP
						case 34: // PAGEDOWN
						case 35: // HOME
						case 36: // END
						case 37: // LEFT-ARROW
						case 39: // RIGHT-ARROW
						case 8: // BACKSPACE
						case 45: // INS
						case 46: // DEl
							if ( editable.hasFocus ) {
								removeFillingCharSequenceNode( editable );
							}
					}

				}, null, null, -1 );
			}

			editable.attachListener( editable, 'keydown', getOnKeyDownListener( editor ), null, null, -1 );

			function moveRangeToPoint( range, x, y ) {
				// Error prune in IE7. (https://dev.ckeditor.com/ticket/9034, https://dev.ckeditor.com/ticket/9110)
				try {
					range.moveToPoint( x, y );
				} catch ( e ) {}
			}

			function removeListeners() {
				outerDoc.removeListener( 'mouseup', onSelectEnd );
				html.removeListener( 'mouseup', onSelectEnd );
			}

			function onSelectEnd() {
				removeListeners();

				// The event is not fired when clicking on the scrollbars,
				// so we can safely check the following to understand
				// whether the empty space following <body> has been clicked.
				var sel = CKEDITOR.document.$.selection,
					range = sel.createRange();

				// The selection range is reported on host, but actually it should applies to the content doc.
				// The parentElement may be null for read only mode in IE10 and below (https://dev.ckeditor.com/ticket/9780).
				if ( sel.type != 'None' && range.parentElement() && range.parentElement().ownerDocument == doc.$ )
					range.select();
			}

			function disableSelectionChangeForNonEditables( evt ) {
				var sel,
					ascendant;

				// Allow on typing inside editable elements of widgets if those are currently focused (#3587)
				if ( isTypingElement( this.document.getActive() ) ) {
					return;
				}

				sel = this.getSelection( 1 );
				ascendant = getNonEditableAscendant( sel );

				// Prevent changing selection when an ascendant is an entire editable (#1632).
				if ( ascendant && !ascendant.equals( editable ) ) {
					sel.selectElement( ascendant );
					evt.data.preventDefault();
				}
			}

			function isTypingElement( activeElement ) {
				if ( !activeElement ) {
					return false;
				}

				return activeElement.getName() === 'input' ||
					activeElement.getName() === 'textarea';
			}

			function getNonEditableAscendant( sel ) {
				var range = sel.getRanges()[ 0 ];

				if ( !range ) {
					return null;
				}

				// Fetch first contenteditable parent.
				var ascendant = range.startContainer.getAscendant( function( parent ) {
					return parent.type == CKEDITOR.NODE_ELEMENT && parent.hasAttribute( 'contenteditable' );
				}, true );

				if ( ascendant && ascendant.getAttribute( 'contenteditable' ) === 'false' ) {
					return ascendant;
				}

				return null;
			}
		} );

		editor.on( 'setData', function() {
			// Invalidate locked selection when unloading DOM.
			// (https://dev.ckeditor.com/ticket/9521, https://dev.ckeditor.com/ticket/5217#comment:32 and https://dev.ckeditor.com/ticket/11500#comment:11)
			editor.unlockSelection();

			// Webkit's selection will mess up after the data loading.
			if ( CKEDITOR.env.webkit )
				clearSelection();
		} );

		// Catch all the cases which above setData listener couldn't catch.
		// For example: switching to source mode and destroying editor.
		editor.on( 'contentDomUnload', function() {
			editor.unlockSelection();
		} );

		// IE9 might cease to work if there's an object selection inside the iframe (https://dev.ckeditor.com/ticket/7639).
		if ( CKEDITOR.env.ie9Compat )
			editor.on( 'beforeDestroy', clearSelection, null, null, 9 );

		// Check selection change on data reload.
		editor.on( 'dataReady', function() {
			// Clean up fake selection after setting data.
			delete editor._.fakeSelection;
			delete editor._.hiddenSelectionContainer;

			editor.selectionChange( 1 );
		} );

		// When loaded data are ready check whether hidden selection container was not loaded.
		editor.on( 'loadSnapshot', function() {
			var isElement = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_ELEMENT ),
				// TODO replace with el.find() which will be introduced in https://dev.ckeditor.com/ticket/9764,
				// because it may happen that hidden sel container won't be the last element.
				last = editor.editable().getLast( isElement );

			if ( last && last.hasAttribute( 'data-cke-hidden-sel' ) ) {
				last.remove();

				// Firefox does a very unfortunate thing. When a non-editable element is the only
				// element in the editable, when we remove the hidden selection container, Firefox
				// will insert a bogus <br> at the beginning of the editable...
				// See: https://bugzilla.mozilla.org/show_bug.cgi?id=911201
				//
				// This behavior is never desired because this <br> pushes the content lower, but in
				// this case it is especially dangerous, because it happens when a bookmark is being restored.
				// Since this <br> is inserted at the beginning it changes indexes and thus breaks the bookmark2
				// what results in errors.
				//
				// So... let's revert what Firefox broke.
				if ( CKEDITOR.env.gecko ) {
					var first = editor.editable().getFirst( isElement );
					if ( first && first.is( 'br' ) && first.getAttribute( '_moz_editor_bogus_node' ) ) {
						first.remove();
					}
				}
			}
		}, null, null, 100 );

		editor.on( 'key', function( evt ) {
			if ( editor.mode != 'wysiwyg' ) {
				return;
			}

			var sel = editor.getSelection();
			if ( !sel.isFake )
				return;

			var handler = fakeSelectionDefaultKeystrokeHandlers[ evt.data.keyCode ];
			if ( handler )
				return handler( { editor: editor, selected: sel.getSelectedElement(), selection: sel, keyEvent: evt } );
		} );

		function clearSelection() {
			var sel = editor.getSelection();
			sel && sel.removeAllRanges();
		}
	} );

	// On WebKit only, we need a special "filling" char on some situations
	// (https://dev.ckeditor.com/ticket/1272). Here we set the events that should invalidate that char.
	if ( CKEDITOR.env.webkit ) {
		CKEDITOR.on( 'instanceReady', function( evt ) {
			var editor = evt.editor;

			editor.on( 'selectionChange', function() {
				checkFillingCharSequenceNodeReady( editor.editable() );
			}, null, null, -1 );

			editor.on( 'beforeSetMode', function() {
				removeFillingCharSequenceNode( editor.editable() );
			}, null, null, -1 );

			// Filter Undo snapshot's HTML to get rid of Filling Char Sequence.
			// Note: CKEDITOR.dom.range.createBookmark2() normalizes snapshot's
			// bookmarks to anticipate the removal of FCSeq from the snapshot's HTML (https://dev.ckeditor.com/ticket/13816).
			editor.on( 'getSnapshot', function( evt ) {
				if ( evt.data ) {
					evt.data = removeFillingCharSequenceString( evt.data );
				}
			}, editor, null, 20 );

			// Filter data to get rid of Filling Char Sequence. Filter on #toDataFormat
			// instead of #getData because once removed, FCSeq may leave an empty element,
			// which should be pruned by the dataProcessor (https://dev.ckeditor.com/ticket/13816).
			// Note: Used low priority to filter when dataProcessor works on strings,
			// not pseudo–DOM.
			editor.on( 'toDataFormat', function( evt ) {
				evt.data.dataValue = removeFillingCharSequenceString( evt.data.dataValue );
			}, null, null, 0 );
		} );
	}

	/**
	 * Check the selection change in editor and potentially fires
	 * the {@link CKEDITOR.editor#event-selectionChange} event.
	 *
	 * @method
	 * @member CKEDITOR.editor
	 * @param {Boolean} [checkNow=false] Force the check to happen immediately
	 * instead of coming with a timeout delay (default).
	 */
	CKEDITOR.editor.prototype.selectionChange = function( checkNow ) {
		( checkNow ? checkSelectionChange : checkSelectionChangeTimeout ).call( this );
	};

	/**
	 * Retrieve the editor selection in scope of editable element.
	 *
	 * **Note:** Since the native browser selection provides only one single
	 * selection at a time per document, so if editor's editable element has lost focus,
	 * this method will return a null value unless the {@link CKEDITOR.editor#lockSelection}
	 * has been called beforehand so the saved selection is retrieved.
	 *
	 *		var selection = CKEDITOR.instances.editor1.getSelection();
	 *		alert( selection.getType() );
	 *
	 * @method
	 * @member CKEDITOR.editor
	 * @param {Boolean} forceRealSelection Return real selection, instead of saved or fake one.
	 * @returns {CKEDITOR.dom.selection/null} A selection object or null if not available for the moment.
	 */
	CKEDITOR.editor.prototype.getSelection = function( forceRealSelection ) {

		// Check if there exists a locked or fake selection.
		if ( ( this._.savedSelection || this._.fakeSelection ) && !forceRealSelection )
			return this._.savedSelection || this._.fakeSelection;

		// Editable element might be absent or editor might not be in a wysiwyg mode.
		var editable = this.editable();

		return editable && this.mode == 'wysiwyg' && this.status !== 'recreating' ? new CKEDITOR.dom.selection( editable ) : null;
	};

	/**
	 * Retrieves the {@link CKEDITOR.dom.range} instances that represent the current selection.
	 *
	 * **Note:** This function is an alias for the {@link CKEDITOR.dom.selection#getRanges} method.
	 *
	 * @method
	 * @since 4.14.0
	 * @member CKEDITOR.editor
	 * @param {Boolean} [onlyEditables] If set to `true`, this function retrieves editable ranges only.
	 * @returns {Array} Range instances that represent the current selection.
	 */
	CKEDITOR.editor.prototype.getSelectedRanges = function( onlyEditables ) {
		var selection = this.getSelection(),
			ranges = selection && selection.getRanges( onlyEditables );

		return ranges || [];
	};

	/**
	 * Locks the selection made in the editor in order to make it possible to
	 * manipulate it without browser interference. A locked selection is
	 * cached and remains unchanged until it is released with the
	 * {@link CKEDITOR.editor#unlockSelection} method.
	 *
	 * @method
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.dom.selection} [sel] Specify the selection to be locked.
	 * @returns {Boolean} `true` if selection was locked.
	 */
	CKEDITOR.editor.prototype.lockSelection = function( sel ) {
		sel = sel || this.getSelection( 1 );
		if ( sel.getType() != CKEDITOR.SELECTION_NONE ) {
			!sel.isLocked && sel.lock();
			this._.savedSelection = sel;
			return true;
		}
		return false;
	};

	/**
	 * Unlocks the selection made in the editor and locked with the
	 * {@link CKEDITOR.editor#lockSelection} method. An unlocked selection
	 * is no longer cached and can be changed.
	 *
	 * @method
	 * @member CKEDITOR.editor
	 * @param {Boolean} [restore] If set to `true`, the selection is
	 * restored back to the selection saved earlier by using the
	 * {@link CKEDITOR.dom.selection#lock} method.
	 */
	CKEDITOR.editor.prototype.unlockSelection = function( restore ) {
		var sel = this._.savedSelection;
		if ( sel ) {
			sel.unlock( restore );
			delete this._.savedSelection;
			return true;
		}

		return false;
	};

	/**
	 * @method
	 * @member CKEDITOR.editor
	 * @todo
	 */
	CKEDITOR.editor.prototype.forceNextSelectionCheck = function() {
		delete this._.selectionPreviousPath;
	};

	/**
	 * Gets the current selection in context of the document's body element.
	 *
	 *		var selection = CKEDITOR.instances.editor1.document.getSelection();
	 *		alert( selection.getType() );
	 *
	 * @method
	 * @member CKEDITOR.dom.document
	 * @returns {CKEDITOR.dom.selection} A selection object.
	 */
	CKEDITOR.dom.document.prototype.getSelection = function() {
		return new CKEDITOR.dom.selection( this );
	};

	/**
	 * Select this range as the only one with {@link CKEDITOR.dom.selection#selectRanges}.
	 *
	 * @method
	 * @returns {CKEDITOR.dom.selection}
	 * @member CKEDITOR.dom.range
	 */
	CKEDITOR.dom.range.prototype.select = function() {
		var sel = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection( this.root );

		sel.selectRanges( [ this ] );

		return sel;
	};

	/**
	 * No selection.
	 *
	 *		if ( editor.getSelection().getType() == CKEDITOR.SELECTION_NONE )
	 *			alert( 'Nothing is selected' );
	 *
	 * @readonly
	 * @property {Number} [=1]
	 * @member CKEDITOR
	 */
	CKEDITOR.SELECTION_NONE = 1;

	/**
	 * A text or a collapsed selection.
	 *
	 *		if ( editor.getSelection().getType() == CKEDITOR.SELECTION_TEXT )
	 *			alert( 'A text is selected' );
	 *
	 * @readonly
	 * @property {Number} [=2]
	 * @member CKEDITOR
	 */
	CKEDITOR.SELECTION_TEXT = 2;

	/**
	 * Element selection.
	 *
	 *		if ( editor.getSelection().getType() == CKEDITOR.SELECTION_ELEMENT )
	 *			alert( 'An element is selected' );
	 *
	 * @readonly
	 * @property {Number} [=3]
	 * @member CKEDITOR
	 */
	CKEDITOR.SELECTION_ELEMENT = 3;

	/**
	 * Manipulates the selection within a DOM element. If the current browser selection
	 * spans outside of the element, an empty selection object is returned.
	 *
	 * Despite the fact that selection's constructor allows to create selection instances,
	 * usually it's better to get selection from the editor instance:
	 *
	 *		var sel = editor.getSelection();
	 *
	 * See {@link CKEDITOR.editor#getSelection}.
	 *
	 * @class
	 * @constructor Creates a selection class instance.
	 *
	 *		// Selection scoped in document.
	 *		var sel = new CKEDITOR.dom.selection( CKEDITOR.document );
	 *
	 *		// Selection scoped in element with 'editable' id.
	 *		var sel = new CKEDITOR.dom.selection( CKEDITOR.document.getById( 'editable' ) );
	 *
	 *		// Cloning selection.
	 *		var clone = new CKEDITOR.dom.selection( sel );
	 *
	 * @param {CKEDITOR.dom.document/CKEDITOR.dom.element/CKEDITOR.dom.selection} target
	 * The DOM document/element that the DOM selection is restrained to. Only selection which spans
	 * within the target element is considered as valid.
	 *
	 * If {@link CKEDITOR.dom.selection} is passed, then its clone will be created.
	 */
	CKEDITOR.dom.selection = function( target ) {
		// Target is a selection - clone it.
		if ( target instanceof CKEDITOR.dom.selection ) {
			var selection = target;
			target = target.root;
		}

		var isElement = target instanceof CKEDITOR.dom.element,
			root;

		this.rev = selection ? selection.rev : nextRev++;
		this.document = target instanceof CKEDITOR.dom.document ? target : target.getDocument();
		this.root = root = isElement ? target : this.document.getBody();
		this.isLocked = 0;
		this._ = {
			cache: {}
		};

		// Clone selection.
		if ( selection ) {
			CKEDITOR.tools.extend( this._.cache, selection._.cache );
			this.isFake = selection.isFake;
			this.isLocked = selection.isLocked;
			return this;
		}

		// Check whether browser focus is really inside of the editable element.

		var nativeSel = this.getNative(),
			rangeParent,
			range;

		if ( nativeSel ) {
			if ( nativeSel.getRangeAt ) {
				range = nativeSel.rangeCount && nativeSel.getRangeAt( 0 );
				rangeParent = range && new CKEDITOR.dom.node( range.commonAncestorContainer );
			}
			// For old IEs.
			else {
				// Sometimes, mostly when selection is close to the table or hr,
				// IE throws "Unspecified error".
				try {
					range = nativeSel.createRange();
				} catch ( err ) {}
				rangeParent = range && CKEDITOR.dom.element.get( range.item && range.item( 0 ) || range.parentElement() );
			}
		}

		// Selection out of concerned range, empty the selection.
		// TODO check whether this condition cannot be reverted to its old
		// form (commented out) after we closed https://dev.ckeditor.com/ticket/10438.
		//if ( !( rangeParent && ( root.equals( rangeParent ) || root.contains( rangeParent ) ) ) ) {
		if ( !(
			rangeParent &&
			( rangeParent.type == CKEDITOR.NODE_ELEMENT || rangeParent.type == CKEDITOR.NODE_TEXT ) &&
			( this.root.equals( rangeParent ) || this.root.contains( rangeParent ) )
		) ) {

			this._.cache.type = CKEDITOR.SELECTION_NONE;
			this._.cache.startElement = null;
			this._.cache.selectedElement = null;
			this._.cache.selectedText = '';
			this._.cache.ranges = new CKEDITOR.dom.rangeList();
		}

		return this;
	};

	var styleObjectElements = { img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, th: 1, embed: 1, object: 1, ol: 1, ul: 1,
			a: 1, input: 1, form: 1, select: 1, textarea: 1, button: 1, fieldset: 1, thead: 1, tfoot: 1 };

	CKEDITOR.tools.extend( CKEDITOR.dom.selection, {
		_removeFillingCharSequenceString: removeFillingCharSequenceString,
		_createFillingCharSequenceNode: createFillingCharSequenceNode,

		/**
		 * The sequence used in a WebKit-based browser to create a Filling Character. By default it is
		 * a string of 7 zero-width space characters (U+200B).
		 *
		 * @since 4.5.7
		 * @readonly
		 * @property {String}
		 */
		FILLING_CHAR_SEQUENCE: fillingCharSequence
	} );

	CKEDITOR.dom.selection.prototype = {
		/**
		 * Gets the native selection object from the browser.
		 *
		 *		var selection = editor.getSelection().getNative();
		 *
		 * @returns {Object} The native browser selection object or null if this is a fake selection.
		 */
		getNative: function() {
			if ( this._.cache.nativeSel !== undefined )
				return this._.cache.nativeSel;

			return ( this._.cache.nativeSel = isMSSelection ? this.document.$.selection : this.document.getWindow().$.getSelection() );
		},

		/**
		 * Gets the type of the current selection. The following values are
		 * available:
		 *
		 * * {@link CKEDITOR#SELECTION_NONE} (1): No selection.
		 * * {@link CKEDITOR#SELECTION_TEXT} (2): A text or a collapsed selection is selected.
		 * * {@link CKEDITOR#SELECTION_ELEMENT} (3): An element is selected.
		 *
		 * Example:
		 *
		 *		if ( editor.getSelection().getType() == CKEDITOR.SELECTION_TEXT )
		 *			alert( 'A text is selected' );
		 *
		 * @method
		 * @returns {Number} One of the following constant values: {@link CKEDITOR#SELECTION_NONE},
		 * {@link CKEDITOR#SELECTION_TEXT} or {@link CKEDITOR#SELECTION_ELEMENT}.
		 */
		getType: isMSSelection ?
		function() {
			var cache = this._.cache;
			if ( cache.type )
				return cache.type;

			var type = CKEDITOR.SELECTION_NONE;

			try {
				var sel = this.getNative(),
					ieType = sel.type;

				if ( ieType == 'Text' )
					type = CKEDITOR.SELECTION_TEXT;

				if ( ieType == 'Control' )
					type = CKEDITOR.SELECTION_ELEMENT;

				// It is possible that we can still get a text range
				// object even when type == 'None' is returned by IE.
				// So we'd better check the object returned by
				// createRange() rather than by looking at the type.
				if ( sel.createRange().parentElement() )
					type = CKEDITOR.SELECTION_TEXT;
			} catch ( e ) {}

			return ( cache.type = type );
		} : function() {
			var cache = this._.cache;
			if ( cache.type )
				return cache.type;

			var type = CKEDITOR.SELECTION_TEXT;

			var sel = this.getNative();

			if ( !( sel && sel.rangeCount ) )
				type = CKEDITOR.SELECTION_NONE;
			else if ( sel.rangeCount == 1 ) {
				// Check if the actual selection is a control (IMG,
				// TABLE, HR, etc...).

				var range = sel.getRangeAt( 0 ),
					startContainer = range.startContainer;

				if ( startContainer == range.endContainer && startContainer.nodeType == 1 &&
					( range.endOffset - range.startOffset ) == 1 &&
					styleObjectElements[ startContainer.childNodes[ range.startOffset ].nodeName.toLowerCase() ] ) {
					type = CKEDITOR.SELECTION_ELEMENT;
				}

			}

			return ( cache.type = type );
		},

		/**
		 * Retrieves the {@link CKEDITOR.dom.range} instances that represent the current selection.
		 *
		 * Note: Some browsers return multiple ranges even for a continuous selection. Firefox, for example, returns
		 * one range for each table cell when one or more table rows are selected.
		 *
		 *		var ranges = selection.getRanges();
		 *		alert( ranges.length );
		 *
		 * @method
		 * @param {Boolean} [onlyEditables] If set to `true`, this function retrieves editable ranges only.
		 * @returns {Array} Range instances that represent the current selection.
		 */
		getRanges: ( function() {
			var func = isMSSelection ? ( function() {
				function getNodeIndex( node ) {
					return new CKEDITOR.dom.node( node ).getIndex();
				}

				// Finds the container and offset for a specific boundary
				// of an IE range.
				var getBoundaryInformation = function( range, start ) {
					// Creates a collapsed range at the requested boundary.
					range = range.duplicate();
					range.collapse( start );

					// Gets the element that encloses the range entirely.
					var parent = range.parentElement();

					// Empty parent element, e.g. <i>^</i>
					if ( !parent.hasChildNodes() )
						return { container: parent, offset: 0 };

					var siblings = parent.children,
						child, sibling,
						testRange = range.duplicate(),
						startIndex = 0,
						endIndex = siblings.length - 1,
						index = -1,
						position, distance, container;

					// Binary search over all element children to test the range to see whether
					// range is right on the boundary of one element.
					while ( startIndex <= endIndex ) {
						index = Math.floor( ( startIndex + endIndex ) / 2 );
						child = siblings[ index ];
						testRange.moveToElementText( child );
						position = testRange.compareEndPoints( 'StartToStart', range );

						if ( position > 0 )
							endIndex = index - 1;
						else if ( position < 0 )
							startIndex = index + 1;
						else
							return { container: parent, offset: getNodeIndex( child ) };
					}

					// All children are text nodes,
					// or to the right hand of test range are all text nodes. (https://dev.ckeditor.com/ticket/6992)
					if ( index == -1 || index == siblings.length - 1 && position < 0 ) {
						// Adapt test range to embrace the entire parent contents.
						testRange.moveToElementText( parent );
						testRange.setEndPoint( 'StartToStart', range );

						// IE report line break as CRLF with range.text but
						// only LF with textnode.nodeValue, normalize them to avoid
						// breaking character counting logic below. (https://dev.ckeditor.com/ticket/3949)
						distance = testRange.text.replace( /(\r\n|\r)/g, '\n' ).length;

						siblings = parent.childNodes;

						// Actual range anchor right beside test range at the boundary of text node.
						if ( !distance ) {
							child = siblings[ siblings.length - 1 ];

							if ( child.nodeType != CKEDITOR.NODE_TEXT )
								return { container: parent, offset: siblings.length };
							else
								return { container: child, offset: child.nodeValue.length };
						}

						// Start the measuring until distance overflows, meanwhile count the text nodes.
						var i = siblings.length;
						while ( distance > 0 && i > 0 ) {
							sibling = siblings[ --i ];
							if ( sibling.nodeType == CKEDITOR.NODE_TEXT ) {
								container = sibling;
								distance -= sibling.nodeValue.length;
							}
						}

						return { container: container, offset: -distance };
					}
					// Test range was one offset beyond OR behind the anchored text node.
					else {
						// Adapt one side of test range to the actual range
						// for measuring the offset between them.
						testRange.collapse( position > 0 ? true : false );
						testRange.setEndPoint( position > 0 ? 'StartToStart' : 'EndToStart', range );

						// IE report line break as CRLF with range.text but
						// only LF with textnode.nodeValue, normalize them to avoid
						// breaking character counting logic below. (https://dev.ckeditor.com/ticket/3949)
						distance = testRange.text.replace( /(\r\n|\r)/g, '\n' ).length;

						// Actual range anchor right beside test range at the inner boundary of text node.
						if ( !distance )
							return { container: parent, offset: getNodeIndex( child ) + ( position > 0 ? 0 : 1 ) };

						// Start the measuring until distance overflows, meanwhile count the text nodes.
						while ( distance > 0 ) {
							try {
								sibling = child[ position > 0 ? 'previousSibling' : 'nextSibling' ];
								if ( sibling.nodeType == CKEDITOR.NODE_TEXT ) {
									distance -= sibling.nodeValue.length;
									container = sibling;
								}
								child = sibling;
							}
							// Measurement in IE could be sometimes wrong because of <select> element. (https://dev.ckeditor.com/ticket/4611)
							catch ( e ) {
								return { container: parent, offset: getNodeIndex( child ) };
							}
						}

						return { container: container, offset: position > 0 ? -distance : container.nodeValue.length + distance };
					}
				};

				return function() {
					// IE doesn't have range support (in the W3C way), so we
					// need to do some magic to transform selections into
					// CKEDITOR.dom.range instances.

					var sel = this.getNative(),
						nativeRange = sel && sel.createRange(),
						type = this.getType(),
						range;

					if ( !sel )
						return [];

					if ( type == CKEDITOR.SELECTION_TEXT ) {
						range = new CKEDITOR.dom.range( this.root );

						var boundaryInfo = getBoundaryInformation( nativeRange, true );
						range.setStart( new CKEDITOR.dom.node( boundaryInfo.container ), boundaryInfo.offset );

						boundaryInfo = getBoundaryInformation( nativeRange );
						range.setEnd( new CKEDITOR.dom.node( boundaryInfo.container ), boundaryInfo.offset );

						// Correct an invalid IE range case on empty list item. (https://dev.ckeditor.com/ticket/5850)
						if ( range.endContainer.getPosition( range.startContainer ) & CKEDITOR.POSITION_PRECEDING && range.endOffset <= range.startContainer.getIndex() )
							range.collapse();

						return [ range ];
					} else if ( type == CKEDITOR.SELECTION_ELEMENT ) {
						var retval = [];

						for ( var i = 0; i < nativeRange.length; i++ ) {
							var element = nativeRange.item( i ),
								parentElement = element.parentNode,
								j = 0;

							range = new CKEDITOR.dom.range( this.root );

							for ( ; j < parentElement.childNodes.length && parentElement.childNodes[ j ] != element; j++ ) {

							}

							range.setStart( new CKEDITOR.dom.node( parentElement ), j );
							range.setEnd( new CKEDITOR.dom.node( parentElement ), j + 1 );
							retval.push( range );
						}

						return retval;
					}

					return [];
				};
			} )() :
			function() {
				// On browsers implementing the W3C range, we simply
				// transform the native ranges in CKEDITOR.dom.range
				// instances.

				var ranges = [],
					range,
					sel = this.getNative();

				if ( !sel )
					return ranges;

				for ( var i = 0; i < sel.rangeCount; i++ ) {
					var nativeRange = sel.getRangeAt( i );

					range = new CKEDITOR.dom.range( this.root );

					range.setStart( new CKEDITOR.dom.node( nativeRange.startContainer ), nativeRange.startOffset );
					range.setEnd( new CKEDITOR.dom.node( nativeRange.endContainer ), nativeRange.endOffset );
					ranges.push( range );
				}
				return ranges;
			};

			return function( onlyEditables ) {
				var cache = this._.cache,
					ranges = cache.ranges;

				if ( !ranges )
					cache.ranges = ranges = new CKEDITOR.dom.rangeList( func.call( this ) );

				if ( !onlyEditables )
					return ranges;

				// Split range into multiple by read-only nodes.
				// Clone ranges array to avoid changing cached ranges (https://dev.ckeditor.com/ticket/11493).
				return extractEditableRanges( new CKEDITOR.dom.rangeList( ranges.slice() ) );
			};
		} )(),

		/**
		 * Gets the DOM element in which the selection starts.
		 *
		 *		var element = editor.getSelection().getStartElement();
		 *		alert( element.getName() );
		 *
		 * @returns {CKEDITOR.dom.element} The element at the beginning of the selection.
		 */
		getStartElement: function() {
			var cache = this._.cache;
			if ( cache.startElement !== undefined )
				return cache.startElement;

			var node;

			switch ( this.getType() ) {
				case CKEDITOR.SELECTION_ELEMENT:
					return this.getSelectedElement();

				case CKEDITOR.SELECTION_TEXT:

					var range = this.getRanges()[ 0 ];

					if ( range ) {
						if ( !range.collapsed ) {
							range.optimize();

							// Decrease the range content to exclude particial
							// selected node on the start which doesn't have
							// visual impact. ( https://dev.ckeditor.com/ticket/3231 )
							while ( 1 ) {
								var startContainer = range.startContainer,
									startOffset = range.startOffset;
								// Limit the fix only to non-block elements.(https://dev.ckeditor.com/ticket/3950)
								if ( startOffset == ( startContainer.getChildCount ? startContainer.getChildCount() : startContainer.getLength() ) && !startContainer.isBlockBoundary() )
									range.setStartAfter( startContainer );
								else
									break;
							}

							node = range.startContainer;

							if ( node.type != CKEDITOR.NODE_ELEMENT )
								return node.getParent();

							node = node.getChild( range.startOffset );

							if ( !node || node.type != CKEDITOR.NODE_ELEMENT )
								node = range.startContainer;
							else {
								var child = node.getFirst();
								while ( child && child.type == CKEDITOR.NODE_ELEMENT ) {
									node = child;
									child = child.getFirst();
								}
							}
						} else {
							node = range.startContainer;
							if ( node.type != CKEDITOR.NODE_ELEMENT )
								node = node.getParent();
						}

						node = node.$;
					}
			}

			return cache.startElement = ( node ? new CKEDITOR.dom.element( node ) : null );
		},

		/**
		 * Gets the currently selected element.
		 *
		 *		var element = editor.getSelection().getSelectedElement();
		 *		alert( element.getName() );
		 *
		 * @returns {CKEDITOR.dom.element/null} The selected element. `null` if no
		 * selection is available or the selection type is not {@link CKEDITOR#SELECTION_ELEMENT}.
		 */
		getSelectedElement: function() {
			var cache = this._.cache;
			if ( cache.selectedElement !== undefined )
				return cache.selectedElement;

			var self = this;

			var node = CKEDITOR.tools.tryThese(
				// Is it native IE control type selection?
				function() {
					return self.getNative().createRange().item( 0 );
				},
				// Figure it out by checking if there's a single enclosed
				// node of the range.
				function() {
					var range = self.getRanges()[ 0 ].clone(),
						enclosed, selected;

					// Check first any enclosed element, e.g. <ul>[<li><a href="#">item</a></li>]</ul>
					for ( var i = 2; i && !( ( enclosed = range.getEnclosedNode() ) && ( enclosed.type == CKEDITOR.NODE_ELEMENT ) && styleObjectElements[ enclosed.getName() ] && ( selected = enclosed ) ); i-- ) {
						// Then check any deep wrapped element, e.g. [<b><i><img /></i></b>]
						range.shrink( CKEDITOR.SHRINK_ELEMENT );
					}

					return selected && selected.$;
				}
			);

			return cache.selectedElement = ( node ? new CKEDITOR.dom.element( node ) : null );
		},

		/**
		 * Retrieves the text contained within the range. An empty string is returned for non-text selection.
		 *
		 *		var text = editor.getSelection().getSelectedText();
		 *		alert( text );
		 *
		 * @since 3.6.1
		 * @returns {String} A string of text within the current selection.
		 */
		getSelectedText: function() {
			var cache = this._.cache;
			if ( cache.selectedText !== undefined )
				return cache.selectedText;

			var nativeSel = this.getNative(),
				text = isMSSelection ? nativeSel.type == 'Control' ? '' : nativeSel.createRange().text : nativeSel.toString();

			return ( cache.selectedText = text );
		},

		/**
		 * Locks the selection made in the editor in order to make it possible to
		 * manipulate it without browser interference. A locked selection is
		 * cached and remains unchanged until it is released with the {@link #unlock} method.
		 *
		 *		editor.getSelection().lock();
		 */
		lock: function() {
			// Call all cacheable function.
			this.getRanges();
			this.getStartElement();
			this.getSelectedElement();
			this.getSelectedText();

			// The native selection is not available when locked.
			this._.cache.nativeSel = null;

			this.isLocked = 1;
		},

		/**
		 * @todo
		 */
		unlock: function( restore ) {
			if ( !this.isLocked ) {
				return;
			}

			if ( restore ) {
				var selectedElement = this.getSelectedElement(),
					ranges = this.getRanges(),
					faked = this.isFake;
			}

			this.isLocked = 0;
			this.reset();

			if ( !restore ) {
				return;
			}

			// Saved selection may be outdated (e.g. anchored in offline nodes).
			// Avoid getting broken by such.
			var common = selectedElement || ranges[ 0 ] && ranges[ 0 ].getCommonAncestor();

			if ( !( common && common.getAscendant( 'body', 1 ) ) ) {
				return;
			}

			var editor = this.root.editor;

			// Use fake selection on tables only with tableselection plugin (#3136).
			if ( isSupportingTableSelectionPlugin( editor ) && isTableSelection( ranges ) ) {
				// Tables have it's own selection method.
				performFakeTableSelection.call( this, ranges );
				return;
			}

			if ( faked ) {
				this.fake( selectedElement );
				return;
			}

			// When browser supports multi-range selection prioritize restoring ranges (#3136).
			if ( selectedElement && ranges.length < 2 ) {
				this.selectElement( selectedElement );
				return;
			}

			this.selectRanges( ranges );
		},

		/**
		 * Clears the selection cache.
		 *
		 *		editor.getSelection().reset();
		 */
		reset: function() {
			this._.cache = {};
			this.isFake = 0;

			var editor = this.root.editor;

			// Invalidate any fake selection available in the editor.
			if ( editor && editor._.fakeSelection ) {
				// Test whether this selection is the one that was
				// faked or its clone.
				if ( this.rev == editor._.fakeSelection.rev ) {
					delete editor._.fakeSelection;
					removeHiddenSelectionContainer( editor );
				}
				else {
					CKEDITOR.warn( 'selection-fake-reset' );
				}
			}

			this.rev = nextRev++;
		},

		/**
		 * Makes the current selection of type {@link CKEDITOR#SELECTION_ELEMENT} by enclosing the specified element.
		 *
		 *		var element = editor.document.getById( 'sampleElement' );
		 *		editor.getSelection().selectElement( element );
		 *
		 * @param {CKEDITOR.dom.element} element The element to enclose in the selection.
		 */
		selectElement: function( element ) {
			var range = new CKEDITOR.dom.range( this.root );
			range.setStartBefore( element );
			range.setEndAfter( element );
			this.selectRanges( [ range ] );
		},

		/**
		 * Clears the original selection and adds the specified ranges to the document selection.
		 *
		 * 		// Move selection to the end of the editable element.
		 *		var range = editor.createRange();
		 *		range.moveToPosition( range.root, CKEDITOR.POSITION_BEFORE_END );
		 *		editor.getSelection().selectRanges( [ ranges ] );
		 *
		 * @param {Array} ranges An array of {@link CKEDITOR.dom.range} instances
		 * representing ranges to be added to the document.
		 */
		selectRanges: function( ranges ) {
			var editor = this.root.editor,
				hadHiddenSelectionContainer = editor && editor._.hiddenSelectionContainer;

			this.reset();

			// Check if there's a hiddenSelectionContainer in editable at some index.
			// Some ranges may be anchored after the hiddenSelectionContainer and,
			// once the container is removed while resetting the selection, they
			// may need new endOffset (one element less within the range) (https://dev.ckeditor.com/ticket/11021 https://dev.ckeditor.com/ticket/11393).
			if ( hadHiddenSelectionContainer )
				fixRangesAfterHiddenSelectionContainer( ranges, this.root );

			if ( !ranges.length )
				return;

			// Refresh the locked selection.
			if ( this.isLocked ) {
				// making a new DOM selection will force the focus on editable in certain situation,
				// we have to save the currently focused element for later recovery.
				var focused = CKEDITOR.document.getActive();
				this.unlock();
				this.selectRanges( ranges );
				this.lock();
				// Return to the previously focused element.
				focused && !focused.equals( this.root ) && focused.focus();
				return;
			}

			// Handle special case - automatic fake selection on non-editable elements.
			var receiver = getNonEditableFakeSelectionReceiver( ranges );

			if ( receiver ) {
				this.fake( receiver );
				return;
			}

			// Handle special case - fake selection of table cells.
			if ( isSupportingTableSelectionPlugin( editor ) &&
				isTableSelection( ranges ) && !isSelectingTable &&
				!ranges[ 0 ]._getTableElement( { table: 1 } ).hasAttribute( 'data-cke-tableselection-ignored' )
			) {
				performFakeTableSelection.call( this, ranges );
				return;
			}

			if ( isMSSelection ) {
				var notWhitespaces = CKEDITOR.dom.walker.whitespaces( true ),
					fillerTextRegex = /\ufeff|\u00a0/,
					nonCells = { table: 1, tbody: 1, tr: 1 };

				if ( ranges.length > 1 ) {
					// IE doesn't accept multiple ranges selection, so we join all into one.
					var last = ranges[ ranges.length - 1 ];
					ranges[ 0 ].setEnd( last.endContainer, last.endOffset );
				}

				var range = ranges[ 0 ];
				var collapsed = range.collapsed,
					isStartMarkerAlone, dummySpan, ieRange;

				// Try to make a object selection, be careful with selecting phase element in IE
				// will breaks the selection in non-framed environment.
				var selected = range.getEnclosedNode();
				if ( selected && selected.type == CKEDITOR.NODE_ELEMENT && selected.getName() in styleObjectElements &&
					!( selected.is( 'a' ) && selected.getText() ) ) {
					try {
						ieRange = selected.$.createControlRange();
						ieRange.addElement( selected.$ );
						ieRange.select();
						return;
					} catch ( er ) {}
				}

				// IE doesn't support selecting the entire table row/cell, move the selection into cells, e.g.
				// <table><tbody><tr>[<td>cell</b></td>... => <table><tbody><tr><td>[cell</td>...
				if ( range.startContainer.type == CKEDITOR.NODE_ELEMENT && range.startContainer.getName() in nonCells ||
					range.endContainer.type == CKEDITOR.NODE_ELEMENT && range.endContainer.getName() in nonCells ) {
					range.shrink( CKEDITOR.NODE_ELEMENT, true );
					// The range might get collapsed (https://dev.ckeditor.com/ticket/7975). Update cached variable.
					collapsed = range.collapsed;
				}

				var bookmark = range.createBookmark();

				// Create marker tags for the start and end boundaries.
				var startNode = bookmark.startNode;

				var endNode;
				if ( !collapsed )
					endNode = bookmark.endNode;

				// Create the main range which will be used for the selection.
				ieRange = range.document.$.body.createTextRange();

				// Position the range at the start boundary.
				ieRange.moveToElementText( startNode.$ );
				ieRange.moveStart( 'character', 1 );

				if ( endNode ) {
					// Create a tool range for the end.
					var ieRangeEnd = range.document.$.body.createTextRange();

					// Position the tool range at the end.
					ieRangeEnd.moveToElementText( endNode.$ );

					// Move the end boundary of the main range to match the tool range.
					ieRange.setEndPoint( 'EndToEnd', ieRangeEnd );
					ieRange.moveEnd( 'character', -1 );
				} else {
					// The isStartMarkerAlone logic comes from V2. It guarantees that the lines
					// will expand and that the cursor will be blinking on the right place.
					// Actually, we are using this flag just to avoid using this hack in all
					// situations, but just on those needed.
					var next = startNode.getNext( notWhitespaces );
					var inPre = startNode.hasAscendant( 'pre' );
					isStartMarkerAlone = ( !( next && next.getText && next.getText().match( fillerTextRegex ) ) && // already a filler there?
						( inPre || !startNode.hasPrevious() || ( startNode.getPrevious().is && startNode.getPrevious().is( 'br' ) ) ) );

					// Append a temporary <span>&#65279;</span> before the selection.
					// This is needed to avoid IE destroying selections inside empty
					// inline elements, like <b></b> (https://dev.ckeditor.com/ticket/253).
					// It is also needed when placing the selection right after an inline
					// element to avoid the selection moving inside of it.
					dummySpan = range.document.createElement( 'span' );
					dummySpan.setHtml( '&#65279;' ); // Zero Width No-Break Space (U+FEFF). See https://dev.ckeditor.com/ticket/1359.
					dummySpan.insertBefore( startNode );

					if ( isStartMarkerAlone ) {
						// To expand empty blocks or line spaces after <br>, we need
						// instead to have any char, which will be later deleted using the
						// selection.
						// \ufeff = Zero Width No-Break Space (U+FEFF). (https://dev.ckeditor.com/ticket/1359)
						range.document.createText( '\ufeff' ).insertBefore( startNode );
					}
				}

				// Remove the markers (reset the position, because of the changes in the DOM tree).
				range.setStartBefore( startNode );
				startNode.remove();

				if ( collapsed ) {
					if ( isStartMarkerAlone ) {
						// Move the selection start to include the temporary \ufeff.
						ieRange.moveStart( 'character', -1 );

						ieRange.select();

						// Remove our temporary stuff.
						range.document.$.selection.clear();
					} else {
						ieRange.select();
					}

					range.moveToPosition( dummySpan, CKEDITOR.POSITION_BEFORE_START );
					dummySpan.remove();
				} else {
					range.setEndBefore( endNode );
					endNode.remove();
					ieRange.select();
				}
			} else {
				var sel = this.getNative();

				// getNative() returns null if iframe is "display:none" in FF. (https://dev.ckeditor.com/ticket/6577)
				if ( !sel )
					return;

				this.removeAllRanges();

				for ( var i = 0; i < ranges.length; i++ ) {
					// Joining sequential ranges introduced by
					// readonly elements protection.
					if ( i < ranges.length - 1 ) {
						var left = ranges[ i ],
							right = ranges[ i + 1 ],
							between = left.clone();
						between.setStart( left.endContainer, left.endOffset );
						between.setEnd( right.startContainer, right.startOffset );

						// Don't confused by Firefox adjacent multi-ranges
						// introduced by table cells selection.
						if ( !between.collapsed ) {
							between.shrink( CKEDITOR.NODE_ELEMENT, true );
							var ancestor = between.getCommonAncestor(),
								enclosed = between.getEnclosedNode();

							// The following cases has to be considered:
							// 1. <span contenteditable="false">[placeholder]</span>
							// 2. <input contenteditable="false"  type="radio"/> (https://dev.ckeditor.com/ticket/6621)
							if ( ancestor.isReadOnly() || enclosed && enclosed.isReadOnly() ) {
								right.setStart( left.startContainer, left.startOffset );
								ranges.splice( i--, 1 );
								continue;
							}
						}
					}

					range = ranges[ i ];

					var nativeRange = this.document.$.createRange();

					if ( range.collapsed && CKEDITOR.env.webkit && rangeRequiresFix( range ) ) {
						// Append a zero-width space so WebKit will not try to
						// move the selection by itself (https://dev.ckeditor.com/ticket/1272).
						var fillingChar = createFillingCharSequenceNode( this.root );
						range.insertNode( fillingChar );

						next = fillingChar.getNext();

						// If the filling char is followed by a <br>, whithout
						// having something before it, it'll not blink.
						// Let's remove it in this case.
						if ( next && !fillingChar.getPrevious() && next.type == CKEDITOR.NODE_ELEMENT && next.getName() == 'br' ) {
							removeFillingCharSequenceNode( this.root );
							range.moveToPosition( next, CKEDITOR.POSITION_BEFORE_START );
						} else {
							range.moveToPosition( fillingChar, CKEDITOR.POSITION_AFTER_END );
						}
					}

					nativeRange.setStart( range.startContainer.$, range.startOffset );

					try {
						nativeRange.setEnd( range.endContainer.$, range.endOffset );
					} catch ( e ) {
						// There is a bug in Firefox implementation (it would be too easy
						// otherwise). The new start can't be after the end (W3C says it can).
						// So, let's create a new range and collapse it to the desired point.
						if ( e.toString().indexOf( 'NS_ERROR_ILLEGAL_VALUE' ) >= 0 ) {
							range.collapse( 1 );
							nativeRange.setEnd( range.endContainer.$, range.endOffset );
						} else {
							throw e;
						}
					}

					// Select the range.
					sel.addRange( nativeRange );
				}
			}

			this.reset();

			// Fakes the IE DOM event "selectionchange" on editable.
			this.root.fire( 'selectionchange' );
		},

		/**
		 * Makes a "fake selection" of an element.
		 *
		 * A fake selection does not render UI artifacts over the selected
		 * element. Additionally, the browser native selection system is not
		 * aware of the fake selection. In practice, the native selection is
		 * moved to a hidden place where no native selection UI artifacts are
		 * displayed to the user.
		 *
		 * @param {CKEDITOR.dom.element} element The element to be "selected".
		 * @param {String} [ariaLabel] A string to be used by the screen reader to describe the selection.
		 */
		fake: function( element, ariaLabel ) {
			var editor = this.root.editor;

			// Attempt to retrieve aria-label if possible (https://dev.ckeditor.com/ticket/14539).
			if ( ariaLabel === undefined && element.hasAttribute( 'aria-label' ) ) {
				ariaLabel = element.getAttribute( 'aria-label' );
			}

			// Cleanup after previous selection - e.g. remove hidden sel container.
			this.reset();

			hideSelection( editor, ariaLabel );

			// Set this value after executing hiseSelection, because it may
			// cause reset() which overwrites cache.
			var cache = this._.cache;

			// Caches a range than holds the element.
			var range = new CKEDITOR.dom.range( this.root );
			range.setStartBefore( element );
			range.setEndAfter( element );
			cache.ranges = new CKEDITOR.dom.rangeList( range );

			// Put this element in the cache.
			cache.selectedElement = cache.startElement = element;
			cache.type = CKEDITOR.SELECTION_ELEMENT;

			// Properties that will not be available when isFake.
			cache.selectedText = cache.nativeSel = null;

			this.isFake = 1;
			this.rev = nextRev++;

			// Save this selection, so it can be returned by editor.getSelection().
			editor._.fakeSelection = this;

			// Fire selectionchange, just like a normal selection.
			this.root.fire( 'selectionchange' );
		},

		/**
		 * Checks whether selection is placed in hidden element.
		 *
		 * This method is to be used to verify whether fake selection
		 * (see {@link #fake}) is still hidden.
		 *
		 * **Note:** this method should be executed on real selection - e.g.:
		 *
		 *		editor.getSelection( true ).isHidden();
		 *
		 * @returns {Boolean}
		 */
		isHidden: function() {
			var el = this.getCommonAncestor();

			if ( el && el.type == CKEDITOR.NODE_TEXT )
				el = el.getParent();

			return !!( el && el.data( 'cke-hidden-sel' ) );
		},

		/**
		 * Checks if the selection contains an HTML element inside a table.
		 * Returns `false` for text selection inside a table (e.g. it will return `false`
		 * for text selected in one cell).
		 *
		 *		editor.getSelection().isInTable();
		 *
		 * @since 4.7.0
		 * @param {Boolean} [allowPartialSelection=false] Whether a partial cell selection should be included.
		 * Added in 4.7.2.
		 * @returns {Boolean}
		 */
		isInTable: function( allowPartialSelection ) {
			return isTableSelection( this.getRanges(), allowPartialSelection );
		},

		/**
		 * Checks if the selection contains only one range which is collapsed.
		 *
		 *		if ( editor.getSelection().isCollapsed() ) {
		 *			// Do something when the selection is collapsed.
		 *		}
		 *
		 * @since 4.7.3
		 * @returns {Boolean}
		 */
		isCollapsed: function() {
			var ranges = this.getRanges();

			return ranges.length === 1 && ranges[ 0 ].collapsed;
		},

		/**
		 * Creates a bookmark for each range of this selection (from {@link #getRanges})
		 * by calling the {@link CKEDITOR.dom.range#createBookmark} method,
		 * with extra care taken to avoid interference among those ranges. The arguments
		 * received are the same as with the underlying range method.
		 *
		 *		var bookmarks = editor.getSelection().createBookmarks();
		 *
		 * @returns {Array} Array of bookmarks for each range.
		 */
		createBookmarks: function( serializable ) {
			var bookmark = this.getRanges().createBookmarks( serializable );
			this.isFake && ( bookmark.isFake = 1 );
			return bookmark;
		},

		/**
		 * Creates a bookmark for each range of this selection (from {@link #getRanges})
		 * by calling the {@link CKEDITOR.dom.range#createBookmark2} method,
		 * with extra care taken to avoid interference among those ranges. The arguments
		 * received are the same as with the underlying range method.
		 *
		 *		var bookmarks = editor.getSelection().createBookmarks2();
		 *
		 * @returns {Array} Array of bookmarks for each range.
		 */
		createBookmarks2: function( normalized ) {
			var bookmark = this.getRanges().createBookmarks2( normalized );
			this.isFake && ( bookmark.isFake = 1 );
			return bookmark;
		},

		/**
		 * Selects the virtual ranges denoted by the bookmarks by calling {@link #selectRanges}.
		 *
		 *		var bookmarks = editor.getSelection().createBookmarks();
		 *		editor.getSelection().selectBookmarks( bookmarks );
		 *
		 * @param {Array} bookmarks The bookmarks representing ranges to be selected.
		 * @returns {CKEDITOR.dom.selection} This selection object, after the ranges were selected.
		 */
		selectBookmarks: function( bookmarks ) {
			var ranges = [],
				node;

			for ( var i = 0; i < bookmarks.length; i++ ) {
				var range = new CKEDITOR.dom.range( this.root );
				range.moveToBookmark( bookmarks[ i ] );
				ranges.push( range );
			}

			// It may happen that the content change during loading, before selection is set so bookmark leads to text node.
			if ( bookmarks.isFake ) {
				node = isTableSelection( ranges ) ? ranges[ 0 ]._getTableElement() : ranges[ 0 ].getEnclosedNode();

				if ( !node || node.type != CKEDITOR.NODE_ELEMENT ) {
					CKEDITOR.warn( 'selection-not-fake' );
					bookmarks.isFake = 0;
				}
			}

			if ( bookmarks.isFake && !isTableSelection( ranges ) ) {
				this.fake( node );
			} else {
				this.selectRanges( ranges );
			}

			return this;
		},

		/**
		 * Retrieves the common ancestor node of the first range and the last range.
		 *
		 *		var ancestor = editor.getSelection().getCommonAncestor();
		 *
		 * @returns {CKEDITOR.dom.element} The common ancestor of the selection or `null` if selection is empty.
		 */
		getCommonAncestor: function() {
			var ranges = this.getRanges();
			if ( !ranges.length )
				return null;

			var startNode = ranges[ 0 ].startContainer,
				endNode = ranges[ ranges.length - 1 ].endContainer;
			return startNode.getCommonAncestor( endNode );
		},

		/**
		 * Moves the scrollbar to the starting position of the current selection.
		 *
		 *		editor.getSelection().scrollIntoView();
		 */
		scrollIntoView: function() {
			// Scrolls the first range into view.
			if ( this.getType() != CKEDITOR.SELECTION_NONE ) {
				this.getRanges()[ 0 ].scrollIntoView();
			}
		},

		/**
		 * Remove all the selection ranges from the document.
		 */
		removeAllRanges: function() {
			// Don't clear selection outside this selection's root (https://dev.ckeditor.com/ticket/11500).
			if ( this.getType() == CKEDITOR.SELECTION_NONE )
				return;

			var nativ = this.getNative();

			try {
				nativ && nativ[ isMSSelection ? 'empty' : 'removeAllRanges' ]();
			} catch ( er ) {}

			this.reset();
		}
	};

} )();


/**
 * Fired when selection inside editor has been changed. Note that this event
 * is fired only when selection's start element (container of a selecion start)
 * changes, not on every possible selection change. Thanks to that `selectionChange`
 * is fired less frequently, but on every context
 * (the {@link CKEDITOR.editor#elementPath elements path} holding selection's start) change.
 *
 * @event selectionChange
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {CKEDITOR.dom.selection} data.selection
 * @param {CKEDITOR.dom.elementPath} data.path
 */

/**
 * Selection's revision. This value is incremented every time new
 * selection is created or existing one is modified.
 *
 * @since 4.3.0
 * @readonly
 * @property {Number} rev
 */

/**
 * Document in which selection is anchored.
 *
 * @readonly
 * @property {CKEDITOR.dom.document} document
 */

/**
 * Selection's root element.
 *
 * @readonly
 * @property {CKEDITOR.dom.element} root
 */

/**
 * Whether selection is locked (cannot be modified).
 *
 * See {@link #lock} and {@link #unlock} methods.
 *
 * @readonly
 * @property {Boolean} isLocked
 */

/**
 * Whether selection is a fake selection.
 *
 * See {@link #fake} method.
 *
 * @readonly
 * @property {Boolean} isFake
 */
