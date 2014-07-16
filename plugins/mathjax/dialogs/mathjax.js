/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.dialog.add( 'mathjax', function( editor ) {

	var preview,
		lang = editor.lang.mathjax;

	return {
		title: lang.title,
		minWidth: 350,
		minHeight: 100,
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'equation',
						type: 'textarea',
						label: lang.dialogInput,

						onLoad: function( widget ) {
							var that = this;

							if ( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) {
								var update_preview = function() {
									// Add \( and \) or \[ and \] for preview.
									var b = that.getDialog().getContentElement('info', 'displaymode').getValue() ? ['\\[', '\\]'] : ['\\(', '\\)'];
									preview.setValue( b[0] + that.getInputElement().getValue() + b[1] );
								};
								this.getInputElement().on( 'keyup', update_preview );
								this.getDialog().getContentElement('info', 'displaymode').getInputElement().on( 'change', update_preview );
							}
						},

						setup: function( widget ) {
							// Remove \( and \) or \[ and \].
							var t = CKEDITOR.plugins.mathjax.trim( widget.data.math, true );
							this.setValue( t.tex );
							this.getDialog().getContentElement('info', 'displaymode').setValue(t.display);
						},

						commit: function( widget ) {
							// Add \( and \) or \[ and \] to make TeX be parsed by MathJax by default.
							var b = this.getDialog().getContentElement('info', 'displaymode').getValue() ? ['\\[', '\\]'] : ['\\(', '\\)'];
							widget.setData( 'math', b[0] + this.getValue() + b[1] );
						}
					},
					{
						id: 'displaymode',
						type: 'checkbox',
						label: "Display mode"
					},
					{
						id: 'documentation',
						type: 'html',
						html:
							'<div style="width:100%;text-align:right;margin:-8px 0 10px">' +
								'<a class="cke_mathjax_doc" href="' + lang.docUrl + '" target="_black" style="cursor:pointer;color:#00B2CE;text-decoration:underline">' +
									lang.docLabel +
								'</a>' +
							'</div>'
					},
					( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) && {
						id: 'preview',
						type: 'html',
						html:
							'<div style="width:100%;text-align:center;">' +
								'<iframe style="border:0;width:0;height:0;font-size:20px" scrolling="no" frameborder="0" allowTransparency="true" src="' + CKEDITOR.plugins.mathjax.fixSrc + '"></iframe>' +
							'</div>',

						onLoad: function( widget ) {
							var iFrame = CKEDITOR.document.getById( this.domId ).getChild( 0 );
							preview = new CKEDITOR.plugins.mathjax.frameWrapper( iFrame, editor );
						},

						setup: function( widget ) {
							preview.setValue( widget.data.math );
						}
					}
				]
			}
		]
	};
} );
