/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadmanager', {} );

	var imgHeaderRegExp = /^data:(image\/(png|jpg|jpeg));base64,/;

	function UploadManager() {
		this._ = {
			uploads: []
		}
	}

	UploadManager.prototype = {
		startUpload: function( fileOrData, fileName ) {
			var id = this._.uploads.length,
				upload = new Upload( this.url, fileOrData, fileName );

			upload.id = id;
			this._.uploads[ id ] = upload;

			upload.start();

			return upload;
		},
		getUpload: function( id ) {
			return this._.uploads[ id ];
		},
		refreshStatuses: function() {
			for ( var i = 0; i < uploads.length; i++ ) {
				uploads[ i ].fireStatus();
			}
		}
	};

	function Upload( url, fileOrData, fileName ) {
		var that = this;

		this.url = url;

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

		this.changeAndFireStatus( 'created' );
	}

	Upload.prototype = {
		start: function() {
			if ( this.data ) {
				this.sendFile();
			} else {
				this.loadAndSendFile();
			}
		},
		loadAndSendFile: function() {
			var reader = new FileReader(),
				upload = this;

			upload.changeAndFireStatus( 'loading' );

			reader.onabort = function( evt ) {
				upload.changeAndFireStatus( 'abort' );
			};

			reader.onerror = function( evt ) {
				upload.changeAndFireStatus( 'error' );
			};

			reader.onprogress = function( evt ) {
				this.loaded = evt.loaded;
				upload.fireStatus();
			};

			reader.onload = function( evt ) {
				upload.loaded = upload.total;
				upload.data = evt.target.result

				upload.sendFile();
			};

			this.abort = function() {
				reader.abort();
			}

			reader.readAsDataURL( this.file );
		},

		sendFile: function() {
			var xhr = new XMLHttpRequest(),
				formData = new FormData(),
				upload = this;

			upload.changeAndFireStatus( 'uploading' );


			xhr.onabort = function( evt ) {
				upload.changeAndFireStatus( 'abort' );
			};

			xhr.onerror = function( evt ) {
				upload.changeAndFireStatus( 'error' );
			};

			xhr.onprogress = function( evt ) {
				this.uploaded = evt.loaded;
				upload.fireStatus();
			};

			xhr.onload = function( evt ) {
				// handle response xhr.responseText
				upload.changeAndFireStatus( 'done' );
			};

			upload.abort = function() {
				xhr.abort();
			}

			formData.append( 'upload', this.file );
			xhr.open( "POST", this.url, true );
			xhr.send( formData );
		},
		changeAndFireStatus: function( newStatus ) {
			var noopFunction = function() {};

			this.status = newStatus;

			if ( newStatus =='created' || newStatus =='error' ||
				newStatus =='abort' || newStatus =='done' ) {
				this.abort = noopFunction;
			}

			this.fire( newStatus );
			this.fireStatus();
		},
		fireStatus: function() {
			this.fire( 'updateStatus' );
		}
	};

	function srcToBlob( src ) {
		var contentType = src.match( imgHeaderRegExp )[ 1 ],
			base64Data = src.replace( imgHeaderRegExp, '' ),
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

	CKEDITOR.event.implementOn( Upload.prototype );

	CKEDITOR.plugins.uploadmanager = {
		manager: UploadManager,
		upload: Upload
	};
} )();