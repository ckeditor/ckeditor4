/* bender-tags: unit,style */

( function() {

	'use strict';

	var newElement = function( element, ownerDocument ) {
		return new CKEDITOR.dom.element( element, ownerDocument );
	};

	bender.test( {

		// #14252
		'test styles color attribute normalization': function() {
			var styleItalic = new CKEDITOR.style( { element: 'h2', attributes: { 'style': 'font-style:italic;' } } ),
				styleSubtitle = new CKEDITOR.style( { element: 'h3', attributes: { 'style': 'color:#a1a2a3;font-style:italic;' } } ),
				styleSpecialContainer = new CKEDITOR.style( { element: 'div', attributes: { 'style': 'background:#eee;border:1px solid #ccc;padding:5px 10px;' } } ),
				stylesYellow = new CKEDITOR.style( { element: 'span', styles: { color: '#ff0' } } ),
				stylesYellowUpper = new CKEDITOR.style( { element: 'span', styles: { color: '#FFFF00' } } ),
				stylesYellowUpperShort = new CKEDITOR.style( { element: 'span', styles: { color: '#FF0' } } );

			assert.isTrue( styleItalic.checkElementMatch( newElement( document.getElementById( 'italictitle' ) ), true ), 'Italic Title styles match.' );
			assert.isTrue( styleSubtitle.checkElementMatch( newElement( document.getElementById( 'subtitle' ) ), true ), 'Subtitle styles match.' );
			assert.isTrue( styleSpecialContainer.checkElementMatch( newElement( document.getElementById( 'specialcontainer' ) ), true ), 'Special Container styles match.' );
			assert.isTrue( stylesYellow.checkElementMatch( newElement( document.getElementById( 'yellow' ) ), true ), 'Yellow styles match (short).' );
			assert.isTrue( stylesYellowUpper.checkElementMatch( newElement( document.getElementById( 'yellow' ) ), true ), 'Yellow styles match (long, upper-case).' );
			assert.isTrue( stylesYellowUpperShort.checkElementMatch( newElement( document.getElementById( 'yellow' ) ), true ), 'Yellow styles match (short, upper-case).' );
		}
	} );
} )();
