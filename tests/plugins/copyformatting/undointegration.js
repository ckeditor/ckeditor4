/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting, undo */
/* bender-ui: collapsed */

( function() {
	'use strict';

	var leftMouseButton = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? 1 : CKEDITOR.MOUSE_BUTTON_LEFT;

	bender.editor = {
		config: {
			allowedContent: true
		}
	};


	bender.test( {
		// (#2780)
		'test basic undo integration': function() {
			var editor = this.editor,
				bot = this.editorBot,
				sel = editor.getSelection(),
				spans;

			resetUndoAndCreateFirstSnapshot( bot );

			spans = editor.editable().find( 'span' );
			for ( var i = 0; i < editor.undoManager.limit; i++ ) {
				sel.selectElement( spans.getItem( i % 2 ) );
				editor.document.fire( 'mouseup', new CKEDITOR.dom.event( {
					button: leftMouseButton,
					target: editor.editable()
				} ) );
			}

			assert.areSame( 1, editor.undoManager.index, 'There shouldn\'t be new undo steps and editor should remain on the 1st step.' );
			assert.isTrue( editor.undoManager.undoable(), 'Editor should have a possibility to undo.' );
		},
		// (#2780)
		'test basic redo integration': function() {
			var editor = this.editor,
				bot = this.editorBot,
				sel = editor.getSelection();

			resetUndoAndCreateFirstSnapshot( bot );

			bot.execCommand( 'undo' );

			sel.selectElement( editor.editable().find( 'span' ).getItem( 0 ) );
			editor.document.fire( 'mouseup', new CKEDITOR.dom.event( {
				button: leftMouseButton,
				target: editor.editable()
			} ) );

			assert.isTrue( editor.undoManager.redoable(), 'Editor should has possibility to redo.' );
		}
	} );

	function resetUndoAndCreateFirstSnapshot( bot ) {
		var editor = bot.editor;

		bot.setHtmlWithSelection( '<p><span>foo</span> []bar <span>baz</span></p>' );

		editor.undoManager.reset();
		editor.fire( 'saveSnapshot' );

		editor.insertText( '1' );
		editor.fire( 'saveSnapshot' );
	}

} )();
