/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	// #### checkSelectionChange : START

	// The selection change check basically saves the element parent tree of
	// the current node and check it on successive requests. If there is any
	// change on the tree, then the selectionChange event gets fired.
	var checkSelectionChange = function() {
			// In IE, the "selectionchange" event may still get thrown when
			// releasing the WYSIWYG mode, so we need to check it first.
			var sel = this.getSelection();
			if ( !sel )
				return;

			var firstElement = sel.getStartElement();
			var currentPath = new CKEDITOR.dom.elementPath( firstElement );

			if ( !currentPath.compare( this._.selectionPreviousPath ) ) {
				this._.selectionPreviousPath = currentPath;
				this.fire( 'selectionChange', { selection: sel, path: currentPath, element: firstElement } );
			}
		};

	var checkSelectionChangeTimer;
	var checkSelectionChangeTimeoutPending;
	var checkSelectionChangeTimeout = function() {
			// Firing the "OnSelectionChange" event on every key press started to
			// be too slow. This function guarantees that there will be at least
			// 200ms delay between selection checks.

			checkSelectionChangeTimeoutPending = true;

			if ( checkSelectionChangeTimer )
				return;

			checkSelectionChangeTimeoutExec.call( this );

			checkSelectionChangeTimer = CKEDITOR.tools.setTimeout( checkSelectionChangeTimeoutExec, 200, this );
		};

	var checkSelectionChangeTimeoutExec = function() {
			checkSelectionChangeTimer = null;

			if ( checkSelectionChangeTimeoutPending ) {
				// Call this with a timeout so the browser properly moves the
				// selection after the mouseup. It happened that the selection was
				// being moved after the mouseup when clicking inside selected text
				// with Firefox.
				CKEDITOR.tools.setTimeout( checkSelectionChange, 0, this );

				checkSelectionChangeTimeoutPending = false;
			}
		};

	// #### checkSelectionChange : END

	var selectAllCmd = {
		exec: function( editor ) {
			switch ( editor.mode ) {
				case 'wysiwyg':
					editor.document.$.execCommand( 'SelectAll', false, null );
					break;
				case 'source':
					// TODO
			}
		}
	};

	CKEDITOR.plugins.add( 'selection', {
		init: function( editor, pluginPath ) {
			editor.on( 'contentDom', function() {
				if ( CKEDITOR.env.ie ) {
					// IE is the only to provide the "selectionchange"
					// event.
					editor.document.on( 'selectionchange', checkSelectionChangeTimeout, editor );
				} else {
					// In other browsers, we make the selection change
					// check based on other events, like clicks or keys
					// press.

					editor.document.on( 'mouseup', checkSelectionChangeTimeout, editor );
					editor.document.on( 'keyup', checkSelectionChangeTimeout, editor );
				}
			});

			editor.addCommand( 'selectAll', selectAllCmd );
			editor.ui.addButton( 'SelectAll', {
				label: editor.lang.selectAll,
				command: 'selectAll'
			});
		}
	});

	/**
	 * Gets the current selection from the editing area when in WYSIWYG mode.
	 * @returns {CKEDITOR.dom.selection} A selection object or null if not on
	 *		WYSIWYG mode or no selection is available.
	 * @example
	 * var selection = CKEDITOR.instances.editor1.<b>getSelection()</b>;
	 * alert( selection.getType() );
	 */
	CKEDITOR.editor.prototype.getSelection = function() {
		var retval = this.document ? this.document.getSelection() : null;

		/**
		 * IE BUG: The selection's document may be a different document than the
		 * editor document. Return null if that's the case.
		 */
		if ( retval && CKEDITOR.env.ie ) {
			var range = retval.getNative().createRange();
			if ( !range )
				return null;
			else if ( range.item )
				return range.item( 0 ).ownerDocument == this.document.$ ? retval : null;
			else
				return range.parentElement().ownerDocument == this.document.$ ? retval : null;
		}

		retval.onSelectionSet = CKEDITOR.tools.bind( checkSelectionChangeTimeout, this );
		return retval;
	};

	/**
	 * Gets the current selection from the document.
	 * @returns {CKEDITOR.dom.selection} A selection object.
	 * @example
	 * var selection = CKEDITOR.instances.editor1.document.<b>getSelection()</b>;
	 * alert( selection.getType() );
	 */
	CKEDITOR.dom.document.prototype.getSelection = function() {
		return new CKEDITOR.dom.selection( this );
	};

	/**
	 * No selection.
	 * @constant
	 * @example
	 * if ( editor.getSelection().getType() == CKEDITOR.SELECTION_NONE )
	 *     alert( 'Nothing is selected' );
	 */
	CKEDITOR.SELECTION_NONE = 1;

	/**
	 * Text or collapsed selection.
	 * @constant
	 * @example
	 * if ( editor.getSelection().getType() == CKEDITOR.SELECTION_TEXT )
	 *     alert( 'Text is selected' );
	 */
	CKEDITOR.SELECTION_TEXT = 2;

	/**
	 * Element selection.
	 * @constant
	 * @example
	 * if ( editor.getSelection().getType() == CKEDITOR.SELECTION_ELEMENT )
	 *     alert( 'An element is selected' );
	 */
	CKEDITOR.SELECTION_ELEMENT = 3;

	/**
	 * Manipulates the selection in a DOM document.
	 * @constructor
	 * @example
	 */
	CKEDITOR.dom.selection = function( document ) {
		this.document = document;
		this._ = {
			cache: {}
		};
	};

	var styleObjectElements = { img:1,hr:1,li:1,table:1,tr:1,td:1,embed:1,object:1,ol:1,ul:1 };

	CKEDITOR.dom.selection.prototype = {
		/**
		 * Gets the native selection object from the browser.
		 * @function
		 * @returns {Object} The native selection object.
		 * @example
		 * var selection = editor.getSelection().<b>getNative()</b>;
		 */
		getNative: CKEDITOR.env.ie ?
		function() {
			return this._.cache.nativeSel || ( this._.cache.nativeSel = this.document.$.selection );
		} : function() {
			return this._.cache.nativeSel || ( this._.cache.nativeSel = this.document.getWindow().$.getSelection() );
		},

		/**
		 * Gets the type of the current selection. The following values are
		 * available:
		 * <ul>
		 *		<li>{@link CKEDITOR.SELECTION_NONE} (1): No selection.</li>
		 *		<li>{@link CKEDITOR.SELECTION_TEXT} (2): Text is selected or
		 *			collapsed selection.</li>
		 *		<li>{@link CKEDITOR.SELECTION_ELEMENT} (3): A element
		 *			selection.</li>
		 * </ul>
		 * @function
		 * @returns {Number} One of the following constant values:
		 *		{@link CKEDITOR.SELECTION_NONE}, {@link CKEDITOR.SELECTION_TEXT} or
		 *		{@link CKEDITOR.SELECTION_ELEMENT}.
		 * @example
		 * if ( editor.getSelection().<b>getType()</b> == CKEDITOR.SELECTION_TEXT )
		 *     alert( 'Text is selected' );
		 */
		getType: CKEDITOR.env.ie ?
		function() {
			if ( this._.cache.type )
				return this._.cache.type;

			var type = CKEDITOR.SELECTION_NONE;

			try {
				var sel = this.getNative(),
					ieType = sel.type;

				if ( ieType == 'Text' )
					type = CKEDITOR.SELECTION_TEXT;

				if ( ieType == 'Control' )
					type = CKEDITOR.SELECTION_ELEMENT;

				// It is possible that we can still get a text range
				// object even when type == 'None' is returned by IE.
				// So we'd better check the object returned by
				// createRange() rather than by looking at the type.
				if ( sel.createRange().parentElement )
					type = CKEDITOR.SELECTION_TEXT;
			} catch ( e ) {}

			return ( this._.cache.type = type );
		} : function() {
			if ( this._.cache.type )
				return this._.cache.type;

			var type = CKEDITOR.SELECTION_TEXT;

			var sel = this.getNative();

			if ( !sel )
				type = CKEDITOR.SELECTION_NONE;
			else if ( sel.rangeCount == 1 ) {
				// Check if the actual selection is a control (IMG,
				// TABLE, HR, etc...).

				var range = sel.getRangeAt( 0 ),
					startContainer = range.startContainer;

				if ( startContainer == range.endContainer && startContainer.nodeType == 1 && ( range.endOffset - range.startOffset ) == 1 && styleObjectElements[ startContainer.childNodes[ range.startOffset ].nodeName.toLowerCase() ] ) {
					type = CKEDITOR.SELECTION_ELEMENT;
				}
			}

			return ( this._.cache.type = type );
		},

		getRanges: CKEDITOR.env.ie ? ( function() {
			// Finds the container and offset for a specific boundary
			// of an IE range.
			var getBoundaryInformation = function( range, start ) {
					// Creates a collapsed range at the requested boundary.
					range = range.duplicate();
					range.collapse( start );

					// Gets the element that encloses the range entirely.
					var parent = range.parentElement();
					var siblings = parent.childNodes;

					var testRange;

					for ( var i = 0; i < siblings.length; i++ ) {
						var child = siblings[ i ];
						if ( child.nodeType == 1 ) {
							testRange = range.duplicate();

							testRange.moveToElementText( child );
							testRange.collapse();

							var comparison = testRange.compareEndPoints( 'StartToStart', range );

							if ( comparison > 0 )
								break;
							else if ( comparison === 0 )
								return {
								container: parent,
								offset: i
							};

							testRange = null;
						}
					}

					if ( !testRange ) {
						testRange = range.duplicate();
						testRange.moveToElementText( parent );
						testRange.collapse( false );
					}

					testRange.setEndPoint( 'StartToStart', range );
					var distance = testRange.text.length;

					while ( distance > 0 )
						distance -= siblings[ --i ].nodeValue.length;

					if ( distance === 0 ) {
						return {
							container: parent,
							offset: i
						};
					} else {
						return {
							container: siblings[ i ],
							offset: -distance
						};
					}
				};

			return function() {
				if ( this._.cache.ranges )
					return this._.cache.ranges;

				// IE doesn't have range support (in the W3C way), so we
				// need to do some magic to transform selections into
				// CKEDITOR.dom.range instances.

				var sel = this.getNative(),
					nativeRange = sel.createRange(),
					type = this.getType(),
					range;

				if ( type == CKEDITOR.SELECTION_TEXT ) {
					range = new CKEDITOR.dom.range( this.document );

					var boundaryInfo = getBoundaryInformation( nativeRange, true );
					range.setStart( new CKEDITOR.dom.node( boundaryInfo.container ), boundaryInfo.offset );

					boundaryInfo = getBoundaryInformation( nativeRange );
					range.setEnd( new CKEDITOR.dom.node( boundaryInfo.container ), boundaryInfo.offset );

					return ( this._.cache.ranges = [ range ] );
				} else if ( type == CKEDITOR.SELECTION_ELEMENT ) {
					var retval = this._.cache.ranges = [];

					for ( var i = 0; i < nativeRange.length; i++ ) {
						var element = nativeRange.item( i ),
							parentElement = element.parentNode,
							j = 0;

						range = new CKEDITOR.dom.range( this.document );

						for ( ; j < parentElement.childNodes.length && parentElement.childNodes[ j ] != element; j++ ) {
	/*jsl:pass*/
						}

						range.setStart( new CKEDITOR.dom.node( parentElement ), j );
						range.setEnd( new CKEDITOR.dom.node( parentElement ), j + 1 );
						retval.push( range );
					}

					return retval;
				}

				return ( this._.cache.ranges = [] );
			};
		})() : function() {
			if ( this._.cache.ranges )
				return this._.cache.ranges;

			// On browsers implementing the W3C range, we simply
			// tranform the native ranges in CKEDITOR.dom.range
			// instances.

			var ranges = [];
			var sel = this.getNative();

			for ( var i = 0; i < sel.rangeCount; i++ ) {
				var nativeRange = sel.getRangeAt( i );
				var range = new CKEDITOR.dom.range( this.document );

				range.setStart( new CKEDITOR.dom.node( nativeRange.startContainer ), nativeRange.startOffset );
				range.setEnd( new CKEDITOR.dom.node( nativeRange.endContainer ), nativeRange.endOffset );
				ranges.push( range );
			}

			return ( this._.cache.ranges = ranges );
		},

		/**
		 * Gets the DOM element in which the selection starts.
		 * @returns {CKEDITOR.dom.element} The element at the beginning of the
		 *		selection.
		 * @example
		 * var element = editor.getSelection().<b>getStartElement()</b>;
		 * alert( element.getName() );
		 */
		getStartElement: function() {
			var node,
				sel = this.getNative();

			switch ( this.getType() ) {
				case CKEDITOR.SELECTION_ELEMENT:
					return this.getSelectedElement();

				case CKEDITOR.SELECTION_TEXT:

					var range = this.getRanges()[ 0 ];

					if ( range ) {
						if ( !range.collapsed ) {
							range.optimize();

							node = range.startContainer;

							if ( node.type != CKEDITOR.NODE_ELEMENT )
								return node.getParent();

							node = node.getChild( range.startOffset );

							if ( !node || node.type != CKEDITOR.NODE_ELEMENT )
								return range.startContainer;

							var child = node.getFirst();
							while ( child && child.type == CKEDITOR.NODE_ELEMENT ) {
								node = child;
								child = child.getFirst();
							}

							return node;
						}
					}

					if ( CKEDITOR.env.ie ) {
						range = sel.createRange();
						range.collapse( true );

						node = range.parentElement();
					} else {
						node = sel.anchorNode;

						if ( node.nodeType != 1 )
							node = node.parentNode;
					}
			}

			return ( node ? new CKEDITOR.dom.element( node ) : null );
		},

		/**
		 * Gets the current selected element.
		 * @returns {CKEDITOR.dom.element} The selected element. Null if no
		 *		selection is available or the selection type is not
		 *		{@link CKEDITOR.SELECTION_ELEMENT}.
		 * @example
		 * var element = editor.getSelection().<b>getSelectedElement()</b>;
		 * alert( element.getName() );
		 */
		getSelectedElement: function() {
			var node;

			if ( this.getType() == CKEDITOR.SELECTION_ELEMENT ) {
				var sel = this.getNative();

				if ( CKEDITOR.env.ie ) {
					try {
						node = sel.createRange().item( 0 );
					} catch ( e ) {}
				} else {
					var range = sel.getRangeAt( 0 );
					node = range.startContainer.childNodes[ range.startOffset ];
				}
			}

			return ( node ? new CKEDITOR.dom.element( node ) : null );
		},

		reset: function() {
			this._.cache = {};
		},

		selectElement: CKEDITOR.env.ie ?
		function( element ) {
			this.getNative().empty();

			var range;
			try {
				// Try to select the node as a control.
				range = this.document.$.body.createControlRange();
				range.addElement( element.$ );
			} catch ( e ) {
				// If failed, select it as a text range.
				range = this.document.$.body.createTextRange();
				range.moveToElementText( element.$ );
			}

			range.select();
			this.onSelectionSet && this.onSelectionSet();
		} : function( element ) {
			// Create the range for the element.
			var range = this.document.$.createRange();
			range.selectNode( element.$ );

			// Select the range.
			var sel = this.getNative();
			sel.removeAllRanges();
			sel.addRange( range );
			this.onSelectionSet && this.onSelectionSet();
		},

		selectRanges: CKEDITOR.env.ie ?
		function( ranges ) {
			// IE doesn't accept multiple ranges selection, so we just
			// select the first one.
			if ( ranges[ 0 ] )
				ranges[ 0 ].select();
			this.onSelectionSet && this.onSelectionSet();
		} : function( ranges ) {
			var sel = this.getNative();
			sel.removeAllRanges();

			for ( var i = 0; i < ranges.length; i++ ) {
				var range = ranges[ i ];
				var nativeRange = this.document.$.createRange();
				nativeRange.setStart( range.startContainer.$, range.startOffset );
				nativeRange.setEnd( range.endContainer.$, range.endOffset );

				// Select the range.
				sel.addRange( nativeRange );
			}
			this.onSelectionSet && this.onSelectionSet();
		},

		createBookmarks: function() {
			var retval = [],
				ranges = this.getRanges();
			for ( var i = 0; i < ranges.length; i++ )
				retval.push( ranges[ i ].createBookmark() );
			return retval;
		},

		selectBookmarks: function( bookmarks ) {
			var ranges = [];
			for ( var i = 0; i < bookmarks.length; i++ ) {
				var range = new CKEDITOR.dom.range( this.document );
				range.moveToBookmark( bookmarks[ i ] );
				ranges.push( range );
			}
			this.selectRanges( ranges );
			return this;
		}
	};
})();

