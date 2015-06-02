/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'filetools', {
		lang: 'en', // %REMOVE_LINE_CORE%

		beforeInit: function( editor ) {
			/**
			 * An instance of {@link CKEDITOR.fileTools.uploadsRepository upload repository}.
			 * It allows you to create and get {@link CKEDITOR.fileTools.fileLoader file loaders}.
			 *
			 *		var loader = editor.uploadsRepository.create( file );
			 *		loader.loadAndUpload( 'http://foo/bar' );
			 *
			 * @since 4.5
			 * @readonly
			 * @property {CKEDITOR.fileTools.uploadsRepository} uploadsRepository
			 * @member CKEDITOR.editor
			 */
			editor.uploadsRepository = new UploadsRepository( editor );

			/**
			 * This event if fired when {@link CKEDITOR.fileTools.fileLoader FileLoader} should send XHR. If event will not be
			 * {@link CKEDITOR.eventInfo#stop stopped} or {@link CKEDITOR.eventInfo#cancel canceled}, then the default request
			 * will be sent (file as a form data with a field `'upload'`).
			 *
			 * If you want to change that behavior you can add custom listener with the default priority and
			 * {@link CKEDITOR.eventInfo#stop stop} the event, what will prevent the default behavior. For example to send
			 * data directly (without a form):
			 *
			 *		editor.on( 'fileUploadRequest', function( evt ) {
			 *			var xhr = evt.data.fileLoader.xhr;
			 *
			 *			xhr.setRequestHeader( 'Cache-Control', 'no-cache' );
			 *			xhr.setRequestHeader( 'X-File-Name', this.fileName );
			 *			xhr.setRequestHeader( 'X-File-Size', this.total );
			 *			xhr.send( this.file );
			 *
			 *			// Prevented default behavior.
			 *			evt.stop();
			 *		} );
			 *
			 *
			 * You can also add custom request headers or set flags for the default request. This is especially useful for
			 * enabling Cross-Origin requests. For more information about Cross-Origin Resource Sharing see
			 * [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS):
			 *
			 *		editor.on( 'fileUploadRequest', function( evt ) {
			 *			var xhr = evt.data.fileLoader.xhr;
			 *
			 *			xhr.setRequestHeader( 'Cache-Control', 'no-cache' );
			 *			xhr.setRequestHeader( 'X-CUSTOM', 'HEADER' );
			 *			xhr.withCredentials = true;
			 *		} );
			 *
			 * When you listen on `fileUploadRequest` event with the default priority you will get XHR object which is opened as
			 * `POST` asynchronous request. This happens in a listener with the priority `5`, so if you want to overwrite also
			 * request open you need to listen with the lower priority. For example to send a `PUT` request:
			 *
			 *		editor.on( 'fileUploadRequest', function( evt ) {
			 *			var fileLoader = evt.data.fileLoader,
			 *				formData = new FormData(),
			 *				xhr = fileLoader.xhr;
			 *
			 *			xhr.open( 'PUT', fileLoader.uploadUrl, true );
			 *			formData.append( 'upload', fileLoader.file, fileLoader.fileName );
			 *			fileLoader.xhr.send( formData );
			 *
			 *			// Prevented default behavior.
			 *			evt.stop();
			 *		}, null, null, 4 ); // Listener with priority 4 will be executed before priority 5.
			 *
			 * Finally, you can also tell the {@link CKEDITOR.fileTools.fileLoader file loader} that request was not send, so it will not
			 * change its {@link CKEDITOR.fileTools.fileLoader#status status}. To do it you need to
			 * {@link CKEDITOR.eventInfo#cancel canceled} event:
			 *
			 *		editor.on( 'fileUploadRequest', function( evt ) {
			 *			// ...
			 *
			 *			// Cancel event so file loader will not change its status.
			 *			evt.cancel();
			 *		} );
			 *
			 * @since 4.5
			 * @event fileUploadRequest
			 * @member CKEDITOR.editor
			 * @param data
			 * @param {CKEDITOR.fileTools.fileLoader} data.fileLoader File loader instance.
			 */
			editor.on( 'fileUploadRequest', function( evt ) {
				var fileLoader = evt.data.fileLoader;

				fileLoader.xhr.open( 'POST', fileLoader.uploadUrl, true );
			}, null, null, 5 );

			editor.on( 'fileUploadRequest', function( evt ) {
				var fileLoader = evt.data.fileLoader,
					formData = new FormData();

				formData.append( 'upload', fileLoader.file, fileLoader.fileName );
				fileLoader.xhr.send( formData );
			}, null, null, 999 );

			/**
			 * This event is fired when {CKEDITOR.fileTools.fileLoader file upload} response is received and needs to be parsed.
			 * If event will not be {@link CKEDITOR.eventInfo#stop stopped} or {@link CKEDITOR.eventInfo#cancel canceled}, then
			 * the default response handler will be used, which expects the response to be JSON data with the following structure:
			 *
			 *		{
			 *			fileName: <String>		// The name of the file on the server.
			 *			url: <String>			// The URL to the file.
			 *			uploaded: <Boolean>		// True if uploading finished with success.
			 *			error: {
			 *				message: <String>	// Optional message.
			 *			}
			 *		}
			 *
			 * If you want to handle a response manually you need to add a listener to this event and call {@link CKEDITOR.eventInfo#stop stop}
			 * to prevent the default behavior. Listener should set URL to the file on the server and the file name and can set additionally
			 * message from the server. If the response is to the error message, so the upload failed, then the event should be
			 * {@link CKEDITOR.eventInfo#cancel canceled}, so file loader will change {@link CKEDITOR.fileTools.fileLoader#status its status}
			 * to `error`.
			 *
			 * For example if the response is 'fileUrl|optionalErrorMessage':
			 *
			 *		editor.on( 'fileUploadResponse', function( evt ) {
			 *			// Prevent the default response handler.
			 *			evt.stop();
			 *
			 * 			// Ger XHR and response.
			 * 			var data = evt.data,
			 * 				xhr = data.fileLoader.xhr,
			 * 				response = xhr.responseText.split( '|' );
			 *
			 * 			if ( response[ 1 ] ) {
			 * 				// Error occurred during upload.
			 * 				data.message = response[ 1 ];
			 * 				evt.cancel();
			 * 			} else {
			 * 				data.url = response[ 0 ];
			 * 			}
			 * 		} );
			 *
			 * @since 4.5
			 * @event fileUploadResponse
			 * @member CKEDITOR.editor
			 * @param data
			 * @param {CKEDITOR.fileTools.fileLoader} data.fileLoader file loader instance.
			 * @param {String} data.message Message form server, needs to be set in the listener, see example.
			 * @param {String} data.fileName File name on server, needs to be set in the listener, see example.
			 * @param {String} data.url URL to the uploaded file, needs to be set in the listener, see example.
			 */
			editor.on( 'fileUploadResponse', function( evt ) {
				var fileLoader = evt.data.fileLoader,
					xhr = fileLoader.xhr,
					data = evt.data;

				try {
					var response = JSON.parse( xhr.responseText );

					// Error message does not need to mean that upload finished unsuccessfully.
					// It could mean that ex. file name was changes during upload due to naming collision.
					if ( response.error && response.error.message ) {
						data.message = response.error.message;
					}

					// But !uploaded means error.
					if ( !response.uploaded ) {
						evt.cancel();
					} else {
						data.fileName = response.fileName;
						data.url = response.url;
					}
				} catch ( err ) {
					// Response parsing error.
					data.message = fileLoader.lang.filetools.responseError;
					window.console && window.console.log( xhr.responseText );

					evt.cancel();
				}
			}, null, null, 999 );
		}
	} );

	/**
	 * File loaders repository. It allows you to create and get {@link CKEDITOR.fileTools.fileLoader file loaders}.
	 *
	 * An instance of the repository is available as a {@link CKEDITOR.editor#uploadsRepository}.
	 *
	 *		var loader = editor.uploadsRepository.create( file );
	 *		loader.loadAndUpload( 'http://foo/bar' );
	 *
	 * To find more information about handling files see the {@link CKEDITOR.fileTools.fileLoader} class.
	 *
	 * @since 4.5
	 * @class CKEDITOR.fileTools.uploadsRepository
	 * @mixins CKEDITOR.event
	 * @constructor Creates an instance of the repository.
	 * @param {CKEDITOR.editor} editor Editor instance. Used only to get the language data.
	 */
	function UploadsRepository( editor ) {
		this.editor = editor;

		this.loaders = [];
	}

	UploadsRepository.prototype = {
		/**
		 * Creates a {@link CKEDITOR.fileTools.fileLoader file loader} instance with a unique id.
		 * The instance can be later retrieved from the repository using the {@link #loaders} array.
		 *
		 * Fires {@link CKEDITOR.fileTools.uploadsRepository#instanceCreated instanceCreated} event.
		 *
		 * @param {Blob/String} fileOrData See {@link CKEDITOR.fileTools.fileLoader}.
		 * @param {String} fileName See {@link CKEDITOR.fileTools.fileLoader}.
		 * @returns {CKEDITOR.fileTools.fileLoader} The created file loader instance.
		 */
		create: function( fileOrData, fileName ) {
			var id = this.loaders.length,
				loader = new FileLoader( this.editor, fileOrData, fileName );

			loader.id = id;
			this.loaders[ id ] = loader;

			this.fire( 'instanceCreated', loader );

			return loader;
		},

		/**
		 * Returns `true` if all loaders finished their job.
		 *
		 * @returns {Boolean} `true` if all loaders finished their job, `false` otherwise.
		 */
		isFinished: function() {
			for ( var id = 0; id < this.loaders.length; ++id ) {
				if ( !this.loaders[ id ].isFinished() ) {
					return false;
				}
			}

			return true;
		}

		/**
		 * Array of loaders created by the {@link #create} method. Loaders' {@link CKEDITOR.fileTools.fileLoader#id ids}
		 * are indexes.
		 *
		 * @readonly
		 * @property {CKEDITOR.fileTools.fileLoader[]} loaders
		 */

		/**
		 * Event fired when {@link CKEDITOR.fileTools.fileLoader FileLoader} is created.
		 *
		 * @event instanceCreated
		 * @param {CKEDITOR.fileTools.fileLoader} data Created FileLoader.
		 */
	};

	/**
	 * The `FileLoader` class is a wrapper which handles two file operations: loading the contents of the file stored on
	 * the user's device into the memory and uploading the file to a server.
	 *
	 * There are two possible ways to crate a `FileLoader` instance: with a [Blob](https://developer.mozilla.org/en/docs/Web/API/Blob)
	 * (e.g. got from the {@link CKEDITOR.plugins.clipboard.dataTransfer#getFile} method) or with a data as a Base64 string.
	 * Note that if the constructor gets the data as a Base64 string there is no need to load data, they are already loaded.
	 *
	 * `FileLoader` is created for a single load and upload process so if you abort the process
	 * you need to create a new `FileLoader`.
	 *
	 * All process parameters are stored in the public properties.
	 *
	 * `FileLoader` implements events so you can listen on them to react on changes. There are two types of events:
	 * events to notify listeners about changes and event to let listener synchronize with current {@link #status}.
	 *
	 * The first group of events contains {@link #event-loading}, {@link #event-loaded}, {@link #event-uploading},
	 * {@link #event-uploaded}, {@link #event-error} and {@link #event-abort}. These events are called only once,
	 * when {@link #status} change.
	 *
	 * The second type is {@link #event-update} event. It is fired ever time {@link #status} change, progress change or
	 * {@link #method-update} method is called. Is is created to synchronize visual representation of the loader with
	 * its status. For example if the dialog contains uploading progress it should be refresh on
	 * {@link #event-update} listener. Then when user close and reopen this dialog {@link #method-update} method should
	 * be called so the progress will be refreshed.
	 *
	 * Default requests and responses formats will work with CKFinder 2.4.3 and above. If you need a custom request
	 * or response handling you need to overwrite default behavior using the {@link CKEDITOR.editor#fileUploadRequest} and
	 * {@link CKEDITOR.editor#fileUploadResponse} events. For more information see their documentation.
	 *
	 * To create a `FileLoader` instance use the {@link CKEDITOR.fileTools.uploadsRepository} class.
	 *
	 * Here is a simple usage of `FileLoader`:
	 *
	 *		editor.on( 'paste', function( evt ) {
	 *			for ( var i = 0; i < evt.data.dataTransfer.getFilesCount(); i++ ) {
	 *				var file = evt.data.dataTransfer.getFile( i );
	 *
	 *				if ( CKEDITOR.fileTools.isTypeSupported( file, /image\/png/ ) ) {
	 *					var loader = editor.uploadsRepository.create( file );
	 *
	 *					loader.on( 'update', function() {
	 *						document.getElementById( 'uploadProgress' ).innerHTML = loader.status;
	 *					} );
	 *
	 *					loader.on( 'error', function() {
	 *						alert( 'Error!' );
	 *					} );
	 *
	 *					loader.loadAndUpload( 'http://upload.url/' );
	 *
	 *					evt.data.dataValue += 'loading...'
	 *				}
	 *			}
	 *		} );
	 *
	 * Note that `FileLoader` uses the native file API which is supported **since Internet Explorer 10**.
	 *
	 * @since 4.5
	 * @class CKEDITOR.fileTools.fileLoader
	 * @mixins CKEDITOR.event
	 * @constructor Creates an instance of the class and sets initial values of all properties.
	 * @param {CKEDITOR.editor} editor Editor instance. Used only to get language data.
	 * @param {Blob/String} fileOrData A [blob object](https://developer.mozilla.org/en/docs/Web/API/Blob) or a data
	 * string encoded with Base64.
	 * @param {String} [fileName] File name. If not set and the second parameter is a file then its name will be uses.
	 * If not set and the second parameter is a Base64 data strng, then the file name will be created based on
	 * the MIME type by replacing '/' with '.', for example for `image/png` the file name will be `image.png`.
	 */
	function FileLoader( editor, fileOrData, fileName ) {
		this.editor = editor;
		this.lang = editor.lang;

		if ( typeof fileOrData === 'string' ) {
			// Data are already loaded from disc.
			this.data = fileOrData;
			this.file = dataToFile( this.data );
			this.total = this.file.size;
			this.loaded = this.total;
		} else {
			this.data = null;
			this.file = fileOrData;
			this.total = this.file.size;
			this.loaded = 0;
		}

		if ( fileName ) {
			this.fileName = fileName;
		} else if ( this.file.name ) {
			this.fileName = this.file.name;
		} else {
			// If file has no name create a name based on the mime type.
			this.fileName = this.file.type.replace( '/', '.' );
		}

		this.uploaded = 0;

		this.status = 'created';

		this.abort = function() {
			this.changeStatus( 'abort' );
		};
	}

	/**
	 * The loader status. Possible values:
	 *
	 * * `created` &ndash; loader have been created, but no load nor upload starts,
	 * * `loading` &ndash; loading file from the user's storage,
	 * * `loaded` &ndash; file have been loaded, process is done,
	 * * `uploading` &ndash; uploading file to the server,
	 * * `uploaded` &ndash; file have been uploaded, process is done,
	 * * `error` &ndash; process stops because of an error, more details in message property,
	 * * `abort` &ndash; process stops by users action.
	 *
	 * @property {String} status
	 */

	/**
	 * String data encoded with Base64. If `FileLoader` is created with Base64 string then `data` is that string.
	 * If a file was passed to the constructor, then data is `null` until loading is completed.
	 *
	 * @readonly
	 * @property {String} data
	 */

	/**
	 * File object which represents handled file. This property is set for both constructor options (file or data).
	 *
	 * @readonly
	 * @property {Blob} file
	 */

	/**
	 * The name of the file. If there is no file name it is create from the MIME type.
	 * For example for the MIME type `image/png`, the file name will be `image.png`.
	 *
	 * @readonly
	 * @property {String} fileName
	 */

	/**
	 * Number of loaded bytes. If `FileLoader` was created with data string,
	 * then the loaded value equals the {@link #total} value.
	 *
	 * @readonly
	 * @property {Number} loaded
	 */

	/**
	 * Number of uploaded bytes.
	 *
	 * @readonly
	 * @property {Number} uploaded
	 */

	/**
	 * Total file size in bytes.
	 *
	 * @readonly
	 * @property {Number} total
	 */

	/**
	 * Error message or additional information received from the server.
	 *
	 * @readonly
	 * @property {String} message
	 */

	/**
	 * URL to the file when it is uploaded, received from the server.
	 *
	 * @readonly
	 * @property {String} url
	 */

	/**
	 * The target of the upload.
	 *
	 * @readonly
	 * @property {String} uploadUrl
	 */

	/**
	 *
	 * Native `FileReader` reference used to load file.
	 *
	 * @readonly
	 * @property {FileReader} reader
	 */

	/**
	 * Native `XMLHttpRequest` reference used to upload file.
	 *
	 * @readonly
	 * @property {XMLHttpRequest} xhr
	 */

	/**
	 * If `FileLoader` was created using {@link CKEDITOR.fileTools.uploadsRepository}
	 * it gets an identifier which is stored in this property.
	 *
	 * @readonly
	 * @property {Number} id
	 */

	/**
	 * Aborts the process.
	 *
	 * This method has a different behavior depending on the current {@link #status}.
	 *
	 * * If the {@link #status} is `loading` or `uploading` current operation will be aborted.
	 * * If the {@link #status} is `created`, `loading` or `uploading` {@link #status} will be changed to `abort`
	 * and `abort` event will be called.
	 * * If the {@link #status} is `loaded`, `uploaded`, `error` or `abort` this method will do nothing.
	 *
	 * @method abort
	 */

	FileLoader.prototype = {
		/**
		 * Loads file from the storage on user's computer to the data attribute and upload it to the server.
		 *
		 * The order {@link #status statuses} for the success load and upload is:
		 *
		 * * `created`,
		 * * `loading`,
		 * * `uploading`,
		 * * `uploaded`.
		 *
		 * @param {String} url Upload URL.
		 */
		loadAndUpload: function( url ) {
			var loader = this;

			this.once( 'loaded', function( evt ) {
				// Cancel both 'loaded' and 'update' events,
				// because 'loaded' is terminated state.
				evt.cancel();

				loader.once( 'update', function( evt ) {
					evt.cancel();
				}, null, null, 0 );

				// Start uploading.
				loader.upload( url );
			}, null, null, 0 );

			this.load();
		},

		/**
		 * Loads file from the storage on user's computer to the data attribute.
		 *
		 * The order of the {@link #status statuses} for the success load is:
		 *
		 * * `created`,
		 * * `loading`,
		 * * `loaded`.
		 */
		load: function() {
			var loader = this;

			this.reader = new FileReader();

			var reader = this.reader;

			loader.changeStatus( 'loading' );

			this.abort = function() {
				loader.reader.abort();
			};

			reader.onabort = function() {
				loader.changeStatus( 'abort' );
			};

			reader.onerror = function() {
				loader.message = loader.lang.filetools.loadError;
				loader.changeStatus( 'error' );
			};

			reader.onprogress = function( evt ) {
				loader.loaded = evt.loaded;
				loader.update();
			};

			reader.onload = function() {
				loader.loaded = loader.total;
				loader.data = reader.result;
				loader.changeStatus( 'loaded' );
			};

			reader.readAsDataURL( this.file );
		},

		/**
		 * Uploads file to the server.
		 *
		 * The order of the {@link #status statuses} for the success upload is:
		 *
		 * * `created`,
		 * * `uploading`,
		 * * `uploaded`.
		 *
		 * @param {String} url Upload URL.
		 */
		upload: function( url ) {
			if ( !url ) {
				this.message = this.lang.filetools.noUrlError;
				this.changeStatus( 'error' );
			} else {
				this.uploadUrl = url;

				this.xhr = new XMLHttpRequest();
				this.attachRequestListeners();

				if ( this.editor.fire( 'fileUploadRequest', { fileLoader: this } ) ) {
					this.changeStatus( 'uploading' );
				}
			}
		},

		/**
		 * Attach listeners to the XML HTTP request object.
		 *
		 * @private
		 * @param {XMLHttpRequest} xhr XML HTTP request object.
		 */
		attachRequestListeners: function() {
			var loader = this,
				xhr = this.xhr;

			loader.abort = function() {
				xhr.abort();
			};

			xhr.onabort = function() {
				loader.changeStatus( 'abort' );
			};

			xhr.onerror = function() {
				loader.message = loader.lang.filetools.networkError;
				loader.changeStatus( 'error' );
			};

			xhr.onprogress = function( evt ) {
				loader.uploaded = evt.loaded;
				loader.update();
			};

			xhr.onload = function() {
				loader.uploaded = loader.total;

				if ( xhr.status < 200 || xhr.status > 299 ) {
					loader.message = loader.lang.filetools[ 'httpError' + xhr.status ];
					if ( !loader.message ) {
						loader.message = loader.lang.filetools.httpError.replace( '%1', xhr.status );
					}
					loader.changeStatus( 'error' );
				} else {
					var data = {
							fileLoader: loader
						},
						// Values to copy from event to FileLoader.
						valuesToCopy = [ 'message', 'fileName', 'url' ],
						success = loader.editor.fire( 'fileUploadResponse', data );

					for ( var i = 0; i < valuesToCopy.length; i++ ) {
						var key = valuesToCopy[ i ];
						if ( typeof data[ key ] === 'string' ) {
							loader[ key ] = data[ key ];
						}
					}

					if ( success === false ) {
						loader.changeStatus( 'error' );
					} else {
						loader.changeStatus( 'uploaded' );
					}
				}
			};
		},

		/**
		 * Changes {@link #status} to the new status, update {@link #method-abort} method if needed and fire two events:
		 * new status and {@link #event-update}.
		 *
		 * @private
		 * @param {String} newStatus New status to be set.
		 */
		changeStatus: function( newStatus ) {
			this.status = newStatus;

			if ( newStatus == 'error' || newStatus == 'abort' ||
				newStatus == 'loaded' || newStatus == 'uploaded' ) {
				this.abort = function() {};
			}

			this.fire( newStatus );
			this.update();
		},

		/**
		 * Update state of the `FileLoader` listeners. This method should be called if state of the visual representation
		 * of the upload process is out of synchronization and needs to be refresh (e.g. because of undo operation or
		 * dialog with upload is closed and reopen). Fires the {@link #event-update} event.
		 */
		update: function() {
			this.fire( 'update' );
		},

		/**
		 * Returns `true` if the loading and uploading finished (successfully or not), so the {@link #status} is
		 * `loaded`, `uploaded`, `error` or `abort`.
		 *
		 * @returns {Boolean} `true` if the loading and uploading finished.
		 */
		isFinished: function() {
			return !!this.status.match( /^(?:loaded|uploaded|error|abort)$/ );
		}

		/**
		 * Event fired when {@link #status} change to `loading`. Is will be fired once for the `FileLoader`.
		 *
		 * @event loading
		 */

		/**
		 * Event fired when {@link #status} change to `loaded`. Is will be fired once for the `FileLoader`.
		 *
		 * @event loaded
		 */

		/**
		 * Event fired when {@link #status} change to `uploading`. Is will be fired once for the `FileLoader`.
		 *
		 * @event uploading
		 */

		/**
		 * Event fired when {@link #status} change to `uploaded`. Is will be fired once for the `FileLoader`.
		 *
		 * @event uploaded
		 */

		/**
		 * Event fired when {@link #status} change to `error`. Is will be fired once for the `FileLoader`.
		 *
		 * @event error
		 */

		/**
		 * Event fired when {@link #status} change to `abort`. Is will be fired once for the `FileLoader`.
		 *
		 * @event abort
		 */

		/**
		 * Event fired every time `FileLoader` {@link #status} or progress changed or `update()` method is called.
		 * This event was designed to allow showing visualization of the progress and refresh that visualization
		 * every time state changes. Note that multiple `update` events may be fired with the same status.
		 *
		 * @event update
		 */
	};

	CKEDITOR.event.implementOn( UploadsRepository.prototype );
	CKEDITOR.event.implementOn( FileLoader.prototype );

	var base64HeaderRegExp = /^data:(\S*?);base64,/;

	// Transforms Base64 string data into file and creates name for that file based on the mime type.
	//
	// @private
	// @param {String} data Base64 string data.
	// @returns {Blob} File.
	function dataToFile( data ) {
		var contentType = data.match( base64HeaderRegExp )[ 1 ],
			base64Data = data.replace( base64HeaderRegExp, '' ),
			byteCharacters = atob( base64Data ),
			byteArrays = [],
			sliceSize = 512,
			offset, slice, byteNumbers, i, byteArray;

		for ( offset = 0; offset < byteCharacters.length; offset += sliceSize ) {
			slice = byteCharacters.slice( offset, offset + sliceSize );

			byteNumbers = new Array( slice.length );
			for ( i = 0; i < slice.length; i++ ) {
				byteNumbers[ i ] = slice.charCodeAt( i );
			}

			byteArray = new Uint8Array( byteNumbers );

			byteArrays.push( byteArray );
		}

		return new Blob( byteArrays, { type: contentType } );
	}

	//
	// PUBLIC API -------------------------------------------------------------
	//

	// Two plugins extends this object.
	if ( !CKEDITOR.fileTools ) {
		/**
		 * Helpers to load and upload file.
		 *
		 * @since 4.5
		 * @singleton
		 * @class CKEDITOR.fileTools
		 */
		CKEDITOR.fileTools = {};
	}

	CKEDITOR.tools.extend( CKEDITOR.fileTools, {
		uploadsRepository: UploadsRepository,
		fileLoader: FileLoader,

		/**
		 * Gets upload URL from the {@link CKEDITOR.config configuration}. Because of backwards compatibility
		 * the URL can be set using multiple configuration options.
		 *
		 * If `type` is defined, then four configuration options will be check in the order
		 * (examples for `type='image'`):
		 *
		 * * `[type]UploadUrl`, e.g. `imageUploadUrl`,
		 * * {@link CKEDITOR.config#uploadUrl},
		 * * `filebrowser[uppercased type]uploadUrl`, e.g. `filebrowserImageUploadUrl`,
		 * * {@link CKEDITOR.config#filebrowserUploadUrl}.
		 *
		 * If `type` is not defined two configuration options will be checked:
		 *
		 * * {@link CKEDITOR.config#uploadUrl},
		 * * {@link CKEDITOR.config#filebrowserUploadUrl}.
		 *
		 * `filebrowser[type]uploadUrl` and `filebrowserUploadUrl` are checked for backward compatibility with the `filebrowser` plugin.
		 *
		 * For both `filebrowser[type]uploadUrl` and `filebrowserUploadUrl` is added `&responseType=json` to the end of the URL.
		 *
		 * @param {Object} config Configuration file.
		 * @param {String} [type] Upload file type.
		 * @returns {String} Upload URL.
		 */
		getUploadUrl: function( config, type ) {
			var capitalize = CKEDITOR.tools.capitalize;

			if ( type && config[ type + 'UploadUrl' ] ) {
				return config[ type + 'UploadUrl' ];
			} else if ( config.uploadUrl ) {
				return config.uploadUrl;
			} else if ( type && config[ 'filebrowser' + capitalize( type, 1 ) + 'UploadUrl' ] ) {
				return config[ 'filebrowser' + capitalize( type, 1 ) + 'UploadUrl' ] + '&responseType=json';
			} else if ( config.filebrowserUploadUrl ) {
				return config.filebrowserUploadUrl + '&responseType=json';
			}

			throw 'Upload URL is not defined.';
		},

		/**
		 * Checked if the MIME type of given file is supported.
		 *
		 * 		CKEDITOR.fileTools.isTypeSupported( { type: 'image/png' }, /image\/(png|jpeg)/ ); // true
		 * 		CKEDITOR.fileTools.isTypeSupported( { type: 'image/png' }, /image\/(gif|jpeg)/ ); // false
		 *
		 * @param {Blob} file File to check.
		 * @param {RegExp} supportedTypes Regular expression to check MIME type of the file.
		 * @returns {Boolean} `true` if the file type is supported.
		 */
		isTypeSupported: function( file, supportedTypes ) {
			return !!file.type.match( supportedTypes );
		}
	} );
} )();

/**
 * URL where files should be uploaded.
 *
 * Empty string means that the option is disabled.
 *
 * @since 4.5
 * @cfg {String} [uploadUrl='']
 * @member CKEDITOR.config
 */
