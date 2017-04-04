/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: link, pastetext */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global assertPasteCommand, assertPasteNotification */

( function() {
	'use strict';

	bender.editors = {
		classic: {},

		inline: {
			creator: 'inline'
		}
	};

	var cmdData = {
			name: 'pastetext'
		},
		pasteData = {
			dataValue: '<a href="http://ckeditor.com">Foobar</a>'
		},
		tests = {
			'test pasting plain text': function( editor, bot ) {
				bot.setData( '', function() {
					pasteData.prevent = false;

					assertPasteCommand( editor, { type: 'text', content: '<p>Foobar</p>' }, cmdData, pasteData );
				} );
			},

			'test prevented direct access to clipboard': function( editor, bot ) {
				bot.setData( '', function() {
					var keystroke = CKEDITOR.tools.keystrokeToString( editor.lang.common.keyboard,
						CKEDITOR.CTRL + CKEDITOR.SHIFT + 86 ),
						expected = {
							content: '',
							count: 1,
							msg: 'Your browser security settings don\'t permit the editor to paste automatically as ' +
								'plain text. Use <kbd aria-label="' + keystroke.aria + '">' + keystroke.display +
								'</kbd> to paste.'
						};

					pasteData.prevent = true;

					assertPasteNotification( editor, expected, cmdData, pasteData );
				} );
			},

			'test skipping notification on paste': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = {
						dataValue: 'foo'
					};

					pasteData.prevent = true;

					assertPasteNotification( editor, { content: '', count: 0 }, { showNotification: false }, pasteData );
				} );
			},
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