CKEDITOR.dom.range.prototype.select = CKEDITOR.env.ie ?
// V2
function() {
	var collapsed = this.collapsed;
	var isStartMakerAlone;
	var dummySpan;

	var bookmark = this.createBookmark();

	// Create marker tags for the start and end boundaries.
	var startNode = bookmark.startNode;

	var endNode;
	if ( !collapsed )
		endNode = bookmark.endNode;

	// Create the main range which will be used for the selection.
	var ieRange = this.document.$.body.createTextRange();

	// Position the range at the start boundary.
	ieRange.moveToElementText( startNode.$ );
	ieRange.moveStart( 'character', 1 );

	if ( endNode ) {
		// Create a tool range for the end.
		var ieRangeEnd = this.document.$.body.createTextRange();

		// Position the tool range at the end.
		ieRangeEnd.moveToElementText( endNode.$ );

		// Move the end boundary of the main range to match the tool range.
		ieRange.setEndPoint( 'EndToEnd', ieRangeEnd );
		ieRange.moveEnd( 'character', -1 );
	} else {
		isStartMakerAlone = ( !startNode.hasPrevious() || ( startNode.getPrevious().is && startNode.getPrevious().is( 'br' ) ) ) && !startNode.hasNext();

		// Append a temporary <span>&#65279;</span> before the selection.
		// This is needed to avoid IE destroying selections inside empty
		// inline elements, like <b></b> (#253).
		// It is also needed when placing the selection right after an inline
		// element to avoid the selection moving inside of it.
		dummySpan = this.document.createElement( 'span' );
		dummySpan.setHtml( '&#65279;' ); // Zero Width No-Break Space (U+FEFF). See #1359.
		dummySpan.insertBefore( startNode );

		if ( isStartMakerAlone ) {
			// To expand empty blocks or line spaces after <br>, we need
			// instead to have any char, which will be later deleted using the
			// selection.
			// \ufeff = Zero Width No-Break Space (U+FEFF). See #1359.
			this.document.createText( '\ufeff' ).insertBefore( startNode );
		}
	}

	// Remove the markers (reset the position, because of the changes in the DOM tree).
	this.setStartBefore( startNode );
	startNode.remove();

	if ( collapsed ) {
		if ( isStartMakerAlone ) {
			// Move the selection start to include the temporary &#65279;.
			//ieRange.moveStart( 'character', -1 );

			ieRange.select();

			// Remove our temporary stuff.
			//					this.document.$.selection.clear();
		} else
			ieRange.select();

		dummySpan.remove();
	} else {
		this.setEndBefore( endNode );
		endNode.remove();
		ieRange.select();
	}
} : function() {
	var startContainer = this.startContainer;

	// If we have a collapsed range, inside an empty element, we must add
	// something to it, otherwise the caret will not be visible.
	if ( this.collapsed && startContainer.type == CKEDITOR.NODE_ELEMENT && !startContainer.getChildCount() )
		startContainer.append( new CKEDITOR.dom.text( '' ) );

	var nativeRange = this.document.$.createRange();
	nativeRange.setStart( startContainer.$, this.startOffset );

	try {
		nativeRange.setEnd( this.endContainer.$, this.endOffset );
	} catch ( e ) {
		// There is a bug in Firefox implementation (it would be too easy
		// otherwise). The new start can't be after the end (W3C says it can).
		// So, let's create a new range and collapse it to the desired point.
		if ( e.toString().indexOf( 'NS_ERROR_ILLEGAL_VALUE' ) >= 0 ) {
			this.collapse( true );
			nativeRange.setEnd( this.endContainer.$, this.endOffset );
		} else
			throw ( e );
	}

	var selection = this.document.getSelection().getNative();
	selection.removeAllRanges();
	selection.addRange( nativeRange );
};
