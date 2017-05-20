/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: tableselection */
/* bender-include: ../../_helpers/tableselection.js */
/* global tableSelectionHelpers */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		'test paste flow': function( editor, bot ) {
			bender.tools.testInputOut( 'simple-paste', function( source, expected ) {
				var beforePasteStub = sinon.stub(),
					pasteStub = sinon.stub(),
					afterPasteStub = sinon.stub();
				bot.setHtmlWithSelection( source );

				editor.on( 'beforePaste', beforePasteStub );
				editor.on( 'paste', pasteStub, null, null, 0 );
				editor.once( 'afterPaste', function() {
					resume( function() {
						afterPasteStub();

						bender.assert.beautified.html( expected, bot.editor.getData() );

						assert.areSame( 1, beforePasteStub.callCount, 'beforePaste even count' );
						assert.areSame( 1, pasteStub.callCount, 'paste event count' );
						assert.areSame( 1, afterPasteStub.callCount, 'afterPaste event count' );
					} );
				} );

				bender.tools.emulatePaste( editor, CKEDITOR.document.getById( '2cells1row' ).getOuterHtml() );

				wait();
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );
} )();
