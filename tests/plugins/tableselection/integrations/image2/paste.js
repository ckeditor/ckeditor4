/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,undo,tableselection */
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

	function testUndo( editor ) {
		editor.once( 'afterCommandExec', function() {
			resume( function() {
				assert.isTrue( editor.getCommand( 'undo' ).state === CKEDITOR.TRISTATE_DISABLED,
				'Paste generated only 1 undo step' );
				assert.isTrue( editor.getCommand( 'redo' ).state === CKEDITOR.TRISTATE_OFF, 'Paste can be repeated' );
			} );
		} );

		editor.execCommand( 'undo' );

		wait();
	}

	function pasteImage( editor ) {
		editor.once( 'afterPaste', function() {
			resume( function() {
				var images = editor.editable().find( '.cke_widget_image' );

				assert.areSame( 1, images.count(), 'There is only one image' );
				assert.isFalse( images.getItem( 0 ).hasClass( 'cke_widget_new' ), 'The image widget is initialized' );

				testUndo( editor );
			} );
		} );

		bender.tools.emulatePaste( editor, '<img src="_assets/bar.png" alt="xalt" width="100" id="image" />' );

		wait();
	}

	var tests = {
			'the copied image to table shoud be initialized (collapsed selection)': function( editor, bot ) {
				bot.setHtmlWithSelection( '<table border="1"><tbody><tr><td>^</td></tr></tbody></table>'  );

				editor.undoManager.reset();
				pasteImage( editor );
			},

			'the copied image to table shoud be initialized (multiple selection)': function( editor, bot ) {
				bot.setHtmlWithSelection( '<table border="1"><tbody><tr>[<td></td>][<td></td>]</tr></tbody></table>'  );

				editor.undoManager.reset();
				pasteImage( editor );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );
} )();
