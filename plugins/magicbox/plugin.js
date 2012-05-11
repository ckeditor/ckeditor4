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
	// Activates the box inside of an editor
	function initMagicBox( editor ) {
		// Configurables
		var TRIGGER_OFFSET = editor.config.magicbox_triggerOffset || 30,
			DEBUG = editor.config.magicbox_debug || false,
			BOX_COLOR = editor.config.magicbox_boxColor || '#FF0000',

			KEYSTROKE_BEFORE = editor.config.magicbox_keystrokeBefore || CKEDITOR.CTRL + CKEDITOR.SHIFT + 219,
			// CTRL + SHIFT + [
			KEYSTROKE_AFTER = editor.config.magicbox_keystrokeAfter || CKEDITOR.CTRL + CKEDITOR.SHIFT + 221,
			// CTRL + SHIFT + ],

			EDGE_TOP = 1,
			EDGE_BOTTOM = 2,
			EDGE_MIDDLE = 3,

			TYPE_EDGE = 1,
			TYPE_EXPAND = 2,

			LOOK_TOP = 0,
			LOOK_BOTTOM = 1,
			LOOK_NORMAL = 2,

			SIGHT_SCROLL = 50,
			WHITE_SPACE = '\u00A0',

			// DTDs
			DTD_TRIGGERS = editor.config.magicbox_putEverywhere ? CKEDITOR.dtd.$block : { table:1,hr:1,div:1,ul:1,ol:1,dl:1 },
			DTD_LISTITEM = CKEDITOR.dtd.$listItem,

			// Global objects and variables
			body, doc, editable, win, magicBox, hiddenMode, hotParagraph, activeRanges, trigger, element, hideTimeout, scrollTimeout, checkMouseTimeoutPending, checkMouseTimeout, checkMouseTimer;

		editor.addCommand( 'accessSpaceBefore', accessSpaceCommand() );
		editor.addCommand( 'accessSpaceAfter', accessSpaceCommand( true ) );

		// Run mouse listeners as soon as content DOM is ready.
		editor.on( 'contentDom', addListeners, this );

		function initBoxElement() {
			var elementsCommon = 'padding: 0px; margin: 0px; cursor: pointer; display: block; z-index: 9999; color: #fff; position: absolute;',
				triangleCommon = 'width: 0px; height: 0px; border-color: transparent; display: block; border-style: solid; border-top-width: 8px; border-bottom-width: 8px; top: -8px;',
				trigger;

			magicBox = CKEDITOR.dom.element.createFromHtml( '<p id="magic_box" class="magic_box" contenteditable="false" style="' + elementsCommon + 'height: 0px; position: absolute; border-bottom: 1px dashed ' + BOX_COLOR + '" ></p>', doc );

			// Looks are as follows: [ LOOK_TOP, LOOK_BOTTOM, LOOK_NORMAL ].
			magicBox.boxChildren = [
				CKEDITOR.tools.extend( CKEDITOR.dom.element.createFromHtml( '<span title="Insert paragraph here" style="' + elementsCommon + 'background: url(' + this.path + '/images/icon.png) center no-repeat ' + BOX_COLOR + '; height: 17px; width: 17px; right: 17px; font-size: 12px; text-align: center;"></span>' ), {
				looks: [
					CKEDITOR.tools.extend({ 'top': '0px' }, vendorPrefix( 'border-radius', '0px 0px 2px 2px' ) ),
					CKEDITOR.tools.extend({ 'top': '-16px' }, vendorPrefix( 'border-radius', '2px 2px 0px 0px' ) ),
					CKEDITOR.tools.extend({ 'top': '-8px' }, vendorPrefix( 'border-radius', '2px' ) )
					]
			}),
				CKEDITOR.tools.extend( CKEDITOR.dom.element.createFromHtml( '<span style="' + elementsCommon + triangleCommon + 'left: 0px; border-left-width: 8px; border-left-color: ' + BOX_COLOR + ' "></span>' ), {
				looks: [
					{
					'border-bottom-width': '8px'
				},
					{
					'border-bottom-width': '0px'
				},
					{
					'border-bottom-width': '8px'
				}
				]
			}),
				CKEDITOR.tools.extend( CKEDITOR.dom.element.createFromHtml( '<span style="' + elementsCommon + triangleCommon + 'right: 0px; border-right-width: 8px; border-right-color: ' + BOX_COLOR + ' "></span>' ), {
				looks: [
					{
					'border-bottom-width': '8px'
				},
					{
					'border-bottom-width': '0px'
				},
					{
					'border-bottom-width': '8px'
				}
				]
			})
				];

			function vendorPrefix( property, value ) {
				var prefixes = [ '-moz-', '-webkit-', '-o-', '-ms-', '' ],
					styles = {};

				for ( var i = prefixes.length; i--; )
					styles[ prefixes[ i ] + property ] = value;

				return styles;
			}

			magicBox.updateLook = function( newLook ) {
				for ( var i = magicBox.boxChildren.length; i--; )
					magicBox.boxChildren[ i ].setStyles( magicBox.boxChildren[ i ].looks[ newLook ] );
			}

			magicBox.positionBox = function( newTrigger ) {
				trigger = newTrigger;

				var newStyle = {},

					upper = trigger.upper,
					lower = trigger.lower,
					any = upper || lower,
					parent = any.getParent();

				upper && updateDimensions( upper, true, false, true, false );
				lower && updateDimensions( lower, true, false, true, false );
				updateDimensions( parent, false, false, true, true );

				// Set X coordinate (left, right, width)
				if ( parent.equals( editable ) ) {
					newStyle.left = newStyle.right = 0;
					newStyle.width = 'auto';
				} else {
					newStyle.left = any.size.left - any.size.marginLeft;
					newStyle.width = any.size.width + any.size.marginLeft + any.size.marginRight;
					newStyle.right = 'auto';
				}

				// Set Y coordinate (top) for trigger consisting of two elements
				if ( upper && lower ) {
					// No margins at all or they're equal. Place box right between.
					if ( upper.size.marginBottom === lower.size.marginTop )
						newStyle.top = 0 | ( upper.size.bottom + upper.size.marginBottom / 2 );

					else {
						// Upper margin < lower margin. Place at lower margin.
						if ( upper.size.marginBottom < lower.size.marginTop )
							newStyle.top = upper.size.bottom + upper.size.marginBottom;
						// Upper margin > lower margin. Place at upper margin - lower margin.
						else
							newStyle.top = upper.size.bottom + upper.size.marginBottom - lower.size.marginTop;
					}
				}

				// Set Y coordinate (top) for single-edge trigger
				else if ( !upper )
					newStyle.top = lower.size.top - lower.size.marginTop;
				else if ( !lower )
					newStyle.top = upper.size.bottom + upper.size.marginBottom;

				// Set box button modes if close to the viewport horizontal edge
				// or look forced by the trigger
				if ( trigger.isLookTop() || inRange( newStyle.top, [ win.scroll.y - 15, win.scroll.y + 5 ] ) ) {
					newStyle.top = win.scroll.y;
					magicBox.updateLook( LOOK_TOP );
				} else if ( trigger.isLookBottom() || inRange( newStyle.top, [ win.view.bottom - 5, win.view.bottom + 15 ] ) ) {
					newStyle.top = win.view.bottom - 1;
					magicBox.updateLook( LOOK_BOTTOM );
				} else
					magicBox.updateLook( LOOK_NORMAL );

				// Append `px` prefixes
				for ( var s in newStyle )
					newStyle[ s ] = newStyle[ s ] + ( typeof newStyle[ s ] === 'number' ? 'px' : '' );

				magicBox.setStyles( newStyle );
			}

			// Insert children into the box
			for ( var i = magicBox.boxChildren.length; i--; )
				magicBox.boxChildren[ i ].appendTo( magicBox );

			// Make the box unselectable.
			magicBox.unselectable();

			// Handle paragraph inserting
			magicBox.on( 'mouseup', function( mouse ) {
				insertParagraph( function( paragraph ) {
					paragraph[ trigger.isTop() ? 'insertBefore' : 'insertAfter' ]
					( trigger.isTop() ? trigger.lower : trigger.upper );
				});

				outOfViewport( hotParagraph, true );
				magicBox.remove();
				mouse.data.preventDefault( true );
			});

			// Prevents IE9 from displaying the resize box and disables drag'n'drop functionality.
			magicBox.on( 'mousedown', function( mouse ) {
				mouse.data.preventDefault( true );
			});
		}

		// Creates new paragraph filled with dummy white-space.
		// It inserts the paragraph according to insertFunction.
		// Then the method selects the non-breaking space making the paragraph ready for typing.
		function insertParagraph( insertFunction ) {
			var paragraph = new CKEDITOR.dom.element( 'p' ),
				range = new CKEDITOR.dom.range( doc ),
				dummy = doc.createText( WHITE_SPACE );

			// Remove old hot one
			if ( isHotEmpty() )
				hotParagraph.remove();

			saveSelection();

			insertFunction( paragraph );
			dummy.appendTo( paragraph );
			range.moveToPosition( dummy, CKEDITOR.POSITION_AFTER_START );
			editor.getSelection().selectRanges( [ range ] );

			hotParagraph = paragraph;
		}

		function getMidpoint( upper, lower, ignoreScroll ) {
			updateDimensions( upper, false, false, ignoreScroll );
			updateDimensions( lower, false, false, ignoreScroll );

			return upper.size.bottom && lower.size.top ? 0 | ( upper.size.bottom + lower.size.top ) / 2 : upper.size.bottom || lower.size.top;
		}

		function getAscendantTrigger( node ) {
			if ( !node )
				return null;

			if ( node.type === CKEDITOR.NODE_TEXT )
				node = node.getParent();

			return node ? node.getAscendant( DTD_TRIGGERS, true ) : null;
		}

		// Gets closest:
		// 	-> Parent table for table element
		// 	-> Parent list for list element
		function getIndependentParent( element ) {
			var name = element.getName();

			if ( !!DTD_LISTITEM[ name ] )
				return element.getAscendant( CKEDITOR.dtd.$list );

			if ( !!CKEDITOR.dtd.$tableContent[ name ] )
				return element.getAscendant( { table:1 } );

			return null;
		}

		// Get closest node (text or HTML), but omit all empty text nodes (containing white characters only).
		function getNonEmptyNeighbour( node, getPrevious ) {
			while ( node ) {
				node = node[ getPrevious ? 'getPrevious' : 'getNext' ]();

				if ( isBox( node ) )
					continue;

				if ( !isEmptyTextNode( node ) )
					break;
			}

			return node;
		}

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
				floated = element.getComputedStyle( 'float' ),
				aligned = element.getAttribute( 'align' );

			return ( !!options[ floated ] || !!options[ aligned ] );
		}

		function isPositioned( element ) {
			if ( !isHtml( element ) )
				return false;

			var options = { 'absolute':1,'fixed':1 },
				position = element.getComputedStyle( 'position' );

			return !!options[ position ];
		}

		function flowBreaker( element ) {
			if ( !isHtml( element ) )
				return false;

			return isPositioned( element ) || isFloated( element );
		}

		function isHtml( node ) {
			return node && node.type === CKEDITOR.NODE_ELEMENT && ( node.$.offsetHeight || node.$.offsetWidth );
		}

		function isTextNode( node ) {
			return node && node.type === CKEDITOR.NODE_TEXT;
		}

		function isEmptyTextNode( node ) {
			return isTextNode( node ) && !CKEDITOR.tools.trim( node.getText() );
		}

		function boxTrigger( upper, lower, edge, type, look ) {
			this.upper = upper;
			this.lower = lower;
			this.edge = edge;
			this.type = type;
			this.look = look;
		}

		boxTrigger.prototype = {
			isTop: function() {
				return this.edge === EDGE_TOP;
			},
			isMiddle: function() {
				return this.edge === EDGE_MIDDLE;
			},
			isBottom: function() {
				return this.edge === EDGE_BOTTOM;
			},
			isEdge: function() {
				return this.type === TYPE_EDGE;
			},
			isExpand: function() {
				return this.type === TYPE_EXPAND;
			},
			isLookTop: function() {
				return this.look === LOOK_TOP;
			},
			isLookBottom: function() {
				return this.look === LOOK_BOTTOM;
			}
		};

		function isBox( node ) {
			if ( !isHtml( node ) )
				return false;

			return node.equals( magicBox ) || magicBox.contains( node );
		}

		function isTrigger( element ) {
			return isHtml( element ) ? element.getName() in DTD_TRIGGERS : null;
		}

		function isNextTrigger( element ) {
			var sibling;
			return ( sibling = element.getNext( isRelevant ) ) && isTrigger( sibling );
		}

		function isPrevTrigger( element ) {
			var sibling;
			return ( sibling = element.getPrevious( isRelevant ) ) && isTrigger( sibling );
		}

		function isFirstChild( element ) {
			return !element.getPrevious( isRelevant );
		}

		function isLastChild( element ) {
			return !element.getNext( isRelevant );
		}

		function isChildBetweenPointerAndEdge( parent, mouse, edgeBottom ) {
			var edgeChild = parent[ edgeBottom ? 'getLast' : 'getFirst' ]( isRelevant );

			if ( !edgeChild )
				return false;

			updateDimensions( edgeChild );

			if ( edgeBottom )
				return edgeChild.size.top > mouse.y;
			else
				return edgeChild.size.bottom < mouse.y;
		}

		function isHotEmpty() {
			return hotParagraph && hotParagraph.getText() === WHITE_SPACE;
		}

		function saveSelection() {
			activeRanges = editor.getSelection().createBookmarks();
		}

		function restoreSelection() {
			editor.getSelection().selectBookmarks( activeRanges );
		}

		// Simple irrelevant elements filter.
		function isRelevant( node ) {
			return isHtml( node ) // 	-> Node must be an existing HTML element
			&& !isBox( node ) // 	-> Node can't be magicBox
			&& !flowBreaker( node ); // 	-> Node can't be floated/positioned/aligned
		}

		// Collects dimensions of an element.
		// @param {element} an element to be measured
		// @param {withMargins} include element's margins in returned object
		// @param {withPaddings} include element's paddings in returned object
		// @param {ignoreScroll} ignore scroll offsets in left/top coordinates
		// @param {ignorePadding} use getComputedStyle() instead of offsetWidth|Height
		function updateDimensions( element, withMargins, withPaddings, ignoreScroll, ignorePadding ) {
			if ( !isHtml( element ) )
				return null;

			var dimensions = {},
				prefixes = { margin: withMargins, padding: withPaddings },
				prefixesValues = {},
				sides = [ 'Top', 'Right', 'Bottom', 'Left' ],

				top = element.getDocumentPosition( doc ).y - ( ignoreScroll ? 0 : win.scroll.y ),
				height = ignorePadding ? element.getComputedStyle( 'height' ) : element.$.offsetHeight,
				bottom = top + height,

				left = element.getDocumentPosition( doc ).x - ( ignoreScroll ? 0 : win.scroll.x ),
				width = ignorePadding ? element.getComputedStyle( 'width' ) : element.$.offsetWidth,
				right = left + width;

			CKEDITOR.tools.extend( dimensions, { bottom: bottom, height: height, left: left, right: right, top: top, width: width } );

			for ( var prefix in prefixes )
				if ( prefixes[ prefix ] )
				for ( var i = sides.length; i--; )
				prefixesValues[ prefix + sides[ i ] ] = parseInt( element.getComputedStyle( prefix + '-' + sides[ i ].toLowerCase() ).replace( /\D+/g, '' ), 10 ) || 0;

			element.size = CKEDITOR.tools.extend( dimensions, prefixesValues, true );
			// return CKEDITOR.tools.extend( dimensions, prefixesValues );
		}

		function elementFromMouse( mouse, ignoreBox, acceptText ) {
			if ( !mouse )
				return null;

			var x, y, node;

			// An array of [ x, y ]
			if ( CKEDITOR.tools.isArray( mouse ) ) {
				x = mouse.x;
				y = mouse.y;
			}

			// A mouse mouse
			else {
				x = mouse.x;
				y = mouse.y;
			}

			node = new CKEDITOR.dom.node( doc.$.elementFromPoint( x, y ) );

			// If ignoreBox is set and node is the box, it means that we
			// need to hide the box for a while, repeat elementFromPoint
			// and show it again.
			if ( ignoreBox && isBox( node ) ) {
				magicBox.hide()
				node = new CKEDITOR.dom.node( doc.$.elementFromPoint( x, y ) );
				magicBox.show();
			}

			if ( !acceptText && !isHtml( node ) )
				return null;

			return node;
		}

		function areSiblings( upper, lower ) {
			if ( !isHtml( upper ) || !isHtml( upper ) )
				return false;

			var next;

			return ( next = upper.getNext( isRelevant ) ) && next.equals( lower );
		}

		// Checks whether mouseY is around an element by comparing boundaries and considering
		// an offset distance
		function mouseNearOf( element, mouse, offset ) {
			if ( !isHtml( element ) )
				return false;

			updateDimensions( element );

			// Determine neighborhood by element dimensions and offsets
			if ( inRange( mouse.y, [ element.size.top - offset, element.size.bottom + offset ] ) && inRange( mouse.x, [ element.size.left - offset, element.size.right + offset ] ) )
				return true;

			return false;
		}

		// Determines whether an element if above (or below) of the viewport area
		// to ensure that it's accessible with elementFromPoint.
		function outOfViewport( element, doScroll ) {
			updateDimensions( element );

			if ( doScroll )
				element.scrollIntoView();

			return element.size.top > win.view.height || element.size.bottom < 0;
		}

		function extendWindow() {
			var scroll = win.getScrollPosition(),
				paneSize = win.getViewPaneSize();

			CKEDITOR.tools.extend( win, {
				scroll: { x: scroll.x, y: scroll.y },
				view: {
					width: paneSize.width,
					height: paneSize.height,
					bottom: paneSize.height + scroll.y
				}
			}, true );
		}

		// Inserts new paragraph on demand by looking for closest parent trigger
		// or using current element under the caret as reference.
		function accessSpaceCommand( insertAfter ) {
			return {
				canUndo: true,
				modes: { wysiwyg:1 },
				exec: function( editor ) {
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
				}
			}
		}

		// Checks if the pointer is in the upper or the lower area of a trigger.
		function edgeTrigger( mouse ) {
			var element = getAscendantTrigger( elementFromMouse( mouse, true, true ) );

			// DEBUG && DEBUG.logElements( [ element ], [ 'ascTr' ] )

			if ( !element )
				return;

			// If TRIGGER_OFFSET is larger than a half of element's height, reduce the offset.
			// If the offset wasn't reduced, top area search would cover most (all) cases.
			updateDimensions( element );

			var fixedOffset = Math.min( TRIGGER_OFFSET, 0 | ( element.size.height / 2 ) ),
				viewPaneHeight = win.view.height,

				elementNext = element,
				elementPrevious = element;

			// Around the upper edge of an element
			if ( inRange( mouse.y, [ element.size.top - 1, element.size.top + fixedOffset ] ) ) {
				// Search for nearest HTML element or non-empty text node.
				elementPrevious = getNonEmptyNeighbour( elementPrevious, true );

				// Real HTML element before
				if ( isHtml( elementPrevious ) ) {
					//DEBUG && DEBUG.log( 'Made edge trigger. EDGE_MIDDLE' );
					return new boxTrigger( elementPrevious, element, EDGE_MIDDLE, TYPE_EDGE );
				}

				// It's a text node
				if ( elementPrevious ) {
					//DEBUG && DEBUG.log( 'Previous is non-empty text node.', elementPrevious );
					return false;
				}

				// No previous element
				if ( !elementPrevious ) {
					//DEBUG && DEBUG.log( 'Made edge trigger. EDGE_TOP' );
					return new boxTrigger( null, element, EDGE_TOP, TYPE_EDGE, element.equals( editable.getFirst( isRelevant ) ) ? LOOK_TOP : LOOK_NORMAL );
				}
			}

			// Around the lower edge of an element
			else if ( inRange( mouse.y, [ element.size.bottom - fixedOffset, element.size.bottom + 1 ] ) ) {
				// Search for nearest html element or non-empty text node
				elementNext = getNonEmptyNeighbour( elementNext );

				// Real HTML element before
				if ( isHtml( elementNext ) ) {
					//DEBUG && DEBUG.log( 'Made edge trigger. EDGE_MIDDLE' );
					return new boxTrigger( element, elementNext, EDGE_MIDDLE, TYPE_EDGE );
				}

				// It's a text node
				if ( elementNext ) {
					//DEBUG && DEBUG.log( 'Next is non-empty text node.', elementPrevious );
					return false;
				}

				// No next element
				if ( !elementNext ) {
					//DEBUG && DEBUG.log( 'Made edge trigger. EDGE_BOTTOM' );
					return new boxTrigger( element, null, EDGE_BOTTOM, TYPE_EDGE, element.equals( editable.getLast( isRelevant ) ) && inRange( element.size.bottom, [ viewPaneHeight - TRIGGER_OFFSET, viewPaneHeight ] ) ? LOOK_BOTTOM : LOOK_NORMAL );
				}
			}

			return false;
		}

		// This method searches document vertically using given
		// select criterion until stop criterion is fulfilled.
		function verticalSearch( mouse, continueCriterion, selectCriterion, startElement ) {
			var upper = startElement,
				lower = startElement,
				mouseX = mouse.x,
				mouseY = mouse.y,
				mouseStep = 0,
				upperFound = false,
				lowerFound = false,
				viewPaneHeight = win.view.height;

			while ( mouseY + mouseStep < viewPaneHeight && mouseY - mouseStep > 0 ) {
				upperFound = upperFound || !continueCriterion( upper, startElement );
				lowerFound = lowerFound || !continueCriterion( lower, startElement );

				if ( !upperFound && mouseY - mouseStep > 0 )
					upper = selectCriterion( [ mouseX, mouseY - mouseStep ] );

				if ( !lowerFound && mouseY + mouseStep < viewPaneHeight )
					lower = selectCriterion( [ mouseX, mouseY + mouseStep ] );

				if ( upperFound && lowerFound )
					break;

				mouseStep++;
			}

			return new boxTrigger( upper, lower, null, null );
		}

		// Checks iteratively up and down in search for elements using elementFromMouse method.
		// Useful if in between of the triggers.
		function expandTrigger( mouse ) {
			var startElement = elementFromMouse( mouse, true ),
				upper, lower, trigger;

			if ( !isHtml( startElement ) )
				return null;

			trigger = verticalSearch( mouse,

			function( current, startElement ) {
				return startElement.equals( current );
			}, function( mouse ) {
				return elementFromMouse( mouse, true );
			}, startElement ),

			upper = trigger.upper, lower = trigger.lower;

			// Success: two siblings have been found
			if ( upper && lower && areSiblings( upper, lower ) )
				return CKEDITOR.tools.extend( trigger, {
				edge: EDGE_MIDDLE,
				type: TYPE_EXPAND
			}, true );

			//DEBUG && DEBUG.logElements( [ startElement, upper, lower ], [ 'start', 'upper', 'lower' ] );

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
			//		2.1. Make sure upper isn't a text node OR the box. Otherwise find next HTML element Why?:
			//			a) no text nodes - we need to find its dimensions
			//			b) the box is absolutely positioned
			//		2.2. Abort if there's no such element. Why?:
			//			a) 	startElement may contain text nodes only
			//		2.3. Gather dimensions of an upper element
			//		2.4. Abort if lower edge of upper is already under the mouse pointer. Why?:
			//			a) 	We expect upper to be above and lower below the mouse pointer.
			//	3. Perform iterative search while upper != lower
			//		3.1. Find the upper-next element. If there's no such element, break current search. Why?:
			//			a)	There's no point in further search if there are only text nodes ahead.
			//		3.2. Calculate the distance between the middle point of ( upper, upperNext ) and mouse-y
			//		3.3. If the distance is shorter than the previous best, save it (save upper, upperNext as well).
			//		3.4. If the optimal pair is found, assign it back to the trigger.

			// 1.1., 1.2.
			if ( upper && startElement.contains( upper ) )
				while ( !upper.getParent().equals( startElement ) )
				upper = upper.getParent();
			else
				upper = startElement.getFirst();

			if ( lower && startElement.contains( lower ) )
				while ( !lower.getParent().equals( startElement ) )
				lower = lower.getParent();
			else
				lower = startElement.getLast();

			// 1.3.
			if ( !upper || !lower ) {
				//DEBUG && DEBUG.log( 'There's no upper or no lower element.' );
				return null;
			}

			// 2.1.
			if ( !isHtml( upper ) || isBox( upper ) ) {
				// 2.2.
				if ( !( upper = upper.getNext( isRelevant ) ) ) {
					//DEBUG && DEBUG.log( 'There's no upper next.' );
					return null;
				}
			}

			// 2.3.
			updateDimensions( upper );

			var minDistance = Number.MAX_VALUE,
				currentDistance, upperNext, minElement, minElementNext;

			// 2.4.
			if ( upper.size.bottom > mouse.y ) {
				//DEBUG && DEBUG.log( 'We're already below the pointer.' );
				//DEBUG && DEBUG.logElements( [ startElement, upper, lower ], [ 'start', 'upper', 'lower' ] );
				//DEBUG && DEBUG.markElement( upper );
				return null;
			}

			while ( lower && !lower.equals( upper ) ) {
				// 3.1.
				if ( !( upperNext = upper.getNext( isRelevant ) ) )
					break;

				//DEBUG.logElements( [ upper, upperNext ], [ 'upper', 'upperNext' ] )

				// 3.2.
				currentDistance = getDistance( getMidpoint( upper, upperNext ), mouse.y );

				// 3.3.
				if ( currentDistance < minDistance ) {
					minDistance = currentDistance;
					minElement = upper;
					minElementNext = upperNext;
				}

				upper = upperNext;
				updateDimensions( upper );
			}

			// DEBUG && DEBUG.logElements( [ startElement, upper, lower ], [ 'start', 'upper', 'lower' ] );
			// DEBUG && DEBUG.logElements( [ minElement, minElementNext ], [ 'min', 'minNext' ] );

			// 3.4.
			if ( !minElement || !minElementNext ) {
				// DEBUG && DEBUG.log( 'no minElement or minNext' );
				return null;
			}

			// An element of minimal distance has been found. Assign it to the trigger.
			trigger.upper = minElement;
			trigger.lower = minElementNext;

			// Success: post-processing revealed a pair of elements
			return CKEDITOR.tools.extend( trigger, {
				edge: EDGE_MIDDLE,
				type: TYPE_EXPAND
			}, true );
		}

		// A method for trigger filtering. Accepts or rejects trigger pairs
		// by their location in DOM etc.
		// TODO: This method is to be rewritten to reduce redundant conditions.
		// Until then it is ugly but easy to read.
		function triggerFilter( trigger, mouse ) {
			var upper = trigger.upper,
				lower = trigger.lower;

			// DEBUG && DEBUG.logElements( [ upper, lower ], [ 'upper', 'lower' ] );

			// NOT: one of the elements is floated/positioned
			if ( flowBreaker( lower ) || flowBreaker( upper ) ) {
				//DEBUG && DEBUG.log( 'REJECTED. Lower or upper are flowbreakers.' );
				return false;
			}

			if ( trigger.isMiddle() ) {
				// NOT: EDGE_MIDDLE trigger ALWAYS has two elements
				if ( !upper || !lower ) {
					//DEBUG && DEBUG.log( 'REJECTED. Lower or upper missing' );
					return false;
				}

				// NOT: two trigger elements, one equals another
				if ( lower.equals( upper ) || upper.equals( lower ) ) {
					//DEBUG && DEBUG.log( 'REJECTED. Lower equals upper or upper equals lower.' );
					return false;
				}

				// NOT: two trigger elements, one contains another
				if ( lower.contains( upper ) || upper.contains( lower ) ) {
					//DEBUG && DEBUG.log( 'REJECTED. Lower contains upper or upper contains lower.' );
					return false;
				}

				// YES: two trigger elements, pure siblings
				if ( isTrigger( upper ) && isTrigger( lower ) && areSiblings( upper, lower ) ) {
					if ( trigger.isExpand() ) {
						//DEBUG && DEBUG.log( 'APPROVED EDGE_MIDDLE.', upper, lower );
						//DEBUG && DEBUG.logElements( [ upper, lower ], [ 'upper', 'lower' ] )
						return true;
					}

					// Check if there's an element that is between the edge and mouse pointer
					if ( trigger.isEdge() && !isChildBetweenPointerAndEdge( upper, mouse, true ) && !isChildBetweenPointerAndEdge( lower, mouse, false ) ) {
						//DEBUG && DEBUG.log( 'APPROVED EDGE_MIDDLE.', upper, lower );
						//DEBUG && DEBUG.logElements( [ upper, lower ], [ 'upper', 'lower' ] )
						return true;
					} else {
						//DEBUG && DEBUG.log( 'REJECTED EDGE_MIDDLE. Edge child above/below.', upper, lower );
						return false;
					}
				}
			}

			if ( trigger.isTop() ) {
				// NOT: there's a child above the pointer
				if ( isChildBetweenPointerAndEdge( lower, mouse, false ) ) {
					//DEBUG && DEBUG.log( 'REJECT EDGE_TOP. Edge child above', lower );
					return false;
				}

				// First child cases
				if ( isTrigger( lower ) ) {
					// NOT: signle trigger element, a child of li/dt/dd
					if ( !!DTD_LISTITEM[ lower.getParent().getName() ] ) {
						//DEBUG && DEBUG.log( 'REJECT EDGE_TOP. Parent is list' );
						return false;
					}

					// YES: single trigger element, first child
					//DEBUG && DEBUG.log( 'APPROVED EDGE_TOP.' );
					//DEBUG && DEBUG.logElements( [ lower ], [ 'lower' ] )
					return true;
				}
			}

			if ( trigger.isBottom() ) {
				// NOT: there's a child below the pointer
				if ( isChildBetweenPointerAndEdge( upper, mouse, true ) ) {
					//DEBUG && DEBUG.log( 'REJECT EDGE_BOTTOM. Edge child below', upper );
					return false;
				}

				// Last child cases
				if ( isTrigger( upper ) ) {
					// NOT: signle trigger element, a child of li/dt/dd
					if ( !!DTD_LISTITEM[ upper.getParent().getName() ] ) {
						//DEBUG && DEBUG.log( 'REJECT EDGE_BOTTOM. Parent is list' );
						return false;
					}

					// YES: single trigger element, last child
					return true;
					//DEBUG && DEBUG.log( 'APPROVED EDGE_BOTTOM.' );
					//DEBUG && DEBUG.logElements( [ upper ], [ 'upper' ] )
				}
			}

			//DEBUG && DEBUG.log( 'REJECT others.' );
			return false;
		}

		function addListeners() {
			editable = editor.editable(), doc = editable.getDocument(), body = doc.getBody(), win = editor.window;

			initBoxElement.call( this );
			extendWindow();

			// Let's handle mousemove mouse for mB on/off toggle
			function checkMouse( mouse ) {
				checkMouseTimer = null;

				if ( checkMouseTimeoutPending //	-> There must be an event pending
				&& !mouseNearOf( magicBox, mouse, TRIGGER_OFFSET ) // 	-> Mouse pointer can't be close to the box
				&& ( element = elementFromMouse( mouse, true, true ) ) // 	-> There must be valid element under mouse pointer
				&& editor.mode === 'wysiwyg' // 	-> In WYSIWYG mode only
				&& !hiddenMode // 	-> Can't be in hidden mode (e.g. shift is pressed or scrolling)
				&& editor.focusManager.hasFocus ) // 	-> Editor must have focus
				{
					DEBUG && DEBUG.startTimer();
					extendWindow();

					// If trigger exists, and trigger is correct -> show the box
					if ( ( trigger = edgeTrigger( mouse ) || expandTrigger( mouse ) ) && triggerFilter( trigger, mouse ) ) {
						magicBox.appendTo( editable );
						magicBox.positionBox( trigger );
					}

					// Otherwise remove the box
					else {
						trigger = false;
						magicBox.remove();
					}

					//DEBUG && DEBUG.showTrigger( trigger );
					//DEBUG && DEBUG.mousePos( mouse.y, element );

					checkMouseTimeoutPending = false;
					DEBUG && DEBUG.stopTimer();
				}
			}

			function checkMouseTimeout( event ) {
				checkMouseTimeoutPending = true;

				if ( checkMouseTimer )
					return;

				(function( mouse ) {
					checkMouseTimer = setTimeout( function() {
						checkMouse( mouse );
					}, 30 );
				})({
					x: event.data.$.clientX,
					y: event.data.$.clientY
				});
			}

			doc.on( 'mousemove', checkMouseTimeout );

			// Hide mB on mouseout if mouse leaves document
			doc.on( 'mouseout', function( event ) {
				clearTimeout( hideTimeout );

				var dest = new CKEDITOR.dom.element( event.data.$.relatedTarget || event.data.$.toElement );

				hideTimeout = setTimeout( function() {
					if ( !dest.$ || dest.getName() === 'html' )
						magicBox.remove();
				}, 10 );
			});

			doc.on( 'keyup', function( event ) {
				hiddenMode = false;
				//DEBUG && DEBUG.showHidden( hiddenMode );
			});

			doc.on( 'keydown', function( event ) {
				var keyStroke = event.data.getKeystroke(),
					selection = editor.getSelection(),
					selected = selection.getStartElement();

				// DEBUG && DEBUG.log( event, event.data.getKey(), event.data.getKeystroke() );

				switch ( keyStroke ) {
					// Shift pressed
					case 16:
						hiddenMode = true;
						magicBox.remove();
						break;

						// ESC pressed on while caret inside of "empty" hotParagrapht
					case 27:
						if ( selected && selected.equals( hotParagraph ) && isHotEmpty() ) {
							hotParagraph.remove();
							restoreSelection();
						}
						break;

						// Command keystrokes
					case KEYSTROKE_BEFORE:
						editor.execCommand( 'accessSpaceBefore' )
						break;
					case KEYSTROKE_AFTER:
						editor.execCommand( 'accessSpaceAfter' )
						break;
				}

				//DEBUG && DEBUG.showHidden( hiddenMode );
			});

			// Selection changed when hotParagraph was empty. Remove it then.
			editor.on( 'selectionChange', function( event ) {
				if ( isHotEmpty() && !event.data.selection.getStartElement().equals( hotParagraph ) )
					hotParagraph.remove();
			});

			win.on( 'scroll', function( event ) {
				clearTimeout( scrollTimeout );
				magicBox.remove();
				hiddenMode = true;

				scrollTimeout = setTimeout( function() {
					hiddenMode = false;
				}, 100 );
			});
		}

		// Pure dev, for testing purposes
		CKEDITOR.tools.extend( editor.plugins.magicbox, {
			triggerFilter: triggerFilter,
			updateDimensions: updateDimensions,

			isHtml: isHtml,
			boxTrigger: boxTrigger,

			EDGE_TOP: EDGE_TOP,
			EDGE_BOTTOM: EDGE_BOTTOM,
			EDGE_MIDDLE: EDGE_MIDDLE,
			TYPE_EDGE: TYPE_EDGE,
			TYPE_EXPAND: TYPE_EXPAND,
			LOOK_TOP: LOOK_TOP,
			LOOK_NORMAL: LOOK_NORMAL,
			LOOK_BOTTOM: LOOK_BOTTOM
		});
	};

	CKEDITOR.plugins.add( 'magicbox', {
		init: function( editor ) {
			initMagicBox.call( this, editor );
		}
	});

})();

/**
 * Sets the default vertical distance between element edge and mouse pointer that
 * causes the box to appear. The distance is expressed in pixels (px).
 * @name CKEDITOR.config.magicbox_triggerOffset
 * @type Number
 * @default <code>30</code>
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
