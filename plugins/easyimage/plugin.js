/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var stylesLoaded = false,
		WIDGET_NAME = 'easyimage';

	function addCommands( editor ) {
		var defaultStyles = {
			full: {
				attributes: {
					'class': editor.config.easyimage_fullClass
				},
				label: editor.lang.easyimage.commands.fullImage
			},

			side: {
				attributes: {
					'class': editor.config.easyimage_sideClass
				},
				label: editor.lang.easyimage.commands.sideImage
			},

			alignLeft: {
				attributes: {
					'class': editor.config.easyimage_alignLeftClass
				},
				label: editor.lang.easyimage.commands.alignLeft
			},

			alignCenter: {
				attributes: {
					'class': editor.config.easyimage_alignCenterClass
				},
				label: editor.lang.easyimage.commands.alignCenter
			},

			alignRight: {
				attributes: {
					'class': editor.config.easyimage_alignRightClass
				},
				label: editor.lang.easyimage.commands.alignRight
			}
		};

		function capitalize( str ) {
			return CKEDITOR.tools.capitalize( str, true );
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

		function createButton( button ) {
			editor.ui.addButton( button.name, {
				label: button.label,
				command: button.command,
				toolbar: 'easyimage,' + ( button.order || 99 )
			} );
		}

		function extractButtonInfo( style ) {
			var info = {
				label: style.label,
				icon: style.icon,
				iconHiDpi: style.iconHiDpi
			};

			delete style.label;
			delete style.icon;
			delete style.iconHiDpi;

			return info;
		}

		function createCommand( options ) {
			if ( options.button ) {
				createButton( options.button );
			}

			return {
				startDisabled: true,
				contextSensitive: true,

				exec: function( editor ) {
					var widget = editor.widgets.focused;

					options.exec( widget );

					if ( options.forceSelectionCheck ) {
						// We have to manually force refresh commands as refresh seems to be executed prior to exec.
						// Without this command states would be outdated.
						editor.forceNextSelectionCheck();
						editor.selectionChange( true );
					}
				},

				refresh: createCommandRefresh( options.refreshCheck )
			};
		}

		function createStyleCommand( editor, name, styleDefinition ) {
			var button = extractButtonInfo( styleDefinition ),
				style;

			styleDefinition.type = 'widget';
			styleDefinition.widget = 'easyimage';
			styleDefinition.group = 'easyimage';
			style = new CKEDITOR.style( styleDefinition );

			editor.filter.allow( style );
			editor.widgets.registered.easyimage._styles[ name ] = style;

			return createCommand( {
				exec: function( widget ) {
					style.apply( widget.editor );
					widget.setData( 'style', name );
				},
				refreshCheck: function( widget ) {
					return widget.data.style === name;
				},
				forceSelectionCheck: true,
				button: {
					name: 'Easyimage' + capitalize( name ),
					label: button.label,
					command: 'easyimage' + capitalize( name ),
					order: 99
				}
			} );
		}

		function addDefaultCommands() {
			editor.addCommand( 'easyimageAlt', new CKEDITOR.dialogCommand( 'easyimageAlt', {
				startDisabled: true,
				contextSensitive: true,
				refresh: createCommandRefresh()
			} ) );
			createButton( {
				name: 'EasyimageAlt',
				label: editor.lang.easyimage.commands.altText,
				command: 'easyimageAlt',
				order: 3
			} );
		}

		function addStylesCommands( styles ) {
			var style;

			if ( !editor.widgets.registered.easyimage._styles ) {
				editor.widgets.registered.easyimage._styles = {};
			}

			for ( style in styles ) {
				editor.addCommand( 'easyimage' + capitalize( style ),
					createStyleCommand( editor, style, styles[ style ] ) );
			}
		}

		addDefaultCommands();
		addStylesCommands( CKEDITOR.tools.object.merge( defaultStyles, editor.config.easyimage_styles ) );
	}

	function addToolbar( editor ) {
		var buttons = editor.config.easyimage_toolbar;

		editor._.easyImageToolbarContext = editor.balloonToolbars.create( {
			buttons: buttons.join ? buttons.join( ',' ) : buttons,
			widgets: [ WIDGET_NAME ]
		} );
	}

	function addMenuItems( editor ) {
		var buttons = editor.config.easyimage_toolbar;

		if ( !editor.plugins.contextmenu ) {
			return;
		}

		if ( buttons.split ) {
			buttons = buttons.split( ',' );
		}

		editor.addMenuGroup( 'easyimage' );
		CKEDITOR.tools.array.forEach( buttons, function( button ) {
			button = editor.ui.items[ button ];

			editor.addMenuItem( button.name, {
				label: button.label,
				command: button.command,
				group: 'easyimage'
			} );
		} );
	}

	function updateMenuItemsStates( evt ) {
		var editor = evt.sender.editor,
			buttons = editor.config.easyimage_toolbar;

		if ( buttons.split ) {
			buttons = buttons.split( ',' );
		}

		CKEDITOR.tools.array.forEach( buttons, function( button ) {
			button = editor.ui.items[ button ];

			evt.data[ button.name ] = editor.getCommand( button.command ).state;
		} );
	}

	function getActiveStyle( widget ) {
		var styles = widget.definition._styles,
			style;

		for ( style in styles ) {
			if ( widget.checkStyleActive( styles[ style ] ) ) {
				return style;
			}
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
						classes: config.easyimage_sideClass
					},

					img: {
						attributes: '!src,srcset,alt,width,sizes'
					}
				},

				requiredContent: 'figure; img[!src]',
				styleableElements: 'figure',

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
							// Currently we're breaking encapsulation, once #1496 is fixed, we could use a proper method to
							// update the position.
							var contextView = editor._.easyImageToolbarContext.toolbar._view;

							if ( contextView.rect.visible ) {
								contextView.attach( contextView._pointedElement );
							}
						} );
					}

					// There is a special handling in paste listener, where the element (figure) would gain upload id temporarily.
					// This value should be removed afterwards.
					var loaderId = this.element.data( 'cke-upload-id' );

					if ( typeof loaderId !== 'undefined' ) {
						this.setData( 'uploadId', loaderId );
						this.element.data( 'cke-upload-id', false );
					}

					this.on( 'contextMenu', updateMenuItemsStates );

					if ( editor.config.easyimage_class ) {
						this.addClass( editor.config.easyimage_class );
					}

					this.on( 'uploadStarted', function() {
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

					if ( !data.style ) {
						data.style = getActiveStyle( this );

						return this.applyStyle( this._styles[ data.style ] );
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
		widgetDefinition = CKEDITOR.plugins.imagebase.addFeature( editor, 'caption', widgetDefinition );

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
				widgetElement,
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

				// We are not uploading images in non-editable blocks and fake objects (https://dev.ckeditor.com/ticket/13003).
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

					var loader = easyImageDef._spawnLoader( editor, imgSrc, easyImageDef );

					widgetElement = easyImageDef._insertWidget( editor, easyImageDef, imgSrc, false, {
						uploadId: loader.id
					} );

					// This id will be converted into widget data by widget#init method. Once that's done the core widget
					// upload feature will take care of keeping track of the loader.
					widgetElement.data( 'cke-upload-id', loader.id );
					widgetElement.replace( img );
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
		requires: 'imagebase,balloontoolbar,button,dialog,cloudservices',
		lang: 'en',
		icons: 'easyimagefull,easyimageside,easyimagealt,easyimagealignleft,easyimagealigncenter,easyimagealignright', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		onLoad: function() {
			CKEDITOR.dialog.add( 'easyimageAlt', this.path + 'dialogs/easyimagealt.js' );
		},

		init: function( editor ) {
			loadStyles( editor, this );
		},

		// Widget must be registered after init in case that link plugin is dynamically loaded e.g. via
		// `config.extraPlugins`.
		afterInit: function( editor ) {
			registerWidget( editor );
			addPasteListener( editor );
			addCommands( editor );
			addMenuItems( editor );
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
	 * A CSS class representing full width image.
	 *
	 *		// Changes the class to "my-full-width-image".
	 *		config.easyimage_sideClass = 'my-full-width-image';
	 *
	 * @since 4.9.0
	 * @cfg {String} [easyimage_fullClass='easyimage-full']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.easyimage_fullClass = 'easyimage-full';

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
	 * A CSS class representing image aligned to left.
	 *
	 *		// Changes the class to "my-left-image".
	 *		config.easyimage_alignLeftClass = 'my-left-image';
	 *
	 * @since 4.9.0
	 * @cfg {String} [easyimage_alignLeftClass='easyimage-alignLeft']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.easyimage_alignLeftClass = 'easyimage-alignLeft';

	/**
	 * A CSS class representing image aligned to center.
	 *
	 *		// Changes the class to "my-center-image".
	 *		config.easyimage_alignCenterClass = 'my-center-image';
	 *
	 * @since 4.9.0
	 * @cfg {String} [easyimage_alignCenterClass='easyimage-alignCenter']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.easyimage_alignCenterClass = 'easyimage-alignCenter';

	/**
	 * A CSS class representing image aligned to right.
	 *
	 *		// Changes the class to "my-right-image".
	 *		config.easyimage_alignLeftClass = 'my-right-image';
	 *
	 * @since 4.9.0
	 * @cfg {String} [easyimage_alignRightClass='easyimage-alignRight']
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.easyimage_alignRightClass = 'easyimage-alignRight';

	/**
	 * Custom styles that could be applied to Easy Image widget. All styles must be instances of
	 * {@link CKEDITOR.style}. There are three additional properties for every style:
	 *
	 * * `label` - string used as a button label in a balloon toolbar for the widget,
	 * * `icon` - path to the icon used in the balloon toolbar,
	 * * `iconHiDpi` - path to the high DPI version of the icon.
	 *
	 * Every style added by this config variable will result in adding `Easyimage<name>` button
	 * and `easyimage<name>` command, where `<name>` is name of style in pascal case, e.g. `left`
	 * style would produce `EasyimageLeft` button and `easyimageLeft` command.
	 *
	 *		config.easyimage_styles = {
	 *			left: {
	 *				attributes: {
	 *					'class': 'left'
	 *				},
	 *				label: 'Align left',
	 *				icon: '/foo/bar/icons/baz.png',
	 *				iconHidpi: '/foo/bar/icons/hidpi/baz.png'
	 *			}
	 *		};
	 *
	 * @since 4.9.0
	 * @cfg {Object.<String, Object>} easyimage_styles
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.easyimage_styles = {};

	/**
	 * List of buttons to be displayed in a balloon toolbar for Easy Image widget.
	 * If Context Menu plugin is enabled, this config variable will be used also to add
	 * items to the context menu for Easy Image widget.
	 *
	 * @since 4.9.0
	 * @cfg {String[]/String} [easyimage_toolbar=[ 'EasyimageFull', 'EasyimageSide', 'EasyimageAlt' ]]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.easyimage_toolbar = [ 'EasyimageFull', 'EasyimageSide', 'EasyimageAlt' ];
}() );
