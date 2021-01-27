/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var stylesLoaded = false;

	function loadStyles( editor, plugin ) {
		if ( !stylesLoaded ) {
			CKEDITOR.document.appendStyleSheet( plugin.path + 'styles/imagebase.css' );
			stylesLoaded = true;
		}

		if ( editor.addContentsCss ) {
			editor.addContentsCss( plugin.path + 'styles/imagebase.css' );
		}
	}

	function getFocusedWidget( editor ) {
		var widgets = editor.widgets,
			currentActive = editor.focusManager.currentActive;

		if ( !editor.focusManager.hasFocus ) {
			return;
		}

		if ( widgets.focused ) {
			return widgets.focused;
		}

		if ( currentActive instanceof CKEDITOR.plugins.widget.nestedEditable ) {
			return widgets.getByElement( currentActive );
		}
	}

	function hasWidgetFeature( widget, feature ) {
		return widget.features && CKEDITOR.tools.array.indexOf( widget.features, feature ) !== -1;
	}

	function getWidgetsWithFeature( widgets, feature ) {
		return CKEDITOR.tools.array.reduce( CKEDITOR.tools.object.keys( widgets ), function( featuredWidgets, id ) {
			var widget = widgets[ id ];
			if ( hasWidgetFeature( widget, feature ) ) {
				featuredWidgets.push( widget );
			}
			return featuredWidgets;
		}, [] );
	}

	function getLinkFeature() {
		function isLinkable( widget ) {
			return widget && hasWidgetFeature( widget, 'link' );
		}

		function addLinkAttributes( editor, linkElement, linkData ) {
			// Set and remove all attributes associated with this state.
			var attributes = CKEDITOR.plugins.link.getLinkAttributes( editor, linkData );

			if ( !CKEDITOR.tools.isEmpty( attributes.set ) ) {
				linkElement.setAttributes( attributes.set );
			}

			if ( attributes.removed.length ) {
				linkElement.removeAttributes( attributes.removed );
			}
		}

		function createLink( editor, img, linkData ) {
			var link = img.getAscendant( 'a' ) || editor.document.createElement( 'a' );

			addLinkAttributes( editor, link, linkData );

			if ( !link.contains( img ) ) {
				link.replace( img );
				img.move( link );
			}

			return link;
		}

		function getLinkData( widget ) {
			return CKEDITOR.plugins.link.parseLinkAttributes( widget.editor, widget.parts.link );
		}

		function appendMenuItems( editor ) {
			editor.addMenuGroup( 'imagebase', 10 );

			editor.addMenuItem( 'imagebase', {
				label: editor.lang.link.menu,
				command: 'link',
				group: 'imagebase'
			} );
		}

		function createOkListener( evt, dialog, widget ) {
			return function() {
				if ( !isLinkable( widget ) ) {
					return;
				}

				evt.stop();

				var data = {};

				dialog.commitContent( data );
				widget.setData( 'link', data );
			};
		}

		function addUnlinkListener( editor, evtType, callback ) {
			editor.getCommand( 'unlink' ).on( evtType, function( evt ) {
				var widget = getFocusedWidget( editor );

				// Override unlink only when link truly belongs to the widget.
				// If wrapped inline widget in a link, let default unlink work (http://dev.ckeditor.com/ticket/11814).
				if ( !isLinkable( widget ) ) {
					return;
				}

				evt.stop();

				if ( callback && typeof callback === 'function' ) {
					callback( this, widget, editor );
				}

				evt.cancel();
			} );
		}

		return {
			allowedContent: {
				a: {
					attributes: '!href'
				}
			},
			parts: {
				link: 'a'
			},
			init: function() {
				if ( this.editor.plugins.link && this.editor.contextMenu ) {
					this.on( 'contextMenu', function( evt ) {
						if ( this.parts.link ) {
							evt.data.link = evt.data.unlink = CKEDITOR.TRISTATE_OFF;
						}
					} );
				}
			},

			setUp: function( editor ) {
				if ( !editor.plugins.link ) {
					// All of listeners registered later on make only sense when link plugin is loaded.
					return;
				}

				if ( editor.contextMenu ) {
					appendMenuItems( editor );
				}

				editor.on( 'dialogShow', function( evt ) {
					var widget = getFocusedWidget( editor ),
						dialog = evt.data,
						displayTextField,
						okListener;

					if ( !isLinkable( widget ) || dialog._.name !== 'link' ) {
						return;
					}

					displayTextField = dialog.getContentElement( 'info', 'linkDisplayText' ).getElement().getParent().getParent();

					dialog.setupContent( widget.data.link || {} );
					displayTextField.hide();

					// This listener overwrites the default action after pressing "OK" button in link dialog.
					// It gets the user input and set appropriate data in the widget.
					// `evt.stop` and higher priority are necessary to prevent adding unwanted link to
					// widget's caption.
					okListener = dialog.once( 'ok', createOkListener( evt, dialog, widget ), null, null, 9 );

					dialog.once( 'hide', function() {
						okListener.removeListener();
						displayTextField.show();
					} );
				} );


				// Overwrite default behaviour of unlink command.
				addUnlinkListener( editor, 'exec', function( command, widget, editor ) {
					widget.setData( 'link', null );
					command.refresh( editor, editor.elementPath() );
				} );

				addUnlinkListener( editor, 'refresh', function( command, widget ) {
					command.setState( widget.parts.link ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
				} );
			},

			data: function( evt ) {
				var editor = this.editor,
					link = evt.data.link,
					img = this.element.findOne( 'img' );

				// Widget is inited with link, so let's set appropriate data.
				if ( typeof link === 'undefined' && this.parts.link ) {
					this.setData( 'link', getLinkData( this ) );
				}

				if ( typeof link === 'undefined' ) {
					return;
				}

				// Unlink was invoked.
				if ( link === null ) {
					this.parts.link.remove( true );
					this.parts.link = null;

					// Reset link state (#tp3298).
					delete evt.data.link;
				} else {
					this.parts.link = createLink( editor, img, link );
				}
			}
		};
	}

	function getUploadFeature() {
		/**
		 * Widget feature dedicated to handling seamless file uploads.
		 *
		 * This type serves solely as a mixin, and should be added using
		 * the {@link CKEDITOR.plugins.imagebase#addFeature} method.
		 *
		 * This API is not yet in a final shape, thus it is marked as private. It can change at any point in the future.
		 *
		 * @private
		 * @class CKEDITOR.plugins.imagebase.featuresDefinitions.upload
		 * @abstract
		 */
		var ret = {
			/**
			 * The type used for progress reporting. It has to be a subclass of {@link CKEDITOR.plugins.imagebase.progressReporter}.
			 *
			 * It can be set to `false` so that there is no progress reporter created at all.
			 *
			 * @property {Function/Boolean} [progressReporterType=CKEDITOR.plugins.imagebase.progressBar]
			 */
			progressReporterType: ProgressBar,

			setUp: function( editor, definition ) {
				editor.on( 'paste', function( evt ) {
					var method = evt.data.method,
						dataTransfer = evt.data.dataTransfer,
						filesCount = dataTransfer && dataTransfer.getFilesCount();

					if ( editor.readOnly ) {
						return;
					}

					if ( method === 'drop' || ( method === 'paste' && filesCount ) ) {
						var matchedFiles = [],
							curFile;

						// Refetch the definition... original definition looks like an outdated copy and it doesn't
						// include members inherited from imagebase.
						definition = editor.widgets.registered[ definition.name ];

						for ( var i = 0; i < filesCount; i++ ) {
							curFile = dataTransfer.getFile( i );

							if ( CKEDITOR.fileTools.isTypeSupported( curFile, definition.supportedTypes ) ) {
								matchedFiles.push( curFile );
							}
						}

						if ( matchedFiles.length ) {
							evt.cancel();
							// At the time being we expect no other actions to happen after the widget was inserted.
							evt.stop();

							CKEDITOR.tools.array.forEach( matchedFiles, function( curFile, index ) {
								var loader = ret._spawnLoader( editor, curFile, definition, curFile.name );

								ret._insertWidget( editor, definition, URL.createObjectURL( curFile ), true, { uploadId: loader.id } );

								// Now modify the selection so that the next widget won't replace the current one.
								// This selection workaround is required to store multiple files.
								if ( index !== matchedFiles.length - 1 ) {
									// We don't want to modify selection for the last element, so that the last widget remains selected.
									var sel = editor.getSelection(),
										ranges = sel.getRanges();

									ranges[ 0 ].enlarge( CKEDITOR.ENLARGE_ELEMENT );
									ranges[ 0 ].collapse( false );
								}
							} );
						}
					}
				} );
			},

			init: function() {
				this.once( 'ready', function() {
					var uploadId = this.data.uploadId;
					if ( typeof uploadId !== 'undefined' ) {
						var loader = this.editor.uploadRepository.loaders[ uploadId ];

						if ( loader ) {
							// There is a possibility that loader will not be found, e.g. pasting into a completely different editor.
							this._beginUpload( this, loader );
						}
					}
				} );
			},

			/**
			 * Informs whether the loader is complete.
			 *
			 * @private
			 * @param {CKEDITOR.fileTools.fileLoader} loader
			 * @returns {Boolean}
			 */
			_isLoaderDone: function( loader ) {
				// This method should be removed once #1497 is done.
				var xhr = loader.xhr;

				return xhr && loader.xhr.readyState === 4;
			},

			/**
			 *
			 * @private
			 * @param {CKEDITOR.editor} editor
			 * @param {Blob/String} file See {@link CKEDITOR.fileTools.fileLoader}.
			 * @param {CKEDITOR.plugins.widget.definition} widgetDef The widget definition that the loader is spawned for.
			 * @param {String} [fileName] Preferred file name to be passed to the upload process.
			 * @returns {CKEDITOR.fileTools.fileLoader}
			 */
			_spawnLoader: function( editor, file, widgetDef, fileName ) {
				var loadMethod = widgetDef.loadMethod || 'loadAndUpload',
					loader = editor.uploadRepository.create( file, fileName, widgetDef.loaderType );

				loader[ loadMethod ]( widgetDef.uploadUrl, widgetDef.additionalRequestParameters );

				return loader;
			},

			/**
			 * Initializes the upload process for a given `widget` using `loader`.
			 *
			 * @private
			 * @param {CKEDITOR.plugins.widget} widget
			 * @param {CKEDITOR.fileTools.fileLoader} loader
			 */
			_beginUpload: function( widget, loader ) {
				function widgetCleanup() {
					// Remove upload id so that it's not being re-requested when e.g. someone copies and pastes
					// the widget in other place.
					if ( widget.isInited() ) {
						widget.setData( 'uploadId', undefined );
					}
					widget.wrapper.removeClass( 'cke_widget_wrapper_uploading' );
				}

				function failHandling() {
					widgetCleanup();

					if ( widget.fire( 'uploadFailed', {
						loader: loader
					} ) !== false ) {
						widget.editor.widgets.del( widget );
					}
				}

				function uploadComplete() {
					widgetCleanup();

					widget.fire( 'uploadDone', {
						loader: loader
					} );
				}

				var loaderEventMapping = {
						uploaded: uploadComplete,
						abort: failHandling,
						error: failHandling
					},
					listeners = [];

				listeners.push( loader.on( 'abort', loaderEventMapping.abort ) );
				listeners.push( loader.on( 'error', loaderEventMapping.error ) );
				listeners.push( loader.on( 'uploaded', loaderEventMapping.uploaded ) );

				this.on( 'destroy', function() {
					CKEDITOR.tools.array.filter( listeners, function( curListener ) {
						curListener.removeListener();
						return false;
					} );
				} );

				widget.setData( 'uploadId', loader.id );

				if ( widget.fire( 'uploadStarted', loader ) !== false && widget.progressReporterType ) {
					if ( !widget._isLoaderDone( loader ) ) {
						// Deliberately add class to wrapper, it does not make sense for widget element.
						widget.wrapper.addClass( 'cke_widget_wrapper_uploading' );
						// Progress reporter has only sense if widget is in progress.
						var progress = new widget.progressReporterType();
						widget.wrapper.append( progress.wrapper );
						progress.bindLoader( loader );
					} else {
						if ( loaderEventMapping[ loader.status ] ) {
							loaderEventMapping[ loader.status ]();
						}
					}
				}
			},

			/**
			 * @private
			 * @param {CKEDITOR.editor} editor
			 * @param {CKEDITOR.plugins.widget.definition} widgetDef
			 * @param {String} blobUrl Blob URL of an image.
			 * @param {Boolean} [finalize=true] If `false`, the widget will not be automatically finalized (added to {@link CKEDITOR.plugins.widget.repository}),
			 * but will be returned as a {@link CKEDITOR.dom.element} instance.
			 * @returns {CKEDITOR.plugins.widget/CKEDITOR.dom.element} The widget instance or {@link CKEDITOR.dom.element} of a widget wrapper if `finalize` was set to `false`.
			 */
			_insertWidget: function( editor, widgetDef, blobUrl, finalize, data ) {
				var tplParams = ( typeof widgetDef.defaults == 'function' ? widgetDef.defaults() : widgetDef.defaults ) || {};

				// Make sure to work on a new object, otherwise definition.defaults might get modified with instance-specific value.
				tplParams = CKEDITOR.tools.extend( {}, tplParams );
				tplParams.src = blobUrl;

				var element = CKEDITOR.dom.element.createFromHtml( widgetDef.template.output( tplParams ) ),
					wrapper = editor.widgets.wrapElement( element, widgetDef.name ),
					temp = new CKEDITOR.dom.documentFragment( wrapper.getDocument() );

				// Append wrapper to a temporary document. This will unify the environment
				// in which #data listeners work when creating and editing widget.
				temp.append( wrapper );

				if ( finalize !== false ) {
					editor.widgets.initOn( element, widgetDef, data );
					return editor.widgets.finalizeCreation( temp );
				} else {
					return element;
				}
			}

			/**
			 * Preferred file loader type used for requests.
			 *
			 * @property {Function} [loaderType=CKEDITOR.fileTools.fileLoader]
			 */

			/**
			 * Fired when upload was initiated and before the response is fetched.
			 *
			 *		progress.once( 'uploadStarted', function( evt ) {
			 *			evt.cancel();
			 *			// Implement a custom progress bar.
			 *		} );
			 *
			 * This event is cancelable. If canceled, the default progress bar will not be created
			 * and the widget wrapper will not be marked with the `cke_widget_wrapper_uploading` class.
			 *
			 * Note that the event will be fired even if the widget was created for a loader that
			 * is already resolved.
			 *
			 * @event uploadStarted
			 * @param {CKEDITOR.fileTools.fileLoader} data The loader that is used for this widget.
			 */

			/**
			 * Fired when the upload process succeeded. This is the event where you want apply the data
			 * from your response into a widget.
			 *
			 *		progress.once( 'uploadDone', function( evt ) {
			 *			var response = evt.data.loader.responseData.response;
			 *			this.setData( 'backendUrl', response.url );
			 *		} );
			 *
			 * @event uploadDone
			 * @param data
			 * @param {CKEDITOR.fileTools.fileLoader} data.loader The loader that caused this event.
			 */

			/**
			 * Fired when the upload process {@link CKEDITOR.fileTools.fileLoader#event-error failed} or was
			 * {@link CKEDITOR.fileTools.fileLoader#event-abort aborted}.
			 *
			 *		progress.once( 'uploadFailed', function( evt ) {
			 *			console.log( 'Loader: ' + evt.data.loader + ' failed to upload data.' );
			 *		} );
			 *
			 * This event is cancelable. If it is not canceled, it will remove the widget.
			 *
			 * @event uploadFailed
			 * @param data
			 * @param {CKEDITOR.fileTools.fileLoader} data.loader The loader that caused this event.
			 */
		};

		return ret;
	}

	function getCaptionFeature() {
		function createCaption( widget ) {
			var element = widget.element,
				caption = element.getDocument().createElement( 'figcaption' );

			element.append( caption );
			widget.initEditable( 'caption', widget.definition.editables.caption );

			return caption;
		}

		function isEmptyOrHasPlaceholder( widget ) {
			return !widget.editables.caption.getData() || !!widget.parts.caption.data( 'cke-caption-placeholder' );
		}

		function addPlaceholder( widget ) {
			widget.parts.caption.data( 'cke-caption-placeholder', widget.editor.lang.imagebase.captionPlaceholder );
		}

		function removePlaceholder( widget ) {
			widget.parts.caption.data( 'cke-caption-placeholder', false );
		}

		function setVisibility( caption, isVisible ) {
			caption.data( 'cke-caption-active', isVisible );
			caption.data( 'cke-caption-hidden', !isVisible );
		}

		/**
		 * The widget feature dedicated for displaying a caption under the widget.
		 *
		 * This type serves solely as a mixin, and should be added using
		 * the {@link CKEDITOR.plugins.imagebase#addFeature} method.
		 *
		 * This API is not yet in the final shape, thus it is marked as private. It can change at any point in the future.
		 *
		 * @private
		 * @class CKEDITOR.plugins.imagebase.featuresDefinitions.caption
		 * @abstract
		 */
		return {
			setUp: function( editor ) {
				var listeners = [];

				function listener( evt ) {
					var path = evt.name === 'blur' ? editor.elementPath() : evt.data.path,
						sender = path ? path.lastElement : null,
						widgets = getWidgetsWithFeature( editor.widgets.instances, 'caption' );

					if ( !editor.filter.check( 'figcaption' ) ) {
						return CKEDITOR.tools.array.forEach( listeners, function( listener ) {
							listener.removeListener();
						} );
					}

					CKEDITOR.tools.array.forEach( widgets, function( widget ) {
						widget._refreshCaption( sender );
					} );
				}

				listeners.push( editor.on( 'selectionChange', listener , null, null, 9 ) );
				listeners.push( editor.on( 'blur', listener ) );
			},

			init: function() {
				if ( !this.editor.filter.check( 'figcaption' ) ) {
					return;
				}

				if ( !this.parts.caption ) {
					this.parts.caption = createCaption( this );
				}

				// Refresh caption only if it's empty and doesn't have a placeholder to prevent hiding caption on paste (#1592).
				if ( !this.editables.caption.getData() && !this.parts.caption.data( 'cke-caption-placeholder' ) ) {
					this._refreshCaption();
				}
			},

			/**
			 * Method used to decide if the caption should be displayed for the focused widget and whether it
			 * should contain the placeholder text.
			 *
			 * @private
			 * @member CKEDITOR.plugins.imagebase.featuresDefinitions.caption
			 * @param {CKEDITOR.dom.element} sender The element that this function should be called on.
			 */
			_refreshCaption: function( sender ) {
				var isFocused = getFocusedWidget( this.editor ) === this,
					caption = this.parts.caption,
					editable = this.editables.caption;

				if ( isFocused ) {
					if ( !editable.getData() && !sender.equals( caption ) ) {
						addPlaceholder( this );
					} else if ( !sender || ( sender.equals( caption ) && sender.data( 'cke-caption-placeholder' ) ) ) {
						removePlaceholder( this );
					}

					setVisibility( caption, true );
				} else if ( isEmptyOrHasPlaceholder( this ) ) {
					removePlaceholder( this );
					setVisibility( caption, false );
				}
			}
		};
	}

	var featuresDefinitions = {
		caption: getCaptionFeature(),
		upload: getUploadFeature(),
		link: getLinkFeature()
	};

	function createWidgetDefinition( editor, definition ) {
		var baseDefinition;

		/**
		 * This is an abstract class that describes the definition of a basic image widget
		 * created by the {@link CKEDITOR.plugins.imagebase#addImageWidget} method.
		 *
		 * Note that because the image widget is a type of a widget, this definition extends
		 * {@link CKEDITOR.plugins.widget.definition}.
		 * It adds several parts of the image and implements the basic version of
		 * the {@link CKEDITOR.plugins.widget.definition#upcast} callback.
		 *
		 * @abstract
		 * @since 4.9.0
		 * @class CKEDITOR.plugins.imagebase.imageWidgetDefinition
		 * @mixins CKEDITOR.plugins.widget.definition
		 */
		baseDefinition = {
			pathName: editor.lang.imagebase.pathName,

			defaults: {
				imageClass: ( editor.config.easyimage_class || '' ),
				alt: '',
				src: '',
				caption: ''
			},

			template: '<figure class="{imageClass}">' +
				'<img alt="{alt}" src="{src}" />' +
				'<figcaption>{caption}</figcaption>' +
				'</figure>',

			allowedContent: {
				img: {
					attributes: '!src,alt,width,height'
				},
				figure: true,
				figcaption: true
			},

			requiredContent: 'figure; img[!src]',

			/**
			 * An array containing the names of features added to this widget's definition.
			 *
			 * @property {String[]} features
			 */
			features: [],

			editables: {
				caption: {
					selector: 'figcaption',
					pathName: editor.lang.imagebase.pathNameCaption,
					allowedContent: 'br em strong sub sup u s; a[!href,target]'
				}
			},

			parts: {
				image: 'img',
				caption: 'figcaption'
			},

			upcasts: {
				figure: function( element ) {
					if ( element.find( 'img', true ).length === 1 ) {
						return element;
					}
				}
			}
		};

		definition = CKEDITOR.tools.object.merge( baseDefinition, definition );

		/**
		 * Image widget definition overrides the {@link CKEDITOR.plugins.widget.definition#upcast} property.
		 * It is automatically set to enumerate the keys of {@link #upcasts}.
		 * Avoid changes unless you know what you're doing!
		 *
		 * @member CKEDITOR.plugins.imagebase.imageWidgetDefinition
		 * @property {String}
		 */
		definition.upcast = CKEDITOR.tools.object.keys( definition.upcasts ).join( ',' );

		return definition;
	}

	var UPLOAD_PROGRESS_THROTTLING = 100;

	/**
	 * This is the base type for progress reporters.
	 *
	 * A progress reporter can be updated:
	 *
	 * * Automatically, by binding it to an existing {@link CKEDITOR.fileTools.fileLoader} instance.
	 * * Manually, using the {@link #updated}, {@link #done}, {@link #failed} and {@link #aborted} methods.
	 *
	 * @class CKEDITOR.plugins.imagebase.progressReporter
	 * @constructor
	 * @param {String} [wrapperHtml='<div class="cke_loader"></div>']
	 */
	function ProgressReporter( wrapperHtml ) {
		/**
		 * @property {CKEDITOR.dom.element} wrapper An element created for wrapping the progress bar.
		 */
		this.wrapper = CKEDITOR.dom.element.createFromHtml( wrapperHtml || '<div class="cke_loader"></div>' );
	}

	ProgressReporter.prototype = {
		/**
		 * Method to be called in order to refresh the progress.
		 *
		 * @param {Number} progress Progress representation where `1.0` means "complete" and `0` means "no progress".
		 */
		updated: function() {},

		/**
		 * Marks the progress reporter as complete.
		 */
		done: function() {
			this.remove();
		},

		/**
		 * Marks the progress reporter as aborted.
		 */
		aborted: function() {
			this.remove();
		},

		/**
		 * Marks the progress reporter as failed.
		 */
		failed: function() {
			this.remove();
		},

		/**
		 * Removes the progress reporter from the DOM.
		 */
		remove: function() {
			this.wrapper.remove();
		},

		/**
		 * Binds this progress reporter to a given `loader`.
		 *
		 * It will automatically remove its listeners when the `loader` has triggered one of the following events:
		 *
		 * * {@link CKEDITOR.fileTools.fileLoader#event-abort}
		 * * {@link CKEDITOR.fileTools.fileLoader#event-error}
		 * * {@link CKEDITOR.fileTools.fileLoader#event-uploaded}
		 *
		 * @param {CKEDITOR.fileTools.fileLoader} loader The loader that should be observed.
		 */
		bindLoader: function( loader ) {
			var progressListeners = [];

			function removeProgressListeners() {
				if ( progressListeners ) {
					CKEDITOR.tools.array.forEach( progressListeners, function( listener ) {
						listener.removeListener();
					} );

					progressListeners = null;
				}
			}

			var updateListener = CKEDITOR.tools.eventsBuffer( UPLOAD_PROGRESS_THROTTLING, function() {
				if ( loader.uploadTotal ) {
					this.updated( loader.uploaded / loader.uploadTotal );
				}
			}, this );

			progressListeners.push( loader.on( 'update', updateListener.input, this ) );
			progressListeners.push( loader.once( 'abort', this.aborted, this ) );
			progressListeners.push( loader.once( 'uploaded', this.done, this ) );
			progressListeners.push( loader.once( 'error', this.failed, this ) );

			// Some events should cause all listeners to be removed.
			progressListeners.push( loader.once( 'abort', removeProgressListeners ) );
			progressListeners.push( loader.once( 'uploaded', removeProgressListeners ) );
			progressListeners.push( loader.once( 'error', removeProgressListeners ) );
		}
	};

	/**
	 * The type that adds a vertical progress bar.
	 *
	 *		var progress = new CKEDITOR.plugins.imagebase.progressBar();
	 *		myWrapper.append( progress.wrapper, true );
	 *		progress.bindLoader( myFileLoader );
	 *
	 * @class CKEDITOR.plugins.imagebase.progressBar
	 * @extends CKEDITOR.plugins.imagebase.progressReporter
	 * @constructor
	 */
	function ProgressBar() {
		ProgressReporter.call( this, '<div class="cke_loader">' +
			'<div class="cke_bar" styles="transition: width ' + UPLOAD_PROGRESS_THROTTLING / 1000 + 's"></div>' +
			'</div>' );

		/**
		 * @property {CKEDITOR.dom.element} bar The bar element whose width represents the progress.
		 */
		this.bar = this.wrapper.getFirst();
	}

	ProgressBar.prototype = new ProgressReporter();

	ProgressBar.prototype.updated = function( progress ) {
		var percentage = Math.round( progress * 100 );

		percentage = Math.max( percentage, 0 );
		percentage = Math.min( percentage, 100 );

		this.bar.setStyle( 'width', percentage + '%' );
	};

	CKEDITOR.plugins.add( 'imagebase', {
		requires: 'widget,filetools',
		lang: 'az,bg,cs,da,de,en,en-au,et,fa,fr,gl,hr,hu,it,ku,lt,lv,nb,nl,pl,pt,pt-br,ro,ru,sk,sq,sr,sr-latn,sv,tr,ug,uk,zh,zh-cn',

		init: function( editor ) {
			loadStyles( editor, this );
		}
	} );

	/**
	 * Namespace providing a set of helper functions for working with image widgets.
	 *
	 * @since 4.9.0
	 * @singleton
	 * @class CKEDITOR.plugins.imagebase
	 */
	CKEDITOR.plugins.imagebase = {
		/**
		 * An object that contains all available feature definitions.
		 * @property {Object}
		 */
		featuresDefinitions: featuresDefinitions,

		/**
		 * Registers a new widget based on the passed definition.
		 *
		 * @param {CKEDITOR.editor} editor The editor that will get the widget registered.
		 * @param {String} name The widget name.
		 * @param {CKEDITOR.plugins.imagebase.imageWidgetDefinition} definition The widget's definition.
		 */
		addImageWidget: function( editor, name, definition ) {
			var widget = editor.widgets.add( name, createWidgetDefinition( editor, definition ) );

			editor.addFeature( widget );
		},

		/**
		 * Adds a new feature to the passed widget's definition by invoking the initial setup once for the editor
		 * and extending the widget's definition to include all fields needed by this feature.
		 *
		 *		var widgetDefinition = {};
		 *		widgetDefinition = CKEDITOR.plugins.imagebase.addFeature( editor, 'link', widgetDefinition );
		 *		CKEDITOR.plugins.imagebase.addImageWidget( editor, 'myWidget', widgetDefinition );
		 *
		 * @param {CKEDITOR.editor} editor The editor that will get the widget registered.
		 * @param {String} name The feature name.
		 * @param {CKEDITOR.plugins.imagebase.imageWidgetDefinition} definition The widget's definition.
		 * @returns {CKEDITOR.plugins.imagebase.imageWidgetDefinition} The widget's definition extended
		 * with fields needed by the feature.
		 */
		addFeature: function( editor, name, definition ) {
			var featureDefinition = CKEDITOR.tools.clone( this.featuresDefinitions[ name ] ),
				ret;

			function mergeMethods( oldOne, newOne ) {
				if ( !oldOne && !newOne ) {
					return;
				}

				return function() {
					oldOne && oldOne.apply( this, arguments );
					newOne && newOne.apply( this, arguments );
				};
			}

			featureDefinition.init = mergeMethods( definition.init, featureDefinition.init );
			featureDefinition.data = mergeMethods( definition.data, featureDefinition.data );

			if ( featureDefinition.setUp ) {
				featureDefinition.setUp( editor, definition );

				delete featureDefinition.setUp;
			}

			ret = CKEDITOR.tools.object.merge( definition, featureDefinition );

			if ( !CKEDITOR.tools.isArray( ret.features ) ) {
				ret.features = [];
			}

			ret.features.push( name );

			return ret;
		},

		progressBar: ProgressBar,

		progressReporter: ProgressReporter
	};
}() );
