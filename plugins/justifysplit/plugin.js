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
		requires: 'splitbutton,justifycore',
		init: function( editor ) {
			if ( editor.plugins.justify ) {
				return;
			}

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

			var lang = editor.lang.justifysplit;
			editor.ui.add( 'Justify', CKEDITOR.UI_SPLITBUTTON, {
				label: lang.justify,
				name: 'justify_splitbutton',
				toolbar: 'align,10',
				items: [ {
					label: lang.left,
					command: 'justifyleft',
					icon: 'justifyleft',
					'default': true
				}, {
					label: lang.center,
					command: 'justifycenter',
					icon: 'justifycenter'
				}, {
					label: lang.right,
					command: 'justifyright',
					icon: 'justifyright'
				}, {
					label: lang.block,
					command: 'justifyblock',
					icon: 'justifyblock'
				} ]
			} );
		}
	} );
} )();
