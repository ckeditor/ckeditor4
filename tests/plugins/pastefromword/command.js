/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: link, pastefromword */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global getDefaultNotification, assertPasteNotification */

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
			name: 'pastefromword'
		},
		tests = {
			'test prevented direct access to clipboard': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = {
							content: '',
							count: 1,
							msg: getDefaultNotification( editor, 'paste' )
						},
						pasteData = {
							dataValue: '<a href="http://ckeditor.com">Foobar</a>',
							prevent: true
						};

					pasteData.prevent = true;

					assertPasteNotification( editor, expected, cmdData, pasteData );
				} );
			},

			'test forcing notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = {
							content: '',
							count: 1,
							msg: getDefaultNotification( editor, 'paste' )
						},
						pasteData = {
							dataValue: '<a href="http://ckeditor.com">Foobar</a>',
							prevent: true
						},
						cmdForceData = {
							name: 'pastefromword',
							notification: true
						};

					pasteData.prevent = true;

					assertPasteNotification( editor, expected, cmdForceData, pasteData );
				} );
			},

			'test skipping notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = {
							dataValue: 'foo',
							prevent: true
						},
						expected = {
							content: '',
							count: 0
						},
						cmdPreventData = {
							name: 'pastefromword',
							notification: false
						};

					assertPasteNotification( editor, expected, cmdPreventData, pasteData );
				} );
			},

			'test customising notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var msg = 'CKEditor is the best!',
						pasteData = {
							dataValue: 'foo',
							prevent: true
						},
						expected = {
							content: '',
							msg: msg,
							count: 1
						},
						cmdPreventData = {
							name: 'pastefromword',
							notification: msg
						};

					assertPasteNotification( editor, expected, cmdPreventData, pasteData );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
