/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'table', {
	init: function( editor ) {
		var table = CKEDITOR.plugins.table;

		editor.addCommand( 'table', new CKEDITOR.dialogCommand( 'table' ) );
		editor.addCommand( 'tableProperties', new CKEDITOR.dialogCommand( 'tableProperties' ) );
		editor.ui.addButton( 'Table', {
			label: editor.lang.table.toolbar,
			command: 'table'
		});

		CKEDITOR.dialog.add( 'table', this.path + 'dialogs/table.js' );
		CKEDITOR.dialog.add( 'tableProperties', this.path + 'dialogs/table.js' );
	}
});
