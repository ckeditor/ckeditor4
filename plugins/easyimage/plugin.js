/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	var stylesLoaded = false;

	// A helper class abstracting fetching image from dropped data.
	//
	// @param {CKEDITOR.editor} [editor] Editor, on which the drop will be performed.
	function DropHandler( editor ) {
		this.editor = editor;
	}

	DropHandler.prototype = {
		constructor: DropHandler,

		// Checks if provided file is an image
		//
		// @private
		// @param {File} file File to be inspected.
		_isImage: function( file ) {
			return CKEDITOR.fileTools.isTypeSupported( file, /^image\// );
		},

		// Gets images from dropped data if there's at least one included.
		//
		// @private
		// @param {CKEDITOR.plugins.clipboard.dataTransfer} dataTransfer Transferred data to be inspected.
		// @returns {CKEDITOR.dom.element[]} Array of fetched images.
		_getImagesFromDataTransfer: function( dataTransfer ) {
			var files = [],
				filesCount = dataTransfer.getFilesCount(),
				i;

			for ( i = 0; i < filesCount; i++ ) {
				var file = dataTransfer.getFile( i );

				if ( this._isImage( file ) ) {
					files.push( file );
				}
			}

			return files;
		},

		// Asynchronously read provided images using `FileReader`.
		// Every read is followed up by invoking callback with just read image.
		// Note that all readings are performed in parallel.
		//
		// @private
		// @param {File[]} images Table of File objects containing images
		// @param {Function} callback Callback to be invoked for every read image.
		_readImages: function( images, callback ) {
			var editor = this.editor;

			CKEDITOR.tools.array.forEach( images, function( image ) {
				var reader = new CKEDITOR.fileTools.fileLoader( editor, image );

				reader.on( 'loaded', function( evt ) {
					callback( evt.sender.data );
				} );

				reader.load();
			} );
		},

		// Inserts image as EasyImage widget at the beginning of given range.
		//
		// @private
		// @param {CKEDITOR.editor} editor
		// @param {String} image Base64 encoded image.
		// @param {CKEDITOR.dom.range} range Range to which image will be prepended.
		//
		_insertImage: function( editor, image, range ) {
			var html = '<figure class="image ' + editor.config.easyimage_class + '">' +
				'<img src="' + image + '" alt=""><figcaption></figcaption></figure>',
				node = CKEDITOR.dom.element.createFromHtml( html );

			range.insertNode( node );
			editor.widgets.initOn( node, 'image' );
		},

		// Method dedicated for handling DOM `drop` event.
		//
		// @param {CKEDITOR.dom.event} evt DOM `drop` event.
		handle: function( evt ) {
			var images = this._getImagesFromDataTransfer( evt.data.dataTransfer ),
				editor = this.editor,
				range = evt.data.dropRange,
				handler = this;

			this._readImages( images, function( image ) {
				handler._insertImage( editor, image, range );
			} );
		}
	};

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

	function loadStyles( editor, plugin ) {
		if ( !stylesLoaded ) {
			CKEDITOR.document.appendStyleSheet( plugin.path + 'styles/easyimage.css' );
			stylesLoaded = true;
		}

		if ( editor.addContentsCss ) {
			editor.addContentsCss( plugin.path + 'styles/easyimage.css' );
		}
	}

	function handleDrop( editor ) {
		var dropHandler = new DropHandler( editor );

		editor.on( 'drop', function( evt ) {
			dropHandler.handle( evt );
		} );
	}

	CKEDITOR.plugins.add( 'easyimage', {
		requires: 'image2,clipboard,filetools,contextmenu,dialog',
		lang: 'en',

		onLoad: function() {
			CKEDITOR.dialog.add( 'easyimageAlt', this.path + 'dialogs/easyimagealt.js' );
		},

		init: function( editor ) {
			loadStyles( editor, this );
			addCommands( editor );
			addMenuItems( editor );
			registerWidget( editor );
			handleDrop( editor );
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
