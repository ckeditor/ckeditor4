/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file Special Character plugin
 */

CKEDITOR.plugins.add( 'specialchar', {
	// List of available localizations.
	availableLangs: { en:1 },

	init: function( editor ) {
		var pluginName = 'specialchar',
			plugin = this;

		// Register the dialog.
		CKEDITOR.dialog.add( pluginName, this.path + 'dialogs/specialchar.js' );

		editor.addCommand( pluginName, {
			exec: function() {
				var langCode = editor.langCode;
				langCode = plugin.availableLangs[ langCode ] ? langCode : 'en';

				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( plugin.path + 'lang/' + langCode + '.js' ), function() {
					CKEDITOR.tools.extend( editor.lang.specialChar, plugin.lang[ langCode ] );
					editor.openDialog( pluginName );
				});
			},
			modes: { wysiwyg:1 },
			canUndo: false
		});

		// Register the toolbar button.
		editor.ui.addButton( 'SpecialChar', {
			label: editor.lang.specialChar.toolbar,
			command: pluginName
		});
	}
});
