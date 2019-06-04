( function() {
	'use strict';

	window.dialogTools = {
		testDialogModel: function( bot, dialogName, htmlWithSelection ) {
			var editor = bot.editor;

			bot.setHtmlWithSelection( '^' );

			bot.dialog( dialogName, function( dialog ) {
				assert.isNull( dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
			} );
		}
	};

} )();
