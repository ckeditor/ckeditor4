/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: link, pastefromword */
/* bender-include: ../clipboard/_helpers/pasting.js, ../pastetools/_helpers/ptTools.js, generated/_helpers/pfwTools.js */
/* global createFixtures, getDefaultNotification, assertPasteNotification, ptTools */

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
		fixtures = createFixtures( {
			pasteData: {
				dataValue: '<a href="http://ckeditor.com">Foobar</a>',
				prevent: true
			},

			expected: {
				content: '',
				count: 1
			}
		} ),
		tests = {
			'test prevented direct access to clipboard': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = fixtures.get( 'expected' ),
						pasteData = fixtures.get( 'pasteData' );

					expected.msg = getDefaultNotification( editor, 'paste' );

					assertPasteNotification( editor, expected, cmdData, pasteData );
				} );
			},

			'test forcing notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = fixtures.get( 'expected' ),
						pasteData = fixtures.get( 'pasteData' ),
						cmdForceData = {
							name: 'pastefromword',
							notification: true
						};

					expected.msg = getDefaultNotification( editor, 'paste' );

					assertPasteNotification( editor, expected, cmdForceData, pasteData );
				} );
			},

			'test skipping notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var expected = fixtures.get( 'expected' ),
						pasteData = fixtures.get( 'pasteData' ),
						cmdPreventData = {
							name: 'pastefromword',
							notification: false
						};

					expected.count = 0;

					assertPasteNotification( editor, expected, cmdPreventData, pasteData );
				} );
			},

			'test customising notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var msg = 'CKEditor is the best!',
						expected = fixtures.get( 'expected' ),
						pasteData = fixtures.get( 'pasteData' ),
						cmdPreventData = {
							name: 'pastefromword',
							notification: msg
						};

					expected.msg = msg;

					assertPasteNotification( editor, expected, cmdPreventData, pasteData );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	ptTools.ignoreTestsOnMobiles( tests );

	bender.test( tests );
} )();
