/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'pastefromwordimage', {
		requires: 'pastefromword,filetools',
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
				i,
				editor = evt.editor,
				that = this;

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

			editor.on( 'pasteFromWordImage', function( evt ) {
				evt.data.loader.on( 'loaded', function() {
					// Currently we directly assign data to src. If there will be some server, then we need to provide proper url to replace.
					that.replaceSrc( this.editor, evt.data.oldSrc, this.url || this.data );
				} );
				evt.data.loader.load();
			} );

			// Assumption there is equal amout of Images in RTF and HTML source, so we can match them accoriding to existing order.
			if ( imgTags.length === newSrcValues.length ) {
				for ( i = 0; i < imgTags.length; i++ ) {
					// Replace only `file` urls of images ( shapes get newSrcValue with null ).
					if ( ( imgTags[ i ].indexOf( 'file://' ) === 0 ) && newSrcValues[ i ] ) {
						( function( oldSrc, newSrc ) {
							var loader = editor.uploadRepository.create( newSrc );
							editor.fire( 'pasteFromWordImage', {
								loader: loader,
								oldSrc: oldSrc
							} );
						} )( imgTags[ i ], newSrcValues[ i ] );
					}
				}
			}

		},

		createSrcWithBase64: function( img ) {
			return img.type ? 'data:' + img.type + ';base64,' + this.hexToBase64( img.hex ) : null;
		},

		hexToBase64: function( hexString ) {
			return CKEDITOR.tools.convertBytesToBase64( CKEDITOR.tools.convertHexStringToBytes( hexString ) );
		},

		replaceSrc: function( editor, url, newSrc ) {
			var list = editor.editable().find( 'img[src="' + url.replace( /\\/g, '\\\\' ) + '"]' ),
				i;
			// Because this same URL should point to exact the same picture, we replace all of them.
			if ( list.count() > 0 ) {
				for ( i = 0; i < list.count(); i++ ) {
					list.getItem( i ).setAttribute( 'src', newSrc );
					list.getItem( i ).data( 'cke-saved-src', newSrc );
				}
			}
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


/**
 * Fired when the pasted content from word contained images.
 *
 * This event is cancellable. If canceled, it will prevent Paste images from Word.
 *
 * @since 4.8.0
 * @event pasteFromWordImage
 * @param data
 * @param {CKEDITOR.fileTools.fileLoader} data.loader Loader which embed images in editor.
 * @param {string} data.oldSrc Img url which is going to be replaced with File Loader.
 * @member CKEDITOR.editor
 */
