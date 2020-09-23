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
				if ( ( imgTags[ i ].indexOf( 'file://' ) === 0 ) && newSrcValues[ i ] ) {
					// As in Word we do image embedding before the main filter,
					// there is a chance that some of the images are also inserted via VML.
					// This regex ensures that we replace only HTML <img> tags.
					var imgRegex = new RegExp( '(<img [^>]*src=["\']?)' + imgTags[ i ] );

					html = html.replace( imgRegex, '$1' + newSrcValues[ i ] );
				}
			}
		}

		return html;
	};

	CKEDITOR.pasteFilters.image.extractFromRtf = extractFromRtf;
	CKEDITOR.pasteFilters.image.extractTagsFromHtml = extractTagsFromHtml;

	function extractFromRtf( rtfContent ) {
		var ret = [],
			rePictureHeader = /(?:(?:\\\*)?\{\\(?:non)?shppict\s*)?\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/,
			rePicture = new RegExp( '(?:(' + rePictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g' ),
			// Fallback regexp for picture header. Please note that instead \pngblip there might be also \jpegblip
			// for different image compression type.
			// 1. {\pict … \pngblip                  <- here inside "…" curly brakcets never appear
			// 2. {\*\shppict{\pict{\* … \pngblip    <- here inside "…" curly brackets might be present
			fallbackRePictureHeader = /(\{\\pict[^{}]+?|\{\\\*\\shppict\{\\pict\{\\\*[^*]+?)\\(?:jpeg|png)blip/,
			fallbackRePicture = new RegExp( '(?:(' + fallbackRePictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g' ),
			isFallback = false,
			wholeImages,
			imageType;

		rtfContent = removeHeadersAndFooters( rtfContent );
		wholeImages = rtfContent.match( rePicture );

		if ( !wholeImages ) {
			isFallback = true;
			wholeImages = rtfContent.match( fallbackRePicture );
		}

		if ( !wholeImages ) {
			return ret;
		}

		for ( var i = 0; i < wholeImages.length; i++ ) {
			var currentImage = wholeImages[ i ],
				pictureHeaderRegex = isFallback ? fallbackRePictureHeader : rePictureHeader;

			if ( pictureHeaderRegex.test( currentImage ) ) {
				var id = getImageId( currentImage ),
					imageDataIndex = CKEDITOR.tools.array.indexOf( ret, function( image ) {
						return image.id === id;
					} ),
					isAlreadyExtracted = imageDataIndex !== -1 && ret[ imageDataIndex ].hex,
					isWordArtShape = currentImage.indexOf( '\\defshp' ) !== -1,
					isNonWordImage = currentImage.indexOf( '\\nonshppict' ) !== -1;

				// This image is already extracted, it's WordArt shape or it's a non-Word version.
				if ( isAlreadyExtracted || isWordArtShape || isNonWordImage ) {
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
					hex: imageType !== 'unknown' ?
						currentImage.replace( pictureHeaderRegex, '' ).replace( /[^\da-fA-F]/g, '' ) : null,
					type: imageType
				};

				if ( imageDataIndex !== -1 ) {
					ret.splice( imageDataIndex, 1, newImageData );
				} else {
					ret.push( newImageData );
				}
			}
		}

		return ret;

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

		function removeHeadersAndFooters( rtfContent ) {
			var startRegex = /\{\\(?:header|footer)[lrf]?/,
				current;

			while ( current = rtfContent.match( startRegex ) ) {
				var precedingContent = rtfContent.substring( 0, current.index - 1 ),
					contentToParse = rtfContent.substring( current.index ),
					parsedContent = removeMatchedGroup( contentToParse );

				rtfContent = precedingContent + parsedContent;

				startRegex.lastIndex = 0;
			}

			return rtfContent;
		}

		// This function is in fact a very primitive RTF parser.
		// It iterates over RTF content and search for the last } in the group
		// by keeping track of how many elements are open using a stack-like method.
		function removeMatchedGroup( content ) {
			var i = 0,
				open = 0,
				current = content[ i ];

			do {
				// Every group start has format of {\. However there can be some whitespace after { and before /.
				// Additionally we need to filter also curly braces from the content – fortunately they are escaped.
				var isValidGroupStart = current === '{' && getPreviousNonWhitespaceChar( content, i ) !== '\\' &&
					getNextNonWhitespaceChar( content, i ) === '\\',
					isValidGroupEnd = current === '}' && getPreviousNonWhitespaceChar( content, i ) !== '\\' &&
						open > 0;

				if ( isValidGroupStart ) {
					open++;
				} else if ( isValidGroupEnd ) {
					open--;
				}

				current = content[ ++i ];
			} while ( current && open > 0 );

			return content.substring( i );
		}

		function getPreviousNonWhitespaceChar( content, index ) {
			return getNonWhitespaceChar( content, index, -1 );
		}

		function getNextNonWhitespaceChar( content, index ) {
			return getNonWhitespaceChar( content, index, 1 );
		}

		function getNonWhitespaceChar( content, startIndex, direction ) {
			var index = startIndex + direction,
				current = content[ index ],
				whiteSpaceRegex = /[\s]/;

			while ( current && whiteSpaceRegex.test( current ) ) {
				index = index + direction;
				current = content[ index ];
			}

			return current;
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
