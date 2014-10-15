/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'filetools', {
		lang: 'en', // %REMOVE_LINE_CORE%

		beforeInit: function( editor ) {
			editor.uploadsRepository = new UploadsRepository( editor );
		}
	} );

	var base64HeaderRegExp = /^data:(\S*?);base64,/;

	function UploadsRepository( editor ) {
		this.editor = editor;

		this._ = {
			loaders: []
		}
	}

	UploadsRepository.prototype = {
		create: function( fileOrData, fileName ) {
			var id = this._.loaders.length,
				loader = new FileLoader( this.editor, fileOrData, fileName );

			loader.id = id;
			this._.loaders[ id ] = loader;

			return loader;
		},
		get: function( id ) {
			return this._.loaders[ id ];
		}
	};

	function FileLoader( editor, fileOrData, fileName ) {
		var that = this;

		this.lang = editor.lang;

		if ( typeof fileOrData === 'string' ) {
			// Data are already loaded from disc.
			this.data = fileOrData;
			this.file = srcToFile( this.data );
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

		this.changeStatusAndFire( 'created' );
	}

	FileLoader.prototype = {
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
				loader.message = loader.lang.filetools.loadError;
				loader.changeStatusAndFire( 'error' );
			};

			reader.onprogress = function( evt ) {
				loader.loaded = evt.loaded;
				loader.update();
			};

			reader.onload = function( evt ) {
				loader.loaded = loader.total;
				loader.data = reader.result;
				loader.changeStatusAndFire( 'loaded' );
			};

			reader.readAsDataURL( this.file );
		},

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

		attachUploadListeners: function( xhr ) {
			var loader = this;

			loader.abort = function() {
				xhr.abort();
			};

			xhr.onabort = function( evt ) {
				loader.changeStatusAndFire( 'abort' );
			};

			xhr.onerror = function( evt ) {
				loader.message = loader.lang.filetools.networkError;
				loader.changeStatusAndFire( 'error' );
			};

			xhr.onprogress = function( evt ) {
				loader.uploaded = evt.loaded;
				loader.update();
			};

			xhr.onload = function( evt ) {
				loader.uploaded = loader.total;

				if ( xhr.status < 200 || xhr.status > 299 ) {
					loader.message = loader.lang.filetools[ 'httpError' + xhr.status ];
					if ( !loader.message ) {
						loader.message = loader.lang.filetools[ 'httpError' ].replace( '%1', xhr.status );
					}
					loader.changeStatusAndFire( 'error' );
				} else {
					loader.handleResponse( xhr );
				}
			};
		},

		sendRequest: function( xhr ) {
			var formData = new FormData();

			formData.append( 'upload', this.file, this.fileName );
			xhr.open( "POST", this.uploadUrl, true );
			xhr.send( formData );
		},

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

		changeStatusAndFire: function( newStatus ) {
			this.status = newStatus;

			if ( newStatus =='created' ) {
				this.abort = function() {
					this.changeStatusAndFire( 'abort' );
				};
			}

			if ( newStatus =='error' || newStatus =='abort' ||
				newStatus =='loaded' || newStatus =='uploaded' ) {
				this.abort = function() {};
			}

			this.fire( newStatus );
			this.update();
		},

		update: function() {
			this.fire( 'update' );
		}
	};

	function srcToFile( src ) {
		var contentType = src.match( base64HeaderRegExp )[ 1 ],
			base64Data = src.replace( base64HeaderRegExp, '' ),
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

	function getUploadUrl( config, type ) {
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

	if ( !CKEDITOR.filetools ) {
		CKEDITOR.filetools = {};
	}

	CKEDITOR.tools.extend( CKEDITOR.filetools, {
		FileLoader: FileLoader,
		getUploadUrl: getUploadUrl,
		isExtentionSupported: isExtentionSupported,
		getExtention: getExtention
	} );
} )();