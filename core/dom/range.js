/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * Represents a delimited piece of content in a DOM Document.
 * It is contiguous in the sense that it can be characterized as selecting all
 * of the content between a pair of boundary-points.
 *
 * This class shares much of the W3C
 * [Document Object Model Range](http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html)
 * ideas and features, adding several range manipulation tools to it, but it's
 * not intended to be compatible with it.
 *
 *		// Create a range for the entire contents of the editor document body.
 *		var range = new CKEDITOR.dom.range( editor.document );
 *		range.selectNodeContents( editor.document.getBody() );
 *		// Delete the contents.
 *		range.deleteContents();
 *
 * Usually you will want to work on a ranges rooted in the editor's {@link CKEDITOR.editable editable}
 * element. Such ranges can be created with a shorthand method &ndash; {@link CKEDITOR.editor#createRange editor.createRange}.
 *
 *		var range = editor.createRange();
 *		range.root.equals( editor.editable() ); // -> true
 *
 * Note that the {@link #root} of a range is an important property, which limits many
 * algorithms implemented in range's methods. Therefore it is crucial, especially
 * when using ranges inside inline editors, to specify correct root, so using
 * the {@link CKEDITOR.editor#createRange} method is highly recommended.
 *
 * ### Selection
 *
 * Range is only a logical representation of a piece of content in a DOM. It should not
 * be confused with a {@link CKEDITOR.dom.selection selection} which represents "physically
 * marked" content. It is possible to create unlimited number of various ranges, when
 * only one real selection may exist at a time in a document. Ranges are used to read position
 * of selection in the DOM and to move selection to new positions.
 *
 * The editor selection may be retrieved using the {@link CKEDITOR.editor#getSelection} method:
 *
 *		var sel = editor.getSelection(),
 *			ranges = sel.getRanges(); // CKEDITOR.dom.rangeList instance.
 *
 *		var range = ranges[ 0 ];
 *		range.root; // -> editor's editable element.
 *
 * A range can also be selected:
 *
 *		var range = editor.createRange();
 *		range.selectNodeContents( editor.editable() );
 *		sel.selectRanges( [ range ] );
 *
 * @class
 * @constructor Creates a {@link CKEDITOR.dom.range} instance that can be used inside a specific DOM Document.
 * @param {CKEDITOR.dom.document/CKEDITOR.dom.element} root The document or element
 * within which the range will be scoped.
 * @todo global "TODO" - precise algorithms descriptions needed for the most complex methods like #enlarge.
 */
CKEDITOR.dom.range = function( root ) {
	/**
	 * Node within which the range begins.
	 *
	 *		var range = new CKEDITOR.dom.range( editor.document );
	 *		range.selectNodeContents( editor.document.getBody() );
	 *		alert( range.startContainer.getName() ); // 'body'
	 *
	 * @readonly
	 * @property {CKEDITOR.dom.element/CKEDITOR.dom.text}
	 */
	this.startContainer = null;

	/**
	 * Offset within the starting node of the range.
	 *
	 *		var range = new CKEDITOR.dom.range( editor.document );
	 *		range.selectNodeContents( editor.document.getBody() );
	 *		alert( range.startOffset ); // 0
	 *
	 * @readonly
	 * @property {Number}
	 */
	this.startOffset = null;

	/**
	 * Node within which the range ends.
	 *
	 *		var range = new CKEDITOR.dom.range( editor.document );
	 *		range.selectNodeContents( editor.document.getBody() );
	 *		alert( range.endContainer.getName() ); // 'body'
	 *
	 * @readonly
	 * @property {CKEDITOR.dom.element/CKEDITOR.dom.text}
	 */
	this.endContainer = null;

	/**
	 * Offset within the ending node of the range.
	 *
	 *		var range = new CKEDITOR.dom.range( editor.document );
	 *		range.selectNodeContents( editor.document.getBody() );
	 *		alert( range.endOffset ); // == editor.document.getBody().getChildCount()
	 *
	 * @readonly
	 * @property {Number}
	 */
	this.endOffset = null;

	/**
	 * Indicates that this is a collapsed range. A collapsed range has its
	 * start and end boundaries at the very same point so nothing is contained
	 * in it.
	 *
	 *		var range = new CKEDITOR.dom.range( editor.document );
	 *		range.selectNodeContents( editor.document.getBody() );
	 *		alert( range.collapsed ); // false
	 *		range.collapse();
	 *		alert( range.collapsed ); // true
	 *
	 * @readonly
	 */
	this.collapsed = true;

	var isDocRoot = root instanceof CKEDITOR.dom.document;
	/**
	 * The document within which the range can be used.
	 *
	 *		// Selects the body contents of the range document.
	 *		range.selectNodeContents( range.document.getBody() );
	 *
	 * @readonly
	 * @property {CKEDITOR.dom.document}
	 */
	this.document = isDocRoot ? root : root.getDocument();

	/**
	 * The ancestor DOM element within which the range manipulation are limited.
	 *
	 * @readonly
	 * @property {CKEDITOR.dom.element}
	 */
	this.root = isDocRoot ? root.getBody() : root;
};

( function() {
	// Updates the "collapsed" property for the given range object.
	function updateCollapsed( range ) {
		range.collapsed = ( range.startContainer && range.endContainer && range.startContainer.equals( range.endContainer ) && range.startOffset == range.endOffset );
	}

	// This is a shared function used to delete, extract and clone the range content.
	//
	// The outline of the algorithm:
	//
	// 1. Normalization. We handle special cases, split text nodes if we can, find boundary nodes (startNode and endNode).
	// 2. Gathering data.
	//   * We start by creating two arrays of boundary nodes parents. You can imagine these arrays as lines limiting
	//   the tree from the left and right and thus marking the part which is selected by the range. The both lines
	//   start in the same node which is the range.root and end in startNode and endNode.
	//   * Then we find min level and max levels. Level represents all nodes which are equally far from the range.root.
	//   Min level is the level at which the left and right boundaries diverged (the first diverged level). And max levels
	//   are how deep the start and end nodes are nested.
	// 3. Cloning/extraction.
	//   * We start iterating over start node parents (left branch) from min level and clone the parent (usually shallow clone,
	//   because we know that it's not fully selected) and its right siblings (deep clone, because they are fully selected).
	//   We iterate over siblings up to meeting end node parent or end of the siblings chain.
	//   * We clone level after level down to the startNode.
	//   * Then we do the same with end node parents (right branch), because it may contains notes we omit during the previous
	//   step, for example if the right branch is deeper then left branch. Things are more complicated here because we have to
	//   watch out for nodes that were already cloned.
	//   * ***Note:** Setting `cloneId` option to `false` for **extraction** works for partially selected elements only.
	//   See range.extractContents to know more.
	// 4. Clean up.
	//   * There are two things we need to do - updating the range position and perform the action of the "mergeThen"
	//   param (see range.deleteContents or range.extractContents).
	//   See comments in mergeAndUpdate because this is lots of fun too.
	function execContentsAction( range, action, docFrag, mergeThen, cloneId ) {
		'use strict';

		range.optimizeBookmark();

		var isDelete = action === 0;
		var isExtract = action == 1;
		var isClone = action == 2;
		var doClone = isClone || isExtract;

		var startNode = range.startContainer;
		var endNode = range.endContainer;

		var startOffset = range.startOffset;
		var endOffset = range.endOffset;

		var cloneStartNode;
		var cloneEndNode;

		var doNotRemoveStartNode;
		var doNotRemoveEndNode;

		var cloneStartText;
		var cloneEndText;

		// Handle here an edge case where we clone a range which is located in one text node.
		// This allows us to not think about startNode == endNode case later on.
		// We do that only when cloning, because in other cases we can safely split this text node
		// and hence we can easily handle this case as many others.

		// We need to handle situation when selection startNode is type of NODE_ELEMENT (#426).
		if ( isClone &&
			endNode.type == CKEDITOR.NODE_TEXT &&
			( startNode.equals( endNode ) || ( startNode.type === CKEDITOR.NODE_ELEMENT && startNode.getFirst().equals( endNode ) ) ) ) {

			// Here we should always be inside one text node.
			docFrag.append( range.document.createText( endNode.substring( startOffset, endOffset ) ) );
			return;
		}

		// For text containers, we must simply split the node and point to the
		// second part. The removal will be handled by the rest of the code.
		if ( endNode.type == CKEDITOR.NODE_TEXT ) {
			// If Extract or Delete we can split the text node,
			// but if Clone (2), then we cannot modify the DOM (http://dev.ckeditor.com/ticket/11586) so we mark the text node for cloning.
			if ( !isClone ) {
				endNode = endNode.split( endOffset );
			} else {
				cloneEndText = true;
			}
		} else {
			// If there's no node after the range boundary we set endNode to the previous node
			// and mark it to be cloned.
			if ( endNode.getChildCount() > 0 ) {
				// If the offset points after the last node.
				if ( endOffset >= endNode.getChildCount() ) {
					endNode = endNode.getChild( endOffset - 1 );
					cloneEndNode = true;
				} else {
					endNode = endNode.getChild( endOffset );
				}
			}
			// The end container is empty (<h1>]</h1>), but we want to clone it, although not remove.
			else {
				cloneEndNode = true;
				doNotRemoveEndNode = true;
			}
		}

		// For text containers, we must simply split the node. The removal will
		// be handled by the rest of the code .
		if ( startNode.type == CKEDITOR.NODE_TEXT ) {
			// If Extract or Delete we can split the text node,
			// but if Clone (2), then we cannot modify the DOM (http://dev.ckeditor.com/ticket/11586) so we mark
			// the text node for cloning.
			if ( !isClone ) {
				startNode.split( startOffset );
			} else {
				cloneStartText = true;
			}
		} else {
			// If there's no node before the range boundary we set startNode to the next node
			// and mark it to be cloned.
			if ( startNode.getChildCount() > 0 ) {
				if ( startOffset === 0 ) {
					startNode = startNode.getChild( startOffset );
					cloneStartNode = true;
				} else {
					startNode = startNode.getChild( startOffset - 1 );
				}
			}
			// The start container is empty (<h1>[</h1>), but we want to clone it, although not remove.
			else {
				cloneStartNode = true;
				doNotRemoveStartNode = true;
			}
		}

			// Get the parent nodes tree for the start and end boundaries.
		var startParents = startNode.getParents(),
			endParents = endNode.getParents(),
			// Level at which start and end boundaries diverged.
			minLevel = findMinLevel(),
			maxLevelLeft = startParents.length - 1,
			maxLevelRight = endParents.length - 1,
			// Keeps the frag/element which is parent of the level that we are currently cloning.
			levelParent = docFrag,
			nextLevelParent,
			leftNode,
			rightNode,
			nextSibling,
			// Keeps track of the last connected level (on which left and right branches are connected)
			// Usually this is minLevel, but not always.
			lastConnectedLevel = -1;

		// THE LEFT BRANCH.
		for ( var level = minLevel; level <= maxLevelLeft; level++ ) {
			leftNode = startParents[ level ];
			nextSibling = leftNode.getNext();

			// 1.
			// The first step is to handle partial selection of the left branch.

			// Max depth of the left branch. It means that ( leftSibling == endNode ).
			// We also check if the leftNode isn't only partially selected, because in this case
			// we want to make a shallow clone of it (the else part).
			if ( level == maxLevelLeft && !( leftNode.equals( endParents[ level ] ) && maxLevelLeft < maxLevelRight ) ) {
				if ( cloneStartNode ) {
					consume( leftNode, levelParent, false, doNotRemoveStartNode );
				} else if ( cloneStartText ) {
					levelParent.append( range.document.createText( leftNode.substring( startOffset ) ) );
				}
			} else if ( doClone ) {
				nextLevelParent = levelParent.append( leftNode.clone( 0, cloneId ) );
			}

			// 2.
			// The second step is to handle full selection of the content between the left branch and the right branch.

			while ( nextSibling ) {
				// We can't clone entire endParent just like we can't clone entire startParent -
				// - they are not fully selected with the range. Partial endParent selection
				// will be cloned in the next loop.
				if ( nextSibling.equals( endParents[ level ] ) ) {
					lastConnectedLevel = level;
					break;
				}

				nextSibling = consume( nextSibling, levelParent );
			}

			levelParent = nextLevelParent;
		}

		// Reset levelParent, because we reset the level.
		levelParent = docFrag;

		// THE RIGHT BRANCH.
		for ( level = minLevel; level <= maxLevelRight; level++ ) {
			rightNode = endParents[ level ];
			nextSibling = rightNode.getPrevious();

			// Do not process this node if it is shared with the left branch
			// because it was already processed.
			//
			// Note: Don't worry about text nodes selection - if the entire range was placed in a single text node
			// it was handled as a special case at the beginning. In other cases when startNode == endNode
			// or when on this level leftNode == rightNode (so rightNode.equals( startParents[ level ] ))
			// this node was handled by the previous loop.
			if ( !rightNode.equals( startParents[ level ] ) ) {
				// 1.
				// The first step is to handle partial selection of the right branch.

				// Max depth of the right branch. It means that ( rightNode == endNode ).
				// We also check if the rightNode isn't only partially selected, because in this case
				// we want to make a shallow clone of it (the else part).
				if ( level == maxLevelRight && !( rightNode.equals( startParents[ level ] ) && maxLevelRight < maxLevelLeft ) ) {
					if ( cloneEndNode ) {
						consume( rightNode, levelParent, false, doNotRemoveEndNode );
					} else if ( cloneEndText ) {
						levelParent.append( range.document.createText( rightNode.substring( 0, endOffset ) ) );
					}
				} else if ( doClone ) {
					nextLevelParent = levelParent.append( rightNode.clone( 0, cloneId ) );
				}

				// 2.
				// The second step is to handle all left (selected) siblings of the rightNode which
				// have not yet been handled. If the level branches were connected, the previous loop
				// already copied all siblings (except the current rightNode).
				if ( level > lastConnectedLevel ) {
					while ( nextSibling ) {
						nextSibling = consume( nextSibling, levelParent, true );
					}
				}

				levelParent = nextLevelParent;
			} else if ( doClone ) {
				// If this is "shared" node and we are in cloning mode we have to update levelParent to
				// reflect that we visited the node (even though we didn't process it).
				// If we don't do that, in next iterations nodes will be appended to wrong parent.
				//
				// We can just take first child because the algorithm guarantees
				// that this will be the only child on this level. (http://dev.ckeditor.com/ticket/13568)
				levelParent = levelParent.getChild( 0 );
			}
		}

		// Delete or Extract.
		// We need to update the range and if mergeThen was passed do it.
		if ( !isClone ) {
			mergeAndUpdate();
		}

		// Depending on an action:
		// * clones node and adds to new parent,
		// * removes node,
		// * moves node to the new parent.
		function consume( node, newParent, toStart, forceClone ) {
			var nextSibling = toStart ? node.getPrevious() : node.getNext();

			// We do not clone if we are only deleting, so do nothing.
			if ( forceClone && isDelete ) {
				return nextSibling;
			}

			// If cloning, just clone it.
			if ( isClone || forceClone ) {
				newParent.append( node.clone( true, cloneId ), toStart );
			} else {
				// Both Delete and Extract will remove the node.
				node.remove();

				// When Extracting, move the removed node to the docFrag.
				if ( isExtract ) {
					newParent.append( node, toStart );
				}
			}

			return nextSibling;
		}

		// Finds a level number on which both branches starts diverging.
		// If such level does not exist, return the last on which both branches have nodes.
		function findMinLevel() {
			// Compare them, to find the top most siblings.
			var i, topStart, topEnd,
				maxLevel = Math.min( startParents.length, endParents.length );

			for ( i = 0; i < maxLevel; i++ ) {
				topStart = startParents[ i ];
				topEnd = endParents[ i ];

				// The compared nodes will match until we find the top most siblings (different nodes that have the same parent).
				// "i" will hold the index in the parents array for the top most element.
				if ( !topStart.equals( topEnd ) ) {
					return i;
				}
			}

			// When startNode == endNode.
			return i - 1;
		}

		// Executed only when deleting or extracting to update range position
		// and perform the merge operation.
		function mergeAndUpdate() {
			var commonLevel = minLevel - 1,
				boundariesInEmptyNode = doNotRemoveStartNode && doNotRemoveEndNode && !startNode.equals( endNode );

			// If a node has been partially selected, collapse the range between
			// startParents[ minLevel + 1 ] and endParents[ minLevel + 1 ] (the first diverged elements).
			// Otherwise, simply collapse it to the start. (W3C specs).
			//
			// All clear, right?
			//
			// It took me few hours to truly understand a previous version of this condition.
			// Mine seems to be more straightforward (even if it doesn't look so) and I could leave you here
			// without additional comments, but I'm not that mean so here goes the explanation.
			//
			// We want to know if both ends of the range are anchored in the same element. Really. It's this simple.
			// But why? Because we need to differentiate situations like:
			//
			// <p>foo[<b>x</b>bar]y</p>		(commonLevel = p, maxLL = "foo", maxLR = "y")
			// from:
			// <p>foo<b>x[</b>bar]y</p>		(commonLevel = p, maxLL = "x", maxLR = "y")
			//
			// In the first case we can collapse the range to the left, because simply everything between range's
			// boundaries was removed.
			// In the second case we must place the range after </b>, because <b> was only **partially selected**.
			//
			// * <b> is our startParents[ commonLevel + 1 ]
			// * "y" is our endParents[ commonLevel + 1 ].
			//
			// By now "bar" is removed from the DOM so <b> is a direct sibling of "y":
			// <p>foo<b>x</b>y</p>
			//
			// Therefore it's enough to place the range between <b> and "y".
			//
			// Now, what does the comparison mean? Why not just taking startNode and endNode and checking
			// their parents? Because the tree is already changed and they may be gone. Plus, thanks to
			// cloneStartNode and cloneEndNode, that would be reaaaaly tricky.
			//
			// So we play with levels which can give us the same information:
			// * commonLevel - the level of common ancestor,
			// * maxLevel - 1 - the level of range boundary parent (range boundary is here like a bookmark span).
			// * commonLevel < maxLevel - 1 - whether the range boundary is not a child of common ancestor.
			//
			// There's also an edge case in which both range boundaries were placed in empty nodes like:
			// <p>[</p><p>]</p>
			// Those boundaries were not removed, but in this case start and end nodes are child of the common ancestor.
			// We handle this edge case separately.
			if ( commonLevel < ( maxLevelLeft - 1 ) || commonLevel < ( maxLevelRight - 1 ) || boundariesInEmptyNode ) {
				if ( boundariesInEmptyNode ) {
					range.moveToPosition( endNode, CKEDITOR.POSITION_BEFORE_START );
				} else if ( ( maxLevelRight == commonLevel + 1 ) && cloneEndNode ) {
					// The maxLevelRight + 1 element could be already removed so we use the fact that
					// we know that it was the last element in its parent.
					range.moveToPosition( endParents[ commonLevel ], CKEDITOR.POSITION_BEFORE_END );
				} else {
					range.moveToPosition( endParents[ commonLevel + 1 ], CKEDITOR.POSITION_BEFORE_START );
				}

				// Merge split parents.
				if ( mergeThen ) {
					// Find the first diverged node in the left branch.
					var topLeft = startParents[ commonLevel + 1 ];

					// TopLeft may simply not exist if commonLevel == maxLevel or may be a text node.
					if ( topLeft && topLeft.type == CKEDITOR.NODE_ELEMENT ) {
						var span = CKEDITOR.dom.element.createFromHtml( '<span ' +
							'data-cke-bookmark="1" style="display:none">&nbsp;</span>', range.document );
						span.insertAfter( topLeft );
						topLeft.mergeSiblings( false );
						range.moveToBookmark( { startNode: span } );
					}
				}
			} else {
				// Collapse it to the start.
				range.collapse( true );
			}
		}
	}

	var inlineChildReqElements = {
		abbr: 1, acronym: 1, b: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1,
		dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, q: 1, samp: 1, small: 1, span: 1, strike: 1,
		strong: 1, sub: 1, sup: 1, tt: 1, u: 1, 'var': 1
	};

	// Creates the appropriate node evaluator for the dom walker used inside
	// check(Start|End)OfBlock.
	function getCheckStartEndBlockEvalFunction() {
		var skipBogus = false,
			whitespaces = CKEDITOR.dom.walker.whitespaces(),
			bookmarkEvaluator = CKEDITOR.dom.walker.bookmark( true ),
			isBogus = CKEDITOR.dom.walker.bogus();

		return function( node ) {
			// First skip empty nodes
			if ( bookmarkEvaluator( node ) || whitespaces( node ) )
				return true;

			// Skip the bogus node at the end of block.
			if ( isBogus( node ) && !skipBogus ) {
				skipBogus = true;
				return true;
			}

			// If there's any visible text, then we're not at the start.
			if ( node.type == CKEDITOR.NODE_TEXT &&
				( node.hasAscendant( 'pre' ) ||
					CKEDITOR.tools.trim( node.getText() ).length ) ) {
				return false;
			}

			// If there are non-empty inline elements (e.g. <img />), then we're not
			// at the start.
			if ( node.type == CKEDITOR.NODE_ELEMENT && !node.is( inlineChildReqElements ) )
				return false;

			return true;
		};
	}

	var isBogus = CKEDITOR.dom.walker.bogus(),
		nbspRegExp = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
		editableEval = CKEDITOR.dom.walker.editable(),
		notIgnoredEval = CKEDITOR.dom.walker.ignored( true );

	// Evaluator for CKEDITOR.dom.element::checkBoundaryOfElement, reject any
	// text node and non-empty elements unless it's being bookmark text.
	function elementBoundaryEval( checkStart ) {
		var whitespaces = CKEDITOR.dom.walker.whitespaces(),
			bookmark = CKEDITOR.dom.walker.bookmark( 1 );

		return function( node ) {
			// First skip empty nodes.
			if ( bookmark( node ) || whitespaces( node ) )
				return true;

			// Tolerant bogus br when checking at the end of block.
			// Reject any text node unless it's being bookmark
			// OR it's spaces.
			// Reject any element unless it's being invisible empty. (http://dev.ckeditor.com/ticket/3883)
			return !checkStart && isBogus( node ) ||
				node.type == CKEDITOR.NODE_ELEMENT &&
				node.is( CKEDITOR.dtd.$removeEmpty );
		};
	}

	function getNextEditableNode( isPrevious ) {
		return function() {
			var first;

			return this[ isPrevious ? 'getPreviousNode' : 'getNextNode' ]( function( node ) {
				// Cache first not ignorable node.
				if ( !first && notIgnoredEval( node ) )
					first = node;

				// Return true if found editable node, but not a bogus next to start of our lookup (first != bogus).
				return editableEval( node ) && !( isBogus( node ) && node.equals( first ) );
			} );
		};
	}

	CKEDITOR.dom.range.prototype = {
		/**
		 * Clones this range.
		 *
		 * @returns {CKEDITOR.dom.range}
		 */
		clone: function() {
			var clone = new CKEDITOR.dom.range( this.root );

			clone._setStartContainer( this.startContainer );
			clone.startOffset = this.startOffset;
			clone._setEndContainer( this.endContainer );
			clone.endOffset = this.endOffset;
			clone.collapsed = this.collapsed;

			return clone;
		},

		/**
		 * Makes the range collapsed by moving its start point (or end point if `toStart==true`)
		 * to the second end.
		 *
		 * @param {Boolean} toStart Collapse range "to start".
		 */
		collapse: function( toStart ) {
			if ( toStart ) {
				this._setEndContainer( this.startContainer );
				this.endOffset = this.startOffset;
			} else {
				this._setStartContainer( this.endContainer );
				this.startOffset = this.endOffset;
			}

			this.collapsed = true;
		},

		/**
		 * Clones content nodes of the range and adds them to a document fragment, which is returned.
		 *
		 * @param {Boolean} [cloneId=true] Whether to preserve ID attributes in the clone.
		 * @returns {CKEDITOR.dom.documentFragment} Document fragment containing a clone of range's content.
		 */
		cloneContents: function( cloneId ) {
			var docFrag = new CKEDITOR.dom.documentFragment( this.document );

			cloneId = typeof cloneId == 'undefined' ? true : cloneId;

			if ( !this.collapsed )
				execContentsAction( this, 2, docFrag, false, cloneId );

			return docFrag;
		},

		/**
		 * Deletes the content nodes of the range permanently from the DOM tree.
		 *
		 * @param {Boolean} [mergeThen] Merge any split elements result in DOM true due to partial selection.
		 */
		deleteContents: function( mergeThen ) {
			if ( this.collapsed )
				return;

			execContentsAction( this, 0, null, mergeThen );
		},

		/**
		 * The content nodes of the range are cloned and added to a document fragment,
		 * meanwhile they are removed permanently from the DOM tree.
		 *
		 * **Note:** Setting the `cloneId` parameter to `false` works for **partially** selected elements only.
		 * If an element with an ID attribute is **fully enclosed** in a range, it will keep the ID attribute
		 * regardless of the `cloneId` parameter value, because it is not cloned &mdash; it is moved to the returned
		 * document fragment.
		 *
		 * @param {Boolean} [mergeThen] Merge any split elements result in DOM true due to partial selection.
		 * @param {Boolean} [cloneId=true] Whether to preserve ID attributes in the extracted content.
		 * @returns {CKEDITOR.dom.documentFragment} Document fragment containing extracted content.
		 */
		extractContents: function( mergeThen, cloneId ) {
			var docFrag = new CKEDITOR.dom.documentFragment( this.document );

			cloneId = typeof cloneId == 'undefined' ? true : cloneId;

			if ( !this.collapsed )
				execContentsAction( this, 1, docFrag, mergeThen, cloneId );

			return docFrag;
		},

		/**
		 * Creates a bookmark object, which can be later used to restore the
		 * range by using the {@link #moveToBookmark} function.
		 *
		 * This is an "intrusive" way to create a bookmark. It includes `<span>` tags
		 * in the range boundaries. The advantage of it is that it is possible to
		 * handle DOM mutations when moving back to the bookmark.
		 *
		 * **Note:** The inclusion of nodes in the DOM is a design choice and
		 * should not be changed as there are other points in the code that may be
		 * using those nodes to perform operations.
		 *
		 * @param {Boolean} [serializable] Indicates that the bookmark nodes
		 * must contain IDs, which can be used to restore the range even
		 * when these nodes suffer mutations (like cloning or `innerHTML` change).
		 * @returns {Object} And object representing a bookmark.
		 * @returns {CKEDITOR.dom.node/String} return.startNode Node or element ID.
		 * @returns {CKEDITOR.dom.node/String} return.endNode Node or element ID.
		 * @returns {Boolean} return.serializable
		 * @returns {Boolean} return.collapsed
		 */
		createBookmark: function( serializable ) {
			var startNode, endNode;
			var baseId;
			var clone;
			var collapsed = this.collapsed;

			startNode = this.document.createElement( 'span' );
			startNode.data( 'cke-bookmark', 1 );
			startNode.setStyle( 'display', 'none' );

			// For IE, it must have something inside, otherwise it may be
			// removed during DOM operations.
			startNode.setHtml( '&nbsp;' );

			if ( serializable ) {
				baseId = 'cke_bm_' + CKEDITOR.tools.getNextNumber();
				startNode.setAttribute( 'id', baseId + ( collapsed ? 'C' : 'S' ) );
			}

			// If collapsed, the endNode will not be created.
			if ( !collapsed ) {
				endNode = startNode.clone();
				endNode.setHtml( '&nbsp;' );

				if ( serializable )
					endNode.setAttribute( 'id', baseId + 'E' );

				clone = this.clone();
				clone.collapse();
				clone.insertNode( endNode );
			}

			clone = this.clone();
			clone.collapse( true );
			clone.insertNode( startNode );

			// Update the range position.
			if ( endNode ) {
				this.setStartAfter( startNode );
				this.setEndBefore( endNode );
			} else {
				this.moveToPosition( startNode, CKEDITOR.POSITION_AFTER_END );
			}

			return {
				startNode: serializable ? baseId + ( collapsed ? 'C' : 'S' ) : startNode,
				endNode: serializable ? baseId + 'E' : endNode,
				serializable: serializable,
				collapsed: collapsed
			};
		},

		/**
		 * Creates a "non intrusive" and "mutation sensible" bookmark. This
		 * kind of bookmark should be used only when the DOM is supposed to
		 * remain stable after its creation.
		 *
		 * @param {Boolean} [normalized] Indicates that the bookmark must
		 * be normalized. When normalized, the successive text nodes are
		 * considered a single node. To successfully load a normalized
		 * bookmark, the DOM tree must also be normalized before calling
		 * {@link #moveToBookmark}.
		 * @returns {Object} An object representing the bookmark.
		 * @returns {Array} return.start Start container's address (see {@link CKEDITOR.dom.node#getAddress}).
		 * @returns {Array} return.end Start container's address.
		 * @returns {Number} return.startOffset
		 * @returns {Number} return.endOffset
		 * @returns {Boolean} return.collapsed
		 * @returns {Boolean} return.normalized
		 * @returns {Boolean} return.is2 This is "bookmark2".
		 */
		createBookmark2: ( function() {
			var isNotText = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_TEXT, true );

			// Returns true for limit anchored in element and placed between text nodes.
			//
			//               v
			// <p>[text node] [text node]</p> -> true
			//
			//    v
			// <p> [text node]</p> -> false
			//
			//              v
			// <p>[text node][text node]</p> -> false (limit is anchored in text node)
			function betweenTextNodes( container, offset ) {
				// Not anchored in element or limit is on the edge.
				if ( container.type != CKEDITOR.NODE_ELEMENT || offset === 0 || offset == container.getChildCount() )
					return 0;

				return container.getChild( offset - 1 ).type == CKEDITOR.NODE_TEXT &&
					container.getChild( offset ).type == CKEDITOR.NODE_TEXT;
			}

			// Sums lengths of all preceding text nodes.
			function getLengthOfPrecedingTextNodes( node ) {
				var sum = 0;

				while ( ( node = node.getPrevious() ) && node.type == CKEDITOR.NODE_TEXT )
					sum += node.getText().replace( CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE, '' ).length;

				return sum;
			}

			function normalizeTextNodes( limit ) {
				var container = limit.container,
					offset = limit.offset;

				// If limit is between text nodes move it to the end of preceding one,
				// because they will be merged.
				if ( betweenTextNodes( container, offset ) ) {
					container = container.getChild( offset - 1 );
					offset = container.getLength();
				}

				// Now, if limit is anchored in element and has at least one node before it,
				// it may happen that some of them will be merged. Normalize the offset
				// by setting it to normalized index of its preceding, safe node.
				// (safe == one for which getIndex(true) does not return -1, so one which won't disappear).
				if ( container.type == CKEDITOR.NODE_ELEMENT && offset > 0 ) {
					offset = getPrecedingSafeNodeIndex( container, offset ) + 1;
				}

				// The last step - fix the offset inside text node by adding
				// lengths of preceding text nodes which will be merged with container.
				if ( container.type == CKEDITOR.NODE_TEXT ) {
					var precedingLength = getLengthOfPrecedingTextNodes( container );

					// Normal case - text node is not empty.
					if ( container.getText() ) {
						offset += precedingLength;

					// Awful case - the text node is empty and thus will be totally lost.
					// In this case we are trying to normalize the limit to the left:
					// * either to the preceding text node,
					// * or to the "gap" after the preceding element.
					} else {
						// Find the closest non-text sibling.
						var precedingContainer = container.getPrevious( isNotText );

						// If there are any characters on the left, that means that we can anchor
						// there, because this text node will not be lost.
						if ( precedingLength ) {
							offset = precedingLength;

							if ( precedingContainer ) {
								// The text node is the first node after the closest non-text sibling.
								container = precedingContainer.getNext();
							} else {
								// But if there was no non-text sibling, then the text node is the first child.
								container = container.getParent().getFirst();
							}

						// If there are no characters on the left, then anchor after the previous non-text node.
						// E.g. (see tests for a legend :D):
						// <b>x</b>(foo)({}bar) -> <b>x</b>[](foo)(bar)
						} else {
							container = container.getParent();
							offset = precedingContainer ? ( precedingContainer.getIndex( true ) + 1 ) : 0;
						}
					}
				}

				limit.container = container;
				limit.offset = offset;
			}

			function normalizeFCSeq( limit, root ) {
				var fcseq = root.getCustomData( 'cke-fillingChar' );

				if ( !fcseq ) {
					return;
				}

				var container = limit.container;

				if ( fcseq.equals( container ) ) {
					limit.offset -= CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE.length;

					// == 0		handles case when limit was at the end of FCS.
					//  < 0		handles all cases where limit was somewhere in the middle or at the beginning.
					//  > 0		(the "else" case) means cases where there are some more characters in the FCS node (FCSabc^def).
					if ( limit.offset <= 0 ) {
						limit.offset = container.getIndex();
						limit.container = container.getParent();
					}
					return;
				}

				// And here goes the funny part - all other cases are handled inside node.getAddress() and getIndex() thanks to
				// node.getIndex() being aware of FCS (handling it as an empty node).
			}

			// Finds a normalized index of a safe node preceding this one.
			// Safe == one that will not disappear, so one for which getIndex( true ) does not return -1.
			// Return -1 if there's no safe preceding node.
			function getPrecedingSafeNodeIndex( container, offset ) {
				var index;

				while ( offset-- ) {
					index = container.getChild( offset ).getIndex( true );

					if ( index >= 0 )
						return index;
				}

				return -1;
			}

			return function( normalized ) {
				var collapsed = this.collapsed,
					bmStart = {
						container: this.startContainer,
						offset: this.startOffset
					},
					bmEnd = {
						container: this.endContainer,
						offset: this.endOffset
					};

				if ( normalized ) {
					normalizeTextNodes( bmStart );
					normalizeFCSeq( bmStart, this.root );

					if ( !collapsed ) {
						normalizeTextNodes( bmEnd );
						normalizeFCSeq( bmEnd, this.root );
					}
				}

				return {
					start: bmStart.container.getAddress( normalized ),
					end: collapsed ? null : bmEnd.container.getAddress( normalized ),
					startOffset: bmStart.offset,
					endOffset: bmEnd.offset,
					normalized: normalized,
					collapsed: collapsed,
					is2: true // It's a createBookmark2 bookmark.
				};
			};
		} )(),

		/**
		 * Moves this range to the given bookmark. See {@link #createBookmark} and {@link #createBookmark2}.
		 *
		 * If serializable bookmark passed, then its `<span>` markers will be removed.
		 *
		 * @param {Object} bookmark
		 */
		moveToBookmark: function( bookmark ) {
			// Created with createBookmark2().
			if ( bookmark.is2 ) {
				// Get the start information.
				var startContainer = this.document.getByAddress( bookmark.start, bookmark.normalized ),
					startOffset = bookmark.startOffset;

				// Get the end information.
				var endContainer = bookmark.end && this.document.getByAddress( bookmark.end, bookmark.normalized ),
					endOffset = bookmark.endOffset;

				// Set the start boundary.
				this.setStart( startContainer, startOffset );

				// Set the end boundary. If not available, collapse it.
				if ( endContainer )
					this.setEnd( endContainer, endOffset );
				else
					this.collapse( true );
			}
			// Created with createBookmark().
			else {
				var serializable = bookmark.serializable,
					startNode = serializable ? this.document.getById( bookmark.startNode ) : bookmark.startNode,
					endNode = serializable ? this.document.getById( bookmark.endNode ) : bookmark.endNode;

				// Set the range start at the bookmark start node position.
				this.setStartBefore( startNode );

				// Remove it, because it may interfere in the setEndBefore call.
				startNode.remove();

				// Set the range end at the bookmark end node position, or simply
				// collapse it if it is not available.
				if ( endNode ) {
					this.setEndBefore( endNode );
					endNode.remove();
				} else {
					this.collapse( true );
				}
			}
		},

		/**
		 * Returns two nodes which are on the boundaries of this range.
		 *
		 * @returns {Object}
		 * @returns {CKEDITOR.dom.node} return.startNode
		 * @returns {CKEDITOR.dom.node} return.endNode
		 * @todo precise desc/algorithm
		 */
		getBoundaryNodes: function() {
			var startNode = this.startContainer,
				endNode = this.endContainer,
				startOffset = this.startOffset,
				endOffset = this.endOffset,
				childCount;

			if ( startNode.type == CKEDITOR.NODE_ELEMENT ) {
				childCount = startNode.getChildCount();
				if ( childCount > startOffset ) {
					startNode = startNode.getChild( startOffset );
				} else if ( childCount < 1 ) {
					startNode = startNode.getPreviousSourceNode();
				}
				// startOffset > childCount but childCount is not 0
				else {
					// Try to take the node just after the current position.
					startNode = startNode.$;
					while ( startNode.lastChild )
						startNode = startNode.lastChild;
					startNode = new CKEDITOR.dom.node( startNode );

					// Normally we should take the next node in DFS order. But it
					// is also possible that we've already reached the end of
					// document.
					startNode = startNode.getNextSourceNode() || startNode;
				}
			}

			if ( endNode.type == CKEDITOR.NODE_ELEMENT ) {
				childCount = endNode.getChildCount();
				if ( childCount > endOffset ) {
					endNode = endNode.getChild( endOffset ).getPreviousSourceNode( true );
				} else if ( childCount < 1 ) {
					endNode = endNode.getPreviousSourceNode();
				}
				// endOffset > childCount but childCount is not 0.
				else {
					// Try to take the node just before the current position.
					endNode = endNode.$;
					while ( endNode.lastChild )
						endNode = endNode.lastChild;
					endNode = new CKEDITOR.dom.node( endNode );
				}
			}

			// Sometimes the endNode will come right before startNode for collapsed
			// ranges. Fix it. (http://dev.ckeditor.com/ticket/3780)
			if ( startNode.getPosition( endNode ) & CKEDITOR.POSITION_FOLLOWING )
				startNode = endNode;

			return { startNode: startNode, endNode: endNode };
		},

		/**
		 * Find the node which fully contains the range.
		 *
		 * @param {Boolean} [includeSelf=false]
		 * @param {Boolean} [ignoreTextNode=false] Whether ignore {@link CKEDITOR#NODE_TEXT} type.
		 * @returns {CKEDITOR.dom.element}
		 */
		getCommonAncestor: function( includeSelf, ignoreTextNode ) {
			var start = this.startContainer,
				end = this.endContainer,
				ancestor;

			if ( start.equals( end ) ) {
				if ( includeSelf && start.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 )
					ancestor = start.getChild( this.startOffset );
				else
					ancestor = start;
			} else {
				ancestor = start.getCommonAncestor( end );
			}

			return ignoreTextNode && !ancestor.is ? ancestor.getParent() : ancestor;
		},

		/**
		 * Transforms the {@link #startContainer} and {@link #endContainer} properties from text
		 * nodes to element nodes, whenever possible. This is actually possible
		 * if either of the boundary containers point to a text node, and its
		 * offset is set to zero, or after the last char in the node.
		 */
		optimize: function() {
			var container = this.startContainer;
			var offset = this.startOffset;

			if ( container.type != CKEDITOR.NODE_ELEMENT ) {
				if ( !offset )
					this.setStartBefore( container );
				else if ( offset >= container.getLength() )
					this.setStartAfter( container );
			}

			container = this.endContainer;
			offset = this.endOffset;

			if ( container.type != CKEDITOR.NODE_ELEMENT ) {
				if ( !offset )
					this.setEndBefore( container );
				else if ( offset >= container.getLength() )
					this.setEndAfter( container );
			}
		},

		/**
		 * Move the range out of bookmark nodes if they'd been the container.
		 */
		optimizeBookmark: function() {
			var startNode = this.startContainer,
				endNode = this.endContainer;

			if ( startNode.is && startNode.is( 'span' ) && startNode.data( 'cke-bookmark' ) )
				this.setStartAt( startNode, CKEDITOR.POSITION_BEFORE_START );
			if ( endNode && endNode.is && endNode.is( 'span' ) && endNode.data( 'cke-bookmark' ) )
				this.setEndAt( endNode, CKEDITOR.POSITION_AFTER_END );
		},

		/**
		 * @param {Boolean} [ignoreStart=false]
		 * @param {Boolean} [ignoreEnd=false]
		 * @todo precise desc/algorithm
		 */
		trim: function( ignoreStart, ignoreEnd ) {
			var startContainer = this.startContainer,
				startOffset = this.startOffset,
				collapsed = this.collapsed;
			if ( ( !ignoreStart || collapsed ) && startContainer && startContainer.type == CKEDITOR.NODE_TEXT ) {
				// If the offset is zero, we just insert the new node before
				// the start.
				if ( !startOffset ) {
					startOffset = startContainer.getIndex();
					startContainer = startContainer.getParent();
				}
				// If the offset is at the end, we'll insert it after the text
				// node.
				else if ( startOffset >= startContainer.getLength() ) {
					startOffset = startContainer.getIndex() + 1;
					startContainer = startContainer.getParent();
				}
				// In other case, we split the text node and insert the new
				// node at the split point.
				else {
					var nextText = startContainer.split( startOffset );

					startOffset = startContainer.getIndex() + 1;
					startContainer = startContainer.getParent();

					// Check all necessity of updating the end boundary.
					if ( this.startContainer.equals( this.endContainer ) )
						this.setEnd( nextText, this.endOffset - this.startOffset );
					else if ( startContainer.equals( this.endContainer ) )
						this.endOffset += 1;
				}

				this.setStart( startContainer, startOffset );

				if ( collapsed ) {
					this.collapse( true );
					return;
				}
			}

			var endContainer = this.endContainer;
			var endOffset = this.endOffset;

			if ( !( ignoreEnd || collapsed ) && endContainer && endContainer.type == CKEDITOR.NODE_TEXT ) {
				// If the offset is zero, we just insert the new node before
				// the start.
				if ( !endOffset ) {
					endOffset = endContainer.getIndex();
					endContainer = endContainer.getParent();
				}
				// If the offset is at the end, we'll insert it after the text
				// node.
				else if ( endOffset >= endContainer.getLength() ) {
					endOffset = endContainer.getIndex() + 1;
					endContainer = endContainer.getParent();
				}
				// In other case, we split the text node and insert the new
				// node at the split point.
				else {
					endContainer.split( endOffset );

					endOffset = endContainer.getIndex() + 1;
					endContainer = endContainer.getParent();
				}

				this.setEnd( endContainer, endOffset );
			}
		},

		/**
		 * Expands the range so that partial units are completely contained.
		 *
		 * @param {Number} unit The unit type to expand with. Use one of following values: {@link CKEDITOR#ENLARGE_BLOCK_CONTENTS},
		 * {@link CKEDITOR#ENLARGE_ELEMENT}, {@link CKEDITOR#ENLARGE_INLINE}, {@link CKEDITOR#ENLARGE_LIST_ITEM_CONTENTS}.
		 * @param {Boolean} [excludeBrs=false] Whether include line-breaks when expanding.
		 */
		enlarge: function( unit, excludeBrs ) {
			var leadingWhitespaceRegex = new RegExp( /[^\s\ufeff]/ );

			switch ( unit ) {
				case CKEDITOR.ENLARGE_INLINE:
					var enlargeInlineOnly = 1;

				/* falls through */
				case CKEDITOR.ENLARGE_ELEMENT:

					if ( this.collapsed )
						return;

					// Get the common ancestor.
					var commonAncestor = this.getCommonAncestor();

					var boundary = this.root;

					// For each boundary
					//		a. Depending on its position, find out the first node to be checked (a sibling) or,
					//			if not available, to be enlarge.
					//		b. Go ahead checking siblings and enlarging the boundary as much as possible until the
					//			common ancestor is not reached. After reaching the common ancestor, just save the
					//			enlargeable node to be used later.

					var startTop, endTop;

					var enlargeable, sibling, commonReached;

					// Indicates that the node can be added only if whitespace
					// is available before it.
					var needsWhiteSpace = false;
					var isWhiteSpace;
					var siblingText;

					// Process the start boundary.

					var container = this.startContainer;
					var offset = this.startOffset;

					if ( container.type == CKEDITOR.NODE_TEXT ) {
						if ( offset ) {
							// Check if there is any non-space text before the
							// offset. Otherwise, container is null.
							container = !CKEDITOR.tools.trim( container.substring( 0, offset ) ).length && container;

							// If we found only whitespace in the node, it
							// means that we'll need more whitespace to be able
							// to expand. For example, <i> can be expanded in
							// "A <i> [B]</i>", but not in "A<i> [B]</i>".
							needsWhiteSpace = !!container;
						}

						if ( container ) {
							if ( !( sibling = container.getPrevious() ) )
								enlargeable = container.getParent();
						}
					} else {
						// If we have offset, get the node preceeding it as the
						// first sibling to be checked.
						if ( offset )
							sibling = container.getChild( offset - 1 ) || container.getLast();

						// If there is no sibling, mark the container to be
						// enlarged.
						if ( !sibling )
							enlargeable = container;
					}

					// Ensures that enlargeable can be indeed enlarged, if not it will be nulled.
					enlargeable = getValidEnlargeable( enlargeable );

					while ( enlargeable || sibling ) {
						if ( enlargeable && !sibling ) {
							// If we reached the common ancestor, mark the flag
							// for it.
							if ( !commonReached && enlargeable.equals( commonAncestor ) )
								commonReached = true;

							if ( enlargeInlineOnly ? enlargeable.isBlockBoundary() : !boundary.contains( enlargeable ) )
								break;

							// If we don't need space or this element breaks
							// the line, then enlarge it.
							if ( !needsWhiteSpace || enlargeable.getComputedStyle( 'display' ) != 'inline' ) {
								needsWhiteSpace = false;

								// If the common ancestor has been reached,
								// we'll not enlarge it immediately, but just
								// mark it to be enlarged later if the end
								// boundary also enlarges it.
								if ( commonReached )
									startTop = enlargeable;
								else
									this.setStartBefore( enlargeable );
							}

							sibling = enlargeable.getPrevious();
						}

						// Check all sibling nodes preceeding the enlargeable
						// node. The node wil lbe enlarged only if none of them
						// blocks it.
						while ( sibling ) {
							// This flag indicates that this node has
							// whitespaces at the end.
							isWhiteSpace = false;

							if ( sibling.type == CKEDITOR.NODE_COMMENT ) {
								sibling = sibling.getPrevious();
								continue;
							} else if ( sibling.type == CKEDITOR.NODE_TEXT ) {
								siblingText = sibling.getText();

								if ( leadingWhitespaceRegex.test( siblingText ) )
									sibling = null;

								isWhiteSpace = /[\s\ufeff]$/.test( siblingText );
							} else {
								// http://dev.ckeditor.com/ticket/12221 (Chrome) plus http://dev.ckeditor.com/ticket/11111 (Safari).
								var offsetWidth0 = CKEDITOR.env.webkit ? 1 : 0;

								// If this is a visible element.
								// We need to check for the bookmark attribute because IE insists on
								// rendering the display:none nodes we use for bookmarks. (http://dev.ckeditor.com/ticket/3363)
								// Line-breaks (br) are rendered with zero width, which we don't want to include. (http://dev.ckeditor.com/ticket/7041)
								if ( ( sibling.$.offsetWidth > offsetWidth0 || excludeBrs && sibling.is( 'br' ) ) && !sibling.data( 'cke-bookmark' ) ) {
									// We'll accept it only if we need
									// whitespace, and this is an inline
									// element with whitespace only.
									if ( needsWhiteSpace && CKEDITOR.dtd.$removeEmpty[ sibling.getName() ] ) {
										// It must contains spaces and inline elements only.

										siblingText = sibling.getText();

										if ( leadingWhitespaceRegex.test( siblingText ) ) // Spaces + Zero Width No-Break Space (U+FEFF)
										sibling = null;
										else {
											var allChildren = sibling.$.getElementsByTagName( '*' );
											for ( var i = 0, child; child = allChildren[ i++ ]; ) {
												if ( !CKEDITOR.dtd.$removeEmpty[ child.nodeName.toLowerCase() ] ) {
													sibling = null;
													break;
												}
											}
										}

										if ( sibling )
											isWhiteSpace = !!siblingText.length;
									} else {
										sibling = null;
									}
								}
							}

							// A node with whitespaces has been found.
							if ( isWhiteSpace ) {
								// Enlarge the last enlargeable node, if we
								// were waiting for spaces.
								if ( needsWhiteSpace ) {
									if ( commonReached )
										startTop = enlargeable;
									else if ( enlargeable )
										this.setStartBefore( enlargeable );
								} else {
									needsWhiteSpace = true;
								}
							}

							if ( sibling ) {
								var next = sibling.getPrevious();

								if ( !enlargeable && !next ) {
									// Set the sibling as enlargeable, so it's
									// parent will be get later outside this while.
									enlargeable = sibling;
									sibling = null;
									break;
								}

								sibling = next;
							} else {
								// If sibling has been set to null, then we
								// need to stop enlarging.
								enlargeable = null;
							}
						}

						if ( enlargeable )
							enlargeable = getValidEnlargeable( enlargeable.getParent() );
					}

					// Process the end boundary. This is basically the same
					// code used for the start boundary, with small changes to
					// make it work in the opposite side (to the right). This
					// makes it difficult to reuse the code here. So, fixes to
					// the above code are likely to be replicated here.

					container = this.endContainer;
					offset = this.endOffset;

					// Reset the common variables.
					enlargeable = sibling = null;
					commonReached = needsWhiteSpace = false;

					// Function check if there are only whitespaces from the given starting point
					// (startContainer and startOffset) till the end on block.
					// Examples ("[" is the start point):
					//  - <p>foo[ </p>           - will return true,
					//  - <p><b>foo[ </b> </p>   - will return true,
					//  - <p>foo[ bar</p>        - will return false,
					//  - <p><b>foo[ </b>bar</p> - will return false,
					//  - <p>foo[ <b></b></p>    - will return false.
					function onlyWhiteSpaces( startContainer, startOffset ) {
						// We need to enlarge range if there is white space at the end of the block,
						// because it is not displayed in WYSIWYG mode and user can not select it. So
						// "<p>foo[bar] </p>" should be changed to "<p>foo[bar ]</p>". On the other hand
						// we should do nothing if we are not at the end of the block, so this should not
						// be changed: "<p><i>[foo] </i>bar</p>".
						var walkerRange = new CKEDITOR.dom.range( boundary );
						walkerRange.setStart( startContainer, startOffset );
						// The guard will find the end of range so I put boundary here.
						walkerRange.setEndAt( boundary, CKEDITOR.POSITION_BEFORE_END );

						var walker = new CKEDITOR.dom.walker( walkerRange ),
							node;

						walker.guard = function( node ) {
							// Stop if you exit block.
							return !( node.type == CKEDITOR.NODE_ELEMENT && node.isBlockBoundary() );
						};

						while ( ( node = walker.next() ) ) {
							if ( node.type != CKEDITOR.NODE_TEXT ) {
								// Stop if you enter to any node (walker.next() will return node only
								// it goes out, not if it is go into node).
								return false;
							} else {
								// Trim the first node to startOffset.
								if ( node != startContainer )
									siblingText = node.getText();
								else
									siblingText = node.substring( startOffset );

								// Check if it is white space.
								if ( leadingWhitespaceRegex.test( siblingText ) )
									return false;
							}
						}

						return true;
					}

					if ( container.type == CKEDITOR.NODE_TEXT ) {
						// Check if there is only white space after the offset.
						if ( CKEDITOR.tools.trim( container.substring( offset ) ).length ) {
							// If we found only whitespace in the node, it
							// means that we'll need more whitespace to be able
							// to expand. For example, <i> can be expanded in
							// "A <i> [B]</i>", but not in "A<i> [B]</i>".
							needsWhiteSpace = true;
						} else {
							needsWhiteSpace = !container.getLength();

							if ( offset == container.getLength() ) {
								// If we are at the end of container and this is the last text node,
								// we should enlarge end to the parent.
								if ( !( sibling = container.getNext() ) )
									enlargeable = container.getParent();
							} else {
								// If we are in the middle on text node and there are only whitespaces
								// till the end of block, we should enlarge element.
								if ( onlyWhiteSpaces( container, offset ) )
									enlargeable = container.getParent();
							}
						}
					} else {
						// Get the node right after the boundary to be checked
						// first.
						sibling = container.getChild( offset );

						if ( !sibling )
							enlargeable = container;
					}

					while ( enlargeable || sibling ) {
						if ( enlargeable && !sibling ) {
							if ( !commonReached && enlargeable.equals( commonAncestor ) )
								commonReached = true;

							if ( enlargeInlineOnly ? enlargeable.isBlockBoundary() : !boundary.contains( enlargeable ) )
								break;

							if ( !needsWhiteSpace || enlargeable.getComputedStyle( 'display' ) != 'inline' ) {
								needsWhiteSpace = false;

								if ( commonReached )
									endTop = enlargeable;
								else if ( enlargeable )
									this.setEndAfter( enlargeable );
							}

							sibling = enlargeable.getNext();
						}

						while ( sibling ) {
							isWhiteSpace = false;

							if ( sibling.type == CKEDITOR.NODE_TEXT ) {
								siblingText = sibling.getText();

								// Check if there are not whitespace characters till the end of editable.
								// If so stop expanding.
								if ( !onlyWhiteSpaces( sibling, 0 ) )
									sibling = null;

								isWhiteSpace = /^[\s\ufeff]/.test( siblingText );
							} else if ( sibling.type == CKEDITOR.NODE_ELEMENT ) {
								// If this is a visible element.
								// We need to check for the bookmark attribute because IE insists on
								// rendering the display:none nodes we use for bookmarks. (http://dev.ckeditor.com/ticket/3363)
								// Line-breaks (br) are rendered with zero width, which we don't want to include. (http://dev.ckeditor.com/ticket/7041)
								if ( ( sibling.$.offsetWidth > 0 || excludeBrs && sibling.is( 'br' ) ) && !sibling.data( 'cke-bookmark' ) ) {
									// We'll accept it only if we need
									// whitespace, and this is an inline
									// element with whitespace only.
									if ( needsWhiteSpace && CKEDITOR.dtd.$removeEmpty[ sibling.getName() ] ) {
										// It must contains spaces and inline elements only.

										siblingText = sibling.getText();

										if ( leadingWhitespaceRegex.test( siblingText ) )
											sibling = null;
										else {
											allChildren = sibling.$.getElementsByTagName( '*' );
											for ( i = 0; child = allChildren[ i++ ]; ) {
												if ( !CKEDITOR.dtd.$removeEmpty[ child.nodeName.toLowerCase() ] ) {
													sibling = null;
													break;
												}
											}
										}

										if ( sibling )
											isWhiteSpace = !!siblingText.length;
									} else {
										sibling = null;
									}
								}
							} else {
								isWhiteSpace = 1;
							}

							if ( isWhiteSpace ) {
								if ( needsWhiteSpace ) {
									if ( commonReached )
										endTop = enlargeable;
									else
										this.setEndAfter( enlargeable );
								}
							}

							if ( sibling ) {
								next = sibling.getNext();

								if ( !enlargeable && !next ) {
									enlargeable = sibling;
									sibling = null;
									break;
								}

								sibling = next;
							} else {
								// If sibling has been set to null, then we
								// need to stop enlarging.
								enlargeable = null;
							}
						}

						if ( enlargeable )
							enlargeable = getValidEnlargeable( enlargeable.getParent() );
					}

					// If the common ancestor can be enlarged by both boundaries, then include it also.
					if ( startTop && endTop ) {
						commonAncestor = startTop.contains( endTop ) ? endTop : startTop;

						this.setStartBefore( commonAncestor );
						this.setEndAfter( commonAncestor );
					}
					break;

				case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
				case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:

					// Enlarging the start boundary.
					var walkerRange = new CKEDITOR.dom.range( this.root );

					boundary = this.root;

					walkerRange.setStartAt( boundary, CKEDITOR.POSITION_AFTER_START );
					walkerRange.setEnd( this.startContainer, this.startOffset );

					var walker = new CKEDITOR.dom.walker( walkerRange ),
						blockBoundary, // The node on which the enlarging should stop.
						tailBr, // In case BR as block boundary.
						notBlockBoundary = CKEDITOR.dom.walker.blockBoundary( ( unit == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ) ? { br: 1 } : null ),
						inNonEditable = null,
						// Record the encountered 'blockBoundary' for later use.
						boundaryGuard = function( node ) {
							// We should not check contents of non-editable elements. It may happen
							// that inline widget has display:table child which should not block range#enlarge.
							// When encountered non-editable element...
							if ( node.type == CKEDITOR.NODE_ELEMENT && node.getAttribute( 'contenteditable' ) == 'false' ) {
								if ( inNonEditable ) {
									// ... in which we already were, reset it (because we're leaving it) and return.
									if ( inNonEditable.equals( node ) ) {
										inNonEditable = null;
										return;
									}
								// ... which we're entering, remember it but check it (no return).
								} else {
									inNonEditable = node;
								}
							// When we are in non-editable element, do not check if current node is a block boundary.
							} else if ( inNonEditable ) {
								return;
							}

							var retval = notBlockBoundary( node );
							if ( !retval )
								blockBoundary = node;
							return retval;
						},
						// Record the encountered 'tailBr' for later use.
						tailBrGuard = function( node ) {
							var retval = boundaryGuard( node );
							if ( !retval && node.is && node.is( 'br' ) )
								tailBr = node;
							return retval;
						};

					walker.guard = boundaryGuard;

					enlargeable = walker.lastBackward();

					// It's the body which stop the enlarging if no block boundary found.
					blockBoundary = blockBoundary || boundary;

					// Start the range either after the end of found block (<p>...</p>[text)
					// or at the start of block (<p>[text...), by comparing the document position
					// with 'enlargeable' node.
					this.setStartAt( blockBoundary, !blockBoundary.is( 'br' ) && ( !enlargeable && this.checkStartOfBlock() ||
						enlargeable && blockBoundary.contains( enlargeable ) ) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END );

					// Avoid enlarging the range further when end boundary spans right after the BR. (http://dev.ckeditor.com/ticket/7490)
					if ( unit == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ) {
						var theRange = this.clone();
						walker = new CKEDITOR.dom.walker( theRange );

						var whitespaces = CKEDITOR.dom.walker.whitespaces(),
							bookmark = CKEDITOR.dom.walker.bookmark();

						walker.evaluator = function( node ) {
							return !whitespaces( node ) && !bookmark( node );
						};
						var previous = walker.previous();
						if ( previous && previous.type == CKEDITOR.NODE_ELEMENT && previous.is( 'br' ) )
							return;
					}

					// Enlarging the end boundary.
					// Set up new range and reset all flags (blockBoundary, inNonEditable, tailBr).

					walkerRange = this.clone();
					walkerRange.collapse();
					walkerRange.setEndAt( boundary, CKEDITOR.POSITION_BEFORE_END );
					walker = new CKEDITOR.dom.walker( walkerRange );

					// tailBrGuard only used for on range end.
					walker.guard = ( unit == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ) ? tailBrGuard : boundaryGuard;
					blockBoundary = inNonEditable = tailBr = null;

					// End the range right before the block boundary node.
					enlargeable = walker.lastForward();

					// It's the body which stop the enlarging if no block boundary found.
					blockBoundary = blockBoundary || boundary;

					// Close the range either before the found block start (text]<p>...</p>) or at the block end (...text]</p>)
					// by comparing the document position with 'enlargeable' node.
					this.setEndAt( blockBoundary, ( !enlargeable && this.checkEndOfBlock() ||
						enlargeable && blockBoundary.contains( enlargeable ) ) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START );
					// We must include the <br> at the end of range if there's
					// one and we're expanding list item contents
					if ( tailBr ) {
						this.setEndAfter( tailBr );
					}
			}

			// Ensures that returned element can be enlarged by selection, null otherwise.
			// @param {CKEDITOR.dom.element} enlargeable
			// @returns {CKEDITOR.dom.element/null}
			function getValidEnlargeable( enlargeable ) {
				return enlargeable && enlargeable.type == CKEDITOR.NODE_ELEMENT && enlargeable.hasAttribute( 'contenteditable' ) ?
					null : enlargeable;
			}
		},

		/**
		 * Decreases the range to make sure that boundaries
		 * always anchor beside text nodes or the innermost element.
		 *
		 * @param {Number} mode The shrinking mode ({@link CKEDITOR#SHRINK_ELEMENT} or {@link CKEDITOR#SHRINK_TEXT}).
		 *
		 * * {@link CKEDITOR#SHRINK_ELEMENT} &ndash; Shrinks the range boundaries to the edge of the innermost element.
		 * * {@link CKEDITOR#SHRINK_TEXT} &ndash; Shrinks the range boundaries to anchor by the side of enclosed text
		 *     node. The range remains if there are no text nodes available on boundaries.
		 *
		 * @param {Boolean} [selectContents=false] Whether the resulting range anchors at the inner OR outer boundary of the node.
		 * @param {Boolean/Object} [options=true] If this parameter is of a Boolean type, it is treated as
		 * `options.shrinkOnBlockBoundary`. This parameter was added in 4.7.0.
		 * @param {Boolean} [options.shrinkOnBlockBoundary=true] Whether the block boundary should be included in
		 * the shrunk range.
		 * @param {Boolean} [options.skipBogus=false] Whether bogus `<br>` elements should be ignored while
		 * `mode` is set to {@link CKEDITOR#SHRINK_TEXT}. This option was added in 4.7.0.
		 */
		shrink: function( mode, selectContents, options ) {
			var shrinkOnBlockBoundary = typeof options === 'boolean' ? options :
				( options && typeof options.shrinkOnBlockBoundary === 'boolean' ? options.shrinkOnBlockBoundary : true ),
				skipBogus = options && options.skipBogus;

			// Unable to shrink a collapsed range.
			if ( !this.collapsed ) {
				mode = mode || CKEDITOR.SHRINK_TEXT;

				var walkerRange = this.clone();

				var startContainer = this.startContainer,
					endContainer = this.endContainer,
					startOffset = this.startOffset,
					endOffset = this.endOffset;

				// Whether the start/end boundary is moveable.
				var moveStart = 1,
					moveEnd = 1;

				if ( startContainer && startContainer.type == CKEDITOR.NODE_TEXT ) {
					if ( !startOffset )
						walkerRange.setStartBefore( startContainer );
					else if ( startOffset >= startContainer.getLength() )
						walkerRange.setStartAfter( startContainer );
					else {
						// Enlarge the range properly to avoid walker making
						// DOM changes caused by trimming the text nodes later.
						walkerRange.setStartBefore( startContainer );
						moveStart = 0;
					}
				}

				if ( endContainer && endContainer.type == CKEDITOR.NODE_TEXT ) {
					if ( !endOffset )
						walkerRange.setEndBefore( endContainer );
					else if ( endOffset >= endContainer.getLength() )
						walkerRange.setEndAfter( endContainer );
					else {
						walkerRange.setEndAfter( endContainer );
						moveEnd = 0;
					}
				}

				var walker = new CKEDITOR.dom.walker( walkerRange ),
					isBookmark = CKEDITOR.dom.walker.bookmark(),
					isBogus = CKEDITOR.dom.walker.bogus();

				walker.evaluator = function( node ) {
					return node.type == ( mode == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT );
				};

				var currentElement;
				walker.guard = function( node, movingOut ) {
					// Skipping bogus before other cases (http://dev.ckeditor.com/ticket/17010).
					if ( skipBogus && isBogus( node ) ) {
						return true;
					}

					if ( isBookmark( node ) )
						return true;

					// Stop when we're shrink in element mode while encountering a text node.
					if ( mode == CKEDITOR.SHRINK_ELEMENT && node.type == CKEDITOR.NODE_TEXT )
						return false;

					// Stop when we've already walked "through" an element.
					if ( movingOut && node.equals( currentElement ) )
						return false;

					if ( shrinkOnBlockBoundary === false && node.type == CKEDITOR.NODE_ELEMENT && node.isBlockBoundary() )
						return false;

					// Stop shrinking when encountering an editable border.
					if ( node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute( 'contenteditable' ) )
						return false;

					if ( !movingOut && node.type == CKEDITOR.NODE_ELEMENT )
						currentElement = node;

					return true;
				};

				if ( moveStart ) {
					var textStart = walker[ mode == CKEDITOR.SHRINK_ELEMENT ? 'lastForward' : 'next' ]();
					textStart && this.setStartAt( textStart, selectContents ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START );
				}

				if ( moveEnd ) {
					walker.reset();
					var textEnd = walker[ mode == CKEDITOR.SHRINK_ELEMENT ? 'lastBackward' : 'previous' ]();
					textEnd && this.setEndAt( textEnd, selectContents ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END );
				}

				return !!( moveStart || moveEnd );
			}
		},

		/**
		 * Inserts a node at the start of the range. The range will be expanded
		 * to contain the node.
		 *
		 * @param {CKEDITOR.dom.node} node
		 */
		insertNode: function( node ) {
			this.optimizeBookmark();
			this.trim( false, true );

			var startContainer = this.startContainer;
			var startOffset = this.startOffset;

			var nextNode = startContainer.getChild( startOffset );

			if ( nextNode )
				node.insertBefore( nextNode );
			else
				startContainer.append( node );

			// Check if we need to update the end boundary.
			if ( node.getParent() && node.getParent().equals( this.endContainer ) )
				this.endOffset++;

			// Expand the range to embrace the new node.
			this.setStartBefore( node );
		},

		/**
		 * Moves the range to a given position according to the specified node.
		 *
		 *		// HTML: <p>Foo <b>bar</b></p>
		 *		range.moveToPosition( elB, CKEDITOR.POSITION_BEFORE_START );
		 *		// Range will be moved to: <p>Foo ^<b>bar</b></p>
		 *
		 * See also {@link #setStartAt} and {@link #setEndAt}.
		 *
		 * @param {CKEDITOR.dom.node} node The node according to which the position will be set.
		 * @param {Number} position One of {@link CKEDITOR#POSITION_BEFORE_START},
		 * {@link CKEDITOR#POSITION_AFTER_START}, {@link CKEDITOR#POSITION_BEFORE_END},
		 * {@link CKEDITOR#POSITION_AFTER_END}.
		 */
		moveToPosition: function( node, position ) {
			this.setStartAt( node, position );
			this.collapse( true );
		},

		/**
		 * Moves the range to the exact position of the specified range.
		 *
		 * @param {CKEDITOR.dom.range} range
		 */
		moveToRange: function( range ) {
			this.setStart( range.startContainer, range.startOffset );
			this.setEnd( range.endContainer, range.endOffset );
		},

		/**
		 * Select nodes content. Range will start and end inside this node.
		 *
		 * @param {CKEDITOR.dom.node} node
		 */
		selectNodeContents: function( node ) {
			this.setStart( node, 0 );
			this.setEnd( node, node.type == CKEDITOR.NODE_TEXT ? node.getLength() : node.getChildCount() );
		},

		/**
		 * Sets the start position of a range.
		 *
		 * @param {CKEDITOR.dom.node} startNode The node to start the range.
		 * @param {Number} startOffset An integer greater than or equal to zero
		 * representing the offset for the start of the range from the start
		 * of `startNode`.
		 */
		setStart: function( startNode, startOffset ) {
			// W3C requires a check for the new position. If it is after the end
			// boundary, the range should be collapsed to the new start. It seams
			// we will not need this check for our use of this class so we can
			// ignore it for now.

			// Fixing invalid range start inside dtd empty elements.
			if ( startNode.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[ startNode.getName() ] )
				startOffset = startNode.getIndex(), startNode = startNode.getParent();

			this._setStartContainer( startNode );
			this.startOffset = startOffset;

			if ( !this.endContainer ) {
				this._setEndContainer( startNode );
				this.endOffset = startOffset;
			}

			updateCollapsed( this );
		},

		/**
		 * Sets the end position of a Range.
		 *
		 * @param {CKEDITOR.dom.node} endNode The node to end the range.
		 * @param {Number} endOffset An integer greater than or equal to zero
		 * representing the offset for the end of the range from the start
		 * of `endNode`.
		 */
		setEnd: function( endNode, endOffset ) {
			// W3C requires a check for the new position. If it is before the start
			// boundary, the range should be collapsed to the new end. It seams we
			// will not need this check for our use of this class so we can ignore
			// it for now.

			// Fixing invalid range end inside dtd empty elements.
			if ( endNode.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[ endNode.getName() ] )
				endOffset = endNode.getIndex() + 1, endNode = endNode.getParent();

			this._setEndContainer( endNode );
			this.endOffset = endOffset;

			if ( !this.startContainer ) {
				this._setStartContainer( endNode );
				this.startOffset = endOffset;
			}

			updateCollapsed( this );
		},

		/**
		 * Sets start of this range after the specified node.
		 *
		 *		// Range: <p>foo<b>bar</b>^</p>
		 *		range.setStartAfter( textFoo );
		 *		// The range will be changed to:
		 *		// <p>foo[<b>bar</b>]</p>
		 *
		 * @param {CKEDITOR.dom.node} node
		 */
		setStartAfter: function( node ) {
			this.setStart( node.getParent(), node.getIndex() + 1 );
		},

		/**
		 * Sets start of this range after the specified node.
		 *
		 *		// Range: <p>foo<b>bar</b>^</p>
		 *		range.setStartBefore( elB );
		 *		// The range will be changed to:
		 *		// <p>foo[<b>bar</b>]</p>
		 *
		 * @param {CKEDITOR.dom.node} node
		 */
		setStartBefore: function( node ) {
			this.setStart( node.getParent(), node.getIndex() );
		},

		/**
		 * Sets end of this range after the specified node.
		 *
		 *		// Range: <p>foo^<b>bar</b></p>
		 *		range.setEndAfter( elB );
		 *		// The range will be changed to:
		 *		// <p>foo[<b>bar</b>]</p>
		 *
		 * @param {CKEDITOR.dom.node} node
		 */
		setEndAfter: function( node ) {
			this.setEnd( node.getParent(), node.getIndex() + 1 );
		},

		/**
		 * Sets end of this range before the specified node.
		 *
		 *		// Range: <p>^foo<b>bar</b></p>
		 *		range.setStartAfter( textBar );
		 *		// The range will be changed to:
		 *		// <p>[foo<b>]bar</b></p>
		 *
		 * @param {CKEDITOR.dom.node} node
		 */
		setEndBefore: function( node ) {
			this.setEnd( node.getParent(), node.getIndex() );
		},

		/**
		 * Moves the start of this range to given position according to specified node.
		 *
		 *		// HTML: <p>Foo <b>bar</b>^</p>
		 *		range.setStartAt( elB, CKEDITOR.POSITION_AFTER_START );
		 *		// The range will be changed to:
		 *		// <p>Foo <b>[bar</b>]</p>
		 *
		 * See also {@link #setEndAt} and {@link #moveToPosition}.
		 *
		 * @param {CKEDITOR.dom.node} node The node according to which position will be set.
		 * @param {Number} position One of {@link CKEDITOR#POSITION_BEFORE_START},
		 * {@link CKEDITOR#POSITION_AFTER_START}, {@link CKEDITOR#POSITION_BEFORE_END},
		 * {@link CKEDITOR#POSITION_AFTER_END}.
		 */
		setStartAt: function( node, position ) {
			switch ( position ) {
				case CKEDITOR.POSITION_AFTER_START:
					this.setStart( node, 0 );
					break;

				case CKEDITOR.POSITION_BEFORE_END:
					if ( node.type == CKEDITOR.NODE_TEXT )
						this.setStart( node, node.getLength() );
					else
						this.setStart( node, node.getChildCount() );
					break;

				case CKEDITOR.POSITION_BEFORE_START:
					this.setStartBefore( node );
					break;

				case CKEDITOR.POSITION_AFTER_END:
					this.setStartAfter( node );
			}

			updateCollapsed( this );
		},

		/**
		 * Moves the end of this range to given position according to specified node.
		 *
		 *		// HTML: <p>^Foo <b>bar</b></p>
		 *		range.setEndAt( textBar, CKEDITOR.POSITION_BEFORE_START );
		 *		// The range will be changed to:
		 *		// <p>[Foo <b>]bar</b></p>
		 *
		 * See also {@link #setStartAt} and {@link #moveToPosition}.
		 *
		 * @param {CKEDITOR.dom.node} node The node according to which position will be set.
		 * @param {Number} position One of {@link CKEDITOR#POSITION_BEFORE_START},
		 * {@link CKEDITOR#POSITION_AFTER_START}, {@link CKEDITOR#POSITION_BEFORE_END},
		 * {@link CKEDITOR#POSITION_AFTER_END}.
		 */
		setEndAt: function( node, position ) {
			switch ( position ) {
				case CKEDITOR.POSITION_AFTER_START:
					this.setEnd( node, 0 );
					break;

				case CKEDITOR.POSITION_BEFORE_END:
					if ( node.type == CKEDITOR.NODE_TEXT )
						this.setEnd( node, node.getLength() );
					else
						this.setEnd( node, node.getChildCount() );
					break;

				case CKEDITOR.POSITION_BEFORE_START:
					this.setEndBefore( node );
					break;

				case CKEDITOR.POSITION_AFTER_END:
					this.setEndAfter( node );
			}

			updateCollapsed( this );
		},

		/**
		 * Wraps inline content found around the range's start or end boundary
		 * with a block element.
		 *
		 *		// Assuming the following range:
		 *		// <h1>foo</h1>ba^r<br />bom<p>foo</p>
		 *		// The result of executing:
		 *		range.fixBlock( true, 'p' );
		 *		// will be:
		 *		// <h1>foo</h1><p>ba^r<br />bom</p><p>foo</p>
		 *
		 * Non-collapsed range:
		 *
		 *		// Assuming the following range:
		 *		// ba[r<p>foo</p>bo]m
		 *		// The result of executing:
		 *		range.fixBlock( false, 'p' );
		 *		// will be:
		 *		// ba[r<p>foo</p><p>bo]m</p>
		 *
		 * @param {Boolean} isStart Whether the start or end boundary of a range should be checked.
		 * @param {String} blockTag The name of a block element in which content will be wrapped.
		 * For example: `'p'`.
		 * @returns {CKEDITOR.dom.element} Created block wrapper.
		 */
		fixBlock: function( isStart, blockTag ) {
			var bookmark = this.createBookmark(),
				fixedBlock = this.document.createElement( blockTag );

			this.collapse( isStart );

			this.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );

			this.extractContents().appendTo( fixedBlock );
			fixedBlock.trim();

			this.insertNode( fixedBlock );

			// Bogus <br> could already exist in the range's container before fixBlock() was called. In such case it was
			// extracted and appended to the fixBlock. However, we are not sure that it's at the end of
			// the fixedBlock, because of FF's terrible bug. When creating a bookmark in an empty editable
			// FF moves the bogus <br> before that bookmark (<editable><br /><bm />[]</editable>).
			// So even if the initial range was placed before the bogus <br>, after creating the bookmark it
			// is placed before the bookmark.
			// Fortunately, getBogus() is able to skip the bookmark so it finds the bogus <br> in this case.
			// We remove incorrectly placed one and add a brand new one. (http://dev.ckeditor.com/ticket/13001)
			var bogus = fixedBlock.getBogus();
			if ( bogus ) {
				bogus.remove();
			}
			fixedBlock.appendBogus();

			this.moveToBookmark( bookmark );

			return fixedBlock;
		},

		/**
		 * @todo
		 * @param {Boolean} [cloneId=false] Whether to preserve ID attributes in the result blocks.
		 */
		splitBlock: function( blockTag, cloneId ) {
			var startPath = new CKEDITOR.dom.elementPath( this.startContainer, this.root ),
				endPath = new CKEDITOR.dom.elementPath( this.endContainer, this.root );

			var startBlockLimit = startPath.blockLimit,
				endBlockLimit = endPath.blockLimit;

			var startBlock = startPath.block,
				endBlock = endPath.block;

			var elementPath = null;
			// Do nothing if the boundaries are in different block limits.
			if ( !startBlockLimit.equals( endBlockLimit ) )
				return null;

			// Get or fix current blocks.
			if ( blockTag != 'br' ) {
				if ( !startBlock ) {
					startBlock = this.fixBlock( true, blockTag );
					endBlock = new CKEDITOR.dom.elementPath( this.endContainer, this.root ).block;
				}

				if ( !endBlock )
					endBlock = this.fixBlock( false, blockTag );
			}

			// Get the range position.
			var isStartOfBlock = startBlock && this.checkStartOfBlock(),
				isEndOfBlock = endBlock && this.checkEndOfBlock();

			// Delete the current contents.
			// TODO: Why is 2.x doing CheckIsEmpty()?
			this.deleteContents();

			if ( startBlock && startBlock.equals( endBlock ) ) {
				if ( isEndOfBlock ) {
					elementPath = new CKEDITOR.dom.elementPath( this.startContainer, this.root );
					this.moveToPosition( endBlock, CKEDITOR.POSITION_AFTER_END );
					endBlock = null;
				} else if ( isStartOfBlock ) {
					elementPath = new CKEDITOR.dom.elementPath( this.startContainer, this.root );
					this.moveToPosition( startBlock, CKEDITOR.POSITION_BEFORE_START );
					startBlock = null;
				} else {
					endBlock = this.splitElement( startBlock, cloneId || false );

					// In Gecko, the last child node must be a bogus <br>.
					// Note: bogus <br> added under <ul> or <ol> would cause
					// lists to be incorrectly rendered.
					if ( !startBlock.is( 'ul', 'ol' ) )
						startBlock.appendBogus();
				}
			}

			return {
				previousBlock: startBlock,
				nextBlock: endBlock,
				wasStartOfBlock: isStartOfBlock,
				wasEndOfBlock: isEndOfBlock,
				elementPath: elementPath
			};
		},

		/**
		 * Branch the specified element from the collapsed range position and
		 * place the caret between the two result branches.
		 *
		 * **Note:** The range must be collapsed and been enclosed by this element.
		 *
		 * @param {CKEDITOR.dom.element} element
		 * @param {Boolean} [cloneId=false] Whether to preserve ID attributes in the result elements.
		 * @returns {CKEDITOR.dom.element} Root element of the new branch after the split.
		 */
		splitElement: function( toSplit, cloneId ) {
			if ( !this.collapsed )
				return null;

			// Extract the contents of the block from the selection point to the end
			// of its contents.
			this.setEndAt( toSplit, CKEDITOR.POSITION_BEFORE_END );
			var documentFragment = this.extractContents( false, cloneId || false );

			// Duplicate the element after it.
			var clone = toSplit.clone( false, cloneId || false );

			// Place the extracted contents into the duplicated element.
			documentFragment.appendTo( clone );
			clone.insertAfter( toSplit );
			this.moveToPosition( toSplit, CKEDITOR.POSITION_AFTER_END );
			return clone;
		},

		/**
		 * Recursively remove any empty path blocks at the range boundary.
		 *
		 * @method
		 * @param {Boolean} atEnd Removal to perform at the end boundary,
		 * otherwise to perform at the start.
		 */
		removeEmptyBlocksAtEnd: ( function() {

			var whitespace = CKEDITOR.dom.walker.whitespaces(),
					bookmark = CKEDITOR.dom.walker.bookmark( false );

			function childEval( parent ) {
				return function( node ) {
					// Whitespace, bookmarks, empty inlines.
					if ( whitespace( node ) || bookmark( node ) ||
							node.type == CKEDITOR.NODE_ELEMENT &&
							node.isEmptyInlineRemoveable() ) {
						return false;
					} else if ( parent.is( 'table' ) && node.is( 'caption' ) ) {
						return false;
					}

					return true;
				};
			}

			return function( atEnd ) {

				var bm = this.createBookmark();
				var path = this[ atEnd ? 'endPath' : 'startPath' ]();
				var block = path.block || path.blockLimit, parent;

				// Remove any childless block, including list and table.
				while ( block && !block.equals( path.root ) &&
						!block.getFirst( childEval( block ) ) ) {
					parent = block.getParent();
					this[ atEnd ? 'setEndAt' : 'setStartAt' ]( block, CKEDITOR.POSITION_AFTER_END );
					block.remove( 1 );
					block = parent;
				}

				this.moveToBookmark( bm );
			};

		} )(),

		/**
		 * Gets {@link CKEDITOR.dom.elementPath} for the {@link #startContainer}.
		 *
		 * @returns {CKEDITOR.dom.elementPath}
		 */
		startPath: function() {
			return new CKEDITOR.dom.elementPath( this.startContainer, this.root );
		},

		/**
		 * Gets {@link CKEDITOR.dom.elementPath} for the {@link #endContainer}.
		 *
		 * @returns {CKEDITOR.dom.elementPath}
		 */
		endPath: function() {
			return new CKEDITOR.dom.elementPath( this.endContainer, this.root );
		},

		/**
		 * Check whether a range boundary is at the inner boundary of a given
		 * element.
		 *
		 * @param {CKEDITOR.dom.element} element The target element to check.
		 * @param {Number} checkType The boundary to check for both the range
		 * and the element. It can be {@link CKEDITOR#START} or {@link CKEDITOR#END}.
		 * @returns {Boolean} `true` if the range boundary is at the inner
		 * boundary of the element.
		 */
		checkBoundaryOfElement: function( element, checkType ) {
			var checkStart = ( checkType == CKEDITOR.START );

			// Create a copy of this range, so we can manipulate it for our checks.
			var walkerRange = this.clone();

			// Collapse the range at the proper size.
			walkerRange.collapse( checkStart );

			// Expand the range to element boundary.
			walkerRange[ checkStart ? 'setStartAt' : 'setEndAt' ]( element, checkStart ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END );

			// Create the walker, which will check if we have anything useful
			// in the range.
			var walker = new CKEDITOR.dom.walker( walkerRange );
			walker.evaluator = elementBoundaryEval( checkStart );

			return walker[ checkStart ? 'checkBackward' : 'checkForward' ]();
		},

		/**
		 * **Note:** Calls to this function may produce changes to the DOM. The range may
		 * be updated to reflect such changes.
		 *
		 * @returns {Boolean}
		 * @todo
		 */
		checkStartOfBlock: function() {
			var startContainer = this.startContainer,
				startOffset = this.startOffset;

			// [IE] Special handling for range start in text with a leading NBSP,
			// we it to be isolated, for bogus check.
			if ( CKEDITOR.env.ie && startOffset && startContainer.type == CKEDITOR.NODE_TEXT ) {
				var textBefore = CKEDITOR.tools.ltrim( startContainer.substring( 0, startOffset ) );
				if ( nbspRegExp.test( textBefore ) )
					this.trim( 0, 1 );
			}

			// Anticipate the trim() call here, so the walker will not make
			// changes to the DOM, which would not get reflected into this
			// range otherwise.
			this.trim();

			// We need to grab the block element holding the start boundary, so
			// let's use an element path for it.
			var path = new CKEDITOR.dom.elementPath( this.startContainer, this.root );

			// Creates a range starting at the block start until the range start.
			var walkerRange = this.clone();
			walkerRange.collapse( true );
			walkerRange.setStartAt( path.block || path.blockLimit, CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( walkerRange );
			walker.evaluator = getCheckStartEndBlockEvalFunction();

			return walker.checkBackward();
		},

		/**
		 * **Note:** Calls to this function may produce changes to the DOM. The range may
		 * be updated to reflect such changes.
		 *
		 * @returns {Boolean}
		 * @todo
		 */
		checkEndOfBlock: function() {
			var endContainer = this.endContainer,
				endOffset = this.endOffset;

			// [IE] Special handling for range end in text with a following NBSP,
			// we it to be isolated, for bogus check.
			if ( CKEDITOR.env.ie && endContainer.type == CKEDITOR.NODE_TEXT ) {
				var textAfter = CKEDITOR.tools.rtrim( endContainer.substring( endOffset ) );
				if ( nbspRegExp.test( textAfter ) )
					this.trim( 1, 0 );
			}

			// Anticipate the trim() call here, so the walker will not make
			// changes to the DOM, which would not get reflected into this
			// range otherwise.
			this.trim();

			// We need to grab the block element holding the start boundary, so
			// let's use an element path for it.
			var path = new CKEDITOR.dom.elementPath( this.endContainer, this.root );

			// Creates a range starting at the block start until the range start.
			var walkerRange = this.clone();
			walkerRange.collapse( false );
			walkerRange.setEndAt( path.block || path.blockLimit, CKEDITOR.POSITION_BEFORE_END );

			var walker = new CKEDITOR.dom.walker( walkerRange );
			walker.evaluator = getCheckStartEndBlockEvalFunction();

			return walker.checkForward();
		},

		/**
		 * Traverse with {@link CKEDITOR.dom.walker} to retrieve the previous element before the range start.
		 *
		 * @param {Function} evaluator Function used as the walker's evaluator.
		 * @param {Function} [guard] Function used as the walker's guard.
		 * @param {CKEDITOR.dom.element} [boundary] A range ancestor element in which the traversal is limited,
		 * default to the root editable if not defined.
		 * @returns {CKEDITOR.dom.element/null} The returned node from the traversal.
		 */
		getPreviousNode: function( evaluator, guard, boundary ) {
			var walkerRange = this.clone();
			walkerRange.collapse( 1 );
			walkerRange.setStartAt( boundary || this.root, CKEDITOR.POSITION_AFTER_START );

			var walker = new CKEDITOR.dom.walker( walkerRange );
			walker.evaluator = evaluator;
			walker.guard = guard;
			return walker.previous();
		},

		/**
		 * Traverse with {@link CKEDITOR.dom.walker} to retrieve the next element before the range start.
		 *
		 * @param {Function} evaluator Function used as the walker's evaluator.
		 * @param {Function} [guard] Function used as the walker's guard.
		 * @param {CKEDITOR.dom.element} [boundary] A range ancestor element in which the traversal is limited,
		 * default to the root editable if not defined.
		 * @returns {CKEDITOR.dom.element/null} The returned node from the traversal.
		 */
		getNextNode: function( evaluator, guard, boundary ) {
			var walkerRange = this.clone();
			walkerRange.collapse();
			walkerRange.setEndAt( boundary || this.root, CKEDITOR.POSITION_BEFORE_END );

			var walker = new CKEDITOR.dom.walker( walkerRange );
			walker.evaluator = evaluator;
			walker.guard = guard;
			return walker.next();
		},

		/**
		 * Check if elements at which the range boundaries anchor are read-only,
		 * with respect to `contenteditable` attribute.
		 *
		 * @returns {Boolean}
		 */
		checkReadOnly: ( function() {
			function checkNodesEditable( node, anotherEnd ) {
				while ( node ) {
					if ( node.type == CKEDITOR.NODE_ELEMENT ) {
						if ( node.getAttribute( 'contentEditable' ) == 'false' && !node.data( 'cke-editable' ) )
							return 0;

						// Range enclosed entirely in an editable element.
						else if ( node.is( 'html' ) || node.getAttribute( 'contentEditable' ) == 'true' && ( node.contains( anotherEnd ) || node.equals( anotherEnd ) ) )
							break;

					}
					node = node.getParent();
				}

				return 1;
			}

			return function() {
				var startNode = this.startContainer,
					endNode = this.endContainer;

				// Check if elements path at both boundaries are editable.
				return !( checkNodesEditable( startNode, endNode ) && checkNodesEditable( endNode, startNode ) );
			};
		} )(),

		/**
		 * Moves the range boundaries to the first/end editing point inside an
		 * element.
		 *
		 * For example, in an element tree like
		 * `<p><b><i></i></b> Text</p>`, the start editing point is
		 * `<p><b><i>^</i></b> Text</p>` (inside `<i>`).
		 *
		 * @param {CKEDITOR.dom.element} el The element into which look for the
		 * editing spot.
		 * @param {Boolean} isMoveToEnd Whether move to the end editable position.
		 * @returns {Boolean} Whether range was moved.
		 */
		moveToElementEditablePosition: function( el, isMoveToEnd ) {

			function nextDFS( node, childOnly ) {
				var next;

				if ( node.type == CKEDITOR.NODE_ELEMENT && node.isEditable( false ) )
					next = node[ isMoveToEnd ? 'getLast' : 'getFirst' ]( notIgnoredEval );

				if ( !childOnly && !next )
					next = node[ isMoveToEnd ? 'getPrevious' : 'getNext' ]( notIgnoredEval );

				return next;
			}

			// Handle non-editable element e.g. HR.
			if ( el.type == CKEDITOR.NODE_ELEMENT && !el.isEditable( false ) ) {
				this.moveToPosition( el, isMoveToEnd ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START );
				return true;
			}

			var found = 0;

			while ( el ) {
				// Stop immediately if we've found a text node.
				if ( el.type == CKEDITOR.NODE_TEXT ) {
					// Put cursor before block filler.
					if ( isMoveToEnd && this.endContainer && this.checkEndOfBlock() && nbspRegExp.test( el.getText() ) )
						this.moveToPosition( el, CKEDITOR.POSITION_BEFORE_START );
					else
						this.moveToPosition( el, isMoveToEnd ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START );
					found = 1;
					break;
				}

				// If an editable element is found, move inside it, but not stop the searching.
				if ( el.type == CKEDITOR.NODE_ELEMENT ) {
					if ( el.isEditable() ) {
						this.moveToPosition( el, isMoveToEnd ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START );
						found = 1;
					}
					// Put cursor before padding block br.
					else if ( isMoveToEnd && el.is( 'br' ) && this.endContainer && this.checkEndOfBlock() )
						this.moveToPosition( el, CKEDITOR.POSITION_BEFORE_START );
					// Special case - non-editable block. Select entire element, because it does not make sense
					// to place collapsed selection next to it, because browsers can't handle that.
					else if ( el.getAttribute( 'contenteditable' ) == 'false' && el.is( CKEDITOR.dtd.$block ) ) {
						this.setStartBefore( el );
						this.setEndAfter( el );
						return true;
					}
				}

				el = nextDFS( el, found );
			}

			return !!found;
		},

		/**
		 * Moves the range boundaries to the closest editing point after/before an
		 * element or the current range position (depends on whether the element was specified).
		 *
		 * For example, if the start element has `id="start"`,
		 * `<p><b>foo</b><span id="start">start</start></p>`, the closest previous editing point is
		 * `<p><b>foo</b>^<span id="start">start</start></p>` (between `<b>` and `<span>`).
		 *
		 * See also: {@link #moveToElementEditablePosition}.
		 *
		 * @since 4.3
		 * @param {CKEDITOR.dom.element} [element] The starting element. If not specified, the current range
		 * position will be used.
		 * @param {Boolean} [isMoveForward] Whether move to the end of editable. Otherwise, look back.
		 * @returns {Boolean} Whether the range was moved.
		 */
		moveToClosestEditablePosition: function( element, isMoveForward ) {
			// We don't want to modify original range if there's no editable position.
			var range,
				found = 0,
				sibling,
				isElement,
				positions = [ CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START ];

			if ( element ) {
				// Set collapsed range at one of ends of element.
				// Can't clone this range, because this range might not be yet positioned (no containers => errors).
				range = new CKEDITOR.dom.range( this.root );
				range.moveToPosition( element, positions[ isMoveForward ? 0 : 1 ] );
			} else {
				range = this.clone();
			}

			// Start element isn't a block, so we can automatically place range
			// next to it.
			if ( element && !element.is( CKEDITOR.dtd.$block ) )
				found = 1;
			else {
				// Look for first node that fulfills eval function and place range next to it.
				sibling = range[ isMoveForward ? 'getNextEditableNode' : 'getPreviousEditableNode' ]();
				if ( sibling ) {
					found = 1;
					isElement = sibling.type == CKEDITOR.NODE_ELEMENT;

					// Special case - eval accepts block element only if it's a non-editable block,
					// which we want to select, not place collapsed selection next to it (which browsers
					// can't handle).
					if ( isElement && sibling.is( CKEDITOR.dtd.$block ) && sibling.getAttribute( 'contenteditable' ) == 'false' ) {
						range.setStartAt( sibling, CKEDITOR.POSITION_BEFORE_START );
						range.setEndAt( sibling, CKEDITOR.POSITION_AFTER_END );
					}
					// Handle empty blocks which can be selection containers on old IEs.
					else if ( !CKEDITOR.env.needsBrFiller && isElement && sibling.is( CKEDITOR.dom.walker.validEmptyBlockContainers ) ) {
						range.setEnd( sibling, 0 );
						range.collapse();
					} else {
						range.moveToPosition( sibling, positions[ isMoveForward ? 1 : 0 ] );
					}
				}
			}

			if ( found )
				this.moveToRange( range );

			return !!found;
		},

		/**
		 * See {@link #moveToElementEditablePosition}.
		 *
		 * @returns {Boolean} Whether range was moved.
		 */
		moveToElementEditStart: function( target ) {
			return this.moveToElementEditablePosition( target );
		},

		/**
		 * See {@link #moveToElementEditablePosition}.
		 *
		 * @returns {Boolean} Whether range was moved.
		 */
		moveToElementEditEnd: function( target ) {
			return this.moveToElementEditablePosition( target, true );
		},

		/**
		 * Get the single node enclosed within the range if there's one.
		 *
		 * @returns {CKEDITOR.dom.node}
		 */
		getEnclosedNode: function() {
			var walkerRange = this.clone();

			// Optimize and analyze the range to avoid DOM destructive nature of walker. (http://dev.ckeditor.com/ticket/5780)
			walkerRange.optimize();
			if ( walkerRange.startContainer.type != CKEDITOR.NODE_ELEMENT || walkerRange.endContainer.type != CKEDITOR.NODE_ELEMENT )
				return null;

			var walker = new CKEDITOR.dom.walker( walkerRange ),
				isNotBookmarks = CKEDITOR.dom.walker.bookmark( false, true ),
				isNotWhitespaces = CKEDITOR.dom.walker.whitespaces( true );

			walker.evaluator = function( node ) {
				return isNotWhitespaces( node ) && isNotBookmarks( node );
			};
			var node = walker.next();
			walker.reset();
			return node && node.equals( walker.previous() ) ? node : null;
		},

		/**
		 * Get the node adjacent to the range start or {@link #startContainer}.
		 *
		 * @returns {CKEDITOR.dom.node}
		 */
		getTouchedStartNode: function() {
			var container = this.startContainer;

			if ( this.collapsed || container.type != CKEDITOR.NODE_ELEMENT )
				return container;

			return container.getChild( this.startOffset ) || container;
		},

		/**
		 * Get the node adjacent to the range end or {@link #endContainer}.
		 *
		 * @returns {CKEDITOR.dom.node}
		 */
		getTouchedEndNode: function() {
			var container = this.endContainer;

			if ( this.collapsed || container.type != CKEDITOR.NODE_ELEMENT )
				return container;

			return container.getChild( this.endOffset - 1 ) || container;
		},

		/**
		 * Gets next node which can be a container of a selection.
		 * This methods mimics a behavior of right/left arrow keys in case of
		 * collapsed selection. It does not return an exact position (with offset) though,
		 * but just a selection's container.
		 *
		 * Note: use this method on a collapsed range.
		 *
		 * @since 4.3
		 * @returns {CKEDITOR.dom.element/CKEDITOR.dom.text}
		 */
		getNextEditableNode: getNextEditableNode(),

		/**
		 * See {@link #getNextEditableNode}.
		 *
		 * @since 4.3
		 * @returns {CKEDITOR.dom.element/CKEDITOR.dom.text}
		 */
		getPreviousEditableNode: getNextEditableNode( 1 ),

		/**
		 * Returns any table element, like `td`, `tbody`, `table` etc. from a given range. The element
		 * is returned only if the range is contained within one table (might be a nested
		 * table, but it cannot be two different tables on the same DOM level).
		 *
		 * @private
		 * @since 4.7
		 * @param {Object} [tableElements] Mapping of element names that should be considered.
		 * @returns {CKEDITOR.dom.element/null}
		 */
		_getTableElement: function( tableElements ) {
			tableElements = tableElements || {
				td: 1,
				th: 1,
				tr: 1,
				tbody: 1,
				thead: 1,
				tfoot: 1,
				table: 1
			};

			var start = this.startContainer,
				end = this.endContainer,
				startTable = start.getAscendant( 'table', true ),
				endTable = end.getAscendant( 'table', true );

			// Super weird edge case in Safari: if there is a table with only one cell inside and that cell
			// is selected, then the end boundary of the table is moved into editor's editable.
			// That case is also present when selecting the last cell inside nested table.
			if ( CKEDITOR.env.safari && startTable && end.equals( this.root ) ) {
				return start.getAscendant( tableElements, true );
			}

			if ( this.getEnclosedNode() ) {
				return this.getEnclosedNode().getAscendant( tableElements, true );
			}

			// Ensure that selection starts and ends in the same table or one of the table is inside the other.
			if ( startTable && endTable && ( startTable.equals( endTable ) || startTable.contains( endTable ) ||
				endTable.contains( startTable ) ) ) {

				return start.getAscendant( tableElements, true );
			}

			return null;
		},

		/**
		 * Scrolls the start of current range into view.
		 */
		scrollIntoView: function() {

			// The reference element contains a zero-width space to avoid
			// a premature removal. The view is to be scrolled with respect
			// to this element.
			var reference = new CKEDITOR.dom.element.createFromHtml( '<span>&nbsp;</span>', this.document ),
				afterCaretNode, startContainerText, isStartText;

			var range = this.clone();

			// Work with the range to obtain a proper caret position.
			range.optimize();

			// Currently in a text node, so we need to split it into two
			// halves and put the reference between.
			if ( isStartText = range.startContainer.type == CKEDITOR.NODE_TEXT ) {
				// Keep the original content. It will be restored.
				startContainerText = range.startContainer.getText();

				// Split the startContainer at the this position.
				afterCaretNode = range.startContainer.split( range.startOffset );

				// Insert the reference between two text nodes.
				reference.insertAfter( range.startContainer );
			}

			// If not in a text node, simply insert the reference into the range.
			else {
				range.insertNode( reference );
			}

			// Scroll with respect to the reference element.
			reference.scrollIntoView();

			// Get rid of split parts if "in a text node" case.
			// Revert the original text of the startContainer.
			if ( isStartText ) {
				range.startContainer.setText( startContainerText );
				afterCaretNode.remove();
			}

			// Get rid of the reference node. It is no longer necessary.
			reference.remove();
		},

		/**
		 * Setter for the {@link #startContainer}.
		 *
		 * @since 4.4.6
		 * @private
		 * @param {CKEDITOR.dom.element} startContainer
		 */
		_setStartContainer: function( startContainer ) {
			// %REMOVE_START%
			var isRootAscendantOrSelf = this.root.equals( startContainer ) || this.root.contains( startContainer );

			if ( !isRootAscendantOrSelf ) {
				CKEDITOR.warn( 'range-startcontainer', { startContainer: startContainer, root: this.root } );
			}
			// %REMOVE_END%
			this.startContainer = startContainer;
		},

		/**
		 * Setter for the {@link #endContainer}.
		 *
		 * @since 4.4.6
		 * @private
		 * @param {CKEDITOR.dom.element} endContainer
		 */
		_setEndContainer: function( endContainer ) {
			// %REMOVE_START%
			var isRootAscendantOrSelf = this.root.equals( endContainer ) || this.root.contains( endContainer );

			if ( !isRootAscendantOrSelf ) {
				CKEDITOR.warn( 'range-endcontainer', { endContainer: endContainer, root: this.root } );
			}
			// %REMOVE_END%
			this.endContainer = endContainer;
		},

		/**
		 * Looks for elements matching the `query` selector within a range.
		 *
		 * @since 4.5.11
		 * @private
		 * @param {String} query
		 * @param {Boolean} [includeNonEditables=false] Whether elements with `contenteditable` set to `false` should
		 * be included.
		 * @returns {CKEDITOR.dom.element[]}
		 */
		_find: function( query, includeNonEditables ) {
			var ancestor = this.getCommonAncestor(),
				boundaries = this.getBoundaryNodes(),
				// Contrary to CKEDITOR.dom.element#find we're returning array, that's because NodeList is immutable, and we need
				// to do some filtering in returned list.
				ret = [],
				curItem,
				i,
				initialMatches,
				isStartGood,
				isEndGood;

			if ( ancestor && ancestor.find ) {
				initialMatches = ancestor.find( query );

				for ( i = 0; i < initialMatches.count(); i++ ) {
					curItem = initialMatches.getItem( i );

					// Using isReadOnly() method to filterout non editables. It checks isContentEditable including all browser quirks.
					if ( !includeNonEditables && curItem.isReadOnly() ) {
						continue;
					}

					// It's not enough to get elements from common ancestor, because it might contain too many matches.
					// We need to ensure that returned items are between boundary points.
					isStartGood = ( curItem.getPosition( boundaries.startNode ) & CKEDITOR.POSITION_FOLLOWING ) || boundaries.startNode.equals( curItem );
					isEndGood = ( curItem.getPosition( boundaries.endNode ) & ( CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_IS_CONTAINED ) ) || boundaries.endNode.equals( curItem );

					if ( isStartGood && isEndGood ) {
						ret.push( curItem );
					}
				}
			}

			return ret;
		}
	};

	/**
	 * Merges every subsequent range in given set, returning a smaller array of ranges.
	 *
	 * Note that each range in the returned value will be enlarged with `CKEDITOR.ENLARGE_ELEMENT` value.
	 *
	 * @since 4.7.0
	 * @static
	 * @param {CKEDITOR.dom.range[]} ranges
	 * @returns {CKEDITOR.dom.range[]} Set of merged ranges.
	 * @member CKEDITOR.dom.range
	 */
	CKEDITOR.dom.range.mergeRanges = function( ranges ) {
		return CKEDITOR.tools.array.reduce( ranges, function( ret, rng ) {
			// Last range ATM.
			var lastRange = ret[ ret.length - 1 ],
				isContinuation = false;

			// Make a clone, we don't want to modify input.
			rng = rng.clone();
			rng.enlarge( CKEDITOR.ENLARGE_ELEMENT );

			if ( lastRange ) {
				// The trick is to create a range spanning the gap between the two ranges. Then iterate over
				// each node found in this gap. If it contains anything other than whitespace, then it means it
				// is not a continuation.
				var gapRange = new CKEDITOR.dom.range( rng.root ),
					walker = new CKEDITOR.dom.walker( gapRange ),
					isWhitespace = CKEDITOR.dom.walker.whitespaces(),
					nodeInBetween;

				gapRange.setStart( lastRange.endContainer, lastRange.endOffset );
				gapRange.setEnd( rng.startContainer, rng.startOffset );

				nodeInBetween = walker.next();

				while ( isWhitespace( nodeInBetween ) || rng.endContainer.equals( nodeInBetween ) ) {
					// We don't care about whitespaces, and range container. Also we skip the endContainer,
					// as it will also be provided by the iterator (as it visits it's opening tag).
					nodeInBetween = walker.next();
				}

				// Simply, if anything has been found there's a content in between the two.
				isContinuation = !nodeInBetween;
			}

			if ( isContinuation ) {
				// If last range ends, where the current range starts, then let's merge it.
				lastRange.setEnd( rng.endContainer, rng.endOffset );
			} else {
				// In other case just push cur range into the stack.
				ret.push( rng );
			}

			return ret;
		}, [] );
	};

} )();

/**
 * Indicates a position after start of a node.
 *
 *		// When used according to an element:
 *		// <element>^contents</element>
 *
 *		// When used according to a text node:
 *		// "^text" (range is anchored in the text node)
 *
 * It is used as a parameter of methods like: {@link CKEDITOR.dom.range#moveToPosition},
 * {@link CKEDITOR.dom.range#setStartAt} and {@link CKEDITOR.dom.range#setEndAt}.
 *
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=1]
 */
CKEDITOR.POSITION_AFTER_START = 1;

/**
 * Indicates a position before end of a node.
 *
 *		// When used according to an element:
 *		// <element>contents^</element>
 *
 *		// When used according to a text node:
 *		// "text^" (range is anchored in the text node)
 *
 * It is used as a parameter of methods like: {@link CKEDITOR.dom.range#moveToPosition},
 * {@link CKEDITOR.dom.range#setStartAt} and {@link CKEDITOR.dom.range#setEndAt}.
 *
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=2]
 */
CKEDITOR.POSITION_BEFORE_END = 2;

/**
 * Indicates a position before start of a node.
 *
 *		// When used according to an element:
 *		// ^<element>contents</element> (range is anchored in element's parent)
 *
 *		// When used according to a text node:
 *		// ^"text" (range is anchored in text node's parent)
 *
 * It is used as a parameter of methods like: {@link CKEDITOR.dom.range#moveToPosition},
 * {@link CKEDITOR.dom.range#setStartAt} and {@link CKEDITOR.dom.range#setEndAt}.
 *
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=3]
 */
CKEDITOR.POSITION_BEFORE_START = 3;

/**
 * Indicates a position after end of a node.
 *
 *		// When used according to an element:
 *		// <element>contents</element>^ (range is anchored in element's parent)
 *
 *		// When used according to a text node:
 *		// "text"^ (range is anchored in text node's parent)
 *
 * It is used as a parameter of methods like: {@link CKEDITOR.dom.range#moveToPosition},
 * {@link CKEDITOR.dom.range#setStartAt} and {@link CKEDITOR.dom.range#setEndAt}.
 *
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=4]
 */
CKEDITOR.POSITION_AFTER_END = 4;

/**
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=1]
 */
CKEDITOR.ENLARGE_ELEMENT = 1;

/**
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=2]
 */
CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2;

/**
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=3]
 */
CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3;

/**
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=4]
 */
CKEDITOR.ENLARGE_INLINE = 4;

// Check boundary types.

/**
 * See {@link CKEDITOR.dom.range#checkBoundaryOfElement}.
 *
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=1]
 */
CKEDITOR.START = 1;

/**
 * See {@link CKEDITOR.dom.range#checkBoundaryOfElement}.
 *
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=2]
 */
CKEDITOR.END = 2;

// Shrink range types.

/**
 * See {@link CKEDITOR.dom.range#shrink}.
 *
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=1]
 */
CKEDITOR.SHRINK_ELEMENT = 1;

/**
 * See {@link CKEDITOR.dom.range#shrink}.
 *
 * @readonly
 * @member CKEDITOR
 * @property {Number} [=2]
 */
CKEDITOR.SHRINK_TEXT = 2;
