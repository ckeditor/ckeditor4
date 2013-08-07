/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

(function() {

	var cdn = 'http:\/\/cdn.mathjax.org\/mathjax\/2.2-latest\/MathJax.js?config=TeX-AMS_HTML';

	CKEDITOR.plugins.add( 'widgetmathjax', {
		requires: 'widget,dialog',

		icons: 'widgetmathjax',

		init: function( editor ) {
			var cls = editor.config.mathJaxClass || 'math-tex';

			editor.widgets.add( 'mathjax', {
				inline: true,
				dialog: 'widgetmathjax',
				button: 'MathJax',
				mask: true,
				allowedContent: 'span(!' + cls + ')',

				template:
					'<span class="' + cls + '" style="display:inline-block">' +
						'<iframe style="border:0;width:0;height:0" scrolling="no" frameborder="0" allowTransparency="true" />' +
					'</span>',

				parts: {
					iframe: 'iframe'
				},

				defaults: {
					math: '\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)'
				},

				init: function() {
					this.once( 'ready', function () {
						this.frameWrapper = new CKEDITOR.plugins.mathjax.frameWrapper( this.parts.iframe, editor.config.mathJaxLib );
						this.frameWrapper.setValue( this.data.math );
					} );
				},

				data: function() {
					if ( this.frameWrapper )
						this.frameWrapper.setValue( this.data.math );
				},

				upcast: function( el ) {
					if ( !( el.name == 'span' && el.hasClass( cls ) ) )
						return false;

					//TODO Widget API method to save widget.data.
					el.attributes[ 'data-widget-data' ] = JSON.stringify( {
						math: el.children[ 0 ].value
					} );

					// Add style display:inline-block.
					if ( el.attributes[ 'style' ] )
						el.attributes[ 'style' ] = el.attributes[ 'style' ] + ";display:inline-block";
					else
						el.attributes[ 'style' ] = "display:inline-block";

					el.children[ 0 ].replaceWith( new CKEDITOR.htmlParser.element( 'iframe', {
						style: 'border:0;width:0;height:0',
						scrolling: 'no',
						frameborder: 0,
						allowTransparency: true
					} ) );

					return el;
				},

				downcast: function( el ) {
					el.children[ 0 ].replaceWith( new CKEDITOR.htmlParser.text( this.data.math ) );

					// Remove style display:inline-block.
					if ( el.attributes[ 'style' ] == "display:inline-block" )
						delete el.attributes[ 'style' ];
					else {
						var end = el.attributes[ 'style' ].lastIndexOf( ';display:inline-block' );
						el.attributes[ 'style' ] = el.attributes[ 'style' ].substring( 0, end );
					}

					return el;
				}
			} );

			CKEDITOR.dialog.add( 'widgetmathjax', this.path + 'dialogs/widgetmathjax.js' );

			editor.on( 'contentPreview', function( evt ) {
				evt.data.dataValue = evt.data.dataValue.replace( /<\/head>/, '<script src="' + ( editor.config.mathJaxLib || cdn ) + '"><\/script><\/head>' );
			} );
		}
	} );

	CKEDITOR.plugins.mathjax = {};

	CKEDITOR.plugins.mathjax.frameWrapper = function( iFrame, libSrc ) {

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

				iFrame.fire( 'mathJaxLoaded' );
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

				iFrame.fire( 'mathJaxUpdateDone' );

				if ( value != newValue )
					update();
				else
					isRunning = false;
			} ),
			stylesToCopy = [ 'color', 'font-family', 'font-style', 'font-weight', 'font-variant', 'font-size' ],
			style = '';

		// Copy styles from iFrame to body inside iFrame.
		for ( var i = 0; i < stylesToCopy.length; i++ ) {
			var key = stylesToCopy[ i ],
				value = iFrame.getComputedStyle( key );
			if ( value )
				style += key + ': ' + value + ';';
		}

		function update() {
			isRunning = true;

			value = newValue;

			buffer.setHtml( value );

			iFrame.setStyles( {
				height: 0,
				width: 0,
				'vertical-align': 'middle'
			} );

			doc.getWindow().$.update( value );
		}

		doc.write( '<!DOCTYPE html>' +
			'<html>' +
			'<head>' +
				'<meta charset="utf-8">' +
				'<style type="text/css">' +
					'span#preview {' +
						style +
					'}' +
				'</style>' +
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
				'<script src="' + ( libSrc || cdn ) + '"></script>' +
			'</head>' +
			'<body style="padding:0;margin:0;background:transparent;overflow:hidden">' +
				'<span id="preview"></span>' +
				'<span id="buffer" style="display:none"></span>' +
			'</body>' +
			'</html>' );

		return {
			setValue: function( value ) {
				newValue = value;

				if ( isInit && !isRunning )
					update();
			}
		};
	}
})();
