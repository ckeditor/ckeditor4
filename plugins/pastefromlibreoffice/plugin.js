/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview This plugin handles pasting content from LibreOffice.
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'pastefromlibreoffice', {
		requires: 'pastetools',

		isSupportedEnvironment: function() {
			var isSafari = CKEDITOR.env.webkit && !CKEDITOR.env.chrome,
				isIE = CKEDITOR.env.ie && CKEDITOR.env.version <= 11;

			return !isSafari && !isIE;
		},

		init: function( editor ) {
			if ( !this.isSupportedEnvironment() ) {
				return;
			}

			var pasteToolsPath = CKEDITOR.plugins.getPath( 'pastetools' ),
				path = this.path;

			editor.pasteTools.register( {
				priority: 100, // after PFW
				filters: [
					CKEDITOR.getUrl( pasteToolsPath + 'filter/common.js' ),
					CKEDITOR.getUrl( pasteToolsPath + 'filter/image.js' ),
					CKEDITOR.getUrl( path + 'filter/default.js' )
				],

				canHandle: function( evt ) {
					var data = evt.data,
						textHtml = data.dataTransfer.getData( 'text/html', true ) || data.dataValue,
						generatorName;

					// Do not run the filter if there is no input data.
					if ( !textHtml ) {
						return false;
					}

					generatorName = CKEDITOR.plugins.pastetools.getContentGeneratorName( textHtml );

					return generatorName === 'libreoffice';
				},

				handle: function( evt, next ) {
					var data = evt.data,
						clipboardHtml = data.dataValue || CKEDITOR.plugins.pastetools.getClipboardData( data, 'text/html' );

					// Do not apply the paste filter to the data filtered by the LibreOffice filter (https://dev.ckeditor.com/ticket/13093).
					// TO DO it might be unnecessary!!!
					data.dontFilter = true;

					clipboardHtml = CKEDITOR.pasteFilters.image( clipboardHtml, editor, CKEDITOR.plugins.pastetools.getClipboardData( data, 'text/rtf' ) );

					data.dataValue = CKEDITOR.pasteFilters.libreoffice( clipboardHtml, editor );

					if ( editor.config.forcePasteAsPlainText === true ) {
						// If `config.forcePasteAsPlainText` is set to `true`, force plain text even on Libre Office content (#1013).
						data.type = 'text';
					}

					next();
				}
			} );
		}
	} );
} )();
