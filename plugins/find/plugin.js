/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'find', {
	requires: [ 'dialog' ],
	init: function( editor ) {
		var findCommand = editor.addCommand( 'find', new CKEDITOR.dialogCommand( 'find' ) );
		findCommand.canUndo = false;
		findCommand.readOnly = 1;

		var replaceCommand = editor.addCommand( 'replace', new CKEDITOR.dialogCommand( 'replace' ) );
		replaceCommand.canUndo = false;

		if ( editor.ui.addButton ) {
			editor.ui.addButton( 'Find', {
				label: editor.lang.findAndReplace.find,
				command: 'find'
			});

			editor.ui.addButton( 'Replace', {
				label: editor.lang.findAndReplace.replace,
				command: 'replace'
			});
		}

		CKEDITOR.dialog.add( 'find', this.path + 'dialogs/find.js' );
		CKEDITOR.dialog.add( 'replace', this.path + 'dialogs/find.js' );
	}
});

/**
 * Defines the style to be used to highlight results with the find dialog.
 * @type Object
 * @default { element : 'span', styles : { 'background-color' : '#004', 'color' : '#fff' } }
 * @example
 * // Highlight search results with blue on yellow.
 * config.find_highlight =
 *     {
 *         element : 'span',
 *         styles : { 'background-color' : '#ff0', 'color' : '#00f' }
 *     };
 */
CKEDITOR.config.find_highlight = {
	element: 'span', styles: { 'background-color': '#004', 'color': '#fff' } };
