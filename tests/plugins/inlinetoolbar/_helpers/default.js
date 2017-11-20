/* exported replaceAppendStyleSheet, convertRgbaToRgb */

'use strict';

function replaceAppendStyleSheet() {
	// Overwrite prototype to simulate missing css file.
	var oldFn = CKEDITOR.dom.document.prototype.appendStyleSheet;
	CKEDITOR.dom.document.prototype.appendStyleSheet = function( cssFileUrl ) {
		// Simulate missing css in skin.
		if ( !cssFileUrl.match( /(inlinetoolbar|balloonpanel)\.css/ ) ) {
			oldFn.call( CKEDITOR.document, cssFileUrl );
		}
	};
}

function convertRgbaToRgb( input ) {
	var re = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/gi;
	return re.test( input ) ? input.replace( /,\s*?\d+?\s*?\)$/, ')' ).replace( 'rgba(', 'rgb(' ) : input;
}
