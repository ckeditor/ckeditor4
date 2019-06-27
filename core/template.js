/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
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
	 *		// Since 4.12.0 it is possible to pass a callback function that returns a template.
	 *		var tpl2 = new CKEDITOR.template( function( data ) {
	 *			return data.image ? '<img src="{image}" alt="{label}"/>' : '{label}';
	 *		} );
	 *		alert( tpl2.output( { image: null, label: 'foo'} ) ); // 'foo'
	 *		alert( tpl2.output( { image: '/some-image.jpg', label: 'foo'} ) ); // <img src="/some-image.jpg" alt="foo"/>
	 *
	 * @class
	 * @constructor Creates a template class instance.
	 * @param {String/Function} source A string with the template source or a callback that will return such string.
	 * The handling of the `Function` type was added in version 4.12.0 .
	 */
	CKEDITOR.template = function( source ) {
		/**
		 * The current template source.
		 *
		 * Note that support for the `Function` type was added in version 4.12.0 .
		 *
		 * @readonly
		 * @member CKEDITOR.template
		 * @property {String/Function} source
		 */
		this.source = typeof source === 'function' ? source : String( source );
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

		var template = typeof this.source === 'function' ? this.source( data ) : this.source,
			output = template.replace( rePlaceholder, function( fullMatch, dataKey ) {
				return data[ dataKey ] !== undefined ? data[ dataKey ] : fullMatch;
			} );

		return buffer ? buffer.push( output ) : output;
	};
} )();
