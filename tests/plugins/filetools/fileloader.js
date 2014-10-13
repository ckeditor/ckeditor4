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
					readAsDataURL: function( file ) {
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
												reader.result = 'foo';
												evt = { target: { result: 'foo' } };
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
				}

			return reader;
		}
	}

	function XMLHttpRequestMock() {
	}

	function observeEvents( loader ) {
		var observer = { events: '' };

		function stdObserver( evt ) {
			var message = evt.message || '-',
				data = loader.data || '-'


			observer.events += evt.name + '[' + loader.status + ',' +
				loader.loaded + '/' + loader.total + ',' +
				message  + ',' + data + '],';
		}

		loader.on( 'abort', stdObserver );
		loader.on( 'error', stdObserver );
		loader.on( 'loading', stdObserver );
		loader.on( 'loaded', stdObserver );
		loader.on( 'uploading', stdObserver );
		loader.on( 'uploaded', stdObserver );
		loader.on( 'update', stdObserver );

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
				loader = new FileLoader( fileMock, 'bar' ),
				observer = observeEvents( loader );

			createFileReaderMock( [ 'progress', 'load' ] );

			loader.load();

			wait( function() {
				assert.areSame(
					'loading[loading,0/100,-,-],' +
					'update[loading,0/100,-,-],' +
					'update[loading,50/100,-,-],' +
					'loaded[loaded,100/100,-,foo],' +
					'update[loaded,100/100,-,foo],'
					, observer.events );
			}, 3 );
		}
	} );
} )();