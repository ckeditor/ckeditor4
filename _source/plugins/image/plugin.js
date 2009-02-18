/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file Image plugin
 */

CKEDITOR.plugins.add( 'image', {
	init: function( editor ) {
		var pluginName = 'image';

		// Register the dialog.
		CKEDITOR.dialog.add( pluginName, this.path + 'dialogs/image.js' );

		// Register the command.
		editor.addCommand( pluginName, new CKEDITOR.dialogCommand( pluginName ) );

		// Register the toolbar button.
		editor.ui.addButton( 'Image', {
			label: editor.lang.common.image,
			command: pluginName
		});
	}
});

/**
 * Show Browse Server button.
 * @type Boolean
 * @default true
 */
CKEDITOR.config.image_browseServer = true;

/**
 * Upload action attribute.
 * @type URL
 */
CKEDITOR.config.image_uploadAction = 'nowhere.php';

CKEDITOR.config.image_removeLinkByEmptyURL = true;
