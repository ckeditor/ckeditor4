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
					pasteData.prevent = true;

					assertPasteNotification( editor, { content: '', count: 1 }, cmdData, pasteData );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
