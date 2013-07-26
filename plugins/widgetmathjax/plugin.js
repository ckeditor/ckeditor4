/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

(function() {

	function hasClass( el, className ) {
		if ( ! el.attributes[ 'class' ] ) {
			return false;
		}
		var regex = new RegExp( '(?:^|\\s+)' + className + '(?=\\s|$)', '' );
		return regex.test( el.attributes[ 'class' ] );
	}

	CKEDITOR.plugins.add( 'widgetmathjax', {
		requires: 'widget,dialog',

		icons: 'widgetmathjax',

		onLoad: function() {
		},

		init: function( editor ) {
			editor.widgets.add( 'mathjax', {
				// This is an "inline" widget. It defaults to "block".
				inline: true,

				dialog: 'widgetmathjax',

				button: 'MathJax',

				allowedContent: 'span(math-tex)',

				template: '<span class="math-tex">{text}</script>',

				// The default data used to fill the above template.
				defaults: function() {
					return {
						dateTime: ( new Date() )[ Date.prototype.toISOString ? 'toISOString' : 'toUTCString' ](),
						text: ( new Date() ).toDateString()
					};
				},

				// Initialization code, called for each widget instance created.
				init: function() {
					// Take the widget data out of the DOM.
					this.setData( {
						dateTime: this.element.getAttribute( 'datetime' ),
						text: this.element.getText()
					} );
				},

				// Called whenever changes to the widget data happens.
				data: function() {
					// Transport the data changes to the DOM.
					//this.element.setAttribute( 'datetime', this.data.dateTime );
					//this.element.setText( this.data.text );
				},

				// Check the elements that need to be converted to widgets.
				upcast: function( el ) {
					if ( !( el.name == 'span' && hasClass( el, 'math-tex' ) ) )
						return false;

					var source = new CKEDITOR.htmlParser.element( 'span', { 'style': 'display:none;'} );
					source.children =  el.children;

					var framedMathJax = new CKEDITOR.plugins.mathjax.FramedMathJax();

					el.children = [ source, framedMathJax.toParserElement() ];

					return el;
				},

				downcast: function( el ) {
					el.children = el.children[0].children;

					return el;
				}
			} );

			// Register the editing dialog.
			CKEDITOR.dialog.add( 'widgetmathjax', this.path + 'dialogs/widgetmathjax.js' );
		}
	} );

	CKEDITOR.plugins.mathjax = {};

	CKEDITOR.plugins.mathjax.FramedMathJax = function () {
		var mathjaxLoadedHandler = CKEDITOR.tools.addFunction( function() {
			console.log( "mathjaxLoadedHandler" );
		} );

		var id = CKEDITOR.tools.getNextId();

		function srcAttribute () {
			return 'javascript:document.write( \'' + encodeURIComponent( addSlashes( createContent() ) ) +'\' );document.close();';
		}

		function addSlashes ( string ) {
			return string.replace(/\\/g, '\\\\').
				replace(/\u0008/g, '\\b').
				replace(/\t/g, '\\t').
				replace(/\n/g, '\\n').
				replace(/\f/g, '\\f').
				replace(/\r/g, '\\r').
				replace(/'/g, '\\\'').
				replace(/"/g, '\\"');
		}

		function createContent () {
			return '' +
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
				'<body>' +
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
							//'window.parent.CKEDITOR.tools.callFunction(' + this.mathjaxLoadedHandler + ',window);' +
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

					'Preview.Init( \'$$y = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$\' );' +
					'</script>' +
				'</body>' +
				'</html>';
		}

		return {
			toParserElement: function () {
				return new CKEDITOR.htmlParser.element( 'iframe', { 'id': id, 'src': srcAttribute() } );
			},

			toHtml: function () {
				return '<iframe id="'+ id + '" src="' + srcAttribute() + '" />';
			},

			update: function( value ) {
				CKEDITOR.document.getById( id ).getFrameDocument().getWindow().$.Preview.Update( value );
			}
		};
	}
})();
