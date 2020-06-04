/* exported stubAppendStyleSheet, convertRgbaToRgb */

'use strict';

function stubAppendStyleSheet() {
	var originFn = CKEDITOR.dom.document.prototype.appendStyleSheet;
	return sinon.stub( CKEDITOR.dom.document.prototype, 'appendStyleSheet', function( cssFileUrl ) {
		// Simulate missing css in skin.
		if ( !cssFileUrl.match( /(balloontoolbar|balloonpanel)\.css/ ) ) {
			originFn.call( CKEDITOR.document, cssFileUrl );
		}
	} );
}

function convertRgbaToRgb( input ) {
	var re = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/gi;
	return re.test( input ) ? input.replace( /,\s*?\d+?\s*?\)$/, ')' ).replace( 'rgba(', 'rgb(' ) : input;
}