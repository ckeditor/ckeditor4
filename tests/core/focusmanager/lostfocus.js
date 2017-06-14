/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: divarea */

// Assert for IE8 returns different selection comparing to other browsers.
// Normal browser <p>foo [<strong>bar</strong>]</p>
// IE8: <p>foo [<strong>bar]</strong></p>
if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 8 ) {
	bender.ignore();
}

bender.editor = {};

bender.test( {
	'test lost focus in editor after click': function() {
		// Test for checking if focusmanager reset ranges in divarea editor (bug introduced in https://dev.ckeditor.com/ticket/13446).
		// It's necessary to keep focus in browser to get proper result of test. Focus in console or other window will cause test to
		// pass (https://dev.ckeditor.com/ticket/17020).
		var editor = this.editor;
		editor.focus();
		bender.tools.setHtmlWithSelection( editor, '<p>[foo] <strong>bar</strong></p>' );
		CKEDITOR.document.getById( 'focusable' ).focus();
		var selection = editor.getSelection();
		selection.selectElement( editor.editable().findOne( 'strong' ) );
		wait( function() {
			// Refresh selection.
			var sel = editor.getSelection();
			sel.reset();
			assert.isInnerHtmlMatching( '<p>foo [<strong>bar</strong>]@</p>',
				bender.tools.selection.getWithHtml( editor ), {
					compareSelection: true,
					normalizeSelection: true
				} );
		}, 210 );

	}
} );
