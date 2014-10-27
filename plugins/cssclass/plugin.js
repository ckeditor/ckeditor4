/**
 * Basic sample plugin inserting Translation elements into the CKEditor editing area.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Register the plugin within the editor.
CKEDITOR.plugins.add( 'cssclass', {

	// Register the icons.
	icons: 'cssclass',

	// The plugin initialization logic goes inside this method.
	init: function( editor ) {

		// Define an editor command that opens our dialog window.
		editor.addCommand( 'cssclass', new CKEDITOR.dialogCommand( 'cssclassDialog' ) );

		// Create a toolbar button that executes the above command.
		editor.ui.addButton( 'cssclass', {

			// The text part of the button (if available) and the tooltip.
			label: 'Insert CSS class/style',

			// The command to execute on click.
			command: 'cssclass',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'insert'
		});

		if ( editor.contextMenu ) {
			
			// Add a context menu group with the Edit Translation item.
			editor.addMenuGroup( 'cssclassGroup' );
			editor.addMenuItem( 'cssclassItem', {
				label: 'Add/Modify CSS element class/style',
				icon: this.path + 'icons/cssclass.png',
				command: 'cssclass',
				group: 'cssclassGroup'
			});

			editor.contextMenu.addListener( function( element ) {
				//if ( element.getAscendant( 'body', true ) ) 
				{
					return { cssclassItem: CKEDITOR.TRISTATE_OFF };
				}
			});
		}

		// Register our dialog file -- this.path is the plugin folder path.
		CKEDITOR.dialog.add( 'cssclassDialog', this.path + 'dialogs/cssclass.js' );
	}
});
