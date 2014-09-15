/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadmanager', {} );

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
		},
		updateAll: function() {
			for ( var i = 0; i < loaders.length; i++ ) {
				loaders[ i ].update();
			}
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
			var xhr = new XMLHttpRequest(),
				formData = new FormData(),
				loader = this;

			loader.changeStatusAndFire( 'uploading' );

			loader.abort = function() {
				xhr.abort();
			};

			xhr.onabort = function( evt ) {
				loader.changeStatusAndFire( 'abort' );
			};

			xhr.onerror = function( evt ) {
				loader.changeStatusAndFire( 'error' );
			};

			xhr.onprogress = function( evt ) {
				loader.uploaded = evt.loaded;
				loader.update();
			};

			xhr.onload = function( evt ) {
				var parts = xhr.responseText.split( '|' );

				loader.filename = parts[ 0 ];
				loader.message = parts[ 1 ];

				if ( !loader.filename && loader.message ) {
					loader.changeStatusAndFire( 'error' );
				} else {
					loader.changeStatusAndFire( 'uploaded' );
				}
			};

			formData.append( 'upload', this.file );
			xhr.open( "POST", url, true );
			xhr.send( formData );
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

	CKEDITOR.event.implementOn( FileLoader.prototype );

	CKEDITOR.plugins.uploadmanager = {
		manager: UploadManager,
		loader: FileLoader
	};
} )();