/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadimage', {
		requires: 'widget,clipboard',
		lang: 'en', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var manager = new UploadManager();

			editor.widgets.add( 'uploadimage', {
				parts: {
					img: 'img'
				},

				upcast: function( el, data ) {
					if ( el.name != 'img' || !el.attributes[ 'data-cke-image-to-upload' ] )
						return;

					return el;
				},

				downcast: function() {
					return new CKEDITOR.htmlParser.text( '' );
				},

				init: function() {
					manager.upload( this.parts.img.getAttribute( 'src' ) );
				},

				data: function( data ) {
				}
			} );

			editor.on( 'paste', function( evt ) {
				var data = evt.data,
					dataTransfer = data.dataTransfer,
					filesCount = dataTransfer.getFilesCount();

				if ( data.dataValue || !filesCount ) {
					return;
				}

				var loadedFilesCount = 0,
					file, reader, i;

				evt.cancel();

				dataTransfer.cacheData();

				for ( i = 0; i < filesCount; i++ ) {
					file = dataTransfer.getFile( i ),
					reader = new FileReader();

					reader.onload = function( evt ) {
						var img = new CKEDITOR.dom.element( 'img' );
						img.setAttributes( {
							'src': evt.target.result,
							'data-cke-file-name': file.name
						} );
						data.dataValue += img.getOuterHtml();

						loadedFilesCount++;

						if ( loadedFilesCount == filesCount ) {
							editor.fire( 'paste', data );
						}
					};

					reader.readAsDataURL( file );
				}
			} );

			editor.on( 'paste', function( evt ) {
				var data = evt.data;

				var temp = new CKEDITOR.dom.element( 'div' ),
					imgs, img, i;
				temp.appendHtml( data.dataValue );
				imgs = temp.find( 'img' );

				for ( i = 0; i < imgs.count(); i++ ) {
					img = imgs.getItem( i );

					if ( img.getAttribute( 'src' ).substring( 0, 5 ) == 'data:' && !inEditableBlock( img ) ) {
						img.setAttributes( {
							'data-cke-special-image': 1,
							'data-cke-image-to-upload': 1
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

	var imgHeaderRegExp = /^data:(image\/(png|jpg|jpeg));base64,/;

	function srcToBlob( src ) {
		var contentType = src.match( imgHeaderRegExp )[ 1 ],
			base64Data = src.replace( imgHeaderRegExp, '' ),
			byteCharacters = atob( base64Data ),
			byteArrays = [],
			sliceSize = 512,
			offset, slice, byteNumbers, i, byteArray;

		for ( offset = 0; offset < byteCharacters.length; offset += sliceSize ) {
			slice = byteCharacters.slice( offset, offset + sliceSize );

			byteNumbers = new Array( slice.length );
			for ( i = 0; i < slice.length; i++ ) {
				byteNumbers[ i ] = slice.charCodeAt( i );
			}

			byteArray = new Uint8Array( byteNumbers );

			byteArrays.push( byteArray );
		}

		return new Blob( byteArrays, { type: contentType } );
	}

	function UploadManager() {
	}

	UploadManager.prototype = {
		upload: function( data ) {
			var file = srcToBlob( data ),
				xhr = new XMLHttpRequest(),
				formData = new FormData();

			formData.append( 'upload', file );

			xhr.open( "POST", editor.config.filebrowserImageUploadUrl, true ); // method, url, async

			xhr.onreadystatechange = function() {
				if ( xhr.readyState == 4 ) { // completed
					if ( xhr.status == 200 ) { // OK
						console.log( 'onreadystatechange:' );
						console.log( xhr.responseText );
					}
				}
			}

			xhr.send( formData );
		}
	}
} )();