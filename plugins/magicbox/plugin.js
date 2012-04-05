/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/'use strict';

(function() {
	var triggers = { table:1,hr:1,div:1,ul:1,ol:1,dl:1 },
		domDepth = 1,
		boxOffset = 30,
		boxHeight = 25,
		hiddenMode = false,

		doc, body, magicBox, domList,

		// Pure debug. Dev-only.
		DEBUG = {
			startTimer: function() {
				DEBUG.time = new Date().getTime();
			},

			calcTimer: (function( text ) {
				var label = CKEDITOR.document.getById( 'gather' );

				return function( text ) {
					text = text || new Date().getTime() - DEBUG.time + ' ms';
					label.setText( text )
				}

			})(),

			mousePos: (function( y ) {
				var my = CKEDITOR.document.getById( 'my' );

				return function( y ) {
					my.setText( y );
				}
			})(),

			showPair: (function( pair, minKey ) {
				var p1 = CKEDITOR.document.getById( 'p1' ),
					p2 = CKEDITOR.document.getById( 'p2' ),
					mi = CKEDITOR.document.getById( 'mi' ),
					ga = CKEDITOR.document.getById( 'ga' );

				return function( pair, minKey ) {
					p1.setText( pair.upper ? pair.upper.getName() : 'null' );
					p2.setText( pair.lower ? pair.lower.getName() : 'null' );
					mi.setText( pair.middle );
					ga.setText( '[' + [ pair.zone[ 0 ], pair.zone[ 1 ] ].join( ',' ) + ']' );
				}
			})(),

			drawList: (function( list ) {
				var cnt = CKEDITOR.document.getById( 'list' ),
					str, node;

				return function( list ) {
					str = '';

					for ( var i = 0; i < list.length; i++ ) {
						str += '(' + list[ i ].depth + ') ' + Array( list[ i ].depth ).join( '&bull;&ndash;' ) + '[';
						for ( var j = 0; j < list[ i ].length; j++ ) {
							node = list[ i ][ j ];
							str += node.getName() + ( j + 1 in list[ i ] ? ', ' : '' );
						}
						str += ']<br>';
					}

					cnt.setHtml( str );
				}
			})(),

			drawPairs: (function( pairs ) {
				var cnt = CKEDITOR.document.getById( 'pairs' ),
					str, pair;

				return function( pairs ) {
					str = '';

					for ( var i = 0; i < pairs.length; i++ ) {
						pair = pairs[ i ];
						str += '[ ' +
							[
							pair.upper ? pair.upper.getName() : 'null',
							pair.lower ? pair.lower.getName() : 'null',
							pair.middle
							].join( ', ' ) + ' ]<br>';
					}

					cnt.setHtml( str );
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
		return ( 1 in array ) && ( val > array[ 0 ] && val < array[ 1 ] );
	}

	function initMagicBox( editor ) {
		editor.on( 'contentDom', addListeners );

		function initBoxElement() {
			magicBox = CKEDITOR.dom.element.createFromHtml( '<span id="magic_box" class="magicbox" contenteditable="false">&#9998; Click to type here. Hold SHIFT to hide.</span>', editor.document );
			magicBox.unselectable();

			function growUp() {
				magicBox.setStyle( 'height', magicBox.$.clientHeight + 1 + 'px' );
				magicBox.$.clientHeight < boxHeight && setTimeout( growUp, 7 );
			}

			magicBox.slide = function() {
				magicBox.setStyle( 'height', '0px' );
				growUp();
			}

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

		// Traverses the DOM tree in search for relevant mB triggers
		function gatherDom( node, callback, parentNode ) {
			var children = node.getChildren(),
				i = -1;

			// Restrict callback function to triggers only
			if ( node.getName() in triggers )
				callback( node, domDepth );

			domDepth++;

			// Find a first HTML element among children
			while ( ( node = children.getItem( ++i ) ) && node.type !== CKEDITOR.NODE_ELEMENT )
				;

			// Dive deeper into the DOM tree
			while ( node && node.type === CKEDITOR.NODE_ELEMENT ) {
				gatherDom( node, callback );
				node = node.getNext( notMb );
			}

			domDepth--;
		}

		// Performs DOM list update periodically.
		// Gathers all mB triggers in form of list series

		function periodicGatherDom() {
			DEBUG.startTimer();
			var prevDepth = -1;

			domList = [];

			editor.mode === 'wysiwyg' && gatherDom( body, function( element, depth ) {
				var marginTop = parseInt( element.getComputedStyle( 'margin-top' ) ),
					marginBottom = parseInt( element.getComputedStyle( 'margin-bottom' ) ),

					top = element.getDocumentPosition( doc ).y - editor.window.getScrollPosition().y - marginTop,
					height = element.$.offsetHeight,
					bottom = top + height + marginBottom;

				CKEDITOR.tools.extend( element, { top: top, bottom: bottom } );

				// Look for an array of elements of the same parent & level
				for ( var i = domList.length; i--; ) {
					if ( element.getParent().equals( domList[ i ][ 0 ].getParent() ) ) {
						domList[ i ].push( element );
						break;
					}
				}

				// We're at the new level and there'are no elements of the same parent
				!~i && domList.push( CKEDITOR.tools.extend( [ element ], { depth: depth } ) );

				prevDepth = depth;
			}, -1 );

			DEBUG.calcTimer();
			DEBUG.drawList( domList );

			setTimeout( periodicGatherDom, 100 );
		}

		function getPair( array, prev, next ) {
			var prevEl = prev in array ? array[ prev ] : null,
				nextEl = next in array ? array[ next ] : null,
				pair = { upper: prevEl, lower: nextEl },
				sibling;

			// Both elements exist and one follows another
			if ( prevEl && nextEl && prevEl.getNext( notMb ).equals( nextEl ) ) {
				pair.middle = 0 | ( prevEl.bottom + nextEl.top ) / 2;
				pair.zone = [ prevEl.bottom - boxOffset, nextEl.top + boxOffset ];
			}

			// First child case
			else if ( !prevEl && nextEl && !nextEl.getPrevious( notMb ) ) {
				pair.middle = nextEl.top;
				pair.zone = [ nextEl.top - boxHeight - boxOffset, nextEl.bottom + boxOffset ];
			}

			// Last child case
			else if ( prevEl && !nextEl && !prevEl.getNext( notMb ) ) {
				pair.middle = prevEl.bottom;
				pair.zone = [ prevEl.bottom - boxOffset, prevEl.bottom + boxHeight + boxOffset ];
			}

			return pair.zone ? pair : 0;
		}

		function getClosestPair( y ) {
			var pairs = [],
				minDist = Number.MAX_VALUE,
				minKey = 0,
				curDist, pair;

			// Gather all pairs among domList by going into each sub-list
			for ( var j = domList.length; j--; ) {
				for ( var i = -2; i++ <= domList[ j ].length; )
				( pair = getPair( domList[ j ], i, i + 1 ) ) && pairs.push( pair );
			}

			// Find the pair of the middle closest to cursor y
			for ( j = pairs.length; j--; ) {
				if ( ( curDist = getDistance( pairs[ j ].middle, y ) ) < minDist )
					minDist = curDist, minKey = j;
			}

			DEBUG.mousePos( y );
			DEBUG.drawPairs( pairs );
			DEBUG.showPair( pairs[ minKey ] );

			return pairs[ minKey ];
		}

		function hasBox( pair ) {
			var upper = pair.upper,
				lower = pair.lower,
				sibling;

			return ( sibling = !upper ? lower.getPrevious( isHtml ) : upper.getNext( isHtml ) ) && sibling.equals( magicBox );
		}

		function cursorInRange( pair, y ) {
			return inRange( y, pair.zone );
		}

		function addListeners() {
			var hideTimeout, showTimeout, pair;

			doc = editor.editable().getDocument(), body = doc.getBody();

			initBoxElement();
			periodicGatherDom();

			// Let's handle mousemove event for mB on/off toggle
			doc.on( 'mousemove', function( event ) {
				// If DOM is empty, showing mB is pointless
				if ( editor.mode != 'wysiwyg' || !domList.length )
					return;

				var y = event.data.$.clientY;

				if ( cursorInRange( pair = getClosestPair( y ), y ) ) {
					clearTimeout( hideTimeout );
					clearTimeout( showTimeout );

					// Show mB if it isn't already visible. Use delay for eye-candy
					!hiddenMode && !hasBox( pair ) && ( showTimeout = setTimeout( function() {
						// * One element followed by another: ( pair.upper && pair.lower ) -> true
						// 		\-> insert mB BEFORE pair.lower
						//
						// * First child case: ( !pair.upper && pair.lower ) -> true
						//		\-> insert mB BEFORE pair.lower
						//
						// * Last child case: ( pair.upper && !pair.lower ) -> true
						//		\-> insert mB AFTER pair.upper

						magicBox[ pair.lower ? 'insertBefore' : 'insertAfter' ]( pair.lower || pair.upper );
						magicBox.slide();

					}, 100 ) );
				} else
					magicBox.remove();
			});

			// Hide mB on mouseout
			doc.on( 'mouseout', function( event ) {
				clearTimeout( hideTimeout );
				clearTimeout( showTimeout );

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

		editor.addCss( '#magic_box { \
			display: block; \
			padding: 0 8px; \
			height: 25px; \
			line-height: 25px; \
			margin: 0px; \
			color: #000; \
			text-shadow: 0 -1px 0 #fff;\
			overflow: hidden; \
			background : #D1EFFF; \
			border: 1px dashed #B6DBF0;\
			border-radius : 3px; \
			cursor: pointer; \
		}' );
	};

	CKEDITOR.plugins.add( 'magicbox', {
		init: function( editor ) {
			initMagicBox( editor );
		}
	});

})();
