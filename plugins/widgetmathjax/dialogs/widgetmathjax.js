/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';



CKEDITOR.dialog.add( 'widgetmathjax', function( editor ) {

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
						'default': '$$y = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$',
						label: 'Equation in TeX or MathML',
						onLoad: function( widget ) {
							this.getInputElement().setAttribute( "onkeyup", "CKEDITOR.document.getById( 'cke_mathjax_preview' ).getFrameDocument().getWindow().$.Preview.Update( this.value );" );
							setTimeout( function () {
								CKEDITOR.document.getById( 'cke_mathjax_preview' ).getFrameDocument().getWindow().$.Preview.Update( '$$y = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$' );
							}, 1500 );
						},
					},
					{
						id: 'preview',
						type: 'html',
						html: '<iframe frameborder="0" style="overflow:hidden;width:100%" width="100%" scrolling="no" id="cke_mathjax_preview" />',
						onLoad: function () {
							var config = editor.config,
								backgroundColorStyle = config.dialog_backgroundCoverColor || 'white',
								//backgroundColorStyle = 'red',
								doc = CKEDITOR.document.getById( 'cke_mathjax_preview' ).getFrameDocument(),
								iframeHtml = '' +
								'<!DOCTYPE html>' +
								'<html>' +
								'<head>' +
									'<meta charset="utf-8">' +
									'<script type="text/x-mathjax-config">' +
										'MathJax.Hub.Config( {' +
											'showMathMenu: false,' +
											'messageStyle: "none"' +
										'} );' +
									'</script>' +
									'<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">' +
									'</script>' +
								'</head>' +
								'<body style="background-color:' + backgroundColorStyle + ';">' +
								'<div id="MathPreview"></div>' +
								'<div id="MathBuffer" style="visibility:hidden;"><div>' +
									'<script>' +
									// Refresh script based on MathJax sample:
									// http://cdn.mathjax.org/mathjax/latest/test/sample-dynamic-2.html
									'var Preview = {' +
										'preview: null,' +
										'buffer: null,' +

										'timeout: null,' +
										'mjRunning: false,' +
										'oldText: null,' +
										'newText: null,' +

										'Init: function () {' +
											'this.preview = document.getElementById(\'MathPreview\');' +
											'this.buffer = document.getElementById(\'MathBuffer\');' +
										'},' +

										'SwapBuffers: function () {' +
											'var buffer = this.preview, preview = this.buffer;' +
											'this.buffer = buffer; this.preview = preview;' +
											'buffer.style.visibility = \'hidden\'; buffer.style.position = \'absolute\';' +
											'preview.style.position = \'\'; preview.style.visibility = \'\';' +
										'},' +

										'Update: function ( text ) {' +
											'this.newText = text;' +
											'if (this.timeout) {clearTimeout(this.timeout)}' +
											'this.timeout = setTimeout(this.callback,150);' +
										'},' +

										'CreatePreview: function () {' +
											'Preview.timeout = null;' +
											'if (this.mjRunning) return;' +
											'if (this.newText === this.oldText) return;' +
											'this.buffer.innerHTML = this.oldText = this.newText;' +
											'this.mjRunning = true;' +
											'MathJax.Hub.Queue(' +
												'[\'Typeset\',MathJax.Hub,this.buffer],' +
												'[\'PreviewDone\',this]' +
											');' +
										'},' +

										'PreviewDone: function () {' +
											'this.mjRunning = false;' +
											'this.SwapBuffers();' +
										'}' +

									'};' +

									'Preview.callback = MathJax.Callback([\'CreatePreview\',Preview]);' +
									'Preview.callback.autoReset = true;' +

									'Preview.Init();' +
									'</script>' +
								'</body>' +
								'</html>';

							doc.write( iframeHtml );

						}
					}
				]
			}
		]
	}
} );