/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'quote', {
	requires: 'widget',
	icons: 'quote',

	onLoad: function() {
		CKEDITOR.addCss(
			'figure.quote{' +
				'font-style:italic;' +
				'font-family:Georgia, Times, "Times New Roman", serif;' +
				'padding:2px 0;' +
				'border-style:solid;' +
				'border-color:#ccc;' +
				'border-width:0' +
			'}' +
			'.cke_contents_ltr figure.quote{' +
				'padding-left:20px;' +
				'padding-right:8px;' +
				'border-left-width:5px' +
			'}' +
			'.cke_contents_ltr figure.quote blockquote{' +
				'padding:0;' +
				'margin:0;' +
				'border-left-width:0;' +
				'font-size:large' +
			'}' +
			'figure.quote blockquote p{' +
				'margin:10px 0' +
			'}' +
			'figure.quote figcaption{' +
				'margin-bottom:5px' +
			'}'
		);
	},

	init: function( editor ) {
		editor.widgets.add( 'quote', {
			allowedContent: 'figure(quote); blockquote figcaption',

			button: 'Quote',

			template:
				'<figure class="quote">' +
					'<blockquote><p>Quote</p></blockquote>' +
					'<figcaption>Caption</figcaption>' +
				'</figure>',

			editables: {
				quote: 'blockquote',
				caption: {
					selector: 'figcaption',
					allowedContent: 'strong em br; a[!href]'
				}
			},

			upcast: function( el ) {
				return el.name == 'figure' && el.attributes[ 'class' ] == 'quote';
			}
		} );
	}
} );