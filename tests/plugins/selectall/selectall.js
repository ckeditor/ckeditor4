/* bender-tags: selection */
/* bender-ckeditor-plugins: selectall */

( function() {
	'use strict';

	var htmlMatchingOpts = {
		compareSelection: true,
		normalizeSelection: true
	};

	// Either outside or inside paragraphs.
	var acceptableResults = /^(\[<p>foo(<br \/>)?<\/p><p>bar<\/p>\]|<p>\[foo(<br \/>)?<\/p><p>bar\]<\/p>)$/;

	bender.editors = {
		editorFramed: {
			name: 'test_editor_framed'
		},
		editorInline: {
			creator: 'inline',
			name: 'test_editor_inline'
		}
	};

	bender.test( {
		'test selectall in framed editor': function() {
			var editor = this.editors.editorFramed;

			editor.editable().setHtml( '<p>foo</p><p>bar</p>' );

			editor.execCommand( 'selectAll' );
			assert.isMatching(
				acceptableResults,
				bender.tools.html.prepareInnerHtmlForComparison( bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts )
			);
		},

		'test selectall in inline editor': function() {
			var editor = this.editors.editorInline;

			editor.editable().setHtml( '<p>foo</p><p>bar</p>' );

			editor.execCommand( 'selectAll' );
			assert.isMatching(
				acceptableResults,
				bender.tools.html.prepareInnerHtmlForComparison( bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts )
			);
		}
	} );

} )();