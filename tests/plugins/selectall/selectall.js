/* bender-tags: selection */
/* bender-ckeditor-plugins: wysiwygarea,selectall,sourcearea */

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
		},
		editorSource: {
			name: 'test_source_mode',
			startupData: '<p>foo</p><p>bar</p>',
			config: {
				startupMode: 'source'
			}
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
		},

		'test selectall in source view': function() {
			var editor = this.editors.editorSource;

			editor.execCommand( 'selectAll' );

			assert.areSame( 'source', editor.mode, 'editor.mode' );
			if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 8 ) {
				assert.areSame( document.selection.createRange().text.length, 20 );
			} else {
				assert.areSame( CKEDITOR.document.getActive().$.selectionStart, 0 );
				assert.areSame( CKEDITOR.document.getActive().$.selectionEnd, 20 );
			}
		}
	} );

} )();