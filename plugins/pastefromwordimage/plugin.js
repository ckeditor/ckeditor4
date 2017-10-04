/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'pastefromwordimage', {
		requires: 'pastefromword',
		init: function() {}
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
				rePictureHeader = CKEDITOR.env.mac ? /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\d+?)?\s?/ : /\{\\pict[\s\S]+?\{\\\*\\blipuid[\s0-9a-f]+?\}\s?/,
				reShapeHeader = /\{\\shp[\s\S]+?\{\\\*\\svb\s?/,
				rePictureOrShape = new RegExp( '(?:(' + rePictureHeader.source + ')|(' + reShapeHeader.source + '))([0-9a-f\\s]+)\\}', 'g' ),
				unwantedType = CKEDITOR.env.mac ? '\\macpict' : '\\wmetafile',
				wholeImages,
				imageType;

			wholeImages = rtfContent.match( rePictureOrShape );
			if ( !wholeImages ) {
				return ret;
			}

			for ( var i = 0; i < wholeImages.length; i++ ) {
				if ( rePictureHeader.test( wholeImages[ i ] ) ) {
					if ( wholeImages[ i ].indexOf( unwantedType ) !== -1 ) {
						continue;
					} else if ( wholeImages[ i ].indexOf( '\\pngblip' ) !== -1 ) {
						imageType = 'image/png';
					} else if ( wholeImages[ i ].indexOf( '\\jpegblip' ) !== -1 ) {
						imageType = 'image/jpeg';
					} else {
						imageType = null;
					}

					ret.push( {
						hex: imageType ? wholeImages[ i ].replace( rePictureHeader, '' ).replace( /\s/g, '' ).replace( /\}/, '' ) : null,
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
		 * Method extracts array of src atributes in img tags from given HTML.
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
