/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

 'use strict';

/**
 * A lightweight representation of an HTML comment.
 *
 * @class
 * @constructor Creates a comment class instance.
 * @param {String} value The comment text value.
 */
CKEDITOR.htmlParser.comment = function( value ) {
	/**
	 * The comment text.
	 *
	 * @property {String}
	 */
	this.value = value;

	/** @private */
	this._ = {
		isBlockLike: false
	};
};

CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend( new CKEDITOR.htmlParser.node(), {
	/**
	 * The node type. This is a constant value set to {@link CKEDITOR#NODE_COMMENT}.
	 *
	 * @readonly
	 * @property {Number} [=CKEDITOR.NODE_COMMENT]
	 */
	type: CKEDITOR.NODE_COMMENT,

	filter: function( filter ) {
		var comment = this.value;

		if ( !( comment = filter.onComment( comment, this ) ) ) {
			this.remove();
			return false;
		}

		if ( typeof comment != 'string' ) {
			this.replaceWith( comment );
			return false;
		}

		this.value = comment
	},

	/**
	 * Writes the HTML representation of this comment to a CKEDITOR.htmlWriter.
	 *
	 * @param {CKEDITOR.htmlParser.basicWriter} writer The writer to which write the HTML.
	 */
	writeHtml: function( writer ) {
		writer.comment( this.value );
	}
} );
