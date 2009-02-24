/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'find', {
	init: function( editor ) {
		var forms = CKEDITOR.plugins.find;
		editor.ui.addButton( 'Find', {
			label: editor.lang.findAndReplace.find,
			command: 'find'
		});
		editor.addCommand( 'find', new CKEDITOR.dialogCommand( 'find' ) );

		editor.ui.addButton( 'Replace', {
			label: editor.lang.findAndReplace.replace,
			command: 'replace'
		});
		editor.addCommand( 'replace', new CKEDITOR.dialogCommand( 'replace' ) );

		CKEDITOR.dialog.add( 'find', this.path + 'dialogs/find.js' );
		CKEDITOR.dialog.add( 'replace', this.path + 'dialogs/find.js' );
	},

	requires: [ 'styles' ]
});

// Styles for highlighting search results.
CKEDITOR.config.find_highlight = {
	element: 'span', styles: { 'background-color': '#004', 'color': '#fff' } };
