/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Allows accessing difficult focus spaces.
 */

'use strict';

(function() {
	CKEDITOR.plugins.add( 'magicline', {
		lang: [ 'en', 'pl' ],
		init: initPlugin
	});

	// Activates the box inside of an editor.
	function initPlugin( editor ) {
		// Configurables
		var config = editor.config,
			triggerOffset = config.magicline_triggerOffset || 30,
			that = {
				// Global stuff is being initialized here.
				editor: editor,
				triggerOffset: triggerOffset,
				holdDistance: 0 | triggerOffset * ( config.magicline_holdDistance || .5 ),
				boxColor: config.magicline_color || '#ff0000',
				rtl: config.contentsLangDirection == 'rtl',
				triggers: config.magicline_everywhere || false ? CKEDITOR.dtd.$block : { table:1,hr:1,div:1,ul:1,ol:1,dl:1 },
				listeners: []
			},
			scrollTimeout, hideTimeout, checkMouseTimeoutPending, checkMouseTimeout, checkMouseTimer;

		// Simple irrelevant elements filter.
		that.isRelevant = function( node ) {
			return isHtml( node ) 			// 	-> Node must be an existing HTML element.
				&& !isLine( that, node ) 	// 	-> Node can be neither the box nor its child.
				&& !isFlowBreaker( node ); 	// 	-> Node can be neither floated nor positioned nor aligned.
		};

		// %REMOVE_START%
		// Editor commands for accessing difficult focus spaces.
		editor.addCommand( 'accessSpaceBefore', accessSpaceCommand( that ) );
		editor.addCommand( 'accessSpaceAfter', accessSpaceCommand( that, true ) );
		// %REMOVE_END%
		editor.on( 'contentDom', addListeners, this );
		// Fixes #173: Remove listeners before detaching old iframe, so IEs won't throw 'Permission denied' errors
		// when trying to remove them later (on next 'contentDom' event).
		editor.on( 'contentDomUnload', function() { removeListeners( that ); });

		function addListeners() {
			var editable = editor.editable(),
				doc = editor.document,
				win = editor.window,
				listener;

			// Remove old listeners which could left after previous DOM
			// (contentDom is fired on all setData() when wysiwyg area is used).
			removeListeners( that );

			// Global stuff is being initialized here.
			extend( that, {
				editable: editable,
				doc: doc,
				win: win
			}, true );

			// Enabling the box inside of inline editable is pointless.
			// There's no need to place paragraphs inside paragraphs, links, spans, etc.
			if ( editable.is( CKEDITOR.dtd.$inline ) )
				return;

			// Handle in-line editing by setting appropriate position.
			// If current position is static, make it relative and clear top/left coordinates.
			if ( inInlineMode( that ) && !isPositioned( editable ) ) {
				editable.setStyles({
					position: 'relative',
					top: null,
					left: null
				});
			}
			// Enable the box. Let it produce children elements, initialize
			// event handlers and own methods.
			initLine.call( this, that );

			// Get view dimensions and scroll positions.
			// At this stage (before any checkMouse call) it is used mostly
			// by tests. Nevertheless it a crucial thing.
			updateWindowSize( that );

			// Remove the box before an undo image is created.
			// This is important. If we didn't do that, the *undo thing* would revert the box into an editor.
			// Thanks to that, undo doesn't even know about the existence of the box.
			addListener( that, editor, 'beforeUndoImage', function() {
				that.line.detach();
			});

			// Removes the box HTML from editor data string if getData is called.
			// Thanks to that, an editor never yields data polluted by the box.
			// Listen with very high priority, so line will be removed before other
			// listeners will see it.
			addListener( that, editor, 'beforeGetData', function() {
				// If the box is in editable, remove it.
				if ( that.line.wrap.getParent() ) {
					that.line.detach();

					// Restore line in the last listener for 'getData'.
					editor.once( 'getData', function() {
						that.line.attach();
					}, null, null, 1000 );
				}
			}, 0 );

			// Hide the box on mouseout if mouse leaves document.
			addListener( that, doc, 'mouseout', function( event ) {
				if ( editor.mode != 'wysiwyg' )
					return;

				clearTimeout( hideTimeout );

				// Check for inline-mode editor. If so, check mouse position
				// and remove the box if mouse outside of an editor.
				if ( inInlineMode( that ) ) {
					var mouse = {
						x: event.data.$.clientX,
						y: event.data.$.clientY
					};

					updateWindowSize( that );
					updateEditableSize( that, true )

					var size = that.view.editable,
						scroll = that.view.scroll;

					// If outside of an editor...
					if ( !inBetween( mouse.x, size.left - scroll.x, size.right - scroll.x ) || !inBetween( mouse.y, size.top - scroll.y, size.bottom - scroll.y ) ) {
						clearTimeout( checkMouseTimer );
						checkMouseTimer = null;
						return that.line.detach();
					}
				}

				var dest = new newElement( event.data.$.relatedTarget || event.data.$.toElement, doc );

				if ( !dest.$ || dest.is( 'html' ) ) {
					clearTimeout( checkMouseTimer );
					checkMouseTimer = null;
					hideTimeout = CKEDITOR.tools.setTimeout( that.line.detach, 150, that.line );
				}
			});

			// This one deactivates hidden mode of an editor which
			// prevents the box from being shown.
			addListener( that, editable, 'keyup', function( event ) {
				that.hiddenMode = 0;
				DEBUG && DEBUG.showHidden( that.hiddenMode ); // %REMOVE_LINE%
			});

			addListener( that, editable, 'keydown', function( event ) {
				if ( editor.mode != 'wysiwyg' )
					return;

				var keyStroke = event.data.getKeystroke(),
					selection = editor.getSelection(),
					selected = selection.getStartElement();

				switch ( keyStroke ) {
					// Shift pressed
					case 2228240: // IE
					case 16:
						that.hiddenMode = 1;
						that.line.detach();
				}

				DEBUG && DEBUG.showHidden( that.hiddenMode ); // %REMOVE_LINE%
			});

			// This method ensures that checkMouse aren't executed
			// in parallel and no more frequently than specified in timeout function.
			// In framed editor, document is used as a trigger, to provide magicline
			// functionality when mouse is below the body (short content, short body).
			addListener( that, ( inInlineMode( that ) ? editable : doc ), 'mousemove', function( event ) {
				clearTimeout( hideTimeout );
				checkMouseTimeoutPending = true;

				if ( editor.mode != 'wysiwyg' || checkMouseTimer )
					return;

				// IE<9 requires this event-driven object to be created
				// outside of the setTimeout statement.
				// Otherwise it loses the event object with its properties.
				var mouse = {
					x: event.data.$.clientX,
					y: event.data.$.clientY
				};

				checkMouseTimer = setTimeout( function() {
					checkMouse( mouse );
				}, 30 ); // balances performance and accessibility
			});

			// This one removes box on scroll event.
			// It is to avoid box displacement.
			addListener( that, win, 'scroll', function( event ) {
				if ( editor.mode != 'wysiwyg' )
					return;

				that.line.detach();

				// To figure this out just look at the mouseup
				// event handler below.
				if ( env.webkit ) {
					that.hiddenMode = 1;

					clearTimeout( scrollTimeout );
					scrollTimeout = setTimeout( function() {
						that.hiddenMode = 0;
						DEBUG && DEBUG.showHidden( that.hiddenMode ); // %REMOVE_LINE%
					}, 50 );

					DEBUG && DEBUG.showHidden( that.hiddenMode ); // %REMOVE_LINE%
				}
			});

			// Those event handlers remove the box on mousedown
			// and don't reveal it until the mouse is released.
			// It is to prevent box insertion e.g. while scrolling
			// (w/ scrollbar), selecting and so on.
			addListener( that, win, 'mousedown', function( event ) {
				if ( editor.mode != 'wysiwyg' )
					return;

				that.line.detach();
				that.hiddenMode = 1;

				DEBUG && DEBUG.showHidden( that.hiddenMode ); // %REMOVE_LINE%
			});

			// Google Chrome doesn't trigger this on the scrollbar (since 2009...)
			// so it is totally useless to check for scroll finish
			// see: http://code.google.com/p/chromium/issues/detail?id=14204
			addListener( that, win, 'mouseup', function( event ) {
				that.hiddenMode = 0;
				DEBUG && DEBUG.showHidden( that.hiddenMode ); // %REMOVE_LINE%
			});

			// This method handles mousemove mouse for box toggling.
			// It uses mouse position to determine underlying element, then
			// it tries to use different trigger type in order to place the box
			// in correct place. The following procedure is executed periodically.
			function checkMouse( mouse ) {
				DEBUG && DEBUG.groupStart( 'CheckMouse' ); // %REMOVE_LINE%
				DEBUG && DEBUG.startTimer(); // %REMOVE_LINE%

				that.mouse = mouse;
				that.trigger = null;

				checkMouseTimer = null;
				updateWindowSize( that );

				if ( checkMouseTimeoutPending 								//	-> There must be an event pending.
					&& !that.hiddenMode 									// 	-> Can't be in hidden mode.
					&& editor.focusManager.hasFocus 						// 	-> Editor must have focus.
					&& !that.line.mouseNear() 								// 	-> Mouse pointer can't be close to the box.
					&& ( that.element = elementFromMouse( that, true ) ) ) 	// 	-> There must be valid element.
				{
					// If trigger exists, and trigger is correct -> show the box
					if ( ( that.trigger = triggerEditable( that ) || triggerEdge( that ) || triggerExpand( that ) ) && triggerFilter( that ) )
						that.line.attach().place();

					// Otherwise remove the box
					else {
						that.trigger = null;
						that.line.detach();
					}

					DEBUG && DEBUG.showTrigger( that.trigger ); // %REMOVE_LINE%
					DEBUG && DEBUG.mousePos( mouse.y, that.element ); // %REMOVE_LINE%

					checkMouseTimeoutPending = false;
				}

				DEBUG && DEBUG.stopTimer(); // %REMOVE_LINE%
				DEBUG && DEBUG.groupEnd(); // %REMOVE_LINE%
			}

			// This one allows testing and debugging. It reveals some
			// inner methods to the world.
			this.backdoor = {
				boxTrigger: boxTrigger,
				isHtml: isHtml,
				isLine: isLine,
				getAscendantTrigger: getAscendantTrigger,
				getNonEmptyNeighbour: getNonEmptyNeighbour,
				getSize: getSize,
				triggerFilter: triggerFilter,
				that: that,
				updateSize: updateSize,
				updateWindowSize: updateWindowSize
			};
		}
	}

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
		DTD_LISTITEM = CKEDITOR.dtd.$listItem,

		// Minimum time that must elapse between two update*Size calls.
		// It prevents constant getComuptedStyle calls and improves performance.
		CACHE_TIME = 100,

		// Shared CSS stuff for box elements
		CSS_COMMON = 'width:0px;height:0px;padding:0px;margin:0px;display:block;' + 'z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;',
		CSS_TRIANGLE = CSS_COMMON + 'border-color:transparent;display:block;border-style:solid;',
		TRIANGLE_HTML = '<span>' + WHITE_SPACE + '</span>',

		// %REMOVE_START%
		// Internal DEBUG uses tools located in the topmost window.
		DEBUG = window.top.DEBUG,
		// %REMOVE_END%

		// Some shorthands for common methods to save bytes
		extend = CKEDITOR.tools.extend,
		newElement = CKEDITOR.dom.element,
		newElementFromHtml = newElement.createFromHtml,
		env = CKEDITOR.env;

	// %REMOVE_START%
	// Inserts new paragraph on demand by looking for closest parent trigger
	// or using current element under the caret as reference.
	function accessSpaceCommand( that, insertAfter ) {
		return {
			canUndo: true,
			modes: { wysiwyg:1 },
			exec: function( editor ) {
				var selection = editor.getSelection(),
					selected = selection.getStartElement(),
					range = selection.getRanges()[ 0 ],
					target = getAscendantTrigger( that, selected ) || selected;

				if ( !isHtml( target ) )
					return;

				insertParagraph( that, function( paragraph ) {
					if ( target.equals( that.editable ) )
						range.insertNode( paragraph );
					else
						paragraph[ insertAfter ? 'insertAfter' : 'insertBefore' ]( target );
				});

				that.line.detach();
			}
		}
	}
	// %REMOVE_END%

	function addListener( that, obj, name, listener, priority ) {
		that.listeners.push( obj.on( name, listener, null, null, priority ) );
	}

	function areSiblings( that, upper, lower ) {
		return isHtml( upper ) && isHtml( lower ) && lower.equals( upper.getNext( that.isRelevant ) );
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
			return ( this.properties & property ) == property;
		}
	};

	function elementFromMouse( that, ignoreBox ) {
		if ( !that.mouse )
			return null;

		var doc = that.doc,
			lineWrap = that.line.wrap,
			mouse = that.mouse,
			element = new CKEDITOR.dom.element( doc.$.elementFromPoint( mouse.x, mouse.y ) );

		// If ignoreBox is set and element is the box, it means that we
		// need to hide the box for a while, repeat elementFromPoint
		// and show it again.
		if ( ignoreBox && isLine( that, element ) ) {
			lineWrap.hide()
			element = new CKEDITOR.dom.element( doc.$.elementFromPoint( mouse.x, mouse.y ) );
			lineWrap.show();
		}

		if ( !isHtml( element ) )
			return null;

		return element;
	}

	// Gets the closest parent node that belongs to triggers group.
	function getAscendantTrigger( that, node ) {
		if ( !node )
			return null;

		var trigger;

		if ( isHtml( node ) )
			return ( trigger = node.getAscendant( that.triggers, true ) ) && !trigger.contains( that.editable ) ? trigger : null;

		return null;
	}

	function getMidpoint( that, upper, lower ) {
		updateSize( that, upper );
		updateSize( that, lower );

		var upperSizeBottom = upper.size.bottom,
			lowerSizeTop = lower.size.top;

		return upperSizeBottom && lowerSizeTop ? 0 | ( upperSizeBottom + lowerSizeTop ) / 2 : upperSizeBottom || lowerSizeTop;
	}

	// Get nearest node (either text or HTML), but omit all empty
	// text nodes (containing white characters only).
	function getNonEmptyNeighbour( that, node, goBack ) {
		var nodeParent = node.getParent();

		if ( !nodeParent )
			return;

		var range = new CKEDITOR.dom.range( that.doc );

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
			if ( isNotComment( node ) && ( !isEmptyTextNode( node ) || isHtml( node ) ) ) {
				edgeNode = node;
				return false;
			}
		};

		while ( walker[ goBack ? 'previous' : 'next' ]() ) {};

		return edgeNode;
	}

	function inBetween( val, lower, upper ) {
		return val > lower && val < upper;
	}

	function inInlineMode( that ) {
		var editable = that.editor.editable();
		return editable.getDocument().equals( CKEDITOR.document );
	}

	function initLine( that ) {
		var doc = that.doc,
			// This the main box element that holds triangles and the insertion button
			line = newElementFromHtml( '<span contenteditable="false" style="' + CSS_COMMON + 'position:absolute;border-top:1px dashed ' + that.boxColor + '"></span>', doc );

		extend( line, {

			attach: function() {
				// Only if not already attached
				if ( !this.wrap.getParent() )
					this.wrap.appendTo( that.editable );

				return this;
			},

			// Looks are as follows: [ LOOK_TOP, LOOK_BOTTOM, LOOK_NORMAL ].
			lineChildren: [
				extend(
					newElementFromHtml( '<span title="' + that.editor.lang.magicline.title +
						'" contenteditable="false">' + WHITE_SPACE + '</span>', doc ), {
					base: CSS_COMMON + 'height:17px;width:17px;' + ( that.rtl ? 'left' : 'right' ) + ':17px;'
						+ 'background:url(' + this.path + 'images/icon.png) center no-repeat ' + that.boxColor
						+ ';cursor:' + ( env.opera ? 'auto' : 'pointer' ) + ';', // cursor:pointer causes mouse flickering in opera
					looks: [
						'top:-8px;' + CKEDITOR.tools.cssVendorPrefix( 'border-radius', '2px', 1 ),
						'top:-17px;' + CKEDITOR.tools.cssVendorPrefix( 'border-radius', '2px 2px 0px 0px', 1 ),
						'top:-1px;' + CKEDITOR.tools.cssVendorPrefix( 'border-radius', '0px 0px 2px 2px', 1 )
					]
				}),
				extend( newElementFromHtml( TRIANGLE_HTML, doc ), {
					base: CSS_TRIANGLE + 'left:0px;border-left-color:' + that.boxColor + ';',
					looks: [
						'border-width:8px 0 8px 8px;top:-8px',
						'border-width:8px 0 0 8px;top:-8px',
						'border-width:0 0 8px 8px;top:0px'
					]
				}),
				extend( newElementFromHtml( TRIANGLE_HTML, doc ), {
					base: CSS_TRIANGLE + 'right:0px;border-right-color:' + that.boxColor + ';',
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

			// Checks whether mouseY is around an element by comparing boundaries and considering
			// an offset distance.
			mouseNear: function() {
				DEBUG && DEBUG.groupStart( 'mouseNear' ); // %REMOVE_LINE%

				updateSize( that, this );
				var offset = that.holdDistance,
					size = this.size;

				// Determine neighborhood by element dimensions and offsets.
				if ( size && inBetween( that.mouse.y, size.top - offset, size.bottom + offset ) && inBetween( that.mouse.x, size.left - offset, size.right + offset ) ) {
					DEBUG && DEBUG.logEnd( 'Mouse is near.' ); // %REMOVE_LINE%
					return true;
				}

				DEBUG && DEBUG.logEnd( 'Mouse isn\'t near.' ); // %REMOVE_LINE%
				return false;
			},

			// Adjusts position of the box according to the trigger properties.
			// If also affects look of the box depending on the type of the trigger.
			place: function() {
				var view = that.view,
					editable = that.editable,
					trigger = that.trigger,
					upper = trigger.upper,
					lower = trigger.lower,
					any = upper || lower,
					parent = any.getParent(),
					styleSet = {};

				// Save recent trigger for further insertion.
				// It is necessary due to the fact, that that.trigger may
				// contain different boxTrigger at the moment of insertion
				// or may be even null.
				this.trigger = trigger;

				upper && updateSize( that, upper, true );
				lower && updateSize( that, lower, true );
				updateSize( that, parent, true );

				// Yeah, that's gonna be useful in inline-mode case.
				if ( inInlineMode( that ) )
					updateEditableSize( that, true );

				// Set X coordinate (left, right, width).
				if ( parent.equals( editable ) ) {
					styleSet.left = view.scroll.x;
					styleSet.right = -view.scroll.x;
					styleSet.width = '';
				} else {
					styleSet.left = any.size.left - any.size.margin.left + view.scroll.x - ( inInlineMode( that ) ? view.editable.left + view.editable.border.left : 0 );
					styleSet.width = any.size.outerWidth + any.size.margin.left + any.size.margin.right + view.scroll.x;
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
				if ( trigger.is( LOOK_TOP ) || inBetween( styleSet.top, view.scroll.y - 15, view.scroll.y + 5 ) ) {
					styleSet.top = inInlineMode( that ) ? 0 : view.scroll.y;
					this.look( LOOK_TOP );
				} else if ( trigger.is( LOOK_BOTTOM ) || inBetween( styleSet.top, view.pane.bottom - 5, view.pane.bottom + 15 ) ) {
					styleSet.top = inInlineMode( that ) ?
							view.editable.height + view.editable.padding.top + view.editable.padding.bottom
						:
							view.pane.bottom - 1;

					this.look( LOOK_BOTTOM );
				} else {
					if ( inInlineMode( that ) )
						styleSet.top -= view.editable.top + view.editable.border.top;

					this.look( LOOK_NORMAL );
				}

				// 1px bug here...
				if ( inInlineMode( that ) )
					styleSet.top--;

				// Append `px` prefixes.
				for ( var style in styleSet )
					styleSet[ style ] = CKEDITOR.tools.cssLength( styleSet[ style ] );

				this.setStyles( styleSet );
			},

			// Changes look of the box according to current needs.
			// Three different styles are available: [ LOOK_TOP, LOOK_BOTTOM, LOOK_NORMAL ].
			look: function( look ) {
				if ( this.oldLook == look )
					return;

				for ( var i = this.lineChildren.length, child; i--; )
					( child = this.lineChildren[ i ] ).setAttribute( 'style', child.base + child.looks[ 0 | look / 2 ] );

				this.oldLook = look;
			},

			wrap: new newElement( 'span', that.doc )

		});

		// Insert children into the box.
		for ( var i = line.lineChildren.length; i--; )
			line.lineChildren[ i ].appendTo( line );

		// Set default look of the box.
		line.look( LOOK_NORMAL );

		// Using that wrapper prevents IE (8,9) from resizing editable area at the moment
		// of box insertion. This works thanks to the fact, that positioned box is wrapped by
		// an inline element. So much tricky.
		line.appendTo( line.wrap );

		// Make the box unselectable.
		line.unselectable();

		line.setOpacity( that.editor.config.magicline_opacity || 1 );

		// Handle paragraph inserting.
		line.lineChildren[ 0 ].on( 'mouseup', function( event ) {
			line.detach();

			insertParagraph( that, function( paragraph ) {
				// Use old trigger that was saved by 'place' method. Look: line.place
				var trigger = that.line.trigger;

				paragraph[ trigger.is( EDGE_TOP ) ? 'insertBefore' : 'insertAfter' ]
					( trigger.is( EDGE_TOP ) ? trigger.lower : trigger.upper );
			});

			that.hotParagraph.scrollIntoView();
			event.data.preventDefault( true );
		});

		// Prevents IE9 from displaying the resize box and disables drag'n'drop functionality.
		line.on( 'mousedown', function( event ) {
			event.data.preventDefault( true );
		});

		that.line = line;
	}

	// Creates new paragraph filled with dummy white-space.
	// It inserts the paragraph according to insertFunction.
	// Then the method selects the non-breaking space making the paragraph ready for typing.
	function insertParagraph( that, insertFunction ) {
		var paragraph = new newElement( 'p', that.doc ),
			range = new CKEDITOR.dom.range( that.doc ),
			dummy = that.doc.createText( WHITE_SPACE ),
			editor = that.editor;

		editor.fire( 'saveSnapshot' );

		insertFunction( paragraph );
		dummy.appendTo( paragraph );
		range.moveToPosition( paragraph, CKEDITOR.POSITION_AFTER_START );
		editor.getSelection().selectRanges( [ range ] );
		that.hotParagraph = paragraph;

		editor.fire( 'saveSnapshot' );
	}

	function isLine( that, node ) {
		if ( !isHtml( node ) )
			return false;

		var line = that.line;

		return node.equals( line.wrap ) || line.wrap.contains( node );
	}

	// Is text node containing white-spaces only?
	var isEmptyTextNode = CKEDITOR.dom.walker.whitespaces();

	// Is fully visible HTML node?
	function isHtml( node ) {
		return node &&
			node.type == CKEDITOR.NODE_ELEMENT &&
			node.$ && // IE requires that
			node.$.offsetHeight &&
			node.$.offsetWidth;
	}

	function isFloated( element ) {
		if ( !isHtml( element ) )
			return false;

		var options = { left:1,right:1,center:1 };

		return !!( options[ element.getComputedStyle( 'float' ) ] || options[ element.getAttribute( 'align' ) ] );
	}

	function isFlowBreaker( element ) {
		if ( !isHtml( element ) )
			return false;

		return isPositioned( element ) || isFloated( element );
	}

	// Isn't node of NODE_COMMENT type?
	var isNotComment = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_COMMENT, true );

	function isPositioned( element ) {
		return !!{ absolute:1,fixed:1,relative:1 }[ element.getComputedStyle( 'position' ) ];
	}

	// Is text node?
	function isTextNode( node ) {
		return node && node.type == CKEDITOR.NODE_TEXT;
	}

	function isTrigger( that, element ) {
		return isHtml( element ) ? element.is( that.triggers ) : null;
	}

	function isChildBetweenPointerAndEdge( that, parent, edgeBottom ) {
		var edgeChild = parent[ edgeBottom ? 'getLast' : 'getFirst' ]( that.isRelevant );

		if ( !edgeChild )
			return false;

		updateSize( that, edgeChild );

		return edgeBottom ? edgeChild.size.top > that.mouse.y : edgeChild.size.bottom < that.mouse.y;
	}

	// This method handles edge cases when:
	// 	-> Mouse is around upper/lower edge of view pane.
	// 		-> Scroll position is either minimal or maximal.
	// 			-> It's OK to show LOOK_TOP/BOTTOM type box.
	function triggerEditable( that ) {
		var editable = that.editable,
			editableFirst = editable.getFirst( that.isRelevant ),
			editableLast = editable.getLast( that.isRelevant ),
			mouse = that.mouse,
			view = that.view,
			triggerOffset = that.triggerOffset;

		if ( !editableFirst || !editableLast )
			return;

		updateSize( that, editableFirst );
		updateSize( that, editableLast );
		updateEditableSize( that );

		if ( editableFirst.size.top > 0 && inBetween( mouse.y, 0, editableFirst.size.top + triggerOffset ) ) {
			return new boxTrigger( null, editableFirst, EDGE_TOP, TYPE_EDGE, inInlineMode( that ) || view.scroll.y == 0 ? LOOK_TOP : LOOK_NORMAL );
		} else if ( editableLast.size.bottom < view.pane.height && inBetween( mouse.y, editableLast.size.bottom - triggerOffset, view.pane.height ) ) {
			return new boxTrigger( editableLast, null, EDGE_BOTTOM, TYPE_EDGE, inInlineMode( that ) || inBetween( editableLast.size.bottom, view.pane.height - triggerOffset, view.pane.height ) ? LOOK_BOTTOM : LOOK_NORMAL );
		}
	}

	// Checks if the pointer is in the upper/lower area of an element.
	// Then the procedure analyses if the there's HTML node before/after that element.
	// It also considers cases of an element being the first/last child of its parent.
	function triggerEdge( that ) {
		DEBUG && DEBUG.groupStart( 'triggerEdge' ); // %REMOVE_LINE%

		var element = getAscendantTrigger( that, elementFromMouse( that, true ) );
		DEBUG && DEBUG.logElements( [ element ], [ 'Ascendant trigger' ], 'First stage' ); // %REMOVE_LINE%

		if ( !element || that.editable.equals( element ) ) {
			DEBUG && DEBUG.logEnd( 'ABORT. No element or element is editable.' ); // %REMOVE_LINE%
			return;
		}

		// If that.triggerOffset is larger than a half of element's height, reduce the offset.
		// If the offset wasn't reduced, top area search would cover most (all) cases.
		updateSize( that, element );

		var fixedOffset = Math.min( that.triggerOffset, 0 | ( element.size.outerHeight / 2 ) ),
			elementNext = element,
			elementPrevious = element;

		// Around the upper edge of an element.
		if ( inBetween( that.mouse.y, element.size.top - 1, element.size.top + fixedOffset ) ) {
			// Search for nearest HTML element or non-empty text node.
			elementPrevious = getNonEmptyNeighbour( that, elementPrevious, true );

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
			DEBUG && DEBUG.logEnd( 'Made edge trigger of EDGE_TOP' ); // %REMOVE_LINE%
			return new boxTrigger( null, element, EDGE_TOP, TYPE_EDGE, element.equals( that.editable.getFirst( that.isRelevant ) ) ? LOOK_TOP : LOOK_NORMAL );
		}

		// Around the lower edge of an element.
		else if ( inBetween( that.mouse.y, element.size.bottom - fixedOffset, element.size.bottom + 1 ) ) {
			// Search for nearest html element or non-empty text node.
			elementNext = getNonEmptyNeighbour( that, elementNext, false );

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
			DEBUG && DEBUG.logEnd( 'Made edge trigger of EDGE_BOTTOM' ); // %REMOVE_LINE%
			return new boxTrigger( element, null, EDGE_BOTTOM, TYPE_EDGE, element.equals( that.editable.getLast( that.isRelevant ) ) && inBetween( element.size.bottom, that.view.pane.height - that.triggerOffset, that.view.pane.height ) ? LOOK_BOTTOM : LOOK_NORMAL );
		}

		DEBUG && DEBUG.logEnd( 'ABORT. Not around of any edge.' ); // %REMOVE_LINE%
		return false;
	}

	// Checks iteratively up and down in search for elements using elementFromMouse method.
	// Useful if between two triggers.
	function triggerExpand( that ) {
		DEBUG && DEBUG.groupStart( 'triggerExpand' ); // %REMOVE_LINE%

		var startElement = elementFromMouse( that, true ),
			upper, lower, trigger;

		if ( !isHtml( startElement ) )
			return null;

		trigger = verticalSearch( that,
			function( current, startElement ) {
				return startElement.equals( current );
			}, function( that ) {
				return elementFromMouse( that, true );
			}, startElement ),

		upper = trigger.upper,
		lower = trigger.lower;

		DEBUG && DEBUG.logElements( [ upper, lower ], [ 'Upper', 'Lower' ], 'Pair found' ); // %REMOVE_LINE%

		// Success: two siblings have been found
		if ( areSiblings( that, upper, lower ) ) {
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
		if ( upper && startElement.contains( upper ) ) {
			while ( !upper.getParent().equals( startElement ) )
				upper = upper.getParent();
		} else
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
		if ( !isHtml( upper ) || isLine( that, upper ) ) {
			// 2.2.
			if ( !( upper = upper.getNext( that.isRelevant ) ) ) {
				DEBUG && DEBUG.logEnd( 'ABORT There is no upper next.' ); // %REMOVE_LINE%
				return null;
			}
		}

		// 2.3.
		updateSize( that, upper );

		var minDistance = Number.MAX_VALUE,
			currentDistance, upperNext, minElement, minElementNext;

		// 2.4.
		if ( upper.size.bottom > that.mouse.y ) {
			DEBUG && DEBUG.logElementsEnd( [ startElement, upper, lower ], // %REMOVE_LINE%
				[ 'Start', 'Upper', 'Lower' ], 'ABORT. Already below the pointer.' ); // %REMOVE_LINE%

			return null;
		}

		while ( lower && !lower.equals( upper ) ) {
			// 3.1.
			if ( !( upperNext = upper.getNext( that.isRelevant ) ) )
				break;

			// 3.2.
			currentDistance = Math.abs( getMidpoint( that, upper, upperNext ) - that.mouse.y );

			// 3.3.
			if ( currentDistance < minDistance ) {
				minDistance = currentDistance;
				minElement = upper;
				minElementNext = upperNext;
			}

			upper = upperNext;
			updateSize( that, upper );
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

	// A method for trigger filtering. Accepts or rejects trigger pairs
	// by their location in DOM etc.
	function triggerFilter( that ) {
		DEBUG && DEBUG.groupStart( 'TriggerFilter' ); // %REMOVE_LINE%

		var trigger = that.trigger,
			upper = trigger.upper,
			lower = trigger.lower;

		// NOT: one of the elements is floated/positioned
		if ( isFlowBreaker( lower ) || isFlowBreaker( upper ) ) {
			DEBUG && DEBUG.logEnd( 'REJECTED. Lower or upper are isFlowBreakers.' ); // %REMOVE_LINE%
			return false;
		} else if ( trigger.is( EDGE_MIDDLE ) ) {
			if ( !upper || !lower // NOT: EDGE_MIDDLE trigger ALWAYS has two elements.
			|| lower.equals( upper ) || upper.equals( lower ) // NOT: two trigger elements, one equals another.
			|| lower.contains( upper ) || upper.contains( lower ) ) // NOT: two trigger elements, one contains another.
			{
				DEBUG && DEBUG.logEnd( 'REJECTED. No upper or no lower or they contain each other.' ); // %REMOVE_LINE%

				return false;
			}

			// YES: two trigger elements, pure siblings.
			else if ( isTrigger( that, upper ) && isTrigger( that, lower ) && areSiblings( that, upper, lower ) ) {
				if ( trigger.is( TYPE_EXPAND ) ) {
					DEBUG && DEBUG.logElementsEnd( [ upper, lower ], // %REMOVE_LINE%
						[ 'upper', 'lower' ], 'APPROVED EDGE_MIDDLE' ); // %REMOVE_LINE%

					return true;
				}

				// Check if there's an element that is between the edge and mouse pointer.
				if ( trigger.is( TYPE_EDGE ) && !isChildBetweenPointerAndEdge( that, upper, true ) && !isChildBetweenPointerAndEdge( that, lower, false ) ) {
					DEBUG && DEBUG.logElementsEnd( [ upper, lower ], // %REMOVE_LINE%
						[ 'upper', 'lower' ], 'APPROVED EDGE_MIDDLE.' ); // %REMOVE_LINE%

					return true;
				} else {
					DEBUG && DEBUG.logElementsEnd( [ upper, lower ], // %REMOVE_LINE%
						[ 'upper', 'lower' ], 'REJECTED EDGE_MIDDLE' ); // %REMOVE_LINE%

					return false;
				}
			}
		} else if ( trigger.is( EDGE_TOP ) ) {
			// NOT: there's a child above the pointer.
			if ( isChildBetweenPointerAndEdge( that, lower, false ) ) {
				DEBUG && DEBUG.logElementsEnd( [ lower ], // %REMOVE_LINE%
					[ 'lower' ], 'REJECT EDGE_TOP. Edge child above' ); // %REMOVE_LINE%

				return false;
			}

			// First child cases.
			else if ( isTrigger( that, lower ) ) {
				// NOT: signle trigger element, a child of li/dt/dd.
				if ( lower.getParent().is( DTD_LISTITEM ) ) {
					DEBUG && DEBUG.logEnd( 'REJECT EDGE_TOP. Parent is list' ); // %REMOVE_LINE%
					return false;
				}

				// YES: single trigger element, first child.
				DEBUG && DEBUG.logElementsEnd( [ lower ], [ 'lower' ], 'APPROVED EDGE_TOP' ); // %REMOVE_LINE%
				return true;
			}
		} else if ( trigger.is( EDGE_BOTTOM ) ) {
			// NOT: there's a child below the pointer.
			if ( isChildBetweenPointerAndEdge( that, upper, true ) ) {
				DEBUG && DEBUG.logElementsEnd( [ upper ], // %REMOVE_LINE%
					[ 'upper' ], 'REJECT EDGE_BOTTOM. Edge child below' ); // %REMOVE_LINE%

				return false;
			}

			// Last child cases.
			else if ( isTrigger( that, upper ) ) {
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

	// Collects dimensions of an element.
	var sizePrefixes = [ 'top', 'left', 'right', 'bottom' ];

	function getSize( that, element, ignoreScroll, force ) {
		var getStyle = (function() {
			// Better "cache and reuse" than "call again and again".
			var computed = env.ie ? element.$.currentStyle : that.win.$.getComputedStyle( element.$, '' );

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

		// updateWindowSize if forced to do so OR NOT ignoring scroll.
		if ( !ignoreScroll || force )
			updateWindowSize( that, force );

		box.top = docPosition.y - ( ignoreScroll ? 0 : that.view.scroll.y ), box.left = docPosition.x - ( ignoreScroll ? 0 : that.view.scroll.x ),

		// w/ borders and paddings.
		box.outerWidth = element.$.offsetWidth, box.outerHeight = element.$.offsetHeight,

		// w/o borders and paddings.
		box.height = box.outerHeight - ( padding.top + padding.bottom + border.top + border.bottom ), box.width = box.outerWidth - ( padding.left + padding.right + border.left + border.right ),

		box.bottom = box.top + box.outerHeight, box.right = box.left + box.outerWidth;

		return extend({
			border: border,
			padding: padding,
			margin: margin,
			ignoreScroll: ignoreScroll
		}, box, true );
	}

	function removeListeners( that ) {
		var listener;
		while ( listener = that.listeners.pop() ) {
			listener.removeListener();
		}
	}

	function updateSize( that, element, ignoreScroll ) {
		if ( !isHtml( element ) ) // i.e. an element is hidden
			return ( element.size = null ); //	-> reset size to make it useless for other methods

		if ( !element.size )
			element.size = {};

		// Abort if there was a similar query performed recently.
		// This kind of caching provides great performance improvement.
		else if ( element.size.ignoreScroll == ignoreScroll && element.size.date > new Date() - CACHE_TIME ) {
			DEBUG && DEBUG.log( 'ELEMENT.size: get from cache' ); // %REMOVE_LINE%
			return;
		}

		DEBUG && DEBUG.log( 'ELEMENT.size: capture' ); // %REMOVE_LINE%

		extend( element.size, getSize( that, element, ignoreScroll ), {
			date: +new Date()
		}, true );
	}

	// Updates that.view.editable object.
	// This one must be called separately outside of updateWindowSize
	// to prevent cyclic dependency getSize<->updateWindowSize.
	// It calls getSize with force flag to avoid getWindowSize cache (look: getSize).
	function updateEditableSize( that, ignoreScroll ) {
		that.view.editable = getSize( that, that.editable, ignoreScroll, true );
	}

	function updateWindowSize( that, force ) {
		if ( !that.view )
			that.view = {};

		var view = that.view;

		if ( !force && view && view.date > new Date() - CACHE_TIME ) {
			DEBUG && DEBUG.log( 'win.size: get from cache' ); // %REMOVE_LINE%
			return;
		}

		DEBUG && DEBUG.log( 'win.size: capturing' ); // %REMOVE_LINE%

		var win = that.win,
			scroll = win.getScrollPosition(),
			paneSize = win.getViewPaneSize();

		extend( that.view, {
			scroll: {
				x: scroll.x,
				y: scroll.y,
				width: that.doc.$.documentElement.scrollWidth - paneSize.width,
				height: that.doc.$.documentElement.scrollHeight - paneSize.height
			},
			pane: {
				width: paneSize.width,
				height: paneSize.height,
				bottom: paneSize.height + scroll.y
			},
			date: +new Date()
		}, true );
	}

	// This method searches document vertically using given
	// select criterion until stop criterion is fulfilled.
	function verticalSearch( that, continueCriterion, selectCriterion, startElement ) {
		var upper = startElement,
			lower = startElement,
			mouseStep = 0,
			upperFound = false,
			lowerFound = false,
			viewPaneHeight = that.view.pane.height,
			mouse = that.mouse;

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

			// Instead of ++ to reduce the number of invokations by half
			mouseStep += 2;
		}

		return new boxTrigger( upper, lower, null, null );
	}

})();

/**
 * Sets the default vertical distance between element edge and mouse pointer that
 * causes the box to appear. The distance is expressed in pixels (px).
 * @name CKEDITOR.config.line_triggerOffset
 * @type Number
 * @default <code>30</code>
 * @see CKEDITOR.config.line_holdDistance
 * @example
 * // Increases the offset to 15px.
 * CKEDITOR.config.line_triggerOffset  = 15;
 */

/**
 * Defines the distance between mouse pointer and the box, within
 * which the box stays revealed and no other focus space is offered to be accessed.
 * The value is relative to {@link CKEDITOR.config.line_triggerOffset}.
 * @name CKEDITOR.config.line_holdDistance
 * @type Number
 * @default <code>.5</code>
 * @see CKEDITOR.config.line_triggerOffset
 * @example
 * // Increases the distance to 80% of {@link CKEDITOR.config.line_triggerOffset}.
 * CKEDITOR.config.line_holdDistance = .8;
 */

// %REMOVE_START%
/**
 * Defines default keystroke that inserts new paragraph before an element that
 * holds start of the current selection or just simply holds the caret.
 * @name CKEDITOR.config.line_keystrokeBefore
 * @type Number
 * @default <code>CKEDITOR.CTRL + CKEDITOR.SHIFT + 219 // CTRL + SHIFT + [</code>
 * @example
 * // Changes keystroke to CTRL + SHIFT + ,
 * CKEDITOR.config.line_keystrokeBefore = CKEDITOR.CTRL + CKEDITOR.SHIFT + 188;
 */
//CKEDITOR.config.magicline_keystrokeBefore = CKEDITOR.CTRL + CKEDITOR.SHIFT + 219, // CTRL + SHIFT + [
/**
 * Defines default keystroke that inserts new paragraph after an element that
 * holds start of the current selection or just simply holds the caret.
 * @name CKEDITOR.config.line_keystrokeBefore
 * @type Number
 * @default <code>CKEDITOR.CTRL + CKEDITOR.SHIFT + 221 // CTRK + SHIFT + ]</code>
 * @example
 * // Changes keystroke to CTRL + SHIFT + .
 * CKEDITOR.config.line_keystrokeBefore = CKEDITOR.CTRL + CKEDITOR.SHIFT + 190;
 */
//CKEDITOR.config.magicline_keystrokeAfter = CKEDITOR.CTRL + CKEDITOR.SHIFT + 221, // CTRL + SHIFT + ],
// %REMOVE_END%
/**
 * Defines box color. The color may be adjusted to enhance readability.
 * @name CKEDITOR.config.line_boxColor
 * @type String
 * @default <code>'#FF0000'</code>
 * @example
 * // Changes color to blue.
 * CKEDITOR.config.line_boxColor = '#0000FF';
 */

/**
 * Defines box opacity. The opacity may be adjusted to enhance readability
 * by revealing underlying elements.
 * @name CKEDITOR.config.line_boxOpacity
 * @type Number
 * @default <code>1</code>
 * @example
 * // Changes opacity to 30%.
 * CKEDITOR.config.line_boxOpacity = .3;
 */

/**
 * Activates plugin mode that considers all focus spaces between
 * {@link CKEDITOR.dtd.$block} elements as accessible by the box.
 * @name CKEDITOR.config.line_putEverywhere
 * @type Boolean
 * @default <code>false</code>
 * @example
 * // Enables "put everywhere" mode.
 * CKEDITOR.config.line_putEverywhere = true;
 */
