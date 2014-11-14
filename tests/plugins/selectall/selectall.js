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

	bender.test( {
		'async:init': function() {
			var that = this;
			bender.tools.setUpEditors( {
				editorFramed: {
					name: 'test_editor_framed'
				},
				editorInline: {
					creator: 'inline',
					name: 'test_editor_inline'
				}
			}, function( editors, bots ) {
				that.editorBotInline = bots.editorInline;
				that.editorInline = editors.editorInline;
				that.editorBotFramed = bots.editorFramed;
				that.editorFramed = editors.editorFramed;
				that.callback();
			} );
		},

		'test selectall in framed editor': function() {
			var editor = this.editorFramed;

			editor.editable().setHtml( '<p>foo</p><p>bar</p>' );

			editor.execCommand( 'selectAll' );
			assert.isMatching(
				acceptableResults,
				bender.tools.html.prepareInnerHtmlForComparison( bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts )
			);
		},

		'test selectall in inline editor': function() {
			var editor = this.editorInline;

			editor.editable().setHtml( '<p>foo</p><p>bar</p>' );

			editor.execCommand( 'selectAll' );
			assert.isMatching(
				acceptableResults,
				bender.tools.html.prepareInnerHtmlForComparison( bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts )
			);
		}
	} );

} )();