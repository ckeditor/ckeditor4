/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file Forms Plugin
 */

CKEDITOR.plugins.add( 'forms', {
	init: function( editor ) {
		editor.addCss( 'form' +
			'{' +
				'border: 1px dotted #FF0000;' +
				'padding: 2px;' +
			'}' );
		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, commandName, dialogFile ) {
				editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName ) );

				editor.ui.addButton( buttonName, {
					label: editor.lang.common[ buttonName.charAt( 0 ).toLowerCase() + buttonName.slice( 1 ) ],
					command: commandName
				});
				CKEDITOR.dialog.add( commandName, dialogFile );
			};

		var dialogPath = this.path + 'dialogs/';
		addButtonCommand( 'Form', 'form', dialogPath + 'form.js' );
		addButtonCommand( 'Checkbox', 'checkbox', dialogPath + 'checkbox.js' );
		addButtonCommand( 'Radio', 'radio', dialogPath + 'radio.js' );
		addButtonCommand( 'TextField', 'textfield', dialogPath + 'textfield.js' );
		addButtonCommand( 'Textarea', 'textarea', dialogPath + 'textarea.js' );
		addButtonCommand( 'Select', 'select', dialogPath + 'select.js' );
		addButtonCommand( 'Button', 'button', dialogPath + 'button.js' );
		addButtonCommand( 'ImageButton', 'imagebutton', CKEDITOR.plugins.getPath( 'image' ) + 'dialogs/image.js' );
		addButtonCommand( 'HiddenField', 'hiddenfield', dialogPath + 'hiddenfield.js' );

	},
	requires: [ 'image' ]
});
