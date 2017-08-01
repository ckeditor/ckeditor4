/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: divarea */

bender.editor = true;

bender.test( {
	'test lost focus in editor after click': function() {
		// Assert for IE8 returns different selection comparing to other browsers.
		// IE8: <p>foo [<strong>bar]</strong></p>
		// Others: <p>foo [<strong>bar</strong>]</p>
		if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 8 || CKEDITOR.env.safari ) {
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
