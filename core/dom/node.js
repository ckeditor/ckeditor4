/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.dom.node} class which is the base
 *		class for classes that represent DOM nodes.
 */

/**
 * Base class for classes representing DOM nodes. This constructor may return
 * an instance of a class that inherits from this class, like
 * {@link CKEDITOR.dom.element} or {@link CKEDITOR.dom.text}.
 *
 * @class
 * @extends CKEDITOR.dom.domObject
 * @constructor Creates a node class instance.
 * @param {Object} domNode A native DOM node.
 * @see CKEDITOR.dom.element
 * @see CKEDITOR.dom.text
 */
CKEDITOR.dom.node = function( domNode ) {
	if ( domNode ) {
		var type =
			domNode.nodeType == CKEDITOR.NODE_DOCUMENT ? 'document' :
			domNode.nodeType == CKEDITOR.NODE_ELEMENT ? 'element' :
			domNode.nodeType == CKEDITOR.NODE_TEXT ? 'text' :
			domNode.nodeType == CKEDITOR.NODE_COMMENT ? 'comment' :
			domNode.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? 'documentFragment' :
			'domObject'; // Call the base constructor otherwise.

		return new CKEDITOR.dom[ type ]( domNode );
	}

	return this;
};

CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject();

/**
 * Element node type.
 *
 * @readonly
 * @property {Number} [=1]
 * @member CKEDITOR
 */
CKEDITOR.NODE_ELEMENT = 1;

/**
 * Document node type.
 *
 * @readonly
 * @property {Number} [=9]
 * @member CKEDITOR
 */
CKEDITOR.NODE_DOCUMENT = 9;

/**
 * Text node type.
 *
 * @readonly
 * @property {Number} [=3]
 * @member CKEDITOR
 */
CKEDITOR.NODE_TEXT = 3;

/**
 * Comment node type.
 *
 * @readonly
 * @property {Number} [=8]
 * @member CKEDITOR
 */
CKEDITOR.NODE_COMMENT = 8;

/**
 * Document fragment node type.
 *
 * @readonly
 * @property {Number} [=11]
 * @member CKEDITOR
 */
CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11;

/**
 * Indicates that positions of both nodes are identical (this is the same node). See {@link CKEDITOR.dom.node#getPosition}.
 *
 * @readonly
 * @property {Number} [=0]
 * @member CKEDITOR
 */
CKEDITOR.POSITION_IDENTICAL = 0;

/**
 * Indicates that nodes are in different (detached) trees. See {@link CKEDITOR.dom.node#getPosition}.
 *
 * @readonly
 * @property {Number} [=1]
 * @member CKEDITOR
 */
CKEDITOR.POSITION_DISCONNECTED = 1;

/**
 * Indicates that the context node follows the other node. See {@link CKEDITOR.dom.node#getPosition}.
 *
 * @readonly
 * @property {Number} [=2]
 * @member CKEDITOR
 */
CKEDITOR.POSITION_FOLLOWING = 2;

/**
 * Indicates that the context node precedes the other node. See {@link CKEDITOR.dom.node#getPosition}.
 *
 * @readonly
 * @property {Number} [=4]
 * @member CKEDITOR
 */
CKEDITOR.POSITION_PRECEDING = 4;

/**
 * Indicates that the context node is a descendant of the other node. See {@link CKEDITOR.dom.node#getPosition}.
 *
 * @readonly
 * @property {Number} [=8]
 * @member CKEDITOR
 */
CKEDITOR.POSITION_IS_CONTAINED = 8;

/**
 * Indicates that the context node contains the other node. See {@link CKEDITOR.dom.node#getPosition}.
 *
 * @readonly
 * @property {Number} [=16]
 * @member CKEDITOR
 */
CKEDITOR.POSITION_CONTAINS = 16;

