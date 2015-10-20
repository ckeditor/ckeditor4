/* bender-tags: editor,unit,clipboard,filetools */
/* bender-ckeditor-plugins: filetools */

'use strict';

( function() {
	var File = window.File,
		Blob = window.Blob,
		FormData = window.FormData,
		FileReaderBackup = window.FileReader,
		XMLHttpRequestBackup = window.XMLHttpRequest,
		FileLoader, resumeAfter,
		pngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAAABJRU5ErkJggg==',
		testFile, lastFormData,
		listeners = [],
		editorMock = {
			config: {}
		},
		editorMockDefaultFileName = {
			config: {
				fileTools_defaultFileName: 'default-file-name'
			}
		};

	function createFileMock() {
		window.File = File = function( data, name ) {
			var file = new Blob( data , {} );
			file.name = name;

			return file;
		};
	}

	function createFormDataMock() {
		window.FormData = function() {
			var entries = {},
				mock = {
					get: function( name ) {
						return entries[ name ] || null;
					},
					append: function( name, value, fileName ) {
						if ( value instanceof File && ( value.name === fileName || !fileName ) )
							entries[ name ] = value;
						else if ( value instanceof Blob ) {
							fileName = fileName || value.name || 'blob';

							entries [ name ] = new File( [ value ], fileName );
						}
						else
							entries[ name ] = value + '';
					},
					has: function( name ) {
						return Object.prototype.hasOwnProperty.call( entries, name );
					}
				};

			return mock;
		};
	}

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
										action = function() {
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
										};
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
						reader.onabort();
					}
				};

			return reader;
		};
	}

	function createXMLHttpRequestMock( scenario, response ) {
		var isAborted = false;

		window.XMLHttpRequest = function() {
			var xhr = {
					open: function() {
					},

					upload: {},

					send: function( formData ) {
						lastFormData = formData;

						for ( var i = 0; i < scenario.length; i++ ) {
							if ( !isAborted ) {
								( function( i ) {
									var action;
									if ( typeof scenario[ i ] === 'string' ) {
										action = function() {
											var evt;

											switch ( scenario[ i ] ) {
												case 'progress':
													// Report total upload size larger than file size. It will happen
													// when file will be embedded in FormData.
													evt = { loaded: 41, total: 100, lengthComputable: true };
													xhr.upload.onprogress( evt );
													break;
												case 'load':
													xhr.status = ( response && response.responseStatus ) ? response.responseStatus : 200;
													xhr.responseText = ( response && response.responseText ) ? response.responseText :
														'{"fileName":"name2.png","uploaded":1,"url":"http:\/\/url\/name2.png"}';
													xhr.onload( evt );
													break;
												case 'error':
													xhr.onerror( evt );
													break;
											}


										};
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
		};
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
				loader.uploaded + '/' + loader.loaded + '/' + loader.total + '/' + loader.uploadTotal + ',' +
				message  + ',' + data + ',' + url + ']|';
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
			}
		};

		return observer;
	}

	function attachListener( obj, evt, listener ) {
		listeners.push( {
			obj: obj,
			evt: evt,
			listener: listener
		} );

		obj.on( evt, listener );
	}

	// For unknown reason plugin is not loaded if the code coverage is enabled
	// and there is no editor instance.
	bender.editor = {
		config: {
			extraPlugins: 'filetools,clipboard'
		}
	};

	bender.test( {
		init: function() {
			CKEDITOR.event.implementOn( editorMock );
			CKEDITOR.plugins.get( 'filetools' ).beforeInit( editorMock );
		},

		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			// IE doesn't support File constructor, so there is a need to mimic it.
			if ( typeof MSBlobBuilder === 'function' )
				createFileMock();

			// FormData in IE & Chrome 47- supports only adding data, not getting it, so mocking (polyfilling?) is required.
			// Note that mocking is needed only for tests, as CKEditor.fileTools uses only append method
			if ( !FormData.prototype.get || !FormData.prototype.has )
				createFormDataMock();

			FileLoader = CKEDITOR.fileTools.fileLoader;
			resumeAfter = bender.tools.resumeAfter;
			testFile = bender.tools.getTestPngFile();
		},

		tearDown: function() {
			var data;

			window.FileReader = FileReaderBackup;
			window.XMLHttpRequest = XMLHttpRequestBackup;

			while ( data = listeners.pop() ) {
				data.obj.removeListener( data.evt, data.listener );
			}

			editorMock.lang = {};
		},

		'test constructor string, no name': function() {
			var loader = new FileLoader( editorMock, pngBase64 );

			assert.areSame( 'image.png', loader.fileName );
			assert.areSame( pngBase64, loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 82, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor string, no name, default file name provided': function() {
			var loader = new FileLoader( editorMockDefaultFileName, pngBase64 );

			assert.areSame( editorMockDefaultFileName.config.fileTools_defaultFileName + '.png', loader.fileName );
			assert.areSame( pngBase64, loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 82, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor string, filename': function() {
			var loader = new FileLoader( editorMock, pngBase64, 'foo' );

			assert.areSame( 'foo', loader.fileName );
			assert.areSame( pngBase64, loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 82, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor file, no name': function() {
			var loader = new FileLoader( editorMock, testFile );

			assert.areSame( 'name.png', loader.fileName );
			assert.isNull( loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 0, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor file, filename': function() {
			var loader = new FileLoader( editorMock, testFile, 'bar' );

			assert.areSame( 'bar', loader.fileName );
			assert.isNull( loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 0, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor file, no filename in file': function() {
			var testFileWithoutName = bender.tools.getTestPngFile();
			testFileWithoutName.name = undefined;

			var loader = new FileLoader( editorMock, testFileWithoutName );

			assert.areSame( 'image.png', loader.fileName );
			assert.isNull( loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 0, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor file, no filename in file, default file name provided': function() {
			var testFileWithoutName = bender.tools.getTestPngFile();
			testFileWithoutName.name = undefined;

			var loader = new FileLoader( editorMockDefaultFileName, testFileWithoutName );

			assert.areSame( editorMockDefaultFileName.config.fileTools_defaultFileName + '.png', loader.fileName );
			assert.isNull( loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
			assert.areSame( 0, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test load': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );

			resumeAfter( loader, 'loaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'loaded[loaded,name.png,0/82/82/null,-,result,-]',
					'update[loaded,name.png,0/82/82/null,-,result,-]' ] );
			}, 3 );

			loader.load();

			wait();
		},

		'test upload': function() {
			var loader = new FileLoader( editorMock, pngBase64, 'name.png' ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/82/82/null,-,data:image/png;base64,-]',
					'update[uploading,name.png,0/82/82/null,-,data:image/png;base64,-]',
					'update[uploading,name.png,41/82/82/100,-,data:image/png;base64,-]',
					'update[uploading,name.png,41/82/82/100,-,data:image/png;base64,-]',
					'uploaded[uploaded,name2.png,100/82/82/100,-,data:image/png;base64,http://url/name2.png]',
					'update[uploaded,name2.png,100/82/82/100,-,data:image/png;base64,http://url/name2.png]' ] );
			}, 3 );

			loader.upload( 'http:\/\/url\/' );

			assert.areSame( 'http:\/\/url\/', loader.uploadUrl );

			wait();
		},

		'test upload with custom field name (#13518)': function() {
			var loader = new FileLoader( editorMock, pngBase64, 'name.png' );

			attachListener( editorMock, 'fileUploadRequest', function( evt ) {
				var requestData = evt.data.requestData;

				requestData.myFile = requestData.upload;

				delete requestData.upload;
			} );

			createXMLHttpRequestMock( [ 'load' ] );

			resumeAfter( loader, 'uploaded', function() {
				assert.isTrue( lastFormData.has( 'myFile' ) );
				assert.isFalse( lastFormData.has( 'upload' ) );

				// FormData converts all Blob objects into File ones, so we must "revert" it
				objectAssert.areEqual( new Blob( [ lastFormData.get( 'myFile' ) ], {} ), loader.file );
			}, 3 );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test upload with additional request parameters provided (#13518)': function() {
			var loader = new FileLoader( editorMock, pngBase64, 'name.png' );

			createXMLHttpRequestMock( [ 'load' ] );

			resumeAfter( loader, 'uploaded', function() {
				assert.areSame( 'test', lastFormData.get( 'test' ) );
			}, 3 );

			loader.upload( 'http:\/\/url\/', { test: 'test' } );

			wait();
		},

		'test if name of file is correctly attached (#13518)': function() {
			var name = 'customName.png',
				loader = new FileLoader( editorMock, pngBase64, name );

			createXMLHttpRequestMock( [ 'load' ] );

			resumeAfter( loader, 'uploaded', function() {
				assert.areSame( name, lastFormData.get( 'upload' ).name );
			}, 3 );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test upload response not encoded (#13030)': function() {
			var loader = new FileLoader( editorMock, pngBase64, 'na me.png' ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ], {
				responseText: '{"fileName":"na me2.png","uploaded":1,"url":"http:\/\/url\/na me2.png"}'
			} );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'uploading[uploading,na me.png,0/82/82/null,-,data:image/png;base64,-]',
					'update[uploading,na me.png,0/82/82/null,-,data:image/png;base64,-]',
					'update[uploading,na me.png,41/82/82/100,-,data:image/png;base64,-]',
					'update[uploading,na me.png,41/82/82/100,-,data:image/png;base64,-]',
					'uploaded[uploaded,na me2.png,100/82/82/100,-,data:image/png;base64,http://url/na me2.png]',
					'update[uploaded,na me2.png,100/82/82/100,-,data:image/png;base64,http://url/na me2.png]' ] );
			}, 3 );

			loader.upload( 'http:\/\/url\/' );

			assert.areSame( 'http:\/\/url\/', loader.uploadUrl );

			wait();
		},

		'test loadAndUpload': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'uploading[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,41/82/82/100,-,result,-]',
					'update[uploading,name.png,41/82/82/100,-,result,-]',
					'uploaded[uploaded,name2.png,100/82/82/100,-,result,http://url/name2.png]',
					'update[uploaded,name2.png,100/82/82/100,-,result,http://url/name2.png]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on create': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'abort[abort,name.png,0/0/82/null,-,-,-]',
					'update[abort,name.png,0/0/82/null,-,-,-]' ] );
			} );

			loader.abort();

			wait();
		},

		'test abort on loading': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'abort[abort,name.png,0/0/82/null,-,-,-]',
					'update[abort,name.png,0/0/82/null,-,-,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on loading2': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'abort[abort,name.png,0/41/82/null,-,-,-]',
					'update[abort,name.png,0/41/82/null,-,-,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on loaded': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'load', abort ] );

			resumeAfter( loader, 'loaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'loaded[loaded,name.png,0/82/82/null,-,result,-]',
					'update[loaded,name.png,0/82/82/null,-,result,-]' ] );
			} );

			loader.load();

			wait();
		},

		'test abort on uploading': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'uploading[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,0/82/82/null,-,result,-]',
					'abort[abort,name.png,0/82/82/null,-,result,-]',
					'update[abort,name.png,0/82/82/null,-,result,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on uploading 2': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'uploading[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,41/82/82/100,-,result,-]',
					'abort[abort,name.png,41/82/82/100,-,result,-]',
					'update[abort,name.png,41/82/82/100,-,result,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on uploaded': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'load', abort ] );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'uploading[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,41/82/82/100,-,result,-]',
					'update[uploading,name.png,41/82/82/100,-,result,-]',
					'uploaded[uploaded,name2.png,100/82/82/100,-,result,http://url/name2.png]',
					'update[uploaded,name2.png,100/82/82/100,-,result,http://url/name2.png]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test abort on error': function() {
			editorMock.lang = { filetools: { loadError: 'errorMsg' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', 'error', abort ] );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'error[error,name.png,0/41/82/null,errorMsg,-,-]',
					'update[error,name.png,0/41/82/null,errorMsg,-,-]' ] );
			} );

			loader.load();

			wait();
		},

		'test abort on abort (abort twice)': function() {
			editorMock.lang = { filetools: { loadError: 'errorMsg' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				abort = function() {
					loader.abort();
				};

			createFileReaderMock( [ 'progress', abort, abort ] );

			resumeAfter( loader, 'abort', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'abort[abort,name.png,0/41/82/null,-,-,-]',
					'update[abort,name.png,0/41/82/null,-,-,-]' ] );
			} );

			loader.load();

			wait();
		},

		'test error on load': function() {
			editorMock.lang = { filetools: { loadError: 'loadError' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'error' ] );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'error[error,name.png,0/41/82/null,loadError,-,-]',
					'update[error,name.png,0/41/82/null,loadError,-,-]' ] );
			} );

			loader.load();

			wait();
		},

		'test error on upload': function() {
			editorMock.lang = { filetools: { networkError: 'networkError' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'error' ] );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'uploading[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,0/82/82/null,-,result,-]',
					'update[uploading,name.png,41/82/82/100,-,result,-]',
					'error[error,name.png,41/82/82/100,networkError,result,-]',
					'update[error,name.png,41/82/82/100,networkError,result,-]' ] );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test error no url': function() {
			editorMock.lang = { filetools: { noUrlError: 'noUrlError' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'error' ] );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'loading[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/0/82/null,-,-,-]',
					'update[loading,name.png,0/41/82/null,-,-,-]',
					'error[error,name.png,0/82/82/null,noUrlError,result,-]',
					'update[error,name.png,0/82/82/null,noUrlError,result,-]' ] );
			} );

			loader.loadAndUpload();

			wait();
		},

		'test error incorrect response': function() {
			editorMock.lang = { filetools: { responseError: 'responseError' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ], { responseText: 'incorrect' } );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'error[error,name.png,100/0/82/100,responseError,-,-]',
					'update[error,name.png,100/0/82/100,responseError,-,-]' ] );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test error in response': function() {
			editorMock.lang = { filetools: { responseError: 'responseError %1' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ],
				{ responseText: '{' +
					'"fileName":"name2.png",' +
					'"uploaded":0,' +
					'"url":"http:\/\/url\/name2.png",' +
					'"error":{' +
						'"message":"errorFromServer"' +
					'}' +
				'}' } );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'error[error,name.png,100/0/82/100,errorFromServer,-,-]',
					'update[error,name.png,100/0/82/100,errorFromServer,-,-]' ] );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test response with message': function() {
			editorMock.lang = { filetools: { responseError: 'responseError %1' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ],
				{ responseText: '{' +
					'"fileName":"name2.png",' +
					'"uploaded":1,' +
					'"url":"http:\/\/url\/name2.png",' +
					'"error":{' +
						'"message":"messageFromServer"' +
					'}' +
				'}' } );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'uploaded[uploaded,name2.png,100/0/82/100,messageFromServer,-,http://url/name2.png]',
					'update[uploaded,name2.png,100/0/82/100,messageFromServer,-,http://url/name2.png]' ] );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test error 404 with message': function() {
			editorMock.lang = { filetools: { httpError404: 'httpError404' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ], { responseStatus: 404 } );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'error[error,name.png,100/0/82/100,httpError404,-,-]',
					'update[error,name.png,100/0/82/100,httpError404,-,-]' ] );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test error 404 general message': function() {
			editorMock.lang = { filetools: { httpError: 'httpError %1' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ], { responseStatus: 404 } );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'error[error,name.png,100/0/82/100,httpError 404,-,-]',
					'update[error,name.png,100/0/82/100,httpError 404,-,-]' ] );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test upload ok on status 202': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ], { responseStatus: 202 } );

			resumeAfter( loader, 'uploaded', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'uploaded[uploaded,name2.png,100/0/82/100,-,-,http://url/name2.png]',
					'update[uploaded,name2.png,100/0/82/100,-,-,http://url/name2.png]' ] );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test update': function() {
			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				update = function() {
					loader.update();
				};

			createXMLHttpRequestMock( [ 'progress', update, 'load', update ] );

			resumeAfter( loader, 'uploaded', function() {
				// Wait for all update events.
				wait( function() {
					observer.assert( [
						'update[created,name.png,0/0/82/null,-,-,-]',
						'uploading[uploading,name.png,0/0/82/null,-,-,-]',
						'update[uploading,name.png,0/0/82/null,-,-,-]',
						'update[uploading,name.png,41/0/82/100,-,-,-]',
						'update[uploading,name.png,41/0/82/100,-,-,-]',
						'update[uploading,name.png,41/0/82/100,-,-,-]',
						'uploaded[uploaded,name2.png,100/0/82/100,-,-,http://url/name2.png]',
						'update[uploaded,name2.png,100/0/82/100,-,-,http://url/name2.png]',
						'update[uploaded,name2.png,100/0/82/100,-,-,http://url/name2.png]' ] );
				}, 5 );
			} );

			loader.update();
			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test additional data passed to xhr via fileUploadRequest listener (#13518)': function() {
			var loader = new FileLoader( editorMock, testFile ),
				file = new File( [], 'a' );

			attachListener( editorMock, 'fileUploadRequest', function( evt ) {
				var requestData = evt.data.requestData;

				requestData.customField = 'test';
				requestData.customFile = file;
			} );

			createXMLHttpRequestMock( [ 'load' ] );

			resumeAfter( loader, 'uploaded', function() {
				assert.areSame( 'test', lastFormData.get( 'customField' ) );
				objectAssert.areEqual( file, lastFormData.get( 'customFile' ) );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test additional data in fileUploadResponse (#13519)': function() {
			var data,
				loader = new FileLoader( editorMock, testFile );

			createXMLHttpRequestMock( [ 'progress', 'load' ],
				{ responseText: '{' +
					'"fileName":"name2.png",' +
					'"uploaded":1,' +
					'"url":"http:\/\/url\/name2.png",' +
					'"foo":"bar"' +
				'}' } );

			attachListener( editorMock, 'fileUploadResponse', function( evt ) {
				data = evt.data;
			} );

			resumeAfter( editorMock, 'fileUploadResponse', function() {
				assert.areSame( 'bar', data.foo );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test custom fileUploadRequest and fileUploadResponse': function() {
			editorMock.lang = { filetools: { responseError: 'err' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader ),
				sendRequestCounter = 0,
				handleResponseCounter = 0;

			attachListener( editorMock, 'fileUploadRequest', function( evt ) {
				sendRequestCounter++;

				evt.data.fileLoader.xhr.send( 'custom form' );
				evt.stop();
			} );

			attachListener( editorMock, 'fileUploadResponse', function( evt ) {
				handleResponseCounter++;

				var response = evt.data.fileLoader.xhr.responseText.split( '|' );

				evt.data.fileName = response[ 0 ];
				evt.data.url = response[ 1 ];
				evt.data.message = response[ 2 ];
				evt.stop();
			} );

			createXMLHttpRequestMock( [ 'progress', 'load' ],
				{ responseText: 'customName.png|customUrl|customMessage' } );

			resumeAfter( loader, 'uploaded', function() {
				assert.areSame( 1, sendRequestCounter, 'sendRequestCounter' );
				assert.areSame( 1, handleResponseCounter, 'handleResponseCounter' );
				assert.areSame( 'custom form', lastFormData );

				observer.assert( [
					'uploading[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'uploaded[uploaded,customName.png,100/0/82/100,customMessage,-,customUrl]',
					'update[uploaded,customName.png,100/0/82/100,customMessage,-,customUrl]' ] );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test cancel fileUploadRequest': function() {
			editorMock.lang = { filetools: { responseError: 'err' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			attachListener( editorMock, 'fileUploadRequest', function( evt ) {
				evt.cancel();
			} );

			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			loader.upload( 'http:\/\/url\/' );

			observer.assert( [] );
		},


		'test cancel fileUploadResponse': function() {
			editorMock.lang = { filetools: { responseError: 'err' } };

			var loader = new FileLoader( editorMock, testFile ),
				observer = observeEvents( loader );

			attachListener( editorMock, 'fileUploadResponse', function( evt ) {
				evt.cancel();
			} );

			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			resumeAfter( loader, 'error', function() {
				observer.assert( [
					'uploading[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,0/0/82/null,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'update[uploading,name.png,41/0/82/100,-,-,-]',
					'error[error,name.png,100/0/82/100,-,-,-]',
					'update[error,name.png,100/0/82/100,-,-,-]' ] );
			} );

			loader.upload( 'http:\/\/url\/' );

			wait();
		},

		'test xhr property': function() {
			var loader = new FileLoader( editorMock, testFile ),
				report = '';

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			function listener() {
				if ( loader.xhr ) {
					report += '+';
				} else {
					report += '-';
				}
			}

			loader.on( 'loading', listener );
			loader.on( 'loaded', listener );
			loader.on( 'uploading', listener );
			loader.on( 'uploaded', listener );

			resumeAfter( loader, 'uploaded', function() {
				assert.areSame( '-++', report );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test reader property': function() {
			var loader = new FileLoader( editorMock, testFile ),
				report = '';

			createFileReaderMock( [ 'progress', 'load' ] );
			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			function listener() {
				if ( loader.reader ) {
					report += '+';
				} else {
					report += '-';
				}
			}

			loader.on( 'loading', listener );
			loader.on( 'loaded', listener );
			loader.on( 'uploading', listener );
			loader.on( 'uploaded', listener );

			resumeAfter( loader, 'uploaded', function() {
				assert.areSame( '+++', report );
			} );

			loader.loadAndUpload( 'http:\/\/url\/' );

			wait();
		},

		'test isFinished created': function() {
			var loader = new FileLoader( editorMock, testFile );
			loader.status = 'created';

			assert.isFalse( loader.isFinished() );
		},

		'test isFinished loading': function() {
			var loader = new FileLoader( editorMock, testFile );
			loader.status = 'loading';

			assert.isFalse( loader.isFinished() );
		},

		'test isFinished loaded': function() {
			var loader = new FileLoader( editorMock, testFile );
			loader.status = 'loaded';

			assert.isTrue( loader.isFinished() );
		},

		'test isFinished uploading': function() {
			var loader = new FileLoader( editorMock, testFile );
			loader.status = 'uploading';

			assert.isFalse( loader.isFinished() );
		},

		'test isFinished uploaded': function() {
			var loader = new FileLoader( editorMock, testFile );
			loader.status = 'uploaded';

			assert.isTrue( loader.isFinished() );
		},

		'test isFinished error': function() {
			var loader = new FileLoader( editorMock, testFile );
			loader.status = 'error';

			assert.isTrue( loader.isFinished() );
		},

		'test isFinished abort': function() {
			var loader = new FileLoader( editorMock, testFile );
			loader.status = 'abort';

			assert.isTrue( loader.isFinished() );
		}
	} );
} )();
