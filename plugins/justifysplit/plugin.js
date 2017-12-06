/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {

	CKEDITOR.plugins.add( 'justifysplit', {
		// jscs:disable maximumLineLength
		lang: 'en', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'justifyblock,justifycenter,justifyleft,justifyright', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'menubutton,justifycore',
		init: function( editor ) {
			if ( editor.plugins.justify ) {
				return;
			}

			var alignments = [ 'left', 'center', 'right', 'block' ],
				items = {},
				alignment,
				i;

			for ( i = 0; i < alignments.length; i++ ) {

				alignment = alignments[ i ];

				items[ alignment + '_id' ] = {
					label: editor.lang.justifysplit[ alignment ],
					group: 'justifysplit',
					order: i,
					alignment: 'justify' + alignment,
					icon: 'justify' + alignment,
					onClick: function() {
						editor.execCommand( this.alignment );
					},
					role: 'menuitemcheckbox'
				};
			}

			// Initialize groups for menu.
			editor.addMenuGroup( 'justifysplit', 1 );
			editor.addMenuItems( items );

			// TODO add allowedContent and requiredContent from each command to ACF manually.
			// TODO there might be problem with refresh so split button should manually refresh commands.
			// TODO See #678.
			// // Registers command.
			// editor.addCommand( 'justifysplit', {
			// 	contextSensitive: true,
			// 	refresh: function( editor, path ) {
			// 		for ( var prop in items ) {
			// 			editor.getCommand( 'justifyright' ).refresh( editor, path );
			// 		}
			// 	}
			// } );

			editor.ui.add( 'Justify', CKEDITOR.UI_MENUBUTTON, {
				label: editor.lang.justifysplit.justify,
				toolbar: 'align,10',
				icon: 'justifyleft',
				onMenu: function() {
					var activeItems = {};
					for ( var prop in items ) {
						activeItems[ prop ] = CKEDITOR.TRISTATE_OFF;
					}

					return activeItems;
				}
			} );
		}
	} );
} )();
