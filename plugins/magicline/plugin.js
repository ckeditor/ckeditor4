/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Allows accessing difficult focus spaces.
 */

'use strict';

(function() {
	CKEDITOR.plugins.add( 'magicline', {
		lang: [ 'en', 'pl' ],
		init: init
	});

	// Independent methods and constants shared between editors.
	// The following methods don't require any editor instance to be executed.

	// Constant values, types and so on.
	var EDGE_TOP = 128,
		EDGE_BOTTOM = 64,
		EDGE_MIDDLE = 32,

		TYPE_EDGE = 16,
		TYPE_EXPAND = 8,

		LOOK_TOP = 4,
		LOOK_BOTTOM = 2,
		LOOK_NORMAL = 1,

		WHITE_SPACE = '\u00A0',

		// Minimum time that must elapse between two update*Size calls.
		// It prevents constant getComuptedStyle calls and improves performance.
		CACHE_TIME = 100,

		// Shared CSS stuff for box elements
		CSS_COMMON = 'width:0px;height:0px;padding:0px;margin:0px;display:block;' + 'z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;',
		CSS_TRIANGLE = CSS_COMMON + 'border-color:transparent;display:block;border-style:solid;',
		TRIANGLE_HTML = '<span>' + WHITE_SPACE + '</span>',

		// DTD
		DTD_LISTITEM = CKEDITOR.dtd.$listItem,

		// Some shorthands for common methods to save bytes
		extend = CKEDITOR.tools.extend,
		newElement = CKEDITOR.dom.element,
		newElementFromHtml = newElement.createFromHtml,
		env = CKEDITOR.env,

		// Is text node containing white-spaces only?
		isEmptyTextNode = CKEDITOR.dom.walker.whitespaces(),

		// Isn't node of NODE_COMMENT type?
		notComment = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_COMMENT, true );

	// Is fully visible HTML node?
	function isHtml( node ) {
		return node && node.type == CKEDITOR.NODE_ELEMENT && node.$.offsetHeight && node.$.offsetWidth;
	}

	// Is text node?
	function isTextNode( node ) {
		return node && node.type == CKEDITOR.NODE_TEXT;
	}

	function inBetween( val, array ) {
		return ( 1 in array ) && ( val > array[ 0 ] && val < array[ 1 ] );
	}

	function isFloated( element ) {
		if ( !isHtml( element ) )
			return false;

		var options = { left:1,right:1,center:1 };

		return !!( options[ element.getComputedStyle( 'float' ) ] || options[ element.getAttribute( 'align' ) ] );
	}

	function isPositioned( element ) {
		if ( !isHtml( element ) )
			return false;

		return !!{ absolute:1,fixed:1,relative:1 }[ element.getComputedStyle( 'position' ) ];
	}

	function flowBreaker( element ) {
		if ( !isHtml( element ) )
			return false;

		return isPositioned( element ) || isFloated( element );
	}

	function vendorPrefix( property, value ) {
		var prefix;

		if ( env.ie )
			prefix = '-ms-';
		else if ( env.opera )
			prefix = '-o-';
		else if ( env.webkit )
			prefix = '-webkit-';
		else if ( env.gecko )
			prefix = '-moz-';

		return prefix + property + ':' + value + ';' + property + ':' + value + ';';
	}

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
		this.set( edge, type, look );
	}

	boxTrigger.prototype = {
		set: function( edge, type, look ) {
			this.properties = edge + type + ( look || LOOK_NORMAL );
			return this;
		},

		is: function( property ) {
			return !!( ( this.properties & property ) == property );
		}
	}

	// Activates the box inside of an editor.
	// Everything inside of this method is context-specific,
	// so it depends on the particular editor instance.
	function init( editor ) {
		// Configurables
		var TRIGGER_OFFSET = editor.config.magicline_triggerOffset,
			HOLD_DISTANCE = TRIGGER_OFFSET * editor.config.magicline_holdDistance,
			BOX_COLOR = editor.config.magicline_boxColor,

			// %REMOVE_START%
			// Internal DEBUG uses tools located in the topmost window.
			DEBUG = window.top.DEBUG,
			// %REMOVE_END%

			// DTDs
			DTD_TRIGGERS = editor.config.magicline_putEverywhere ? CKEDITOR.dtd.$block : { table:1,hr:1,div:1,ul:1,ol:1,dl:1 },

			// Global objects and variables.
			doc, editable, win, magicline, hiddenMode, hotParagraph, activeRanges, element, scrollTimeout, hideTimeout, checkMouseTimeoutPending, checkMouseTimeout, checkMouseTimer;

		// Editor commands for accessing difficult focus spaces.
		editor.addCommand( 'accessSpaceBefore', accessSpaceCommand() );
		editor.addCommand( 'accessSpaceAfter', accessSpaceCommand( true ) );

		// Run mouse listeners as soon as content DOM is ready.
		editor.on( 'contentDom', addListeners, this );

		function initBoxElement() {
			// This the main box element that holds triangles and the insertion button
			magicline = newElementFromHtml( '<span contenteditable="false" style="' + CSS_COMMON + 'position:absolute;border-top:1px dashed ' + BOX_COLOR + '"></span>' );

			extend( magicline, {

				attach: function() {
					// Only if not already attached
					if ( !this.wrap.getParent() )
						this.wrap.appendTo( editable );

					return this;
				},

				// Looks are as follows: [ LOOK_TOP, LOOK_BOTTOM, LOOK_NORMAL ].
				boxChildren: [
					extend( newElementFromHtml( '<span title="' + editor.lang.magicline.title
												+ '" contenteditable="false">' + WHITE_SPACE + '</span>' ), {
					base: CSS_COMMON + 'height:17px;width:17px;right:17px;' + 'background:url(' + this.path + 'images/icon.png) center no-repeat ' + BOX_COLOR
														+ ';cursor:'
														+ ( env.opera ? 'auto' : 'pointer' ) + ';', // cursor:pointer causes mouse flickering in opera
					looks: [
						'top:-8px;' + vendorPrefix( 'border-radius', '2px' ),
						'top:-17px;' + vendorPrefix( 'border-radius', '2px 2px 0px 0px' ),
						'top:-1px;' + vendorPrefix( 'border-radius', '0px 0px 2px 2px' )
						]
				}),
					extend( newElementFromHtml( TRIANGLE_HTML ), {
					base: CSS_TRIANGLE + 'left:0px;border-left-color:' + BOX_COLOR + ';',
					looks: [
						'border-width:8px 0 8px 8px;top:-8px',
						'border-width:8px 0 0 8px;top:-8px',
						'border-width:0 0 8px 8px;top:0px'
						]
				}),
					extend( newElementFromHtml( TRIANGLE_HTML ), {
					base: CSS_TRIANGLE + 'right:0px;border-right-color:' + BOX_COLOR + ';',
					looks: [
						'border-width:8px 8px 8px 0;top:-8px',
						'border-width:8px 8px 0 0;top:-8px',
						'border-width:0 8px 8px 0;top:0px'
						]
				})
					],

				detach: function() {
					// Detach only if already attached.
					if ( this.wrap.getParent() )
						this.wrap.remove();

					return this;
				},

				// Adjusts position of the box according to the trigger properties.
				// If also affects look of the box depending on the type of the trigger.
				place: function( newTrigger ) {
					this.trigger = newTrigger;

					var styleSet = {},
						upper = this.trigger.upper,
						lower = this.trigger.lower,
						any = upper || lower,
						parent = any.getParent();

					upper && updateSize( upper, true );
					lower && updateSize( lower, true );
					updateSize( parent, true );

					// Yeah, that's gonna be useful in inline-mode case.
					if ( inInlineMode() )
						updateSize( editable, true );

					// Set X coordinate (left, right, width).
					if ( parent.equals( editable ) ) {
						styleSet.left = win.scroll.x;
						styleSet.right = -win.scroll.x;
						styleSet.width = '';
					} else {
						styleSet.left = any.size.left - any.size.margin.left + win.scroll.x - ( inInlineMode() ? editable.size.left + editable.size.border.left : 0 );
						styleSet.width = any.size.outerWidth + any.size.margin.left + any.size.margin.right + win.scroll.x;
						styleSet.right = '';
					}

					// Set Y coordinate (top) for trigger consisting of two elements.
					if ( upper && lower ) {
						// No margins at all or they're equal. Place box right between.
						if ( upper.size.margin.bottom === lower.size.margin.top )
							styleSet.top = 0 | ( upper.size.bottom + upper.size.margin.bottom / 2 );
						else {
							// Upper margin < lower margin. Place at lower margin.
							if ( upper.size.margin.bottom < lower.size.margin.top )
								styleSet.top = upper.size.bottom + upper.size.margin.bottom;
							// Upper margin > lower margin. Place at upper margin - lower margin.
							else
								styleSet.top = upper.size.bottom + upper.size.margin.bottom - lower.size.margin.top;
						}
					}
					// Set Y coordinate (top) for single-edge trigger.
					else if ( !upper )
						styleSet.top = lower.size.top - lower.size.margin.top;
					else if ( !lower )
						styleSet.top = upper.size.bottom + upper.size.margin.bottom;

					// Set box button modes if close to the viewport horizontal edge
					// or look forced by the trigger.
					if ( this.trigger.is( LOOK_TOP ) || inBetween( styleSet.top, [ win.scroll.y - 15, win.scroll.y + 5 ] ) ) {
						styleSet.top = inInlineMode() ? 0 : win.scroll.y;
						this.look( LOOK_TOP );
					} else if ( this.trigger.is( LOOK_BOTTOM ) || inBetween( styleSet.top, [ win.pane.bottom - 5, win.pane.bottom + 15 ] ) ) {
						styleSet.top = inInlineMode() ? editable.size.height : win.pane.bottom - 1;
						this.look( LOOK_BOTTOM );
					} else {
						if ( inInlineMode() )
							styleSet.top -= editable.size.top + editable.size.border.top;

						this.look( LOOK_NORMAL );
					}

					// 1px bug here...
					if ( inInlineMode() )
						styleSet.top--;

					// Append `px` prefixes.
					for ( var s in styleSet )
						styleSet[ s ] += typeof styleSet[ s ] == 'number' ? 'px' : '';

					this.setStyles( styleSet );
				},

				// Changes look of the box according to current needs.
				// Three different styles are available: [ LOOK_TOP, LOOK_BOTTOM, LOOK_NORMAL ].
				look: function( look ) {
					if ( this.oldLook == look )
						return;

					for ( var i = this.boxChildren.length, child; i--; )
					( child = this.boxChildren[ i ] ).setAttribute( 'style', child.base + child.looks[ 0 | look / 2 ] );

					this.oldLook = look;
				},

				wrap: new newElement( 'span' )

			});

			// Insert children into the box.
			for ( var i = magicline.boxChildren.length; i--; )
				magicline.boxChildren[ i ].appendTo( magicline );

			// Set default look of the box.
			magicline.look( LOOK_NORMAL );

			// Using that wrapper prevents IE (8,9) from resizing editable area at the moment
			// of box insertion. This works thanks to the fact, that positioned box is wrapped by
			// an inline element. So much tricky.
			magicline.appendTo( magicline.wrap );

			// Make the box unselectable.
			magicline.unselectable();

			magicline.setOpacity( editor.config.magicline_boxOpacity );

			// Handle paragraph inserting.
			magicline.boxChildren[ 0 ].on( 'mouseup', function( event ) {
				magicline.detach();

				insertParagraph( function( paragraph ) {
					paragraph[ magicline.trigger.is( EDGE_TOP ) ? 'insertBefore' : 'insertAfter' ]
					( magicline.trigger.is( EDGE_TOP ) ? magicline.trigger.lower : magicline.trigger.upper );
				});

				hotParagraph.scrollIntoView();
				event.data.preventDefault( true );
			});

			// Prevents IE9 from displaying the resize box and disables drag'n'drop functionality.
			magicline.on( 'mousedown', function( event ) {
				event.data.preventDefault( true );
			});
		}

		// Creates new paragraph filled with dummy white-space.
		// It inserts the paragraph according to insertFunction.
		// Then the method selects the non-breaking space making the paragraph ready for typing.
		function insertParagraph( insertFunction ) {
			var paragraph = new newElement( 'p' ),
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

		function getMidpoint( upper, lower ) {
			updateSize( upper );
			updateSize( lower );

			return upper.size.bottom && lower.size.top ? 0 | ( upper.size.bottom + lower.size.top ) / 2 : upper.size.bottom || lower.size.top;
		}

		// Gets the closest parent node that belongs to DTD_TRIGGERS group.
		function getAscendantTrigger( node ) {
			if ( !node )
				return null;

			if ( isTextNode( node ) )
				node = node.getParent();

			var trigger;

			if ( isHtml( node ) )
				return ( trigger = node.getAscendant( DTD_TRIGGERS, true ) ) && !trigger.contains( editable ) ? trigger : null;

			return null;
		}

		// Get nearest node (either text or HTML), but omit all empty
		// text nodes (containing white characters only).
		function getNonEmptyNeighbour( node, goBack ) {
			var nodeParent = node.getParent();

			if ( !nodeParent )
				return;

			var range = new CKEDITOR.dom.range( doc );

			if ( goBack ) {
				range.setStartAt( nodeParent, CKEDITOR.POSITION_AFTER_START );
				range.setEndAt( node, CKEDITOR.POSITION_BEFORE_START );
			} else {
				range.setStartAt( node, CKEDITOR.POSITION_AFTER_END );
				range.setEndAt( nodeParent, CKEDITOR.POSITION_BEFORE_END );
			}

			var walker = new CKEDITOR.dom.walker( range ),
				edgeNode;

			walker.guard = function( node ) {
				// Found some non-empty text node or HTML element. Abort.
				if ( notComment( node ) && ( !isEmptyTextNode( node ) || isHtml( node ) ) ) {
					edgeNode = node;
					return false;
				}
			};

			while ( walker[ goBack ? 'previous' : 'next' ]() ) {};

			return edgeNode;
		}

		function isBox( node ) {
			if ( !isHtml( node ) )
				return false;

			return node.equals( magicline.wrap ) || magicline.wrap.contains( node );
		}

		function isTrigger( element ) {
			return isHtml( element ) ? element.is( DTD_TRIGGERS ) : null;
		}

		function isChildBetweenPointerAndEdge( parent, mouse, edgeBottom ) {
			var edgeChild = parent[ edgeBottom ? 'getLast' : 'getFirst' ]( isRelevant );

			if ( !edgeChild )
				return false;

			updateSize( edgeChild );

			return edgeBottom ? edgeChild.size.top > mouse.y : edgeChild.size.bottom < mouse.y;
		}

		function inInlineMode() {
			return editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE;
		}

		// Simple irrelevant elements filter.
		function isRelevant( node ) {
			return isHtml( node ) // 	-> Node must be an existing HTML element.
			&& !isBox( node ) // 	-> Node can be neither the box nor its child.
			&& !flowBreaker( node ); // 	-> Node can be neither floated nor positioned nor aligned.
		}

		// Collects dimensions of an element.
		var sizePrefixes = [ 'top', 'left', 'right', 'bottom' ];

		function updateSize( element, ignoreScroll ) {
			if ( !isHtml( element ) )
				return null;

			if ( !element.size )
				element.size = {};

			// Abort if there was a similar query performed recently.
			// This kind of caching provides great performance improvement.
			else if ( element.size.ignoreScroll == ignoreScroll && element.size.date > new Date() - CACHE_TIME ) {
				DEBUG && DEBUG.log( 'ELEMENT.size: get from cache' ); // %REMOVE_LINE%
				return;
			}

			DEBUG && DEBUG.log( 'ELEMENT.size: capture' ); // %REMOVE_LINE%

			var getStyle = (function( propertyName ) {
				// Better "cache and reuse" than "call again and again".
				var computed = env.ie ? element.$.currentStyle : win.$.getComputedStyle( element.$, '' );

				return env.ie ?
				function( propertyName ) {
					return computed[ CKEDITOR.tools.cssStyleToDomStyle( propertyName ) ];
				} : function( propertyName ) {
					return computed.getPropertyValue( propertyName );
				};
			})(),

				docPosition = element.getDocumentPosition(),
				border = {},
				margin = {},
				padding = {},
				box = {};

			for ( var i = sizePrefixes.length; i--; ) {
				border[ sizePrefixes[ i ] ] = parseInt( getStyle( 'border-' + sizePrefixes[ i ] + '-width' ), 10 ) || 0;
				padding[ sizePrefixes[ i ] ] = parseInt( getStyle( 'padding-' + sizePrefixes[ i ] ), 10 ) || 0;
				margin[ sizePrefixes[ i ] ] = parseInt( getStyle( 'margin-' + sizePrefixes[ i ] ), 10 ) || 0;
			}

			if ( !ignoreScroll )
				updateWindowSize();

			box.top = docPosition.y - ( ignoreScroll ? 0 : win.scroll.y ), box.left = docPosition.x - ( ignoreScroll ? 0 : win.scroll.x ),

			// w/ borders and paddings.
			box.outerWidth = element.$.offsetWidth, box.outerHeight = element.$.offsetHeight,

			// w/o borders and paddings.
			box.height = box.outerHeight - ( padding.top + padding.bottom + border.top + border.bottom ), box.width = box.outerWidth - ( padding.left + padding.right + border.left + border.right ),

			box.bottom = box.top + box.outerHeight, box.right = box.left + box.outerWidth;

			return extend( element.size, {
				border: border,
				padding: padding,
				margin: margin,
				ignoreScroll: ignoreScroll,
				date: +new Date()
			}, box, true );
		}

		function elementFromMouse( mouse, ignoreBox, acceptText ) {
			if ( !mouse )
				return null;

			var node = new CKEDITOR.dom.node( doc.$.elementFromPoint( mouse.x, mouse.y ) );

			// If ignoreBox is set and node is the box, it means that we
			// need to hide the box for a while, repeat elementFromPoint
			// and show it again.
			if ( ignoreBox && isBox( node ) ) {
				magicline.wrap.hide()
				node = new CKEDITOR.dom.node( doc.$.elementFromPoint( mouse.x, mouse.y ) );
				magicline.wrap.show();
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
		// an offset distance.
		function mouseNearOf( element, mouse, offset ) {
			if ( !isHtml( element ) )
				return false;

			updateSize( element );

			// Determine neighborhood by element dimensions and offsets.
			if ( inBetween( mouse.y, [ element.size.top - offset, element.size.bottom + offset ] ) && inBetween( mouse.x, [ element.size.left - offset, element.size.right + offset ] ) )
				return true;

			return false;
		}

		function updateWindowSize() {
			if ( win.date > new Date() - CACHE_TIME ) {
				DEBUG && DEBUG.log( 'win.size: get from cache' ); // %REMOVE_LINE%
				return;
			}
			DEBUG && DEBUG.log( 'win.size: capturing' ); // %REMOVE_LINE%

			var scroll = editor.window.getScrollPosition(),
				paneSize = editor.window.getViewPaneSize();

			extend( win, {
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
				},
				date: +new Date()
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

					magicline.detach();
				}
			}
		}

		// Checks if the pointer is in the upper/lower area of an element.
		// Then the procedure analyses if the there's HTML node before/after that element.
		// It also considers cases of an element being the first/last child of its parent.
		function edgeTrigger( mouse ) {
			DEBUG && DEBUG.groupStart( 'EdgeTrigger' ); // %REMOVE_LINE%

			var element = getAscendantTrigger( elementFromMouse( mouse, true, true ) );
			DEBUG && DEBUG.logElements( [ element ], [ 'Ascendant trigger' ], 'First stage' ); // %REMOVE_LINE%

			if ( !element || editable.equals( element ) ) {
				DEBUG && DEBUG.logEnd( 'ABORT. No element or element is editable.' ); // %REMOVE_LINE%
				return;
			}

			// If TRIGGER_OFFSET is larger than a half of element's height, reduce the offset.
			// If the offset wasn't reduced, top area search would cover most (all) cases.
			updateSize( element );

			var fixedOffset = Math.min( TRIGGER_OFFSET, 0 | ( element.size.outerHeight / 2 ) ),
				elementNext = element,
				elementPrevious = element;

			// Around the upper edge of an element.
			if ( inBetween( mouse.y, [
				element.size.top - 1,
				element.size.top + fixedOffset ] ) ) {
				// Search for nearest HTML element or non-empty text node.
				elementPrevious = getNonEmptyNeighbour( elementPrevious, true );

				// Real HTML element before
				if ( isHtml( elementPrevious ) ) {
					DEBUG && DEBUG.logEnd( 'Made edge trigger of EDGE_MIDDLE' ); // %REMOVE_LINE%
					return new boxTrigger( elementPrevious, element, EDGE_MIDDLE, TYPE_EDGE );
				}

				// It's a text node
				if ( elementPrevious ) {
					DEBUG && DEBUG.logEnd( 'ABORT. Previous is non-empty text node', elementPrevious ); // %REMOVE_LINE%
					return false;
				}

				// No previous element
				if ( !elementPrevious ) {
					DEBUG && DEBUG.logEnd( 'Made edge trigger of EDGE_TOP' ); // %REMOVE_LINE%
					return new boxTrigger( null, element, EDGE_TOP, TYPE_EDGE, element.equals( editable.getFirst( isRelevant ) ) ? LOOK_TOP : LOOK_NORMAL );
				}
			}

			// Around the lower edge of an element.
			else if ( inBetween( mouse.y, [
				element.size.bottom - fixedOffset,
				element.size.bottom + 1 ] ) ) {
				// Search for nearest html element or non-empty text node.
				elementNext = getNonEmptyNeighbour( elementNext );

				// Real HTML element before.
				if ( isHtml( elementNext ) ) {
					DEBUG && DEBUG.logEnd( 'Made edge trigger of EDGE_MIDDLE' ); // %REMOVE_LINE%
					return new boxTrigger( element, elementNext, EDGE_MIDDLE, TYPE_EDGE );
				}

				// It's a text node.
				if ( elementNext ) {
					DEBUG && DEBUG.logEnd( 'ABORT. Next is non-empty text node.', elementPrevious ); // %REMOVE_LINE%
					return false;
				}

				// No next element.
				if ( !elementNext ) {
					DEBUG && DEBUG.logEnd( 'Made edge trigger of EDGE_BOTTOM' ); // %REMOVE_LINE%
					return new boxTrigger( element, null, EDGE_BOTTOM, TYPE_EDGE, element.equals( editable.getLast( isRelevant ) ) && inBetween( element.size.bottom, [ win.pane.height - TRIGGER_OFFSET, win.pane.height ] ) ? LOOK_BOTTOM : LOOK_NORMAL );
				}
			}

			DEBUG && DEBUG.logEnd( 'ABORT. Not around of any edge.' ); // %REMOVE_LINE%
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
				viewPaneHeight = win.pane.height;

			while ( mouse.y + mouseStep < viewPaneHeight && mouse.y - mouseStep > 0 ) {
				if ( !upperFound )
					upperFound = !continueCriterion( upper, startElement );

				if ( !lowerFound )
					lowerFound = !continueCriterion( lower, startElement );

				// Still not found...
				if ( !upperFound && mouse.y - mouseStep > 0 )
					upper = selectCriterion({ x: mouse.x, y: mouse.y - mouseStep } );

				if ( !lowerFound && mouse.y + mouseStep < viewPaneHeight )
					lower = selectCriterion({ x: mouse.x, y: mouse.y + mouseStep } );

				if ( upperFound && lowerFound )
					break;

				// Instead of ++
				mouseStep += 5;
			}

			return new boxTrigger( upper, lower, null, null );
		}

		// Checks iteratively up and down in search for elements using elementFromMouse method.
		// Useful if between two triggers.
		function expandTrigger( mouse ) {
			DEBUG && DEBUG.groupStart( 'ExpandTrigger' ); // %REMOVE_LINE%

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

			DEBUG && DEBUG.logElements( [ upper, lower ], [ 'Upper', 'Lower' ], 'Pair found' ); // %REMOVE_LINE%

			// Success: two siblings have been found
			if ( upper && lower && areSiblings( upper, lower ) ) {
				DEBUG && DEBUG.logEnd( 'SUCCESS. Expand trigger created.' ); // %REMOVE_LINE%
				return trigger.set( EDGE_MIDDLE, TYPE_EXPAND );
			}

			DEBUG && DEBUG.logElements( [ startElement, upper, lower ], // %REMOVE_LINE%
			[ 'Start', 'Upper', 'Lower' ], 'Post-processing' ); // %REMOVE_LINE%

			// Danger. Dragons ahead.
			// No siblings have been found during previous phase, post-processing may be necessary.
			// We can traverse DOM until a valid pair of elements around the pointer is found.
			//
			// Prepare for post-processing:
			// 	1. Determine if upper and lower are children of startElement.
			//		1.1. If so, find their ascendants that are closest to startElement (one level deeper than startElement).
			//		1.2. Otherwise use first/last-child of the startElement as upper/lower. Why?:
			//			a) 	upper/lower belongs to another branch of the DOM tree.
			//			b) 	verticalSearch encountered an edge of the viewport and failed.
			// 		1.3. Make sure upper and lower still exist. Why?:
			//			a) 	Upper and lower may be not belong to the branch of the startElement (may not exist at all) and
			//				startElement has no children.
			//	2. Perform the post-processing.
			//		2.1. Make sure upper isn't a text node OR the box. Otherwise find next HTML element Why?:
			//			a) no text nodes - we need to find its dimensions.
			//			b) the box is absolutely positioned.
			//		2.2. Abort if there's no such element. Why?:
			//			a) 	startElement may contain text nodes only.
			//		2.3. Gather dimensions of an upper element.
			//		2.4. Abort if lower edge of upper is already under the mouse pointer. Why?:
			//			a) 	We expect upper to be above and lower below the mouse pointer.
			//	3. Perform iterative search while upper != lower.
			//		3.1. Find the upper-next element. If there's no such element, break current search. Why?:
			//			a)	There's no point in further search if there are only text nodes ahead.
			//		3.2. Calculate the distance between the middle point of ( upper, upperNext ) and mouse-y.
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
				DEBUG && DEBUG.logEnd( 'ABORT. There is no upper or no lower element.' ); // %REMOVE_LINE%
				return null;
			}

			// 2.1.
			if ( !isHtml( upper ) || isBox( upper ) ) {
				// 2.2.
				if ( !( upper = upper.getNext( isRelevant ) ) ) {
					DEBUG && DEBUG.logEnd( 'ABORT There is no upper next.' ); // %REMOVE_LINE%
					return null;
				}
			}

			// 2.3.
			updateSize( upper );

			var minDistance = Number.MAX_VALUE,
				currentDistance, upperNext, minElement, minElementNext;

			// 2.4.
			if ( upper.size.bottom > mouse.y ) {
				DEBUG && DEBUG.logElementsEnd( [ startElement, upper, lower ], // %REMOVE_LINE%
				[ 'Start', 'Upper', 'Lower' ], 'ABORT. Already below the pointer.' ); // %REMOVE_LINE%
				return null;
			}

			while ( lower && !lower.equals( upper ) ) {
				// 3.1.
				if ( !( upperNext = upper.getNext( isRelevant ) ) )
					break;

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

			DEBUG && DEBUG.logElements( [ minElement, minElementNext ], // %REMOVE_LINE%
			[ 'Min', 'MinNext' ], 'Post-processing results' ); // %REMOVE_LINE%

			// 3.4.
			if ( !minElement || !minElementNext ) {
				DEBUG && DEBUG.logEnd( 'ABORT. No Min or MinNext' ); // %REMOVE_LINE%
				return null;
			}

			// An element of minimal distance has been found. Assign it to the trigger.
			trigger.upper = minElement;
			trigger.lower = minElementNext;

			// Success: post-processing revealed a pair of elements.
			DEBUG && DEBUG.logEnd( 'SUCCESSFUL post-processing. Trigger created.' ); // %REMOVE_LINE%
			return trigger.set( EDGE_MIDDLE, TYPE_EXPAND );
		}

		// This method handles edge cases when:
		// 	-> Mouse is around upper/lower edge of view pane.
		// 		-> Scroll position is either minimal or maximal.
		// 			-> It's OK to show LOOK_TOP/BOTTOM type box.
		function editableTrigger( mouse ) {
			var editableFirst = editable.getFirst( isRelevant ),
				editableLast = editable.getLast( isRelevant );

			if ( !editableFirst || !editableLast )
				return;

			updateSize( editableFirst );
			updateSize( editableLast );
			updateSize( editable );

			if ( editableFirst.size.top > 0 && inBetween( mouse.y, [ 0, editableFirst.size.top + TRIGGER_OFFSET ] ) ) {
				return new boxTrigger( null, editableFirst, EDGE_TOP, TYPE_EDGE, inInlineMode() || win.scroll.y == 0 ? LOOK_TOP : LOOK_NORMAL );
			} else if ( editableLast.size.bottom < win.pane.height && inBetween( mouse.y, [ editableLast.size.bottom - TRIGGER_OFFSET, win.pane.height ] ) ) {
				return new boxTrigger( editableLast, null, EDGE_BOTTOM, TYPE_EDGE, inInlineMode() || inBetween( editableLast.size.bottom, [ win.pane.height - TRIGGER_OFFSET, win.pane.height ] ) ? LOOK_BOTTOM : LOOK_NORMAL );
			}
		}

		// A method for trigger filtering. Accepts or rejects trigger pairs
		// by their location in DOM etc.
		// TODO: This method is to be rewritten to reduce redundant conditions.
		// Until then it is ugly but easy to read.
		function triggerFilter( trigger, mouse ) {
			DEBUG && DEBUG.groupStart( 'TriggerFilter' ); // %REMOVE_LINE%

			var upper = trigger.upper,
				lower = trigger.lower;

			// NOT: one of the elements is floated/positioned
			if ( flowBreaker( lower ) || flowBreaker( upper ) ) {
				DEBUG && DEBUG.logEnd( 'REJECTED. Lower or upper are flowbreakers.' ); // %REMOVE_LINE%
				return false;
			}

			if ( trigger.is( EDGE_MIDDLE ) ) {

				if ( !upper || !lower // NOT: EDGE_MIDDLE trigger ALWAYS has two elements.
				|| lower.equals( upper ) || upper.equals( lower ) // NOT: two trigger elements, one equals another.
				|| lower.contains( upper ) || upper.contains( lower ) ) // NOT: two trigger elements, one contains another.
				{
					DEBUG && DEBUG.logEnd( 'REJECTED. No upper or no lower or they contain each other.' ); // %REMOVE_LINE%
					return false;
				}

				// YES: two trigger elements, pure siblings.
				if ( isTrigger( upper ) && isTrigger( lower ) && areSiblings( upper, lower ) ) {
					if ( trigger.is( TYPE_EXPAND ) ) {
						DEBUG && DEBUG.logElementsEnd( [ upper, lower ], // %REMOVE_LINE%
						[ 'upper', 'lower' ], 'APPROVED EDGE_MIDDLE' ); // %REMOVE_LINE%
						return true;
					}

					// Check if there's an element that is between the edge and mouse pointer.
					if ( trigger.is( TYPE_EDGE ) && !isChildBetweenPointerAndEdge( upper, mouse, true ) && !isChildBetweenPointerAndEdge( lower, mouse, false ) ) {
						DEBUG && DEBUG.logElementsEnd( [ upper, lower ], // %REMOVE_LINE%
						[ 'upper', 'lower' ], 'APPROVED EDGE_MIDDLE.' ); // %REMOVE_LINE%
						return true;
					} else {
						DEBUG && DEBUG.logElementsEnd( [ upper, lower ], // %REMOVE_LINE%
						[ 'upper', 'lower' ], 'REJECTED EDGE_MIDDLE' ); // %REMOVE_LINE%
						return false;
					}
				}
			}

			if ( trigger.is( EDGE_TOP ) ) {
				// NOT: there's a child above the pointer.
				if ( isChildBetweenPointerAndEdge( lower, mouse, false ) ) {
					DEBUG && DEBUG.logElementsEnd( [ lower ], // %REMOVE_LINE%
					[ 'lower' ], 'REJECT EDGE_TOP. Edge child above' ); // %REMOVE_LINE%
					return false;
				}

				// First child cases.
				if ( isTrigger( lower ) ) {
					// NOT: signle trigger element, a child of li/dt/dd.
					if ( lower.getParent().is( DTD_LISTITEM ) ) {
						DEBUG && DEBUG.logEnd( 'REJECT EDGE_TOP. Parent is list' ); // %REMOVE_LINE%
						return false;
					}

					// YES: single trigger element, first child.
					DEBUG && DEBUG.logElementsEnd( [ lower ], [ 'lower' ], 'APPROVED EDGE_TOP' ); // %REMOVE_LINE%
					return true;
				}
			}

			if ( trigger.is( EDGE_BOTTOM ) ) {
				// NOT: there's a child below the pointer.
				if ( isChildBetweenPointerAndEdge( upper, mouse, true ) ) {
					DEBUG && DEBUG.logElementsEnd( [ upper ], // %REMOVE_LINE%
					[ 'upper' ], 'REJECT EDGE_BOTTOM. Edge child below' ); // %REMOVE_LINE%
					return false;
				}

				// Last child cases.
				if ( isTrigger( upper ) ) {
					// NOT: signle trigger element, a child of li/dt/dd.
					if ( upper.getParent().is( DTD_LISTITEM ) ) {
						DEBUG && DEBUG.logEnd( 'REJECT EDGE_BOTTOM. Parent is list' ); // %REMOVE_LINE%
						return false;
					}

					// YES: single trigger element, last child.
					DEBUG && DEBUG.logElementsEnd( [ upper ], // %REMOVE_LINE%
					[ 'upper' ], 'APPROVED EDGE_BOTTOM' ); // %REMOVE_LINE%
					return true;
				}
			}

			DEBUG && DEBUG.logElementsEnd( [ upper, lower ], // %REMOVE_LINE%
			[ 'upper', 'lower' ], 'Rejected unknown pair' ); // %REMOVE_LINE%
			return false;
		}

		function addListeners() {
			// Global stuff is being initialized here.
			editable = editor.editable(), doc = editable.getDocument(), win = editor.window;

			// Enabling the box inside of inline editable is pointless.
			// There's no need to place paragraphs inside paragraphs, links, spans, etc.
			if ( editable.is( CKEDITOR.dtd.$inline ) )
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
			updateWindowSize();

			// This method handles mousemove mouse for box toggling.
			// It uses mouse position to determine underlying element, then
			// it tries to use different trigger type in order to place the box
			// in correct place. The following procedure is executed periodically.
			function checkMouse( mouse ) {
				DEBUG && DEBUG.groupStart( 'CheckMouse' ); // %REMOVE_LINE%
				DEBUG && DEBUG.startTimer(); // %REMOVE_LINE%

				var trigger = null,
					editableLast;

				checkMouseTimer = null;
				updateWindowSize();

				if ( checkMouseTimeoutPending //	-> There must be an event pending.
				&& !mouseNearOf( magicline, mouse, HOLD_DISTANCE ) // 	-> Mouse pointer can't be close to the box.
				&& ( element = elementFromMouse( mouse, true, true ) ) // 	-> There must be valid element.
				&& !hiddenMode // 	-> Can't be in hidden mode.
				&& editor.focusManager.hasFocus ) // 	-> Editor must have focus.
				{
					// If trigger exists, and trigger is correct -> show the box
					if ( ( trigger = editableTrigger( mouse ) || edgeTrigger( mouse ) || expandTrigger( mouse ) ) && triggerFilter( trigger, mouse ) )
						magicline.attach( editable ).place( trigger );

					// Otherwise remove the box
					else {
						trigger = false;
						magicline.detach();
					}

					DEBUG && DEBUG.showTrigger( trigger ); // %REMOVE_LINE%
					DEBUG && DEBUG.mousePos( mouse.y, element ); // %REMOVE_LINE%

					checkMouseTimeoutPending = false;
				}

				DEBUG && DEBUG.stopTimer(); // %REMOVE_LINE%
				DEBUG && DEBUG.groupEnd(); // %REMOVE_LINE%
			}

			// This method ensures that checkMouse aren't executed
			// in parallel and no more frequently than specified in timeout function.
			function checkMouseTimeout( event ) {
				clearTimeout( hideTimeout );
				checkMouseTimeoutPending = true;

				if ( !editor.mode == 'wysiwyg' || checkMouseTimer )
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

					updateWindowSize();
					updateSize( editable, true );

					// If outside of an editor...
					if ( !inBetween( mouse.x, [
						editable.size.left - win.scroll.x,
						editable.size.right - win.scroll.x
						] ) || !inBetween( mouse.y, [
						editable.size.top - win.scroll.y,
						editable.size.bottom - win.scroll.y
						] ) ) {
						clearTimeout( checkMouseTimer );
						checkMouseTimer = null;
						return magicline.detach();
					}
				}

				var dest = new newElement( event.data.$.relatedTarget || event.data.$.toElement );

				if ( !dest.$ || dest.is( 'html' ) ) {
					clearTimeout( checkMouseTimer );
					checkMouseTimer = null;
					hideTimeout = CKEDITOR.tools.setTimeout( magicline.detach, 150, magicline );
				}
			});

			// This one deactivates hidden mode of an editor which
			// prevents the box from being shown.
			editable.on( 'keyup', function( event ) {
				hiddenMode = 0;
				DEBUG && DEBUG.showHidden( hiddenMode ); // %REMOVE_LINE%
			});

			editable.on( 'keydown', function( event ) {
				if ( !editor.mode == 'wysiwyg' )
					return;

				var keyStroke = event.data.getKeystroke(),
					selection = editor.getSelection(),
					selected = selection.getStartElement();

				switch ( keyStroke ) {
					// Shift pressed
					case 2228240: // IE
					case 16:
						hiddenMode = 1;
						magicline.detach();
						break;

						// %REMOVE_START%
						// Command keystrokes
						// TODO core.keystrokehandler integration pPossibly
					case editor.config.magicline_keystrokeBefore:
						editor.execCommand( 'accessSpaceBefore' );
						event.data.preventDefault();
						break;

					case editor.config.magicline_keystrokeAfter:
						editor.execCommand( 'accessSpaceAfter' );
						event.data.preventDefault();
						break;
						// %REMOVE_END%
				}

				DEBUG && DEBUG.showHidden( hiddenMode ); // %REMOVE_LINE%
			});

			// Remove the box before an undo image is created.
			// This is important. If we didn't do that, the *undo thing* would revert the box into an editor.
			// Thanks to that, undo doesn't even know about the existence of the box.
			editor.on( 'beforeUndoImage', function( event ) {
				magicline.detach();
			});

			// Removes the box HTML from editor data string if getData is called.
			// Thanks to that, an editor never yields data polluted by the box.
			// Based on editable.js:31
			editor.on( 'beforeGetData', function( event ) {
				// If the box is in editable, remove it, set cleared data to the editor
				// and finally revert the box to avoid user distraction.
				if ( magicline.wrap.getParent() ) {
					magicline.detach();
					editor.setData( editable.getData(), null, true );
					magicline.attach( editable );
				}
			});

			// This one removes box on scroll event.
			// It is to avoid box displacement.
			win.on( 'scroll', function( event ) {
				if ( !editor.mode == 'wysiwyg' )
					return;

				magicline.detach();

				// To figure this out just look at the mouseup
				// event handler below.
				if ( env.webkit ) {
					hiddenMode = 1;

					clearTimeout( scrollTimeout );
					scrollTimeout = setTimeout( function() {
						hiddenMode = 0;
						DEBUG && DEBUG.showHidden( hiddenMode ); // %REMOVE_LINE%
					}, 50 );

					DEBUG && DEBUG.showHidden( hiddenMode ); // %REMOVE_LINE%
				}
			});

			// Those event handlers remove the box on mousedown
			// and don't reveal it until the mouse is released.
			// It is to prevent box insertion e.g. while scrolling
			// (w/ scrollbar), selecting and so on.
			win.on( 'mousedown', function( event ) {
				if ( !editor.mode == 'wysiwyg' )
					return;

				magicline.detach();
				hiddenMode = 1;

				DEBUG && DEBUG.showHidden( hiddenMode ); // %REMOVE_LINE%
			});

			// Google Chrome doesn't trigger this on the scrollbar (since 2009...)
			// so it is totally useless to check for scroll finish
			// see: http://code.google.com/p/chromium/issues/detail?id=14204
			win.on( 'mouseup', function( event ) {
				hiddenMode = 0;

				DEBUG && DEBUG.showHidden( hiddenMode ); // %REMOVE_LINE%
			});

			// This one allows testing and debugging. It reveals some
			// inner methods to the world.
			this.backdoor = {
				isHtml: isHtml,
				triggerFilter: triggerFilter,
				updateSize: updateSize,
				updateWindowSize: updateWindowSize,
				boxTrigger: boxTrigger,
				magicline: magicline
			};
		}
	};
})();

