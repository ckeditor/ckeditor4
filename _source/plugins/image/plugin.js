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

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems ) {
			editor.addMenuItems({
				image: {
					label: editor.lang.image.menu,
					command: 'image',
					group: 'image'
				}
			});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu ) {
			editor.contextMenu.addListener( function( element, selection ) {
				if ( !element || !element.is( 'img' ) || element.getAttribute( '_cke_realelement' ) )
					return null;

				return { image: CKEDITOR.TRISTATE_OFF };
			});
		}
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