CKEDITOR.tools.extend( CKEDITOR.dom.node.prototype, {
	/**
	 * Makes this node a child of another element.
	 *
	 *		var p = new CKEDITOR.dom.element( 'p' );
	 *		var strong = new CKEDITOR.dom.element( 'strong' );
	 *		strong.appendTo( p );
	 *
	 *		// Result: '<p><strong></strong></p>'.
	 *
	 * @param {CKEDITOR.dom.element} element The target element to which this node will be appended.
	 * @returns {CKEDITOR.dom.element} The target element.
	 */
	appendTo: function( element, toStart ) {
		element.append( this, toStart );
		return element;
	},

	/**
	 * Clones this node.
	 *
	 * **Note**: Values set by {#setCustomData} will not be available in the clone.
	 *
	 * @param {Boolean} [includeChildren=false] If `true` then all node's
	 * children will be cloned recursively.
	 * @param {Boolean} [cloneId=false] Whether ID attributes should be cloned, too.
	 * @returns {CKEDITOR.dom.node} Clone of this node.
	 */
	clone: function( includeChildren, cloneId ) {
		var $clone = this.$.cloneNode( includeChildren );

		// The "id" attribute should never be cloned to avoid duplication.
		removeIds( $clone );

		var node = new CKEDITOR.dom.node( $clone );

		// On IE8 we need to fixed HTML5 node name, see details below.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 &&
			( this.type == CKEDITOR.NODE_ELEMENT || this.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT ) ) {
			renameNodes( node );
		}

		return node;

		function removeIds( node ) {
			// Reset data-cke-expando only when has been cloned (IE and only for some types of objects).
			if ( node[ 'data-cke-expando' ] )
				node[ 'data-cke-expando' ] = false;

			if ( node.nodeType != CKEDITOR.NODE_ELEMENT && node.nodeType != CKEDITOR.NODE_DOCUMENT_FRAGMENT  )
				return;

			if ( !cloneId && node.nodeType == CKEDITOR.NODE_ELEMENT )
				node.removeAttribute( 'id', false );

			if ( includeChildren ) {
				var childs = node.childNodes;
				for ( var i = 0; i < childs.length; i++ )
					removeIds( childs[ i ] );
			}
		}

		// IE8 rename HTML5 nodes by adding `:` at the begging of the tag name when the node is cloned,
		// so `<figure>` will be `<:figure>` after 'cloneNode'. We need to fix it (https://dev.ckeditor.com/ticket/13101).
		function renameNodes( node ) {
			if ( node.type != CKEDITOR.NODE_ELEMENT && node.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT )
				return;

			if ( node.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT ) {
				var name = node.getName();
				if ( name[ 0 ] == ':' ) {
					node.renameNode( name.substring( 1 ) );
				}
			}

			if ( includeChildren ) {
				for ( var i = 0; i < node.getChildCount(); i++ )
					renameNodes( node.getChild( i ) );
			}
		}
	},

	/**
	 * Checks if the node is preceded by any sibling.
	 *
	 * @returns {Boolean}
	 */
	hasPrevious: function() {
		return !!this.$.previousSibling;
	},

	/**
	 * Checks if the node is succeeded by any sibling.
	 *
	 * @returns {Boolean}
	 */
	hasNext: function() {
		return !!this.$.nextSibling;
	},

	/**
	 * Inserts this element after a node.
	 *
	 *		var em = new CKEDITOR.dom.element( 'em' );
	 *		var strong = new CKEDITOR.dom.element( 'strong' );
	 *		strong.insertAfter( em );
	 *
	 *		// Result: '<em></em><strong></strong>'
	 *
	 * @param {CKEDITOR.dom.node} node The node that will precede this element.
	 * @returns {CKEDITOR.dom.node} The node preceding this one after insertion.
	 */
	insertAfter: function( node ) {
		node.$.parentNode.insertBefore( this.$, node.$.nextSibling );
		return node;
	},

	/**
	 * Inserts this element before a node.
	 *
	 *		var em = new CKEDITOR.dom.element( 'em' );
	 *		var strong = new CKEDITOR.dom.element( 'strong' );
	 *		strong.insertBefore( em );
	 *
	 *		// result: '<strong></strong><em></em>'
	 *
	 * @param {CKEDITOR.dom.node} node The node that will succeed this element.
	 * @returns {CKEDITOR.dom.node} The node being inserted.
	 */
	insertBefore: function( node ) {
		node.$.parentNode.insertBefore( this.$, node.$ );
		return node;
	},

	/**
	 * Inserts a node before this node.
	 *
	 *		var em = new CKEDITOR.dom.element( 'em' );
	 *		var strong = new CKEDITOR.dom.element( 'strong' );
	 *		strong.insertBeforeMe( em );
	 *
	 *		// result: '<em></em><strong></strong>'
	 *
	 * @param {CKEDITOR.dom.node} node The node that will preceed this element.
	 * @returns {CKEDITOR.dom.node} The node being inserted.
	 */
	insertBeforeMe: function( node ) {
		this.$.parentNode.insertBefore( node.$, this.$ );
		return node;
	},

	/**
	 * Retrieves a uniquely identifiable tree address for this node.
	 * The tree address returned is an array of integers, with each integer
	 * indicating a child index of a DOM node, starting from
	 * `document.documentElement`.
	 *
	 * For example, assuming `<body>` is the second child
	 * of `<html>` (`<head>` being the first),
	 * and we would like to address the third child under the
	 * fourth child of `<body>`, the tree address returned would be:
	 * `[1, 3, 2]`.
	 *
	 * The tree address cannot be used for finding back the DOM tree node once
	 * the DOM tree structure has been modified.
	 *
	 * @param {Boolean} [normalized=false] See {@link #getIndex}.
	 * @returns {Array} The address.
	 */
	getAddress: function( normalized ) {
		var address = [];
		var $documentElement = this.getDocument().$.documentElement;
		var node = this;

		while ( node && node != $documentElement ) {
			var parentNode = node.getParent();

			if ( parentNode ) {
				// Get the node index. For performance, call getIndex
				// directly, instead of creating a new node object.
				address.unshift( this.getIndex.call( node, normalized ) );
			}

			node = parentNode;
		}

		return address;
	},

	/**
	 * Gets the document containing this element.
	 *
	 *		var element = CKEDITOR.document.getById( 'example' );
	 *		alert( element.getDocument().equals( CKEDITOR.document ) ); // true
	 *
	 * @returns {CKEDITOR.dom.document} The document.
	 */
	getDocument: function() {
		return new CKEDITOR.dom.document( this.$.ownerDocument || this.$.parentNode.ownerDocument );
	},

	/**
	 * Gets the index of a node in an array of its `parent.childNodes`.
	 * Returns `-1` if a node does not have a parent or when the `normalized` argument is set to `true`
	 * and the text node is empty and will be removed during the normalization.
	 *
	 * Let us assume having the following `childNodes` array:
	 *
	 *		[ emptyText, element1, text, text, element2, emptyText2 ]
	 *
	 *		emptyText.getIndex()			// 0
	 *		emptyText.getIndex( true )		// -1
	 *		element1.getIndex();			// 1
	 *		element1.getIndex( true );		// 0
	 *		element2.getIndex();			// 4
	 *		element2.getIndex( true );		// 2
	 *		emptyText2.getIndex();			// 5
	 *		emptyText2.getIndex( true );	// -1
	 *
	 * @param {Boolean} normalized When `true`, adjacent text nodes are merged and empty text nodes are removed.
	 * @returns {Number} Index of a node or `-1` if a node does not have a parent or is removed during the normalization.
	 */
	getIndex: function( normalized ) {
		// Attention: getAddress depends on this.$
		// getIndex is called on a plain object: { $ : node }

		var current = this,
			index = -1,
			isNormalizing;

		if ( !this.getParent() )
			return -1;

		// The idea is - all empty text nodes will be virtually merged into their adjacent text nodes.
		// If an empty text node does not have an adjacent non-empty text node we can return -1 straight away,
		// because it and all its sibling text nodes will be merged into an empty text node and then totally ignored.
		if ( normalized && current.type == CKEDITOR.NODE_TEXT && current.isEmpty() ) {
			var adjacent = getAdjacentNonEmptyTextNode( current ) || getAdjacentNonEmptyTextNode( current, true );

			if ( !adjacent )
				return -1;
		}

		do {
			// Bypass blank node and adjacent text nodes.
			if ( normalized && !current.equals( this ) && current.type == CKEDITOR.NODE_TEXT && ( isNormalizing || current.isEmpty() ) ) {
				continue;
			}

			index++;
			isNormalizing = current.type == CKEDITOR.NODE_TEXT;
		}
		while ( ( current = current.getPrevious() ) );

		return index;

		function getAdjacentNonEmptyTextNode( node, lookForward ) {
			var sibling = lookForward ? node.getNext() : node.getPrevious();

			if ( !sibling || sibling.type != CKEDITOR.NODE_TEXT ) {
				return null;
			}

			// If found a non-empty text node, then return it.
			// If not, then continue search.
			return sibling.isEmpty() ? getAdjacentNonEmptyTextNode( sibling, lookForward ) : sibling;
		}
	},

	/**
	 * @todo
	 */
	getNextSourceNode: function( startFromSibling, nodeType, guard ) {
		// If "guard" is a node, transform it in a function.
		if ( guard && !guard.call ) {
			var guardNode = guard;
			guard = function( node ) {
				return !node.equals( guardNode );
			};
		}

		var node = ( !startFromSibling && this.getFirst && this.getFirst() ),
			parent;

		// Guarding when we're skipping the current element( no children or 'startFromSibling' ).
		// send the 'moving out' signal even we don't actually dive into.
		if ( !node ) {
			if ( this.type == CKEDITOR.NODE_ELEMENT && guard && guard( this, true ) === false )
				return null;
			node = this.getNext();
		}

		while ( !node && ( parent = ( parent || this ).getParent() ) ) {
			// The guard check sends the "true" paramenter to indicate that
			// we are moving "out" of the element.
			if ( guard && guard( parent, true ) === false )
				return null;

			node = parent.getNext();
		}

		if ( !node )
			return null;

		if ( guard && guard( node ) === false )
			return null;

		if ( nodeType && nodeType != node.type )
			return node.getNextSourceNode( false, nodeType, guard );

		return node;
	},

	/**
	 * @todo
	 */
	getPreviousSourceNode: function( startFromSibling, nodeType, guard ) {
		if ( guard && !guard.call ) {
			var guardNode = guard;
			guard = function( node ) {
				return !node.equals( guardNode );
			};
		}

		var node = ( !startFromSibling && this.getLast && this.getLast() ),
			parent;

		// Guarding when we're skipping the current element( no children or 'startFromSibling' ).
		// send the 'moving out' signal even we don't actually dive into.
		if ( !node ) {
			if ( this.type == CKEDITOR.NODE_ELEMENT && guard && guard( this, true ) === false )
				return null;
			node = this.getPrevious();
		}

		while ( !node && ( parent = ( parent || this ).getParent() ) ) {
			// The guard check sends the "true" paramenter to indicate that
			// we are moving "out" of the element.
			if ( guard && guard( parent, true ) === false )
				return null;

			node = parent.getPrevious();
		}

		if ( !node )
			return null;

		if ( guard && guard( node ) === false )
			return null;

		if ( nodeType && node.type != nodeType )
			return node.getPreviousSourceNode( false, nodeType, guard );

		return node;
	},

	/**
	 * Gets the node that preceeds this element in its parent's child list.
	 *
	 *		var element = CKEDITOR.dom.element.createFromHtml( '<div><i>prev</i><b>Example</b></div>' );
	 *		var first = element.getLast().getPrev();
	 *		alert( first.getName() ); // 'i'
	 *
	 * @param {Function} [evaluator] Filtering the result node.
	 * @returns {CKEDITOR.dom.node} The previous node or null if not available.
	 */
	getPrevious: function( evaluator ) {
		var previous = this.$,
			retval;
		do {
			previous = previous.previousSibling;

			// Avoid returning the doc type node.
			// http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-412266927
			retval = previous && previous.nodeType != 10 && new CKEDITOR.dom.node( previous );
		}
		while ( retval && evaluator && !evaluator( retval ) );
		return retval;
	},

	/**
	 * Gets the node that follows this element in its parent's child list.
	 *
	 *		var element = CKEDITOR.dom.element.createFromHtml( '<div><b>Example</b><i>next</i></div>' );
	 *		var last = element.getFirst().getNext();
	 *		alert( last.getName() ); // 'i'
	 *
	 * @param {Function} [evaluator] Filtering the result node.
	 * @returns {CKEDITOR.dom.node} The next node or null if not available.
	 */
	getNext: function( evaluator ) {
		var next = this.$,
			retval;
		do {
			next = next.nextSibling;
			retval = next && new CKEDITOR.dom.node( next );
		}
		while ( retval && evaluator && !evaluator( retval ) );
		return retval;
	},

	/**
	 * Gets the parent element for this node.
	 *
	 *		var node = editor.document.getBody().getFirst();
	 *		var parent = node.getParent();
	 *		alert( parent.getName() ); // 'body'
	 *
	 * @param {Boolean} [allowFragmentParent=false] Consider also parent node that is of
	 * fragment type {@link CKEDITOR#NODE_DOCUMENT_FRAGMENT}.
	 * @returns {CKEDITOR.dom.element} The parent element.
	 */
	getParent: function( allowFragmentParent ) {
		var parent = this.$.parentNode;
		return ( parent && ( parent.nodeType == CKEDITOR.NODE_ELEMENT || allowFragmentParent && parent.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ) ) ? new CKEDITOR.dom.node( parent ) : null;
	},

	/**
	 * Returns an array containing node parents and the node itself. By default nodes are in _descending_ order.
	 *
	 *		// Assuming that body has paragraph as the first child.
	 *		var node = editor.document.getBody().getFirst();
	 *		var parents = node.getParents();
	 *		alert( parents[ 0 ].getName() + ',' + parents[ 2 ].getName() ); // 'html,p'
	 *
	 * @param {Boolean} [closerFirst=false] Determines the order of returned nodes.
	 * @returns {Array} Returns an array of {@link CKEDITOR.dom.node}.
	 */
	getParents: function( closerFirst ) {
		var node = this;
		var parents = [];

		do {
			parents[ closerFirst ? 'push' : 'unshift' ]( node );
		}
		while ( ( node = node.getParent() ) );

		return parents;
	},

	/**
	 * @todo
	 */
	getCommonAncestor: function( node ) {
		if ( node.equals( this ) )
			return this;

		if ( node.contains && node.contains( this ) )
			return node;

		var start = this.contains ? this : this.getParent();

		do {
			if ( start.contains( node ) ) return start;
		}
		while ( ( start = start.getParent() ) );

		return null;
	},

	/**
	 * Determines the position relation between this node and the given {@link CKEDITOR.dom.node} in the document.
	 * This node can be preceding ({@link CKEDITOR#POSITION_PRECEDING}) or following ({@link CKEDITOR#POSITION_FOLLOWING})
	 * the given node. This node can also contain ({@link CKEDITOR#POSITION_CONTAINS}) or be contained by
	 * ({@link CKEDITOR#POSITION_IS_CONTAINED}) the given node. The function returns a bitmask of constants
	 * listed above or {@link CKEDITOR#POSITION_IDENTICAL} if the given node is the same as this node.
	 *
	 * @param {CKEDITOR.dom.node} otherNode A node to check relation with.
	 * @returns {Number} Position relation between this node and given node.
	 */
	getPosition: function( otherNode ) {
		var $ = this.$;
		var $other = otherNode.$;

		if ( $.compareDocumentPosition )
			return $.compareDocumentPosition( $other );

		// IE and Safari have no support for compareDocumentPosition.

		if ( $ == $other )
			return CKEDITOR.POSITION_IDENTICAL;

		// Only element nodes support contains and sourceIndex.
		if ( this.type == CKEDITOR.NODE_ELEMENT && otherNode.type == CKEDITOR.NODE_ELEMENT ) {
			if ( $.contains ) {
				if ( $.contains( $other ) )
					return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;

				if ( $other.contains( $ ) )
					return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
			}

			if ( 'sourceIndex' in $ )
				return ( $.sourceIndex < 0 || $other.sourceIndex < 0 ) ? CKEDITOR.POSITION_DISCONNECTED : ( $.sourceIndex < $other.sourceIndex ) ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;

		}

		// For nodes that don't support compareDocumentPosition, contains
		// or sourceIndex, their "address" is compared.

		var addressOfThis = this.getAddress(),
			addressOfOther = otherNode.getAddress(),
			minLevel = Math.min( addressOfThis.length, addressOfOther.length );

		// Determinate preceding/following relationship.
		for ( var i = 0; i < minLevel; i++ ) {
			if ( addressOfThis[ i ] != addressOfOther[ i ] ) {
				return addressOfThis[ i ] < addressOfOther[ i ] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
			}
		}

		// Determinate contains/contained relationship.
		return ( addressOfThis.length < addressOfOther.length ) ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
	},

	/**
	 * Gets the closest ancestor node of this node, specified by its name or using an evaluator function.
	 *
	 *		// Suppose we have the following HTML structure:
	 *		// <div id="outer"><div id="inner"><p><b>Some text</b></p></div></div>
	 *		// If node == <b>
	 *		ascendant = node.getAscendant( 'div' );				// ascendant == <div id="inner">
	 *		ascendant = node.getAscendant( 'b' );				// ascendant == null
	 *		ascendant = node.getAscendant( 'b', true );			// ascendant == <b>
	 *		ascendant = node.getAscendant( { div:1, p:1 } );	// Searches for the first 'div' or 'p': ascendant == <div id="inner">
	 *
	 *		// Using custom evaluator:
	 *		ascendant = node.getAscendant( function( el ) {
	 *			return el.getId() == 'inner';
	 *		} );
	 *		// ascendant == <div id="inner">
	 *
	 * @since 3.6.1
	 * @param {String/Function/Object} query The name of the ancestor node to search or
	 * an object with the node names to search for or an evaluator function.
	 * @param {Boolean} [includeSelf] Whether to include the current
	 * node in the search.
	 * @returns {CKEDITOR.dom.node} The located ancestor node or `null` if not found.
	 */
	getAscendant: function( query, includeSelf ) {
		var $ = this.$,
			evaluator,
			isCustomEvaluator;

		if ( !includeSelf ) {
			$ = $.parentNode;
		}

		// Custom checker provided in an argument.
		if ( typeof query == 'function' ) {
			isCustomEvaluator = true;
			evaluator = query;
		} else {
			// Predefined tag name checker.
			isCustomEvaluator = false;
			evaluator = function( $ ) {
				var name = ( typeof $.nodeName == 'string' ? $.nodeName.toLowerCase() : '' );

				return ( typeof query == 'string' ? name == query : name in query );
			};
		}

		while ( $ ) {
			// For user provided checker we use CKEDITOR.dom.node.
			if ( evaluator( isCustomEvaluator ? new CKEDITOR.dom.node( $ ) : $ ) ) {
				return new CKEDITOR.dom.node( $ );
			}

			try {
				$ = $.parentNode;
			} catch ( e ) {
				$ = null;
			}
		}

		return null;
	},

	/**
	 * @todo
	 */
	hasAscendant: function( name, includeSelf ) {
		var $ = this.$;

		if ( !includeSelf )
			$ = $.parentNode;

		while ( $ ) {
			if ( $.nodeName && $.nodeName.toLowerCase() == name )
				return true;

			$ = $.parentNode;
		}
		return false;
	},

	/**
	 * @todo
	 */
	move: function( target, toStart ) {
		target.append( this.remove(), toStart );
	},

	/**
	 * Removes this node from the document DOM.
	 *
	 *		var element = CKEDITOR.document.getById( 'MyElement' );
	 *		element.remove();
	 *
	 * @param {Boolean} [preserveChildren=false] Indicates that the children
	 * elements must remain in the document, removing only the outer tags.
	 */
	remove: function( preserveChildren ) {
		var $ = this.$;
		var parent = $.parentNode;

		if ( parent ) {
			if ( preserveChildren ) {
				// Move all children before the node.
				for ( var child;
				( child = $.firstChild ); ) {
					parent.insertBefore( $.removeChild( child ), $ );
				}
			}

			parent.removeChild( $ );
		}

		return this;
	},

	/**
	 * @todo
	 */
	replace: function( nodeToReplace ) {
		this.insertBefore( nodeToReplace );
		nodeToReplace.remove();
	},

	/**
	 * @todo
	 */
	trim: function() {
		this.ltrim();
		this.rtrim();
	},

	/**
	 * @todo
	 */
	ltrim: function() {
		var child;
		while ( this.getFirst && ( child = this.getFirst() ) ) {
			if ( child.type == CKEDITOR.NODE_TEXT ) {
				var trimmed = CKEDITOR.tools.ltrim( child.getText() ),
					originalLength = child.getLength();

				if ( !trimmed ) {
					child.remove();
					continue;
				} else if ( trimmed.length < originalLength ) {
					child.split( originalLength - trimmed.length );

					// IE BUG: child.remove() may raise JavaScript errors here. (https://dev.ckeditor.com/ticket/81)
					this.$.removeChild( this.$.firstChild );
				}
			}
			break;
		}
	},

	/**
	 * @todo
	 */
	rtrim: function() {
		var child;
		while ( this.getLast && ( child = this.getLast() ) ) {
			if ( child.type == CKEDITOR.NODE_TEXT ) {
				var trimmed = CKEDITOR.tools.rtrim( child.getText() ),
					originalLength = child.getLength();

				if ( !trimmed ) {
					child.remove();
					continue;
				} else if ( trimmed.length < originalLength ) {
					child.split( trimmed.length );

					// IE BUG: child.getNext().remove() may raise JavaScript errors here.
					// (https://dev.ckeditor.com/ticket/81)
					this.$.lastChild.parentNode.removeChild( this.$.lastChild );
				}
			}
			break;
		}

		if ( CKEDITOR.env.needsBrFiller ) {
			child = this.$.lastChild;

			if ( child && child.type == 1 && child.nodeName.toLowerCase() == 'br' ) {
				// Use "eChildNode.parentNode" instead of "node" to avoid IE bug (https://dev.ckeditor.com/ticket/324).
				child.parentNode.removeChild( child );
			}
		}
	},

	/**
	 * Checks if this node is read-only (should not be changed).
	 *
	 *		// For the following HTML:
	 *		// <b>foo</b><div contenteditable="false"><i>bar</i></div>
	 *
	 *		elB.isReadOnly(); // -> false
	 *		foo.isReadOnly(); // -> false
	 *		elDiv.isReadOnly(); // -> true
	 *		elI.isReadOnly(); // -> true
	 *
	 * This method works in two modes depending on browser support for the `element.isContentEditable` property and
	 * the value of the `checkOnlyAttributes` parameter. The `element.isContentEditable` check is faster, but it is known
	 * to malfunction in hidden or detached nodes. Additionally, when processing some detached DOM tree you may want to imitate
	 * that this happens inside an editable container (like it would happen inside the {@link CKEDITOR.editable}). To do so,
	 * you can temporarily attach this tree to an element with the `data-cke-editable` attribute and use the
	 * `checkOnlyAttributes` mode.
	 *
	 * @since 3.5.0
	 * @param {Boolean} [checkOnlyAttributes=false] If `true`, only attributes will be checked, native methods will not
	 * be used. This parameter needs to be `true` to check hidden or detached elements. Introduced in 4.5.0.
	 * @returns {Boolean}
	 */
	isReadOnly: function( checkOnlyAttributes ) {
		var element = this;
		if ( this.type != CKEDITOR.NODE_ELEMENT )
			element = this.getParent();

		// Prevent Edge crash (https://dev.ckeditor.com/ticket/13609, https://dev.ckeditor.com/ticket/13919).
		if ( CKEDITOR.env.edge && element && element.is( 'textarea', 'input' ) ) {
			checkOnlyAttributes = true;
		}

		if ( !checkOnlyAttributes && element && typeof element.$.isContentEditable != 'undefined' ) {
			return !( element.$.isContentEditable || element.data( 'cke-editable' ) );
		}
		else {
			// Degrade for old browsers which don't support "isContentEditable", e.g. FF3

			while ( element ) {
				if ( element.data( 'cke-editable' ) ) {
					return false;
				} else if ( element.hasAttribute( 'contenteditable' ) ) {
					return element.getAttribute( 'contenteditable' ) == 'false';
				}

				element = element.getParent();
			}

			// Reached the root of DOM tree, no editable found.
			return true;
		}
	}
} );
