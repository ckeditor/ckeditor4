/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * Represents a list of {@link CKEDITOR.dom.node} objects.
 * It is a wrapper for a native nodes list.
 *
 *		var nodeList = CKEDITOR.document.getBody().getChildren();
 *		alert( nodeList.count() ); // number [0;N]
 *
 * @class
 * @constructor Creates a document class instance.
 * @param {Object} nativeList
 */
CKEDITOR.dom.nodeList = function( nativeList ) {
	this.$ = nativeList;
};

CKEDITOR.dom.nodeList.prototype = {
	/**
	 * Gets the count of nodes in this list.
	 *
	 * @returns {Number}
	 */
	count: function() {
		return this.$.length;
	},

	/**
	 * Gets the node from the list.
	 *
	 * @returns {CKEDITOR.dom.node}
	 */
	getItem: function( index ) {
		if ( index < 0 || index >= this.$.length )
			return null;

		var $node = this.$[ index ];
		return $node ? new CKEDITOR.dom.node( $node ) : null;
	},

	/**
	 * Returns a node list as an array.
	 *
	 * @returns {CKEDITOR.dom.node[]}
	 */
	toArray: function() {
		return CKEDITOR.tools.array.map( this.$, function( nativeEl ) {
			return new CKEDITOR.dom.node( nativeEl );
		} );
	}
};
