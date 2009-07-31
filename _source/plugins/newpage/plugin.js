/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file Horizontal Page Break
 */

// Register a plugin named "newpage".
CKEDITOR.plugins.add( 'newpage', {
	init: function( editor ) {
		editor.addCommand( 'newpage', { modes:{wysiwyg:1,source:1 },

			exec: function( editor ) {
				var command = this;

				function afterCommand() {
					// Defer to happen after 'selectionChange'.
					setTimeout( function() {
						editor.fire( 'afterCommandExec', {
							name: command.name,
							command: command
						});
					}, 500 );
				}
				if ( editor.mode == 'wysiwyg' )
					editor.on( 'contentDom', function( evt ) {

					evt.removeListener();
					afterCommand();
				});

				editor.setData( editor.config.newpage_html );
				editor.focus();

				if ( editor.mode == 'source' )
					afterCommand();

			},
			async: true
		});

		editor.ui.addButton( 'NewPage', {
			label: editor.lang.newPage,
			command: 'newpage'
		});
	}
});
/**
 * The HTML to load in the editor when the "new page" command is executed.
 * @type String
 * @default ''
 * @example
 * config.newpage_html = '&lt;p&gt;Type your text here.&lt;/p&gt;';
 */
CKEDITOR.config.newpage_html = '';
