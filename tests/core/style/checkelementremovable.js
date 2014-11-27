/* bender-tags: editor,unit */

'use strict';

var doc = CKEDITOR.document,
	playground;

bender.test( {
	setUp: function() {
		playground = doc.getById( 'playground' );
	},

	test_checkElementRemovable1: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<b>Test</b>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'b' } );

		assert.isTrue( style.checkElementRemovable( element ) );
	},

	test_checkElementRemovable2: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<b>Test</b>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'i' } );

		assert.isFalse( style.checkElementRemovable( element ) );
	},

	test_checkElementRemovable3: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<b>Test</b>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'b', attributes: { lang: 'pt' } } );

		assert.isTrue( style.checkElementRemovable( element ) );
	},

	test_checkElementRemovable4: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<b>Test</b>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'b', attributes: { lang: 'pt' } } );

		assert.isFalse( style.checkElementRemovable( element, true ) );
	},

	test_checkElementRemovable5: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<span lang="pt" style="color : #fff">Test</span>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'span', attributes: { lang: 'pt' }, style: { color: '#ffffff' } } );

		assert.isTrue( style.checkElementRemovable( element, true ) );
	},

	test_checkElementRemovable6: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<span lang="pt" style="color : #fff">Test</span>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'span', attributes: { lang: 'pt' }, style: { color: '#fffff0' } } );

		assert.isTrue( style.checkElementRemovable( element, true ) );
	},

	test_checkElementRemovable7: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<span lang="pt" style="color : #fff">Test</span>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'span', attributes: { lang: 'fr' }, style: { color: '#ffffff' } } );

		assert.isFalse( style.checkElementRemovable( element, true ) );
	},

	test_checkElementRemovable8: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<span lang="pt" style="font-size: 10px">Test</span>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'span', attributes: { lang: 'pt' , style: 'font-size:10px;' } } );

		assert.isTrue( style.checkElementRemovable( element, true ) );
	},

	test_checkElementRemovable_fontFamily: function() {
		var element = CKEDITOR.dom.element.createFromHtml( '<span style="font-family: georgia,  serif">Test Font</span>', doc );
		playground.append( element );

		var style = new CKEDITOR.style( { element: 'span', styles: { 'font-family': '#(family)' } }, { family: 'Georgia, serif;' } );
		assert.isTrue( style.checkElementRemovable( element, true ) );
	}
} );