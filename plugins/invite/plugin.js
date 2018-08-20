CKEDITOR.plugins.add( 'invite',
{
	// The plugin initialization logic goes inside this method.
	// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.pluginDefinition.html#init
	init: function( editor )
	{
		// Define an editor command that inserts a timestamp.
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.editor.html#addCommand
		editor.addCommand( 'invitePreview',
			{
				// Define a function that will be fired when the command is executed.
				// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.commandDefinition.html#exec
				exec : function( editor )
				{
					$("#preview").trigger('click');
				}
			});
		// Create a toolbar button that executes the plugin command.
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.html#addButton
		editor.ui.addButton( 'Invite',
		{
			// Toolbar button tooltip.
			label: 'Preview Invite',
			// Reference to the plugin command name.
			command: 'invitePreview',
			// Button's icon file path.
			icon: this.path + 'images/preview.png'
		} );
	}
} );