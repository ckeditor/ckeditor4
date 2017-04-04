/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: link,clipboard,pastetext,pastefromword */
/* bender-include: _helpers/pasting.js */
/* global assertPasteCommand, assertPasteNotification, testResetScenario */

( function() {
	'use strict';

	bender.editors = {
		divarea: {
			config: {
				extraPlugins: 'divarea',
				pasteFilter: null,
				language: 'en'
			}
		},

		classic: {
			config: {
				pasteFilter: null,
				language: 'en'
			}
		},

		inline: {
			creator: 'inline',
			config: {
				pasteFilter: null,
				language: 'en'
			}
		}
	};

	var pasteDataTemplate = {
			dataValue: '<a href="http://ckeditor.com">Foobar</a>'
		},
		expectedTemplate = {
			text: {
				type: 'text',
				content: '<p>Foobar</p>'
			},
			html: {
				type: 'html',
				content: '<p><a href="http://ckeditor.com">Foobar</a></p>'
			},
			test: {
				type: 'test',
				content: '<p><a href="http://ckeditor.com">Foobar</a></p>'
			}
		},
		createPasteData = function() {
			return CKEDITOR.tools.copy( pasteDataTemplate );
		},
		createExpected = function( type ) {
			return CKEDITOR.tools.copy( expectedTemplate[ type ] );
		},
		tests = {
			'test simple pasting': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData(),
						expected = createExpected( 'html' );

					assertPasteCommand( editor, expected, null, pasteData );
				} );
			},

			'test pasting passed content (text)': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = createExpected( 'html' );

					assertPasteCommand( editor, expected, expected.content, {} );
				} );
			},

			'test pasting passed content (object property)': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = createExpected( 'html' );

					assertPasteCommand( editor, expected, { dataValue: expected.content }, {} );
				} );
			},

			'test forcing paste type': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData(),
						expected = createExpected( 'test' );

					assertPasteCommand( editor, expected, { type: 'test' }, pasteData );
				} );
			},

			'test resetting forced paste type': function( editor, bot ) {
				bot.setData( '', function() {
					var expectedHtml = createExpected( 'html' ),
						expectedText = createExpected( 'text' ),
						queue1 = [
							{
								cmd: 'paste',
								type: 'html',
								dataValue: expectedHtml.content
							},

							{
								cmd: 'pastefromword',
								type: 'html',
								dataValue: expectedHtml.content
							},

							{
								cmd: 'pastetext',
								type: 'text',
								dataValue: expectedText.content
							}
						],
						queue2 = [
							{
								cmd: 'pastetext',
								type: 'text',
								dataValue: expectedText.content
							},

							{
								cmd: 'paste',
								type: 'html',
								dataValue: expectedHtml.content
							}
						];

					testResetScenario( editor, queue1 );
					testResetScenario( editor, queue2 );
				} );
			},

			'test prevented direct access to clipboard': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData(),
						// CTRL + V
						keystroke = CKEDITOR.tools.keystrokeToString( editor.lang.common.keyboard, CKEDITOR.CTRL + 86 ),
						expected = {
							content: '',
							count: 1,
							msg: 'Your browser security settings don\'t permit the editor to paste automatically. ' +
								'Use <kbd aria-label="' + keystroke.aria + '">' + keystroke.display + '</kbd> to paste.'
						};

					pasteData.prevent = true;

					assertPasteNotification( editor, expected, null, pasteData );
				} );
			},

			'test prevented direct access to clipboard without notification': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData();
					pasteData.prevent = true;

					assertPasteNotification( editor, { content: '', count: 0 }, { showNotification: false }, pasteData );
				} );
			},

			'test notification with description': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData(),
						description = 'foobar',
						// CTRL + V
						keystroke = CKEDITOR.tools.keystrokeToString( editor.lang.common.keyboard, CKEDITOR.CTRL + 86 ),
						expected = {
							content: '',
							count: 1,
							msg: 'Your browser security settings don\'t permit the editor to paste automatically ' +
								description + '. Use <kbd aria-label="' + keystroke.aria + '">' + keystroke.display +
								'</kbd> to paste.'
						};

					pasteData.prevent = true;

					assertPasteNotification( editor, expected,
						{ description: description }, pasteData );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
