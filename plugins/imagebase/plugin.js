/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	function getFocusedWidget( editor ) {
		return editor.widgets.focused;
	}

	function getLinkFeature() {
		function isLinkable( widget ) {
			return widget && widget.features && CKEDITOR.tools.array.indexOf( widget.features, 'link' ) !== -1;
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
					okListener = dialog.once( 'ok',	createOkListener( evt, dialog, widget ), null, null, 9 );

					dialog.once( 'hide', function() {
						okListener.removeListener();
						displayTextField.show();
					} );
				} );


				// Overwrite default behaviour of unlink command.
				addUnlinkListener( editor, 'exec', function( command, widget, editor ) {
					widget.setData( 'link' , null );
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
		var ret = {
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

						// Refetch the definition... original definition looks like an outdated copy, it doesn't things inherited form imagebase.
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
								var widgetInstance = ret._insertWidget( editor, definition, URL.createObjectURL( curFile ) );

								ret._loadWidget( editor, widgetInstance, definition, curFile );

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

			_loadWidget: function( editor, widget, def, file ) {
				var uploads = editor.uploadRepository,
					loadMethod = def.loadMethod || 'loadAndUpload',
					loader = uploads.create( file, undefined, def.loaderType );

				function failHandling( evt ) {
					if ( widget.fire( 'uploadFailed', evt ) !== false ) {
						widget.editor.widgets.del( widget );
					}
				}

				function uploadComplete( evt ) {
					widget.fire( 'uploadDone', evt );
				}

				loader.on( 'abort', failHandling );
				loader.on( 'error', failHandling );
				loader.on( 'uploaded', uploadComplete );

				loader[ loadMethod ]( def.uploadUrl, def.additionalRequestParameters );

				if ( widget.fire( 'uploadBegan', loader ) !== false && widget.progressReporterType ) {
					var progress = new widget.progressReporterType();
					widget.wrapper.append( progress.wrapper );
					progress.bindLoader( loader );
				}
			},

			/*
			 * @private
			 * @param {CKEDITOR.editor} editor
			 * @param {CKEDITOR.plugins.widget.definition} widgetDef
			 * @param {String} blobUrl Blob URL of an image.
			 * @returns {CKEDITOR.plugins.widget/undefined} The widget instance or `undefined` if not successful.
			 */
			_insertWidget: function( editor, widgetDef, blobUrl ) {
				var tplParams = ( typeof widgetDef.defaults == 'function' ? widgetDef.defaults() : widgetDef.defaults ) || {};

				tplParams.src = blobUrl;

				var element = CKEDITOR.dom.element.createFromHtml( widgetDef.template.output( tplParams ) ),
					wrapper = editor.widgets.wrapElement( element, widgetDef.name ),
					temp = new CKEDITOR.dom.documentFragment( wrapper.getDocument() );

				// Append wrapper to a temporary document. This will unify the environment
				// in which #data listeners work when creating and editing widget.
				temp.append( wrapper );
				editor.widgets.initOn( element, widgetDef );

				return editor.widgets.finalizeCreation( temp );
			}

			/*
			 * Fired when upload process failed or was aborted.
			 *
			 * `data` is set to {@link CKEDITOR.fileTools.fileLoader} event that has caused this problem, so it could be:
			 *
			 * * {@link CKEDITOR.fileTools.fileLoader#event-error}
			 * * {@link CKEDITOR.fileTools.fileLoader#event-abort}
			 *
			 *		progress.once( 'uploadFailed', function( evt ) {
			 *			console.log( 'Loader: ' + evt.data.sender + ' failed to upload data.' );
			 *		} );
			 *
			 * This event is cancelable, if not canceled it will remove the widget.
			 *
			 * @event uploadFailed
			 */
		};

		return ret;
	}

	var featuresDefinitions = {
		upload: getUploadFeature(),
		link: getLinkFeature()
	};

	function createWidgetDefinition( editor, definition ) {
		var baseDefinition;

		/**
		 * This is an abstract class that describes a definition of a basic image widget
		 * created by {@link CKEDITOR.plugins.imagebase#addImageWidget} method.
		 *
		 * Note that because the image widget is a type of a widget, this definition extends
		 * {@link CKEDITOR.plugins.widget.definition}.
		 * It adds several parts of image and implements the basic version of
		 * {@link CKEDITOR.plugins.widget.definition#upcast} callback.
		 *
		 * @abstract
		 * @since 4.8.0
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
			 * The array containing names of features added to this widget's definition.
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
		 * Image widget definition overrides {@link CKEDITOR.plugins.widget.definition#upcast} property.
		 * It's automatically set to enumerate keys of {@link #upcasts}.
		 * Avoid changes, unless you know what you're doing.
		 *
		 * @member CKEDITOR.plugins.imagebase.imageWidgetDefinition
		 * @property {String}
		 */
		definition.upcast = CKEDITOR.tools.objectKeys( definition.upcasts ).join( ',' );

		return definition;
	}

	var UPLOAD_PROGRESS_THROTTLING = 100;

	/**
	 * This is a base type for progress reporters.
	 *
	 * Progress reporters could be updated:
	 *
	 * * Automatically, by binding it to a existing {@link CKEDITOR.fileTools.fileLoader} instance.
	 * * Manually, using {@link #updated}, {@link #done}, {@link #failed} and {@link #aborted} methods.
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
		 * Marks a progress on the progress bar.
		 *
		 * @param {Number} progress Progress representation where `1.0` is a complete and `0` means no progress.
		 */
		updated: function() {},

		/**
		 * To be called when the progress should be marked as complete.
		 */
		done: function() {
			this.remove();
		},

		/**
		 * To be called when the progress should be marked as aborted.
		 */
		aborted: function() {
			this.remove();
		},

		/**
		 * To be called when the progress should be marked as failed.
		 */
		failed: function() {
			this.remove();
		},

		/**
		 * Removes the progress reporter from DOM.
		 */
		remove: function() {
			this.wrapper.remove();
		},

		/**
		 * Binds this progress reporter to a given `loader`.
		 *
		 * It will automatically remove its listeners when the `loader` has triggered one of following events:
		 *
		 * * {@link CKEDITOR.fileTools.fileLoader#event-abort}
		 * * {@link CKEDITOR.fileTools.fileLoader#event-error}
		 * * {@link CKEDITOR.fileTools.fileLoader#event-uploaded}
		 *
		 * @param {CKEDITOR.fileTools.fileLoader} loader Loader that should be observed.
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
	 * Type adding a vertical progress bar.
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
		 * @property {CKEDITOR.dom.element} bar Bar element whose width represents the progress.
		 */
		this.bar = this.wrapper.getFirst();
	}

	ProgressBar.prototype = new ProgressReporter();

	ProgressReporter.prototype.updated = function( progress ) {
		var percentage = Math.round( progress * 100 );

		percentage = Math.max( percentage, 0 );
		percentage = Math.min( percentage, 100 );

		// widget.editor.fire( 'lockSnapshot' );
		this.bar.setStyle( 'width', percentage + '%' );
		// widget.editor.fire( 'unlockSnapshot' );
	};

	CKEDITOR.plugins.add( 'imagebase', {
		requires: 'widget,filetools',
		lang: 'en'
	} );

	/**
	 * Namespace providing a set of helper functions for working with image widgets.
	 *
	 * @since 4.8.0
	 * @singleton
	 * @class CKEDITOR.plugins.imagebase
	 */
	CKEDITOR.plugins.imagebase = {
		/**
		 * Object containing all available features definitions.
		 * @property {Object}
		 */
		featuresDefinitions: featuresDefinitions,

		/**
		 * Registers a new widget based on passed definition.
		 *
		 * @param {CKEDITOR.editor} editor Editor that will get the widget registered.
		 * @param {String} name Widget name.
		 * @param {CKEDITOR.plugins.imagebase.imageWidgetDefinition} definition Widget's definition.
		 */
		addImageWidget: function( editor, name, definition ) {
			var widget = editor.widgets.add( name, createWidgetDefinition( editor, definition ) );

			editor.addFeature( widget );
		},

		/**
		 * Adds new feature to the passed widget's definition by invoking initial setup once for the editor
		 * and extending widget's definition to include all fields needed by this feature.
		 *
		 *		var widgetDefinition = {};
		 *		widgetDefinition = CKEDITOR.plugins.imagebase.addFeature( editor, 'link', widgetDefinition );
		 *		CKEDITOR.plugins.imagebase.addImageWidget( editor, 'myWidget', widgetDefinition );
		 *
		 * @param {CKEDITOR.editor} editor Editor that will get the widget registered.
		 * @param {String} name Feature name.
		 * @param {CKEDITOR.plugins.imagebase.imageWidgetDefinition} definition Widget's definition.
		 * @returns {CKEDITOR.plugins.imagebase.imageWidgetDefinition} Widget's definition extended
		 * with fields needed by feature.
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
