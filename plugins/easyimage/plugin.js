/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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

		function createCommand( exec, refreshCheck, forceSelectionCheck ) {
			return {
				startDisabled: true,
				contextSensitive: true,

				exec: function( editor ) {
					var widget = editor.widgets.focused;

					exec( widget );

					if ( forceSelectionCheck ) {
						// We have to manually force refresh commands as refresh seems to be executed prior to exec.
						// Without this command states would be outdated.
						editor.forceNextSelectionCheck();
						editor.selectionChange( true );
					}
				},

				refresh: createCommandRefresh( refreshCheck )
			};
		}

		editor.addCommand( 'easyimageFull', createCommand( function( widget ) {
			widget.setData( 'type', 'full' );
		}, function( widget ) {
			return isFullImage( widget );
		}, true ) );

		editor.addCommand( 'easyimageSide', createCommand( function( widget ) {
			widget.setData( 'type', 'side' );
		}, function( widget ) {
			return isSideImage( widget );
		}, true ) );

		editor.addCommand( 'easyimageAlt', new CKEDITOR.dialogCommand( 'easyimageAlt', {
			startDisabled: true,
			contextSensitive: true,
			refresh: createCommandRefresh()
		} ) );
	}

	function addToolbar( editor ) {
		editor.ui.addButton( 'EasyimageFull', {
			label: editor.lang.easyimage.commands.fullImage,
			command: 'easyimageFull',
			toolbar: 'easyimage,1'
		} );

		editor.ui.addButton( 'EasyimageSide', {
			label: editor.lang.easyimage.commands.sideImage,
			command: 'easyimageSide',
			toolbar: 'easyimage,2'
		} );

		editor.ui.addButton( 'EasyimageAlt', {
			label: editor.lang.easyimage.commands.altText,
			command: 'easyimageAlt',
			toolbar: 'easyimage,3'
		} );

		editor.balloonToolbars.create( {
			buttons: 'EasyimageFull,EasyimageSide,EasyimageAlt',
			widgets: [ 'easyimage' ]
		} );
	}

	function addMenuItems( editor ) {
		if ( !editor.plugins.contextmenu ) {
			return;
		}

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
						attributes: '!src,srcset,alt,width,sizes'
					},
				},

				requiredContent: 'figure; img[!src]',

				supportedTypes: /image\/(jpeg|png|gif|bmp)/,

				loaderType: CKEDITOR.plugins.cloudservices.cloudServicesLoader,

				progressIndicatorType: CKEDITOR.plugins.imagebase.progressBar,

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
					} );

					if ( editor.config.easyimage_class ) {
						this.addClass( editor.config.easyimage_class );
					}

					this.on( 'uploadBegan', function( evt ) {
						var progress = this.progressIndicatorType.createForElement( this.element );
						progress.bindToLoader( evt.data );
					} );
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

		widgetDefinition = CKEDITOR.plugins.imagebase.addFeature( editor, 'upload', widgetDefinition );

		CKEDITOR.plugins.imagebase.addImageWidget( editor, 'easyimage', widgetDefinition );
	}

	function registerUploadWidget( editor ) {
		// Natural width of the image can be fetched only after image is loaded.
		// However cached images won't fire `load` event, but just mark themselves
		// as complete.
		function getNaturalWidth( image, callback ) {
			var $image = image.$;

			if ( $image.complete && $image.naturalWidth ) {
				return callback( $image.naturalWidth );
			}

			image.once( 'load', function() {
				callback( $image.naturalWidth );
			} );
		}

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
				var srcset = CKEDITOR.plugins.easyimage._parseSrcSet( upload.responseData.response ),
					widget = this;

				getNaturalWidth( widget.parts.img, function( width ) {
					editor.fire( 'lockSnapshot' );

					widget.replaceWith( '<figure class="' + ( editor.config.easyimage_class || '' ) + '">' +
							'<img src="' + upload.responseData.response[ 'default' ] + '" srcset="' + srcset +
								'" sizes="100vw" width="' + width + '">' +
							'<figcaption></figcaption>' +
						'</figure>' );

					editor.fire( 'unlockSnapshot' );
				} );
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

	function mixinProgressBarToWidgetDef( definition ) {
		definition.parts.loader = '.cke_loader';

		/*
		* Creates a progress bar in a given widget.
		*
		* Also puts it in it's {@link CKEDITOR.plugins.widget#parts} structure as `progressBar`
		*
		* @private
		* @param {CKEDITOR.plugins.widget} widget
		*/
		definition._createProgressBar = function( widget, progressBarWrapper ) {
			progressBarWrapper = progressBarWrapper || widget.element;

			widget.parts.progressBar = CKEDITOR.dom.element.createFromHtml( '<div class="cke_loader">' +
					'<div class="cke_bar" styles="transition: width ' + UPLOAD_PROGRESS_THROTTLING / 1000 + 's"></div>' +
				'</div>' );

			progressBarWrapper.append( widget.parts.progressBar, true );
		};
	}

	/*
	 * Attaches a progress bar to a given loader.
	 *
	 * @param {CKEDITOR.fileTools.fileLoader} loader
	 * @param {CKEDITOR.plugins.widget} widget
	 */
	function attachProgressBarToLoader( loader, widget ) {
		var progressListeners = [];

		// Add a progress bar.
		widget.definition._createProgressBar( widget );

		function removeProgressListeners() {
			if ( progressListeners ) {
				CKEDITOR.tools.array.forEach( progressListeners, function( listener ) {
					listener.removeListener();
				} );

				progressListeners = null;
			}
		}

		var updateListener = CKEDITOR.tools.eventsBuffer( UPLOAD_PROGRESS_THROTTLING, function() {
			if ( !widget.parts.progressBar ) {
				return;
			}

			var progressBar = widget.parts.progressBar.findOne( '.cke_bar' ),
				percentage;

			if ( progressBar && loader.uploadTotal ) {
				percentage = ( loader.uploaded / loader.uploadTotal ) * 100;

				widget.editor.fire( 'lockSnapshot' );
				progressBar.setStyle( 'width', percentage + '%' );
				widget.editor.fire( 'unlockSnapshot' );
			}
		}, widget );

		progressListeners.push( loader.on( 'update', updateListener.input ) );

		progressListeners.push( loader.once( 'abort', removeProgressListeners ) );
		progressListeners.push( loader.once( 'error', removeProgressListeners ) );
		progressListeners.push( loader.once( 'uploaded', removeProgressListeners ) );
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
					var loader = this._getLoader( this );

					attachProgressBarToLoader( this, loader );

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
		requires: 'imagebase,uploadwidget,balloontoolbar,button,dialog,cloudservices',
		lang: 'en',
		icons: 'easyimagefull,easyimageside,easyimagealt', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

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
			addToolbar( editor );
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
