/* bender-ckeditor-plugins: pastefromword,image,undo */
/* bender-include: _helpers/blob.js */
/* global blobHelpers */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		divarea: {
			extraPlugins: 'divarea'
		},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		'test replace blobUrl in PFW content to base64': function( editor ) {
			blobHelpers.simulatePasteBlob( editor, function( input, expected ) {
				assert.beautified.html( expected, editor.getData() );
			} );
		},

		'test undo manager state after pasting image from Word': function( editor, bot ) {
			bot.setData( '', function() {
				editor.resetUndo();

				blobHelpers.simulatePasteBlob( editor, function() {
					assert.isTrue( editor.undoManager.hasUndo, 'Undo step is created' );
				} );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	blobHelpers.ignoreUnsupportedEnvironment( tests );

	bender.test( tests );
} )();
