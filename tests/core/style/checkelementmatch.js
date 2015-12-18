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
				styleSubtitle = new CKEDITOR.style( { element: 'h3', attributes: { 'style': 'color:#aaa;font-style:italic;' } } ),
				styleSpecialContainer = new CKEDITOR.style( { element: 'div', attributes: { 'style': 'background:#eee;border:1px solid #ccc;padding:5px 10px;' } } );

			assert.isTrue( styleItalic.checkElementMatch( newElement( document.getElementById( 'italictitle' ) ), true ), 'Italic Title styles does not match.' );
			assert.isTrue( styleSubtitle.checkElementMatch( newElement( document.getElementById( 'subtitle' ) ), true ), 'Subtitle styles does not match.' );
			assert.isTrue( styleSpecialContainer.checkElementMatch( newElement( document.getElementById( 'specialcontainer' ) ), true ), 'Special Container styles does not match.' );
		}
	} );
} )();
