/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting, undo */
/* bender-include: _helpers/tools.js*/

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedcontent: true
		}
	};

	bender.test( {
		// (#2780)
		'test undo integration': function() {
			var editor = this.editor,
				bot = this.editorBot,
				sel = editor.getSelection(),
				el1,
				el2;

			assert.areSame( 0, editor.undoManager.index, 'There shouldn\'t be any undo steps.' );

			bot.setHtmlWithSelection( '<p><span id="one">foo</span> []bar <span id="two">baz</span></p>' );
			editor.insertText( '1' );

			assert.areSame( 1, editor.undoManager.index, 'There should be only 1 undo step.' );

			el1 = editor.editable().findOne( '#one' );
			el2 = editor.editable().findOne( '#two' );

			for ( var i = 0; i < editor.undoManager.limit; i++ ) {
				sel.selectElement( i % 2 ? el1 : el2 );
				editor.document.fire( 'mouseup', new CKEDITOR.dom.event( {
					button: CKEDITOR.MOUSE_BUTTON_LEFT
				} ) );
			}

			assert.areSame( 1, editor.undoManager.index, 'There shouldn\'t be new undo steps.' );
			assert.isTrue( editor.undoManager.undoable(), 'Editor should has possibility to undo.' );

		}
	} );

} )();
