/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.template} class, which represents
 * an UI template for an editor instance.
 */

( function() {
	var cache = {},
		rePlaceholder = /{([^}]+)}/g,
		reEscapableChars = /([\\'])/g,
		reNewLine = /\n/g,
		reCarriageReturn = /\r/g;

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
		// For example, if we have this "source":
		//	'<div style="{style}">{editorName}</div>'
		// ... the resulting function body will be (apart from the "buffer" handling):
		//	return [ '<div style="', data['style'] == undefined ? '{style}' : data['style'], '">', data['editorName'] == undefined ? '{editorName}' : data['editorName'], '</div>' ].join('');

		// Try to read from the cache.
		if ( cache[ source ] )
			this.output = cache[ source ];
		else {
			// less performant solution when CSP is disabling indirect evaluation
			cache[ source ] = function( data, buffer ) {
				var m,
					src = source,
					chunks = [];
				while ( ( m = rePlaceholder.exec( src ) ) ) {
					var k = m[ 1 ];
					chunks.push( src.substr( 0, m.index ), data[ k ] === undefined ? m[ 0 ] : data[ k ] );
					src = src.substr( m.index + m[ 0 ].length );
					rePlaceholder.lastIndex = 0;
				}
				chunks.push( src ); // ... the rest
				return buffer ? buffer.push.apply( buffer, chunks ) : chunks.join( '' );
			};
			this.output = cache[ source ];
		}
	};
} )();

/**
 * Processes the template, filling its variables with the provided data.
 *
 * @method output
 * @param {Object} data An object containing properties which values will be
 * used to fill the template variables. The property names must match the
 * template variables names. Variables without matching properties will be
 * kept untouched.
 * @param {Array} [buffer] An array into which the output data will be pushed into.
 * The number of entries appended to the array is unknown.
 * @returns {String/Number} If `buffer` has not been provided, the processed
 * template output data, otherwise the new length of `buffer`.
 */
