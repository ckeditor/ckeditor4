/* bender-tags: editor,colorbutton, 1795 */
/* bender-ckeditor-plugins: colorbutton,undo,toolbar,wysiwygarea */
/* bender-include: _helpers/tools.js */
/* global colorHistoryTools */

( function() {
	'use strict';

	// bender.editor = true;

	bender.test( {
		'test color history row exists': function() {
			bender.editorBot.create( {
				name: 'editor1'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

				bot.setHtmlWithSelection( '[<p>Moo</p>]' );

				txtColorBtn.click( editor );
				assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ),
					'Color history row for txtColor should exist.' );

				bgColorBtn.click( editor );
				assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ),
					'Color history row for bgColor should exist.' );
			} );
		},

		'test horizontal rule is hidden and row is empty when there are no colors in content': function() {
			bender.editorBot.create( {
				name: 'editor2'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

				bot.setHtmlWithSelection( '[<p>Moo</p>]' );

				txtColorBtn.click( editor );
				assert.isFalse( colorHistoryTools.findInPanel( '.cke_colorhistory_separator', txtColorBtn ).isVisible(),
					'Horizontal rule for txtColor shouldn\'t be visible.' );
				assert.areEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'Row for txtColor should be empty.' );

				bgColorBtn.click( editor );
				assert.isFalse( colorHistoryTools.findInPanel( '.cke_colorhistory_separator', bgColorBtn ).isVisible(),
					'Horizontal rule shouldn\'t be visible.' );
				assert.areEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ).getChildCount(),
					'Row for bgColor should be empty.' );
			} );
		},

		'test horizontal rule is visible and history row is not empty when there is a color in content': function() {
			bender.editorBot.create( {
				name: 'editor3'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

				bot.setHtmlWithSelection( '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span>]</p>' );

				txtColorBtn.click( editor );
				assert.isTrue( colorHistoryTools.findInPanel( 'hr', txtColorBtn ).isVisible(),
					'Horizontal rule for txtColor should be visible.' );
				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'Row for txtColor shouldn\'t be empty.' );

				bgColorBtn.click( editor );
				assert.isTrue( colorHistoryTools.findInPanel( 'hr', bgColorBtn ).isVisible(),
					'Horizontal rule for bgColor should be visible.' );
				assert.areNotEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ).getChildCount(),
					'Row for bgColor shouldn\'t be empty.' );
			} );
		},

		'test content color tiles work': function() {
			bender.editorBot.create( {
				name: 'editor4'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

				bot.setHtmlWithSelection( '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span> and not moo]</p>' );

				txtColorBtn.click( editor );
				colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', txtColorBtn ).$.click();

				assert.areEqual( '<p><span style="color:#ff3333"><span style="background-color:#3333ff">Moo</span> and not moo</span></p>',
					editor.getData(), 'Text color should change.' );

				bgColorBtn.click( editor );
				colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', bgColorBtn ).$.click();

				assert.areEqual( '<p><span style="color:#ff3333"><span style="background-color:#3333ff">Moo and not moo</span></span></p>',
					editor.getData(), 'Background color should change.' );
			} );
		},

		'test occurrence order': function() {
			bender.editorBot.create( {
				name: 'editor6'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					firstColorBox;

				bot.setHtmlWithSelection( '<p><span style="color:#e74c3c">I&#39;m</span> an <span style="color:#3498db">instance</span>' +
					' of <span style="color:#2ecc71">CKEditor</span>.</p>' );

				txtColorBtn.click( editor );
				assert.areEqual( 3, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'Number of color tiles is incorrect.' );

				firstColorBox = colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', txtColorBtn );

				assert.areEqual( 'E74C3C', firstColorBox.getAttribute( 'data-value' ), 'Order is incorrect.' );
				assert.areEqual( '1', firstColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
				assert.areEqual( '3', firstColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );

				txtColorBtn.click( editor );
			} );
		},

		'test occurrence number order': function() {
			bender.editorBot.create( {
				name: 'editor7'
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					firstColorBox,
					yellowColorBox;

				bot.setHtmlWithSelection( '<p><span style="color:#e74c3c">I&#39;m</span> <span style="color:#f1c40f">an</span> ' +
					' <span style="color:#3498db">instance</span> of <span style="color:#2ecc71">CKEditor</span>. ' +
					' <span style="color:#2ecc71">Enjoy</span> <span style="color:#2ecc71">my</span> ' +
					' <span style="color:#e74c3c">colors</span>!</p>' );

				txtColorBtn.click( editor );

				firstColorBox = colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', txtColorBtn );

				assert.areEqual( '2ECC71', firstColorBox.getAttribute( 'data-value' ), 'Order is incorrect.' );
				assert.areEqual( '1', firstColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
				assert.areEqual( '4', firstColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );

				yellowColorBox = colorHistoryTools.findInPanel( '.cke_colorhistory_row [data-value="F1C40F"]', txtColorBtn );

				assert.areEqual( 'Vivid Yellow', yellowColorBox.getAttribute( 'title' ), 'Color label is incorrect.' );
				assert.areEqual( '3', yellowColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
				assert.areEqual( '4', yellowColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );
			} );
		},

		'test more colors than colorsPerRow in the document': function() {
			bender.editorBot.create( {
				name: 'editor8',
				config: {
					colorButton_colorsPerRow: 4
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' );

				bot.setHtmlWithSelection( '<p><span style="color:#1abc9c">H</span>' +
					'<span style="color:#2ecc71">e</span><span style="color:#3498db">l</span><span style="color:#9b59b6">l</span>' +
					'<span style="color:#4e5f70">o</span> <span style="color:#f1c40f">w</span><span style="color:#16a085">o</span>' +
					'<span style="color:#2980b9">r</span><span style="color:#8e44ad">l</span><span style="color:#2c3e50">d</span>' +
					'<span style="color:#f39c12">!</span></p>' );

				txtColorBtn.click( editor );

				assert.areEqual( 4, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(), 'Tiles number is incorrect.' );
			} );
		},

		'test new row is created if limit allows it': function() {
			bender.editorBot.create( {
				name: 'editor9',
				config: {
					colorButton_colorsPerRow: 4,
					colorbutton_historyRowLimit: 2
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' );

				bot.setHtmlWithSelection( '<p><span style="color:#1abc9c">H</span>' +
					'<span style="color:#2ecc71">e</span><span style="color:#3498db">l</span><span style="color:#9b59b6">l</span>' +
					'<span style="color:#4e5f70">o</span> <span style="color:#f1c40f">w</span><span style="color:#16a085">o</span>' +
					'<span style="color:#2980b9">r</span><span style="color:#8e44ad">l</span><span style="color:#2c3e50">d</span>' +
					'<span style="color:#f39c12">!</span></p>' );

				txtColorBtn.click( editor );

				assert.areEqual( 4, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(), 'Tiles number is incorrect.' );
			} );
		}
	} );
} )();
