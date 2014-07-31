CKEDITOR.plugins.add( 'removeallformat', {
	icons: 'removeallformat',
	//A list of plugins that are required by this plugin.
	//Note that this property doesn't guarantee the loading order of the plugins.
	requires : [ 'removeformat', 'link' ],
	init: function( editor ) {
		editor.addCommand( 'removeallformat', {
			//The exec method defines a function that will be fired
			//when the removeallformat command is executed.
			exec: function( editor ) {
				//call removeFormat first
				editor.execCommand('removeFormat');

				//also remove link
				editor.execCommand('unlink');

				//save selection
				var selection = editor.getSelection();
				var bookmarks = selection.createBookmarks2();

				//remove additional block level formats
				//http://stackoverflow.com/questions/16835365/set-cursor-to-specific-position-in-ckeditor
				//http://stackoverflow.com/questions/15620115/ckeditor-change-selection-without-losing-it
				//bookmarks are either normal (based on node references), serializable (based on spans)
				//or 3rd type (based on node addresses)
				editor.insertText( selection.getSelectedText() );

				//restore selection
				//Not perfect but very hard to get it working all the time
				editor.getSelection().selectBookmarks( bookmarks );
			}
		});

		//Define a button that will be associated with the removeallformat command
		//Button name = 'RemoveAllFormat'
		editor.ui.addButton( 'RemoveAllFormat', {
			label: 'Remove all format',
			command: 'removeallformat',
			toolbar: 'cleanup'
		});
	}
});
