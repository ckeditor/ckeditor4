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
			var eventsRecorder;
			bender.editorBot.create( {
				name: 'testall_source_editor',
				startupData: '<p>foo</p><p>bar</p>',
				config: {
					startupMode: 'source',
					on: {
						pluginsLoaded: function() {
							eventsRecorder = bender.tools.recordEvents( this, [ 'beforeSetMode', 'beforeModeUnload', 'mode' ] );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;
				editor.execCommand( 'selectAll' );

				eventsRecorder.assert( [ 'beforeSetMode', 'mode' ] );
				assert.areSame( 'source', editor.mode, 'editor.mode' );
				if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 8 ) {
					assert.areSame( document.selection.createRange().text.length, 20 );
				} else {
					assert.areSame( CKEDITOR.document.getActive().$.selectionStart, 0 );
					assert.areSame( CKEDITOR.document.getActive().$.selectionEnd, 20 );
				}
			} );
		}
	} );

} )();