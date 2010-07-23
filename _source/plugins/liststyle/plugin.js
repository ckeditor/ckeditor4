/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	CKEDITOR.plugins.liststyle = {
		requires: [ 'dialog' ],
		init: function( editor ) {
			editor.addCommand( 'numberedListStyle', new CKEDITOR.dialogCommand( 'numberedListStyle' ) );
			CKEDITOR.dialog.add( 'numberedListStyle', this.path + 'dialogs/liststyle.js' );
			editor.addCommand( 'bulletedListStyle', new CKEDITOR.dialogCommand( 'bulletedListStyle' ) );
			CKEDITOR.dialog.add( 'bulletedListStyle', this.path + 'dialogs/liststyle.js' );

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems ) {
				//Register map group;
				editor.addMenuGroup( "list", 108 );

				editor.addMenuItems({
					numberedlist: {
						label: editor.lang.list.numberedTitle,
						group: 'list',
						command: 'numberedListStyle'
					},
					bulletedlist: {
						label: editor.lang.list.bulletedTitle,
						group: 'list',
						command: 'bulletedListStyle'
					}
				});
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element, selection ) {
					if ( !element )
						return null;

					if ( element.getAscendant( 'ol' ) )
						return { numberedlist: CKEDITOR.TRISTATE_OFF };

					if ( element.getAscendant( 'ul' ) )
						return { bulletedlist: CKEDITOR.TRISTATE_OFF };
				});
			}
		}
	};

	CKEDITOR.plugins.add( 'liststyle', CKEDITOR.plugins.liststyle );
})();
