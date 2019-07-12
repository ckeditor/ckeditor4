/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
					var detectGDocsRegex = /id=(\"|\')docs\-internal\-guid\-/;

					return detectGDocsRegex.test( evt.data.dataValue );
				},

				handle: function( evt, next ) {
					var data = evt.data,
						dataTransferHtml = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ?
							data.dataTransfer.getData( 'text/html', true ) : null,
						gDocsHtml = dataTransferHtml || data.dataValue;

					// Do not apply paste filter to data filtered by the GDocs filter (https://dev.ckeditor.com/ticket/13093).
					data.dontFilter = true;
					data.dataValue = CKEDITOR.pasteFilters.gdocs( gDocsHtml, editor );

					if ( editor.config.forcePasteAsPlainText === true ) {
						// If `config.forcePasteAsPlainText` set to true, force plain text even on Word content (#1013).
						data.type = 'text';
					} else if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported && editor.config.forcePasteAsPlainText === 'allow-word' ) {
						// In browsers using pastebin when pasting from Word, evt.data.type is 'auto' (not 'html') so it gets converted
						// by 'pastetext' plugin to 'text'. We need to restore 'html' type (#1013) and (#1638).
						data.type = 'html';
					}

					next();
				}
			} );
		}

	} );
} )();
