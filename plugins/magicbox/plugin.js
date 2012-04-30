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

					if ( !isHtml( upper ) || !isHtml( lower ) )
						return;

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

	// Generic, independent methods shared between editors
	function getDistance( a, b ) {
		return 0 | Math.abs( a - b );
	}

	function inRange( val, array ) {
		if ( array[ 0 ] > array[ 1 ] )
			throw "Values in reverse order!";

		CKEDITOR.tools.indexOf

		return ( 1 in array ) && ( val > array[ 0 ] && val < array[ 1 ] );
	}

	function isFloated( element ) {
		if ( !isHtml( element ) )
			return false;

		var options = { 'left':1,'right':1,'center':1 },
			floated = element.getStyle( 'float' ),
			aligned = element.getAttribute( 'align' );

		return !!CKEDITOR.dtd.$block[ element.getName() ] && !!( options[ floated ] || options[ aligned ] );
	}

	function isHtml( node ) {
		return node && node.type === CKEDITOR.NODE_ELEMENT && node.isVisible();
	}

	function mouseFromEvent( event ) {
		return event ? [ event.data.$.clientX, event.data.$.clientY ] : null;
	}

	// Activates the box inside of an editor
	function initMagicBox( editor ) {
		var doc, body, win, magicBox, hiddenMode;

		editor.on( 'contentDom', addListeners );

		function initBoxElement() {
			var triangleCommon = " \
					width: 0px;  \
					height: 0px;  \
					display: block;\
					border-top: 5px solid transparent;  \
					border-bottom: 5px solid transparent;\
					position: absolute;\
					top: -5px;",
				elementsCommon = "\
					padding: 0px;\
					margin: 0px;\
					cursor: pointer;\
					display: block;\
					z-index: 9999;\
					color: #fff;\
				",
				frontColor = '#FF0000';

			magicBox = CKEDITOR.dom.element.createFromHtml( '<p id="magic_box" contenteditable="false" style="' + elementsCommon + '\
					height: 0px;\
					position: relative;\
					" > \
						<span style="\
							' + elementsCommon + '\
							height: 0px;\
							position: relative;\
							top: 0px;\
							border-top: 1px dashed ' + frontColor + ';\
							margin: 0 10px;\
						" class="mb-line"></span>\
						<span style="' + elementsCommon + '\
							background: ' + frontColor + ';\
							height: 15px;\
							width: 15px;\
							position: absolute;\
							right: 15px;\
							top: -7px;\
							font-size: 12px;\
							border-radius: 2px;\
							text-align: center;\
						">&crarr;</span>\
						<span style="' + triangleCommon + '\
							border-left: 5px solid ' + frontColor + ';\
							left: 0px;\
						" class="mb-larr"></span>\
						<span style="' + triangleCommon + '\
							border-right: 5px solid ' + frontColor + ';\
							right: 0px;\
						" class="mb-rarr"></span>\
				</p>', editor.document );
			magicBox.unselectable();

			// Replace a mB with dummy paragraph if clicked.
			// After this, regain caret focus immediately.
			magicBox.on( 'mouseup', function( event ) {
				var boxReplace = new CKEDITOR.dom.element( 'p' ),
					dummyText = new CKEDITOR.dom.text( '\u200b' ),
					range = new CKEDITOR.dom.range( editor.document );

				boxReplace.replace( magicBox );
				dummyText.appendTo( boxReplace );

				range.setStart( dummyText, 0 );
				range.setEnd( dummyText, 1 );
				editor.getSelection().selectRanges( [ range ] );
			});
		}

		function getMidpoint( upper, lower ) {
			var bottom = upper ? getDimensions( upper ).bottom : null,
				top = lower ? getDimensions( lower ).top : null;

			if ( !upper )
				return top;

			if ( !lower )
				return bottom;

			return 0 | ( bottom + top ) / 2
		}

		// Simple irrelevant elements filter:
		// - omits magicBox
		// - omits floated and aligned elements
		function omitIrrelevant( node ) {
			return node && !node.equals( magicBox ) && !magicBox.contains( node ) && !isFloated( node );
		}

		function getDimensions( element ) {
			if ( !element )
				return null;

			var elementTop = element.getDocumentPosition( doc ).y - editor.window.getScrollPosition().y,
				elementHeight = element.$.offsetHeight,
				elementBottom = elementTop + elementHeight,

				elementLeft = element.getDocumentPosition( doc ).x - editor.window.getScrollPosition().x,
				elementWidth = element.$.offsetWidth,
				elementRight = elementLeft + elementWidth;

			return {
				bottom: elementBottom,
				height: elementHeight,
				left: elementLeft,
				right: elementRight,
				top: elementTop,
				width: elementWidth
			};
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

			return ignoreBox && ( element.equals( magicBox ) || magicBox.contains( element ) ) ? magicBox.getParent() : element;
		}

		function getAscendantTrigger( element ) {
			return element ? element.getAscendant( dtdTriggers, true ) || element : null;
		}

		function isTrigger( element ) {
			return isHtml( element ) ? element.getName() in dtdTriggers : null;
		}

		function isNextTrigger( element ) {
			var sibling;
			return ( sibling = element.getNext( omitIrrelevant ) ) && isTrigger( sibling );
		}

		function isPrevTrigger( element ) {
			var sibling;
			return ( sibling = element.getPrevious( omitIrrelevant ) ) && isTrigger( sibling );
		}

		function isFirstChild( element ) {
			return !element.getPrevious( omitIrrelevant );
		}

		function isLastChild( element ) {
			return !element.getNext( omitIrrelevant );
		}

		function areSiblings( upper, lower ) {
			if ( !upper || !lower )
				return false;

			var next;

			return ( next = upper.getNext( omitIrrelevant ) ) && next.equals( lower );
		}

		// This method searches document vertically using given
		// select criterion until stop criterion is fulfilled.
		// TODO: rewrite search procedure into a single loop
		function verticalSearch( event, stopCriterion, selectCriterion ) {
			var mouse = mouseFromEvent( event ),
				element = elementFromMouse( mouse, true ),
				upper = element,
				lower = element,
				centerY = mouse[ 1 ];

			while ( upper && stopCriterion( upper, element ) && --mouse[ 1 ] > 0 )
				upper = selectCriterion( mouse );

			// Go back to the middle location
			mouse[ 1 ] = centerY;

			while ( lower && stopCriterion( lower, element ) && ++mouse[ 1 ] < win.getViewPaneSize().height )
				lower = selectCriterion( mouse );

			return { upper: upper, lower: lower };
		}

		// Checks whether mouseY is around an element by comparing boundaries and considering
		// an offset
		function mouseNearOf( element, event ) {
			if ( !isHtml( element ) )
				return false;

			var dimensions = getDimensions( element ),
				mouse = mouseFromEvent( event );

			// Determine neighborhood by element dimensions and offsets
			if ( inRange( mouse[ 1 ], [
				dimensions.top - 2 * TRIGGER_OFFSET,
				dimensions.bottom + 2 * TRIGGER_OFFSET ] ) && inRange( mouse[ 0 ], [
				dimensions.left - 2 * TRIGGER_OFFSET,
				dimensions.right + 2 * TRIGGER_OFFSET ] ) )
				return true;

			return false;
		}

		// Detects whether an element is below the lower edge of an editor.
		// If so it may scroll to reveal an element.
		function outOfSight( element, doScroll ) {
			if ( !isHtml( element ) )
				return false;

			var dimensions = getDimensions( element ),
				diffBottom = dimensions.bottom - win.getViewPaneSize().height,
				diffTop = dimensions.top,
				doScroll = doScroll || false;

			if ( inRange( diffBottom, [ 1, SIGHT_SCROLL ] ) || inRange( diffTop, [ -SIGHT_SCROLL, -1 ] ) ) {
				doScroll && element.scrollIntoView();
				return true;
			}

			return false;
		}

		// Checks if an element may disappear from the viewport once the box is inserted.
		// It is useful if an element is close to the lower edge of an editor and may
		// cause box flickering.
		function mayDisappear( element ) {
			if ( !isHtml( element ) )
				return false;

			var dimensions = getDimensions( element ),
				winHeight = win.getViewPaneSize().height;

			return getDistance( dimensions.top, winHeight ) < 2 * TRIGGER_OFFSET;
		}

		// Checks if the pointer is in the upper or the lower area of a trigger.
		function edgeTrigger( event ) {
			var mouse = mouseFromEvent( event ),
				element = getAscendantTrigger( elementFromMouse( mouse, true ) );

			if ( !element )
				return;

			var dimensions = getDimensions( element );

			if ( inRange( mouse[ 1 ], [ dimensions.top, dimensions.top + TRIGGER_OFFSET ] ) )
				return { upper: element.getPrevious( omitIrrelevant ), lower: element, edge: EDGE_TOP, type: TYPE_EDGE };

			else if ( inRange( mouse[ 1 ], [ dimensions.bottom - TRIGGER_OFFSET, dimensions.bottom ] ) )
				return { upper: element, lower: element.getNext( omitIrrelevant ), edge: EDGE_BOTTOM, type: TYPE_EDGE };

			return false;
		}

		// Checks iteratively up and down in search for elements using elementFromMouse method.
		// Useful if in between of the triggers.
		function expandTrigger( event ) {
			var mouse = mouseFromEvent( event ),
				yAxis = verticalSearch( event, function( current, element ) {
					return current.equals( element );
				}, function( mouse ) {
					return getAscendantTrigger( elementFromMouse( mouse, true ) );
				});

			// POST-PROCESSING: Traverse DOM towards lower if elements aren't siblings.
			// WARNING: possible performance-killer
			if ( yAxis.lower && yAxis.upper && !areSiblings( yAxis.upper, yAxis.lower ) ) {
				var upper = yAxis.upper,
					upperDimensions = getDimensions( upper ),
					minDistance = Number.MAX_VALUE,
					currentDistance, minElement;

				while ( upper && !yAxis.lower.equals( upper ) && upperDimensions.bottom < mouse[ 1 ] ) {
					upper = upper.getNext( omitIrrelevant );
					upperDimensions = getDimensions( upper );

					if ( !isTrigger( upper ) )
						continue;

					currentDistance = getDistance( getMidpoint( upper, upper.getNext( omitIrrelevant ) ), mouse[ 1 ] );

					( currentDistance < minDistance ) && ( minDistance = currentDistance ) && ( minElement = upper );
				}

				if ( minElement )
				( yAxis.upper = minElement ) && ( yAxis.lower = yAxis.upper.getNext( omitIrrelevant ) );
			}

			// // Mouse position broken the loop, no trigger then
			// if ( !elements.upper || !elements.lower )
			// 	return false;

			return CKEDITOR.tools.extend( yAxis, {
				edge: EDGE_BOTTOM,
				type: TYPE_EXPAND
			});
		}

		// A method for trigger filtering. Accepts or rejects trigger pairs
		// by their location in DOM etc.
		// TODO: This method is to be rewritten to reduce redundant conditions.
		// Until then it is ugly but easy to read.
		function triggerFilter( trigger ) {
			var upper = getAscendantTrigger( trigger.upper ),
				lower = getAscendantTrigger( trigger.lower ),
				edge = trigger.edge;

			// NOT: lower element is about to leave viewport if box is inserted
			if ( lower && mayDisappear( lower ) )
				return false;

			// NOT: one of the elements is floated
			if ( isFloated( lower ) || isFloated( upper ) )
				return false;

			// NOT: two trigger elements, one equals another
			if ( lower && upper && ( lower.equals( upper ) || upper.equals( lower ) ) )
				return false;

			// NOT: two trigger elements, one contains another
			if ( lower && upper && ( lower.contains( upper ) || upper.contains( lower ) ) )
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
			var hideTimeout, showTimeout, trigger, element, mouseY, mouseX;

			doc = editor.editable().getDocument(), body = doc.getBody(), win = editor.window;

			initBoxElement();

			// Let's handle mousemove event for mB on/off toggle
			doc.on( 'mousemove', function( event ) {
				DEBUG.startTimer();
				clearTimeout( showTimeout );

				// Don't do anything if:
				if ( mouseNearOf( magicBox, event ) // 	-> Mouse pointer close to the box
				|| !( element = elementFromMouse( event, true ) ) // 	-> There's no valid element under mouse pointer
				|| editor.mode !== 'wysiwyg' // 	-> Not in WYSIWYG mode (e.g. source mode)
				|| hiddenMode // 	-> Hidden mode is active (shift is pressed)
				|| !editor.focusManager.hasFocus ) // 	-> Editor has no focus
				return;

				trigger = false;

				// If trigger exists, and trigger is correct -> show the box
				if ( ( trigger = edgeTrigger( event ) || expandTrigger( event ) ) && triggerFilter( trigger ) ) {
					if ( trigger.edge === EDGE_TOP )
						magicBox.insertBefore( trigger.lower )
					else
						magicBox.insertAfter( trigger.upper )

					// Scroll document if box at the very end of the document
					if ( magicBox.getParent().equals( editor.editable() ) && isLastChild( magicBox ) )
						outOfSight( magicBox, true );
				}

				// Otherwise remove the box
				else
					magicBox.remove();

				DEBUG.stopTimer();
				DEBUG.showTrigger( trigger );
				DEBUG.mousePos( mouseFromEvent( event )[ 1 ], element );
			});

			// Hide mB on mouseout if mouse leaves document
			doc.on( 'mouseout', function( event ) {
				clearTimeout( showTimeout );
				clearTimeout( hideTimeout );

				var dest = new CKEDITOR.dom.element( event.data.$.relatedTarget || event.data.$.toElement );

				hideTimeout = setTimeout( function() {
					( !dest.$ || dest.getName() === 'html' ) && magicBox.remove();
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

		// CKEDITOR.addCss('\
		// 	#tup { outline: #FEB2B2 solid 1px; } \
		// 	#tbo { outline: #B2FEB2 solid 1px; } \
		// ');
	};

	CKEDITOR.plugins.add( 'magicbox', {
		init: function( editor ) {
			initMagicBox( editor );
		}
	});

})();
