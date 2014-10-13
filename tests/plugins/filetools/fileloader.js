/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: filetools */

'use strict';

( function() {
	var FileReaderBackup = window.FileReader,
		XMLHttpRequestBackup = window.XMLHttpRequest,
		FileLoader,
		pngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAAABJRU5ErkJggg==",
		testFile = getTestFile();


	function createFileReaderMock( scenario ) {
		var isAborted = false;

		window.FileReader = function() {
			var reader = {
					readAsDataURL: function() {
						for ( var i = 0; i < scenario.length; i++ ) {
							if ( !isAborted ) {
								( function( i ) {
									setTimeout( function() {
										var evt;

										switch ( scenario[ i ] ) {
											case 'progress':
												evt = { loaded: 41 };
												break;
											case 'load':
												reader.result = 'result';
												break;
										}

										reader[ 'on' + scenario[ i ] ]( evt );
									}, i );
								} )( i );
							}
						}
					},

					abort: function() {
						isAborted = true;

					}
				};

			return reader;
		}
	}

	function createXMLHttpRequestMock( scenario ) {
		var isAborted = false;

		window.XMLHttpRequest = function() {
			var xhr = {
					open: function() {
					},

					send: function( formData ) {
						for ( var i = 0; i < scenario.length; i++ ) {
							if ( !isAborted ) {
								( function( i ) {
									setTimeout( function() {
										var evt;

										switch ( scenario[ i ] ) {
											case 'progress':
												evt = { loaded: 41 };
												break;
											case 'load':
												xhr.status = 200;
												xhr.responseText = '{"fileName":"name2.png","uploaded":1,"url":"http:\/\/url\/name2.png"}'
												break;
										}

										xhr[ 'on' + scenario[ i ] ]( evt );
									}, i );
								} )( i );
							}
						}
					},

					abort: function() {
						isAborted = true;

					}
				};

			return xhr;
		}
	}

	function observeEvents( loader ) {
		var observer = { events: '' };

		function stdObserver( evt ) {
			var message = loader.message || '-',
				data = loader.data || '-',
				url = loader.url || '-';

				if ( data.length > 21 )
					data = data.substring( 0, 21 );


			observer.events += evt.name + '[' + loader.status + ',' + loader.fileName + ',' +
				loader.uploaded + '/' + loader.loaded + '/' + loader.total + ',' +
				message  + ',' + data + ',' +url + ']|';
		}

		loader.on( 'loading', stdObserver );
		loader.on( 'loaded', stdObserver );
		loader.on( 'uploading', stdObserver );
		loader.on( 'uploaded', stdObserver );
		loader.on( 'abort', stdObserver );
		loader.on( 'error', stdObserver );
		loader.on( 'update', stdObserver );

		observer.assert = function( expected ) {
			var events = observer.events.split( '|' );
			events.pop();

			for ( var i = 0; i < events.length; i++ ) {
				assert.areSame( expected[ i ], events[ i ] );
			};
		};

		return observer;
	}

	function srcToFile( src ) {
		var base64HeaderRegExp = /^data:(\S*?);base64,/,
			contentType = src.match( base64HeaderRegExp )[ 1 ],
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

		return new Blob( byteArrays, { type: contentType } );
	}

	function getTestFile() {
		var file = srcToFile( pngBase64 );
		file.name = 'name.png';
		return file;
	}

	function waitFor( object, evtName, fun ) {
		object.on( evtName, function() {
			setTimeout( function() {
				resume( fun );
			}, 0 );
		} );

		wait();
	}

	bender.test( {
		'setUp': function() {
			FileLoader = CKEDITOR.filetools.FileLoader;
		},

		'tearDown': function() {
			window.FileReader = FileReaderBackup;
			window.XMLHttpRequest = XMLHttpRequestBackup;
		},



		'test constructor string, no name': function() {
			var loader = new FileLoader( pngBase64 );

			assert.areSame( 'image.png', loader.fileName );
			assert.areSame( pngBase64, loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 82, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor string, filename': function() {
			var loader = new FileLoader( pngBase64, 'foo' );

			assert.areSame( 'foo', loader.fileName );
			assert.areSame( pngBase64, loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 82, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor file, no name': function() {
			var loader = new FileLoader( testFile );

			assert.areSame( 'name.png', loader.fileName );
			assert.isNull( loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 0, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor file, filename': function() {
			var loader = new FileLoader( testFile, 'bar' );

			assert.areSame( 'bar', loader.fileName );
			assert.isNull( loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 0, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test load': function() {
			var loader = new FileLoader( testFile, 'name.png' ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );

			loader.load();

			waitFor( loader, 'loaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'loaded[loaded,name.png,0/82/82,-,result,-]',
					'update[loaded,name.png,0/82/82,-,result,-]' ] );
			}, 3 );
		},

		'test upload': function() {
			var loader = new FileLoader( pngBase64, 'name.png' ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			loader.upload( 'http:\/\/url\/' );

			assert.areSame( 'http:\/\/url\/', loader.uploadUrl );

			waitFor( loader, 'uploaded', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/82/82,-,data:image/png;base64,-]',
					'update[uploading,name.png,0/82/82,-,data:image/png;base64,-]',
					'update[uploading,name.png,41/82/82,-,data:image/png;base64,-]',
					'uploaded[uploaded,name2.png,82/82/82,-,data:image/png;base64,http://url/name2.png]',
					'update[uploaded,name2.png,82/82/82,-,data:image/png;base64,http://url/name2.png]' ] );
			}, 3 );
		},

		'test loadAndUpload': function() {
			var loader = new FileLoader( testFile, 'name.png' ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			loader.loadAndUpload( 'http:\/\/url\/' );

			waitFor( loader, 'uploaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'loaded[loaded,name.png,0/82/82,-,result,-]',
					'update[loaded,name.png,0/82/82,-,result,-]',
					'uploading[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,41/82/82,-,result,-]',
					'uploaded[uploaded,name2.png,82/82/82,-,result,http://url/name2.png]',
					'update[uploaded,name2.png,82/82/82,-,result,http://url/name2.png]' ] );
			} );
		}
	} );
} )();
