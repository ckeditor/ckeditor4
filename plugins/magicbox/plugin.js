/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Allows accessing difficult focus spaces with either
 *		mouse and keyboard.
 */

'use strict';

(function() {
	var dtdTriggers = { table:1,hr:1,div:1,ul:1,ol:1,dl:1 },
		dtdLists = CKEDITOR.dtd.$list,
		dtdListItem = CKEDITOR.dtd.$listItem,
		dtdTableContent = CKEDITOR.dtd.$tableContent,

		EDGE_TOP = 1,
		EDGE_BOTTOM = 2,
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
					tup && tup.removeAttribute( 'id' ) && ( tup = null );
					tbo && tbo.removeAttribute( 'id' ) && ( tbo = null );

					if ( !trigger )
						return tr_type.setText( '-' ) && tr_upper.setText( '-' ) && tr_lower.setText( '-' ) && tr_edge.setText( '-' );

					upper = trigger.upper, lower = trigger.lower;

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
			})(),

			logElements: function( elements, labels ) {
				var log = {};

				for ( var i = 0; i < elements.length; i++ )
					log[ labels ? labels[ i ] : i ] = {
					name: elements[ i ].getName(),
					class: elements[ i ].getAttribute( 'class' )
				}

				console.log( JSON.stringify( log ) );
			}

		};

	CKEDITOR.addCss( '\
		#tup { outline: #FEB2B2 solid 2px; box-shadow: 3px 3px 0 #FEB2B2; } \
		#tbo { outline: #B2FEB2 solid 2px; box-shadow: 3px 3px 0 #B2FEB2; } \
	' );

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

	function isTrigger( element ) {
		return isHtml( element ) ? element.getName() in dtdTriggers : null;
	}

	function mouseFromEvent( event ) {
		return event ? [ event.data.$.clientX, event.data.$.clientY ] : null;
	}

	function getAscendantTrigger( element ) {
		return element ? element.getAscendant( dtdTriggers, true ) : null;
	}

	// Gets closest:
	// 	-> Parent table for table element
	// 	-> Parent list for list element
	function getIndependentParent( element ) {
		var name = element.getName();

		if ( !!dtdListItem[ name ] )
			return element.getAscendant( dtdLists );

		if ( !!dtdTableContent[ name ] )
			return element.getAscendant( { table:1 } );

		return null;
	}

	// Activates the box inside of an editor
	function initMagicBox( editor ) {
		// "Configurables"
		var TRIGGER_OFFSET = editor.config.magicbox_triggerOffset || 10,
			KEYSTROKE_BEFORE = editor.config.magicbox_keystrokeBefore || CKEDITOR.CTRL + CKEDITOR.SHIFT + 219,
			// CTRL + SHIFT + [
			KEYSTROKE_AFTER = editor.config.magicbox_keystrokeAfter || CKEDITOR.CTRL + CKEDITOR.SHIFT + 221,
			// CTRL + SHIFT + ]

			body, doc, editable, win, magicBox, hiddenMode;

		// Run event listeners as soon as content DOM is ready.
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

			magicBox = CKEDITOR.dom.element.createFromHtml( '<p id="magic_box" contenteditable="false" style="' + elementsCommon + 'height: 0px; position: relative;" > \
					<span style="' + elementsCommon + 'height: 0px; position: relative; top: 0px; border-top: 1px dashed ' + frontColor + '; margin: 0 10px;"></span>\
					<span style="' + elementsCommon + 'background: ' + frontColor + '; height: 15px; width: 15px; position: absolute; right: 15px; top: -7px; font-size: 12px; border-radius: 2px; text-align: center;">&crarr;</span>\
					<span style="' + triangleCommon + 'border-left: 5px solid ' + frontColor + '; left: 0px; "></span>\
					<span style="' + triangleCommon + 'border-right: 5px solid ' + frontColor + '; right: 0px;"></span>\
				</p>', doc );

			magicBox.fillSpace = CKEDITOR.dom.element.createFromHtml( '<span style="' + elementsCommon + 'position: absolute; left: 0px; right: 0px; top: -5px; height: 10px;"></span>' );
			magicBox.fillSpace.appendTo( magicBox );
			magicBox.unselectable();

			magicBox.on( 'mouseup', function( event ) {
				insertParagraph( function( paragraph ) {
					paragraph.replace( magicBox );
				});

				event.data.preventDefault( true );
			});

			// Prevents IE9 from displaying the resize box and disables
			// drag'n'drop functionality.
			magicBox.on( 'mousedown', function( event ) {
				event.data.preventDefault( true );
			});

			magicBox.positionBox = function( trigger ) {

			}
		}

		// 1. Creates new paragraph filled with dummy, non-breaking space.
		// 2. Inserts the paragraph according to insertFunction.
		// 3. Selects the non-breaking space making the paragraph ready for typing.
		function insertParagraph( insertFunction ) {
			var paragraph = new CKEDITOR.dom.element( 'p' ),
				range = new CKEDITOR.dom.range( doc ),
				dummy = doc.createText( '\u200B' );

			insertFunction( paragraph );
			dummy.appendTo( paragraph );
			range.moveToPosition( dummy, CKEDITOR.POSITION_AFTER_START );
			editor.getSelection().selectRanges( [ range ] );
		}

		function getMidpoint( upper, lower ) {
			var upperDims = getDimensions( upper ),
				lowerDims = getDimensions( lower ),

				bottom = upperDims ? upperDims.bottom : null,
				top = lowerDims ? lowerDims.top : null;

			return upper && lower ? 0 | ( bottom + top ) / 2 : top | bottom;
		}

		function isBox( node ) {
			return node.equals( magicBox ) || magicBox.contains( node );
		}

		// Simple irrelevant elements filter:
		// 	-> omits magicBox
		// 	-> omits floated and aligned elements
		function omitIrrelevant( node ) {
			return isHtml( node ) // 	-> Node must be an existing HTML element
			&& !isBox( node ) // 	-> Ignore magicBox
			&& !isFloated( node ); // 	-> Ignore floated elements
		}

		function getDimensions( element ) {
			if ( !isHtml( element ) )
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

			// An array of [ x, y ]
			if ( CKEDITOR.tools.isArray( mouse ) ) {
				x = mouse[ 0 ];
				y = mouse[ 1 ];
			}
			// A mouse event
			else {
				x = mouse.data.$.clientX;
				y = mouse.data.$.clientY;
			}

			element = new CKEDITOR.dom.element( doc.$.elementFromPoint( x, y ) );

			if ( !isHtml( element ) )
				return null;

			return ignoreBox && isBox( element ) ? magicBox.getParent() : element;
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
			if ( !isHtml( upper ) || !isHtml( upper ) )
				return false;

			var next;

			return ( next = upper.getNext( omitIrrelevant ) ) && next.equals( lower );
		}

		// Checks whether mouseY is around an element by comparing boundaries and considering
		// an offset distance
		function mouseNearOf( element, event, offset ) {
			if ( !isHtml( element ) )
				return false;

			var dimensions = getDimensions( element ),
				mouse = mouseFromEvent( event );

			// Determine neighborhood by element dimensions and offsets
			if ( inRange( mouse[ 1 ], [ dimensions.top - offset, dimensions.bottom + offset ] ) && inRange( mouse[ 0 ], [ dimensions.left - offset, dimensions.right + offset ] ) )
				return true;

			return false;
		}

		// Detects whether an element is *slightly* below the lower edge (above the upper one) of an editor.
		// If so it, scroll to reveal an element.
		function croppedByViewport( element, doScroll ) {
			if ( !isHtml( element ) )
				return false;

			var dimensions = getDimensions( element ),
				diffBottom = dimensions.bottom - win.getViewPaneSize().height,
				diffTop = dimensions.top,
				doScroll = doScroll || false;

			if ( inRange( diffTop, [ -SIGHT_SCROLL, -1 ] ) || inRange( diffBottom, [ -1, SIGHT_SCROLL ] ) ) {
				if ( doScroll )
					element.scrollIntoView();

				return true;
			}

			return false;
		}

		// Determines whether an element if above (or below) of the viewport area
		// to ensure that it's accessible with elementFromPoint.
		function outOfViewport( element ) {
			var dimensions = getDimensions( element );

			return dimensions.top > win.getViewPaneSize().height || dimensions.bottom < 0;
		}

		// Inserts new paragraph on demand by looking for closest parent trigger
		// or using current element under the caret as reference.
		function keyboardInsertion( insertAfter, event ) {
			var selection = editor.getSelection(),
				selected = selection.getStartElement(),
				range = selection.getRanges()[ 0 ],
				target = getAscendantTrigger( selected ) || selected;

			if ( !isHtml( target ) )
				return;

			insertParagraph( function( paragraph ) {
				if ( target.equals( editable ) )
					range.insertNode( paragraph );
				else
					paragraph[ insertAfter ? 'insertAfter' : 'insertBefore' ]( target );
			});

			magicBox.remove();

			event.data.preventDefault( true );
		}

		// Checks if the pointer is in the upper or the lower area of a trigger.
		function edgeTrigger( event ) {
			var mouse = mouseFromEvent( event ),
				element = getAscendantTrigger( elementFromMouse( mouse, true ) );

			if ( !element )
				return;

			var dimensions = getDimensions( element );

			if ( inRange( mouse[ 1 ], [ dimensions.top, dimensions.top + TRIGGER_OFFSET ] ) )
				return { upper: element.getPrevious(), lower: element, edge: EDGE_TOP, type: TYPE_EDGE };

			else if ( inRange( mouse[ 1 ], [ dimensions.bottom - TRIGGER_OFFSET, dimensions.bottom ] ) )
				return { upper: element, lower: element.getNext(), edge: EDGE_BOTTOM, type: TYPE_EDGE };

			return false;
		}

		// This method searches document vertically using given
		// select criterion until stop criterion is fulfilled.
		// TODO: rewrite search procedure into a single loop
		function verticalSearch( event, continueCriterion, selectCriterion, startElement ) {
			var mouse = mouseFromEvent( event ),
				upper = startElement,
				lower = startElement,
				centerY = mouse[ 1 ];

			while ( continueCriterion( upper, startElement ) && --mouse[ 1 ] > 0 )
				upper = selectCriterion( mouse );

			// Go back to the middle location
			mouse[ 1 ] = centerY;

			while ( continueCriterion( lower, startElement ) && ++mouse[ 1 ] < win.getViewPaneSize().height )
				lower = selectCriterion( mouse );

			return { upper: upper, lower: lower };
		}

		// Checks iteratively up and down in search for elements using elementFromMouse method.
		// Useful if in between of the triggers.
		function expandTrigger( event ) {
			var mouse = mouseFromEvent( event ),
				startElement = elementFromMouse( mouse, true ),

				trigger = verticalSearch( event,

				function( current, startElement ) {
					return startElement.equals( current );
				}, function( mouse ) {
					return elementFromMouse( mouse, true );
				}, startElement ),

				upper = trigger.upper,
				lower = trigger.lower;

			if ( upper && lower ) {
				// Success: two siblings have been found
				if ( areSiblings( upper, lower ) )
					return CKEDITOR.tools.extend( trigger, {
					edge: EDGE_BOTTOM,
					type: TYPE_EXPAND
				});

				// Failure: upper cannot be lower
				if ( upper.equals( lower ) )
					return null;
			}

			// Danger. Dragons ahead.
			// No siblings have been found during previous phase, post-processing may be necessary.
			// We can traverse DOM until a valid pair of elements around the pointer is found.
			//
			// Prepare for post-processing:
			// 	1. Determine if upper and lower are children of startElement
			//		1.1. If so, find their ascendants that are closest to startElement (one level deeper than startElement)
			//		1.2. Otherwise use first/last-child of the startElement as upper/lower. Why?:
			//			a) 	upper/lower belongs to another branch of the DOM tree
			//			b) 	verticalSearch encountered an edge of the viewport and failed
			// 		1.3. Make sure upper and lower still exist. Why?:
			//			a) 	Upper and lower may be not belong to the branch of the startElement (may not exist at all) and
			//				startElement has no children
			//	2. Perform the post-processing
			//		2.1. Make sure upper isn't a text node since we need to find its dimensions. Find next HTML element.
			//		2.2. Abort if there's no such element. Why?:
			//			a) 	startElement may contain text nodes only
			//		2.3. Gather dimensions of an upper element
			//		2.4. Abort if lower edge of upper is already under the mouse pointer. Why?:
			//			a) 	We expect upper to be above and lower below the mouse pointer.

			if ( !upper || startElement.contains( upper ) )
				while ( !upper.getParent().equals( startElement ) )
				upper = upper.getParent();
			else
				upper = startElement.getFirst();

			if ( !lower || startElement.contains( lower ) )
				while ( !lower.getParent().equals( startElement ) )
				lower = lower.getParent();
			else
				lower = startElement.getLast();

			// Just in case startElement has no children
			if ( !upper || !lower )
				return null;

			// Just in case upper was a text node.
			// We need HTML node because dimensions are required.
			if ( !isHtml( upper ) ) {
				if ( !( upper = upper.getNext( omitIrrelevant ) ) )
					return null;
			}

			// Do post-processing.
			var upperDimensions = getDimensions( upper ),
				minDistance = Number.MAX_VALUE,
				currentDistance, upperNext, minElement, minElementNext;

			// Failure: In that case post-processing is pointless since we don't
			// need to search below the pointer.
			if ( upperDimensions.bottom > mouse[ 1 ] )
				return null;

			while ( !trigger.lower.equals( upper ) ) {
				if ( !( upperNext = upper.getNext( omitIrrelevant ) ) )
					break;

				currentDistance = getDistance( getMidpoint( upper, upperNext ), mouse[ 1 ] );

				if ( currentDistance < minDistance ) {
					minDistance = currentDistance;
					minElement = upper;
					minElementNext = upperNext;
				}

				upper = upperNext;
				upperDimensions = getDimensions( upper );
			}

			// DEBUG.logElements( [ startElement, upper, lower ], [ 'start', 'upper', 'lower' ] );
			// DEBUG.logElements( [ minElement, minElementNext ], [ 'min', 'minNext' ] );

			// Failure: This trigger must return two elements
			if ( !minElement || !minElementNext )
				return null;

			// An element of minimal distance has been found.
			// Assign it to the trigger.
			trigger.upper = minElement;
			trigger.lower = minElementNext;

			// Success: post-processing revealed a pair of elements
			return CKEDITOR.tools.extend( trigger, {
				edge: EDGE_BOTTOM,
				type: TYPE_EXPAND
			});
		}

		// A method for trigger filtering. Accepts or rejects trigger pairs
		// by their location in DOM etc.
		// TODO: This method is to be rewritten to reduce redundant conditions.
		// Until then it is ugly but easy to read.
		function triggerFilter( trigger ) {
			// var upper = getAscendantTrigger( trigger.upper ),
			// 	lower = getAscendantTrigger( trigger.lower ),
			var upper = trigger.upper,
				lower = trigger.lower,
				edge = trigger.edge,
				type = trigger.type;

			// NOT: one of the elements is floated
			if ( isFloated( lower ) || isFloated( upper ) )
				return false;

			// NOT: two trigger elements, one equals another
			if ( lower && upper && ( lower.equals( upper ) || upper.equals( lower ) ) )
				return false;

			// NOT: two trigger elements, one contains another
			if ( lower && upper && isHtml( lower ) && isHtml( upper ) && ( lower.contains( upper ) || upper.contains( lower ) ) )
				return false;

			// NOT: expand trigger ALWAYS has two elements
			if ( type === TYPE_EXPAND && ( !upper || !lower ) )
				return false;

			// YES: two trigger elements, pure siblings
			if ( isTrigger( upper ) && isTrigger( lower ) && areSiblings( upper, lower ) )
				return true;

			// First/last child cases for EDGE trigger only
			if ( type === TYPE_EDGE ) {
				if ( edge === EDGE_TOP && !upper && isTrigger( lower ) ) {
					// NOT: signle trigger element, a child of li/dt/dd
					if ( lower.getParent().getName() in dtdListItem )
						return false;

					// YES: single trigger element, first child
					if ( isFirstChild( lower ) )
						return true;
				}

				if ( edge === EDGE_BOTTOM && isTrigger( upper ) && !lower ) {
					// NOT: signle trigger element, a child of li/dt/dd
					if ( upper.getParent().getName() in dtdListItem )
						return false;

					// YES: single trigger element, last child
					if ( isLastChild( upper ) )
						return true;
				}
			}

			return false;
		}

		function addListeners() {
			var hideTimeout, showTimeout, trigger, element, mouseY, mouseX;

			editable = editor.editable(), doc = editable.getDocument(), body = doc.getBody(), win = editor.window;

			initBoxElement();

			// Let's handle mousemove event for mB on/off toggle
			doc.on( 'mousemove', function( event ) {
				DEBUG.startTimer();
				clearTimeout( showTimeout );

				// Don't do anything if:
				if ( mouseNearOf( magicBox, event, 1.5 * TRIGGER_OFFSET ) // 	-> Mouse pointer close to the box
				|| !( element = elementFromMouse( event, true ) ) // 	-> There's no valid element under mouse pointer
				|| editor.mode !== 'wysiwyg' // 	-> Not in WYSIWYG mode (e.g. source mode)
				|| hiddenMode // 	-> Hidden mode is active (shift is pressed)
				|| !editor.focusManager.hasFocus ) // 	-> Editor has no focus
				{
					return DEBUG.showTrigger( trigger );
				}

				// If trigger exists, and trigger is correct -> show the box
				if ( ( trigger = edgeTrigger( event ) || expandTrigger( event ) ) && triggerFilter( trigger ) ) {
					if ( trigger.edge === EDGE_TOP )
						magicBox.insertBefore( trigger.lower );
					else
						magicBox.insertAfter( trigger.upper );

					// If box insertion made the upper edge of trigger.lower to
					// disappear below the viewport area, revert it immediately.
					if ( trigger.lower && outOfViewport( trigger.lower ) )
						return magicBox.remove();

					// Scroll if the box is slightly out of the viewport.
					croppedByViewport( magicBox.fillSpace, true );
				}

				// Otherwise remove the box
				else {
					trigger = false;
					magicBox.remove();
				}

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
					if ( !dest.$ || dest.getName() === 'html' )
						magicBox.remove();
				}, 250 );
			});

			doc.on( 'keyup', function( event ) {
				hiddenMode = false;
				DEBUG.showHidden( hiddenMode );
			});

			doc.on( 'keydown', function( event ) {
				var keyStroke = event.data.getKeystroke();

				// console.log( event, event.data.getKey(), event.data.getKeystroke() );

				switch ( keyStroke ) {
					case 16:
						hiddenMode = true;
						magicBox.remove();
						break;
					case KEYSTROKE_BEFORE:
						keyboardInsertion( false, event );
						break;
					case KEYSTROKE_AFTER:
						keyboardInsertion( true, event );
						break;
				}

				DEBUG.showHidden( hiddenMode );
			});
		}
	};

	CKEDITOR.plugins.add( 'magicbox', {
		init: function( editor ) {
			initMagicBox( editor );
		}
	});

})();

