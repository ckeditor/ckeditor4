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

		'test replace multiple blobUrl in PFW content to base64': function( editor, bot ) {
			bot.setData( '', function() {
				blobHelpers.simulatePasteBlob( editor, function( input, expected ) {
					assert.beautified.html( expected, editor.getData() );
				}, {
					template: '<p{%CLASS%}><img style="height:200px; width:200px" src="{%URL%}" /><img style="height:200px; width:200px" src="{%URL%}" /></p>'
				} );
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
