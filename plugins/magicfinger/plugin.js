/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

(function() {

	CKEDITOR.addCss( '.cke_matched { outline: 2px dashed red } ' );

	CKEDITOR.plugins.add( 'magicfinger', {
		lang: 'en', // %REMOVE_LINE_CORE%

		init: function( editor ) {
			// At the moment Magicfinger is always on. Still the final implementation
			// may start and finish on demand, i.e. when drag and drop.
			editor.on( 'contentDom', function() {
				var finder = new CKEDITOR.plugins.magicfinger.finder( editor, {
					// Those are DEV. Naive to show the concept.
					lookups: {
						'is block and first child': function( el ) {
							if ( !el.is( CKEDITOR.dtd.$block ) )
								return;

							if ( el.is( CKEDITOR.dtd.$listItem ) )
								return;

							if ( !el.getPrevious( isStaticElement ) )
								return el.getAddress();
						},

						'is block and last child': function( el ) {
							if ( !el.is( CKEDITOR.dtd.$block ) )
								return;

							if ( el.is( CKEDITOR.dtd.$listItem ) )
								return;

							if ( !el.getNext( isStaticElement ) )
								return el.getAddress();
						},

						'is block and has block before': function( el ) {
							if ( !el.is( CKEDITOR.dtd.$block ) )
								return;

							if ( el.is( CKEDITOR.dtd.$listItem ) )
								return;

							if ( el.getPrevious( isStaticElement ) )
								return el.getAddress();
						},


						'is block and has block after': function( el ) {
							if ( !el.is( CKEDITOR.dtd.$block ) )
								return;

							if ( el.is( CKEDITOR.dtd.$listItem ) )
								return;

							if ( el.getNext( isStaticElement ) )
								return el.getAddress();
						}
					}
				} ).start();
			}, this );
		}
	} );

	// DEV only.
	var matched = [];

	function finder( editor, def ) {
		CKEDITOR.tools.extend( this, {
			editor: editor,
			editable: editor.editable(),
			doc: editor.document
		}, def, true );

		this.inline = this.editable.isInline();
		this.target = this[ this.inline ? 'editable' : 'doc' ];
	}

	finder.prototype = {
		start: function() {
			var editor = this.editor,
				x, y, el, old;

			// Searching starting from element from point on mousemove.
			// TODO: eventsBuffer here, right?
			this.listener = this.editable.attachListener( this.target, 'mousemove', function( evt ) {
				if ( editor.readOnly || editor.mode != 'wysiwyg' )
					return;

				x = evt.data.$.clientX;
				y = evt.data.$.clientY;
				el = this.doc.$.elementFromPoint( x, y );

				if ( el != old ) {
					old = el;
					this.search( new CKEDITOR.dom.element( el ), x, y );

					// DEV only.
					var m, match;
					while ( ( m = matched.pop() ) )
						m.removeClass( 'cke_matched' );

					// DEV only.
					for ( m in this.matches ) {
						match = this.doc.getByAddress( this.matches[ m ] )
						match.addClass( 'cke_matched' );
						matched.push( match )
					}
				}
			}, this );
		},

		stop: function() {
			if ( this.listener )
				this.listener.removeListener();
		},

		search: function( el ) {
			this.matches = [];

			this.traverseSearch( el );
			this.pixelSearch();
		}
	};

	finder.prototype.traverseSearch = function( el ) {
		var l, match;

		do {
			if ( isStaticElement( el ) ) {
				// Collect all addresses yielded by lookups for that element.
				for ( l in this.lookups ) {
					match = this.lookups[ l ]( el );

					if ( match )
						this.matches.push( match );
				}
			}
		} while ( !isLimit( el ) && ( el = el.getParent() ) )
	};

	finder.prototype.pixelSearch = function( el, x, y ) {
		// TODO: import some logic of expandFilter (engine).
	};

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

	function isStaticElement( node ) {
		return isElement( node ) && !isFloated( node ) && !isPositioned( node );
	}

	CKEDITOR.plugins.magicfinger = {
		finder: finder
	};
})();