/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.template} class, which represents
 * an UI template for an editor instance.
 */

( function() {
	var rePlaceholder = /{([^}]+)}/g;

	/**
	 * Lightweight template used to build the output string from variables.
	 *
	 *		// HTML template for presenting a label UI.
	 *		var tpl = new CKEDITOR.template( '<div class="{cls}">{label}</div>' );
	 *		alert( tpl.output( { cls: 'cke-label', label: 'foo'} ) ); // '<div class="cke-label">foo</div>'
	 *
	 * @class
	 * @constructor Creates a template class instance.
	 * @param {String} source The template source.
	 */
	CKEDITOR.template = function( source ) {
		/**
		 * The current template source.
		 *
		 * @readonly
		 * @member CKEDITOR.template
		 * @property {String}
		 */
		this.source = String( source );
	};

	/**
	 * Processes the template, filling its variables with the provided data.
	 *
	 * @method
	 * @member CKEDITOR.template
	 * @param {Object} data An object containing properties whose values will be
	 * used to fill the template variables. The property names must match the
	 * template variables names. Variables without matching properties will be
	 * kept untouched.
	 * @param {Array} [buffer] An array that the output data will be pushed into.
	 * The number of entries appended to the array is unknown.
	 * @returns {String/Number} If `buffer` has not been provided, the processed
	 * template output data; otherwise the new length of `buffer`.
	 */
	CKEDITOR.template.prototype.output = function( data, buffer ) {
		var output = this.source.replace( rePlaceholder, function( fullMatch, dataKey ) {
			return data[ dataKey ] !== undefined ? data[ dataKey ] : fullMatch;
		} );

		return buffer ? buffer.push( output ) : output;
	};
} )();
