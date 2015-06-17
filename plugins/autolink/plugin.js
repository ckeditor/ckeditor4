/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'autolink', {
	requires: 'clipboard',

	init: function( editor ) {
		editor.on( 'paste', function( evt ) {
			var data = evt.data.dataValue;

			if ( evt.data.dataTransfer.getTransferType( editor ) == CKEDITOR.DATA_TRANSFER_INTERNAL ) {
				return;
			}

			// If we found "<" it means that most likely there's some tag and we don't want to touch it.
			if ( data.indexOf( '<' ) > -1 ) {
				return;
			}

			// Regex by Imme Emosol.
			data = data.replace( /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?[^\s\.,]$/ig , '<a href="$&">$&</a>' );

			// If link was discovered, change the type to 'html'. This is important e.g. when pasting plain text in Chrome
			// where real type is correctly recognized.
			if ( data != evt.data.dataValue ) {
				evt.data.type = 'html';
			}

			evt.data.dataValue = data;
		} );
	}
} );