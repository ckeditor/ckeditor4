/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
	var uniqueNameCounter = 0,
		pasteBookmark,
		selectionBookmark,
		pasteRange,
		// Black rectangle which is shown before the image is loaded.
		loadingImage = 'data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAAAAALAAAAAAOAA4AAAIMhI+py+0Po5y02qsKADs=';

	// Returns number as a string. If a number has 1 digit only it returns it prefixed with an extra 0.
	function padNumber( input ) {
		if ( input <= 9 ) {
			input = '0' + input;
		}

		return String( input );
	}

	// Returns a unique image file name.
	function getUniqueImageFileName( type ) {
		var date = new Date(),
			dateParts = [ date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() ];

		uniqueNameCounter += 1;

		return 'image-' + CKEDITOR.tools.array.map( dateParts, padNumber ).join( '' ) + '-' + uniqueNameCounter + '.' + type;
	}

	CKEDITOR.plugins.add( 'uploadimage', {
		requires: 'uploadwidget',

		onLoad: function() {
			CKEDITOR.addCss(
				'.cke_upload_uploading img{' +
					'opacity: 0.3' +
				'}'
			);
		},

		init: function( editor ) {
			// Do not execute this paste listener if it will not be possible to upload file.
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				return;
			}

			var fileTools = CKEDITOR.fileTools,
				uploadUrl = fileTools.getUploadUrl( editor.config, 'image' );

			if ( !uploadUrl ) {
				return;
			}

			// Handle images which are available in the dataTransfer.
			fileTools.addUploadWidget( editor, 'uploadimage', {
				supportedTypes: /image\/(jpeg|png|gif|bmp)/,

				uploadUrl: uploadUrl,

				fileToElement: function() {
					var img = new CKEDITOR.dom.element( 'img' );
					img.setAttribute( 'src', loadingImage );
					return img;
				},

				parts: {
					img: 'img'
				},

				onUploading: function( upload ) {
					// Show the image during the upload.
					this.parts.img.setAttribute( 'src', upload.data );
				},

				onUploaded: function( upload ) {
					// Width and height could be returned by server (https://dev.ckeditor.com/ticket/13519).
					var $img = this.parts.img.$,
						width = upload.responseData.width || $img.naturalWidth,
						height = upload.responseData.height || $img.naturalHeight,
						shouldFix = isSelectionFixRequired( this );

					preserveWidgetSelection( this );

					// Set width and height to prevent blinking.
					this.replaceWith( '<img src="' + upload.url + '" ' +
						'width="' + width + '" ' +
						'height="' + height + '">', null, shouldFix );

					if ( shouldFix ) {
						fixWidgetSelection( this );
					} else {
						clearUnusedBookmarks( this );
					}
				},

				onAbort: function() {
					clearUnusedBookmarks( this );
				}
			} );

			// Handle images which are not available in the dataTransfer.
			// This means that we need to read them from the <img src="data:..."> elements.
			editor.on( 'paste', function( evt ) {
				// For performance reason do not parse data if it does not contain img tag and data attribute.
				if ( !evt.data.dataValue.match( /<img[\s\S]+data:/i ) ) {
					return;
				}

				var data = evt.data,
					// Prevent XSS attacks.
					tempDoc = document.implementation.createHTMLDocument( '' ),
					temp = new CKEDITOR.dom.element( tempDoc.body ),
					imgs, img, i;

				adjustBodySelection( editor.getSelection() );
				createPasteRange( editor );

				// Without this isReadOnly will not works properly.
				temp.data( 'cke-editable', 1 );

				temp.appendHtml( data.dataValue );

				imgs = temp.find( 'img' );

				for ( i = 0; i < imgs.count(); i++ ) {
					img = imgs.getItem( i );

					// Assign src once, as it might be a big string, so there's no point in duplicating it all over the place.
					var imgSrc = img.getAttribute( 'src' ),
						// Image have to contain src=data:...
						isDataInSrc = imgSrc && imgSrc.substring( 0, 5 ) == 'data:',
						isRealObject = img.data( 'cke-realelement' ) === null;

					// We are not uploading images in non-editable blocs and fake objects (https://dev.ckeditor.com/ticket/13003).
					if ( isDataInSrc && isRealObject && !img.data( 'cke-upload-id' ) && !img.isReadOnly( 1 ) ) {
						// Note that normally we'd extract this logic into a separate function, but we should not duplicate this string, as it might
						// be large.
						var imgFormat = imgSrc.match( /image\/([a-z]+?);/i ),
							loader;

						imgFormat = ( imgFormat && imgFormat[ 1 ] ) || 'jpg';

						loader = editor.uploadRepository.create( imgSrc, getUniqueImageFileName( imgFormat ) );
						loader.upload( uploadUrl );

						fileTools.markElement( img, 'uploadimage', loader.id );

						fileTools.bindNotifications( editor, loader );
					}
				}

				data.dataValue = temp.getHtml();
			} );
		}
	} );

	function adjustBodySelection( selection ) {
		var ranges = selection.getRanges(),
			range = ranges[ 0 ];

		if ( !range ) {
			return;
		}

		if ( range.startContainer.type != CKEDITOR.NODE_TEXT && range.startContainer.getName() === 'body' ) {
			range.setStartAt( range.startContainer.getFirst(), CKEDITOR.POSITION_AFTER_START );
		}

		if ( range.endContainer.type != CKEDITOR.NODE_TEXT && range.endContainer.getName() === 'body' ) {
			range.setEndAt( range.endContainer.getLast(), CKEDITOR.POSITION_BEFORE_END );
		}

		selection.selectRanges( ranges );
	}

	function createPasteRange( editor ) {
		var range = editor.getSelection().getRanges()[ 0 ];

		if ( !range ) {
			return;
		}

		// Preserve selection on paste to resolve it after images upload.
		pasteRange = editor.createRange();
		pasteRange.setStartBefore( range.startContainer );
		pasteRange.setEndAfter( range.endContainer );
		pasteBookmark = pasteRange.createBookmark();
	}

	function isSelectionFixRequired( widget ) {
		var range = widget.editor.getSelection().getRanges()[ 0 ];

		if ( !range ) {
			return true;
		}

		var startElement = range.startContainer,
			endElement = range.endContainer;

		return ( isUploadImageWidget( startElement ) || isUploadImageWidget( endElement ) ) && widget !== widget.editor.widgets.focused;
	}

	function isUploadImageWidget( node ) {
		if ( node.type === CKEDITOR.NODE_TEXT ) {
			return false;
		}

		return node.hasClass( 'cke_upload_uploading' );
	}

	function preserveWidgetSelection() {
		if ( !pasteBookmark ) {
			return;
		}

		var forward, backward;

		pasteRange.moveToBookmark( pasteBookmark );
		removeBookmark( pasteBookmark );
		pasteBookmark = null;

		if ( forward = createUploadImageWalker( pasteRange ).lastForward() ) {
			pasteRange.setStartBefore( forward );
		}

		if ( backward = createUploadImageWalker( pasteRange ).lastBackward() )  {
			pasteRange.setEndAfter( backward );
		}

		selectionBookmark = pasteRange.createBookmark();
	}

	function fixWidgetSelection( widget ) {
		var selection = widget.editor.getSelection();

		if ( pasteRange ) {
			pasteRange.moveToBookmark( selectionBookmark );
			removeBookmark( selectionBookmark );
			selectionBookmark = null;

			selection.selectRanges( [ pasteRange ] );
			pasteRange = null;
		}
	}

	function removeBookmark( pasteBookmark ) {
		if ( !pasteBookmark ) {
			return;
		}
		pasteBookmark.startNode.remove();
		pasteBookmark.endNode.remove();
	}

	function createUploadImageWalker() {
		var walker = new CKEDITOR.dom.walker( pasteRange );

		walker.guard = function( node ) {
			return !isUploadImageWidget( node );
		};
		return walker;
	}

	function clearUnusedBookmarks( widget ) {
		var widgets = widget.editor.widgets.instances,
			keys = CKEDITOR.tools.objectKeys( widgets ),
			uploadImageWidgetsCount = 0;

		for ( var i = 0; i < keys.length; i++ ) {
			var id = keys[ i ];
			widgets[ id ].name === 'uploadimage' && uploadImageWidgetsCount++;
		}

		if ( uploadImageWidgetsCount == 0 ) {
			removeBookmark( pasteBookmark );
			removeBookmark( selectionBookmark );
		}
	}

	/**
	 * The URL where images should be uploaded.
	 *
	 * @since 4.5
	 * @cfg {String} [imageUploadUrl='' (empty string = disabled)]
	 * @member CKEDITOR.config
	 */
} )();
