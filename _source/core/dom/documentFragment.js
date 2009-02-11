/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dom.documentFragment = function( ownerDocument ) {
	this.$ = CKEDITOR.env.ie ? ownerDocument.$.createElement( 'div' ) : ownerDocument.$.createDocumentFragment();
};

(function() {
	var elementPrototype = CKEDITOR.dom.element.prototype;

	CKEDITOR.dom.documentFragment.prototype = {
		type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,

		append: elementPrototype.append,

		getFirst: elementPrototype.getFirst,

		getLast: elementPrototype.getLast,

		appendTo: function( targetElement ) {
			if ( CKEDITOR.env.ie )
				elementPrototype.moveChildren.call( this, targetElement );
			else
				targetElement.$.appendChild( this.$ );
		},

		moveChildren: elementPrototype.moveChildren,

		insertAfterNode: function( node ) {
			var $ = this.$;
			var $node = node.$;
			var $parent = $node.parentNode;

			if ( CKEDITOR.env.ie ) {
				for ( var child; child = $.lastChild; )
					$parent.insertBefore( $.removeChild( child ), $node.nextSibling );
			} else
				$parent.insertBefore( $, $node.nextSibling );
		},

		replace: function( nodeToReplace ) {
			this.insertAfterNode( nodeToReplace );
			nodeToReplace.remove();
		},

		trim: elementPrototype.trim,
		ltrim: elementPrototype.ltrim,
		rtrim: elementPrototype.rtrim,
		getFirst: elementPrototype.getFirst,
		getLast: elementPrototype.getLast,
		getDocument: elementPrototype.getDocument,
		getChildCount: elementPrototype.getChildCount,
		getChild: elementPrototype.getChild,
		contains: elementPrototype.contains
	};
})();
