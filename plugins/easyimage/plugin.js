/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var stylesLoaded = false;

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

		editor._.easyImageToolbarContext = editor.balloonToolbars.create( {
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
					}
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

							// @todo: it's still a bit hacky way to reposition the toolbar. Context should have a method like .reposition().
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

					this.on( 'uploadBegan', function( evt ) {
						var widget = this;

						var progress = widget.progressIndicatorType.createForElement( widget.element );
						progress.bindLoader( evt.data );

						getNaturalWidth( widget.parts.image, function( width ) {
							setImageWidth( widget, width );
						} );
					} );

					this.on( 'uploadDone', function( evt ) {
						var loader = evt.data.sender,
							resp = loader.responseData.response,
							srcset = CKEDITOR.plugins.easyimage._parseSrcSet( resp );

						this.parts.image.setAttributes( {
							src: resp[ 'default' ],
							srcset: srcset,
							sizes: '100vw',
							// @todo: currently there's a race condition, if the with has not been fetched for `img[blob:*]` it will not be set.
							width: this.parts.image.getAttribute( 'width' )
						} );
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
