/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var stylesLoaded = false,
		WIDGET_NAME = 'easyimage';

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

				if ( widget && widget.name === WIDGET_NAME ) {
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

		editor._.easyImageToolbarContext = editor.balloonToolbars.create( {
			buttons: 'EasyimageFull,EasyimageSide,EasyimageAlt',
			widgets: [ WIDGET_NAME ]
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
				name: WIDGET_NAME,

				allowedContent: {
					figure: {
						classes: config.easyimage_sideClass,
						attributes: 'data-easy-image-upload-pending'
					},

					img: {
						attributes: '!src,srcset,alt,width,sizes'
					}
				},

				requiredContent: 'figure; img[!src]',

				supportedTypes: /image\/(jpeg|png|gif|bmp)/,

				loaderType: CKEDITOR.plugins.cloudservices.cloudServicesLoader,

				progressReporterType: CKEDITOR.plugins.imagebase.progressBar,

				upcasts: {
					figure: function( element ) {
						if ( ( !figureClass || element.hasClass( figureClass ) ) &&
							element.find( 'img', true ).length === 1 ) {
							return element;
						}
					}
				},

				init: function() {
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

					function setImageWidth( widget, height ) {
						if ( !widget.parts.image.hasAttribute( 'width' ) ) {
							widget.editor.fire( 'lockSnapshot' );

							widget.parts.image.setAttribute( 'width', height );

							widget.editor.fire( 'unlockSnapshot' );
						}
					}

					var imagePart = this.parts.image;

					if ( imagePart && !imagePart.$.complete ) {
						// If widget begins with incomplete image, make sure to refresh balloon toolbar (if present)
						// once the image size is available.
						getNaturalWidth( imagePart, function() {
							var contextView = editor._.easyImageToolbarContext.toolbar._view;

							if ( contextView.rect.visible ) {
								contextView.attach( contextView._pointedElement );
							}
						} );
					}

					this.on( 'contextMenu', function( evt ) {
						evt.data.easyimageFull = editor.getCommand( 'easyimageFull' ).state;
						evt.data.easyimageSide = editor.getCommand( 'easyimageSide' ).state;
						evt.data.easyimageAlt = editor.getCommand( 'easyimageAlt' ).state;
					} );

					if ( editor.config.easyimage_class ) {
						this.addClass( editor.config.easyimage_class );
					}

					this.on( 'uploadBegan', function() {
						var widget = this;

						getNaturalWidth( widget.parts.image, function( width ) {
							setImageWidth( widget, width );
						} );
					} );

					this.on( 'uploadDone', function( evt ) {
						var loader = evt.data.loader,
							resp = loader.responseData.response,
							srcset = CKEDITOR.plugins.easyimage._parseSrcSet( resp );

						this.parts.image.setAttributes( {
							'data-cke-saved-src': resp[ 'default' ],
							src: resp[ 'default' ],
							srcset: srcset,
							sizes: '100vw'
						} );
					} );

					this.on( 'uploadFailed', function() {
						alert( this.editor.lang.easyimage.uploadFailed ); // jshint ignore:line
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

		CKEDITOR.plugins.imagebase.addImageWidget( editor, WIDGET_NAME, widgetDefinition );
	}

	function addPasteListener( editor ) {
		// Easy Image requires a img-specific paste listener for inlined images. This case happens in:
		// * IE11 when pasting images from the clipboard.
		// * FF when pasting a single image **file** from the clipboard.
		// In both cases image gets inlined as img[src="data:"] element.

		editor.on( 'paste', function( evt ) {
			if ( editor.isReadOnly ) {
				return;
			}

			// For performance reason do not parse data if it does not contain img tag and data attribute.
			if ( !evt.data.dataValue.match( /<img[\s\S]+data:/i ) ) {
				return;
			}

			var data = evt.data,
				// Prevent XSS attacks.
				tempDoc = document.implementation.createHTMLDocument( '' ),
				temp = new CKEDITOR.dom.element( tempDoc.body ),
				easyImageDef = editor.widgets.registered.easyimage,
				widgetsFound = 0,
				widgetInstance,
				imgFormat,
				imgs,
				img,
				i;

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
				if ( isDataInSrc && isRealObject && !img.isReadOnly( 1 ) ) {
					widgetsFound++;

					if ( widgetsFound > 1 ) {
						// Change the selection to avoid overwriting last widget (as it will be focused).
						var sel = editor.getSelection(),
							ranges = sel.getRanges();

						ranges[ 0 ].enlarge( CKEDITOR.ENLARGE_ELEMENT );
						ranges[ 0 ].collapse( false );
					}

					imgFormat = imgSrc.match( /image\/([a-z]+?);/i );

					imgFormat = ( imgFormat && imgFormat[ 1 ] ) || 'jpg';

					widgetInstance = easyImageDef._insertWidget( editor, easyImageDef, imgSrc, false );

					widgetInstance.data( 'easy-image-upload-pending', true );

					widgetInstance.replace( img );
				}
			}

			data.dataValue = temp.getHtml();
		} );

		editor.widgets.on( 'instanceCreated', function( evt ) {
			var widget = evt.data;

			if ( widget.name == 'easyimage' && widget.element.data( 'easy-image-upload-pending' ) ) {
				widget.once( 'ready', function() {
					widget.element.data( 'easy-image-upload-pending', false );
					widget._loadWidget( widget.editor, widget, widget.definition, widget.parts.image.getAttribute( 'src' ) );
				} );
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
		requires: 'imagebase,balloontoolbar,button,dialog,cloudservices',
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
			addPasteListener( editor );
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
