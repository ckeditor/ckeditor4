/* exported ReplacerAppendStyleSheet, convertRgbaToRgb */

'use strict';

var ReplacerAppendStyleSheet = function() {
	var originFn = null;
	return {
		change: function() {
			originFn = CKEDITOR.dom.document.prototype.appendStyleSheet;
			CKEDITOR.dom.document.prototype.appendStyleSheet = function( cssFileUrl ) {
				// Simulate missing css in skin.
				if ( !cssFileUrl.match( /(inlinetoolbar|balloonpanel)\.css/ ) ) {
					originFn.call( CKEDITOR.document, cssFileUrl );
				}
			};
		},
		unchange: function() {
			CKEDITOR.dom.document.prototype.appendStyleSheet = originFn;
			originFn = null;
		}
	};
};

function convertRgbaToRgb( input ) {
	var re = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/gi;
	return re.test( input ) ? input.replace( /,\s*?\d+?\s*?\)$/, ')' ).replace( 'rgba(', 'rgb(' ) : input;
}
