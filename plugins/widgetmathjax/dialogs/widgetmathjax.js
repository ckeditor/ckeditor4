/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';



CKEDITOR.dialog.add( 'widgetmathjax', function( editor ) {

	var preview;

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
						label: 'Equation in TeX or MathML',
						onLoad: function( widget ) {
							var that = this;

							this.getInputElement().on( 'keyup', function () {
								preview.setValue( that.getInputElement().getValue() );
							} );
						},
						setup: function( widget ) {
							this.setValue( widget.data.math );
						},
						commit: function( widget ) {
							widget.setData( 'math', this.getValue() );
						}
					},
					{
						id: 'preview',
						type: 'html',
						html:'' +
							'<div style="width:100%;text-align:center;">' +
								'<iframe style="border:0;width:0px;height:0px;" scrolling="no" frameborder="0" />' +
							'</div>',
						onLoad: function( widget ) {
							var iFrame = CKEDITOR.document.getById( this.domId ).getChild( 0 );
							preview = new CKEDITOR.plugins.mathjax.FramedMathJax( editor, iFrame );
						},
						setup: function( widget ) {
							preview.setValue( widget.data.math );
						}
					}
				]
			}
		]
	}
} );