/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: undo,tableselection */
/* bender-include: ../../_helpers/tableselection.js */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	function testPasteFlow( bot, caseName, fixture ) {
		var editor = bot.editor;

		bender.tools.testInputOut( caseName, function( source, expected ) {
			var beforePasteStub = sinon.stub(),
				pasteStub = sinon.stub(),
				afterPasteStub = sinon.stub(),
				removeBeforeStub,
				removePasteStub,
				removeAfterStub;

			bot.setHtmlWithSelection( source );

			removeBeforeStub = editor.on( 'beforePaste', beforePasteStub );
			removePasteStub = editor.on( 'paste', pasteStub, null, null, 0 );
			removeAfterStub = editor.on( 'afterPaste', afterPasteStub );

			editor.once( 'afterPaste', function() {
				resume( function() {
					bender.assert.beautified.html( expected, bot.editor.getData() );

					removeBeforeStub.removeListener();
					removePasteStub.removeListener();
					removeAfterStub.removeListener();

					assert.areSame( 1, beforePasteStub.callCount, 'beforePaste even count' );
					assert.areSame( 1, pasteStub.callCount, 'paste event count' );
					assert.areSame( 1, afterPasteStub.callCount, 'afterPaste event count' );
				} );
			}, null, null, 999 );

			bender.tools.emulatePaste( editor, CKEDITOR.document.getById( fixture ).getOuterHtml() );

			wait();
		} );
	}

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},

		'test paste flow (tabular content)': function( editor, bot ) {
			testPasteFlow( bot, 'tabular-paste', '2cells1row' );
		},

		'test paste flow (non-tabular content)': function( editor, bot ) {
			testPasteFlow( bot, 'nontabular-paste', 'paragraph' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
