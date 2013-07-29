/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';



CKEDITOR.dialog.add( 'widgetmathjax', function( editor ) {

	var sample = '$$y = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$',
		preview = new CKEDITOR.plugins.mathjax.FramedMathJax( editor );

	return {
		title: 'Edit TeX/MathML',
		minWidth: 350,
		minHeight: 100,
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'equation',
						type: 'textarea',
						'default': sample,
						label: 'Equation in TeX or MathML',
						onLoad: function( widget ) {
							var that = this;

							// var timeout: null;
							// this.newText = text;
							// if (this.timeout)
							// 	clearTimeout(this.timeout);

							// this.timeout = setTimeout(this.callback,150);
							this.getInputElement().on( 'keyup', function () {
								preview.setValue( that.getInputElement().getValue() );
							} );
						}
					},
					{
						id: 'preview',
						type: 'html',
						html: '<div style="width:100%;text-align:center">' + preview.toHtml() + '</div>',
						onLoad: function( widget ) {
							preview.setValue( sample );
						}
					}
				]
			}
		]
	}
} );