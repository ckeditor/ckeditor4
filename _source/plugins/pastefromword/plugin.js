/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'pastefromword', {
	init: function( editor ) {
		// Register the command.
		editor.addCommand( 'pastefromword', new CKEDITOR.dialogCommand( 'pastefromword' ) );

		// Register the toolbar button.
		editor.ui.addButton( 'PasteFromWord', {
			label: editor.lang.pastefromword.toolbar,
			command: 'pastefromword'
		});

		// Register the dialog.
		CKEDITOR.dialog.add( 'pastefromword', this.path + 'dialogs/pastefromword.js' );
	}
});

CKEDITOR.config.pasteFromWordIgnoreFontFace = true;
CKEDITOR.config.pasteFromWordRemoveStyle = false;
CKEDITOR.config.pasteFromWordKeepsStructure = false;
