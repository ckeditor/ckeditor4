/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: filetools */

'use strict';

( function() {
	var FileReaderBackup = window.FileReader,
		XMLHttpRequestBackup = window.XMLHttpRequest,
		FileLoader,
		pngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAAABJRU5ErkJggg==";

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
												evt = { loaded: 50 };
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
												evt = { loaded: 50 };
												break;
											case 'load':
												xhr.status = 200;
												xhr.responseText = '{"fileName":"name2.jpg","uploaded":1,"url":"http:\/\/url\/name2.jpg"}'
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
				data = loader.data || '-';

				if ( data.length > 21 )
					data = data.substring( 0, 21 );


			observer.events += evt.name + '[' + loader.status + ',' + loader.fileName + ',' +
				loader.uploaded + '/' + loader.loaded + '/' + loader.total + ',' +
				message  + ',' + data + ']|';
		}

		loader.on( 'loading', stdObserver );
		loader.on( 'loaded', stdObserver );

		loader.on( 'uploading', stdObserver );
		loader.on( 'uploaded', stdObserver );
		loader.on( 'uploaded', function() {
			observer.events += '[' + loader.url + ']|';
			observer.events = observer.events.replace( ']|[', ',' );
		} );

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
			var fileMock = { name: 'foo', size: 100 },
				loader = new FileLoader( fileMock );

			assert.areSame( 'foo', loader.fileName );
			assert.isNull( loader.data );
			assert.isObject( loader.file );
			assert.areSame( 100, loader.total );
			assert.areSame( 0, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor file, filename': function() {
			var fileMock = { name: 'foo', size: 100 },
				loader = new FileLoader( fileMock, 'bar' );

			assert.areSame( 'bar', loader.fileName );
			assert.isNull( loader.data );
			assert.isObject( loader.file );
			assert.areSame( 100, loader.total );
			assert.areSame( 0, loader.loaded );
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test load': function() {
			var fileMock = { size: 100 },
				loader = new FileLoader( fileMock, 'name.jpg' ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );

			loader.load();

			wait( function() {
				observer.assert( [
					'loading[loading,name.jpg,0/0/100,-,-]',
					'update[loading,name.jpg,0/0/100,-,-]',
					'update[loading,name.jpg,0/50/100,-,-]',
					'loaded[loaded,name.jpg,0/100/100,-,result]',
					'update[loaded,name.jpg,0/100/100,-,result]' ] );
			}, 3 );
		},



		'test upload': function() {
			var fileMock = { size: 100 },
				loader = new FileLoader( pngBase64, 'name.jpg' ),
				observer = observeEvents( loader );

			createXMLHttpRequestMock( [ 'progress', 'load' ] );

			loader.upload( 'http:\/\/url\/' );

			wait( function() {
				observer.assert( [
					'uploading[uploading,name.jpg,0/82/82,-,data:image/png;base64]',
					'update[uploading,name.jpg,0/82/82,-,data:image/png;base64]',
					'update[uploading,name.jpg,50/82/82,-,data:image/png;base64]',
					'uploaded[uploaded,name2.jpg,82/82/82,-,data:image/png;base64,http://url/name2.jpg]',
					'update[uploaded,name2.jpg,82/82/82,-,data:image/png;base64]' ] );
			}, 3 );
		}
	} );
} )();