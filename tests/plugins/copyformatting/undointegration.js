/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting, undo */
/* bender-include: _helpers/tools.js*/
/* bender-ui: collapsed */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedcontent: true
		}
	};


	bender.test( {
		// (#2780)
		'test basic undo integration': function() {
			var editor = this.editor,
				bot = this.editorBot,
				sel = editor.getSelection(),
				el1,
				el2;

			resetEditorStatusAndCheckBasicAsserts( bot );

			el1 = editor.editable().findOne( '#one' );
			el2 = editor.editable().findOne( '#two' );

			for ( var i = 0; i < editor.undoManager.limit; i++ ) {
				sel.selectElement( i % 2 ? el1 : el2 );
				editor.document.fire( 'mouseup', new CKEDITOR.dom.event( {
					button: CKEDITOR.MOUSE_BUTTON_LEFT,
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

			resetEditorStatusAndCheckBasicAsserts( bot );

			bot.execCommand( 'undo' );

			sel.selectElement( editor.editable().findOne( '#one' ) );
			editor.document.fire( 'mouseup', new CKEDITOR.dom.event( {
				button: CKEDITOR.MOUSE_BUTTON_LEFT,
				target: editor.editable()
			} ) );

			assert.isTrue( editor.undoManager.redoable(), 'Editor should has possibility to redo.' );
		}
	} );

	function resetEditorStatusAndCheckBasicAsserts( bot ) {
		var editor = bot.editor;

		bot.setHtmlWithSelection( '<p><span id="one">foo</span> []bar <span id="two">baz</span></p>' );

		editor.undoManager.reset();
		editor.fire( 'saveSnapshot' );

		assert.areSame( 0, editor.undoManager.index, 'There shouldn\'t be any undo steps.' );
		assert.isFalse( editor.undoManager.undoable(), 'Editor should not have possibility to undo.' );
		assert.isFalse( editor.undoManager.redoable(), 'Editor should not have possibility to redo.' );

		editor.insertText( '1' );
		editor.fire( 'saveSnapshot' );

		assert.areSame( 1, editor.undoManager.index, 'There should be only 1 undo step, which is currently active.' );
		assert.isTrue( editor.undoManager.undoable(), 'Editor should have possibility to undo.' );
		assert.isFalse( editor.undoManager.redoable(), 'Editor should not have possibility to redo.' );
	}

} )();
