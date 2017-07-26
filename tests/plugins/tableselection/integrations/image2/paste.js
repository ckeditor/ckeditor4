/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,tableselection */
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

	function pasteImage( editor ) {
		editor.once( 'afterPaste', function() {
			resume( function() {
				var images = editor.editable().find( '.cke_widget_image' );

				assert.areSame( 1, images.count(), 'There is only one image' );
				assert.isFalse( images.getItem( 0 ).hasClass( 'cke_widget_new' ), 'The image widget is initialized' );
			} );
		} );

		bender.tools.emulatePaste( editor, '<img src="_assets/bar.png" alt="xalt" width="100" id="image" />' );

		wait();
	}

	var tests = {
			'the copied image to table shoud be initialized (collapsed selection)': function( editor, bot ) {
				bot.setHtmlWithSelection( '<table border="1"><tbody><tr><td>^</td></tr></tbody></table>'  );

				pasteImage( editor );
			},

			'the copied image to table shoud be initialized (multiple selection)': function( editor, bot ) {
				bot.setHtmlWithSelection( '<table border="1"><tbody><tr>[<td></td>][<td></td>]</tr></tbody></table>'  );

				pasteImage( editor );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );
} )();
