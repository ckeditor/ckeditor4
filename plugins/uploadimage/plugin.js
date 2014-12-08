/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadimage', {
		requires: 'uploadwidget',

		init: function( editor ) {
			var filetools = CKEDITOR.filetools,
				uploadUrl = filetools.getUploadUrl( editor.config, 'image' );

			// Handle images which are available in the dataTransfer.
			filetools.addUploadWidget( editor, 'uploadimage', {
				supportedTypes: /image\/(jpeg|png|gif)/,

				uploadUrl: uploadUrl,

				fileToElement: function() {
					var img = new CKEDITOR.dom.element( 'img' );
					img.setAttribute( 'src', loadingImage );
					return img;
				},

				parts: {
					img: 'img'
				},

				onuploading: function( upload ) {
					// Show the image during the upload.
					this.parts.img.setAttribute( 'src', upload.data );
				},

				onuploaded: function( upload ) {
					// Set width and height to prevent blinking.
					this.replaceWith( '<img src="' + upload.url + '" ' +
						'width="' + this.parts.img.$.naturalWidth + '" ' +
						'height="' + this.parts.img.$.naturalHeight + '">' );
				}
			} );

			// Handle images which are not available in the dataTransfer.
			// This means that we need to read them from the <img src="data:..."> elements.
			editor.on( 'paste', function( evt ) {
				var data = evt.data,
					temp = new CKEDITOR.dom.element( 'div' ),
					imgs, img, i;

				temp.appendHtml( data.dataValue );
				imgs = temp.find( 'img' );

				for ( i = 0; i < imgs.count(); i++ ) {
					img = imgs.getItem( i );

					// Image have to contain src=data:...
					var isDataInSrc = img.getAttribute( 'src' ) && img.getAttribute( 'src' ).substring( 0, 5 ) == 'data:';

					// We are not uploading images in non-editable blocs.
					if ( isDataInSrc && !img.data( 'cke-upload-id' ) && inEditableBlock( img ) ) {
						var loader = editor.uploadsRepository.create( img.getAttribute( 'src' ) );
						loader.upload( uploadUrl );

						filetools.markElement( img, 'uploadimage', loader.id );
					}
				}

				data.dataValue = temp.getHtml();

				// Check if the element is in the editable block. Function assumes that the root block is editable.
				function inEditableBlock( element ) {
					while ( element ) {
						if ( element.data( 'cke-editable' ) )
							return true;
						if ( element.getAttribute( 'contentEditable' ) == 'false' )
							return false;
						if ( element.getAttribute( 'contentEditable' ) == 'true' )
							return true;

						element = element.getParent();
					}

					return true;
				}
			} );
		}
	} );

	// jscs:disable maximumLineLength
	// Black rectangle which is shown before image is loaded.
	var loadingImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94JCQopEbeZwMsAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAD0lEQVQoz2NgGAWjYCgBAAKyAAGlkzepAAAAAElFTkSuQmCC';
	// jscs:enable maximumLineLength

	/**
	 * URL where images should be uploaded.
	 *
	 * @since 4.5
	 * @cfg {String} [imageUploadUrl='' (empty string = disabled)]
	 * @member CKEDITOR.config
	 */
} )();
