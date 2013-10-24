/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

 /**
 * @fileOverview Fingering like a boss.
 */

'use strict';

(function() {

	CKEDITOR.plugins.add( 'magicfinger' );

	function Finder( editor, def ) {
		CKEDITOR.tools.extend( this, {
			editor: editor,
			editable: editor.editable(),
			doc: editor.document,
			win: editor.window
		}, def, true );

		this.inline = this.editable.isInline();
		this.target = this[ this.inline ? 'editable' : 'doc' ];
	}

	Finder.prototype = {
		/**
		 * Initializes searching for elements with every mousemove event fired.
		 */
		start: function() {
			var that = this,
				editor = this.editor,
				doc = this.doc,
				x, y;

			var moveBuffer = CKEDITOR.tools.eventsBuffer( 50, function() {
					if ( editor.readOnly || editor.mode != 'wysiwyg' )
						return;

					that.find( new CKEDITOR.dom.element( doc.$.elementFromPoint( x, y ) ), x, y );
				} );

			// Searching starting from element from point on mousemove.
			this.listener = this.editable.attachListener( this.target, 'mousemove', function( evt ) {
				x = evt.data.$.clientX;
				y = evt.data.$.clientY;

				moveBuffer.input();
			} );
		},

		/**
		 * Stops observing mouse events.
		 */
		stop: function() {
			if ( this.listener )
				this.listener.removeListener();
		},

		/**
		 * Feeds searching algorithms with element and mouse.
		 *
		 * @param {CKEDITOR.dom.element} el Element which is the starting point.
		 * @param {Number} [x] Horizontal mouse coordinate relative to the viewport.
		 * @param {Number} [y] Vertical mouse coordinate relative to the viewport.
		 */
		find: function( el, x, y ) {
			this.relations = {};

			this.traverseSearch( el );

			if ( !isNaN( x + y ) )
				this.pixelSearch( el, x, y );

			this.onFind && this.onFind( this.relations, x, y );
		},

		/**
		 * Returns relations found by the finder.
		 *
		 * @returns {Object} An object containing relations.
		 */
		getRelations: function() {
			return this.relations;
		},

		/**
		 * Stores given relation in a collection. Processes the relation
		 * to normalize and avoid duplicates.
		 *
		 * @param {CKEDITOR.dom.element} el Element of the relation.
		 * @param {Number} rel Relation, one of CKEDITOR.REL_(AFTER|BEFORE|INSIDE).
		 */
		store: (function() {
			function merge( el, type, relations ) {
				var uid = el.getUniqueId();

				if ( uid in relations )
					relations[ uid ].type |= type;
				else
					relations[ uid ] = { element: el, type: type };
			}

			return function( el, type ) {
				var alt;

				// Normalization to avoid duplicates:
				// CKEDITOR.REL_AFTER becomes CKEDITOR.REL_BEFORE of el.getNext().
				if ( is( type, CKEDITOR.REL_AFTER ) && ( alt = el.getNext() ) ) {
					merge( alt, CKEDITOR.REL_BEFORE, this.relations );
					type ^= CKEDITOR.REL_AFTER;
				}

				// Normalization to avoid duplicates:
				// CKEDITOR.REL_INSIDE becomes CKEDITOR.REL_BEFORE of el.getFirst().
				if ( is( type, CKEDITOR.REL_INSIDE ) && ( alt = el.getFirst() ) ) {
					merge( alt, CKEDITOR.REL_BEFORE, this.relations );
					type ^= CKEDITOR.REL_INSIDE;
				}

				merge( el, type, this.relations );
			}
		})(),

		/**
		 * Traverses DOM tree down towards root checking all ancestors
		 * with lookup rules avoiding duplicates. Stores positive relations
		 * in `relations` object.
		 *
		 * @param {CKEDITOR.dom.element} el Element which is the starting point.
		 */
		traverseSearch: (function() {
			var cached;

			return function( el ) {
				if ( el.equals( cached ) )
					return;

				var l, type, uid;

				// Go down DOM towards root (or limit).
				do {
					if ( isLimit( el ) )
						break;

					uid = el.$[ 'data-cke-expando' ];

					// This element was already visited and checked.
					if ( uid && uid in this.relations )
						continue;

					if ( isStatic( el ) ) {
						// Collect all addresses yielded by lookups for that element.
						for ( l in this.lookups ) {

							if ( ( type = this.lookups[ l ]( el ) ) )
								this.store( el, type );
						}
					}
				} while ( ( el = el.getParent() ) )

				cached = el;
			}
		})(),

		/**
		 * Iterates vertically pixel-by-pixel within given element starting
		 * from given coordinates, searching for elements in the neighbourhood.
		 * Once an element is found it is processed by `traverseSearch`.
		 *
		 * @param {CKEDITOR.dom.element} el Element which is the starting point.
		 * @param {Number} [x] Horizontal mouse coordinate relative to the viewport.
		 * @param {Number} [y] Vertical mouse coordinate relative to the viewport.
		 */
		pixelSearch: (function() {
			var contains = CKEDITOR.env.ie || CKEDITOR.env.webkit ?
					function( el, found ) {
						return el.contains( found );
					}
				:
					function( el, found ) {
						return !!( el.compareDocumentPosition( found ) & 16 );
					};

			// Iterates pixel-by-pixel from starting coordinates, moving by defined
			// step and getting elementFromPoint in every iteration. Iteration stops when:
			//  * A valid element is found.
			//  * Condition function returns false (i.e. reached boundaries of viewport).
			//  * No element is found (i.e. coordinates out of viewport).
			//  * Element found is ascendant of starting element.
			//
			// @param {Object} doc Native DOM document.
			// @param {Object} el Native DOM element.
			// @param {Number} xStart Horizontal starting coordinate to use.
			// @param {Number} yStart Vertical starting coordinate to use.
			// @param {Number} step Step of the algorithm.
			// @param {Function} condition A condition relative to current vertical coordinate.
			function iterate( doc, el, xStart, yStart, step, condition ) {
				var y = yStart,
					found, uid;

				while ( condition( y ) ) {
					y += step;

					found = doc.elementFromPoint( xStart, y );

					// Nothing found. This is crazy. Abort.
					if ( !found )
						return;

					// Still in the same element.
					if ( found == el )
						continue;

					// Reached the edge of an element and found an ancestor.
					if ( !contains( el, found ) )
						return;

					// Found a valid element. Stop iterating.
					if ( isStatic( ( found = new CKEDITOR.dom.element( found ) ) ) )
						return found;
				}
			}

			return function( el, x, y ) {
				var paneHeight = this.win.getViewPaneSize().height,

					// Try to find an element iterating *up* from the starting point.
					neg = iterate( this.doc.$, el.$, x, y, -1, function( y ) {
							return y > 0;
						} ),

					// Try to find an element iterating *down* from the starting point.
					pos = iterate( this.doc.$, el.$, x, y, 1, function( y ) {
							return y < paneHeight;
						} );

				if ( neg ) {
					this.traverseSearch( neg );

					// Iterate towards DOM root until neg is a direct child of el.
					while ( !neg.getParent().equals( el ) )
						neg = neg.getParent();
				}

				if ( pos ) {
					this.traverseSearch( pos );

					// Iterate towards DOM root until pos is a direct child of el.
					while ( !pos.getParent().equals( el ) )
						pos = pos.getParent();
				}

				// Iterate forwards starting from neg and backwards from
				// pos to harvest all children of el between those elements.
				// Stop when neg and pos meet each other or there's none of them.
				// TODO (?) reduce number of hops forwards/backwards.
				while ( neg || pos ) {
					if ( neg )
						neg = neg.getNext( isStatic );

					if ( !neg || neg.equals( pos ) )
						break;

					this.traverseSearch( neg );

					if ( pos )
						pos = pos.getPrevious( isStatic );

					if ( !pos || pos.equals( neg ) )
						break;

					this.traverseSearch( pos );
				}
			}
		})()
	};

	function Locator( editor, def ) {
		CKEDITOR.tools.extend( this, def, {
			editor: editor
		}, true );
	}

	Locator.prototype = {
		/**
		 * Localizes Y coordinate for all types of every single relation and stores
		 * them in the object.
		 *
		 * @param {Object} relations Relations returned from Finder.
		 */
		locateAll: (function() {
			var rel, uid;

			function locateSibling( rel, type ) {
				var sib = rel.element[ type === CKEDITOR.REL_BEFORE ? 'getPrevious' : 'getNext' ]();

				// Return the middle point between siblings.
				if ( sib ) {
					rel.siblingRect = sib.getClientRect();

					if ( type == CKEDITOR.REL_BEFORE )
						return ( rel.siblingRect.bottom + rel.elementRect.top ) / 2;
					else
						return ( rel.elementRect.bottom + rel.siblingRect.top ) / 2;
				}

				// If there's no sibling, use the edge of an element.
				else {
					if ( type == CKEDITOR.REL_BEFORE )
						return rel.elementRect.top;
					else
						return rel.elementRect.bottom;
				}
			}

			return function( relations ) {
				this.locations = {};

				for ( uid in relations ) {
					rel = relations[ uid ];
					rel.elementRect = rel.element.getClientRect();

					if ( is( rel.type, CKEDITOR.REL_BEFORE ) )
						this.store( uid, CKEDITOR.REL_BEFORE, locateSibling( rel, CKEDITOR.REL_BEFORE ) );

					if ( is( rel.type, CKEDITOR.REL_AFTER ) )
						this.store( uid, CKEDITOR.REL_AFTER, locateSibling( rel, CKEDITOR.REL_AFTER ) );

					// The middle point of the element.
					if ( is( rel.type, CKEDITOR.REL_INSIDE ) )
						this.store( uid, CKEDITOR.REL_INSIDE, ( rel.elementRect.top + rel.elementRect.bottom ) / 2 );
				}
			};
		})(),

		/**
		 * Stores the location in a collection.
		 *
		 * @param {Number} uid Unique identifier of the relation.
		 * @param {Number} type One of `CKEDITOR.REL_BEFORE`, `CKEDITOR.REL_AFTER` and `CKEDITOR.REL_INSIDE`.
		 * @param {Number} y Vertical position of the relation.
		 */
		store: function( uid, type, y ) {
			if ( !this.locations[ uid ] )
				this.locations[ uid ] = {};

			this.locations[ uid ][ type ] = y;
		}
	};

	function Liner( editor, def ) {
		CKEDITOR.tools.extend( this, {
			editor: editor,
			editable: editor.editable(),
			doc: editor.document,
			win: editor.window,
			container: CKEDITOR.document.getBody(),
			containerWin: CKEDITOR.document.getWindow()
		}, def, true );

		this.hidden = {};
		this.visible = {};

		this.inline = this.editable.isInline();

		if ( !this.inline )
			this.frame = this.win.getFrame();

		this.queryViewport();

		this.containerWin.on( 	'resize', 	this.queryViewport, this );
		this.containerWin.on( 	'scroll', 	this.queryViewport, this );
		editor.on( 				'resize', 	this.queryViewport, this );

		this.containerWin.on( 	'resize', 	this.hideVisible, this );
		this.win.on( 			'scroll', 	this.hideVisible, this );

		editor.on( 				'mode', 	this.removeAll, this );
		editor.on( 				'destroy', 	this.removeAll, this );
	}

	var trCss = {
			display: 'block',
			width: '0px',
			height: '0px',
			padding: '0px',
			margin: '0px',
			'border-color': 'transparent',
			'border-style': 'solid',
			position: 'absolute',
			top: '-6px'
		},

		lineCss = {
			height: '0px',
			'border-top': '1px dashed red',
			position: 'absolute'
		},

		lineTpl = new CKEDITOR.template(
			'<div style="{lineCss}">' +
				'<span style="{trCssLeft}">&nbsp;</span>' +
				'<span style="{trCssRight}">&nbsp;</span>' +
			'</div>' ).output( {
				lineCss: CKEDITOR.tools.writeCssText( lineCss ),
				trCssLeft: CKEDITOR.tools.writeCssText( CKEDITOR.tools.extend( {}, trCss, {
					left: '0px',
					'border-left-color': 'red',
					'border-width': '6px 0 6px 6px'
				} ) ),
				trCssRight: CKEDITOR.tools.writeCssText( CKEDITOR.tools.extend( {}, trCss, {
					right: '0px',
					'border-right-color': 'red',
					'border-width': '6px 6px 6px 0'
				} ) )
		} );

	Liner.prototype = {
		removeAll: function() {
			var l;

			for ( l in this.hidden ) {
				this.hidden[ l ].remove();
				delete this.hidden[ l ];
			}

			for ( l in this.visible ) {
				this.visible[ l ].remove();
				delete this.visible[ l ];
			}
		},

		hideLine: function( line ) {
			var uid = line.getUniqueId();

			line.hide();

			this.hidden[ uid ] = line;
			delete this.visible[ uid ];
		},

		hideVisible: function() {
			for ( var l in this.visible )
				this.hideLine( this.visible[ l ] );
		},

		showLine: function( rel, loc ) {
			var line, l;

			// Search for any visible line of a different hash first.
			// It's faster to re-position visible line than to show it.
			for ( l in this.visible ) {
				if ( this.visible[ l ].getCustomData( 'hash' ) !== this.hash ) {
					line = this.visible[ l ];
					break;
				}
			}

			// Search for any hidden line of a different hash.
			if ( !line ) {
				for ( l in this.hidden ) {
					if ( this.hidden[ l ].getCustomData( 'hash' ) !== this.hash ) {
						line = this.hidden[ l ];

						line.show();
						delete this.hidden[ l ];

						break;
					}
				}
			}

			// If no line available, add the new one.
			if ( !line )
				line = this.addLine();

			// Mark the line with current hash.
			line.setCustomData( 'hash', this.hash );

			// Mark the line as visible.
			this.visible[ line.getUniqueId() ] = line;

			this.positionLine( line, rel, loc );
		},

		positionLine: function( line, rel, loc ) {
			var styles = {};

			// Line should be between two elements.
			if ( rel.siblingRect )
				styles.width = Math.max( rel.siblingRect.width, rel.elementRect.width );

			// Line is relative to a single element.
			else
				styles.width = rel.elementRect.width;

			if ( this.inline ) {
				styles.left = rel.elementRect.left;
				styles.top = loc + this.scrollY;
			} else {
				var rectLeft = this.rect.left;

				styles.left = rectLeft + rel.elementRect.left;
				styles.top = this.rect.top + this.scrollY + loc;
			}

			for ( var style in styles )
				styles[ style ] = CKEDITOR.tools.cssLength( styles[ style ] );

			line.setStyles( styles );
		},

		addLine: function() {
			var line = CKEDITOR.dom.element.createFromHtml( lineTpl );

			line.appendTo( this.container );

			return line;
		},

		cleanup: function() {
			var line;

			for ( var l in this.visible ) {
				line = this.visible[ l ];

				if ( line.getCustomData( 'hash' ) !== this.hash )
					this.hideLine( line );
			}
		},

		prepare: function() {
			this.hash = Math.random().toString( 36 ).substring( 7 );
		},

		queryViewport: function( event ) {
			console.log( 'queryViewport', this, this.inline, this.editor.name, event && event.name );
			this.scrollY = this.containerWin.getScrollPosition().y

			if ( !this.inline ) {
				this.rect = this.frame.getClientRect();
			}
		}
	};

	function is( type, flag ) {
		return type & flag;
	}

	var floats = { left:1,right:1,center:1 },
		positions = { absolute:1,fixed:1,relative:1 };

	function isElement( node ) {
		return node && node.type == CKEDITOR.NODE_ELEMENT;
	}

	function isFloated( el ) {
		return !!( floats[ el.getComputedStyle( 'float' ) ] || floats[ el.getAttribute( 'align' ) ] )
	}

	function isPositioned( el ) {
		return !!positions[ el.getComputedStyle( 'position' ) ];
	}

	function isLimit( node ) {
		return isElement( node ) && node.getAttribute( 'contenteditable' ) == 'true';
	}

	function isStatic( node ) {
		return isElement( node ) && !isFloated( node ) && !isPositioned( node );
	}

	CKEDITOR.plugins.magicfinger = {
		finder: Finder,
		locator: Locator,
		liner: Liner,

		// Global helpers.
		isStatic: isStatic
	};
})();

/**
 * The space is before specified element.
 *
 * @readonly
 * @property {Number} [=0]
 * @member CKEDITOR
 */
CKEDITOR.REL_BEFORE = 1;

/**
 * The space is after specified element.
 *
 * @readonly
 * @property {Number} [=1]
 * @member CKEDITOR
 */
CKEDITOR.REL_AFTER = 2;

/**
 * The space is inside of specified element.
 *
 * @readonly
 * @property {Number} [=2]
 * @member CKEDITOR
 */
CKEDITOR.REL_INSIDE = 4;