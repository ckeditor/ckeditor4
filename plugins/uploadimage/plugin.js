/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadimage', {
		requires: 'uploadwidget',
		lang: 'en', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			CKEDITOR.plugins.uploadwidget.add( editor, 'uploadimage', {
				supportedExtentions: 'jpg,jpeg,png',

				uploadUrl: CKEDITOR.plugins.uploadmanager.getUploadUrl( editor.config, 'image' ),

				fileToElement: function( file ) {
					var img = new CKEDITOR.dom.element( 'img' );
					img.setAttribute( 'src', loadingImage );
					return img;
				},

				parts: {
					img: 'img'
				},

				onuploading: function( upload ) {
					editor.fire( 'lockSnapshot' );

					this.parts.img.setAttribute( 'src', upload.data );

					editor.fire( 'unlockSnapshot' );
				},

				transformUploaded: function( upload ) {
					// Set width and height to prevent blinking.
					return '<img src="' + upload.url + '" ' +
							'width="' + this.parts.img.$.naturalWidth + '" ' +
							'height="' + this.parts.img.$.naturalHeight +'">';
				}
			} );

			editor.on( 'paste', function( evt ) {
				var manager = editor.uploadManager,
					data = evt.data;

				var temp = new CKEDITOR.dom.element( 'div' ),
					imgs, img, i;

				temp.appendHtml( data.dataValue );
				imgs = temp.find( 'img' );

				for ( i = 0; i < imgs.count(); i++ ) {
					img = imgs.getItem( i );

					var isDataInSrc = img.getAttribute( 'src' ) && img.getAttribute( 'src' ).substring( 0, 5 ) == 'data:';

					if ( !img.data( 'cke-upload-id' ) && inEditableBlock( img ) && isDataInSrc ) {
						var loader = manager.createLoader( img.getAttribute( 'src' ) );
						loader.upload( uploadUrl );

						img.setAttributes( {
							'data-cke-upload-id': loader.id,
							'data-widget': 'uploadwidget'
						} );
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
