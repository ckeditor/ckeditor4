( function() {
	'use strict';

	var blobs = {};

	var htmlFilter = new CKEDITOR.htmlParser.filter( {
		elements: {
			img: function( element ) {
				if ( element.attributes.src && element.attributes.src.indexOf( 'data:' ) === 0 ) {
					element.attributes.src = base64ToBlob( element.attributes.src );
					if ( element.attributes[ 'data-cke-saved-src' ] ) {
						element.attributes[ 'data-cke-saved-src' ] = element.attributes.src;
					}
				}
			}
		}
	} );

	var dataFormatFilter = new CKEDITOR.htmlParser.filter( {
		elements: {
			img: function( element ) {
				if ( element.attributes.src && element.attributes.src.indexOf( 'blob:' ) === 0 ) {
					element.attributes.src = blobToBase64( element.attributes.src );
					if ( element.attributes[ 'data-cke-saved-src' ] ) {
						element.attributes[ 'data-cke-saved-src' ] = element.attributes.src;
					}
				}
			}
		}
	} );

	function blobToBase64( blobUrl ) {
		return blobs[ blobUrl ];
	}

	/**
	 * Function transform base64 into blob URL in browsers. Also set up reference between blob url ans base64.
	 *
	 * @param {String} dataSrc String in form of base64
	 * @returns blobUrl
	 */
	function base64ToBlob( dataSrc ) {
		// https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
		function b64toBlob( b64Data, contentType, sliceSize ) {
			contentType = contentType || '';
			sliceSize = sliceSize || 512;

			var byteCharacters = atob( b64Data );
			var byteArrays = [];

			for ( var offset = 0; offset < byteCharacters.length; offset += sliceSize ) {
				var slice = byteCharacters.slice( offset, offset + sliceSize );

				var byteNumbers = new Array( slice.length );
				for ( var i = 0; i < slice.length; i++ ) {
					byteNumbers[ i ] = slice.charCodeAt( i );
				}

				var byteArray = new Uint8Array( byteNumbers );

				byteArrays.push( byteArray );
			}

			var blob = new Blob( byteArrays, { type: contentType } );
			return blob;
		}
		// Cxtract vlaues necessary for blob
		var blob = b64toBlob( dataSrc.slice( dataSrc.indexOf( ',' ) + 1, dataSrc.length ) );
		var type = dataSrc.slice( dataSrc.indexOf( ':' ) + 1, dataSrc.indexOf( ';' ) );
		var blobUrl = URL.createObjectURL( blob, type );

		// Store Blob reference to have possibility to switch it back.
		blobs[ blobUrl ] = dataSrc;

		return blobUrl;
	}

	CKEDITOR.plugins.add( 'objecturl', {
		init: function( editor ) {
			editor.on( 'toHtml', function( evt ) {
				htmlFilter.applyTo( evt.data.dataValue );
			}, null, null, 10 );
			editor.on( 'toDataFormat', function( evt ) {
				dataFormatFilter.applyTo( evt.data.dataValue );
			}, null, null, 10 );
		}
	} );

} )();
