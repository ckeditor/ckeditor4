/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

(function() {
	/**
	 * A lightweight representation of HTML node.
	 *
	 * @class
	 * @constructor Creates a node class instance.
	 */
	CKEDITOR.htmlParser.node = function() {};

	CKEDITOR.htmlParser.node.prototype = {
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
		}
	};
})();
