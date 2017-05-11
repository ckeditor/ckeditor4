/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: divarea */

bender.editor = {
	extraPlugins: 'divarea',
	allowedContent: true
};

bender.test({
	'test lost focus in editor after click': function() {
		// #17020 - test for checking if focusmanager reset ranges in divarea editor (bug introduced in #13446).
		// It's necessary to keep focus in browser to get proper result of test. Focus in console or other window will cause test to pass.
		var editor = this.editor;
		editor.focus();
		bender.tools.setHtmlWithSelection( editor, '<p>[foo] <strong>bar</strong></p>' );
		CKEDITOR.document.getById('focusable').focus();
		var element = editor.editable().findOne('strong');
		var selection = editor.getSelection();
		selection.selectElement(element);

		wait( function() {
			assert.areSame('Range', editor.window.$.getSelection().type );
		}, 200);

	}
});
