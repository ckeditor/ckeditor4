/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'uploadimage', {
	requires: 'clipboard',
	lang: 'en', // %REMOVE_LINE_CORE%
	init: function( editor ) {
		editor.on( 'paste', function( evt ) {
			var dataTransfer = evt.data.dataTransfer;

			if ( !dataTransfer.getFilesCount() ) {
				return;
			}

			for ( var i = 0; i < dataTransfer.getFilesCount(); i++ ) {
				console.log( dataTransfer.getFile( i ) );
			};
		} )
	}
} );
