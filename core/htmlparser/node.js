/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

(function() {
	/**
	 * A lightweight representation of HTML node.
	 *
	 * @since 4.1
	 * @class
	 * @constructor Creates a node class instance.
	 */
	CKEDITOR.htmlParser.node = function() {};

	CKEDITOR.htmlParser.node.prototype = {
		/**
		 * Remove this node from a tree.
		 *
		 * @since 4.1
		 */
		remove: function() {
			var children = this.parent.children,
				index = CKEDITOR.tools.indexOf( children, this ),
				previous = this.previous,
				next = this.next;

			previous && ( previous.next = next );
			next && ( next.previous = previous );
			children.splice( index, 1 );
			this.parent = null;
		},

		/**
		 * Replace this node with given one.
		 *
		 * @since 4.1
		 * @param {CKEDITOR.htmlParser.node} node The node that will replace this one.
		 */
		replaceWith: function( node ) {
			var children = this.parent.children,
				index = CKEDITOR.tools.indexOf( children, this ),
				previous = node.previous = this.previous,
				next = node.next = this.next;

			previous && ( previous.next = node );
			next && ( next.previous = node );

			children[ index ] = node;

			node.parent = this.parent;
			this.parent = null;
		},

		/**
		 * Insert this node after given one.
		 *
		 * @since 4.1
		 * @param {CKEDITOR.htmlParser.node} node The node that will precede this element.
		 */
		insertAfter: function( node ) {
			var children = node.parent.children,
				index = CKEDITOR.tools.indexOf( children, node ),
				next = node.next;

			children.splice( index + 1, 0, this );

			this.next = node.next;
			this.previous = node;
			node.next = this;
			next && ( next.previous = this );

			this.parent = node.parent;
		},

		/**
		 * Insert this node before given one.
		 *
		 * @since 4.1
		 * @param {CKEDITOR.htmlParser.node} node The node that will follow this element.
		 */
		insertBefore: function( node ) {
			var children = node.parent.children,
				index = CKEDITOR.tools.indexOf( children, node );

			children.splice( index, 0, this );

			this.next = node;
			this.previous = node.previous;
			node.previous && ( node.previous.next = this );
			node.previous = this;

			this.parent = node.parent;
		}
	};
})();
