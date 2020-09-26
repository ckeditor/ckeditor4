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
			newSrcValues,
			i;

		// If there is no RTF content or the editor does not allow images, skip embedding.
		if ( !rtf || ( editor.activeFilter && !editor.activeFilter.check( 'img[src]' ) ) ) {
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

		newSrcValues = CKEDITOR.tools.array.map( hexImages, function( img ) {
			return createSrcWithBase64( img );
		}, this );

		// Assuming there is equal amount of Images in RTF and HTML source, so we can match them accordingly to the existing order.
		if ( imgTags.length === newSrcValues.length ) {
			for ( i = 0; i < imgTags.length; i++ ) {
				// Replace only `file` urls of images ( shapes get newSrcValue with null ).
				if ( ( imgTags[ i ].indexOf( 'file://' ) === 0 ) ) {
					if ( !newSrcValues[ i ] ) {
						CKEDITOR.error( 'pastetools-unsupported-image', {
							type: hexImages[ i ].type
						} );

						continue;
					}

					// In Word there is a chance that some of the images are also inserted via VML.
					// This regex ensures that we replace only HTML <img> tags.
					// Oh, and there are also Windows paths that need to be escaped
					// before passing to regex.
					var escapedPath = imgTags[ i ].replace( /\\/g, '\\\\' ),
						imgRegex = new RegExp( '(<img [^>]*src=["\']?)' + escapedPath );

					html = html.replace( imgRegex, '$1' + newSrcValues[ i ] );
				}
			}
		}

		return html;
	};

	CKEDITOR.pasteFilters.image.extractFromRtf = extractFromRtf;
	CKEDITOR.pasteFilters.image.extractTagsFromHtml = extractTagsFromHtml;

	function extractFromRtf( rtfContent ) {
		var filter = CKEDITOR.plugins.pastetools.filters.common.rtf,
			ret = [],
			wholeImages,
			imageType;

		// Remove headers, footers and non-Word images.
		// Headers and footers are in \header* and \footer* groups,
		// non-Word images are inside \nonshp groups.
		rtfContent = filter.removeGroups( rtfContent, '(?:(?:header|footer)[lrf]?|nonshppict)' );
		wholeImages = filter.getGroups( rtfContent, 'pict' );

		if ( !wholeImages ) {
			return ret;
		}

		for ( var i = 0; i < wholeImages.length; i++ ) {
			var currentImage = wholeImages[ i ].content,
				id = getImageId( currentImage ),
				imageDataIndex = getImageIndex( id ),
				isAlreadyExtracted = imageDataIndex !== -1 && ret[ imageDataIndex ].hex,
				// WordArt shapes are defined using \defshp control word. Thanks to that
				// they can be easily filtered.
				isWordArtShape = currentImage.indexOf( '\\defshp' ) !== -1;

			if ( isAlreadyExtracted || isWordArtShape ) {
				continue;
			}

			if ( currentImage.indexOf( '\\pngblip' ) !== -1 ) {
				imageType = 'image/png';
			} else if ( currentImage.indexOf( '\\jpegblip' ) !== -1 ) {
				imageType = 'image/jpeg';
			} else {
				imageType = 'unknown';
			}

			var newImageData = {
				id: id,
				hex: imageType !== 'unknown' ? getImageContent( currentImage ) : null,
				type: imageType
			};

			if ( imageDataIndex !== -1 ) {
				ret.splice( imageDataIndex, 1, newImageData );
			} else {
				ret.push( newImageData );
			}
		}

		return ret;

		function getImageIndex( id ) {
			// In some cases LibreOffice does not include ids for images.
			// In that case, always treat them as unique (not found in the array).
			if ( typeof id !== 'string' ) {
				return -1;
			}

			return CKEDITOR.tools.array.indexOf( ret, function( image ) {
				return image.id === id;
			} );
		}

		function getImageId( image ) {
			var blipUidRegex = /\\blipuid (\w+)\}/,
				blipTagRegex = /\\bliptag(-?\d+)/,
				blipUidMatch = image.match( blipUidRegex ),
				blipTagMatch = image.match( blipTagRegex );

			if ( blipUidMatch ) {
				return blipUidMatch[ 1 ];
			} else if ( blipTagMatch ) {
				return blipTagMatch[ 1 ];
			}

			return null;
		}

		// Image content is basically \pict group content. However RTF sometimes
		// break content into several lines and we don't want any whitespace
		// in our images. So we need to get rid of it.
		function getImageContent( image ) {
			var content = filter.extractGroupContent( image );

			return content.replace( /\s/g, '' );
		}
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
		if ( img.type === 'unknown' ) {
			return null;
		}

		return img.type ? 'data:' + img.type + ';base64,' + CKEDITOR.tools.convertBytesToBase64( CKEDITOR.tools.convertHexStringToBytes( img.hex ) ) : null;
	}
} )();
