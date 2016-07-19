/* bender-tags: unit,style */

( function() {

	'use strict';

	bender.test( {

		// #14252
		'test styles color attribute normalization': function() {
			var styleItalic = new CKEDITOR.style( { element: 'h2', attributes: { 'style': 'font-style:italic;' } } ),
				styleSubtitle = new CKEDITOR.style( { element: 'h3', attributes: { 'style': 'color:#a1a2a3;font-style:italic;' } } ),
				styleSpecialContainer = new CKEDITOR.style( { element: 'div', attributes: { 'style': 'background:#eee;border:1px solid #ccc;padding:5px 10px;' } } ),
				stylesYellow = new CKEDITOR.style( { element: 'span', styles: { color: '#ff0' } } ),
				stylesYellowUpper = new CKEDITOR.style( { element: 'span', styles: { color: '#FFFF00' } } ),
				stylesYellowUpperShort = new CKEDITOR.style( { element: 'span', styles: { color: '#FF0' } } );

			assert.isTrue( styleItalic.checkElementMatch( CKEDITOR.document.getById( 'italictitle' ), true ), 'Italic Title styles match.' );
			assert.isTrue( styleSubtitle.checkElementMatch( CKEDITOR.document.getById( 'subtitle' ), true ), 'Subtitle styles match.' );
			assert.isTrue( styleSpecialContainer.checkElementMatch( CKEDITOR.document.getById( 'specialcontainer' ), true ), 'Special Container styles match.' );
			assert.isTrue( stylesYellow.checkElementMatch( CKEDITOR.document.getById( 'yellow' ), true ), 'Yellow styles match (short).' );
			assert.isTrue( stylesYellowUpper.checkElementMatch( CKEDITOR.document.getById( 'yellow' ), true ), 'Yellow styles match (long, upper-case).' );
			assert.isTrue( stylesYellowUpperShort.checkElementMatch( CKEDITOR.document.getById( 'yellow' ), true ), 'Yellow styles match (short, upper-case).' );
		},
		'test styles font-family ignore quotes': function() {
			var styleFontMatch = new CKEDITOR.style( { element: 'span', attributes: { 'style': 'font-family:Univers LT Std;' } } ),
				styleFontNoMatch = new CKEDITOR.style( { element: 'span', attributes: { 'style': 'font-family:Verdana;' } } );
			assert.isTrue( styleFontMatch.checkElementMatch( CKEDITOR.document.getById( 'font' ), true ), 'Font styles match.' );
			assert.isFalse( styleFontNoMatch.checkElementMatch( CKEDITOR.document.getById( 'font' ), true ), 'Font styles match.' );
		}
	} );
} )();
