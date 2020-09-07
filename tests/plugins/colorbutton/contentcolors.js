/* bender-tags: editor,colorbutton,1795 */
/* bender-ckeditor-plugins: colorbutton,undo,toolbar,wysiwygarea,colordialog */
/* bender-include: _helpers/tools.js */
/* global colorHistoryTools */

( function() {
	'use strict';

	bender.test( {
		'test color history exists': function() {
			bender.editorBot.create( {
				name: 'editor1',
				config: {
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

				bot.setHtmlWithSelection( '[<p>Moo</p>]' );

				txtColorBtn.click( editor );
				assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorhistory', txtColorBtn ),
					'Color history for txtColor should exist.' );

				bgColorBtn.click( editor );
				assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorhistory', bgColorBtn ),
					'Color history for bgColor should exist.' );
			} );
		},

		'test horizontal rule is visible and history row exists when there are no colors in content': function() {
			bender.editorBot.create( {
				name: 'editor2',
				config: {
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

				bot.setHtmlWithSelection( '[<p>Moo</p>]' );

				txtColorBtn.click( editor );
				assert.isNotNull( colorHistoryTools.findInPanel( 'hr', txtColorBtn ),
					'Horizontal rule for txtColor should be visible.' );
				assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ),
					'Row for txtColor should exist.' );

				bgColorBtn.click( editor );
				assert.isNotNull( colorHistoryTools.findInPanel( 'hr', bgColorBtn ),
					'Horizontal rule should be visible.' );
				assert.isNotNull( colorHistoryTools.findInPanel( '.cke_colorhistory_row', bgColorBtn ),
					'Row for bgColor should exist.' );
			} );
		},

		'test horizontal rule is visible and history row is not empty when there is a color in content': function() {
			bender.editorBot.create( {
				name: 'editor3',
				startupData: '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span>]</p>',
				config: {
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					bgColorBtn = editor.ui.get( 'BGColor' );

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
				name: 'editor4',
				startupData: '<p><span style="color:#ff3333; background-color:#3333ff">Moo</span> and not moo</p>',
				config: {
					language: 'en'
				}
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
				name: 'editor5',
				startupData: '<p><span style="color:#e74c3c">I&#39;m</span> an <span style="color:#3498db">instance</span>' +
				' of <span style="color:#2ecc71">CKEditor</span>.</p>',
				config: {
					removePlugins: 'colordialog',
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					firstColorBox;

				txtColorBtn.click( editor );
				assert.areEqual( 3, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'Number of color tiles is incorrect.' );

				firstColorBox = colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', txtColorBtn );

				assert.areEqual( 'E74C3C', firstColorBox.getAttribute( 'data-value' ), 'Order is incorrect.' );
				assert.areEqual( '26', firstColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
				assert.areEqual( '28', firstColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );

				txtColorBtn.click( editor );
			} );
		},

		'test occurrence number order': function() {
			bender.editorBot.create( {
				name: 'editor6',
				startupData: '<p><span style="color:#e74c3c">I&#39;m</span> <span style="color:#f1c40f">an</span> ' +
				' <span style="color:#3498db">instance</span> of <span style="color:#2ecc71">CKEditor</span>. ' +
				' <span style="color:#2ecc71">Enjoy</span> <span style="color:#2ecc71">my</span> ' +
				' <span style="color:#e74c3c">colors</span>!</p>',
				config: {
					removePlugins: 'colordialog',
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' ),
					firstColorBox,
					yellowColorBox;

				txtColorBtn.click( editor );

				firstColorBox = colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', txtColorBtn );

				assert.areEqual( '2ECC71', firstColorBox.getAttribute( 'data-value' ), 'Order is incorrect.' );
				assert.areEqual( '26', firstColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
				assert.areEqual( '29', firstColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );

				yellowColorBox = colorHistoryTools.findInPanel( '.cke_colorhistory_row [data-value="F1C40F"]', txtColorBtn );

				assert.areEqual( 'Vivid Yellow', yellowColorBox.getAttribute( 'title' ), 'Color label is incorrect.' );
				assert.areEqual( '28', yellowColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
				assert.areEqual( '29', yellowColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );
			} );
		},

		'test more colors than colorsPerRow in the document': function() {
			bender.editorBot.create( {
				name: 'editor7',
				startupData: '<p><span style="color:#1abc9c">H</span>' +
				'<span style="color:#2ecc71">e</span><span style="color:#3498db">l</span><span style="color:#9b59b6">l</span>' +
				'<span style="color:#4e5f70">o</span> <span style="color:#f1c40f">w</span><span style="color:#16a085">o</span>' +
				'<span style="color:#2980b9">r</span><span style="color:#8e44ad">l</span><span style="color:#2c3e50">d</span>' +
				'<span style="color:#f39c12">!</span></p>',
				config: {
					colorButton_colorsPerRow: 4,
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' );

				txtColorBtn.click( editor );

				assert.areEqual( 4, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
					'Tiles number is incorrect.' );
			} );
		},

		'test second row is created if limit allows it': function() {
			bender.editorBot.create( {
				name: 'editor8',
				startupData: '<p><span style="color:#1abc9c">H</span>' +
				'<span style="color:#2ecc71">e</span><span style="color:#3498db">l</span><span style="color:#9b59b6">l</span>' +
				'<span style="color:#4e5f70">o</span> <span style="color:#f1c40f">w</span><span style="color:#16a085">o</span>' +
				'<span style="color:#2980b9">r</span><span style="color:#8e44ad">l</span><span style="color:#2c3e50">d</span>' +
				'<span style="color:#f39c12">!</span></p>',
				config: {
					colorButton_colorsPerRow: 4,
					colorButton_historyRowLimit: 2,
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' );

				txtColorBtn.click( editor );

				assert.areEqual( 2, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn, true ).count(),
					'Tiles number is incorrect.' );
			} );
		},

		'test config.colorbutton_renderContentColors': function() {
			bender.editorBot.create( {
				name: 'editor9',
				startupData: '<p><span style="color:#e74c3c">I&#39;m</span> an <span style="color:#3498db">instance</span>' +
				' of <span style="color:#2ecc71">CKEditor</span>.</p>',
				config: {
					colorButton_renderContentColors: false,
					language: 'en'
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' );

				txtColorBtn.click( editor );

				assert.areEqual( 0, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(), 'Content colors should not be visible.' );
			} );
		}
	} );
} )();
