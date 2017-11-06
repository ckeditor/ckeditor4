/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	var stylesLoaded = false;

	// jscs:disable maximumLineLength
	// Black rectangle which is shown before image is loaded.
	var loadingImage = 'data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAAAAALAAAAAAOAA4AAAIMhI+py+0Po5y02qsKADs=';
	// jscs:enable maximumLineLength

	function addCommands( editor ) {
		function isSideImage( widget ) {
			return widget.element.hasClass( editor.config.easyimage_sideClass );
		}

		function isFullImage( widget ) {
			return !isSideImage( widget );
		}

		function createCommandRefresh( enableCheck ) {
			return function( editor ) {
				var widget = editor.widgets.focused;

				if ( widget && widget.name === 'easyimage' ) {
					this.setState( ( enableCheck && enableCheck( widget ) ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
				} else {
					this.setState( CKEDITOR.TRISTATE_DISABLED );
				}
			};
		}

		function createCommand( exec, refreshCheck ) {
			return {
				startDisabled: true,
				contextSensitive: true,

				exec: function( editor ) {
					var widget = editor.widgets.focused;

					exec( widget );

					// We have to manually force refresh commands as refresh seems
					// to be executed prior to exec.
					editor.forceNextSelectionCheck();
				},

				refresh: createCommandRefresh( refreshCheck )
			};
		}

		editor.addCommand( 'easyimageFull', createCommand( function( widget ) {
			widget.element.removeClass( editor.config.easyimage_sideClass );
		}, function( widget ) {
			return isFullImage( widget );
		} ) );

		editor.addCommand( 'easyimageSide', createCommand( function( widget ) {
			widget.element.addClass( editor.config.easyimage_sideClass );
		}, function( widget ) {
			return isSideImage( widget );
		} ) );

		editor.addCommand( 'easyimageAlt', new CKEDITOR.dialogCommand( 'easyimageAlt', {
			startDisabled: true,
			contextSensitive: true,
			refresh: createCommandRefresh()
		} ) );
	}

	function addMenuItems( editor ) {
		editor.addMenuGroup( 'easyimage' );
		editor.addMenuItems( {
			easyimageFull: {
				label: editor.lang.easyimage.commands.fullImage,
				command: 'easyimageFull',
				group: 'easyimage',
				order: 1
			},

			easyimageSide: {
				label: editor.lang.easyimage.commands.sideImage,
				command: 'easyimageSide',
				group: 'easyimage',
				order: 2
			},

			easyimageAlt: {
				label: editor.lang.easyimage.commands.altText,
				command: 'easyimageAlt',
				group: 'easyimage',
				order: 3
			}
		} );
	}

	function registerWidget( editor ) {
		var config = editor.config,
			figureClass = config.easyimage_class,
			widgetDefinition = {
				allowedContent: {
					figure: {
						classes: config.easyimage_sideClass
					},

					img: {
						attributes: '!src,srcset,alt,width,height'
					}
				},

				requiredContent: 'figure; img[!src]',

				upcasts: {
					figure: function( element ) {
						if ( ( !figureClass || element.hasClass( figureClass ) ) &&
							element.find( 'img' ).length === 1 ) {
							return element;
						}
					},

					// Upload widget creates bare img[srcset] elements, so we should also upcast them.
					img: function( element )  {
						if ( element.attributes.srcset ) {
							var figure = new CKEDITOR.htmlParser.element( 'figure' );

							if ( figureClass ) {
								figure.attributes[ 'class' ] = figureClass;
							}

							element.wrapWith( figure );

							return figure;
						}

						return false;
					}
				},

				init: function() {
					this.on( 'contextMenu', function( evt ) {
						evt.data.easyimageFull = editor.getCommand( 'easyimageFull' ).state;
						evt.data.easyimageSide = editor.getCommand( 'easyimageSide' ).state;
						evt.data.easyimageAlt = editor.getCommand( 'easyimageAlt' ).state;
					} );
				}
			};

		if ( figureClass ) {
			widgetDefinition.requiredContent += '(!' + figureClass + ')';
			widgetDefinition.allowedContent.figure.classes = '!' + figureClass + ',' + widgetDefinition.allowedContent.figure.classes;
		}

		CKEDITOR.plugins.imagebase.addImageWidget( editor, 'easyimage', widgetDefinition );
	}

	function registerUploadWidget( editor ) {
		CKEDITOR.fileTools.addUploadWidget( editor, 'uploadeasyimage', {
			supportedTypes: /image\/(jpeg|png|gif|bmp)/,

			// Easy image uses only upload method, as is manually handled in onUploading function.
			loadMethod: 'upload',

			loaderType: CKEDITOR.plugins.cloudservices.cloudServicesLoader,

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
				this.parts.img.setAttribute( 'src', URL.createObjectURL( upload.file ) );
			},

			onUploaded: function( upload ) {
				var srcset = CKEDITOR.plugins.easyimage._parseSrcSet( upload.responseData.response );

				this.replaceWith( '<img src="' + upload.responseData.response[ 'default' ] + '" srcset="' +
					srcset + '" sizes="100vw">' );
			}
		} );

		// Handle images which are not available in the dataTransfer.
		// This means that we need to read them from the <img src="data:..."> elements.
		editor.on( 'paste', function( evt ) {
			var fileTools = CKEDITOR.fileTools;

			// For performance reason do not parse data if it does not contain img tag and data attribute.
			if ( !evt.data.dataValue.match( /<img[\s\S]+data:/i ) ) {
				return;
			}

			var data = evt.data,
				// Prevent XSS attacks.
				tempDoc = document.implementation.createHTMLDocument( '' ),
				widgetDef = editor.widgets.registered.uploadeasyimage,
				temp = new CKEDITOR.dom.element( tempDoc.body ),
				imgs, img, i;

			// Without this isReadOnly will not works properly.
			temp.data( 'cke-editable', 1 );

			temp.appendHtml( data.dataValue );

			imgs = temp.find( 'img' );

			for ( i = 0; i < imgs.count(); i++ ) {
				img = imgs.getItem( i );

				// Image have to contain src=data:...
				var isDataInSrc = img.getAttribute( 'src' ) && img.getAttribute( 'src' ).substring( 0, 5 ) == 'data:',
					isRealObject = img.data( 'cke-realelement' ) === null;

				// We are not uploading images in non-editable blocs and fake objects (http://dev.ckeditor.com/ticket/13003).
				if ( isDataInSrc && isRealObject && !img.data( 'cke-upload-id' ) && !img.isReadOnly( 1 ) ) {
					var loader = editor.uploadRepository.create( img.getAttribute( 'src' ), undefined, widgetDef.loaderType );
					loader.upload( widgetDef.uploadUrl, widgetDef.additionalRequestParameters );

					fileTools.markElement( img, 'uploadeasyimage', loader.id );

					fileTools.bindNotifications( editor, loader );
				}
			}

			data.dataValue = temp.getHtml();
		} );
	}

	function loadStyles( editor, plugin ) {
		if ( !stylesLoaded ) {
			CKEDITOR.document.appendStyleSheet( plugin.path + 'styles/easyimage.css' );
			stylesLoaded = true;
		}

		if ( editor.addContentsCss ) {
			editor.addContentsCss( plugin.path + 'styles/easyimage.css' );
		}
	}

	/**
	 * Namespace providing a set of helper functions for Easy Image plugin.
	 *
	 * @since 4.8.0
	 * @singleton
	 * @class CKEDITOR.plugins.easyimage
	 */
	CKEDITOR.plugins.easyimage = {
		/**
		 * Converts response from the server into proper `[srcset]` attribute.
		 *
		 * @since 4.8.0
		 * @private
		 * @param {Object} srcs Sources list to be parsed.
		 * @returns {String} `img[srcset]` attribute.
		 */
		_parseSrcSet: function( srcs ) {
			var srcset = [],
				src;

			for ( src in srcs ) {
				if ( src === 'default' ) {
					continue;
				}

				srcset.push( srcs[ src ] + ' ' + src + 'w' );
			}

			return srcset.join( ', ' );
		}
	};

	CKEDITOR.plugins.add( 'easyimage', {
		requires: 'imagebase,uploadwidget,contextmenu,dialog,cloudservices',
		lang: 'en',

		onLoad: function() {
			CKEDITOR.dialog.add( 'easyimageAlt', this.path + 'dialogs/easyimagealt.js' );
		},

		init: function( editor ) {
			loadStyles( editor, this );
			addCommands( editor );
			addMenuItems( editor );
			registerWidget( editor );
			registerUploadWidget( editor );
		}
	} );

	/**
	 * A CSS class applied to all Easy Image widgets. If set to `null` all `<figure>` elements are converted into widgets.
	 *
	 *		// Changes the class to "my-image".
	 *		config.easyimage_class = 'my-image';
	 *
	 *		// This will cause plugin to convert any figure into a widget.
	 *		config.easyimage_class = null;
	 *
	 * @since 4.8.0
	 * @cfg {String/null} [easyimage_class='easyimage']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.easyimage_class = 'easyimage';

	/**
	 * A CSS class representing side image.
	 *
	 *		// Changes the class to "my-side-image".
	 *		config.easyimage_sideClass = 'my-side-image';
	 *
	 * @since 4.8.0
	 * @cfg {String} [easyimage_sideClass='easyimage-side']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.easyimage_sideClass = 'easyimage-side';

	/**
	 * The URL where images inserted by Easy Image plugin  should be uploaded.
	 *
	 * @since 4.8.0
	 * @cfg {String} [easyimageUploadUrl='' (empty string = disabled)]
	 * @member CKEDITOR.config
	 */

	/**
	 * Token used for authorization while uploading images via Easy Image plugin.
	 *
	 * @since 4.8.0
	 * @cfg {String} [easyimage_token='' (empty string = disabled)]
	 * @member CKEDITOR.config
	 */
}() );
