/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	/**
	 * A lightweight representation of HTML text.
	 *
	 * @class
	 * @constructor Creates a text class instance.
	 * @param {String} value The text node value.
	 */
	CKEDITOR.htmlParser.text = function( value ) {
		/**
		 * The text value.
		 *
		 * @property {String}
		 */
		this.value = value;

		/** @private */
		this._ = {
			isBlockLike: false
		};
	};

	CKEDITOR.htmlParser.text.prototype = {
		/**
		 * The node type. This is a constant value set to {@link CKEDITOR#NODE_TEXT}.
		 *
		 * @readonly
		 * @property {Number} [=CKEDITOR.NODE_TEXT]
		 */
		type: CKEDITOR.NODE_TEXT,

		/**
		 * Writes the HTML representation of this text to a {CKEDITOR.htmlParser.basicWriter}.
		 *
		 * @param {CKEDITOR.htmlParser.basicWriter} writer The writer to which write the HTML.
		 * @param {CKEDITOR.htmlParser.filter} filter
		 */
		writeHtml: function( writer, filter ) {
			var text = this.value;

			if ( filter && !( text = filter.onText( text, this ) ) )
				return;

			writer.text( text );
		}
	};
})();
