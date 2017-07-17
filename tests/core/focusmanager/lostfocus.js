/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: divarea */

bender.editor = true;

bender.test( {
	'test lost focus in editor after click': function() {
		// Test for checking if focusmanager reset ranges in divarea editor (bug introduced in https://dev.ckeditor.com/ticket/13446).
		// It's necessary to keep focus in a browser to get proper result of test. Having focus in a console or other window will cause test to
		// pass (https://dev.ckeditor.com/ticket/17020).

		// Assert for IE8 returns different selection comparing to other browsers.
		// Normal browser <p>foo [<strong>bar</strong>]</p>
		// IE8: <p>foo [<strong>bar]</strong></p>
		if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 8 ) {
			assert.ignore();
		}

		var editor = this.editor;
		editor.focus();
		bender.tools.selection.setWithHtml( editor, '<p>[foo] <strong>bar</strong></p>' );
		CKEDITOR.document.getById( 'focusable' ).focus();
		editor.getSelection().selectElement( editor.editable().findOne( 'strong' ) );
		wait( function() {
			// Refresh selection.
			editor.getSelection().reset();
			assert.isInnerHtmlMatching( '<p>foo [<strong>bar</strong>]@</p>',
				bender.tools.selection.getWithHtml( editor ), {
					compareSelection: true,
					normalizeSelection: true
				} );
		}, 210 );
	}
} );
