/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';



CKEDITOR.dialog.add( 'widgetmathjax', function( editor ) {

	var mathjaxLoadedHandler = CKEDITOR.tools.addFunction( function() {
		console.log( "mathjaxLoadedHandler" );
	} );

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
							var that = this;
							this.getInputElement().on( 'keyup', function () {
								CKEDITOR.document.getById( 'cke_mathjax_preview' ).getFrameDocument().getWindow().$.Preview.Update( that.getInputElement().getValue() );
							} );
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
								doc = CKEDITOR.document.getById( 'cke_mathjax_preview' ).getFrameDocument();

							var iframeHtml = '' +
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

										'Init: function ( text ) {' +
											'this.preview = document.getElementById(\'MathPreview\');' +
											'this.buffer = document.getElementById(\'MathBuffer\');' +
											'this.Update( text );' +
										'},' +

										'Update: function ( text ) {' +
											'this.newText = text;' +
											'if (this.timeout) {clearTimeout(this.timeout)}' +
											'this.timeout = setTimeout(this.callback,150);' +
										'},' +

										'CreatePreview: function () {' +
											'window.parent.CKEDITOR.tools.callFunction(' + this.mathjaxLoadedHandler + ',window);' +
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
											'this.preview.innerHTML = this.buffer.innerHTML;' +
											'var body = document.body,' +
												'height = Math.max( body.scrollHeight, body.offsetHeight );' +
											'console.log( height );' +
										'}' +

									'};' +

									'Preview.callback = MathJax.Callback([\'CreatePreview\',Preview]);' +
									'Preview.callback.autoReset = true;' +

									'Preview.Init( \'$$y = {-b \\\\pm \\\\sqrt{b^2-4ac} \\\\over 2a}$$\' );' +
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