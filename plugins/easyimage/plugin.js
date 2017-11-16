/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	var stylesLoaded = false,
		// Black rectangle which is shown before image is loaded.
		loadingImage = 'data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAAAAALAAAAAAOAA4AAAIMhI+py+0Po5y02qsKADs=',
		// Throttling of progress update in ms.
		UPLOAD_PROGRESS_THROTTLING = 100;

	function addCommands( editor ) {
		function isSideImage( widget ) {
			return widget.data.type === 'side';
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
			widget.setData( 'type', 'full' );
		}, function( widget ) {
			return isFullImage( widget );
		} ) );

		editor.addCommand( 'easyimageSide', createCommand( function( widget ) {
			widget.setData( 'type', 'side' );
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

	function getInitialImageType( widget ) {
		if ( widget.element.hasClass( widget.editor.config.easyimage_sideClass ) ) {
			return 'side';
		}

		return 'full';
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
						attributes: '!src,srcset,alt'
					}
				},

				requiredContent: 'figure; img[!src]',

				upcasts: {
					figure: function( element ) {
						if ( ( !figureClass || element.hasClass( figureClass ) ) &&
							element.find( 'img', true ).length === 1 ) {
							return element;
						}
					}
				},

				init: function() {
					this.on( 'contextMenu', function( evt ) {
						evt.data.easyimageFull = editor.getCommand( 'easyimageFull' ).state;
						evt.data.easyimageSide = editor.getCommand( 'easyimageSide' ).state;
						evt.data.easyimageAlt = editor.getCommand( 'easyimageAlt' ).state;
						// if ( editor.plugins.link ) {
						// 	evt.data.link = editor.getCommand( 'link' ).state;
						// }
					} );

					if ( editor.config.easyimage_class ) {
						this.addClass( editor.config.easyimage_class );
					}
				},

				data: function( evt ) {
					var data = evt.data;

					if ( !data.type ) {
						data.type = getInitialImageType( this );
					}

					if ( data.type === 'side' ) {
						this.addClass( editor.config.easyimage_sideClass );
					} else {
						this.removeClass( editor.config.easyimage_sideClass );
					}
				}
			};

		if ( figureClass ) {
			widgetDefinition.requiredContent += '(!' + figureClass + ')';
			widgetDefinition.allowedContent.figure.classes = '!' + figureClass + ',' + widgetDefinition.allowedContent.figure.classes;
		}

		if ( editor.plugins.link ) {
			widgetDefinition = CKEDITOR.plugins.imagebase.addFeature( editor, 'link', widgetDefinition );
		}

		CKEDITOR.plugins.imagebase.addImageWidget( editor, 'easyimage', widgetDefinition );
	}

	function registerUploadWidget( editor ) {
		var uploadWidgetDefinition = {
			supportedTypes: /image\/(jpeg|png|gif|bmp)/,

			// Easy image uses only upload method, as is manually handled in onUploading function.
			loadMethod: 'upload',

			inline: false,

			loaderType: CKEDITOR.plugins.cloudservices.cloudServicesLoader,

			fileToElement: function() {
				var img = new CKEDITOR.dom.element( 'img' );
				img.setAttribute( 'src', loadingImage );
				return img;
			},

			parts: {
				img: 'img',
				loader: '.cke_loader'
			},

			onUploading: function( upload ) {
				// Show the image during the upload.
				this.parts.img.setAttribute( 'src', URL.createObjectURL( upload.file ) );
			},

			onUploaded: function( upload ) {
				var srcset = CKEDITOR.plugins.easyimage._parseSrcSet( upload.responseData.response );

				this.replaceWith( '<figure class="' + ( editor.config.easyimage_class || '' ) + '"><img src="' +
					upload.responseData.response[ 'default' ] + '" srcset="' + srcset + '" sizes="100vw"><figcaption></figcaption></figure>' );
			}
		};

		addUploadProgressBar( editor, uploadWidgetDefinition );

		CKEDITOR.fileTools.addUploadWidget( editor, 'uploadeasyimage', uploadWidgetDefinition );

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
				}
			}

			data.dataValue = temp.getHtml();
		} );
	}

	// Extends given uploadWidget `definition` with an upload progress bar, added within wrapper.
	function addUploadProgressBar( editor, definition ) {
		definition.skipNotifications = true;
		definition.parts.loader = '.cke_loader';

		/*
		 * Creates a progress bar in a given widget.
		 *
		 * Also puts it in it's {@link CKEDITOR.plugins.widget#parts} structure as `progressBar`
		 *
		 * @private
		 * @param {CKEDITOR.plugins.widget} widget
		 */
		definition._createProgressBar = function( widget ) {
			widget.parts.progressBar = CKEDITOR.dom.element.createFromHtml( '<div class="cke_loader">' +
					'<div class="cke_bar" styles="transition: width ' + UPLOAD_PROGRESS_THROTTLING / 1000 + 's"></div>' +
				'</div>' );
			widget.wrapper.append( widget.parts.progressBar, true );
		};

		editor.on( 'widgetDefinition', function( evt ) {
			var definition = evt.data,
				baseInit;

			if ( definition.name === 'uploadeasyimage' ) {
				// Extend init method, that was initially defined by the uploadwidget plugin.
				baseInit =  definition.init;

				definition.init = function() {
					var loader = this._getLoader( this ),
						progressListeners = [];

					function removeProgressListeners() {
						if ( progressListeners ) {
							CKEDITOR.tools.array.forEach( progressListeners, function( listener ) {
								listener.removeListener();
							} );

							progressListeners = null;
						}
					}

					// Add a progress bar.
					this.definition._createProgressBar( this );

					var updateListener = CKEDITOR.tools.eventsBuffer( UPLOAD_PROGRESS_THROTTLING, function() {
						var progressBar = this.parts.progressBar.findOne( '.cke_bar' ),
							percentage;

						if ( progressBar && loader.uploadTotal ) {
							percentage = ( loader.uploaded / loader.uploadTotal ) * 100;
							progressBar.setStyle( 'width', percentage + '%' );
						}
					}, this );

					progressListeners.push( loader.on( 'update', updateListener.input ) );

					progressListeners.push( loader.once( 'abort', removeProgressListeners ) );
					progressListeners.push( loader.once( 'error', removeProgressListeners ) );
					progressListeners.push( loader.once( 'uploaded', removeProgressListeners ) );

					// Call base init implementation.
					baseInit.call( this );
				};
			}
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
		},

		// Widget must be registered after init in case that link plugin is dynamically loaded e.g. via
		// `config.extraPlugins`.
		afterInit: function( editor ) {
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
}() );
