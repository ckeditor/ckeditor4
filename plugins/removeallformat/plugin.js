CKEDITOR.plugins.add( 'removeallformat', {
	icons: 'removeallformat',
	init: function( editor ) {
		//plugin logic
		console.log('removeallformat init');

		//The exec method defines a function that will be fired
		//when the removeallformat command is executed.
		editor.addCommand( 'removeallformat', {
			exec: function( editor ) {
				var selection = editor.getSelection();
				var ranges = selection.getRanges();
				editor.insertText( selection.getSelectedText() );
				// selection.selectRanges( [ ranges ] );
				// var element = selection.getStartElement();
				// selection.selectElement( element );
			}
		});

		//Define a button that will be associated with the removeallformat command
		editor.ui.addButton( 'removeallformat', {
			label: 'Remove all format',
			command: 'removeallformat',
			toolbar: 'cleanup'
		});
	}
});
