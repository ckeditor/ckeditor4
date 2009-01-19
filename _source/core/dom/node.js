/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.dom.node} class, which is the base
 *		class for classes that represent DOM nodes.
 */

/**
 * Base class for classes representing DOM nodes. This constructor may return
 * and instance of classes that inherits this class, like
 * {@link CKEDITOR.dom.element} or {@link CKEDITOR.dom.text}.
 * @augments CKEDITOR.dom.domObject
 * @param {Object} domNode A native DOM node.
 * @constructor
 * @see CKEDITOR.dom.element
 * @see CKEDITOR.dom.text
 * @example
 */
CKEDITOR.dom.node = function( domNode ) {
	if ( domNode ) {
		switch ( domNode.nodeType ) {
			case CKEDITOR.NODE_ELEMENT:
				return new CKEDITOR.dom.element( domNode );

			case CKEDITOR.NODE_TEXT:
				return new CKEDITOR.dom.text( domNode );
		}

		// Call the base constructor.
		CKEDITOR.dom.domObject.call( this, domNode );
	}

	return this;
};

CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject();

/**
 * Element node type.
 * @constant
 * @example
 */
CKEDITOR.NODE_ELEMENT = 1;

/**
 * Text node type.
 * @constant
 * @example
 */
CKEDITOR.NODE_TEXT = 3;

/**
 * Comment node type.
 * @constant
 * @example
 */
CKEDITOR.NODE_COMMENT = 8;

CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11;

CKEDITOR.POSITION_IDENTICAL = 0;
CKEDITOR.POSITION_DISCONNECTED = 1;
CKEDITOR.POSITION_FOLLOWING = 2;
CKEDITOR.POSITION_PRECEDING = 4;
CKEDITOR.POSITION_IS_CONTAINED = 8;
CKEDITOR.POSITION_CONTAINS = 16;

