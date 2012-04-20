/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/'use strict';

(function() {
	var dtdTriggers = { table:1,hr:1,div:1,ul:1,ol:1,dl:1 },
		dtdLists = CKEDITOR.dtd.$list,
		dtdListItem = CKEDITOR.dtd.$listItem,

		EDGE_TOP = 1,
		EDGE_BOTTOM = 2,
		TRIGGER_OFFSET = 15,
		TYPE_EDGE = 1,
		TYPE_EXPAND = 2,
		SIGHT_SCROLL = 50,

		// Pure debug. Dev-only.
		DEBUG = {
			startTimer: function() {
				DEBUG.time = new Date().getTime();
			},

			stopTimer: (function( text ) {
				var label = CKEDITOR.document.getById( 'time' );

				return function( text ) {
					text = text || new Date().getTime() - DEBUG.time + ' ms';
					label.setText( text )
				}

			})(),

			mousePos: (function( y, element ) {
				var my = CKEDITOR.document.getById( 'my' ),
					over = CKEDITOR.document.getById( 'over' );

				return function( y, element ) {
					my.setText( y );
					over.setText( element.getName() + ', class=' + element.getAttribute( 'class' ) );
				}
			})(),

			showTrigger: (function( trigger ) {
				var tr_type = CKEDITOR.document.getById( 'tr_type' ),
					tr_upper = CKEDITOR.document.getById( 'tr_upper' ),
					tr_lower = CKEDITOR.document.getById( 'tr_lower' ),
					tr_edge = CKEDITOR.document.getById( 'tr_edge' ),
					tup, tbo, upper, lower;

				return function( trigger ) {
					upper = trigger.upper, lower = trigger.lower;

					tup && tup.removeAttribute( 'id' ) && ( tup = null );
					tbo && tbo.removeAttribute( 'id' ) && ( tbo = null );

					if ( !trigger )
						return tr_type.setText( '-' ) && tr_upper.setText( '-' ) && tr_lower.setText( '-' ) && tr_edge.setText( '-' );

					tr_type.setText( trigger.type === TYPE_EXPAND ? 'EXPAND' : 'EDGE' );
					tr_upper.setText( upper ? upper.getName() + ', class=' + upper.getAttribute( 'class' ) : 'NULL' );
					tr_lower.setText( lower ? lower.getName() + ', class=' + lower.getAttribute( 'class' ) : 'NULL' );
					tr_edge.setText( trigger.edge ? trigger.edge === EDGE_TOP ? 'EDGE_TOP' : 'EDGE_BOTTOM' : 'NULL' );

					upper && ( tup = upper ) && tup.setAttribute( 'id', 'tup' );
					lower && ( tbo = lower ) && tbo.setAttribute( 'id', 'tbo' );
				}
			})(),

			showHidden: (function( state ) {
				var cnt = CKEDITOR.document.getById( 'hid' );

				return function( state ) {
					cnt[ state ? 'addClass' : 'removeClass' ]( 'hl' );
					cnt.setText( state ? 'enabled' : 'disabled' );
				}
			})()
		};

	function initMagicBox( editor ) {
		var doc, body, win, magicBox, hiddenMode;

		editor.on( 'contentDom', addListeners );

		function initBoxElement() {
			magicBox = CKEDITOR.dom.element.createFromHtml( '<p id="magic_box" contenteditable="false" style="\
					display: block; \
					color: #000; \
					padding: 0px 0px 0px 5px;\
					text-shadow: 0 -1px 0 #fff;\
					overflow: hidden; \
					background : #D1EFFF; \
					border: 1px dashed #B6DBF0;\
					border-radius : 3px; \
					cursor: pointer; \
					text-align: center; \
					font-size: 12px;">&#9998; Click to type here. Hold SHIFT to hide.</p>', editor.document );
			magicBox.unselectable();

			// Replace a mB with dummy paragraph if clicked.
			// After this, regain caret focus immediately.
			magicBox.on( 'mouseup', function( event ) {
				var boxReplace = new CKEDITOR.dom.element( 'p' ),
					range = new CKEDITOR.dom.range( editor.document );

				boxReplace.setText( '\u200b' );
				boxReplace.replace( magicBox );

				range.setStartBefore( boxReplace );
				range.collapse( true );
				editor.getSelection().selectRanges( [ range ] );
			});
		}

		function getDistance( a, b ) {
			return 0 | Math.abs( a - b );
		}

		// Determine whether a node is HTML element and NOT magic_box
		function notMb( node ) {
			return node.type === CKEDITOR.NODE_ELEMENT && node.getId() !== 'magic_box';
		}

		function isHtml( node ) {
			return node.type === CKEDITOR.NODE_ELEMENT;
		}

		function inRange( val, array ) {
			if ( array[ 0 ] > array[ 1 ] )
				throw "Values in reverse order!";

			return ( 1 in array ) && ( val > array[ 0 ] && val < array[ 1 ] );
		}

		function getDimensions( element ) {
			if ( !element )
				return null;

			var elementTop = element.getDocumentPosition( doc ).y - editor.window.getScrollPosition().y,
				elementHeight = element.$.offsetHeight,
				elementBottom = elementTop + elementHeight;

			return { top: elementTop, height: elementHeight, bottom: elementBottom };
		}

		function elementFromMouse( mouse, ignoreBox ) {
			if ( !mouse )
				return null;

			var x, y, over, element;

			ignoreBox = ignoreBox || false;

			if ( CKEDITOR.tools.isArray( mouse ) ) {
				x = mouse[ 0 ];
				y = mouse[ 1 ];
			} else {
				x = mouse.data.$.clientX;
				y = mouse.data.$.clientY;
			}

			over = doc.$.elementFromPoint( x, y );

			if ( !over )
				return null;

			element = new CKEDITOR.dom.element( over );

			return ignoreBox && element.equals( magicBox ) ? element.getParent() : element;
		}

		function getAscendantTrigger( element ) {
			return element ? element.getAscendant( dtdTriggers, true ) : null;
		}

		function isTrigger( element ) {
			return element ? element.getName() in dtdTriggers : null;
		}

		function isNextTrigger( element ) {
			var sibling;
			return ( sibling = element.getNext( notMb ) ) && isTrigger( sibling );
		}

		function isPrevTrigger( element ) {
			var sibling;
			return ( sibling = element.getPrevious( notMb ) ) && isTrigger( sibling );
		}

		function isFirstChild( element ) {
			return !element.getPrevious( notMb );
		}

		function isLastChild( element ) {
			return !element.getNext( notMb );
		}

		function areSiblings( upper, lower ) {
			var next;

			if ( !upper || !lower )
				return null;

			return ( next = upper.getNext( notMb ) ) && next.equals( lower );
		}

		// Checks whether mouseY is around an element by comparing boundaries and considering
		// an offset
		function mouseNearOf( element, mouse ) {
			if ( !element.isVisible() )
				return false;

			var dimensions = getDimensions( element ),
				centerY = mouse[ 1 ],
				startElement = elementFromMouse( mouse ),
				mouseElement = mouseElement;

			if ( inRange( mouse[ 1 ], [ dimensions.top - 2 * TRIGGER_OFFSET, dimensions.bottom + 2 * TRIGGER_OFFSET ] ) )
				return true;

			// TODO: to be integrated with expandTrigger procedure
			while ( mouseElement && mouseElement.equals( startElement ) && --mouse[ 1 ] > 0 ) {
				mouseElement = elementFromMouse( mouse );

				if ( mouseElement.equals( element ) )
					return true;
			}

			mouse[ 1 ] = centerY;
			mouseElement = startElement;

			// TODO: to be integrated with expandTrigger procedure
			while ( mouseElement && mouseElement.equals( startElement ) && ++mouse[ 1 ] < win.getViewPaneSize().height ) {
				mouseElement = elementFromMouse( mouse );

				if ( mouseElement.equals( element ) )
					return true;
			}

			return false;
		}

		// Detects whether an element is below the lower
		// edge of an editor. If so it may scroll to reveal an element.
		function outOfSight( element, scroll ) {
			var dimensions = getDimensions( element ),
				diffBottom = dimensions.bottom - win.getViewPaneSize().height,
				diffTop = dimensions.top;

			if ( inRange( diffBottom, [ 1, SIGHT_SCROLL ] ) || inRange( diffTop, [ -SIGHT_SCROLL, -1 ] ) ) {
				scroll && element.scrollIntoView();
				return true;
			}

			return false;
		}

		// Checks if the pointer is in the upper or the lower area of a trigger.
		function edgeTrigger( element, mouseY ) {
			if ( !( element = getAscendantTrigger( element ) ) )
				return;

			var dimensions = getDimensions( element );

			if ( inRange( mouseY, [ dimensions.top, dimensions.top + TRIGGER_OFFSET ] ) )
				return { upper: element.getPrevious( notMb ), lower: element, edge: EDGE_TOP, type: TYPE_EDGE };

			else if ( inRange( mouseY, [ dimensions.bottom - TRIGGER_OFFSET, dimensions.bottom ] ) )
				return { upper: element, lower: element.getNext( notMb ), edge: EDGE_BOTTOM, type: TYPE_EDGE };

			return false;
		}

		// Checks iteratively up and down in search for elements using elementFromMouse method.
		// Useful if in between of the triggers.
		// TODO: rewrite search procedure into single loop
		function expandTrigger( element, mouse ) {
			var upper = element,
				lower = element,
				centerY = mouse[ 1 ],
				mouseElement;

			while ( upper && upper.equals( element ) && --mouse[ 1 ] > 0 )
				upper = getAscendantTrigger( mouseElement = elementFromMouse( mouse, true ) ) || mouseElement; // find an ascendant trigger under mouse; if there's no such trigger,
			// use an element under mouse
			// Go back to the middle location
			mouse[ 1 ] = centerY;

			while ( lower && lower.equals( element ) && ++mouse[ 1 ] < win.getViewPaneSize().height )
				lower = getAscendantTrigger( mouseElement = elementFromMouse( mouse, true ) ) || mouseElement;

			// Mouse position broken the loop, no trigger then
			if ( !upper || !lower || upper.equals( element ) || lower.equals( element ) )
				return false;

			upper = getAscendantTrigger( upper );
			lower = getAscendantTrigger( lower );

			return { upper: upper, lower: lower, edge: EDGE_BOTTOM, type: TYPE_EXPAND };
		}

		// A method for trigger filtering. Accepts or rejects trigger pairs
		// by their location in DOM etc.
		// TODO: This method is to be rewritten to reduce reduntant conditions.
		// Until then it is ugly but easy to read.
		function triggerFilter( trigger ) {
			var upper = trigger.upper,
				lower = trigger.lower,
				edge = trigger.edge;

			// NOT: two trigger elements, one contains another
			if ( lower && upper && ( lower.contains( upper ) || upper.contains( lower ) ) )
				return false;

			// NOT: two trigger elements, one equals another
			if ( lower && upper && ( lower.equals( upper ) || upper.equals( lower ) ) )
				return false;

			// YES: two trigger elements, pure siblings
			if ( isTrigger( upper ) && isTrigger( lower ) && areSiblings( upper, lower ) )
				return true;

			if ( edge === EDGE_TOP && isTrigger( lower ) ) {
				// NOT: signle trigger element, a child of li/dt/dd
				if ( lower.getParent().getName() in dtdListItem )
					return false;

				// YES: single trigger element, first child
				if ( isFirstChild( lower ) )
					return true;
			}

			if ( edge === EDGE_BOTTOM && isTrigger( upper ) ) {
				// NOT: signle trigger element, a child of li/dt/dd
				if ( upper.getParent().getName() in dtdListItem )
					return false;

				// YES: single trigger element, last child
				if ( isLastChild( upper ) )
					return true;
			}

			return false;
		}

		function addListeners() {
			var hideTimeout, trigger, element, mouseY, mouseX;

			doc = editor.editable().getDocument(), body = doc.getBody(), win = editor.window;

			initBoxElement();

			// Let's handle mousemove event for mB on/off toggle
			doc.on( 'mousemove', function( event ) {
				if ( !( element = elementFromMouse( event, true ) ) || editor.mode !== 'wysiwyg' || hiddenMode || !editor.focusManager.hasFocus )
					return;

				DEBUG.startTimer();
				trigger = false;

				mouseX = event.data.$.clientX, mouseY = event.data.$.clientY;

				// If around magicBox -> don't do anything
				if ( mouseNearOf( magicBox, [ mouseX, mouseY ] ) )
					return;

				// If trigger, and trigger is correct -> show the box
				else if ( ( trigger = edgeTrigger( element, mouseY ) || expandTrigger( element, [ mouseX, mouseY ] ) ) && triggerFilter( trigger ) ) {
					magicBox[ trigger.edge === EDGE_TOP ? 'insertBefore' : 'insertAfter' ]
					( trigger.edge === EDGE_TOP ? trigger.lower : trigger.upper );

					outOfSight( magicBox, true );
				}

				// Otherwise remove the box
				else
					magicBox.remove();

				DEBUG.stopTimer();
				DEBUG.showTrigger( trigger );
				DEBUG.mousePos( mouseY, element );
			});

			// Hide mB on mouseout
			doc.on( 'mouseout', function( event ) {
				clearTimeout( hideTimeout );

				hideTimeout = setTimeout( function() {
					!event.data.$.relatedTarget && magicBox.remove();
				}, 250 );
			});

			doc.on( 'keyup', function( event ) {
				event.data.$.keyCode === 16 && ( hiddenMode = !hiddenMode );
				DEBUG.showHidden( hiddenMode );
			});

			doc.on( 'keydown', function( event ) {
				( hiddenMode = ( event.data.$.keyCode === 16 || event.data.$.shiftKey ) ) && magicBox.remove();
				DEBUG.showHidden( hiddenMode );
			});
		}

		CKEDITOR.addCss( '\
			#tup { outline: #FEB2B2 solid thick; } \
			#tbo { outline: #B2FEB2 solid thick; } \
		' );
	};

	CKEDITOR.plugins.add( 'magicbox', {
		init: function( editor ) {
			initMagicBox( editor );
		}
	});

})();
