/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'filetools', {
		lang: 'en', // %REMOVE_LINE_CORE%

		beforeInit: function( editor ) {
			/**
			 * An instance of {@link CKEDITOR.filetools.UploadsRepository upload repository}.
			 * It allows you to create and get {@link CKEDITOR.filetools.FileLoader file loaders}.
			 *
			 *		var loader = editor.uploadsRepository.create( file );
			 *		loader.loadAndUpload( 'http://foo/bar' );
			 *
			 * @since 4.5
			 * @readonly
			 * @property {CKEDITOR.filetools.UploadsRepository} uploadsRepository
			 * @member CKEDITOR.editor
			 */
			editor.uploadsRepository = new UploadsRepository( editor );
		}
	} );

	/**
	 * {@link CKEDITOR.filetools.FileLoader File loaders} repository. It allows you to create and get
	 * {@link CKEDITOR.filetools.FileLoader file loaders}.
	 *
	 * An instance of the repository is available as a {@link CKEDITOR.editor#uploadsRepository}.
	 *
	 *		var loader = editor.uploadsRepository.create( file );
	 *		loader.loadAndUpload( 'http://foo/bar' );
	 *
	 * To find more information about handling files see the {@link CKEDITOR.filetools.FileLoader} class.
	 *
	 * @since 4.5
	 * @class CKEDITOR.filetools.UploadsRepository
	 * @constructor Creates an instance of the repository.
	 * @param {CKEDITOR.editor} editor Editor instance. Used only to get the language data.
	 */
	function UploadsRepository( editor ) {
		this.editor = editor;

		this._ = {
			loaders: []
		};
	}

	UploadsRepository.prototype = {
		/**
		 * Creates a {@link CKEDITOR.filetools.FileLoader file loader}, saves it and sets the unique id for it.
		 *
		 * @param {Blob/String} fileOrData @see CKEDITOR.filetools.FileLoader
		 * @param {String} fileName @see CKEDITOR.filetools.FileLoader
		 * @returns {CKEDITOR.filetools.FileLoader} Created FileLoader.
		 */
		create: function( fileOrData, fileName ) {
			var id = this._.loaders.length,
				loader = new FileLoader( this.editor, fileOrData, fileName );

			loader.id = id;
			this._.loaders[ id ] = loader;

			return loader;
		},

		/**
		 * Gets a {@link CKEDITOR.filetools.FileLoader file loader} with a given id.
		 *
		 * @param {Number} id File loader id.
		 * @returns {CKEDITOR.filetools.FileLoader} FileLoader with a given id.
		 */
		get: function( id ) {
			return this._.loaders[ id ];
		}
	};

	/**
	 * `FileLoader` class is a wrapper which handles two file operations: loading the contents of the file stored on the user's
	 * device and uploading the file to a server. Note that you do not need to load file to upload it.
	 *
	 * There are two possible ways to crate `FileLoader`: with file or with data as a Base64 string. Note that if constructor gets
	 * data as a Base64 string there is no need to load data, they are already loaded.
	 *
	 * `FileLoader` is created for a single load and upload process so if you abort the process
	 * you need to create a new `FileLoader`.
	 *
	 * All process parameters are stored in the public properties.
	 *
	 * `FileLoader` implements events so you can listen on them to react on changes. There are two types of events: events to
	 * notify listeners about changes and event to let listener synchronize with current status. The first group of events contains
	 * `loading`, `loaded`, `uploading`, `uploaded`, `error` and `abort`. These events are called only once,
	 * when status change. The second type is `update` event. It is fired ever time status change, progress change or `update()` method is called.
	 *
	 * Default requests and responses formats will work with CKFinder 2.4.3 and above. If you need a custom request or response handling
	 * you need to overwrite {@link #sendRequest sendRequest} or {@link #handleResponse handleResponse} method.
	 *
	 * To create a `FileLoader` instance use the {@link CKEDITOR.filetools.UploadsRepository} class.
	 *
	 * @since 4.5
	 * @class CKEDITOR.filetools.FileLoader
	 * @mixins CKEDITOR.event
	 * @constructor Creates an instance of the class and sets initial values of all properties.
	 * @param {CKEDITOR.editor} editor Editor instance. Used only to get language data.
	 * @param {Blob/String} fileOrData file object of string data encoded with Base64.
	 * @param {String} [fileName] File name. If not set and the second parameter is a file then its name will be uses.
	 * If not set and the second parameter is a Base64 data strng, then the file name will be created based on
	 * the MIME type by replacing '/' with '.', for example for an `image/png` the file name will be `image.png`.
	 */
	function FileLoader( editor, fileOrData, fileName ) {
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
		} else {
			this.fileName = this.file.name;
		}

		this.uploaded = 0;

		this.status = 'created';

		this.abort = function() {
			this.changeStatusAndFire( 'abort' );
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
	 * @property {String} data
	 */

	/**
	 * File object which represents handled file. This property is set for both constructor options (file or data).
	 *
	 * @property {Blob} file
	 */

	/**
	 * The name of the file. If there is no file name it is create from the MIME type.
	 * For example for the MIME type `image/png`, the file name will be `image.png`.
	 *
	 * @property {String} fileName
	 */

	/**
	 * Number of loaded bytes. If `FileLoader` was created with data string {@link #propertt-loaded} equals {@link #total}.
	 *
	 * @property {Number} loaded
	 */

	/**
	 * Number of uploaded bytes.
	 *
	 * @property {Number} uploaded
	 */

	/**
	 * Total file size in bytes.
	 *
	 * @property {Number} total
	 */

	/**
	 * Error message or additional information received from the server.
	 *
	 * @property {String} message
	 */

	/**
	 * URL to the file when it is uploaded, received from the server.
	 *
	 * @property {String} url
	 */

	/**
	 * The target of the upload.
	 *
	 * @property {String} uploadUrl
	 */

	/**
	 * If `FileLoader` was created using {@link CKEDITOR.filetools.UploadsRepository}
	 * it gets an identifier which is stored in this property.
	 *
	 * @property {Number} id
	 */

	/**
	 * Aborts the process.
	 *
	 * This method has a different behavior dependin on the current {@link #status}.
	 *
	 * * If the status is `loading` or `uploading` current operation will be aborted.
	 * * Ff the status is `created`, `loading` or `uploading` status will be changed to `abort`
	 * and `abort` event will be called.
	 * * If the status is `loaded`, `uploaded`, `error` or `abort` this method will do nothing.
	 *
	 * @method abort
	 */

	FileLoader.prototype = {
		/**
		 * Loads file from the storage on user's computer to the data attribute and upload it to the server.
		 *
		 * The order statuses for the success load and upload is:
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
		 * The order of the statuses for the success load is:
		 *
		 * * `created`,
		 * * `loading`,
		 * * `loaded`.
		 */
		load: function() {
			var reader = new FileReader(),
				loader = this;

			loader.changeStatusAndFire( 'loading' );

			this.abort = function() {
				reader.abort();
			};

			reader.onabort = function() {
				loader.changeStatusAndFire( 'abort' );
			};

			reader.onerror = function() {
				loader.message = loader.lang.filetools.loadError;
				loader.changeStatusAndFire( 'error' );
			};

			reader.onprogress = function( evt ) {
				loader.loaded = evt.loaded;
				loader.update();
			};

			reader.onload = function() {
				loader.loaded = loader.total;
				loader.data = reader.result;
				loader.changeStatusAndFire( 'loaded' );
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
				this.changeStatusAndFire( 'error' );
			} else {
				var xhr = new XMLHttpRequest();

				this.uploadUrl = url;

				this.changeStatusAndFire( 'uploading' );

				this.attachUploadListeners( xhr );

				this.sendRequest( xhr );
			}
		},

		/**
		 * Attach listeners to the XML HTTP request object.
		 *
		 * @param {XMLHttpRequest} xhr XML HTTP request object.
		 */
		attachUploadListeners: function( xhr ) {
			var loader = this;

			loader.abort = function() {
				xhr.abort();
			};

			xhr.onabort = function() {
				loader.changeStatusAndFire( 'abort' );
			};

			xhr.onerror = function() {
				loader.message = loader.lang.filetools.networkError;
				loader.changeStatusAndFire( 'error' );
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
					loader.changeStatusAndFire( 'error' );
				} else {
					loader.handleResponse( xhr );
				}
			};
		},

		/**
		 * Send asynchronous request. Overwrite this method for a custom request.
		 *
		 * For example to send data directly (without a form):
		 *
		 * 		CKEDITOR.filetools.FileLoader.prototype.sendRequest = function() {
		 * 			xhr.open( 'POST', this.uploadUrl, true );
		 * 			xhr.setRequestHeader( 'Cache-Control', 'no-cache' );
		 * 			xhr.setRequestHeader( 'X-File-Name', this.fileName );
		 * 			xhr.setRequestHeader( 'X-File-Size', this.total );
		 * 			xhr.send( this.file );
		 * 		};
		 *
		 * @param {XMLHttpRequest} xhr XML HTTP Request object with attached listeners.
		 */
		sendRequest: function( xhr ) {
			var formData = new FormData();

			formData.append( 'upload', this.file, this.fileName );
			xhr.open( 'POST', this.uploadUrl, true );
			xhr.send( formData );
		},

		/**
		 * Handle response from the server. Overwrite this method for custom response handling.
		 *
		 * For example if the response is 'fileUrl|errorMessage':
		 *
		 * 		CKEDITOR.filetools.FileLoader.prototype.handleResponse = function( xhr ) {
		 * 			var repsonse = xhr.responseText.split( '|' );
		 * 			if ( repsonse[ 1 ] ) {
		 * 				this.message = repsonse[ 1 ];
		 * 				this.changeStatusAndFire( 'error' );
		 * 			} else {
		 * 				this.url = response[ 0 ];
		 * 				this.changeStatusAndFire( 'uploaded' );
		 * 			}
		 * 		};
		 *
		 * @param {XMLHttpRequest} xhr XML HTTP Request object with response.
		 */
		handleResponse: function( xhr ) {
			try {
				var response = JSON.parse( xhr.responseText );
			} catch ( e ) {
				this.message = this.lang.filetools.responseError.replace( '%1', xhr.responseText );
				this.changeStatusAndFire( 'error' );
				return;
			}

			if ( response.error ) {
				this.message = response.error.message;
			}

			if ( !response.uploaded ) {
				this.changeStatusAndFire( 'error' );
			} else {
				this.fileName = response.fileName;
				this.url = response.url;
				this.changeStatusAndFire( 'uploaded' );
			}
		},

		/**
		 * Changes status to the new status, update `abort` function if needed and fire two events:
		 * new status and update.
		 *
		 * @param {String} newStatus New status to be set.
		 */
		changeStatusAndFire: function( newStatus ) {
			this.status = newStatus;

			if ( newStatus == 'error' || newStatus == 'abort' ||
				newStatus == 'loaded' || newStatus == 'uploaded' ) {
				this.abort = function() {};
			}

			this.fire( newStatus );
			this.update();
		},

		/**
		 * Fires the {@link #event-update} event.
		 */
		update: function() {
			this.fire( 'update' );
		}

		/**
		 * Event fired when status change to `loading`. Is will be fired once for the `FileLoader`.
		 *
		 * @event loading
		 * @member CKEDITOR.filetools.FileLoader
		 */

		/**
		 * Event fired when status change to `loaded`. Is will be fired once for the `FileLoader`.
		 *
		 * @event loaded
		 * @member CKEDITOR.filetools.FileLoader
		 */

		/**
		 * Event fired when status change to `uploading`. Is will be fired once for the `FileLoader`.
		 *
		 * @event uploading
		 * @member CKEDITOR.filetools.FileLoader
		 */

		/**
		 * Event fired when status change to `uploaded`. Is will be fired once for the `FileLoader`.
		 *
		 * @event uploaded
		 * @member CKEDITOR.filetools.FileLoader
		 */

		/**
		 * Event fired when status change to `error`. Is will be fired once for the `FileLoader`.
		 *
		 * @event error
		 * @member CKEDITOR.filetools.FileLoader
		 */

		/**
		 * Event fired when status change to `abort`. Is will be fired once for the `FileLoader`.
		 *
		 * @event abort
		 * @member CKEDITOR.filetools.FileLoader
		 */

		/**
		 * Event fired every time `FileLoader` status or progress changed or `update()` method is called.
		 * This event was designed to allow showing visualization of the progress and refresh that visualization
		 * every time state changes. Note that multiple `update` events may be fired with the same status.
		 *
		 * @event update
		 * @member CKEDITOR.filetools.FileLoader
		 */
	};

	CKEDITOR.event.implementOn( FileLoader.prototype );

	//
	// HELPERS ----------------------------------------------------------------
	//

	var base64HeaderRegExp = /^data:(\S*?);base64,/;

	// Changes the first letter of the string to the upper case.
	//
	// Example.: 'foo' -> 'Foo'
	//
	// @param {String} str Input string.
	// @returns {String} String with uppers case first letter.
	function ucFirst( str ) {
		str += '';
		var f = str.charAt( 0 ).toUpperCase();
		return f + str.substr( 1 );
	}

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

		var file =  new Blob( byteArrays, { type: contentType } );
		file.name = contentType.replace( '/', '.' );
		return file;
	}

	//
	// PUBLIC API -------------------------------------------------------------
	//

	// Two plugins extends this object.
	if ( !CKEDITOR.filetools ) {
		/**
		 * Helpers to load and upload file.
		 *
		 * @since 4.5
		 * @singleton
		 * @class CKEDITOR.filetools
		 */
		CKEDITOR.filetools = {};
	}

	CKEDITOR.tools.extend( CKEDITOR.filetools, {
		UploadsRepository: UploadsRepository,
		FileLoader: FileLoader,

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
			if ( type && config[ type + 'UploadUrl' ] ) {
				return config[ type + 'UploadUrl' ];
			} else if ( config.uploadUrl ) {
				return config.uploadUrl;
			} else if ( type && config[ 'filebrowser' + ucFirst( type ) + 'UploadUrl' ] ) {
				return config[ 'filebrowser' + ucFirst( type ) + 'UploadUrl' ] + '&responseType=json';
			} else if ( config.filebrowserUploadUrl ) {
				return config.filebrowserUploadUrl + '&responseType=json';
			}

			throw 'Upload URL is not defined.';
		},

		/**
		 * Checked if the MIME type of given file is supported.
		 * If no `supportedTypes` regular expression is given all type are considered as supported.
		 *
		 * 		CKEDITOR.filetools.isTypeSupported( { type: 'image/png' } ); // true
		 * 		CKEDITOR.filetools.isTypeSupported( { type: 'image/png' }, /image\/(png|jpeg)/ ); // true
		 * 		CKEDITOR.filetools.isTypeSupported( { type: 'image/png' }, /image\/(gif|jpeg)/ ); // false
		 *
		 * @param {Blob} file File to check.
		 * @param {RegExp} [supportedTypes] Regular expression to check MIME type of the file.
		 * @returns {Boolean} `true` if the file type is supported.
		 */
		isTypeSupported: function( file, supportedTypes ) {
			if ( !supportedTypes ) {
				return true;
			}

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