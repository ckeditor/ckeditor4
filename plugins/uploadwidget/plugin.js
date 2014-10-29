/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

// TODO: remove it when upload widgets will use notifications.
/* global console */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadwidget', {
		requires: 'widget,clipboard,filetools',

		init: function( editor ) {
			editor.filter.allow( '*[!data-widget,!data-cke-upload-id]' );
		}
	} );

	/**
	 * This function creates upload widget and, if
	 * {@link CKEDITOR.filetools.uploadWidgetDefinition#fileToElement fileToElement property}
	 * is defined, paste event for files.
	 *
	 * Upload widget is helper to handle asynchronous upload and help to solve related problems: editing during upload,
	 * undo and redo, getting data, remove or copy uploading element, showing dialogs and similar.
	 *
	 * To create upload widget you need to define two transformation methods:
	 * {@link CKEDITOR.filetools.uploadWidgetDefinition#fileToElement fileToElement} which will be called on pasted and transform
	 * file into upload widget and {@link CKEDITOR.filetools.uploadWidgetDefinition#onuploaded onuploaded} where
	 * {@link CKEDITOR.filetools.uploadWidgetDefinition#replaceWith replaceWith} method should be called to replace upload widget with
	 * the final HTML when upload is done. If you want to show additional progress you can also define
	 * {@link CKEDITOR.filetools.uploadWidgetDefinition#onloading onloading} and
	 * {@link CKEDITOR.filetools.uploadWidgetDefinition#onuploading onuploading}.
	 *
	 * The simples uploading widget which uploads file and creates a link to it may looks like this:
	 *
	 * 		CKEDITOR.filetools.addUploadWidget( editor, 'uploadfile', {
	 *			uploadUrl: CKEDITOR.filetools.getUploadUrl( editor.config ),
	 *
	 *			fileToElement: function( file ) {
	 *				var a = new CKEDITOR.dom.element( 'a' );
	 *				a.setText( file.name );
	 *				a.setAttribute( 'href', '#' );
	 *				return a;
	 *			},
	 *
	 *			onuploaded: function( upload ) {
	 *				this.replaceWith( '<a href="' + upload.url + '" target="_blank">' + upload.fileName + '</a>' );
	 *			}
	 *		} );
	 *
	 * By default upload widget creates {@link CKEDITOR.filetools.FileLoader FileLoader} and call
	 * {@link CKEDITOR.filetools.FileLoader#loadAndUpload loadAndUpload}. If you want want to use only `load`
	 * or only `upload` you can skip `fileToElement` property. Then the default paste listen will not be created.
	 *
	 * Note that if you want to handle big file, ex. video, you may need to use `upload` instead of
	 * `loadAndUpload` because the file may to too big to load it.
	 *
	 * Note that if you do not upload file you need to define `onloaded` instead of `onuploaded`
	 *
	 * For example if you want to simple read the content of the file it may looks like this:
	 *
	 *		filetools.addUploadWidget( editor, 'filereader', {
	 *			onloaded: function( loader ) {
	 *				// ...
	 *			}
	 *		} );
	 *
	 *		editor.on( 'paste', function( evt ) {
	 *			var filesCount = evt.data.dataTransfer.getFilesCount(),
	 *				file, i;
	 *
	 *			// Prevent multiple plugins handle the same file.
	 *			if ( evt.data.dataValue ) {
	 *				return;
	 *			}
	 *
	 *			for ( i = 0; i < filesCount; i++ ) {
	 *				file = evt.data.dataTransfer.getFile( i );
	 *
	 *				// Handle only HTML and text files.
	 *				if ( filetools.isTypeSupported( file, /text\/(plain|html)/ ) ) {
	 *					var el = new CKEDITOR.dom.element( 'span' ),
	 *						loader = editor.uploadsRepository.create( file );
	 *
	 *					el.setText( '...' );
	 *
	 *					loader.load();
	 *
	 *					// Mark element to become filereader widget.
	 *					filetools.markElement( el, 'filereader', loader.id );
	 *
	 *					evt.data.dataValue += el.getOuterHtml();
	 *				}
	 *			}
	 *		} );
	 *
	 * @member CKEDITOR.filetools
	 * @param {CKEDITOR.editor} editor Editor instance.
	 * @param {String} name The name of the upload widget.
	 * @param {CKEDITOR.filetools.uploadWidgetDefinition} def Upload widget definition.
	 */
	function addUploadWidget( editor, name, def ) {
		var filetools = CKEDITOR.filetools,
			uploads = editor.uploadsRepository,
			// Plugins which support all file type has lower priority than plugins which support specific types.
			priority = def.supportedTypes ? 10 : 20;

		if ( def.fileToElement ) {
			editor.on( 'paste', function( evt ) {
				var data = evt.data,
					dataTransfer = data.dataTransfer,
					filesCount = dataTransfer.getFilesCount(),
					file, i;

				if ( data.dataValue || !filesCount ) {
					return;
				}

				for ( i = 0; i < filesCount; i++ ) {
					file = dataTransfer.getFile( i );

					if ( filetools.isTypeSupported( file, def.supportedTypes ) ) {
						var el = def.fileToElement( file ),
							loader = uploads.create( file );

						if ( el ) {
							loader.loadAndUpload( def.uploadUrl );

							markElement( el, name, loader.id );

							data.dataValue += el.getOuterHtml();
						}
					}
				}
			}, null, null, priority );
		}

		/**
		 * This is an abstract class that describes the definition of a upload widget.
		 * It is a type of {@link CKEDITOR.filetools#addUploadWidget} method's second argument.
		 *
		 * Note that, because upload widget is a type of widget, this definition extends widgets definition.
		 * It adds several new properties and functions and implements downcast and init. These two properties
		 * should not be overwritten.
		 *
		 * Also upload widget definition define properties for paste listener: `fileToElement`, `supportedTypes` and
		 * `uploadUrl`.
		 *
		 * @class CKEDITOR.filetools.uploadWidgetDefinition
		 * @abstract
		 * @mixins CKEDITOR.plugins.widget.definition
		 */
		CKEDITOR.tools.extend( def, {
			/**
			 * Upload widget definition overwrites `downcast` property. This should not be changed.
			 *
			 * @property {String/Function} downcast
			 * @member CKEDITOR.filetools.uploadWidgetDefinition
			 */
			downcast: function() {
				return new CKEDITOR.htmlParser.text( '' );
			},

			/**
			 * Upload widget definition overwrites `init`. If you want to add some code in `init`
			 * remember to call base function.
			 *
			 * @property {Function} init
			 * @member CKEDITOR.filetools.uploadWidgetDefinition
			 */
			init: function() {
				var widget = this,
					id = this.wrapper.findOne( '[data-cke-upload-id]' ).data( 'cke-upload-id' ),
					loader = uploads.get( id );

				loader.on( 'update', function( evt ) {
					if ( !widget.wrapper || !widget.wrapper.getParent() ) {
						if ( !editor.editable().find( '[data-cke-upload-id="' + id + '"]' ).count() ) {
							loader.abort();
						}
						evt.removeListener();
						return;
					}

					editor.fire( 'lockSnapshot' );

					console.log( loader.status );
					if ( typeof widget[ 'on' + loader.status ] === 'function' ) {
						if ( widget[ 'on' + loader.status ]( loader ) === false ) {
							return;
						}
					}

					if ( loader.status == 'error' || loader.status == 'abort' ) {
						console.log( loader.message );
						editor.widgets.del( widget );
					}

					editor.fire( 'unlockSnapshot' );
				} );

				loader.update();
			},

			/**
			 * Replace upload widget with the final HTML. This method should be called when upload is done,
			 * in common case in the {@link CKEDITOR.filetools.uploadWidgetDefinition#onuploaded onuploaded method}.
			 *
			 * @method {Function} replaceWith
			 * @param {String} html HTML to replace upload widget.
			 */
			replaceWith: function( html ) {
				// TODO: Use insertHtmlIntoRange (#12448) and handle multiple elements.
				var processedHtml = editor.dataProcessor.toHtml( html, { context: this.wrapper.getParent().getName() } );

				if ( processedHtml.trim() === '' ) {
					editor.widgets.del( this );
					return;
				}

				var el = CKEDITOR.dom.element.createFromHtml( processedHtml ),
					wasSelected = this.wrapper.hasClass( 'cke_widget_selected' ),
					range;

				el.replace( this.wrapper );

				editor.widgets.checkWidgets( { initOnlyNew: true } );

				// Ensure that old widgets instance will be removed.
				// If replaceWith is called in init, because of paste then checkWidgets will not remove it.
				editor.widgets.destroy( this, true );

				if ( wasSelected ) {
					range = editor.createRange();
					range.setStartAt( el, CKEDITOR.POSITION_BEFORE_END );
					range.select();
				}
			}
			/**
			 * If this property is defined paste listener is created to transform pasted file into HTML element.
			 * Function creates HTML element which will be transformed into the upload widget.
			 * Function gets pasted file of supported type. If multiple files have been pasted this function
			 * will be called for each file of supported type.
			 *
			 * @property {Function} fileToElement
			 * @param {Blob} file Pasted file to load.
			 * @returns {CKEDITOR.dom.element} Element which will be transformed into the upload widget.
			 */

			/**
			 * Regular expression to check if the file type is supported by this widget.
			 * If not defined all of files will be handled.
			 *
			 * @property {String} supportedTypes
			 */

			/**
			 * URL where the file should be uploaded. It should be taken from configuration using
			 * {@link CKEDITOR.filetools#getUploadUrl}.
			 *
			 * @property {String} uploadUrl
			 */

			/**
			 * Function called when the {@link CKEDITOR.filetools.FileLoader#status status of the upload} changes to `loading`.
			 *
			 * @property {Function} onloading
			 * @param {CKEDITOR.filetools.FileLoader} loader Loaders instance.
			 * @returns {Boolean} If `false` default behavior will be canceled.
			 */

			/**
			 * Function called when the {@link CKEDITOR.filetools.FileLoader#status status of the upload} changes to `loaded`.
			 *
			 * @property {Function} onloaded
			 * @param {CKEDITOR.filetools.FileLoader} loader Loaders instance.
			 * @returns {Boolean} If `false` default behavior will be canceled.
			 */

			/**
			 * Function called when the {@link CKEDITOR.filetools.FileLoader#status status of the upload} changes to `uploading`.
			 *
			 * @property {Function} onuploading
			 * @param {CKEDITOR.filetools.FileLoader} loader Loaders instance.
			 * @returns {Boolean} If `false` default behavior will be canceled.
			 */

			/**
			 * Function called when the {@link CKEDITOR.filetools.FileLoader#status status of the upload} changes to `uploaded`.
			 * At that point upload is done and the uploading widget should we replace with the final HTML using
			 * {@link CKEDITOR.filetools.uploadWidgetDefinition#replaceWith}.
			 *
			 * @property {Function} onuploaded
			 * @param {CKEDITOR.filetools.FileLoader} loader Loaders instance.
			 * @returns {Boolean} If `false` default behavior will be canceled.
			 */

			/**
			 * Function called when the {@link CKEDITOR.filetools.FileLoader#status status of the upload} changes to `error`.
			 * The default behavior is to remove widget. In can be canceled if the function returns false.
			 *
			 * @property {Function} onerror
			 * @param {CKEDITOR.filetools.FileLoader} loader Loaders instance.
			 * @returns {Boolean} If `false` default behavior will be canceled.
			 */

			/**
			 * Function called when the {@link CKEDITOR.filetools.FileLoader#status status of the upload} changes to `abort`.
			 * The default behavior is to remove widget. In can be canceled if the function returns false.
			 *
			 * @property {Function} onabort
			 * @param {CKEDITOR.filetools.FileLoader} loader Loaders instance.
			 * @returns {Boolean} If `false` default behavior will be canceled.
			 */
		} );

		editor.widgets.add( name, def );
	}

	/**
	 * Mark element which should be transformed into upload widget.
	 *
	 * @member CKEDITOR.filetools
	 * @param {CKEDITOR.dom.element} element Element to be marked.
	 * @param {String} widgetName Name of the upload widget.
	 * @param {Number} loaderId {@link CKEDITOR.filetools.FileLoader} id.
	 */
	function markElement( element, widgetName, loaderId  ) {
		element.setAttributes( {
			'data-cke-upload-id': loaderId,
			'data-widget': widgetName
		} );
	}

	if ( !CKEDITOR.filetools ) {
		CKEDITOR.filetools = {};
	}

	CKEDITOR.tools.extend( CKEDITOR.filetools, {
		addUploadWidget: addUploadWidget,
		markElement: markElement
	} );
} )();