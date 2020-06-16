/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: basicstyles,clipboard,pastetext,pastefromword */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global createFixtures */

( function() {
	'use strict';

	bender.editors = {
		force_default: {
			config: {
				language: 'en'
			}
		},

		force_true: {
			config: {
				language: 'en',
				forcePasteAsPlainText: true
			}
		},

		force_ignoreword: {
			config: {
				language: 'en',
				forcePasteAsPlainText: 'allow-word'
			}
		}
	};

	var fixtures = createFixtures( {

			pasteText: {
				data: 'Plain text',
				plain: 'Plain text'
			},

			pasteHTML: {
				data: '<strong>HTML <em>content</em></strong>',
				plain: 'HTML content'
			},

			pasteWord: {
				data: '<strong class="MsoNormal">Word <em>content</em></strong>',
				plain: 'Word content'
			}
		} ),
		tests = {

			'test paste with plain text': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				bender.tools.selection.setWithHtml( editor, '' );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteText' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteText' ) );
				tc.wait();
			},

			'test paste with HTML content': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				bender.tools.selection.setWithHtml( editor, '' );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteHTML' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteHTML' ) );
				tc.wait();
			},

			'test paste with Word content': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				bender.tools.selection.setWithHtml( editor, '' );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteWord' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteWord' ) );
				tc.wait();
			},

			'test paste with plain text after pastetext click': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				bender.tools.selection.setWithHtml( editor, '' );
				editor.execCommand( 'paste', { type: 'text', dataValue: '', notification: false } );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteText' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteText', true ) );
				tc.wait();
			},

			'test paste with HTML content after pastetext click': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				bender.tools.selection.setWithHtml( editor, '' );
				editor.execCommand( 'paste', { type: 'text', dataValue: '', notification: false } );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteHTML' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteHTML', true ) );
				tc.wait();
			},

			'test paste with Word content after pastetext click': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				// There is some inconsistency that pasting Word content after using
				// `pastetext` button, still pastes rich content. Related to #1328 issue.
				var forcePlain = editor.name !== 'force_ignoreword';

				bender.tools.selection.setWithHtml( editor, '' );
				editor.execCommand( 'paste', { type: 'text', dataValue: '', notification: false } );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteWord' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteWord', forcePlain ) );
				tc.wait();
			},

			'test paste with plain text after pastefromword click': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				bender.tools.selection.setWithHtml( editor, '' );
				editor.execCommand( 'paste', { type: 'html', dataValue: '', notification: false } );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteText' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteText' ) );
				tc.wait();
			},

			'test paste with HTML content after pastefromword click': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				bender.tools.selection.setWithHtml( editor, '' );
				editor.execCommand( 'paste', { type: 'html', dataValue: '', notification: false } );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteHTML' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteHTML' ) );
				tc.wait();
			},

			'test paste with Word content after pastefromword click': function( editor, bot ) {
				var tc = bot.testCase;
				tc.editor = editor;

				bender.tools.selection.setWithHtml( editor, '' );
				editor.execCommand( 'paste', { type: 'html', dataValue: '', notification: false } );
				bender.tools.emulatePaste( editor, fixtures.get( 'pasteWord' ).data );

				assertAfterPasteContent( tc, getExpected( editor.name, 'pasteWord' ) );
				tc.wait();
			}
		};

	bender.test(
		bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests )
	);

	function assertAfterPasteContent( tc, expected ) {
		tc.editor.on( 'afterPaste', function( evt ) {
			evt.removeListener();
			tc.resume( function() {
				assert.isInnerHtmlMatching( expected, tc.editor.getData() );
			} );
		} );
	}

	function getExpected( editorName, fixtureName, forcePlain ) {
		var expected = 'plain';

		// Default editor (with forcePasteAsPlainText=false) always pastes rich content.
		// Editor with forcePasteAsPlainText='allow-word' only pastes rich context if it is copied from Word.
		if ( !forcePlain && ( editorName === 'force_default' || ( editorName === 'force_ignoreword' && fixtureName === 'pasteWord' ) ) ) {
			expected = 'data';
		}

		return '<p>' + fixtures.get( fixtureName )[ expected ].replace( /\s+class="MsoNormal"/g, '' ) + '</p>';
	}
} )();
