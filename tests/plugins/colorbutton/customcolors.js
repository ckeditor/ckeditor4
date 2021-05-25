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
		},

		// (#4333)
		'test adding non-hex value to color history results in correctly rendered color box': function() {
			bender.editorBot.create( {
				name: 'editor-non-hex'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' );

				editor.once( 'dialogHide', function() {
					var colorBox;

					txtColorBtn.click();

					colorBox = colorHistoryTools.findInPanel( '.cke_colorhistory_row span.cke_colorbox', txtColorBtn );

					assert.areSame( 'red', colorBox.getStyle( 'background-color' ) );
				} );

				colorHistoryTools.chooseColorFromDialog( editor, txtColorBtn, 'red' );
			} );
		},

		// (#4333)
		'test adding red color in different non-hex formats (name, RGB, RGBA, HSL, HSLA) creates one, red entry in the history': function() {
			bender.editorBot.create( {
				name: 'editor-non-hex-multiple'
			}, function( bot ) {
				assertDialogColor( [
					'red',
					'rgb( 255, 0, 0 )',
					'rgba( 255, 0, 0, 1 )',
					'hsl( 0, 100%, 50% )',
					'hsla( 0, 100%, 50%, 1 )',
					'rgb( 255 0 0 / 100% )',
					'hsl( 0 100% 50% / 1 )'
				], 'red', bot );
			} );
		}
	} );

	function assertDialogColor( inputColors, expectedColor, bot ) {
		var editor = bot.editor,
			colorButton = editor.ui.get( 'TextColor' ),
			colorPromises = CKEDITOR.tools.array.map( inputColors, function( color ) {
				return colorHistoryTools.asyncChooseColorFromDialog( bot, color );
			} );

		CKEDITOR.tools.promise.all( colorPromises ).then( function() {
			resume( function() {
				var colorRow,
					colorBoxes;

				colorButton.click();

				colorRow = colorHistoryTools.findInPanel( '.cke_colorhistory_row', colorButton );
				colorBoxes = colorRow.find( 'span.cke_colorbox' ).toArray();

				assert.areSame( 1, colorBoxes.length, 'There is only one colorbox in the history' );
				assert.areSame( expectedColor, colorBoxes[ 0 ].getStyle( 'background-color' ), 'The colorbox background is correct' );
			} );
		} );

		wait();
	}
} )();
