/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * DocumentFragment is a "lightweight" or "minimal" Document object. It is
 * commonly used to extract a portion of a document's tree or to create a new
 * fragment of a document. Various operations may take document fragment objects
 * as arguments and result in all the child nodes of the document fragment being
 * moved to the child list of this node.
 *
 * @class
 * @constructor Creates a document fragment class instance.
 * @param {CKEDITOR.dom.document/DocumentFragment} [nodeOrDoc=CKEDITOR.document]
 */
CKEDITOR.dom.documentFragment = function( nodeOrDoc ) {
	nodeOrDoc = nodeOrDoc || CKEDITOR.document;

	if ( nodeOrDoc.type == CKEDITOR.NODE_DOCUMENT )
		this.$ = nodeOrDoc.$.createDocumentFragment();
	else
		this.$ = nodeOrDoc;
};

CKEDITOR.tools.extend( CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
	/**
	 * The node type. This is a constant value set to {@link CKEDITOR#NODE_DOCUMENT_FRAGMENT}.
	 *
	 * @readonly
	 * @property {Number} [=CKEDITOR.NODE_DOCUMENT_FRAGMENT]
	 */
	type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,

	/**
	 * Inserts the document fragment content after the specified node.
	 *
	 * @param {CKEDITOR.dom.node} node
	 */
	insertAfterNode: function( node ) {
		node = node.$;
		node.parentNode.insertBefore( this.$, node.nextSibling );
	},

	/**
	 * Gets HTML of this document fragment's children.
	 *
	 * @since 4.5
	 * @returns {String} The HTML of this document fragment's children.
	 */
	getHtml: function() {
		var container = new CKEDITOR.dom.element( 'div' );

		this.clone( 1, 1 ).appendTo( container );

		return container.getHtml().replace( /\s*data-cke-expando=".*?"/g, '' );
	}
}, true, {
	'append': 1, 'appendBogus': 1, 'clone': 1, 'getFirst': 1, 'getHtml': 1, 'getLast': 1, 'getParent': 1, 'getNext': 1, 'getPrevious': 1,
	'appendTo': 1, 'moveChildren': 1, 'insertBefore': 1, 'insertAfterNode': 1, 'replace': 1, 'trim': 1, 'type': 1,
	'ltrim': 1, 'rtrim': 1, 'getDocument': 1, 'getChildCount': 1, 'getChild': 1, 'getChildren': 1
} );
