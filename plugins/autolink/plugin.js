/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	// Regex by Imme Emosol.
	var validUrlRegex = /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?[^\s\.,]$/ig,
		// Regex by (https://www.w3.org/TR/html5/forms.html#valid-e-mail-address).
		validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g,
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

				// Create valid email links (#1761).
				if ( data.match( validEmailRegex ) ) {
					data = data.replace( validEmailRegex, '<a href="mailto:' + data.replace( doubleQuoteRegex, '%22' ) + '">$&</a>' );
					data = tryToEncodeLink( data );
				} else {
					// https://dev.ckeditor.com/ticket/13419
					data = data.replace( validUrlRegex , '<a href="' + data.replace( doubleQuoteRegex, '%22' ) + '">$&</a>' );
				}

				// If link was discovered, change the type to 'html'. This is important e.g. when pasting plain text in Chrome
				// where real type is correctly recognized.
				if ( data != evt.data.dataValue ) {
					evt.data.type = 'html';
				}

				evt.data.dataValue = data;
			} );

			function tryToEncodeLink( data ) {
				// If enabled use link plugin to encode email link.
				if ( editor.plugins.link ) {
					var link = CKEDITOR.dom.element.createFromHtml( data ),
						linkData = CKEDITOR.plugins.link.parseLinkAttributes( editor, link ),
						attributes = CKEDITOR.plugins.link.getLinkAttributes( editor, linkData );

					if ( !CKEDITOR.tools.isEmpty( attributes.set ) ) {
						link.setAttributes( attributes.set );
					}

					if ( attributes.removed.length ) {
						link.removeAttributes( attributes.removed );
					}
					return link.getOuterHtml();
				}
				return data;
			}
		}
	} );
} )();