/**
 * Sets the default vertical distance between element edge and mouse pointer that
 * causes the box to appear. The distance is expressed in pixels (px).
 * @name CKEDITOR.config.magicline_triggerOffset
 * @type Number
 * @default <code>30</code>
 * @see CKEDITOR.config.magicline_holdDistance
 * @example
 * // Increases the offset to 15px.
 * CKEDITOR.config.magicline_triggerOffset  = 15;
 */
CKEDITOR.config.magicline_triggerOffset = 30;

/**
 * Defines the distance between mouse pointer and the box, within
 * which the box stays revealed and no other focus space is offered to be accessed.
 * The value is relative to {@link CKEDITOR.config.magicline_triggerOffset}.
 * @name CKEDITOR.config.magicline_holdDistance
 * @type Number
 * @default <code>.5</code>
 * @see CKEDITOR.config.magicline_triggerOffset
 * @example
 * // Increases the distance to 80% of {@link CKEDITOR.config.magicline_triggerOffset}.
 * CKEDITOR.config.magicline_holdDistance = .8;
 */
CKEDITOR.config.magicline_holdDistance = .5;

// %REMOVE_START%
/**
 * Defines default keystroke that inserts new paragraph before an element that
 * holds start of the current selection or just simply holds the caret.
 * @name CKEDITOR.config.magicline_keystrokeBefore
 * @type Number
 * @default <code>CKEDITOR.CTRL + CKEDITOR.SHIFT + 219 // CTRL + SHIFT + [</code>
 * @example
 * // Changes keystroke to CTRL + SHIFT + ,
 * CKEDITOR.config.magicline_keystrokeBefore = CKEDITOR.CTRL + CKEDITOR.SHIFT + 188;
 */
