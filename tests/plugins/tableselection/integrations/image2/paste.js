/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,undo,tableselection */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	function testUndo( editor, selectedCells ) {
		var undoManager = editor.undoManager,
			ranges = editor.getSelection().getRanges(),
			cells = editor.editable().find( 'td, th' ),
			i;

		editor.once( 'afterCommandExec', function() {
			resume( function() {
				ranges = editor.getSelection().getRanges();
				cells = editor.editable().find( 'td, th' );

				assert.isFalse( undoManager.undoable(), 'Paste generated only 1 undo step' );
				assert.isTrue( undoManager.redoable(), 'Paste can be repeated' );

				// Until issue with selecting only first cell after undo, this assertion
				// does not make any sense.
				//assert.areSame( selectedCells.length, ranges.length, 'Appropriate number of ranges are selected' );

				for ( i = 0; i < ranges.length; i++ ) {
					var cell = ranges[ i ]._getTableElement();

					assert.isTrue( cell.equals( cells.getItem( selectedCells[ i ] ) ),
						'Appropriate cell is selected' );
				}
			} );
		} );

		editor.execCommand( 'undo' );

		wait();
	}

	function pasteImage( editor, callback ) {
		editor.once( 'afterPaste', function() {
			resume( function() {
				var images = editor.editable().find( '.cke_widget_image' );

				assert.areSame( 1, images.count(), 'There is only one image' );
				assert.isFalse( images.getItem( 0 ).hasClass( 'cke_widget_new' ), 'The image widget is initialized' );

				callback();
			} );
		} );

		bender.tools.emulatePaste( editor, '<img src="_assets/bar.png" alt="xalt" width="100" id="image" />' );

		wait();
	}

	var tests = {
			setUp: function() {
				bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
			},
			'test the copied image to table shoud be initialized (collapsed selection)': function( editor, bot ) {
				bot.setHtmlWithSelection( '<table border="1"><tbody><tr><td>Cel^l</td></tr></tbody></table>' );

				editor.undoManager.reset();
				pasteImage( editor, function() {
					testUndo( editor, [ 0 ] );
				} );
			},

			'test the copied image to table shoud be initialized (multiple selection)': function( editor, bot ) {
				bot.setHtmlWithSelection( '<table border="1"><tbody><tr>[<td>Cell 1</td>][<td>Cell 2</td>]</tr></tbody></table>' );

				editor.undoManager.reset();
				pasteImage( editor, function() {
					testUndo( editor, [ 0, 1 ] );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
