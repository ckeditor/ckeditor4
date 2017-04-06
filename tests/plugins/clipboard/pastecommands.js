/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: link,clipboard,pastetext,pastefromword */
/* bender-include: _helpers/pasting.js */
/* global createFixtures, getDefaultNotification, assertPasteCommand, assertPasteNotification, testResetScenario */

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

	var fixtures = createFixtures( {
			pasteData: {
				dataValue: '<a href="http://ckeditor.com">Foobar</a>'
			},

			expectedText: {
				type: 'text',
				content: '<p>Foobar</p>'
			},
			expectedHtml: {
				type: 'html',
				content: '<p><a href="http://ckeditor.com">Foobar</a></p>'
			},
			expectedTest: {
				type: 'test',
				content: '<p><a href="http://ckeditor.com">Foobar</a></p>'
			},

			emptyNotification: {
				count: 1,
				content: ''
			}
		} ),
		tests = {
			'test simple pasting': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'pasteData' ),
						expected = fixtures.get( 'expectedHtml' );

					assertPasteCommand( editor, expected, null, pasteData );
				} );
			},

			'test pasting passed content (text)': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = fixtures.get( 'expectedHtml' );

					assertPasteCommand( editor, expected, expected.content, {} );
				} );
			},

			'test pasting passed content (object property)': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = fixtures.get( 'expectedHtml' );

					assertPasteCommand( editor, expected, { dataValue: expected.content }, {} );
				} );
			},

			'test forcing paste type': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'pasteData' ),
						expected = fixtures.get( 'expectedTest' );

					assertPasteCommand( editor, expected, { type: 'test' }, pasteData );
				} );
			},

			'test resetting forced paste type': function( editor, bot ) {
				bot.setData( '', function() {
					var expectedHtml = fixtures.get( 'expectedHtml' ),
						expectedText = fixtures.get( 'expectedText' ),
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
					var pasteData = fixtures.get( 'pasteData' ),
						expected = fixtures.get( 'emptyNotification' );

					expected.msg = getDefaultNotification( editor, 'paste' );
					pasteData.prevent = true;

					assertPasteNotification( editor, expected, null, pasteData );
				} );
			},

			'test forcing notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'pasteData' ),
						expected = fixtures.get( 'emptyNotification' );

					expected.msg = getDefaultNotification( editor, 'paste' );
					pasteData.prevent = true;

					assertPasteNotification( editor, expected, { notification: true }, pasteData );
				} );
			},

			'test skipping notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'pasteData' );
					pasteData.prevent = true;

					assertPasteNotification( editor, { content: '', count: 0 }, { notification: false }, pasteData );
				} );
			},

			'test customising notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'pasteData' ),
						msg = 'CKEditor is the best!',
						expected = fixtures.get( 'emptyNotification' );

					expected.msg = msg;
					pasteData.prevent = true;

					assertPasteNotification( editor, expected, { notification: msg }, pasteData );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
