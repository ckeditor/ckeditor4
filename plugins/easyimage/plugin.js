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
					}
				},

				requiredContent: 'figure; img[!src]',

				upcasts: {
					figure: function( element ) {
						if ( ( !figureClass || element.hasClass( figureClass ) ) &&
							element.find( 'img' ).length === 1 ) {
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
				}
			};

		if ( figureClass ) {
			widgetDefinition.requiredContent += '(!' + figureClass + ')';
			widgetDefinition.allowedContent.figure.classes = '!' + figureClass + ',' + widgetDefinition.allowedContent.figure.classes;
		}

		CKEDITOR.plugins.imagebase.addImageWidget( editor, 'easyimage', widgetDefinition );
	}

	function registerUploadWidget( editor ) {
		var uploadUrl = CKEDITOR.fileTools.getUploadUrl( editor.config, 'easyimage' );

		CKEDITOR.fileTools.addUploadWidget( editor, 'uploadeasyimage', {
			supportedTypes: /image\/(jpeg|png|gif|bmp)/,

			uploadUrl: uploadUrl,

			loadMethod: 'loadAndUpload',

			additionalRequestParameters: {
				isEasyImage: true
			},

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
				this.replaceWith( '<img src="' + upload.responseData.response[ 'default' ] + '">' );
			}
		} );

		editor.on( 'fileUploadRequest', function( evt ) {
			var requestData = evt.data.requestData;

			if ( !requestData.isEasyImage ) {
				return;
			}

			evt.data.requestData.file = evt.data.requestData.upload;
			delete evt.data.requestData.upload;

			// This property is used by fileUploadResponse callback to identify EI requests.
			evt.data.fileLoader.isEasyImage = true;

			evt.data.fileLoader.xhr.setRequestHeader( 'Authorization', editor.config.easyimage_token );
		} );

		editor.on( 'fileUploadResponse', function( evt ) {
			var fileLoader = evt.data.fileLoader,
				xhr = fileLoader.xhr,
				response;

			if ( !fileLoader.isEasyImage ) {
				return;
			}

			evt.stop();

			try {
				response = JSON.parse( xhr.responseText );

				evt.data.response = response;
			} catch ( e ) {
				CKEDITOR.warn( 'filetools-response-error', { responseText: xhr.responseText } );
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

	CKEDITOR.plugins.add( 'easyimage', {
		requires: 'imagebase,uploadwidget,contextmenu,dialog',
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
}() );
