/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: filetools */

'use strict';

( function() {
	var FileReaderBackup, XMLHttpRequestBackup,
		FileLoader,
		pngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAAABJRU5ErkJggg==";

	function FileReaderMock() {
		return {
			readAsDataURL: function( file ) {
			}
		}
	}

	function XMLHttpRequestMock() {
	}

	bender.test( {
		'setUp': function() {
			FileReaderBackup = window.FileReader;
			XMLHttpRequestBackup = window.XMLHttpRequest;

			window.FileReader = FileReaderMock;
			window.XMLHttpRequest = XMLHttpRequestMock;

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
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		},

		'test constructor string, filename': function() {
			var loader = new FileLoader( pngBase64, 'foo' );

			assert.areSame( 'foo', loader.fileName );
			assert.areSame( pngBase64, loader.data );
			assert.isObject( loader.file );
			assert.areSame( 82, loader.total );
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
			assert.areSame( 0, loader.uploaded );
			assert.areSame( 'created', loader.status );
		}
	} );
} )();