/**
 * Sets the default vertical distance between element edge and mouse pointer that
 * causes the box to appear. The distance is expressed in pixels (px).
 * @name CKEDITOR.config.magicbox_triggerOffset
 * @type Number
 * @default <code>10</code>
 * @example
 * // Increases the offset to 15px.
 * config.magicbox_triggerOffset = 15;
 */

/**
 * Defines default keystroke that inserts new paragraph before an element that
 * holds start of the current selection or just simply holds the caret.
 * @name CKEDITOR.config.magicbox_keystrokeBefore
 * @type Number
 * @default <code>CKEDITOR.CTRL + CKEDITOR.SHIFT + 219 // CTRL + SHIFT + [</code>
 * @example
 * // Changes keystroke to CTRL + SHIFT + ,
 * config.magicbox_keystrokeBefore = CKEDITOR.CTRL + CKEDITOR.SHIFT + 188;
 */

/**
 * Defines default keystroke that inserts new paragraph after an element that
 * holds start of the current selection or just simply holds the caret.
 * @name CKEDITOR.config.magicbox_keystrokeBefore
 * @type Number
 * @default <code>CKEDITOR.CTRL + CKEDITOR.SHIFT + 221 // CTRK + SHIFT + ]</code>
 * @example
 * // Changes keystroke to CTRL + SHIFT + .
 * config.magicbox_keystrokeBefore = CKEDITOR.CTRL + CKEDITOR.SHIFT + 190;
 */
