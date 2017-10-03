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

			editor.on( 'afterPasteFromWord', this.pasteListener, this );
		},

		pasteListener: function( evt ) {
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
				newSrcValues.push( this.createSrcWithBase64( img ) );
			}, this );

			// Assumption there is equal amout of Images in RTF and HTML source, so we can match them accoriding to existing order.
			if ( imgTags.length === newSrcValues.length ) {
				for ( i = 0; i < imgTags.length; i++ ) {
					// Replace only `file` urls and real images ( shapes are null ).
					if ( ( imgTags[ i ].indexOf( 'file:///' ) === 0 ) && newSrcValues[ i ] ) {
						evt.data.dataValue = evt.data.dataValue.replace( imgTags[ i ], newSrcValues[ i ] );
					}
				}
			} else {
				throw new Error( 'There appeared a problem with embeding images while pasting from Word.' );
			}

		},

		createSrcWithBase64: function( img ) {
			return img.type ? 'data:' + img.type + ';base64,' + this.hexToBase64( img.hex ) : null;
		},

		hexToBase64: function( hexString ) {
			return CKEDITOR.tools.convertBytesToBase64( CKEDITOR.tools.convertHexStringToBytes( hexString ) );
		}

	} );

	/**
	 * Help methods used by paste from word image plugin.
	 *
	 * @since 4.8.0
	 * @class CKEDITOR.plugins.pastefromwordimage
	 */
	CKEDITOR.plugins.pastefromwordimage = {
		/**
		 * Method parses RTF content to find embedded images.
		 *
		 * @private
		 * @since 4.8.0
		 * @param {String} rtfContent RTF content to be checked for images.
		 * @returns {Object[]} An array of images found in the `rtfContent`.
		 * @returns {String/null} return.hex Hexadecimal string of an image embedded in `rtfContent`.
		 * @returns {String/null} return.type String represent type of image, allowed values: 'image/png', 'image/jpeg' or `null` in case of unsupported
		 * cases like shapes.
		 */
		extractImagesFromRtf: function( rtfContent ) {
			var ret = [],
				rePictureHeader = /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/,
				reShapeHeader = /\{\\shp\{\\\*\\shpinst[\s\S]+?\{\\\*\\svb\s?/,
				rePictureOrShape = new RegExp( '(?:(' + rePictureHeader.source + ')|(' + reShapeHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g' ),
				wholeImages,
				imageType;

			wholeImages = rtfContent.match( rePictureOrShape );
			if ( !wholeImages ) {
				return ret;
			}

			for ( var i = 0; i < wholeImages.length; i++ ) {
				if ( rePictureHeader.test( wholeImages[ i ] ) ) {
					if ( wholeImages[ i ].indexOf( '\\wmetafile' ) !== -1 || wholeImages[ i ].indexOf( '\\macpict' ) !== -1 ) {
						continue;
					} else if ( wholeImages[ i ].indexOf( '\\pngblip' ) !== -1 ) {
						imageType = 'image/png';
					} else if ( wholeImages[ i ].indexOf( '\\jpegblip' ) !== -1 ) {
						imageType = 'image/jpeg';
					} else {
						imageType = null;
					}

					ret.push( {
						hex: imageType ? wholeImages[ i ].replace( rePictureHeader, '' ).replace( /[^\da-fA-F]/g, '' ) : null,
						type: imageType
					} );
				} else if ( reShapeHeader.test( wholeImages[ i ] ) ) {
					// We left information about shapes, to have proper indexes of images.
					ret.push( {
						hex: null,
						type: null
					} );
				}
			}

			return ret;
		},

		/**
		 * Method extracts array of src attributes in img tags from given HTML.
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
			var regexp = /<img[^>]+src="([^"]+)/g,
				ret = [],
				item;

			while ( item = regexp.exec( html ) ) {
				ret.push( item[ 1 ] );
			}

			return ret;
		}
	};
} )();
