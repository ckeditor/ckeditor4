/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'about', {
	init: function( editor ) {
		editor.addCommand( 'about', new CKEDITOR.dialogCommand( 'about' ) );
		editor.ui.addButton( 'About', {
			label: editor.lang.about.title,
			command: 'about'
		});
		CKEDITOR.dialog.add( 'about', this.path + 'dialogs/about.js' );
	}
});
