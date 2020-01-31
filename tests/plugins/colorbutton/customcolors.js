/* bender-tags: editor,colorbutton,colordialog,1795 */
/* bender-ckeditor-plugins: colorbutton,colordialog,undo,toolbar,wysiwygarea */
/* bender-include: _helpers/tools.js */
/* global colorHistoryTools */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test custom colors row exists': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '[<p>Moo</p>]' );

			txtColorBtn.click( editor );
			assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorcustom_row', txtColorBtn ), 'Custom colors row should exist.' );

			bgColorBtn.click( editor );
			assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorcustom_row', bgColorBtn ), 'Custom colors row should exist.' );
		},

		'test label is hidden and row is empty before any color was chosen': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '[<p>Moo</p>]' );

			txtColorBtn.click( editor );
			assert.isFalse( colorHistoryTools.findInPanel( '.cke_colorcustom_label', txtColorBtn ).isVisible(), 'Label shouldn\'t be visible.' );
			assert.areEqual( 0, colorHistoryTools.findInPanel( '.cke_colorcustom_row', txtColorBtn ).getChildCount(), 'Row should be empty.' );

			bgColorBtn.click( editor );
			assert.isFalse( colorHistoryTools.findInPanel( '.cke_colorcustom_label', bgColorBtn ).isVisible(), 'Label shouldn\'t be visible.' );
			assert.areEqual( 0, colorHistoryTools.findInPanel( '.cke_colorcustom_row', bgColorBtn ).getChildCount(), 'Row should be empty.' );
		},

		'test label is visible and row is not empty after choosing custom text color': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			this.editorBot.setHtmlWithSelection( '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span>]</p>' );

			editor.once( 'dialogHide', function() {
				txtColorBtn.click( editor );

				assert.isTrue( colorHistoryTools.findInPanel( '.cke_colorcustom_label', txtColorBtn ).isVisible(), 'Label should be visible.' );
				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorcustom_row', txtColorBtn ).getChildCount(), 'Row shouldn\'t be empty.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, txtColorBtn, '#33ff33' );
		},

		'test label is visible and row is not empty after choosing custom background color': function() {
			var editor = this.editor,
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span>]</p>' );

			editor.once( 'dialogHide', function() {
				bgColorBtn.click( editor );

				assert.isTrue( colorHistoryTools.findInPanel( '.cke_colorcustom_row', bgColorBtn ).isVisible(), 'Label should be visible.' );
				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorcustom_row', bgColorBtn ).getChildCount(), 'Row shouldn\'t be empty.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, bgColorBtn, '#33ff33' );
		},

		'test custom color tiles don\'t disappear when they are no longer present in the document': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );
			editor.once( 'dialogHide', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>[Moo]</p>' );
				txtColorBtn.click();

				assert.isTrue( colorHistoryTools.findInPanel( '.cke_colorcustom_label', txtColorBtn ).isVisible(), 'Label should be visible.' );
				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorcustom_row', txtColorBtn ).getChildCount(), 'Row shouldn\'t be empty.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, txtColorBtn, '#33ff33' );
		},

		'test custom color tiles work': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				yellowTile;

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );

			editor.once( 'dialogHide', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>[Moo]</p>' );

				txtColorBtn.click( editor );
				colorHistoryTools.findInPanel( '.cke_colorcustom_row .cke_colorbox', txtColorBtn ).$.click();

				assert.areEqual( '<p><span style="color:#f1c40f">Moo</span></p>', editor.getData() );

				yellowTile = colorHistoryTools.findInPanel( ' .cke_colorcustom_row [data-value="F1C40F"]', txtColorBtn );

				assert.areEqual( 'Vivid Yellow', yellowTile.getAttribute( 'title' ), 'Color label is incorrect.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, txtColorBtn, '#F1C40F' );
		}
	} );
} )();
