/* bender-tags: editor,colorbutton,colordialog,1795 */
/* bender-ckeditor-plugins: colorbutton,colordialog,undo,toolbar,wysiwygarea */
/* bender-include: _helpers/tools.js */
/* global colorHistoryTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language: 'en'
		}
	};

	bender.test( {
		'test row is not empty after choosing custom text color': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );

			editor.once( 'dialogHide', function() {
				txtColorBtn.click( editor );

				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'Row shouldn\'t be empty.' );
			} );

			colorHistoryTools.chooseColorFromDialog( editor, txtColorBtn, '#33ff33' );
		},

		'test row is not empty after choosing custom background color': function() {
			var editor = this.editor,
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );

			editor.once( 'dialogHide', function() {
				bgColorBtn.click( editor );

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
				name: 'editor1',
				startupData: '<p><span style="color:#ff3333; background-color:#3333ff">Moo</span>and not moo</p>'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

				txtColorBtn.click( editor );
				colorHistoryTools.findInPanel( '[data-value="1ABC9C"]', txtColorBtn ).$.click();

				assert.areEqual( 2, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'New text color tile should appear.' );

				bgColorBtn.click( editor );
				colorHistoryTools.findInPanel( '[data-value="D35400"]', bgColorBtn ).$.click();

				assert.areEqual( 2, colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ).getChildCount(),
					'New background color tile should appear.' );
			} );
		}
	} );
} )();
