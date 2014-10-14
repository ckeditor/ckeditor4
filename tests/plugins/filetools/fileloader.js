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
									var action;
									if ( typeof scenario[ i ] === 'string' ) {
										action =  function() {
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
										}
									} else {
										action = scenario[ i ];
									}

									setTimeout( action, i );
								} )( i );
							}
						}
					},

					abort: function() {
						isAborted = true;

						setTimeout( function() {
							reader.onabort();
						}, 0 );
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
									var action;
									if ( typeof scenario[ i ] === 'string' ) {
										action = function() {
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
										}
									} else {
										action = scenario[ i ];
									}

									setTimeout( action, i );
								} )( i );
							}
						}
					},

					abort: function() {
						isAborted = true;

						setTimeout( function() {
							xhr.onabort();
						}, 0 );
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

			assert.areSame( expected.length, events.length,
				'Events and expected length should be the same. Actual events:\n' + observer.events.replace( /\|/g, '\n' ) );

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

	function resumeAfter( object, evtName, fun ) {
		object.on( evtName, function() {
			setTimeout( function() {
				resume( fun );
			}, 0 );
		} );
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
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );

			resumeAfter( loader, 'loaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'loaded[loaded,name.png,0/82/82,-,result,-]',
					'update[loaded,name.png,0/82/82,-,result,-]' ] );
			}, 3 );

			loader.load();

			wait();
		},

		'test upload': function() {
			var loader = new FileLoader( pngBase64, 'name.png' ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/82/82,-,data:image/png;base64,-]',
					'update[uploading,name.png,0/82/82,-,data:image/png;base64,-]',
					'update[uploading,name.png,41/82/82,-,data:image/png;base64,-]',
					'uploaded[uploaded,name2.png,82/82/82,-,data:image/png;base64,http://url/name2.png]',
					'update[uploaded,name2.png,82/82/82,-,data:image/png;base64,http://url/name2.png]' ] );
			}, 3 );

			loader.upload( 'http:\/\/url\/' );

			assert.areSame( 'http:\/\/url\/', loader.uploadUrl );

			wait();
		},

		'test loadAndUpload': function() {
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'uploading[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,41/82/82,-,result,-]',
					'uploaded[uploaded,name2.png,82/82/82,-,result,http://url/name2.png]',
					'update[uploaded,name2.png,82/82/82,-,result,http://url/name2.png]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on create': function() {
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'abort[abort,name.png,0/0/82,-,-,-]',
					'update[abort,name.png,0/0/82,-,-,-]' ] );
			} );

			loader.abort();

			wait();
		},

		'test abort on loading': function() {
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'abort[abort,name.png,0/0/82,-,-,-]',
					'update[abort,name.png,0/0/82,-,-,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on loading2': function() {
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'abort[abort,name.png,0/41/82,-,-,-]',
					'update[abort,name.png,0/41/82,-,-,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on loaded': function() {
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'load', abort ] );

			resumeAfter( loader, 'loaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'loaded[loaded,name.png,0/82/82,-,result,-]',
					'update[loaded,name.png,0/82/82,-,result,-]' ] );
			} );

			loader.load();

			wait();
		},

		'test abort on uploading': function() {
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'uploading[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,0/82/82,-,result,-]',
					'abort[abort,name.png,0/82/82,-,result,-]',
					'update[abort,name.png,0/82/82,-,result,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on uploading 2': function() {
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'uploading[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,41/82/82,-,result,-]',
					'abort[abort,name.png,41/82/82,-,result,-]',
					'update[abort,name.png,41/82/82,-,result,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on uploaded': function() {
			var loader = new FileLoader( testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'load', abort ] );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/0/82,-,-,-]',
					'update[loading,name.png,0/41/82,-,-,-]',
					'uploading[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,0/82/82,-,result,-]',
					'update[uploading,name.png,41/82/82,-,result,-]',
					'uploaded[uploaded,name2.png,82/82/82,-,result,http://url/name2.png]',
					'update[uploaded,name2.png,82/82/82,-,result,http://url/name2.png]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		}
	} );
} )();
