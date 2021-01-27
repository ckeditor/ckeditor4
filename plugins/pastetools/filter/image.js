/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEDITOR */

// This filter could be one day merged to common filter. However currently pasteTools.createFilter doesn't pass additional arguments,
// so it's not possible to pass rtf clipboard to it (#3670).
( function() {
	'use strict';

	/**
	 * Filter handling pasting images. In case of missing RTF content images are extracted
	 * from [Object URLs](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#Example_Using_object_URLs_to_display_images).
	 * In other cases hey are extracted from RTF content.
	 *
	 * @private
	 * @since 4.14.0
	 * @param {String} html
	 * @param {CKEDITOR.editor} editor
	 * @param {String} rtf
	 * @member CKEDITOR.plugins.pastetools.filters
	 */
	CKEDITOR.pasteFilters.image = function( html, editor, rtf ) {
		var imgTags;

		// If the editor does not allow images, skip embedding.
		if ( editor.activeFilter && !editor.activeFilter.check( 'img[src]' ) ) {
			return html;
		}

		imgTags = extractTagsFromHtml( html );

		if ( imgTags.length === 0 ) {
			return html;
		}

		if ( rtf ) {
			return handleRtfImages( html, rtf, imgTags );
		}

		return handleBlobImages( editor, html, imgTags );
	};

	/**
	 * Parses RTF content to find embedded images.
	 *
	 * @private
	 * @since 4.16.0
	 * @param {String} rtfContent RTF content to be checked for images.
	 * @returns {CKEDITOR.plugins.pastetools.filters.image.ImageData[]} An array of images found in the `rtfContent`.
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.extractFromRtf = extractFromRtf;

	/**
	 * Extracts an array of `src`` attributes in `<img>` tags from the given HTML. `<img>` tags belonging to VML shapes are removed.
	 *
	 * ```js
	 * CKEDITOR.plugins.pastefromword.images.extractTagsFromHtml( html );
	 * // Returns: [ 'http://example-picture.com/random.png', 'http://example-picture.com/another.png' ]
	 * ```
	 *
	 * @private
	 * @since 4.16.0
	 * @param {String} html A string representing HTML code.
	 * @returns {String[]} An array of strings representing the `src` attribute of the `<img>` tags found in `html`.
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.extractTagsFromHtml = extractTagsFromHtml;

	/**
	 * Extract image type from its RTF content
	 *
	 * @private
	 * @since 4.16.0
	 * @param {String} imageContent Image content as RTF string.
	 * @returns {String} If the image type can be extracted, it is returned in `image/*` format.
	 * Otherwise, `'unknown'` is returned.
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.getImageType = getImageType;

	/**
	 * Creates image source as Base64-encoded [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
	 *
	 * @private
	 * @since 4.16.0
	 * @param {CKEDITOR.plugins.pastetools.filters.image.ImageData} img Image data.
	 * @returns {String} Data URL representing the image.
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.createSrcWithBase64 = createSrcWithBase64;

	/**
	 * Converts blob url into base64 string. Conversion is happening asynchronously.
	 * Currently supported file types: `image/png`, `image/jpeg`, `image/gif`.
	 *
	 * @private
	 * @since 4.16.0
	 * @param {String} blobUrlSrc Address of blob which is going to be converted
	 * @returns {CKEDITOR.tools.promise.<String/null>} Promise, which resolves to Data URL representing image.
	 * If image's type is unsupported, promise resolves to `null`.
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.convertBlobUrlToBase64 = convertBlobUrlToBase64;

	/**
	 * Return file type based on first 4 bytes of given file. Currently recognised file types: `image/png`, `image/jpeg`, `image/gif`.
	 *
	 * @private
	 * @since 4.16.0
	 * @param {Uint8Array} bytesArray Typed array which will be analysed to obtain file type.
	 * @returns {String/null} File type recognized from given typed array or null.
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.getImageTypeFromSignature = getImageTypeFromSignature;

	/**
	 * Array of all supported image formats.
	 *
	 * @private
	 * @since 4.16.0
	 * @type {String[]}
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.supportedImageTypes = [
		'image/png',
		'image/jpeg',
		'image/gif'
	];

	/**
	 * Recognizable image types with their respective markers.
	 *
	 * The recognizing of image type is done by searching for image marker
	 * inside the RTF image content.
	 *
	 * @private
	 * @since 4.16.0
	 * @type {CKEDITOR.plugins.pastetools.filters.image.RecognizableImageType[]}
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.recognizableImageTypes = [
		{
			marker: /\\pngblip/,
			type: 'image/png'
		},

		{
			marker: /\\jpegblip/,
			type: 'image/jpeg'
		},

		{
			marker: /\\emfblip/,
			type: 'image/emf'
		},

		{
			marker: /\\wmetafile\d/,
			type: 'image/wmf'
		}
	];

	/**
	 * Recognizable image file signatures with their respective types.
	 *
	 * The recognizing of image type is done by matching the first bytes
	 * of the signature represented as hex string.
	 *
	 * @private
	 * @since 4.16.0
	 * @type {CKEDITOR.plugins.pastetools.filters.image.RecognizableImageSignature[]}
	 * @member CKEDITOR.plugins.pastetools.filters.image
	 */
	CKEDITOR.pasteFilters.image.recognizableImageSignatures = [
		{
			signature: 'ffd8ff',
			type: 'image/jpeg'
		},

		{
			signature: '47494638',
			type: 'image/gif'
		},

		{
			signature: '89504e47',
			type: 'image/png'
		}
	];

	function handleRtfImages( html, rtf, imgTags ) {
		var hexImages = extractFromRtf( rtf ),
			newSrcValues,
			i;

		if ( hexImages.length === 0 ) {
			return html;
		}

		newSrcValues = CKEDITOR.tools.array.map( hexImages, function( img ) {
			return createSrcWithBase64( img );
		}, this );

		if ( imgTags.length !== newSrcValues.length ) {
			CKEDITOR.error( 'pastetools-failed-image-extraction', {
				rtf: hexImages.length,
				html: imgTags.length
			} );

			return html;
		}

		// Assuming there is equal amount of Images in RTF and HTML source, so we can match them accordingly to the existing order.
		for ( i = 0; i < imgTags.length; i++ ) {
			// Replace only `file` urls of images ( shapes get newSrcValue with null ).
			if ( imgTags[ i ].indexOf( 'file://' ) === 0 ) {
				if ( !newSrcValues[ i ] ) {
					CKEDITOR.error( 'pastetools-unsupported-image', {
						type: hexImages[ i ].type,
						index: i
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

		return html;
	}

	function handleBlobImages( editor, html, imgTags ) {
		var blobUrls = CKEDITOR.tools.array.unique( CKEDITOR.tools.array.filter( imgTags, function( imgTag ) {
				return imgTag.match( /^blob:/i );
			} ) ),
			promises = CKEDITOR.tools.array.map( blobUrls, convertBlobUrlToBase64 );

		CKEDITOR.tools.promise.all( promises ).then( function( dataUrls ) {
			CKEDITOR.tools.array.forEach( dataUrls, function( dataUrl, i ) {
				if ( !dataUrl ) {
					CKEDITOR.error( 'pastetools-unsupported-image', {
						type: 'blob',
						index: i
					} );
					return;
				}
				var blob = blobUrls[ i ],
					nodeList = editor.editable().find( 'img[src="' + blob + '"]' ).toArray();

				CKEDITOR.tools.array.forEach( nodeList, function( element ) {
					element.setAttribute( 'src', dataUrl );
					element.setAttribute( 'data-cke-saved-src', dataUrl );
				}, this );
			} );
		} );

		return html;
	}

	function extractFromRtf( rtfContent ) {
		var filter = CKEDITOR.plugins.pastetools.filters.common.rtf,
			ret = [],
			wholeImages;

		// Remove headers, footers, non-Word images and drawn objects.
		// Headers and footers are in \header* and \footer* groups,
		// non-Word images are inside \nonshp groups.
		// Drawn objects are inside \shprslt and could be e.g. image alignment.
		rtfContent = filter.removeGroups( rtfContent, '(?:(?:header|footer)[lrf]?|nonshppict|shprslt)' );
		wholeImages = filter.getGroups( rtfContent, 'pict' );

		if ( !wholeImages ) {
			return ret;
		}

		for ( var i = 0; i < wholeImages.length; i++ ) {
			var currentImage = wholeImages[ i ].content,
				imageId = getImageId( currentImage ),
				imageType = getImageType( currentImage ),
				imageDataIndex = getImageIndex( imageId ),
				isAlreadyExtracted = imageDataIndex !== -1 && ret[ imageDataIndex ].hex,
				// If the same image is inserted more then once, the same id is used.
				isDuplicated = isAlreadyExtracted && ret[ imageDataIndex ].type === imageType,
				// Sometimes image is duplicated with another format, especially if
				// it's right after the original one (so, in other words, original is the last image extracted).
				isAlternateFormat = isAlreadyExtracted && ret[ imageDataIndex ].type !== imageType &&
					imageDataIndex === ret.length - 1,
				// WordArt shapes are defined using \defshp control word. Thanks to that
				// they can be easily filtered.
				isWordArtShape = currentImage.indexOf( '\\defshp' ) !== -1,
				isSupportedType = CKEDITOR.tools.array.indexOf( CKEDITOR.pasteFilters.image.supportedImageTypes, imageType ) !== -1;

			if ( isDuplicated ) {
				ret.push( ret[ imageDataIndex ] );

				continue;
			}

			if ( isAlternateFormat || isWordArtShape ) {
				continue;
			}

			var newImageData = {
				id: imageId,
				hex: isSupportedType ? getImageContent( currentImage ) : null,
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

	function getImageType( imageContent ) {
		var tests = CKEDITOR.pasteFilters.image.recognizableImageTypes,
			extractedType = CKEDITOR.tools.array.find( tests, function( test ) {
				return test.marker.test( imageContent );
			} );

		if ( extractedType ) {
			return extractedType.type;
		}

		return 'unknown';
	}

	function createSrcWithBase64( img ) {
		var isSupportedType = CKEDITOR.tools.array.indexOf( CKEDITOR.pasteFilters.image.supportedImageTypes, img.type ) !== -1,
			data = img.hex;

		if ( !isSupportedType ) {
			return null;
		}

		if ( typeof data === 'string' )  {
			data = CKEDITOR.tools.convertHexStringToBytes( img.hex );
		}

		return img.type ? 'data:' + img.type + ';base64,' + CKEDITOR.tools.convertBytesToBase64( data ) : null;
	}

	function convertBlobUrlToBase64( blobUrlSrc ) {
		return new CKEDITOR.tools.promise( function( resolve ) {
			CKEDITOR.ajax.load( blobUrlSrc, function( arrayBuffer ) {
				var data = new Uint8Array( arrayBuffer ),
					imageType = getImageTypeFromSignature( data ),
					base64 = createSrcWithBase64( {
						type: imageType,
						hex: data
					} );

				resolve( base64 );
			} , 'arraybuffer' );
		} );
	}

	function getImageTypeFromSignature( bytesArray ) {
		var fileSignature = bytesArray.subarray( 0, 4 ),
			hexSignature = CKEDITOR.tools.array.map( fileSignature, function( signatureByte ) {
				return signatureByte.toString( 16 );
			} ).join( '' ),
			matchedType = CKEDITOR.tools.array.find( CKEDITOR.pasteFilters.image.recognizableImageSignatures,
				function( test ) {
					return hexSignature.indexOf( test.signature ) === 0;
				} );

		if ( !matchedType ) {
			return null;
		}

		return matchedType.type;
	}
} )();

/**
 * Virtual class that illustrates image data
 * returned by {@link CKEDITOR.plugins.pastetools.filters.image#extractFromRtf} method.
 *
 * @since 4.16.0
 * @class CKEDITOR.plugins.pastetools.filters.image.ImageData
 * @abstract
 */

/**
 * Unique id of an image extracted from RTF content.
 *
 * @property {String} id
 * @member CKEDITOR.plugins.pastetools.filters.image.ImageData
 */

/**
 * Image content extracted from RTF content as a hexadecimal string.
 *
 * @property {String} hex
 * @member CKEDITOR.plugins.pastetools.filters.image.ImageData
 */

/**
 * MIME type of an image extracted from RTF content.
 * If the type couldn't be extracted or it's unknown, `'unknown'` value is used.
 *
 * @property {String} type
 * @member CKEDITOR.plugins.pastetools.filters.image.ImageData
 */

/**
 * Virtual class that illustrates format of objects in
 * {@link CKEDITOR.plugins.pastetools.filters.image#recognizableImageTypes} property.
 *
 * @since 4.16.0
 * @class CKEDITOR.plugins.pastetools.filters.image.RecognizableImageType
 * @abstract
 */

/**
 * Regular expression that matches the marker unique for the given image type.
 *
 * @property {RegExp} marker
 * @member CKEDITOR.plugins.pastetools.filters.image.RecognizableImageType
 */

/**
 * Image MIME type.
 *
 * @property {String} type
 * @member CKEDITOR.plugins.pastetools.filters.image.RecognizableImageType
 */

/**
 * Virtual class that illustrates format of objects in
 * {@link CKEDITOR.plugins.pastetools.filters.image#recognizableImageSignatures} property.
 *
 * @since 4.16.0
 * @class CKEDITOR.plugins.pastetools.filters.image.RecognizableImageSignature
 * @abstract
 */

/**
 * File signature as a hex string.
 *
 * @property {String} signature
 * @member CKEDITOR.plugins.pastetools.filters.image.RecognizableImageSignature
 */

/**
 * Image MIME type.
 *
 * @property {String} type
 * @member CKEDITOR.plugins.pastetools.filters.image.RecognizableImageSignature
 */
