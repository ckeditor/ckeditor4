/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'basicstyles', {
	requires: [ 'styles', 'button' ],

	init: function( editor, pluginPath ) {
		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, buttonLabel, commandName, styleDefiniton ) {
				var style = new CKEDITOR.style( styleDefiniton );

				editor.attachStyleStateChange( style, function( state ) {
					var command = editor.getCommand( commandName );
					command.state = state;
					command.fire( 'state' );
				});

				editor.addCommand( commandName, new CKEDITOR.styleCommand( style ) );

				editor.ui.addButton( buttonName, {
					label: buttonLabel,
					command: commandName
				});
			};

		var coreStyles = editor.config.coreStyles;
		var lang = editor.lang;

		addButtonCommand( 'Bold', lang.bold, 'bold', coreStyles.bold );
		addButtonCommand( 'Italic', lang.italic, 'italic', coreStyles.italic );
		addButtonCommand( 'Underline', lang.underline, 'underline', coreStyles.underline );
		addButtonCommand( 'Strike', lang.strike, 'strike', coreStyles.strike );
		addButtonCommand( 'Subscript', lang.subscript, 'subscript', coreStyles.subscript );
		addButtonCommand( 'Superscript', lang.superscript, 'superscript', coreStyles.superscript );
	}
});

CKEDITOR.config.coreStyles = {
	// Basic Inline Styles.
	bold: { element: 'strong', overrides: 'b' },
	italic: { element: 'em', overrides: 'i' },
	underline: { element: 'u' },
	strike: { element: 'strike' },
	subscript: { element: 'sub' },
	superscript: { element: 'sup' }
};
