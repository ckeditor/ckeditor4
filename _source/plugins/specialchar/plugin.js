/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/ ( function() {
	/**
	 * @file Special Character plugin
	 */

	CKEDITOR.plugins.add( 'specialchar', {
		init: function( editor ) {
			var pluginName = 'specialchar';

			// Register the dialog.
			CKEDITOR.dialog.add( pluginName, this.path + 'dialogs/specialchar.js' );

			// Register the command.
			editor.addCommand( pluginName, new CKEDITOR.dialogCommand( pluginName ) );

			// Register the toolbar button.
			editor.ui.addButton( 'SpecialChar', {
				label: editor.lang.specialChar.toolbar,
				command: pluginName
			});

			// Register the handler for Firefox (#5170)
			if ( CKEDITOR.env.gecko ) {
				editor.on( 'insertSpecialChar', function( event ) {
					var range = getRange( editor );

					if ( range )
						range.insertNode( editor.document.createText( event.data ) );
					else
						editor.insertHtml( event.data );
				});
			}
		}
	});

	function getRange( editor ) {
		// Get the selection ranges.
		var ranges = editor.getSelection().getRanges();

		// Delete the contents of all ranges .
		for ( var i = ranges.length - 1; i >= 0; i-- ) {
			ranges[ i ].deleteContents();
		}

		// Return the first range.
		return ranges[ 0 ];
	}
})()
