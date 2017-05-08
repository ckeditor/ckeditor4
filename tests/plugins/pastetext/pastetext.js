/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: link, pastetext */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global createFixtures, getDefaultNotification, assertPasteCommand, assertPasteNotification */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				language: 'en'
			}
		},

		inline: {
			creator: 'inline',
			config: {
				language: 'en'
			}
		}
	};

	var cmdData = {
			name: 'pastetext'
		},
		fixtures = createFixtures( {
			pasteData: {
				dataValue: '<a href="http://ckeditor.com">Foobar</a>',
				prevent: true
			},

			expectedNotification: {
				content: '',
				count: 1
			}
		} ),
		tests = {
			'test pasting plain text': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'pasteData' );

					pasteData.prevent = false;

					assertPasteCommand( editor, { type: 'text', content: '<p>Foobar</p>' }, cmdData, pasteData );
				} );
			},

			'test prevented direct access to clipboard': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = fixtures.get( 'expectedNotification' ),
						pasteData = fixtures.get( 'pasteData' ),
						keystroke = CKEDITOR.tools.keystrokeToString( editor.lang.common.keyboard,
							editor.getCommandKeystroke( editor.commands[ CKEDITOR.env.ie ? 'paste' : 'pastetext' ] ) );

					expected.msg = getDefaultNotification( editor, 'pastetext', keystroke );

					assertPasteNotification( editor, expected, cmdData, pasteData );
				} );
			},

			'test forcing notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = fixtures.get( 'expectedNotification' ),
						pasteData = fixtures.get( 'pasteData' ),
						keystroke = CKEDITOR.tools.keystrokeToString( editor.lang.common.keyboard,
							editor.getCommandKeystroke( editor.commands[ CKEDITOR.env.ie ? 'paste' : 'pastetext' ] ) ),
						cmdForceData = {
							name: 'pastetext',
							notification: true
						};

					expected.msg = getDefaultNotification( editor, 'pastetext', keystroke );

					assertPasteNotification( editor, expected, cmdForceData, pasteData );
				} );
			},

			'test skipping notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'pasteData' ),
						expected = {
							content: '',
							count: 0
						},
						cmdPreventData = {
							name: 'pastetext',
							notification: false
						};

					assertPasteNotification( editor, expected, cmdPreventData, pasteData );
				} );
			},

			'test customising notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var msg = 'CKEditor is the best!',
						pasteData = fixtures.get( 'pasteData' ),
						expected = fixtures.get( 'expectedNotification' ),
						cmdPreventData = {
							name: 'pastetext',
							notification: msg
						};

					expected.msg = msg ;

					assertPasteNotification( editor, expected, cmdPreventData, pasteData );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
