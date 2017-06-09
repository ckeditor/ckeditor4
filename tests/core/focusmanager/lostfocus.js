/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: divarea */

bender.editor = {};

bender.test( {
	'test lost focus in editor after click': function() {
		// Ticket: https://dev.ckeditor.com/ticket/17020
		// Test for checking if focusmanager reset ranges in divarea editor (bug introduced in https://dev.ckeditor.com/ticket/13446).
		// It's necessary to keep focus in browser to get proper result of test. Focus in console or other window will cause test to pass.
		var editor = this.editor;
		editor.focus();
		bender.tools.setHtmlWithSelection( editor, '<p>[foo] <strong>bar</strong></p>' );
		CKEDITOR.document.getById( 'focusable' ).focus();
		var selection = editor.getSelection();
		selection.selectElement( editor.editable().findOne( 'strong' ) );
		wait( function() {
			// refresh selection
			var sel = editor.getSelection();
			sel.reset();
			assert.isInnerHtmlMatching( '<p>foo [<strong>bar</strong>]@</p>',
					bender.tools.range.getWithHtml( editor.editable(), sel.getRanges()[ 0 ] ) );
		}, 210 );

	}
} );
