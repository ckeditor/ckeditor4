/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @ignore
 * File overview: DOM iterator which iterates over list items, lines and paragraphs.
 */

'use strict';

( function() {
	/**
	 * Represents the iterator class. It can be used to iterate
	 * over all elements (or even text nodes in case of {@link #enlargeBr} set to `false`)
	 * which establish "paragraph-like" spaces within the passed range.
	 *
	 *		// <h1>[foo</h1><p>bar]</p>
	 *		var iterator = range.createIterator();
	 *		iterator.getNextParagraph(); // h1 element
	 *		iterator.getNextParagraph(); // p element
	 *
	 *		// <ul><li>[foo</li><li>bar]</li>
	 *		// With enforceRealBlocks set to false the iterator will return two list item elements.
	 *		// With enforceRealBlocks set to true the iterator will return two paragraphs and the DOM will be changed to:
	 *		// <ul><li><p>foo</p></li><li><p>bar</p></li>
	 *
	 * @class CKEDITOR.dom.iterator
	 * @constructor Creates an iterator class instance.
	 * @param {CKEDITOR.dom.range} range
	 */
	function iterator( range ) {
		if ( arguments.length < 1 )
			return;

		/**
		 * @readonly
		 * @property {CKEDITOR.dom.range}
		 */
		this.range = range;

		/**
		 * @property {Boolean} [forceBrBreak=false]
		 */
		this.forceBrBreak = 0;

		// (https://dev.ckeditor.com/ticket/3730).
		/**
		 * Whether to include `<br>` elements in the enlarged range. Should be
		 * set to `false` when using the iterator in the {@link CKEDITOR#ENTER_BR} mode.
		 *
		 * @property {Boolean} [enlargeBr=true]
		 */
		this.enlargeBr = 1;

		/**
		 * Whether the iterator should create a transformable block
		 * if the current one contains text and cannot be transformed.
		 * For example new blocks will be established in elements like
		 * `<li>` or `<td>`.
		 *
		 * @property {Boolean} [enforceRealBlocks=false]
		 */
		this.enforceRealBlocks = 0;

		this._ || ( this._ = {} );
	}

	/**
	 * Default iterator's filter. It is set only for nested iterators.
	 *
	 * @since 4.3.0
	 * @readonly
	 * @property {CKEDITOR.filter} filter
	 */

	/**
	 * Iterator's active filter. It is set by the {@link #getNextParagraph} method
	 * when it enters a nested editable.
	 *
	 * @since 4.3.0
	 * @readonly
	 * @property {CKEDITOR.filter} activeFilter
	 */

	var beginWhitespaceRegex = /^[\r\n\t ]+$/,
		// Ignore bookmark nodes.(https://dev.ckeditor.com/ticket/3783)
		bookmarkGuard = CKEDITOR.dom.walker.bookmark( false, true ),
		whitespacesGuard = CKEDITOR.dom.walker.whitespaces( true ),
		skipGuard = function( node ) {
			return bookmarkGuard( node ) && whitespacesGuard( node );
		},
		listItemNames = { dd: 1, dt: 1, li: 1 };

	iterator.prototype = {
		/**
		 * Returns the next paragraph-like element or `null` if the end of a range is reached.
		 *
		 * @param {String} [blockTag='p'] Name of a block element which will be established by
		 * the iterator in block-less elements (see {@link #enforceRealBlocks}).
		 */
		getNextParagraph: function( blockTag ) {
			// The block element to be returned.
			var block;

			// The range object used to identify the paragraph contents.
			var range;

			// Indicats that the current element in the loop is the last one.
			var isLast;

			// Instructs to cleanup remaining BRs.
			var removePreviousBr, removeLastBr;

			blockTag = blockTag || 'p';

			// We're iterating over nested editable.
			if ( this._.nestedEditable ) {
				// Get next block from nested iterator and returns it if was found.
				block = this._.nestedEditable.iterator.getNextParagraph( blockTag );
				if ( block ) {
					// Inherit activeFilter from the nested iterator.
					this.activeFilter = this._.nestedEditable.iterator.activeFilter;
					return block;
				}

				// No block in nested iterator means that we reached the end of the nested editable.
				// Reset the active filter to the default filter (or undefined if this iterator didn't have it).
				this.activeFilter = this.filter;

				// Try to find next nested editable or get back to parent (this) iterator.
				if ( startNestedEditableIterator( this, blockTag, this._.nestedEditable.container, this._.nestedEditable.remaining ) ) {
					// Inherit activeFilter from the nested iterator.
					this.activeFilter = this._.nestedEditable.iterator.activeFilter;
					return this._.nestedEditable.iterator.getNextParagraph( blockTag );
				} else {
					this._.nestedEditable = null;
				}
			}

			// Block-less range should be checked first.
			if ( !this.range.root.getDtd()[ blockTag ] )
				return null;

			// This is the first iteration. Let's initialize it.
			if ( !this._.started )
				range = startIterator.call( this );

			var currentNode = this._.nextNode,
				lastNode = this._.lastNode;

			this._.nextNode = null;
			while ( currentNode ) {
				// closeRange indicates that a paragraph boundary has been found,
				// so the range can be closed.
				var closeRange = 0,
					parentPre = currentNode.hasAscendant( 'pre' );

				// includeNode indicates that the current node is good to be part
				// of the range. By default, any non-element node is ok for it.
				var includeNode = ( currentNode.type != CKEDITOR.NODE_ELEMENT ),
					continueFromSibling = 0;

				// If it is an element node, let's check if it can be part of the range.
				if ( !includeNode ) {
					var nodeName = currentNode.getName();

					// Non-editable block was found - return it and move to processing
					// its nested editables if they exist.
					if ( CKEDITOR.dtd.$block[ nodeName ] && currentNode.getAttribute( 'contenteditable' ) == 'false' ) {
						block = currentNode;

						// Setup iterator for first of nested editables.
						// If there's no editable, then algorithm will move to next element after current block.
						startNestedEditableIterator( this, blockTag, block );

						// Gets us straight to the end of getParagraph() because block variable is set.
						break;
					} else if ( currentNode.isBlockBoundary( this.forceBrBreak && !parentPre && { br: 1 } ) ) {
						// <br> boundaries must be part of the range. It will
						// happen only if ForceBrBreak.
						if ( nodeName == 'br' )
							includeNode = 1;
						else if ( !range && !currentNode.getChildCount() && nodeName != 'hr' ) {
							// If we have found an empty block, and haven't started
							// the range yet, it means we must return this block.
							block = currentNode;
							isLast = currentNode.equals( lastNode );
							break;
						}

						// The range must finish right before the boundary,
						// including possibly skipped empty spaces. (https://dev.ckeditor.com/ticket/1603)
						if ( range ) {
							range.setEndAt( currentNode, CKEDITOR.POSITION_BEFORE_START );

							// The found boundary must be set as the next one at this
							// point. (https://dev.ckeditor.com/ticket/1717)
							if ( nodeName != 'br' ) {
								this._.nextNode = currentNode;
							}
						}

						closeRange = 1;
					} else {
						// If we have child nodes, let's check them.
						if ( currentNode.getFirst() ) {
							// If we don't have a range yet, let's start it.
							if ( !range ) {
								range = this.range.clone();
								range.setStartAt( currentNode, CKEDITOR.POSITION_BEFORE_START );
							}

							currentNode = currentNode.getFirst();
							continue;
						}
						includeNode = 1;
					}
				} else if ( currentNode.type == CKEDITOR.NODE_TEXT ) {
					// Ignore normal whitespaces (i.e. not including &nbsp; or
					// other unicode whitespaces) before/after a block node.
					if ( beginWhitespaceRegex.test( currentNode.getText() ) )
						includeNode = 0;
				}

				// The current node is good to be part of the range and we are
				// starting a new range, initialize it first.
				if ( includeNode && !range ) {
					range = this.range.clone();
					range.setStartAt( currentNode, CKEDITOR.POSITION_BEFORE_START );
				}

				// The last node has been found.
				isLast = ( ( !closeRange || includeNode ) && currentNode.equals( lastNode ) );

				// If we are in an element boundary, let's check if it is time
				// to close the range, otherwise we include the parent within it.
				if ( range && !closeRange ) {
					while ( !currentNode.getNext( skipGuard ) && !isLast ) {
						var parentNode = currentNode.getParent();

						if ( parentNode.isBlockBoundary( this.forceBrBreak && !parentPre && { br: 1 } ) ) {
							closeRange = 1;
							includeNode = 0;
							isLast = isLast || ( parentNode.equals( lastNode ) );
							// Make sure range includes bookmarks at the end of the block. (https://dev.ckeditor.com/ticket/7359)
							range.setEndAt( parentNode, CKEDITOR.POSITION_BEFORE_END );
							break;
						}

						currentNode = parentNode;
						includeNode = 1;
						isLast = ( currentNode.equals( lastNode ) );
						continueFromSibling = 1;
					}
				}

				// Now finally include the node.
				if ( includeNode )
					range.setEndAt( currentNode, CKEDITOR.POSITION_AFTER_END );

				currentNode = this._getNextSourceNode( currentNode, continueFromSibling, lastNode );
				isLast = !currentNode;

				// We have found a block boundary. Let's close the range and move out of the
				// loop.
				if ( isLast || ( closeRange && range ) )
					break;
			}

			// Now, based on the processed range, look for (or create) the block to be returned.
			if ( !block ) {
				// If no range has been found, this is the end.
				if ( !range ) {
					this._.docEndMarker && this._.docEndMarker.remove();
					this._.nextNode = null;
					return null;
				}

				var startPath = new CKEDITOR.dom.elementPath( range.startContainer, range.root );
				var startBlockLimit = startPath.blockLimit,
					checkLimits = { div: 1, th: 1, td: 1 };
				block = startPath.block;

				if ( !block && startBlockLimit && !this.enforceRealBlocks && checkLimits[ startBlockLimit.getName() ] &&
					range.checkStartOfBlock() && range.checkEndOfBlock() && !startBlockLimit.equals( range.root ) ) {
					block = startBlockLimit;
				} else if ( !block || ( this.enforceRealBlocks && block.is( listItemNames ) ) ) {
					// Create the fixed block.
					block = this.range.document.createElement( blockTag );

					// Move the contents of the temporary range to the fixed block.
					range.extractContents().appendTo( block );
					block.trim();

					// Insert the fixed block into the DOM.
					range.insertNode( block );

					removePreviousBr = removeLastBr = true;
				} else if ( block.getName() != 'li' ) {
					// If the range doesn't includes the entire contents of the
					// block, we must split it, isolating the range in a dedicated
					// block.
					if ( !range.checkStartOfBlock() || !range.checkEndOfBlock() ) {
						// The resulting block will be a clone of the current one.
						block = block.clone( false );

						// Extract the range contents, moving it to the new block.
						range.extractContents().appendTo( block );
						block.trim();

						// Split the block. At this point, the range will be in the
						// right position for our intents.
						var splitInfo = range.splitBlock();

						removePreviousBr = !splitInfo.wasStartOfBlock;
						removeLastBr = !splitInfo.wasEndOfBlock;

						// Insert the new block into the DOM.
						range.insertNode( block );
					}
				} else if ( !isLast ) {
					// LIs are returned as is, with all their children (due to the
					// nested lists). But, the next node is the node right after
					// the current range, which could be an <li> child (nested
					// lists) or the next sibling <li>.

					this._.nextNode = ( block.equals( lastNode ) ? null : this._getNextSourceNode( range.getBoundaryNodes().endNode, 1, lastNode  ) );
				}
			}

			if ( removePreviousBr ) {
				var previousSibling = block.getPrevious();
				if ( previousSibling && previousSibling.type == CKEDITOR.NODE_ELEMENT ) {
					if ( previousSibling.getName() == 'br' )
						previousSibling.remove();
					else if ( previousSibling.getLast() && previousSibling.getLast().$.nodeName.toLowerCase() == 'br' )
						previousSibling.getLast().remove();
				}
			}

			if ( removeLastBr ) {
				var lastChild = block.getLast();
				if ( lastChild && lastChild.type == CKEDITOR.NODE_ELEMENT && lastChild.getName() == 'br' ) {
					// Remove br filler on browser which do not need it.
					if ( !CKEDITOR.env.needsBrFiller || lastChild.getPrevious( bookmarkGuard ) || lastChild.getNext( bookmarkGuard ) )
						lastChild.remove();
				}
			}

			// Get a reference for the next element. This is important because the
			// above block can be removed or changed, so we can rely on it for the
			// next interation.
			if ( !this._.nextNode ) {
				this._.nextNode = ( isLast || block.equals( lastNode ) || !lastNode ) ? null : this._getNextSourceNode( block, 1, lastNode );
			}

			return block;
		},

		/**
		 * Gets the next element to check or `null` when the `lastNode` or the
		 * {@link #range}'s {@link CKEDITOR.dom.range#root root} is reached. Bookmarks are skipped.
		 *
		 * @since 4.4.6
		 * @private
		 * @param {CKEDITOR.dom.node} node
		 * @param {Boolean} startFromSibling
		 * @param {CKEDITOR.dom.node} lastNode
		 * @returns {CKEDITOR.dom.node}
		 */
		_getNextSourceNode: function( node, startFromSibling, lastNode ) {
			var rootNode = this.range.root,
				next;

			// Here we are checking in guard function whether current element
			// reach lastNode(default behaviour) and root node to prevent against
			// getting out of editor instance root DOM object.
			// https://dev.ckeditor.com/ticket/12484
			function guardFunction( node ) {
				return !( node.equals( lastNode ) || node.equals( rootNode ) );
			}

			next = node.getNextSourceNode( startFromSibling, null, guardFunction );
			while ( !bookmarkGuard( next ) ) {
				next = next.getNextSourceNode( startFromSibling, null, guardFunction );
			}
			return next;
		}
	};

	// @context CKEDITOR.dom.iterator
	// @returns Collapsed range which will be reused when during furter processing.
	function startIterator() {
		var range = this.range.clone(),
			// Indicate at least one of the range boundaries is inside a preformat block.
			touchPre,

			// (https://dev.ckeditor.com/ticket/12178)
			// Remember if following situation takes place:
			// * startAtInnerBoundary: <p>foo[</p>...
			// * endAtInnerBoundary: ...<p>]bar</p>
			// Because information about line break will be lost when shrinking range.
			// Note that we test only if path block exist, because we must properly shrink
			// range containing table and/or table cells.
			// Note: When range is collapsed there's no way it can be shrinked.
			// By checking if range is collapsed we also prevent https://dev.ckeditor.com/ticket/12308.
			startPath = range.startPath(),
			endPath = range.endPath(),
			startAtInnerBoundary = !range.collapsed && rangeAtInnerBlockBoundary( range, startPath.block ),
			endAtInnerBoundary = !range.collapsed && rangeAtInnerBlockBoundary( range, endPath.block, 1 );

		// Shrink the range to exclude harmful "noises" (https://dev.ckeditor.com/ticket/4087, https://dev.ckeditor.com/ticket/4450, https://dev.ckeditor.com/ticket/5435).
		range.shrink( CKEDITOR.SHRINK_ELEMENT, true );

		if ( startAtInnerBoundary )
			range.setStartAt( startPath.block, CKEDITOR.POSITION_BEFORE_END );
		if ( endAtInnerBoundary )
			range.setEndAt( endPath.block, CKEDITOR.POSITION_AFTER_START );

		touchPre = range.endContainer.hasAscendant( 'pre', true ) || range.startContainer.hasAscendant( 'pre', true );

		range.enlarge( this.forceBrBreak && !touchPre || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS );

		if ( !range.collapsed ) {
			var walker = new CKEDITOR.dom.walker( range.clone() ),
				ignoreBookmarkTextEvaluator = CKEDITOR.dom.walker.bookmark( true, true );
			// Avoid anchor inside bookmark inner text.
			walker.evaluator = ignoreBookmarkTextEvaluator;
			this._.nextNode = walker.next();
			// TODO: It's better to have walker.reset() used here.
			walker = new CKEDITOR.dom.walker( range.clone() );
			walker.evaluator = ignoreBookmarkTextEvaluator;
			var lastNode = walker.previous();
			this._.lastNode = lastNode.getNextSourceNode( true, null, range.root );

			// We may have an empty text node at the end of block due to [3770].
			// If that node is the lastNode, it would cause our logic to leak to the
			// next block.(https://dev.ckeditor.com/ticket/3887)
			if ( this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim( this._.lastNode.getText() ) && this._.lastNode.getParent().isBlockBoundary() ) {
				var testRange = this.range.clone();
				testRange.moveToPosition( this._.lastNode, CKEDITOR.POSITION_AFTER_END );
				if ( testRange.checkEndOfBlock() ) {
					var path = new CKEDITOR.dom.elementPath( testRange.endContainer, testRange.root ),
						lastBlock = path.block || path.blockLimit;
					this._.lastNode = lastBlock.getNextSourceNode( true );
				}
			}

			// The end of document or range.root was reached, so we need a marker node inside.
			if ( !this._.lastNode || !range.root.contains( this._.lastNode ) ) {
				this._.lastNode = this._.docEndMarker = range.document.createText( '' );
				this._.lastNode.insertAfter( lastNode );
			}

			// Let's reuse this variable.
			range = null;
		}

		this._.started = 1;

		return range;
	}

	// Does a nested editables lookup inside editablesContainer.
	// If remainingEditables is set will lookup inside this array.
	// @param {CKEDITOR.dom.element} editablesContainer
	// @param {CKEDITOR.dom.element[]} [remainingEditables]
	function getNestedEditableIn( editablesContainer, remainingEditables ) {
		if ( remainingEditables == null )
			remainingEditables = findNestedEditables( editablesContainer );

		var editable;

		while ( ( editable = remainingEditables.shift() ) ) {
			if ( isIterableEditable( editable ) )
				return { element: editable, remaining: remainingEditables };
		}

		return null;
	}

	// Checkes whether we can iterate over this editable.
	function isIterableEditable( editable ) {
		// Reject blockless editables.
		return editable.getDtd().p;
	}

	// Finds nested editables within container. Does not return
	// editables nested in another editable (twice).
	function findNestedEditables( container ) {
		var editables = [];

		container.forEach( function( element ) {
			if ( element.getAttribute( 'contenteditable' ) == 'true' ) {
				editables.push( element );
				return false; // Skip children.
			}
		}, CKEDITOR.NODE_ELEMENT, true );

		return editables;
	}

	// Looks for a first nested editable after previousEditable (if passed) and creates
	// nested iterator for it.
	function startNestedEditableIterator( parentIterator, blockTag, editablesContainer, remainingEditables ) {
		var editable = getNestedEditableIn( editablesContainer, remainingEditables );

		if ( !editable )
			return 0;

		var filter = CKEDITOR.filter.instances[ editable.element.data( 'cke-filter' ) ];

		// If current editable has a filter and this filter does not allow for block tag,
		// search for next nested editable in remaining ones.
		if ( filter && !filter.check( blockTag ) )
			return startNestedEditableIterator( parentIterator, blockTag, editablesContainer, editable.remaining );

		var range = new CKEDITOR.dom.range( editable.element );
		range.selectNodeContents( editable.element );

		var iterator = range.createIterator();
		// This setting actually does not change anything in this case,
		// because entire range contents is selected, so there're no <br>s to be included.
		// But it seems right to copy it too.
		iterator.enlargeBr = parentIterator.enlargeBr;
		// Inherit configuration from parent iterator.
		iterator.enforceRealBlocks = parentIterator.enforceRealBlocks;
		// Set the activeFilter (which can be overriden when this iteator will start nested iterator)
		// and the default filter, which will make it possible to reset to
		// current iterator's activeFilter after leaving nested editable.
		iterator.activeFilter = iterator.filter = filter;

		parentIterator._.nestedEditable = {
			element: editable.element,
			container: editablesContainer,
			remaining: editable.remaining,
			iterator: iterator
		};

		return 1;
	}

	// Checks whether range starts or ends at inner block boundary.
	// See usage comments to learn more.
	function rangeAtInnerBlockBoundary( range, block, checkEnd ) {
		if ( !block )
			return false;

		var testRange = range.clone();
		testRange.collapse( !checkEnd );
		return testRange.checkBoundaryOfElement( block, checkEnd ? CKEDITOR.START : CKEDITOR.END );
	}

	/**
	 * Creates a {@link CKEDITOR.dom.iterator} instance for this range.
	 *
	 * @member CKEDITOR.dom.range
	 * @returns {CKEDITOR.dom.iterator}
	 */
	CKEDITOR.dom.range.prototype.createIterator = function() {
		return new iterator( this );
	};
} )();
