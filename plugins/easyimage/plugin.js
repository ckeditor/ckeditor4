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

				if ( widget && widget.name === 'image' ) {
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
		// Overwrite some image2 defaults.
		editor.on( 'widgetDefinition', function( evt ) {
			var oldInit = evt.data.init;

			if ( evt.data.name !== 'image' ) {
				return;
			}

			evt.data.allowedContent.figure.classes += ',!' + editor.config.easyimage_class + ',' +
				editor.config.easyimage_sideClass;

			// Block default image dialog.
			evt.data.dialog = null;

			evt.data.init = function() {
				oldInit.call( this );

				this.on( 'contextMenu', function( evt ) {
					// Remove "Image Properties" option.
					delete evt.data.image;

					evt.data.easyimageFull = editor.getCommand( 'easyimageFull' ).state;
					evt.data.easyimageSide = editor.getCommand( 'easyimageSide' ).state;
					evt.data.easyimageAlt = editor.getCommand( 'easyimageAlt' ).state;
				} );
			};
		} );
	}

	function prepareFileTools() {
		CKEDITOR.fileTools.fileLoader.prototype.uploadToCS = function( url ) {
			var loader = this,
				editor = loader.editor;

			loader.changeStatus( 'uploading' );

			new CKEDITOR.cloudServices.UploadGateway( editor.config.easyimage_token, url )
			.upload( this.file )
			.send()
			.then( function( response ) {
				loader.uploaded = 1;
				loader.responseData = response;
				loader.changeStatus( 'uploaded' );
			} )
			[ 'catch' ]( function() {
				loader.changeStatus( 'error' );
			} );
		};
	}

	function registerUploadWidget( editor ) {
		var uploadUrl = CKEDITOR.fileTools.getUploadUrl( editor.config, 'easyimage' );

		CKEDITOR.fileTools.addUploadWidget( editor, 'uploadeasyimage', {
			supportedTypes: /image\/(jpeg|png|gif|bmp)/,

			uploadUrl: uploadUrl,

			loadMethod: 'uploadToCS',

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
				this.replaceWith( '<img src="' + upload.responseData[ 'default' ] + '">' );
			}
		} );
	}

	function loadCSLib( path, callback ) {
		var script = new CKEDITOR.dom.element( 'script' );

		script.setAttribute( 'src', path + 'lib/cs.js' );
		script.on( 'load', function() {
			callback();
		} );
		script.on( 'error', function() {
			CKEDITOR.error( 'cs-lib-not-loaded' );
		} );

		CKEDITOR.document.getHead().append( script );
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
		requires: 'image2,uploadwidget,contextmenu,dialog',
		lang: 'en',

		onLoad: function() {
			CKEDITOR.dialog.add( 'easyimageAlt', this.path + 'dialogs/easyimagealt.js' );
			loadCSLib( this.path, prepareFileTools );
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
	 * A CSS class applied to all Easy Image widgets
	 *
	 *		// Changes the class to "my-image".
	 *		config.easyimage_class = 'my-image';
	 *
	 * @since 4.8.0
	 * @cfg {String} [easyimage_class='easyimage']
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
