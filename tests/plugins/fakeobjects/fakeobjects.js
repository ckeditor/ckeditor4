/* bender-tags: editor,unit */
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

bender.test( {
	'async:init': function() {
		var that = this;

		bender.tools.setUpEditors( {
			editor: {
				name: 'editor1'
			},
		}, function( editors, bots ) {
			that.editorBots = bots;
			that.editors = editors;
			that.callback();
		} );
	},

	'test downcasting': function() {
		var editor = this.editors.editor;

		editor.editable().setHtml( '<p>' + fakeHtml( editor, '<em>foo</em>' ) + '</p>' );
		assert.areSame( '<p><em>foo</em></p>', editor.getData() );
	},

	// #11850
	'test downcasting non-editable element': function() {
		var editor = this.editors.editor,
			el = fake( editor, '<em>foo</em>' );

		el.setAttribute( 'contenteditable', 'false' );

		editor.editable().setHtml( '<p>' + el.getOuterHtml() + '</p>' );
		assert.areSame( '<p><em>foo</em></p>', editor.getData() );
	}
} );