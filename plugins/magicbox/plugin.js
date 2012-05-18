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
	function init( editor ) {
		// Configurables
		var TRIGGER_OFFSET = editor.config.magicbox_triggerOffset || 30,
			DEBUG = editor.config.magicbox_debug || false,
			BOX_COLOR = editor.config.magicbox_boxColor || '#FF0000',
			BOX_OPACITY = editor.config.magicbox_boxOpacity || 1,

			KEYSTROKE_BEFORE = editor.config.magicbox_keystrokeBefore || CKEDITOR.CTRL + CKEDITOR.SHIFT + 219,
			// CTRL + SHIFT + [
			KEYSTROKE_AFTER = editor.config.magicbox_keystrokeAfter || CKEDITOR.CTRL + CKEDITOR.SHIFT + 221,
			// CTRL + SHIFT + ],

			// Constant values, types and so on.
			EDGE_TOP = 1,
			EDGE_BOTTOM = 2,
			EDGE_MIDDLE = 3,

			TYPE_EDGE = 1,
			TYPE_EXPAND = 2,

			LOOK_TOP = 1,
			LOOK_BOTTOM = 2,
			LOOK_NORMAL = 3,

			SIGHT_SCROLL = 50,
			WHITE_SPACE = '\u00A0',

			// DTDs
			DTD_TRIGGERS = editor.config.magicbox_putEverywhere ? CKEDITOR.dtd.$block : { table:1,hr:1,div:1,ul:1,ol:1,dl:1 },
			DTD_LISTITEM = CKEDITOR.dtd.$listItem,

			// Global objects and variables
			view = {},

			doc, editable, win, magicBox, hiddenMode, hotParagraph, activeRanges, element, hideTimeout, checkMouseTimeoutPending, checkMouseTimeout, checkMouseTimer;

		// Editor commands for accessing difficult focus spaces
		editor.addCommand( 'accessSpaceBefore', accessSpaceCommand() );
		editor.addCommand( 'accessSpaceAfter', accessSpaceCommand( true ) );

		// Run mouse listeners as soon as content DOM is ready.
		editor.on( 'contentDom', addListeners, this );

		function initBoxElement() {
			var elementsCommon = 'width:0px;height: 0px;padding: 0px;margin: 0px;display: block;z-index: 9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;',
				triangleCommon = 'border-color:transparent;display:block;border-style:solid;',
				boxOpacity = BOX_OPACITY !== 1 ? '-ms-filter: \'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + 100 * BOX_OPACITY + ')\';\
					filter: alpha(opacity=' + 100 * BOX_OPACITY + ');\
					opacity: ' + BOX_OPACITY + ';' : '';

			// The box must be a DIV element. Otherwise it causes
			// flickering in IE7 at the moment of insertion.
			magicBox = CKEDITOR.dom.element.createFromHtml( '<span contenteditable="false" style="' + elementsCommon + 'position:absolute;border-top:1px dashed ' + BOX_COLOR + ';' + boxOpacity + '" ></span>' );

			function vendorPrefix( property, value ) {
				var prefixes = [ '-moz-', '-webkit-', '-o-', '-ms-', '' ],
					styles = {};

				for ( var i = prefixes.length; i--; )
					styles[ prefixes[ i ] + property ] = value;

				return styles;
			}

			// Changes look of the box according to current needs.
			// Three different styles are available: [ LOOK_TOP, LOOK_BOTTOM, LOOK_NORMAL ]
			magicBox.updateLook = function( newLook ) {
				if ( magicBox.look === newLook )
					return;

				for ( var i = magicBox.boxChildren.length; i--; )
					magicBox.boxChildren[ i ].setStyles( magicBox.boxChildren[ i ].looks[ newLook - 1 ] );

				magicBox.look = newLook;
			}

			// Adjusts position of the box according to the trigger properties.
			// If also affects look of the box depending on the type of the trigger.
			magicBox.positionBox = function( newTrigger ) {
				magicBox.trigger = newTrigger;

				var styleSet = {},
					upper = magicBox.trigger.upper,
					lower = magicBox.trigger.lower,
					any = upper || lower,
					parent = any.getParent();

				upper && updateSize( upper, true, false, true, false );
				lower && updateSize( lower, true, false, true, false );
				updateSize( parent, false, false, true, true );

				// Yeah, that's gonna be useful in inline-mode case.
				if ( inInlineMode() )
					updateSize( editable, false, false, true );

				// Set X coordinate (left, right, width)
				if ( parent.equals( editable ) ) {
					styleSet.left = view.scroll.x;
					styleSet.right = -view.scroll.x;
					styleSet.width = '';
				} else {
					styleSet.left = any.size.left - any.size.marginLeft + view.scroll.x - ( inInlineMode() ? editable.size.left : 0 );
					styleSet.width = any.size.width + any.size.marginLeft + any.size.marginRight + view.scroll.x;
					styleSet.right = '';
				}

				// Set Y coordinate (top) for trigger consisting of two elements
				if ( upper && lower ) {
					// No margins at all or they're equal. Place box right between.
					if ( upper.size.marginBottom === lower.size.marginTop )
						styleSet.top = 0 | ( upper.size.bottom + upper.size.marginBottom / 2 );

					else {
						// Upper margin < lower margin. Place at lower margin.
						if ( upper.size.marginBottom < lower.size.marginTop )
							styleSet.top = upper.size.bottom + upper.size.marginBottom;
						// Upper margin > lower margin. Place at upper margin - lower margin.
						else
							styleSet.top = upper.size.bottom + upper.size.marginBottom - lower.size.marginTop;
					}
				}

				// Set Y coordinate (top) for single-edge trigger
				else if ( !upper )
					styleSet.top = lower.size.top - lower.size.marginTop;
				else if ( !lower )
					styleSet.top = upper.size.bottom + upper.size.marginBottom;

				// Set box button modes if close to the viewport horizontal edge
				// or look forced by the trigger
				if ( magicBox.trigger.isLookTop() || inBetween( styleSet.top, [ view.scroll.y - 15, view.scroll.y + 5 ] ) ) {
					styleSet.top = inInlineMode() ? 0 : view.scroll.y;
					magicBox.updateLook( LOOK_TOP );
				} else if ( magicBox.trigger.isLookBottom() || inBetween( styleSet.top, [ view.pane.bottom - 5, view.pane.bottom + 15 ] ) ) {
					styleSet.top = inInlineMode() ? editable.size.height : view.pane.bottom - 1;
					magicBox.updateLook( LOOK_BOTTOM );
				} else {
					if ( inInlineMode() )
						styleSet.top -= editable.size.top;
					magicBox.updateLook( LOOK_NORMAL );
				}

				if ( inInlineMode() )
					styleSet.top--;

				// Append `px` prefixes
				for ( var s in styleSet )
					styleSet[ s ] = styleSet[ s ] + ( typeof styleSet[ s ] === 'number' ? 'px' : '' );

				magicBox.setStyles( styleSet );
			}

			// Looks are as follows: [ LOOK_TOP, LOOK_BOTTOM, LOOK_NORMAL ].
			magicBox.boxChildren = [
				CKEDITOR.tools.extend( CKEDITOR.dom.element.createFromHtml( '<span title="Insert paragraph here" contenteditable="false" style="' + elementsCommon + 'background:url(' + this.path + 'images/icon.png) center no-repeat ' + BOX_COLOR
										+ ( CKEDITOR.env.opera ? ';' : ';cursor:pointer;' ) // cursor pointer causes mouse flickering in opera
			+ 'height:17px;width:17px;right:17px;font-size:12px;text-align:center;">' + WHITE_SPACE + '</span>' ), {
				looks: [
					CKEDITOR.tools.extend({ 'top': '-1px' }, vendorPrefix( 'border-radius', '0px 0px 2px 2px' ) ),
					CKEDITOR.tools.extend({ 'top': '-17px' }, vendorPrefix( 'border-radius', '2px 2px 0px 0px' ) ),
					CKEDITOR.tools.extend({ 'top': '-8px' }, vendorPrefix( 'border-radius', '2px' ) )
					]
			}),
				CKEDITOR.tools.extend( CKEDITOR.dom.element.createFromHtml( '<span style="' + elementsCommon + triangleCommon + 'left:0px;border-left-color:' + BOX_COLOR + '">' + WHITE_SPACE + '</span>' ), {
				looks: [
					{
					'border-width': '0 0 8px 8px', 'top': '0px'
				},
					{
					'border-width': '8px 0 0 8px', 'top': '-8px'
				},
					{
					'border-width': '8px 0 8px 8px', 'top': '-8px'
				}
				]
			}),
				CKEDITOR.tools.extend( CKEDITOR.dom.element.createFromHtml( '<span style="' + elementsCommon + triangleCommon + 'right:0px;border-right-color:' + BOX_COLOR + '">' + WHITE_SPACE + '</span>' ), {
				looks: [
					{
					'border-width': '0 8px 8px 0', 'top': '0px'
				},
					{
					'border-width': '8px 8px 0 0', 'top': '-8px'
				},
					{
					'border-width': '8px 8px 8px 0', 'top': '-8px'
				}
				]
			})
				];

			// Insert children into the box
			for ( var i = magicBox.boxChildren.length; i--; )
				magicBox.boxChildren[ i ].appendTo( magicBox );

			magicBox.updateLook( LOOK_NORMAL );

			// Using that wrapper prevents IE (8,9) from resizing editable area at the moment
			// of box insertion. This works thanks to the fact, that positioned box is wrapped by
			// an inline element. So much tricky.
			magicBox.wrap = new CKEDITOR.dom.element( 'span' );
			magicBox.appendTo( magicBox.wrap );

			magicBox.detach = function() {
				// Only if already attached
				if ( magicBox.wrap.getParent() )
					magicBox.wrap.remove();
			}

			magicBox.attach = function() {
				// Only if not already attached
				if ( !magicBox.wrap.getParent() )
					magicBox.wrap.appendTo( editable );
			}

			// Make the box unselectable.
			magicBox.unselectable();

			// Handle paragraph inserting
			magicBox.boxChildren[ 0 ].on( 'mouseup', function( mouse ) {
				magicBox.detach();

				insertParagraph( function( paragraph ) {
					paragraph[ magicBox.trigger.isTop() ? 'insertBefore' : 'insertAfter' ]
					( magicBox.trigger.isTop() ? magicBox.trigger.lower : magicBox.trigger.upper );
				});

				outOfViewport( hotParagraph, true );
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

			editor.fire( 'saveSnapshot' );

			insertFunction( paragraph );
			dummy.appendTo( paragraph );
			range.moveToPosition( dummy, CKEDITOR.POSITION_AFTER_START );
			editor.getSelection().selectRanges( [ range ] );
			hotParagraph = paragraph;

			editor.fire( 'saveSnapshot' );
		}

		function getMidpoint( upper, lower, ignoreScroll ) {
			updateSize( upper, false, false, ignoreScroll );
			updateSize( lower, false, false, ignoreScroll );

			return upper.size.bottom && lower.size.top ? 0 | ( upper.size.bottom + lower.size.top ) / 2 : upper.size.bottom || lower.size.top;
		}

		// Gets the closest parent node that belongs to DTD_TRIGGERS group.
		function getAscendantTrigger( node ) {
			if ( !node )
				return null;

			if ( isTextNode( node ) )
				node = node.getParent();

			if ( isHtml( node ) ) {
				var trigger = node.getAscendant( DTD_TRIGGERS, true );

				return trigger && !trigger.contains( editable ) ? trigger : null;
			}

			return null;
		}

		// Gets the closest parent element which is:
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

		// Get nearest node (either text or HTML), but omit all empty
		// text nodes (containing white characters only).
		function getNonEmptyNeighbour( node, goBack ) {
			var nodeParent = node.getParent();

			if ( !nodeParent )
				return;

			var range = new CKEDITOR.dom.range( doc ),
				startParams = goBack ? [
					nodeParent,
					CKEDITOR.POSITION_AFTER_START
					] : [
					node,
					CKEDITOR.POSITION_AFTER_END
					],
				endParams = goBack ? [
					node,
					CKEDITOR.POSITION_BEFORE_START
					] : [
					nodeParent,
					CKEDITOR.POSITION_BEFORE_END
					],
				notComment = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_COMMENT, true ),
				edgeNode;

			range.setStartAt.apply( range, startParams );
			range.setEndAt.apply( range, endParams );

			var walker = new CKEDITOR.dom.walker( range );

			walker.guard = function( node ) {
				// Found some non-empty text node or HTML element. Abort.
				if ( notComment( node ) && ( !isEmptyTextNode( node ) || isHtml( node ) ) ) {
					edgeNode = node;
					return false;
				}
			}

			while ( walker[ goBack ? 'previous' : 'next' ]() ) {};

			return edgeNode;
		}

		function inBetween( val, array ) {
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

			var options = { 'absolute':1,'fixed':1,'relative':1 },
				position = element.getComputedStyle( 'position' );

			return !!options[ position ];
		}

		function flowBreaker( element ) {
			if ( !isHtml( element ) )
				return false;

			return isPositioned( element ) || isFloated( element );
		}

		// Is visible HTML node?
		var isHtml = (function( node ) {
			var htmlNode = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_ELEMENT );

			return function( node ) {
				return node && htmlNode( node ) && ( node.$.offsetHeight || node.$.offsetWidth );
			}
		})();

		// Is text node?
		var isTextNode = (function( node ) {
			var textNode = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_TEXT );

			return function( node ) {
				return node && textNode( node );
			}
		})();

		// Is text node containing white-spaces only?
		var isEmptyTextNode = (function( node ) {
			var whiteOnly = CKEDITOR.dom.walker.whitespaces();

			return function( node ) {
				return whiteOnly( node );
			}
		})();

		// boxTrigger is an abstract type which describes
		// the relationship between elements that may result
		// in showing the box.
		//
		// The following type is used by numerous methods
		// to share information about the hypothetical box placement
		// and look by referring to boxTrigger properties.
		function boxTrigger( upper, lower, edge, type, look ) {
			this.upper = upper;
			this.lower = lower;
			this.edge = edge;
			this.type = type;
			this.look = look || LOOK_NORMAL;
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

			return node.equals( magicBox.wrap ) || magicBox.wrap.contains( node );
		}

		function isTrigger( element ) {
			return isHtml( element ) ? element.getName() in DTD_TRIGGERS : null;
		}

		function isChildBetweenPointerAndEdge( parent, mouse, edgeBottom ) {
			var edgeChild = parent[ edgeBottom ? 'getLast' : 'getFirst' ]( isRelevant );

			if ( !edgeChild )
				return false;

			updateSize( edgeChild );

			if ( edgeBottom )
				return edgeChild.size.top > mouse.y;
			else
				return edgeChild.size.bottom < mouse.y;
		}

		function inInlineMode() {
			return editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE;
		}

		// Simple irrelevant elements filter.
		function isRelevant( node ) {
			return isHtml( node ) // 	-> Node must be an existing HTML element
			&& !isBox( node ) // 	-> Node can be neither the box nor its child
			&& !flowBreaker( node ); // 	-> Node can be neither floated nor positioned nor aligned
		}

		// Collects dimensions of an element.
		// @param {element} an element to be measured
		// @param {withMargins} include element's margins in returned object
		// @param {withPaddings} include element's paddings in returned object
		// @param {ignoreScroll} ignore scroll offsets in left/top coordinates
		// @param {ignorePadding} use getComputedStyle() instead of offsetWidth|Height
		function updateSize( element, withMargins, withPaddings, ignoreScroll, ignorePadding ) {
			if ( !isHtml( element ) )
				return null;

			var prefixes = { margin: withMargins, padding: withPaddings },
				prefixesValues = {},
				docPosition = element.getDocumentPosition(),
				sides = [ 'Top', 'Right', 'Bottom', 'Left' ],

				top = docPosition.y - ( ignoreScroll ? 0 : view.scroll.y ),
				height = ignorePadding ? element.getComputedStyle( 'height' ) : element.$.offsetHeight,
				bottom = top + height,

				left = docPosition.x - ( ignoreScroll ? 0 : view.scroll.x ),
				width = ignorePadding ? element.getComputedStyle( 'width' ) : element.$.offsetWidth,
				right = left + width;

			for ( var prefix in prefixes )
				if ( prefixes[ prefix ] )
				for ( var i = sides.length; i--; )
				prefixesValues[ prefix + sides[ i ] ] = parseInt( element.getComputedStyle( prefix + '-' + sides[ i ].toLowerCase() ).replace( /\D+/g, '' ), 10 ) || 0;

			element.size = CKEDITOR.tools.extend({ bottom: bottom, height: height, left: left, right: right, top: top, width: width }, prefixesValues, true );
		}

		function elementFromMouse( mouse, ignoreBox, acceptText ) {
			if ( !mouse )
				return null;

			var node = new CKEDITOR.dom.node( doc.$.elementFromPoint( mouse.x, mouse.y ) );

			// If ignoreBox is set and node is the box, it means that we
			// need to hide the box for a while, repeat elementFromPoint
			// and show it again.
			if ( ignoreBox && isBox( node ) ) {
				magicBox.wrap.hide()
				node = new CKEDITOR.dom.node( doc.$.elementFromPoint( mouse.x, mouse.y ) );
				magicBox.wrap.show();
			}

			if ( !acceptText && !isHtml( node ) )
				return null;

			return node;
		}

		function areSiblings( upper, lower ) {
			if ( !isHtml( upper ) || !isHtml( upper ) )
				return false;

			return lower.equals( upper.getNext( isRelevant ) );
		}

		// Checks whether mouseY is around an element by comparing boundaries and considering
		// an offset distance
		function mouseNearOf( element, mouse, offset ) {
			if ( !isHtml( element ) )
				return false;

			updateSize( element );

			// Determine neighborhood by element dimensions and offsets
			if ( inBetween( mouse.y, [ element.size.top - offset, element.size.bottom + offset ] ) && inBetween( mouse.x, [ element.size.left - offset, element.size.right + offset ] ) )
				return true;

			return false;
		}

		// Determines whether an element if above (or below) of the viewport area
		// to ensure that it's accessible with elementFromPoint.
		function outOfViewport( element, doScroll ) {
			updateSize( element );

			if ( doScroll )
				element.scrollIntoView();

			return element.size.top > view.pane.height || element.size.bottom < 0;
		}

		function updateViewSize() {
			var scroll = editor.window.getScrollPosition(),
				paneSize = editor.window.getViewPaneSize();

			CKEDITOR.tools.extend( view, {
				scroll: {
					x: scroll.x,
					y: scroll.y,
					width: editable.$.scrollWidth - paneSize.width,
					height: editable.$.scrollHeight - paneSize.height
				},
				pane: {
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
					if ( !editor.focusManager.hasFocus )
						return;

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

					magicBox.detach();
				}
			}
		}

		// Checks if the pointer is in the upper/lower area of an element.
		// Then the procedure analyses if the there's HTML node before/after that element.
		// It also considers cases of an element being the first/last child of its parent.
		function edgeTrigger( mouse ) {
			var element = getAscendantTrigger( elementFromMouse( mouse, true, true ) );

			//DEBUG && DEBUG.logElements( [ element ], [ 'ascTr' ] )

			if ( !element || editable.equals( element ) )
				return;

			// If TRIGGER_OFFSET is larger than a half of element's height, reduce the offset.
			// If the offset wasn't reduced, top area search would cover most (all) cases.
			updateSize( element );

			var fixedOffset = Math.min( TRIGGER_OFFSET, 0 | ( element.size.height / 2 ) ),
				elementNext = element,
				elementPrevious = element;

			// Around the upper edge of an element
			if ( inBetween( mouse.y, [ element.size.top - 1, element.size.top + fixedOffset ] ) ) {
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
			else if ( inBetween( mouse.y, [ element.size.bottom - fixedOffset, element.size.bottom + 1 ] ) ) {
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
					return new boxTrigger( element, null, EDGE_BOTTOM, TYPE_EDGE, element.equals( editable.getLast( isRelevant ) ) && inBetween( element.size.bottom, [ view.pane.height - TRIGGER_OFFSET, view.pane.height ] ) ? LOOK_BOTTOM : LOOK_NORMAL );
				}
			}

			return false;
		}

		// This method searches document vertically using given
		// select criterion until stop criterion is fulfilled.
		function verticalSearch( mouse, continueCriterion, selectCriterion, startElement ) {
			var upper = startElement,
				lower = startElement,
				mouseStep = 0,
				upperFound = false,
				lowerFound = false,
				viewPaneHeight = view.pane.height;

			while ( mouse.y + mouseStep < viewPaneHeight && mouse.y - mouseStep > 0 ) {
				upperFound = upperFound || !continueCriterion( upper, startElement );
				lowerFound = lowerFound || !continueCriterion( lower, startElement );

				if ( !upperFound && mouse.y - mouseStep > 0 )
					upper = selectCriterion({ x: mouse.x, y: mouse.y - mouseStep } );

				if ( !lowerFound && mouse.y + mouseStep < viewPaneHeight )
					lower = selectCriterion({ x: mouse.x, y: mouse.y + mouseStep } );

				if ( upperFound && lowerFound )
					break;

				// Inseted of ++
				mouseStep += 15;
			}

			return new boxTrigger( upper, lower, null, null );
		}

		// Checks iteratively up and down in search for elements using elementFromMouse method.
		// Useful if between two triggers.
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
			updateSize( upper );

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
				currentDistance = Math.abs( getMidpoint( upper, upperNext ) - mouse.y );

				// 3.3.
				if ( currentDistance < minDistance ) {
					minDistance = currentDistance;
					minElement = upper;
					minElementNext = upperNext;
				}

				upper = upperNext;
				updateSize( upper );
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

		// This method handles edge cases when:
		// 	-> Mouse is around upper/lower edge of view pane.
		// 		-> Scroll position is either minimal or maximal.
		// 			-> It's OK to show LOOK_TOP/BOTTOM type box
		function editableTrigger( mouse ) {
			var editableFirst = editable.getFirst( isRelevant ),
				editableLast = editable.getLast( isRelevant );

			if ( !editableFirst || !editableLast )
				return;

			updateSize( editableFirst );
			updateSize( editableLast );
			updateSize( editable );

			if ( editableFirst.size.top > 0 && inBetween( mouse.y, [ 0, editableFirst.size.top + TRIGGER_OFFSET ] ) ) {
				return new boxTrigger( null, editableFirst, EDGE_TOP, TYPE_EDGE, inInlineMode() || view.scroll.y === 0 ? LOOK_TOP : LOOK_NORMAL );
			} else if ( editableLast.size.bottom < view.pane.height && inBetween( mouse.y, [ editableLast.size.bottom - TRIGGER_OFFSET, view.pane.height ] ) ) {
				return new boxTrigger( editableLast, null, EDGE_BOTTOM, TYPE_EDGE, inInlineMode() || inBetween( editableLast.size.bottom, [ view.pane.height - TRIGGER_OFFSET, view.pane.height ] ) ? LOOK_BOTTOM : LOOK_NORMAL );
			}
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

				if ( !upper || !lower // NOT: EDGE_MIDDLE trigger ALWAYS has two elements
				|| lower.equals( upper ) || upper.equals( lower ) // NOT: two trigger elements, one equals another
				|| lower.contains( upper ) || upper.contains( lower ) ) // NOT: two trigger elements, one contains another
				{
					//DEBUG && DEBUG.log( 'REJECTED.' );
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

					//DEBUG && DEBUG.log( 'APPROVED EDGE_BOTTOM.' );
					//DEBUG && DEBUG.logElements( [ upper ], [ 'upper' ] )

					// YES: single trigger element, last child
					return true;
				}
			}

			//DEBUG && DEBUG.log( 'REJECT others.' );
			return false;
		}

		function addListeners() {
			// Global stuff is being initialized here.
			editable = editor.editable(), doc = editable.getDocument(), win = editor.window;

			// Enabling the box inside of inline editable is pointless.
			// There's no need to place paragraphs inside paragraphs, links, spans, etc.
			if ( !!CKEDITOR.dtd.$inline[ editable.getName() ] )
				return;

			// Handle in-line editing by setting appropriate position.
			// If current position is static, make it relative and clear top/left coordinates.
			if ( inInlineMode() && !isPositioned( editable ) ) {
				editable.setStyles({
					'position': 'relative',
					'top': null,
					'left': null
				});
			}

			// Enable the box. Let it produce children elements, initialize
			// event handlers and own methods.
			initBoxElement.call( this );

			// Get view dimensions and scroll positions.
			// At this stage (before any checkMouse call) it is used mostly
			// by tests. Nevertheless it a crucial thing.
			updateViewSize();

			// This method handles mousemove mouse for box toggling.
			// It uses mouse position to determine underlying element, then
			// it tries to use different trigger type in order to place the box
			// in correct place. The following procedure is executed periodically.
			function checkMouse( mouse ) {
				DEBUG && DEBUG.startTimer();

				var trigger = null,
					editableLast;

				checkMouseTimer = null;
				updateViewSize();

				if ( checkMouseTimeoutPending //	-> There must be an event pending
				&& !mouseNearOf( magicBox, mouse, .5 * TRIGGER_OFFSET ) // 	-> Mouse pointer can't be close to the box
				&& ( element = elementFromMouse( mouse, true, true ) ) // 	-> There must be valid element under mouse pointer
				&& !hiddenMode // 	-> Can't be in hidden mode (e.g. shift is pressed or scrolling)
				&& editor.focusManager.hasFocus ) // 	-> Editor must have focus
				{
					// If trigger exists, and trigger is correct -> show the box
					if ( ( trigger = editableTrigger( mouse ) || edgeTrigger( mouse ) || expandTrigger( mouse ) ) && triggerFilter( trigger, mouse ) ) {
						magicBox.attach( editable );
						magicBox.positionBox( trigger );
					}

					// Otherwise remove the box
					else {
						trigger = false;
						magicBox.detach();
					}

					//DEBUG && DEBUG.showTrigger( trigger );
					DEBUG && DEBUG.mousePos( mouse.y, element );

					checkMouseTimeoutPending = false;
				}

				DEBUG && DEBUG.stopTimer();
			}

			// This method ensures that checkMouse aren't executed
			// in parallel and no more frequently than specified in timeout function.
			function checkMouseTimeout( event ) {
				clearTimeout( hideTimeout );
				checkMouseTimeoutPending = true;

				if ( !editor.mode == 'wysiwyg' )
					return;

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

			// This one triggers the main procedure of the plugin.
			( inInlineMode() ? editable : doc ).on( 'mousemove', checkMouseTimeout );

			// Hide the box on mouseout if mouse leaves document.
			doc.on( 'mouseout', function( event ) {
				if ( !editor.mode == 'wysiwyg' )
					return;

				clearTimeout( hideTimeout );

				// Check for inline-mode editor. If so, check mouse position
				// and remove the box if mouse outside of an editor.
				if ( inInlineMode() ) {
					var mouse = {
						x: event.data.$.clientX,
						y: event.data.$.clientY
					};

					updateViewSize();
					updateSize( editable, false, false, true );

					if ( !inBetween( mouse.x, [
						editable.size.left - view.scroll.x,
						editable.size.right - view.scroll.x
						] ) || !inBetween( mouse.y, [
						editable.size.top - view.scroll.y,
						editable.size.bottom - view.scroll.y
						] ) ) {
						clearTimeout( checkMouseTimer );
						checkMouseTimer = null;
						return magicBox.detach();
					}
				}

				var dest = new CKEDITOR.dom.element( event.data.$.relatedTarget || event.data.$.toElement );

				if ( !dest.$ || dest.getName() === 'html' ) {
					clearTimeout( checkMouseTimer );
					checkMouseTimer = null;
					hideTimeout = CKEDITOR.tools.setTimeout( magicBox.detach, 150, magicBox.wrap );
				}
			});

			// This one activates hidden mode of an editor which
			// prevents the box from being shown.
			editable.on( 'keyup', function( event ) {
				hiddenMode = false;
				//DEBUG && DEBUG.showHidden( hiddenMode );
			});

			editable.on( 'keydown', function( event ) {
				if ( !editor.mode == 'wysiwyg' )
					return;

				var keyStroke = event.data.getKeystroke(),
					selection = editor.getSelection(),
					selected = selection.getStartElement();

				// DEBUG && DEBUG.log( event, event.data.getKey(), event.data.getKeystroke() );

				switch ( keyStroke ) {
					// Shift pressed
					case 2228240: // IE
					case 16:
						hiddenMode = true;
						magicBox.detach();
						break;

						// Command keystrokes
					case KEYSTROKE_BEFORE:
						editor.execCommand( 'accessSpaceBefore' );
						event.data.preventDefault();
						break;

					case KEYSTROKE_AFTER:
						editor.execCommand( 'accessSpaceAfter' );
						event.data.preventDefault();
						break;
				}

				//DEBUG && DEBUG.showHidden( hiddenMode );
			});

			// Remove the box before an undo image is created.
			// This is important. If we didn't do that, the *undo thing* would revert the box into an editor.
			// Thanks to that, undo doesn't even know about the existence of the box.
			editor.on( 'beforeUndoImage', function( event ) {
				magicBox.detach();
			});

			// Removes the box HTML from editor data string if getData is called.
			// Thanks to that, an editor never yields data polluted by the box.
			// Based on editable.js:31
			editor.on( 'beforeGetData', function( event ) {
				// If the box is in editable, remove it, set cleared data to the editor
				// and finally revert the box to avoid user distraction.
				if ( magicBox.wrap.getParent() ) {
					magicBox.detach();
					editor.setData( editable.getData(), null, true );
					magicBox.attach( editable );
				}
			});

			// This one removes box on scroll event.
			// It is to avoid box displacement.
			win.on( 'scroll', function( event ) {
				if ( !editor.mode == 'wysiwyg' )
					return;

				magicBox.detach();
			});

			// Those event handlers remove the box on mousedown
			// and don't reveal it until the mouse is released.
			// It is to prevent box insertion e.g. while scrolling
			// (w/ scrollbar), selecting and so on.
			win.on( 'mousedown', function( event ) {
				if ( !editor.mode == 'wysiwyg' )
					return;

				magicBox.detach();
				hiddenMode = true;
			});

			win.on( 'mouseup', function( event ) {
				hiddenMode = false;
			});

			// Pure dev, for testing purposes
			this.test = {
				triggerFilter: triggerFilter,
				updateSize: updateSize,

				isHtml: isHtml,
				boxTrigger: boxTrigger,
				magicBox: magicBox,

				EDGE_TOP: EDGE_TOP,
				EDGE_BOTTOM: EDGE_BOTTOM,
				EDGE_MIDDLE: EDGE_MIDDLE,
				TYPE_EDGE: TYPE_EDGE,
				TYPE_EXPAND: TYPE_EXPAND,
				LOOK_TOP: LOOK_TOP,
				LOOK_NORMAL: LOOK_NORMAL,
				LOOK_BOTTOM: LOOK_BOTTOM
			};
		}
	};

	CKEDITOR.plugins.add( 'magicbox', { init: init } );
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

/**
 * Defines box color. The color may be adjusted to enhance readability.
 * @name CKEDITOR.config.magicbox_boxColor
 * @type String
 * @default <code>'#FF0000'</code>
 * @example
 * // Changes color to blue.
 * config.magicbox_boxColor = '#0000FF';
 */

/**
 * Defines box opacity. The opacity may be adjusted to enhance readability
 * by revealing underlying elements.
 * @name CKEDITOR.config.magicbox_boxOpacity
 * @type Number
 * @default <code>1</code>
 * @example
 * // Changes opacity to 30%.
 * config.magicbox_boxOpacity = .3;
 */
