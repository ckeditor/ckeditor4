/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEDITOR */

// This filter could be one day merged to common filter. However currently pasteTools.createFilter doesn't pass additional arguments,
// so it's not possible to pass rtf clipboard to it (#3670).
( function() {
	'use strict';

	CKEDITOR.pasteFilters.image = function( html, editor, rtf ) {
		var imgTags,
			hexImages,
			newSrcValues = [],
			i;

		if ( !rtf ) {
			return html;
		}

		imgTags = extractTagsFromHtml( html );

		if ( imgTags.length === 0 ) {
			return html;
		}

		hexImages = extractFromRtf( rtf );

		if ( hexImages.length === 0 ) {
			return html;
		}

		CKEDITOR.tools.array.forEach( hexImages, function( img ) {
			newSrcValues.push( createSrcWithBase64( img ) );
		}, this );

		if ( imgTags.length === newSrcValues.length ) {
			for ( i = 0; i < imgTags.length; i++ ) {
				// Replace only `file` urls of images ( shapes get newSrcValue with null ).
				if ( ( imgTags[ i ].indexOf( 'file://' ) === 0 ) && newSrcValues[ i ] ) {
					html = html.replace( imgTags[ i ], newSrcValues[ i ] );
				}
			}
		}

		return html;
	};

	function extractFromRtf( rtfContent ) {
		var ret = [],
			// Regexp for picture header. Please note that instead \pngblip there might be also \jpegblip
			// for different image compression type.
			// 1. {\pict … \pngblip                  <- here inside "…" curly brakcets never appear
			// 2. {\*\shppict{\pict{\* … \pngblip    <- here inside "…" curly brackets might be present
			rePictureHeader = /(\{\\pict[^{}]+?|\{\\\*\\shppict\{\\pict\{\\\*[^*]+?)\\(?:jpeg|png)blip/,
			rePicture = new RegExp( '(?:(' + rePictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g' ),
			wholeImages,
			imageType;

		wholeImages = rtfContent.match( rePicture );

		if ( !wholeImages ) {
			return ret;
		}

		for ( var i = 0; i < wholeImages.length; i++ ) {
			if ( rePictureHeader.test( wholeImages[ i ] ) ) {
				if ( wholeImages[ i ].indexOf( '\\pngblip' ) !== -1 ) {
					imageType = 'image/png';
				} else if ( wholeImages[ i ].indexOf( '\\jpegblip' ) !== -1 ) {
					imageType = 'image/jpeg';
				} else {
					continue;
				}

				ret.push( {
					hex: imageType ? wholeImages[ i ].replace( rePictureHeader, '' ).replace( /[^\da-fA-F]/g, '' ) : null,
					type: imageType
				} );
			}
		}

		return ret;
	}

	function extractTagsFromHtml( html ) {
		var regexp = /<img[^>]+src="([^"]+)[^>]+/g,
			ret = [],
			item;

		while ( item = regexp.exec( html ) ) {
			ret.push( item[ 1 ] );
		}

		return ret;
	}

	function createSrcWithBase64( img ) {
		return img.type ? 'data:' + img.type + ';base64,' + CKEDITOR.tools.convertBytesToBase64( CKEDITOR.tools.convertHexStringToBytes( img.hex ) ) : null;
	}

} )();