CKEDITOR.config.magicline_keystrokeBefore = CKEDITOR.CTRL + CKEDITOR.SHIFT + 219, // CTRL + SHIFT + [
/**
 * Defines default keystroke that inserts new paragraph after an element that
 * holds start of the current selection or just simply holds the caret.
 * @name CKEDITOR.config.magicline_keystrokeBefore
 * @type Number
 * @default <code>CKEDITOR.CTRL + CKEDITOR.SHIFT + 221 // CTRK + SHIFT + ]</code>
 * @example
 * // Changes keystroke to CTRL + SHIFT + .
 * CKEDITOR.config.magicline_keystrokeBefore = CKEDITOR.CTRL + CKEDITOR.SHIFT + 190;
 */
CKEDITOR.config.magicline_keystrokeAfter = CKEDITOR.CTRL + CKEDITOR.SHIFT + 221, // CTRL + SHIFT + ],
// %REMOVE_END%
/**
 * Defines box color. The color may be adjusted to enhance readability.
 * @name CKEDITOR.config.magicline_boxColor
 * @type String
 * @default <code>'#FF0000'</code>
 * @example
 * // Changes color to blue.
 * CKEDITOR.config.magicline_boxColor = '#0000FF';
 */
CKEDITOR.config.magicline_boxColor = '#FF0000';

/**
 * Defines box opacity. The opacity may be adjusted to enhance readability
 * by revealing underlying elements.
 * @name CKEDITOR.config.magicline_boxOpacity
 * @type Number
 * @default <code>1</code>
 * @example
 * // Changes opacity to 30%.
 * CKEDITOR.config.magicline_boxOpacity = .3;
 */
CKEDITOR.config.magicline_boxOpacity = 1;

/**
 * Activates plugin mode that considers all focus spaces between
 * {@link CKEDITOR.dtd.$block} elements as accessible by the box.
 * @name CKEDITOR.config.magicline_putEverywhere
 * @type Boolean
 * @default <code>false</code>
 * @example
 * // Enables "put everywhere" mode.
 * CKEDITOR.config.magicline_putEverywhere = true;
 */
CKEDITOR.config.magicline_putEverywhere = false;
