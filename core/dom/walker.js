/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	// This function is to be called under a "walker" instance scope.
	function iterate( rtl, breakOnFalse ) {
		var range = this.range;

		// Return null if we have reached the end.
		if ( this._.end )
			return null;

		// This is the first call. Initialize it.
		if ( !this._.start ) {
			this._.start = 1;

			// A collapsed range must return null at first call.
			if ( range.collapsed ) {
				this.end();
				return null;
			}

			// Move outside of text node edges.
			range.optimize();
		}

		var node,
			startCt = range.startContainer,
			endCt = range.endContainer,
			startOffset = range.startOffset,
			endOffset = range.endOffset,
			guard,
			userGuard = this.guard,
			type = this.type,
			getSourceNodeFn = ( rtl ? 'getPreviousSourceNode' : 'getNextSourceNode' );

		// Create the LTR guard function, if necessary.
		if ( !rtl && !this._.guardLTR ) {
			// The node that stops walker from moving up.
			var limitLTR = endCt.type == CKEDITOR.NODE_ELEMENT ? endCt : endCt.getParent();

			// The node that stops the walker from going to next.
			var blockerLTR = endCt.type == CKEDITOR.NODE_ELEMENT ? endCt.getChild( endOffset ) : endCt.getNext();

			this._.guardLTR = function( node, movingOut ) {
				return ( ( !movingOut || !limitLTR.equals( node ) ) && ( !blockerLTR || !node.equals( blockerLTR ) ) && ( node.type != CKEDITOR.NODE_ELEMENT || !movingOut || !node.equals( range.root ) ) );
			};
		}

		// Create the RTL guard function, if necessary.
		if ( rtl && !this._.guardRTL ) {
			// The node that stops walker from moving up.
			var limitRTL = startCt.type == CKEDITOR.NODE_ELEMENT ? startCt : startCt.getParent();

			// The node that stops the walker from going to next.
			var blockerRTL = startCt.type == CKEDITOR.NODE_ELEMENT ? startOffset ? startCt.getChild( startOffset - 1 ) : null : startCt.getPrevious();

			this._.guardRTL = function( node, movingOut ) {
				return ( ( !movingOut || !limitRTL.equals( node ) ) && ( !blockerRTL || !node.equals( blockerRTL ) ) && ( node.type != CKEDITOR.NODE_ELEMENT || !movingOut || !node.equals( range.root ) ) );
			};
		}

		// Define which guard function to use.
		var stopGuard = rtl ? this._.guardRTL : this._.guardLTR;

		// Make the user defined guard function participate in the process,
		// otherwise simply use the boundary guard.
		if ( userGuard ) {
			guard = function( node, movingOut ) {
				if ( stopGuard( node, movingOut ) === false )
					return false;

				return userGuard( node, movingOut );
			};
		} else {
			guard = stopGuard;
		}

		if ( this.current )
			node = this.current[ getSourceNodeFn ]( false, type, guard );
		else {
			// Get the first node to be returned.
			if ( rtl ) {
				node = endCt;

				if ( node.type == CKEDITOR.NODE_ELEMENT ) {
					if ( endOffset > 0 )
						node = node.getChild( endOffset - 1 );
					else
						node = ( guard( node, true ) === false ) ? null : node.getPreviousSourceNode( true, type, guard );
				}
			} else {
				node = startCt;

				if ( node.type == CKEDITOR.NODE_ELEMENT ) {
					if ( !( node = node.getChild( startOffset ) ) )
						node = ( guard( startCt, true ) === false ) ? null : startCt.getNextSourceNode( true, type, guard );
				}
			}

			if ( node && guard( node ) === false )
				node = null;
		}

		while ( node && !this._.end ) {
			this.current = node;

			if ( !this.evaluator || this.evaluator( node ) !== false ) {
				if ( !breakOnFalse )
					return node;
			} else if ( breakOnFalse && this.evaluator ) {
				return false;
			}

			node = node[ getSourceNodeFn ]( false, type, guard );
		}

		this.end();
		return this.current = null;
	}

	function iterateToLast( rtl ) {
		var node,
			last = null;

		while ( ( node = iterate.call( this, rtl ) ) )
			last = node;

		return last;
	}

	/**
	 * Utility class to "walk" the DOM inside range boundaries. If the
	 * range starts or ends in the middle of the text node, this node will
	 * be included as a whole. Outside changes to the range may break the walker.
	 *
	 * The walker may return nodes that are not totally included in the
	 * range boundaries. Let us take the following range representation,
	 * where the square brackets indicate the boundaries:
	 *
	 *		[<p>Some <b>sample] text</b>
	 *
	 * While walking forward into the above range, the following nodes are
	 * returned: `<p>`, `"Some "`, `<b>` and `"sample"`. Going
	 * backwards instead we have: `"sample"` and `"Some "`. So note that the
	 * walker always returns nodes when "entering" them, but not when
	 * "leaving" them. The {@link #guard} function is instead called both when
	 * entering and when leaving nodes.
	 *
	 * @class
	 */
	CKEDITOR.dom.walker = CKEDITOR.tools.createClass( {
		/**
		 * Creates a walker class instance.
		 *
		 * @constructor
		 * @param {CKEDITOR.dom.range} range The range within which to walk.
		 */
		$: function( range ) {
			this.range = range;

			/**
			 * A function executed for every matched node to check whether
			 * it is to be considered in the walk or not. If not provided, all
			 * matched nodes are considered good.
			 *
			 * If the function returns `false`, the node is ignored.
			 *
			 * @property {Function} evaluator
			 */
			// this.evaluator = null;

			/**
			 * A function executed for every node the walk passes by to check
			 * whether the walk is to be finished. It is called both when
			 * entering and when exiting nodes, as well as for the matched nodes.
			 *
			 * If this function returns `false`, the walking ends and no more
			 * nodes are evaluated.

			 * @property {Function} guard
			 */
			// this.guard = null;

			/** @private */
			this._ = {};
		},

		//		statics :
		//		{
		//			/* Creates a CKEDITOR.dom.walker instance to walk inside DOM boundaries set by nodes.
		//			 * @param {CKEDITOR.dom.node} startNode The node from which the walk
		//			 *		will start.
		//			 * @param {CKEDITOR.dom.node} [endNode] The last node to be considered
		//			 *		in the walk. No more nodes are retrieved after touching or
		//			 *		passing it. If not provided, the walker stops at the
		//			 *		&lt;body&gt; closing boundary.
		//			 * @returns {CKEDITOR.dom.walker} A DOM walker for the nodes between the
		//			 *		provided nodes.
		//			 */
		//			createOnNodes : function( startNode, endNode, startInclusive, endInclusive )
		//			{
		//				var range = new CKEDITOR.dom.range();
		//				if ( startNode )
		//					range.setStartAt( startNode, startInclusive ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_END ) ;
		//				else
		//					range.setStartAt( startNode.getDocument().getBody(), CKEDITOR.POSITION_AFTER_START ) ;
		//
		//				if ( endNode )
		//					range.setEndAt( endNode, endInclusive ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START ) ;
		//				else
		//					range.setEndAt( startNode.getDocument().getBody(), CKEDITOR.POSITION_BEFORE_END ) ;
		//
		//				return new CKEDITOR.dom.walker( range );
		//			}
		//		},
		//
		proto: {
			/**
			 * Stops walking. No more nodes are retrieved if this function is called.
			 */
			end: function() {
				this._.end = 1;
			},

			/**
			 * Retrieves the next node (on the right).
			 *
			 * @returns {CKEDITOR.dom.node} The next node or `null` if no more
			 * nodes are available.
			 */
			next: function() {
				return iterate.call( this );
			},

			/**
			 * Retrieves the previous node (on the left).
			 *
			 * @returns {CKEDITOR.dom.node} The previous node or `null` if no more
			 * nodes are available.
			 */
			previous: function() {
				return iterate.call( this, 1 );
			},

			/**
			 * Checks all nodes on the right, executing the evaluation function.
			 *
			 * @returns {Boolean} `false` if the evaluator function returned
			 * `false` for any of the matched nodes. Otherwise `true`.
			 */
			checkForward: function() {
				return iterate.call( this, 0, 1 ) !== false;
			},

			/**
			 * Check all nodes on the left, executing the evaluation function.
			 *
			 * @returns {Boolean} `false` if the evaluator function returned
			 * `false` for any of the matched nodes. Otherwise `true`.
			 */
			checkBackward: function() {
				return iterate.call( this, 1, 1 ) !== false;
			},

			/**
			 * Executes a full walk forward (to the right), until no more nodes
			 * are available, returning the last valid node.
			 *
			 * @returns {CKEDITOR.dom.node} The last node on the right or `null`
			 * if no valid nodes are available.
			 */
			lastForward: function() {
				return iterateToLast.call( this );
			},

			/**
			 * Executes a full walk backwards (to the left), until no more nodes
			 * are available, returning the last valid node.
			 *
			 * @returns {CKEDITOR.dom.node} The last node on the left or `null`
			 * if no valid nodes are available.
			 */
			lastBackward: function() {
				return iterateToLast.call( this, 1 );
			},

			/**
			 * Resets the walker.
			 */
			reset: function() {
				delete this.current;
				this._ = {};
			}

		}
	} );

	// Anything whose display computed style is block, list-item, table,
	// table-row-group, table-header-group, table-footer-group, table-row,
	// table-column-group, table-column, table-cell, table-caption, or whose node
	// name is hr, br (when enterMode is br only) is a block boundary.
	var blockBoundaryDisplayMatch = {
			block: 1, 'list-item': 1, table: 1, 'table-row-group': 1,
			'table-header-group': 1, 'table-footer-group': 1, 'table-row': 1, 'table-column-group': 1,
			'table-column': 1, 'table-cell': 1, 'table-caption': 1
		},
		outOfFlowPositions = { absolute: 1, fixed: 1 };

	/**
	 * Checks whether an element is displayed as a block.
	 *
	 * @member CKEDITOR.dom.element
	 * @param [customNodeNames] Custom list of nodes which will extend
	 * the default {@link CKEDITOR.dtd#$block} list.
	 * @returns {Boolean}
	 */
	CKEDITOR.dom.element.prototype.isBlockBoundary = function( customNodeNames ) {
		// Whether element is in normal page flow. Floated or positioned elements are out of page flow.
		// Don't consider floated or positioned formatting as block boundary, fall back to dtd check in that case. (https://dev.ckeditor.com/ticket/6297)
		var inPageFlow = this.getComputedStyle( 'float' ) == 'none' && !( this.getComputedStyle( 'position' ) in outOfFlowPositions );

		if ( inPageFlow && blockBoundaryDisplayMatch[ this.getComputedStyle( 'display' ) ] )
			return true;

		// Either in $block or in customNodeNames if defined.
		return !!( this.is( CKEDITOR.dtd.$block ) || customNodeNames && this.is( customNodeNames ) );
	};

	/**
	 * Returns a function which checks whether the node is a block boundary.
	 * See {@link CKEDITOR.dom.element#isBlockBoundary}.
	 *
	 * @static
	 * @param customNodeNames
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.blockBoundary = function( customNodeNames ) {
		return function( node ) {
			return !( node.type == CKEDITOR.NODE_ELEMENT && node.isBlockBoundary( customNodeNames ) );
		};
	};

	/**
	 * @static
	 * @todo
	 */
	CKEDITOR.dom.walker.listItemBoundary = function() {
		return this.blockBoundary( { br: 1 } );
	};

	/**
	 * Returns a function which checks whether the node is a bookmark node or the bookmark node
	 * inner content.
	 *
	 * @static
	 * @param {Boolean} [contentOnly=false] Whether only test against the text content of
	 * a bookmark node instead of the element itself (default).
	 * @param {Boolean} [isReject=false] Whether to return `false` for the bookmark
	 * node instead of `true` (default).
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.bookmark = function( contentOnly, isReject ) {
		function isBookmarkNode( node ) {
			return ( node && node.getName && node.getName() == 'span' && node.data( 'cke-bookmark' ) );
		}

		return function( node ) {
			var isBookmark, parent;
			// Is bookmark inner text node?
			isBookmark = ( node && node.type != CKEDITOR.NODE_ELEMENT && ( parent = node.getParent() ) && isBookmarkNode( parent ) );
			// Is bookmark node?
			isBookmark = contentOnly ? isBookmark : isBookmark || isBookmarkNode( node );
			return !!( isReject ^ isBookmark );
		};
	};

	/**
	 * Returns a function which checks whether the node is a text node containing only whitespace characters.
	 *
	 * @static
	 * @param {Boolean} [isReject=false]
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.whitespaces = function( isReject ) {
		return function( node ) {
			var isWhitespace;
			if ( node && node.type == CKEDITOR.NODE_TEXT ) {
				// Whitespace, as well as the Filling Char Sequence text node used in Webkit. (https://dev.ckeditor.com/ticket/9384, https://dev.ckeditor.com/ticket/13816)
				isWhitespace = !CKEDITOR.tools.trim( node.getText() ) ||
					CKEDITOR.env.webkit && node.getText() == CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE;
			}

			return !!( isReject ^ isWhitespace );
		};
	};

	/**
	 * Returns a function which checks whether the node is invisible in the WYSIWYG mode.
	 *
	 * @static
	 * @param {Boolean} [isReject=false]
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.invisible = function( isReject ) {
		var whitespace = CKEDITOR.dom.walker.whitespaces(),
			// https://dev.ckeditor.com/ticket/12221 (Chrome) plus https://dev.ckeditor.com/ticket/11111 (Safari).
			offsetWidth0 = CKEDITOR.env.webkit ? 1 : 0;

		return function( node ) {
			var invisible;

			if ( whitespace( node ) )
				invisible = 1;
			else {
				// Visibility should be checked on element.
				if ( node.type == CKEDITOR.NODE_TEXT )
					node = node.getParent();

				// Nodes that take no spaces in wysiwyg:
				// 1. White-spaces but not including NBSP.
				// 2. Empty inline elements, e.g. <b></b>.
				// 3. <br> elements (bogus, surrounded by text) (https://dev.ckeditor.com/ticket/12423).
				invisible = node.$.offsetWidth <= offsetWidth0;
			}

			return !!( isReject ^ invisible );
		};
	};

	/**
	 * Returns a function which checks whether the node type is equal to the passed one.
	 *
	 * @static
	 * @param {Number} type
	 * @param {Boolean} [isReject=false]
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.nodeType = function( type, isReject ) {
		return function( node ) {
			return !!( isReject ^ ( node.type == type ) );
		};
	};

	/**
	 * Returns a function which checks whether the node is a bogus (filler) node from
	 * `contenteditable` element's point of view.
	 *
	 * @static
	 * @param {Boolean} [isReject=false]
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.bogus = function( isReject ) {
		function nonEmpty( node ) {
			return !isWhitespaces( node ) && !isBookmark( node );
		}

		return function( node ) {
			var isBogus = CKEDITOR.env.needsBrFiller ? node.is && node.is( 'br' ) : node.getText && tailNbspRegex.test( node.getText() );

			if ( isBogus ) {
				var parent = node.getParent(),
					next = node.getNext( nonEmpty );

				isBogus = parent.isBlockBoundary() && ( !next || next.type == CKEDITOR.NODE_ELEMENT && next.isBlockBoundary() );
			}

			return !!( isReject ^ isBogus );
		};
	};

	/**
	 * Returns a function which checks whether the node is a temporary element
	 * (element with the `data-cke-temp` attribute) or its child.
	 *
	 * @since 4.3.0
	 * @static
	 * @param {Boolean} [isReject=false] Whether to return `false` for the
	 * temporary element instead of `true` (default).
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.temp = function( isReject ) {
		return function( node ) {
			if ( node.type != CKEDITOR.NODE_ELEMENT )
				node = node.getParent();

			var isTemp = node && node.hasAttribute( 'data-cke-temp' );

			return !!( isReject ^ isTemp );
		};
	};

	var tailNbspRegex = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
		isWhitespaces = CKEDITOR.dom.walker.whitespaces(),
		isBookmark = CKEDITOR.dom.walker.bookmark(),
		isTemp = CKEDITOR.dom.walker.temp(),
		toSkip = function( node ) {
			return isBookmark( node ) ||
				isWhitespaces( node ) ||
				node.type == CKEDITOR.NODE_ELEMENT && node.is( CKEDITOR.dtd.$inline ) && !node.is( CKEDITOR.dtd.$empty );
		};

	/**
	 * Returns a function which checks whether the node should be ignored in terms of "editability".
	 *
	 * This includes:
	 *
	 * * whitespaces (see {@link CKEDITOR.dom.walker#whitespaces}),
	 * * bookmarks (see {@link CKEDITOR.dom.walker#bookmark}),
	 * * temporary elements (see {@link CKEDITOR.dom.walker#temp}).
	 *
	 * @since 4.3.0
	 * @static
	 * @param {Boolean} [isReject=false] Whether to return `false` for the
	 * ignored element instead of `true` (default).
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.ignored = function( isReject ) {
		return function( node ) {
			var isIgnored = isWhitespaces( node ) || isBookmark( node ) || isTemp( node );

			return !!( isReject ^ isIgnored );
		};
	};

	var isIgnored = CKEDITOR.dom.walker.ignored();

	/**
	 * Returns a function which checks whether the node is empty.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {Boolean} [isReject=false] Whether to return `false` for the
	 * ignored element instead of `true` (default).
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.empty = function( isReject ) {
		return function( node ) {
			var i = 0,
				l = node.getChildCount();

			for ( ; i < l; ++i ) {
				if ( !isIgnored( node.getChild( i ) ) ) {
					return !!isReject;
				}
			}

			return !isReject;
		};
	};

	var isEmpty = CKEDITOR.dom.walker.empty();

	function filterTextContainers( dtd ) {
		var hash = {},
			name;

		for ( name in dtd ) {
			if ( CKEDITOR.dtd[ name ][ '#' ] )
				hash[ name ] = 1;
		}
		return hash;
	}

	/**
	 * A hash of element names which in browsers that {@link CKEDITOR.env#needsBrFiller do not need `<br>` fillers}
	 * can be selection containers despite being empty.
	 *
	 * @since 4.5.0
	 * @static
	 * @property {Object} validEmptyBlockContainers
	 */
	var validEmptyBlocks = CKEDITOR.dom.walker.validEmptyBlockContainers = CKEDITOR.tools.extend(
		filterTextContainers( CKEDITOR.dtd.$block ),
		{ caption: 1, td: 1, th: 1 }
	);

	function isEditable( node ) {
		// Skip temporary elements, bookmarks and whitespaces.
		if ( isIgnored( node ) )
			return false;

		if ( node.type == CKEDITOR.NODE_TEXT )
			return true;

		if ( node.type == CKEDITOR.NODE_ELEMENT ) {
			// All inline and non-editable elements are valid editable places.
			// Note: the <hr> is currently the only element in CKEDITOR.dtd.$empty and CKEDITOR.dtd.$block,
			// but generally speaking we need an intersection of these two sets.
			// Note: non-editable block has to be treated differently (should be selected entirely).
			if ( node.is( CKEDITOR.dtd.$inline ) || node.is( 'hr' ) || node.getAttribute( 'contenteditable' ) == 'false' )
				return true;

			// Empty blocks are editable on IE.
			if ( !CKEDITOR.env.needsBrFiller && node.is( validEmptyBlocks ) && isEmpty( node ) )
				return true;
		}

		// Skip all other nodes.
		return false;
	}

	/**
	 * Returns a function which checks whether the node can be a container or a sibling
	 * of the selection end.
	 *
	 * This includes:
	 *
	 * * text nodes (but not whitespaces),
	 * * inline elements,
	 * * intersection of {@link CKEDITOR.dtd#$empty} and {@link CKEDITOR.dtd#$block} (currently
	 * it is only `<hr>`),
	 * * non-editable blocks (special case &mdash; such blocks cannot be containers nor
	 * siblings, they need to be selected entirely),
	 * * empty {@link #validEmptyBlockContainers blocks} which can contain text
	 * ({@link CKEDITOR.env#needsBrFiller old IEs only}).
	 *
	 * @since 4.3.0
	 * @static
	 * @param {Boolean} [isReject=false] Whether to return `false` for the
	 * ignored element instead of `true` (default).
	 * @returns {Function}
	 */
	CKEDITOR.dom.walker.editable = function( isReject ) {
		return function( node ) {
			return !!( isReject ^ isEditable( node ) );
		};
	};

	/**
	 * Checks if there is a filler node at the end of an element, and returns it.
	 *
	 * @member CKEDITOR.dom.element
	 * @returns {CKEDITOR.dom.node/Boolean} Bogus node or `false`.
	 */
	CKEDITOR.dom.element.prototype.getBogus = function() {
		// Bogus are not always at the end, e.g. <p><a>text<br /></a></p> (https://dev.ckeditor.com/ticket/7070).
		var tail = this;
		do {
			tail = tail.getPreviousSourceNode();
		}
		while ( toSkip( tail ) );

		if ( tail && ( CKEDITOR.env.needsBrFiller ? tail.is && tail.is( 'br' ) : tail.getText && tailNbspRegex.test( tail.getText() ) ) )
			return tail;

		return false;
	};

} )();
