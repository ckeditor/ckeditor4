/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	// Regex by @dperini.
	var validUrlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
		doubleQuoteRegex = /"/g;

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

				// #13419
				data = data.replace( validUrlRegex , '<a href="' + data.replace( doubleQuoteRegex, '%22' ) + '">$&</a>' );

				// If link was discovered, change the type to 'html'. This is important e.g. when pasting plain text in Chrome
				// where real type is correctly recognized.
				if ( data != evt.data.dataValue ) {
					evt.data.type = 'html';
				}

				evt.data.dataValue = data;
			} );
		}
	} );
} )();
