( function() {
	'use strict';

	CKEDITOR.plugins.add( 'objecturl', {
		init: function( editor ) {
			editor.on( 'getData', getDataListener );
			editor.on( 'toHtml', function( evt ) {
				evt.data.dataValue = base64ToBlob( evt.data.dataValue );
			}, null, null, 20 );
		}
	} );

	var blobs = [];

	function escapeRegExp( str ) {
		return str.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1' );
	}

	function getDataListener( evt ) {
		evt.data.dataValue = blobToBase64( evt.data.dataValue );
	}

	function blobToBase64( data ) {
		CKEDITOR.tools.array.forEach( blobs, function( blob ) {
			data = data.replace( new RegExp( escapeRegExp( blob.blob ), 'g' ), blob.base64 );
		} );
		return data;
	}


	function base64ToBlob( data ) {
		function base64extractor( input ) {
			var re = /data:(\S+?);base64,([^"]+)/g;
			return input.match( re );
		}

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

		var images = base64extractor( data );
		if ( images ) {

			CKEDITOR.tools.array.forEach( images, function( image ) {
				var blob = b64toBlob( image.slice( image.indexOf( ',' ) + 1, image.length ) );
				var type = image.slice( image.indexOf( ':' ) + 1, image.indexOf( ';' ) );
				blobs.push( {
					base64: image,
					blob: URL.createObjectURL( blob, type )
				} );
			}, this );

			CKEDITOR.tools.array.forEach( blobs, function( blob ) {
				data = data.replace( new RegExp( escapeRegExp( blob.base64 ), 'g' ), blob.blob );
			} );
		}
		return data;
	}

} )();
