/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadmanager', {
		requires: '',
		lang: 'en', // %REMOVE_LINE_CORE%
		init: function( editor ) {
		}
	} );

	var imgHeaderRegExp = /^data:(image\/(png|jpg|jpeg));base64,/;

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

	CKEDITOR.plugins.uploadmanager = {};

	CKEDITOR.plugins.uploadmanager.manager = function() {
		this._ = {
			uploads: []
		}
	};

	CKEDITOR.plugins.uploadmanager.manager.prototype = {
		upload: function( fileOrData, fileName ) {
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

	CKEDITOR.plugins.uploadmanager.upload = function( url, fileOrData, fileName ) {
		var that = this;

		this.url = url;

		if ( typeof fileOrData === 'string' ) {
			// Data are already loaded from disc.
			this.file = srcToBlob( fileOrData );
			this.loaded = this.total;
		} else {
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
	};

	CKEDITOR.plugins.uploadmanager.upload.prototype = {
		start: function() {
			if ( this.loaded == this.total ) {
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
				upload.fire( 'loading' );
			};

			reader.onload = function( evt ) {
				upload.loaded = upload.total;

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
	}

	CKEDITOR.event.implementOn( Upload.prototype );
} )();