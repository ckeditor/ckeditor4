/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadmanager', {
		lang: 'en' // %REMOVE_LINE_CORE%
	} );

	var base64HeaderRegExp = /^data:(\S*?);base64,/;

	function UploadManager() {
		this._ = {
			loaders: []
		}
	}

	UploadManager.prototype = {
		createLoader: function( fileOrData, fileName ) {
			var id = this._.loaders.length,
				loader = new FileLoader( fileOrData, fileName );

			loader.id = id;
			this._.loaders[ id ] = loader;

			return loader;
		},
		getLoader: function( id ) {
			return this._.loaders[ id ];
		}
	};

	function FileLoader( fileOrData, fileName ) {
		var that = this;

		if ( typeof fileOrData === 'string' ) {
			// Data are already loaded from disc.
			this.data = fileOrData;
			this.file = srcToBlob( this.data );
			this.loaded = this.total;
		} else {
			this.data = null;
			this.file = fileOrData;
			this.loaded = 0;
		}

		if ( fileName ) {
			this.fileName = fileName;
		} else {
			this.fileName = this.file.name;
		}

		this.total = this.file.size;
		this.uploaded = 0;

		this.changeStatusAndFire( 'created' );
	}

	FileLoader.prototype = {
		loadAndUpload: function( url ) {
			var loader = this;
			this.once( 'loaded', function() {
				//
				setTimeout( function() {
					loader.upload( url );
				}, 0 );
			} );

			this.load();
		},
		load: function() {
			var reader = new FileReader(),
				loader = this;

			loader.changeStatusAndFire( 'loading' );

			this.abort = function() {
				reader.abort();
			};

			reader.onabort = function( evt ) {
				loader.changeStatusAndFire( 'abort' );
			};

			reader.onerror = function( evt ) {
				loader.message = editor.lang.uploadmanager.loadError;
				loader.changeStatusAndFire( 'error' );
			};

			reader.onprogress = function( evt ) {
				loader.loaded = evt.loaded;
				loader.update();
			};

			reader.onload = function( evt ) {
				loader.loaded = loader.total;
				loader.data = evt.target.result;
				loader.changeStatusAndFire( 'loaded' );
			};

			reader.readAsDataURL( this.file );
		},

		upload: function( url ) {
			if ( !url ) {
				this.message = editor.lang.uploadmanager.noUrlError;
				this.changeStatusAndFire( 'error' );
			} else {
				var xhr = new XMLHttpRequest();

				this.uploadUrl = url;

				this.changeStatusAndFire( 'uploading' );

				this.attachUploadListeners( xhr );

				this.sendRequest( xhr );
			}

		},

		attachUploadListeners: function( xhr ) {
			var loader = this;

			loader.abort = function() {
				xhr.abort();
			};

			xhr.onabort = function( evt ) {
				loader.changeStatusAndFire( 'abort' );
			};

			xhr.onerror = function( evt ) {
				loader.message = editor.lang.uploadmanager.networkError;
				loader.changeStatusAndFire( 'error' );
			};

			xhr.onprogress = function( evt ) {
				loader.uploaded = evt.loaded;
				loader.update();
			};

			xhr.onload = function( evt ) {
				if ( xhr.status < 200 || xhr.status > 299 ) {
					loader.message = editor.lang.uploadmanager[ 'httpError' + xhr.status ];
					if ( !loader.message ) {
						loader.message = editor.lang.uploadmanager[ 'httpError' ].replace( '%1', xhr.status );
					}
					loader.changeStatusAndFire( 'error' );
				} else {
					loader.handleResponse( xhr );
				}
			};
		},

		sendRequest: function( xhr ) {
			var formData = new FormData();

			formData.append( 'upload', this.file );
			xhr.open( "POST", this.uploadUrl, true );
			xhr.send( formData );
		},

		handleResponse: function( xhr ) {
			try {
				var response = JSON.parse( xhr.responseText );
			} catch ( e ) {
				this.message = editor.lang.uploadmanager.responseError.replace( '%1', xhr.responseText );
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

		changeStatusAndFire: function( newStatus ) {
			var noopFunction = function() {};

			this.status = newStatus;

			if ( newStatus =='created' ||
				newStatus =='error' || newStatus =='abort' ||
				newStatus =='loaded' || newStatus =='uploaded' ) {
				this.abort = noopFunction;
			}

			this.fire( newStatus );
			this.update();
		},

		update: function() {
			this.fire( 'update' );
		}
	};

	function srcToBlob( src ) {
		var contentType = src.match( base64HeaderRegExp )[ 1 ],
			base64Data = src.replace( base64HeaderRegExp, '' ),
			byteCharacters = atob( base64Data ),
			byteArrays = [],
			sliceSize = 512,
			offset, slice, byteNumbers, i, byteArray;

		console.log( contentType );

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

	function getUploadUrl( config, type ) {
		var url = config[ type + 'UploadUrl' ];

		if ( type && config[ type + 'UploadUrl' ] ) {
			return config[ type + 'UploadUrl' ];
		} else if ( config[ 'uploadUrl' ] ) {
			return config[ 'uploadUrl' ];
		} else if ( type && config[ 'filebrowser' + ucFirst( type ) + 'UploadUrl' ] ) {
			return config[ 'filebrowser' + ucFirst( type ) + 'UploadUrl' ] + '&responseType=json';
		} else if ( config[ 'filebrowserUploadUrl' ] ) {
			return config[ 'filebrowserUploadUrl' ] + '&responseType=json';
		}

		throw "Upload URL is not defined.";
	}

	function ucFirst( str ) {
		str += '';
		var f = str.charAt( 0 ).toUpperCase();
		return f + str.substr( 1 );
	}

	function isExtentionSupported( file, supportedExtentions ) {
		if ( !supportedExtentions ) {
			return true;
		}

		var ext = getExtention( file.name );

		supportedExtentions = ',' + supportedExtentions + ',';

		return supportedExtentions.indexOf( ',' + ext + ','  ) > -1;
	}

	function getExtention( filename ) {
		var splited = filename.split( '.' );
		if ( splited.length === 1 || ( splited[ 0 ] === '' && splited.length === 2 ) ) {
			return '';
		}
		return splited.pop().toLowerCase();
	}

	CKEDITOR.event.implementOn( FileLoader.prototype );

	CKEDITOR.plugins.uploadmanager = {
		manager: UploadManager,
		loader: FileLoader,
		getUploadUrl: getUploadUrl,
		isExtentionSupported: isExtentionSupported

	};

	CKEDITOR.editor.prototype.uploadManager = new UploadManager();
} )();