/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview This plugin handles pasting content from Google Docs.
 */

( function() {
	CKEDITOR.plugins.add( 'pastefromgdocs', {
		requires: 'pastetools',

		init: function( editor ) {
			var pasteToolsPath = CKEDITOR.plugins.getPath( 'pastetools' ),
				path = this.path;

			editor.pasteTools.register( {
				filters: [
					CKEDITOR.getUrl( pasteToolsPath + 'filter/common.js' ),
					CKEDITOR.getUrl(  path + 'filter/default.js' )
				],

				canHandle: function( evt ) {
					var detectGDocsRegex = /id=(\"|\')?docs\-internal\-guid\-/;

					return detectGDocsRegex.test( evt.data.dataValue );
				},

				handle: function( evt, next ) {
					var data = evt.data,
						gDocsHtml = CKEDITOR.plugins.pastetools.getClipboardData( data, 'text/html' );

					// Do not apply the paste filter to data filtered by the the Google Docs filter (https://dev.ckeditor.com/ticket/13093).
					data.dontFilter = true;
					data.dataValue = CKEDITOR.pasteFilters.gdocs( gDocsHtml, editor );

					if ( editor.config.forcePasteAsPlainText === true ) {
						// If `config.forcePasteAsPlainText` is set to `true`, force plain text even on Google Docs content (#1013).
						data.type = 'text';
					}

					next();
				}
			} );
		}

	} );
} )();
