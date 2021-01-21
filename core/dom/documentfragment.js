/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * DocumentFragment is a "lightweight" or "minimal" Document object. It is
 * commonly used to extract a portion of the document's tree or to create a new
 * fragment of the document. Various operations may take document fragment objects
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
	 * Gets the HTML of this document fragment's children.
	 *
	 * @since 4.5.0
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

CKEDITOR.tools.extend( CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.document.prototype, true, {
	'find': 1, 'findOne': 1
} );

/**
 * @member CKEDITOR.dom.documentFragment
 * @method append
 * @inheritdoc CKEDITOR.dom.element#append
*/

/**
 * @member CKEDITOR.dom.documentFragment
 * @method appendBogus
 * @inheritdoc CKEDITOR.dom.element#appendBogus
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method clone
 * @inheritdoc CKEDITOR.dom.element#clone
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getFirst
 * @inheritdoc CKEDITOR.dom.element#getFirst
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getLast
 * @inheritdoc CKEDITOR.dom.element#getLast
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getParent
 * @inheritdoc CKEDITOR.dom.element#getParent
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getNext
 * @inheritdoc CKEDITOR.dom.element#getNext
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getPrevious
 * @inheritdoc CKEDITOR.dom.element#getPrevious
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method appendTo
 * @inheritdoc CKEDITOR.dom.element#appendTo
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method moveChildren
 * @inheritdoc CKEDITOR.dom.element#moveChildren
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method insertBefore
 * @inheritdoc CKEDITOR.dom.element#insertBefore
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method replace
 * @inheritdoc CKEDITOR.dom.element#replace
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method trim
 * @inheritdoc CKEDITOR.dom.element#trim
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method ltrim
 * @inheritdoc CKEDITOR.dom.element#ltrim
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method rtrim
 * @inheritdoc CKEDITOR.dom.element#rtrim
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getDocument
 * @inheritdoc CKEDITOR.dom.element#getDocument
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getChildCount
 * @inheritdoc CKEDITOR.dom.element#getChildCount
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getChild
 * @inheritdoc CKEDITOR.dom.element#getChild
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method getChildren
 * @inheritdoc CKEDITOR.dom.element#getChildren
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method find
 * @since 4.12.0
 * @inheritdoc CKEDITOR.dom.document#find
 */

/**
 * @member CKEDITOR.dom.documentFragment
 * @method findOne
 * @since 4.12.0
 * @inheritdoc CKEDITOR.dom.document#findOne
 */
