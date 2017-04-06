/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: link,clipboard,pastetext,pastefromword */
/* bender-include: _helpers/pasting.js */
/* global getDefaultNotification, assertPasteCommand, assertPasteNotification, testResetScenario */

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
			},
			empty: {
				count: 1,
				content: ''
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

			'test paste notification without direct access to clipboard': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData(),
						expected = createExpected( 'empty' );

					expected.msg = getDefaultNotification( editor, 'paste' );
					pasteData.prevent = true;

					assertPasteNotification( editor, expected, null, pasteData );
				} );
			},

			'test forcing notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData(),
						expected = createExpected( 'empty' );

					expected.msg = getDefaultNotification( editor, 'paste' );
					pasteData.prevent = true;

					assertPasteNotification( editor, expected, { notification: true }, pasteData );
				} );
			},

			'test skipping notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData();
					pasteData.prevent = true;

					assertPasteNotification( editor, { content: '', count: 0 }, { notification: false }, pasteData );
				} );
			},

			'test customising notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = createPasteData(),
						msg = 'CKEditor is the best!',
						expected = createExpected( 'empty' );

					expected.msg = msg;
					pasteData.prevent = true;

					assertPasteNotification( editor, expected, { notification: msg }, pasteData );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
