/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview This plugin handles pasting content from Libre Office.
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'pastefromlibreoffice', {
		requires: 'pastetools',

		init: function( editor ) {
			var pasteToolsPath = CKEDITOR.plugins.getPath( 'pastetools' ),
				path = this.path;

			editor.pasteTools.register( {
				filters: [
					CKEDITOR.getUrl( pasteToolsPath + 'filter/common.js' ),
					CKEDITOR.getUrl( path + 'filter/default.js' )
				],

				canHandle: function( evt ) {
					var data = evt.data,
						textHtml = data.dataTransfer.getData( 'text/html', true ) || data.dataValue,
						hasMetaGeneratorTag = /<meta\s+name=["']?generator["']?\s+content=["']?/gi,
						isLibreOffice = /<meta\s+name=["']?generator["']?\s+content=["']?LibreOffice/gi,

					// TO DO instead of true, here might be browser sniffing. However, it should be stubbed somehow in generated tests.
					return hasMetaGeneratorTag.test( textHtml ) ? isLibreOffice.test( textHtml ) : true;
				},

				handle: function( evt, next ) {
					var data = evt.data,
						clipboardHtml = data.dataValue || CKEDITOR.plugins.pastetools.getClipboardData( data, 'text/html' );

					// Do not apply the paste filter to data filtered by the the Google Docs filter (https://dev.ckeditor.com/ticket/13093).
					// TO DO it might be unnecessary!!!
					data.dontFilter = true;

					data.dataValue = CKEDITOR.pasteFilters.pflibreoffice( clipboardHtml, editor );

					if ( editor.config.forcePasteAsPlainText === true ) {
						// If `config.forcePasteAsPlainText` is set to `true`, force plain text even on Libre Office content (#1013).
						data.type = 'text';
					}

					next();
				},
				priority: 100
			} );
		}
	} );
} )();
