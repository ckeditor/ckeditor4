/* bender-tags: editor,colorbutton,colordialog,1795 */
/* bender-ckeditor-plugins: colorbutton,colordialog,undo,toolbar,wysiwygarea */
/* bender-include: _helpers/tools.js */
/* global colorHistoryTools */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test color history row exists': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '[<p>Moo</p>]' );

			txtColorBtn.click( editor );
			assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ),
				'Color history row for txtColor should exist.' );

			bgColorBtn.click( editor );
			assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ),
				'Color history row for bgColor should exist.' );
		},

		'test horizontal rule is hidden and row is empty before any color was chosen': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '[<p>Moo</p>]' );

			txtColorBtn.click( editor );
			assert.isFalse( colorHistoryTools.findInPanel( 'hr', txtColorBtn ).isVisible(), 'Horizontal rule shouldn\'t be visible.' );
			assert.areEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
				'Row should be empty.' );

			bgColorBtn.click( editor );
			assert.isFalse( colorHistoryTools.findInPanel( 'hr', bgColorBtn ).isVisible(), 'Horizontal rule shouldn\'t be visible.' );
			assert.areEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ).getChildCount(),
				'Row should be empty.' );
		},

		'test horizontal rule is visible and row is not empty after choosing custom text color': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );

			editor.once( 'dialogHide', function() {
				txtColorBtn.click( editor );

				assert.isTrue( colorHistoryTools.findInPanel( 'hr', txtColorBtn ).isVisible(), 'Horizontal rule should be visible.' );
				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'Row shouldn\'t be empty.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, txtColorBtn, '#33ff33' );
		},

		'test horizontal rule is visible and row is not empty after choosing custom background color': function() {
			var editor = this.editor,
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );

			editor.once( 'dialogHide', function() {
				bgColorBtn.click( editor );

				assert.isTrue( colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ).isVisible(),
					'Horizontal rule should be visible.' );
				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ).getChildCount(),
					'Row shouldn\'t be empty.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, bgColorBtn, '#33ff33' );
		},

		'test custom color boxes don\'t disappear when they are no longer present in the document': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );
			editor.once( 'dialogHide', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>[Moo]</p>' );
				txtColorBtn.click();

				assert.isTrue( colorHistoryTools.findInPanel( 'hr', txtColorBtn ).isVisible(), 'Horizontal rule should be visible.' );
				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'Row shouldn\'t be empty.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, txtColorBtn, '#33ff33' );
		},

		'test custom color boxes work': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				yellowColorBox;

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );

			editor.once( 'dialogHide', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>[Moo]</p>' );

				txtColorBtn.click( editor );
				colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', txtColorBtn ).$.click();

				assert.areEqual( '<p><span style="color:#f1c40f">Moo</span></p>', editor.getData(),
					'Color box from color history should apply color change.' );

				yellowColorBox = colorHistoryTools.findInPanel( ' .cke_colorhistory_row [data-value="F1C40F"]', txtColorBtn );

				assert.areEqual( 'Vivid Yellow', yellowColorBox.getAttribute( 'title' ), 'Color box label is incorrect.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, txtColorBtn, '#F1C40F' );
		},

		'test new tiles are added when new color is picked and there are other colors in document': function() {
			bender.editorBot.create( {
				name: 'editor1'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

				bot.setHtmlWithSelection( '<p><span style="color:#ff3333; background-color:#3333ff">Moo</span>[ and not moo]</p>' );

				txtColorBtn.click( editor );
				colorHistoryTools.findInPanel( '[data-value="1ABC9C"]', txtColorBtn ).$.click();

				assert.areEqual( 2, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'New text color tile should appear.' );

				bgColorBtn.click( editor );
				colorHistoryTools.findInPanel( '[data-value="D35400"]', bgColorBtn ).$.click();

				assert.areEqual( 2, colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ).getChildCount(),
					'New background color tile should appear.' );
			} );
		},
	} );
} )();
