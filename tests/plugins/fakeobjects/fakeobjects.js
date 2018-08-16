/* bender-tags: editor */
/* bender-ckeditor-plugins: fakeobjects */

'use strict';

// Shorthand for creating a fake object element.
// @returns {CKEDITOR.dom.element}
function fake( editor, elHtml, className, type ) {
	var el = CKEDITOR.dom.element.createFromHtml( elHtml );

	return editor.createFakeElement( el, className || 'foo', type || 'foo' );
}

// Shorthand for creating a fake object element.
// @returns {String} Element's outer HTML.
function fakeHtml( editor, elHtml, className, type ) {
	return fake( editor, elHtml, className, type ).getOuterHtml();
}

bender.editors = {
	editor: {
		name: 'editor1'
	}
};

bender.test( {
	'test downcasting': function() {
		var editor = this.editors.editor;

		editor.editable().setHtml( '<p>' + fakeHtml( editor, '<em>foo</em>' ) + '</p>' );
		assert.areSame( '<p><em>foo</em></p>', editor.getData() );
	},

	// https://dev.ckeditor.com/ticket/11850
	'test downcasting non-editable element': function() {
		var editor = this.editors.editor,
			el = fake( editor, '<em>foo</em>' );

		el.setAttribute( 'contenteditable', 'false' );

		editor.editable().setHtml( '<p>' + el.getOuterHtml() + '</p>' );
		assert.areSame( '<p><em>foo</em></p>', editor.getData() );
	}
} );
