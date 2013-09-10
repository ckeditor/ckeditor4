/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

(function() {

	var cdn = 'http:\/\/cdn.mathjax.org\/mathjax\/2.2-latest\/MathJax.js?config=TeX-AMS_HTML';

	CKEDITOR.plugins.add( 'mathjax', {
		requires: 'widget,dialog',

		icons: 'mathjax',

		init: function( editor ) {
			var cls = editor.config.mathJaxClass || 'math-tex';

			editor.widgets.add( 'mathjax', {
				inline: true,
				dialog: 'mathjax',
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
					this.once( 'ready', function() {
						this.frameWrapper = new CKEDITOR.plugins.mathjax.frameWrapper( this.parts.iframe, editor );
						this.frameWrapper.setValue( this.data.math );
					} );
				},

				data: function() {
					if ( this.frameWrapper )
						this.frameWrapper.setValue( this.data.math );
				},

				upcast: function( el, data ) {
					if ( !( el.name == 'span' && el.hasClass( cls ) ) )
						return;

					data.math = el.children[ 0 ].value;

					// Add style display:inline-block.
					var attrs = el.attributes;
					if ( attrs.style )
						attrs.style += ';display:inline-block';
					else
						attrs.style = 'display:inline-block';

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
					var attrs = el.attributes;
					attrs.style = attrs.style.replace( /display:\s?inline-block;?$/, '' );
					if ( attrs.style == '' )
						delete attrs.style;

					return el;
				}
			} );

			CKEDITOR.dialog.add( 'mathjax', this.path + 'dialogs/mathjax.js' );

			editor.on( 'contentPreview', function( evt ) {
				evt.data.dataValue = evt.data.dataValue.replace( /<\/head>/,
					'<script src="' + ( getAbsolutePath( editor.config.mathJaxLib ) || cdn ) + '"><\/script><\/head>' );
			} );
		}
	} );

	function getAbsolutePath( path ) {
		if ( !path )
			return path;

		if ( isRalativePath( path ) ) {
			// Webkit bug: Avoid requesting with original file name (MIME type)
			//  which will stop browser from interpreting resources from same URL.
			var suffixIndex = path.lastIndexOf( '.' ),
				suffix = suffixIndex == -1 ? '' : path.substring( suffixIndex, path.length );

			suffix && ( path = path.substring( 0, suffixIndex ) );

			var temp = window.document.createElement( 'img' );
			temp.src = path;
			return temp.src + suffix;
		}
		else
			return path;
	}

	function isRalativePath( path ) {
		return path.charAt(0) != "#" && path.charAt(0) != "/" &&
			( path.indexOf("//") == -1  || path.indexOf("//") > path.indexOf("#") || path.indexOf("//") > path.indexOf("?") );
	}

	CKEDITOR.plugins.mathjax = {};

	CKEDITOR.plugins.mathjax.frameWrapper = function( iFrame, editor ) {

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

				editor.fire( 'lockSnapshot' );

				iFrame.setStyles( {
					height: height + 'px',
					width: width + 'px',
					display: 'inline'
				} );

				editor.fire( 'unlockSnapshot' );

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

			editor.fire( 'lockSnapshot' );

			iFrame.setStyles( {
				height: 0,
				width: 0,
				'vertical-align': 'middle'
			} );

			editor.fire( 'unlockSnapshot' );

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
				'<script src="' + ( editor.config.mathJaxLib || cdn ) + '"></script>' +
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
