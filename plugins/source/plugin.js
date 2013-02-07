/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'source', {
	lang: 'en', // %REMOVE_LINE_CORE%
	icons: 'source,source-rtl', // %REMOVE_LINE_CORE%

	init: function( editor ) {
		// Register the "source" command, which simply opens the "source" dialog.
		editor.addCommand( 'source', new CKEDITOR.dialogCommand( 'source' ) );

		// Register the "source" dialog.
		CKEDITOR.dialog.add( 'source', this.path + 'dialogs/source.js' );

		// If the toolbar is available, create the "Source" button.
		if ( editor.ui.addButton ) {
			editor.ui.addButton( 'Source', {
				label: editor.lang.source.toolbar,
				command: 'source',
				toolbar: 'mode,10'
			});
		}
	}
});
