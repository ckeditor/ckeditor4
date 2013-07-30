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
				inline: true,

				dialog: 'widgetmathjax',

				button: 'MathJax',

				allowedContent: 'span(math-tex)',

				template: '<span class="math-tex">' +
					'<span style="display:none;">{math}</span>' +
					'<iframe style="border:0;width:0px;height:0px;" />' +
				'</span>',

				defaults: function() {
					return {
						math: '\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)',
					};
				},
				init: function() {
					this.setData( {
						math: this.element.getText()
					} );
					this.framedMathJax = new CKEDITOR.plugins.mathjax.FramedMathJax( editor, this.element.getChild( 1 ) );
				},
				data: function() {
					this.framedMathJax.setValue( this.data.math );
					this.element.getChild( 0 ).setHtml( this.data.math );
				},
				upcast: function( el ) {
					if ( !( el.name == 'span' && hasClass( el, 'math-tex' ) ) )
						return false;

					var source = new CKEDITOR.htmlParser.element( 'span', { 'style': 'display:none;'} );
					source.children =  el.children;

					var iframe = new CKEDITOR.htmlParser.element( 'iframe', { 'style': 'border:0;width:0px;height:0px;' } );

					el.children = [ source, iframe ];

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

	CKEDITOR.plugins.mathjax.FramedMathJax = function ( editor, iFrame ) {

		var doc, win, buffer, preview, value, newValue,
			isRunning = false,
			isInit = false,

			loadedHandler = CKEDITOR.tools.addFunction( function() {
				doc = iFrame.getFrameDocument();
				win = doc.getWindow();
				preview = doc.getById( 'preview' );
				buffer = doc.getById( 'buffer' );
				isInit = true;

				if( newValue )
					update();
		} ),
			updateDoneHandler = CKEDITOR.tools.addFunction( function() {
				preview.setHtml( buffer.getHtml() );

				var height = Math.max( doc.$.body.offsetHeight, doc.$.documentElement.offsetHeight ),
					width = Math.max( preview.$.offsetWidth, doc.$.body.scrollWidth );

				iFrame.setStyle( 'height', height + 'px' );
				iFrame.setStyle( 'width', width + 'px' );
				iFrame.setStyle( 'display','inline' );

				if( value != newValue )
					update();
				else
					isRunning = false;
		} );

		iFrame.setAttributes( {
			'src': 'javascript:document.write( \'' + encodeURIComponent( addSlashes( createContent() ) ) +'\' );document.close();',
			'style': 'border:0;width:0px;height:0px;',
			'scrolling': 'no',
			'frameborder': 0,
			'allowTransparency': true
		} );

		function update() {
			isRunning = true;

			value = newValue;
			buffer.setHtml( value );
			iFrame.setStyle( 'height', '0px' );
			iFrame.setStyle( 'width', '0px' );
			win.$.update( value );
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
			return '<!DOCTYPE html>' +
				'<html>' +
				'<head>' +
					'<meta charset="utf-8">' +
					'<script type="text/x-mathjax-config">' +
						'MathJax.Hub.Config( {' +
							'showMathMenu: false,' +
							'messageStyle: "none"' +
						'} );' +
						'function getCKE() {' +
							'if( typeof window.parent.CKEDITOR == "object" ) {' +
								'return window.parent.CKEDITOR;' +
							'} else {' +
								'return window.parent.parent.CKEDITOR;' +
							'};' +
						'};' +
						'function update() {' +
							'MathJax.Hub.Queue(' +
								'[\'Typeset\',MathJax.Hub,this.buffer],' +
								'function() {' +
									'getCKE().tools.callFunction( ' + updateDoneHandler + ' );' +
								'}' +
							');' +
						'};' +
						'MathJax.Hub.Queue( function () {' +
							'getCKE().tools.callFunction(' + loadedHandler + ');' +
						'} );' +
					'</script>' +
					'<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">' +
					'</script>' +
				'</head>' +
				'<body style="padding:0px;margin:0px;background:transparent">' +
					'<span id="preview"></span>' +
					'<span id="buffer" style="display:none;"></span>' +
				'</body>' +
				'</html>';
		}
		return {
			setValue: function( value ) {
				newValue = value;

				if(!isInit || isRunning)
					return;

				update();
			}
		};
	}
})();
