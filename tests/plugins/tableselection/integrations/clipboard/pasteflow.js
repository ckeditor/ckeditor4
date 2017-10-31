/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: undo,tableselection */
/* bender-include: ../../_helpers/tableselection.js */
/* global tableSelectionHelpers */

( function() {
	'use strict';

	var getNumber = ( function() {
		var i = 0;
		return function() {
			return i++;
		};
	} )();

	function testPasteFlow( caseName, fixture, creator ) {
		bender.editorBot.create( {
			creator: creator,
			name: creator + '-' + caseName + '-' + getNumber()
		}, function( bot ) {
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
		} );
	}

	var tests = {
		'test paste flow (tabular content) (replace)': function() {
			testPasteFlow( 'tabular-paste', '2cells1row', 'replace' );
		},
		'test paste flow (tabular content) (inline)': function() {
			testPasteFlow( 'tabular-paste', '2cells1row', 'inline' );
		},
		'test paste flow (non-tabular content) (replace)': function() {
			testPasteFlow( 'nontabular-paste', 'paragraph', 'replace' );
		},
		'test paste flow (non-tabular content) (inline)': function() {
			testPasteFlow( 'nontabular-paste', 'paragraph', 'inline' );
		}
	};

	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );
} )();
