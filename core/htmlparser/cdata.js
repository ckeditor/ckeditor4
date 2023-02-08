/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {

	/**
	 * A lightweight representation of HTML CDATA.
	 *
	 * @class
	 * @extends CKEDITOR.htmlParser.node
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

	CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend( new CKEDITOR.htmlParser.node(), {
		/**
		 * CDATA has the same type as {@link CKEDITOR.htmlParser.text} This is
		 * a constant value set to {@link CKEDITOR#NODE_TEXT}.
		 *
		 * @readonly
		 * @property {Number} [=CKEDITOR.NODE_TEXT]
		 */
		type: CKEDITOR.NODE_TEXT,

		filter: function( filter ) {
			var style = this.getAscendant( 'style' );

			if ( !style ) {
				return;
			}

			// MathML and SVG namespaces processing parsers `style` content as a normal HTML, not text.
			// Make sure to filter such content also.
			var nonHtmlElementNamespace = style.getAscendant( { math: 1, svg: 1 } );

			if ( !nonHtmlElementNamespace ) {
				return;
			}

			var fragment = CKEDITOR.htmlParser.fragment.fromHtml( this.value ),
				writer = new CKEDITOR.htmlParser.basicWriter();

			filter.applyTo( fragment );
			fragment.writeHtml( writer );

			this.value = writer.getHtml();
		},

		/**
		 * Writes the CDATA with no special manipulations.
		 *
		 * @param {CKEDITOR.htmlParser.basicWriter} writer The writer to which write the HTML.
		 */
		writeHtml: function( writer ) {
			writer.write( this.value );
		}
	} );
} )();
