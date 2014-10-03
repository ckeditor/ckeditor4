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

			filetools.addUploadWidget( editor, 'uploadimage', {
				supportedExtentions: 'jpg,jpeg,png',

				uploadUrl: uploadUrl,

				fileToElement: function( file ) {
					var img = new CKEDITOR.dom.element( 'img' );
					img.setAttribute( 'src', loadingImage );
					return img;
				},

				parts: {
					img: 'img'
				},

				onuploading: function( upload ) {
					this.parts.img.setAttribute( 'src', upload.data );
				},

				onuploaded: function( upload ) {
					// Set width and height to prevent blinking.
					var html = '<img src="' + upload.url + '" ' +
							'width="' + this.parts.img.$.naturalWidth + '" ' +
							'height="' + this.parts.img.$.naturalHeight +'">';
					this.replaceWith( html );
				}
			} );

			editor.on( 'paste', function( evt ) {
				var uploads = editor.uploadsRepository,
					data = evt.data;

				var temp = new CKEDITOR.dom.element( 'div' ),
					imgs, img, i;

				temp.appendHtml( data.dataValue );
				imgs = temp.find( 'img' );

				for ( i = 0; i < imgs.count(); i++ ) {
					img = imgs.getItem( i );

					var isDataInSrc = img.getAttribute( 'src' ) && img.getAttribute( 'src' ).substring( 0, 5 ) == 'data:';

					if ( !img.data( 'cke-upload-id' ) && inEditableBlock( img ) && isDataInSrc ) {
						var loader = uploads.create( img.getAttribute( 'src' ) );
						loader.upload( uploadUrl );

						filetools.markElement( img, 'uploadimage', loader.id );
					}
				}

				data.dataValue = temp.getHtml();

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

	var loadingImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94JCQopEbeZwMsAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAD0lEQVQoz2NgGAWjYCgBAAKyAAGlkzepAAAAAElFTkSuQmCC';
} )();
