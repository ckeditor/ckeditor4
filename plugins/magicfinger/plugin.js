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
			}, this );
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
		 */
		find: function( el, x, y ) {
			this.relations = {};

			this.traverseSearch( el );

			if ( !isNaN( x + y ) )
				this.pixelSearch( el, x, y );

			this.onFind( this.relations );
		},

		getRelations: function() {
			return this.relations;
		},

		traverseSearch: (function() {
			var cached;

			return function( el ) {
				if ( el.equals( cached ) )
					return;

				var l, rel, uid;

				// Go down DOM towards root (or limit).
				do {
					uid = el.$[ 'data-cke-expando' ];

					// This element was already visited and checked.
					if ( uid && uid in this.relations )
						continue;

					if ( isStatic( el ) ) {
						// Collect all addresses yielded by lookups for that element.
						for ( l in this.lookups ) {

							if ( ( rel = this.lookups[ l ]( el ) ) )
								storeRelation( el, rel, this.relations );
						}
					}
				} while ( !isLimit( el ) && ( el = el.getParent() ) )

				cached = el;
			}
		})(),

		pixelSearch: (function() {
			function isFound( found, el ) {
				if ( !( found && found != el.$ ) )
					return;

				found = new CKEDITOR.dom.element( found );

				if ( isStatic( found ) )
					return found;
				else
					return;
			}

			return function( el, x, y ) {
				var yUp = y,
					yDown = y,
					paneHeight = this.win.getViewPaneSize().height,

					found, neg, pos;

				// Iterate until elements are found or coordinates are out of the viewport.
				while ( !( neg && pos ) && yDown < paneHeight && yUp > 0 ) {

					if ( !neg ) {
						if ( ( found = isFound( this.doc.$.elementFromPoint( x, yUp ), el ) ) )
							neg = found;
					}

					if ( !pos ) {
						if ( ( found = isFound( this.doc.$.elementFromPoint( x, yDown ), el ) ) )
							pos = found;
					}

					yUp -= 2;
					yDown += 2;
				}

				if ( neg )
					this.traverseSearch( neg );

				if ( pos )
					this.traverseSearch( pos );
			}
		})()
	};

	function storeRelation( el, rel, relations ) {
		var alt;

		// Normalization to avoid duplicates:
		// CKEDITOR.REL_AFTER becomes CKEDITOR.REL_BEFORE of el.getNext().
		if ( isRelation( rel, CKEDITOR.REL_AFTER ) && ( alt = el.getNext() ) ) {
			mergeRelation( alt, CKEDITOR.REL_BEFORE, relations );
			rel ^= CKEDITOR.REL_AFTER;
		}

		// Normalization to avoid duplicates:
		// CKEDITOR.REL_INSIDE becomes CKEDITOR.REL_BEFORE of el.getFirst().
		if ( isRelation( rel, CKEDITOR.REL_INSIDE ) && ( alt = el.getFirst() ) ) {
			mergeRelation( alt, CKEDITOR.REL_BEFORE, relations );
			rel ^= CKEDITOR.REL_INSIDE;
		}

		mergeRelation( el, rel, relations );
	}

	function mergeRelation( el, rel, relations ) {
		var uid = el.getUniqueId();

		if ( uid in relations )
			relations[ uid ].relation |= rel;
		else {
			relations[ uid ] = {
				element: el,
				relation: rel
			};
		}
	}

	function isRelation( rel, flag ) {
		return ( rel & flag ) == flag;
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