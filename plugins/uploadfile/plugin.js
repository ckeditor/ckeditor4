/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadfile', {
		requires: 'uploadwidget,link',
		init: function( editor ) {
			// Do not execute this paste listener if it will not be possible to upload file.
			if ( !this.isSupportedEnvironment() ) {
				return;
			}

			var fileTools = CKEDITOR.fileTools,
				uploadUrl = fileTools.getUploadUrl( editor.config );

			if ( !uploadUrl ) {
				CKEDITOR.error( 'uploadfile-config' );
				return;
			}

			fileTools.addUploadWidget( editor, 'uploadfile', {
				uploadUrl: fileTools.getUploadUrl( editor.config ),

				fileToElement: function( file ) {
					// Show a placeholder with an empty link during the upload.
					var a = new CKEDITOR.dom.element( 'a' );
					a.setText( file.name );
					a.setAttribute( 'href', '#' );
					return a;
				},

				onUploaded: function( upload ) {
					this.replaceWith( '<a href="' + upload.url + '" target="_blank">' + upload.fileName + '</a>' );
				}
			} );
		},

		isSupportedEnvironment: function() {
			return CKEDITOR.plugins.clipboard.isFileApiSupported;
		}
	} );
} )();
