/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

(function() {
	CKEDITOR.plugins.add( 'widgetmathjax', {
		requires: 'widget,dialog',

		icons: 'widgetmathjax',

		init: function( editor ) {
			editor.widgets.add( 'mathjax', {
				inline: true,

				dialog: 'widgetmathjax',

				button: 'MathJax',

				allowedContent: 'span(!math-tex)',

				template:
					'<span class="math-tex">' +
						'<iframe style="border:0;width:0;height:0" scrolling="no" frameborder="0" />' +
					'</span>',

				parts: {
					iframe: 'iframe'
				},

				defaults: {
					math: '\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)'
				},

				init: function() {
					this.frameWrapper = new CKEDITOR.plugins.mathjax.frameWrapper( editor, this.parts.iframe );
				},

				data: function() {
					this.frameWrapper.setValue( this.data.math );
				},

				upcast: function( el ) {
					if ( !( el.name == 'span' && el.hasClass( 'math-tex' ) ) )
						return false;

					el.attributes[ 'data-widget-data' ] = JSON.stringify( {
						math: el.children[ 0 ].value
					} );

					el.children[ 0 ].replaceWith( new CKEDITOR.htmlParser.element( 'iframe', {
						style: 'border:0;width:0;height:0',
						scrolling: 'no',
						frameborder: 0
					} ) );

					return el;
				},

				downcast: function( el ) {
					el.children[ 0 ].replaceWith( new CKEDITOR.htmlParser.text( this.data.math ) );

					return el;
				}
			} );

			CKEDITOR.dialog.add( 'widgetmathjax', this.path + 'dialogs/widgetmathjax.js' );
		}
	} );

	CKEDITOR.plugins.mathjax = {};

	CKEDITOR.plugins.mathjax.frameWrapper = function( editor, iFrame ) {

		var buffer, preview, value, newValue,
			doc = iFrame.getFrameDocument(),
			isRunning = false,
			isInit = false,
			loadedHandler = CKEDITOR.tools.addFunction( function() {
				preview = doc.getById( 'preview' );
				buffer = doc.getById( 'buffer' );
				isInit = true;

				if ( newValue )
					update();
			} ),
			updateDoneHandler = CKEDITOR.tools.addFunction( function() {
				preview.setHtml( buffer.getHtml() );

				var height = Math.max( doc.$.body.offsetHeight, doc.$.documentElement.offsetHeight ),
					width = Math.max( preview.$.offsetWidth, doc.$.body.scrollWidth );

				iFrame.setStyles( {
					height: height + 'px',
					width: width + 'px',
					display: 'inline'
				} );

				if ( value != newValue )
					update();
				else
					isRunning = false;
			} ),
			content = '<!DOCTYPE html>' +
				'<html>' +
				'<head>' +
					'<meta charset="utf-8">' +
					'<script type="text/x-mathjax-config">' +
						'MathJax.Hub.Config( {' +
							'showMathMenu: false,' +
							'messageStyle: "none"' +
						'} );' +
						'function getCKE() {' +
							'if ( typeof window.parent.CKEDITOR == \'object\' ) {' +
								'return window.parent.CKEDITOR;' +
							'} else {' +
								'return window.parent.parent.CKEDITOR;' +
							'}' +
						'}' +
						'function update() {' +
							'MathJax.Hub.Queue(' +
								'[\'Typeset\',MathJax.Hub,this.buffer],' +
								'function() {' +
									'getCKE().tools.callFunction( ' + updateDoneHandler + ' );' +
								'}' +
							');' +
						'}' +
						'MathJax.Hub.Queue( function() {' +
							'getCKE().tools.callFunction(' + loadedHandler + ');' +
						'} );' +
					'</script>' +
					'<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>' +
				'</head>' +
				'<body style="padding:0;margin:0;background:transparent;overflow:hidden">' +
					'<span id="preview"></span>' +
					'<span id="buffer" style="display:none"></span>' +
				'</body>' +
				'</html>';

		function update() {
			isRunning = true;

			value = newValue;

			buffer.setHtml( value );

			iFrame.setStyles( {
				height: 0,
				width: 0
			} );

			doc.getWindow().$.update( value );
		}

		iFrame.setAttribute( 'allowTransparency', true );

		doc.write( content );

		return {
			setValue: function( value ) {
				newValue = value;

				if ( isInit && !isRunning )
					update();
			}
		};
	}
})();
