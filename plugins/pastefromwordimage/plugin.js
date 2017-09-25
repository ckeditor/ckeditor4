/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	/**
	 * Help methods used by paste from word image plugin.
	 *
	 * @since 4.8.0
	 * @class CKEDITOR.plugins.pastefromwordimage
	 */
	CKEDITOR.plugins.pastefromwordimage = {
		/**
		 * Methods parse rtf clipboard to find embeded images.
		 *
		 * @private
		 * @since 4.8.0
		 * @param {String} rtfClipboard Data obtained from rtf clipboard.
		 * @returns {Array} Contains array of objects with images.
		 * @returns {Object} return.Object Single image found in `rtfClipboard`.
		 * @returns {String/null} return.Object.hex Hexadecimal string of image embeded in rtf clipboard.
		 * @returns {String/null} return.Object.type String represent type of image, allowed values: 'image/png', 'image/jpeg' or `null`
		 */
		extractImagesFromRtf: function( rtfClipboard ) {
			var images = [],
				rePicture = /(?:\{\\\*\\shppict[\s\S]+?{\\\*\\blipuid\s+[0-9a-f]+\}\s?)([0-9a-f\s]+)\}\}/g,
				rePictureHeader = /\{\\\*\\shppict[\s\S]+?{\\\*\\blipuid\s+[0-9a-f]+\}\s?/,
				wholeImage,
				imageType;

			wholeImage = rtfClipboard.match( rePicture );
			if ( !wholeImage ) {
				return;
			}

			for ( var i = 0, len = wholeImage.length; i < len; i++ ) {
				if ( wholeImage[ i ].indexOf( '\\pngblip' ) !== -1 ) {
					imageType = 'image/png';
				} else if ( wholeImage[ i ].indexOf( '\\jpegblip' ) !== -1 ) {
					imageType = 'image/jpeg';
				} else {
					imageType = null;
				}

				images.push( {
					hex: imageType ? wholeImage[ i ].replace( rePictureHeader, '' ).replace( /\s/g, '' ).replace( /\}\}/, '' ) : null,
					type: imageType
				} );
			}

			return images;
		},

		/**
		 * Method extracts array of img tags.
		 *
		 * @private
		 * @since 4.8.0
		 * @param {String} htmlString String represent HTML code.
		 * @returns {Array} Array of arrays represent img tags found in `dataValue`.
		 * @returns {Array} return.Array Single result of `regexp.exec`, which finds img tags.
		 */
		extractImgTagsFromHtmlString: function( htmlString ) {
			var regexp = /<img[^>]+src="([^"]+)/g,
				ret = [];

			do {
				ret.push( regexp.exec( htmlString ) );
			} while ( ret[ ret.length - 1 ] );

			// Remove null.
			ret.pop();

			return ret;
		}
	};
} )();
