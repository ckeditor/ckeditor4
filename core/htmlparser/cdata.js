/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {

	/**
	 * A lightweight representation of HTML text.
	 *
	 * @class
	 * @constructor Creates a cdata class instance.
	 * @param {String} value The CDATA section value.
	 */
	CKEDITOR.htmlParser.cdata = function( value ) {
		/**
		 * The CDATA value.
		 *
		 * @property {String}
		 */
		this.value = value;
	};

	CKEDITOR.htmlParser.cdata.prototype = {
		/**
		 * CDATA has the same type as {@link CKEDITOR.htmlParser.text} This is
		 * a constant value set to {@link CKEDITOR#NODE_TEXT}.
		 *
		 * @readonly
		 * @property {Number} [=CKEDITOR.NODE_TEXT]
		 */
		type: CKEDITOR.NODE_TEXT,

		/**
		 * Writes the CDATA with no special manipulations.
		 *
		 * @param {CKEDITOR.htmlParser.basicWriter} writer The writer to which write the HTML.
		 */
		writeHtml: function( writer ) {
			writer.write( this.value );
		}
	};
})();
