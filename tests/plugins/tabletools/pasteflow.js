/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,clipboard,toolbar */

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
					var beforePasteCount = 0,
						pasteCount = 0,
						afterPasteCount = 0;
					bot.setHtmlWithSelection( source );

					editor.once( 'beforePaste', function() {
						beforePasteCount++;
					} );
					editor.once( 'paste', function() {
						pasteCount++;
					}, null, null, 0 );
					editor.once( 'afterPaste', function() {
						resume( function() {
							afterPasteCount++;

							bender.assert.beautified.html( expected, bot.editor.getData() );

							assert.areSame( 1, beforePasteCount, 'beforePaste was fired' );
							assert.areSame( 1, pasteCount, 'paste was fired' );
							assert.areSame( 1, afterPasteCount, 'afterPaste was fired' );
						} );
					} );

					bender.tools.emulatePaste( editor, CKEDITOR.document.getById( '2cells1row' ).getOuterHtml() );

					wait();
				} );
			}
		};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
} )();
