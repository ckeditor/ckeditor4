/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'pastefromwordimage', {
		requires: 'pastefromword',
		init: function( editor ) {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				return;
			}

			// Register a proper filter, so that images are not stripped out.
			editor.filter.allow( 'img[src]' );

			editor.on( 'afterPasteFromWord', pasteListener );
		}
	} );


	function pasteListener( evt ) {
		var pfwi = CKEDITOR.plugins.pastefromwordimage,
			imgTags,
			hexImages,
			newSrcValues = [],
			i;

		imgTags = pfwi.extractImgTagsFromHtml( evt.data.dataValue );
		if ( imgTags.length === 0 ) {
			return;
		}

		hexImages = pfwi.extractImagesFromRtf( evt.data.dataTransfer[ 'text/rtf' ] );
		if ( hexImages.length === 0 ) {
			return;
		}

		CKEDITOR.tools.array.forEach( hexImages, function( img ) {
			newSrcValues.push( createSrcWithBase64( img ) );
		}, this );

		// Assumption there is equal amount of Images in RTF and HTML source, so we can match them accordingly to existing order.
		if ( imgTags.length === newSrcValues.length ) {
			for ( i = 0; i < imgTags.length; i++ ) {
				// Replace only `file` urls of images ( shapes get newSrcValue with null ).
				if ( ( imgTags[ i ].indexOf( 'file://' ) === 0 ) && newSrcValues[ i ] ) {
					evt.data.dataValue = evt.data.dataValue.replace( imgTags[ i ], newSrcValues[ i ] );
				}
			}
		}
	}

	function createSrcWithBase64( img ) {
		return img.type ? 'data:' + img.type + ';base64,' + CKEDITOR.tools.convertBytesToBase64( CKEDITOR.tools.convertHexStringToBytes( img.hex ) ) : null;
	}

	/**
	 * Help methods used by paste from word image plugin.
	 *
	 * @since 4.8.0
	 * @class CKEDITOR.plugins.pastefromwordimage
	 */
	CKEDITOR.plugins.pastefromwordimage = {
		/**
		 * Method parses RTF content to find embedded images. Please be aware that method should only return `png` and `jpeg` images.
		 *
		 * @private
		 * @since 4.8.0
		 * @param {String} rtfContent RTF content to be checked for images.
		 * @returns {Object[]} An array of images found in the `rtfContent`.
		 * @returns {String} return.hex Hexadecimal string of an image embedded in `rtfContent`.
		 * @returns {String} return.type String represent type of image, allowed values: 'image/png', 'image/jpeg'
		 */
		extractImagesFromRtf: function( rtfContent ) {
			var ret = [],
				rePictureHeader = /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/,
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
		},

		/**
		 * Method extracts array of src attributes in img tags from given HTML. Img tags belong to VML shapes are removed.
		 * Method base on `data-cke-is-shape="true"` attribute, which is add to shapes by Paste From Word plugin.
		 *
		 *		CKEDITOR.plugins.pastefromwordimage.extractImgTagsFromHtmlString( html );
		 * 		// Returns: [ 'http://example-picture.com/random.png', 'http://example-picture.com/another.png' ]
		 *
		 * @private
		 * @since 4.8.0
		 * @param {String} html String represent HTML code.
		 * @returns {String[]} Array of strings represent src attribute of img tags found in `html`.
		 */
		extractImgTagsFromHtml: function( html ) {
			var regexp = /<img[^>]+src="([^"]+)[^>]+/g,
				ret = [],
				item;

			while ( item = regexp.exec( html ) ) {
				if ( item[ 0 ].indexOf( 'data-cke-is-shape="true"' ) === -1 ) {
					ret.push( item[ 1 ] );
				}
			}

			return ret;
		}

	};
} )();