CKEDITOR.tools.extend( CKEDITOR.dom.node.prototype,
/** @lends CKEDITOR.dom.node.prototype */ {
	/**
	 * Makes this node child of another element.
	 * @param {CKEDITOR.dom.element} element The target element to which append
	 *		this node.
	 * @returns {CKEDITOR.dom.element} The target element.
	 * @example
	 * var p = new CKEDITOR.dom.element( 'p' );
	 * var strong = new CKEDITOR.dom.element( 'strong' );
	 * strong.appendTo( p );
	 *
	 * // result: "&lt;p&gt;&lt;strong&gt;&lt;/strong&gt;&lt;/p&gt;"
	 */
	appendTo: function( element, toStart ) {
		element.append( this, toStart );
		return element;
	},

	clone: function( includeChildren ) {
		return new CKEDITOR.dom.node( this.$.cloneNode( includeChildren ) );
	},

	hasPrevious: function() {
		return !!this.$.previousSibling;
	},

	hasNext: function() {
		return !!this.$.nextSibling;
	},

	/**
	 * Inserts this element after a node.
	 * @param {CKEDITOR.dom.node} node The that will preceed this element.
	 * @returns {CKEDITOR.dom.node} The node preceeding this one after
	 *		insertion.
	 * @example
	 * var em = new CKEDITOR.dom.element( 'em' );
	 * var strong = new CKEDITOR.dom.element( 'strong' );
	 * strong.insertAfter( em );
	 *
	 * // result: "&lt;em&gt;&lt;/em&gt;&lt;strong&gt;&lt;/strong&gt;"
	 */
	insertAfter: function( node ) {
		node.$.parentNode.insertBefore( this.$, node.$.nextSibling );
		return node;
	},

	/**
	 * Inserts this element before a node.
	 * @param {CKEDITOR.dom.node} node The that will be after this element.
	 * @returns {CKEDITOR.dom.node} The node being inserted.
	 * @example
	 * var em = new CKEDITOR.dom.element( 'em' );
	 * var strong = new CKEDITOR.dom.element( 'strong' );
	 * strong.insertBefore( em );
	 *
	 * // result: "&lt;strong&gt;&lt;/strong&gt;&lt;em&gt;&lt;/em&gt;"
	 */
	insertBefore: function( node ) {
		node.$.parentNode.insertBefore( this.$, node.$ );
		return node;
	},

	insertBeforeMe: function( node ) {
		this.$.parentNode.insertBefore( node.$, this.$ );
		return node;
	},

	/**
	 * Gets a DOM tree descendant under the current node.
	 * @param {Array|Number} indices The child index or array of child indices under the node.
	 * @returns {CKEDITOR.dom.node} The specified DOM child under the current node. Null if child does not exist.
	 * @example
	 * var strong = p.getChild(0);
	 */
	getChild: function( indices ) {
		var rawNode = this.$;

		if ( !indices.slice )
			rawNode = rawNode.childNodes[ indices ];
		else {
			while ( indices.length > 0 && rawNode )
				rawNode = rawNode.childNodes[ indices.shift() ];
		}

		return rawNode ? new CKEDITOR.dom.node( rawNode ) : null;
	},

	getChildCount: function() {
		return this.$.childNodes.length;
	},

	/**
	 * Gets the document containing this element.
	 * @returns {CKEDITOR.dom.document} The document.
	 * @example
	 * var element = CKEDITOR.document.getById( 'example' );
	 * alert( <b>element.getDocument().equals( CKEDITOR.document )</b> );  // "true"
	 */
	getDocument: function() {
		var document = new CKEDITOR.dom.document( this.$.ownerDocument || this.$.parentNode.ownerDocument );

		return (
		/** @ignore */
		this.getDocument = function() {
			return document;
		})();
	},

	getIndex: function() {
		var $ = this.$;

		var currentNode = $.parentNode && $.parentNode.firstChild;
		var currentIndex = -1;

		while ( currentNode ) {
			currentIndex++;

			if ( currentNode == $ )
				return currentIndex;

			currentNode = currentNode.nextSibling;
		}

		return -1;
	},

	/**
	 * Gets the node following this node (next sibling).
	 * @returns {CKEDITOR.dom.node} The next node.
	 */
	getNext: function() {
		var next = this.$.nextSibling;
		return next ? new CKEDITOR.dom.node( next ) : null;
	},

	getNextSourceNode: function( startFromSibling, nodeType ) {
		var $ = this.$;

		var node = ( !startFromSibling && $.firstChild ) ? $.firstChild : $.nextSibling;

		var parent;

		while ( !node && ( parent = ( parent || $ ).parentNode ) )
			node = parent.nextSibling;

		if ( !node )
			return null;

		if ( nodeType && nodeType != node.nodeType )
			return arguments.callee.call({ $: node }, false, nodeType );

		return new CKEDITOR.dom.node( node );
	},

	getPreviousSourceNode: function( startFromSibling, nodeType ) {
		var $ = startFromSibling ? this.$.previousSibling : this.$,
			node = null;

		if ( !$ )
			return null;

		if ( ( node = $.previousSibling ) ) {
			while ( node.lastChild )
				node = node.lastChild;
		} else
			node = $.parentNode;

		if ( !node )
			return null;

		if ( nodeType && node.nodeType != nodeType )
			return arguments.callee.apply({ $: node }, false, nodeType );

		return new CKEDITOR.dom.node( node );
	},

	getPrevious: function() {
		var previous = this.$.previousSibling;
		return previous ? new CKEDITOR.dom.node( previous ) : null;
	},

	/**
	 * Gets the parent element for this node.
	 * @returns {CKEDITOR.dom.element} The parent element.
	 * @example
	 * var node = editor.document.getBody().getFirst();
	 * var parent = node.<b>getParent()</b>;
	 * alert( node.getName() );  // "body"
	 */
	getParent: function() {
		var parent = this.$.parentNode;
		return ( parent && parent.nodeType == 1 ) ? new CKEDITOR.dom.node( parent ) : null;
	},

	getParents: function() {
		var node = this;
		var parents = [];

		do {
			parents.unshift( node );
		}
		while ( ( node = node.getParent() ) )

		return parents;
	},

	getPosition: function( otherNode ) {
		var $ = this.$;
		var $other = otherNode.$;

		if ( $.compareDocumentPosition )
			return $.compareDocumentPosition( $other );

		// IE and Safari have no support for compareDocumentPosition.

		if ( $ == $other )
			return CKEDITOR.POSITION_IDENTICAL;

		// Handle non element nodes (don't support contains nor sourceIndex).
		if ( this.type != CKEDITOR.NODE_ELEMENT || otherNode.type != CKEDITOR.NODE_ELEMENT ) {
			if ( $.parentNode == $other )
				return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
			else if ( $other.parentNode == $ )
				return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
			else if ( $.parentNode == $other.parentNode )
				return this.getIndex() < otherNode.getIndex() ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
			else {
				$ = $.parentNode;
				$other = $other.parentNode;
			}
		}

		if ( $.contains( $other ) )
			return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;

		if ( $other.contains( $ ) )
			return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;

		if ( 'sourceIndex' in $ ) {
			return ( $.sourceIndex < 0 || $other.sourceIndex < 0 ) ? CKEDITOR.POSITION_DISCONNECTED : ( $.sourceIndex < $other.sourceIndex ) ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
		}

		// WebKit has no support for sourceIndex.

		var doc = this.getDocument().$;

		var range1 = doc.createRange();
		var range2 = doc.createRange();

		range1.selectNode( $ );
		range2.selectNode( $other );

		return range1.compareBoundaryPoints( 1, range2 ) > 0 ? CKEDITOR.POSITION_FOLLOWING : CKEDITOR.POSITION_PRECEDING;
	},

	/**
	 * Gets the closes ancestor node of a specified node name.
	 * @param {String} name Node name of ancestor node.
	 * @param {Boolean} includeSelf (Optional) Whether to include the current
	 * node in the calculation or not.
	 * @returns {CKEDITOR.dom.node} Ancestor node.
	 */
	getAscendant: function( name, includeSelf ) {
		var node = this.$;
		if ( includeSelf && node.nodeName.toLowerCase() == name )
			return this;
		while ( ( node = node.parentNode ) ) {
			if ( node.nodeName && node.nodeName.toLowerCase() == name )
				return new CKEDITOR.dom.node( node );
		}
		return null;
	},

	move: function( target, toStart ) {
		target.append( this.remove(), toStart );
	},

	/**
	 * Removes this node from the document DOM.
	 * @param {Boolean} [preserveChildren] Indicates that the children
	 *		elements must remain in the document, removing only the outer
	 *		tags.
	 * @example
	 * var element = CKEDITOR.dom.element.getById( 'MyElement' );
	 * <b>element.remove()</b>;
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
	}
});
