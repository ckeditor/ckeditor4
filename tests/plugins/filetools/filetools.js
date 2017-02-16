/* bender-tags: editor,unit,clipboard,filetools */
/* bender-ckeditor-plugins: filetools,clipboard */

'use strict';

( function() {
	var getUploadUrl, isTypeSupported, getExtention;

	bender.editor = {
		config: {
			extraPlugins: 'filetools,clipboard'
		}
	};

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			getUploadUrl = CKEDITOR.fileTools.getUploadUrl;
			isTypeSupported = CKEDITOR.fileTools.isTypeSupported;
			getExtention = CKEDITOR.fileTools.getExtention;

			// Reset uploadRepository.
			this.editor.uploadRepository.loaders = [];
		},

		'test getUploadUrl 1': function() {
			var uploadUrl = getUploadUrl( {
				'filebrowserUploadUrl': 'filebrowserUploadUrl',
				'filebrowserImageUploadUrl': 'filebrowserImageUploadUrl',
				'imageUploadUrl': 'imageUploadUrl',
				'uploadUrl': 'uploadUrl'
			}, 'image' );

			assert.areSame( 'imageUploadUrl', uploadUrl );
		},

		'test getUploadUrl 2': function() {
			var uploadUrl = getUploadUrl( {
				'filebrowserUploadUrl': 'filebrowserUploadUrl',
				'filebrowserImageUploadUrl': 'filebrowserImageUploadUrl',
				'uploadUrl': 'uploadUrl'
			}, 'image' );

			assert.areSame( 'uploadUrl', uploadUrl );
		},

		'test getUploadUrl 3': function() {
			var uploadUrl = getUploadUrl( {
				'filebrowserUploadUrl': 'filebrowserUploadUrl',
				'filebrowserImageUploadUrl': 'filebrowserImageUploadUrl'
			}, 'image' );

			assert.areSame( 'filebrowserImageUploadUrl&responseType=json', uploadUrl );
		},

		'test getUploadUrl 4': function() {
			var uploadUrl = getUploadUrl( {
				'filebrowserUploadUrl': 'filebrowserUploadUrl'
			}, 'image' );

			assert.areSame( 'filebrowserUploadUrl&responseType=json', uploadUrl );
		},

		'test getUploadUrl 5': function() {
			var uploadUrl = getUploadUrl( {
				'imageUploadUrl': 'imageUploadUrl'

			}, 'image' );

			assert.areSame( 'imageUploadUrl', uploadUrl );
		},

		'test getUploadUrl 6': function() {
			var uploadUrl = getUploadUrl( {
				'filebrowserUploadUrl': 'filebrowserUploadUrl',
				'filebrowserImageUploadUrl': 'filebrowserImageUploadUrl',
				'imageUploadUrl': 'imageUploadUrl',
				'uploadUrl': 'uploadUrl'
			} );

			assert.areSame( 'uploadUrl', uploadUrl );
		},

		'test getUploadUrl 7': function() {
			var uploadUrl = getUploadUrl( {
				'filebrowserUploadUrl': 'filebrowserUploadUrl',
				'filebrowserImageUploadUrl': 'filebrowserImageUploadUrl'
			} );

			assert.areSame( 'filebrowserUploadUrl&responseType=json', uploadUrl );
		},

		'test getUploadUrl - throw error if no matching config': function() {
			var uploadUrl = getUploadUrl( {} );

			assert.isNull( uploadUrl, 'null returned when none of upload URLs is defined' );
		},

		'test isTypeSupported 1': function() {
			assert.isTrue( isTypeSupported( { type: 'image/jpeg' }, /image\/(png|jpeg|gif)/ ) );
		},

		'test isTypeSupported 2': function() {
			assert.isFalse( isTypeSupported( { type: 'image/jpeg' }, /image\/(png|gif)/ ) );
		},

		'test UploadRepository': function() {
			var repository = this.editor.uploadRepository;

			assert.areSame( 0, repository.loaders.length );
			assert.isUndefined( repository.loaders[ 0 ] );

			var loader1 = repository.create( { name: 'name1' } );

			assert.areSame( 0, loader1.id );
			assert.areSame( 'name1', loader1.fileName );

			assert.areSame( 1, repository.loaders.length );
			assert.areSame( 'name1', repository.loaders[ 0 ].fileName );
			assert.isUndefined( repository.loaders[ 1 ] );

			var loader2 = repository.create( { name: 'name2' } );

			assert.areSame( 1, loader2.id );
			assert.areSame( 'name2', loader2.fileName );

			assert.areSame( 2, repository.loaders.length );
			assert.areSame( 'name1', repository.loaders[ 0 ].fileName );
			assert.areSame( 'name2', repository.loaders[ 1 ].fileName );
			assert.isUndefined( repository.loaders[ 2 ] );
		},


		'test UploadRepository instanceCreated event': function() {
			var repository = this.editor.uploadRepository,
				listener = sinon.spy();

			repository.on( 'instanceCreated', listener );

			var loader = repository.create( { name: 'foo' } );

			assert.isTrue( listener.calledOnce, 'Should be called once.' );
			assert.areSame( loader, listener.firstCall.args[ 0 ].data, 'Should be called with loader.' );
		},

		'test UploadRepository isFinished': function() {
			var repository = this.editor.uploadRepository;


			repository.create( { name: 'foo1' } );
			repository.create( { name: 'foo2' } );
			repository.create( { name: 'foo3' } );

			assert.isFalse( repository.isFinished(), '0/3' );

			sinon.stub( repository.loaders[ 0 ], 'isFinished' ).returns( true );

			assert.isFalse( repository.isFinished(), '1/3' );

			sinon.stub( repository.loaders[ 2 ], 'isFinished' ).returns( true );

			assert.isFalse( repository.isFinished(), '2/3' );

			sinon.stub( repository.loaders[ 1 ], 'isFinished' ).returns( true );

			assert.isTrue( repository.isFinished(), '3/3' );
		},

		'test fileUploadResponse event': function() {
			var log = sinon.stub( CKEDITOR, 'warn' );

			var message = 'Not a JSON';
			var error = 'Error.';

			// Mock.
			var data = {
				fileLoader: {
					xhr: {
						responseText: message
					},

					lang: {
						filetools: {
							responseError: error
						}
					}
				}
			};

			this.editor.fire( 'fileUploadResponse', data );

			log.restore();

			assert.areEqual( data.message, error );
			assert.areEqual( message, log.firstCall.args[ 1 ].responseText, 'responseText should match' );
		},

		'test CSRF token appending': function() {
			var appendSpy = sinon.spy( FormData.prototype, 'append' );

			var fileLoaderMock = {
				fileLoader: {
					file: Blob ? new Blob() : '',
					fileName: 'fileName',
					xhr: {
						open: function() {},
						send: function() {
							resume( function() {
								assert.isTrue(
									appendSpy.lastCall.calledWithExactly( 'ckCsrfToken', CKEDITOR.tools.getCsrfToken() ),
									'FormData.append called with proper arguments'
								);
							} );
						}
					}
				},
				requestData: {}
			};

			this.editor.fire( 'fileUploadRequest',  fileLoaderMock );
			wait();
		},

		'test ensure onAbort is called (#13812)': function() {
			var file;

			// Fire this to fail the test if loader.abort() is never called.
			var timeout = setTimeout( function() {
				resume( function() {
					assert.isTrue( false );
				} );
			}, 700 );

			// Some browsers (e.g. IE) expose the old BlobBuilder API and throw an exception when trying to create a Blob directly.
			if ( window.MSBlobBuilder ) {
				var blobBuilder = new window.MSBlobBuilder();
				blobBuilder.append( new Uint8Array( 8 ) );
				file = blobBuilder.getBlob( 'text/plain' );
			} else {
				file  = new Blob( new Uint8Array( 8 ), { type: 'text/plain' } );
			}

			var loader = this.editor.uploadRepository.create( file );

			loader.on( 'update', function() {
				if ( loader.status == 'abort' ) {
					resume( function() {
						clearTimeout( timeout );
						assert.isTrue( true );
					} );
				}
			} );
			loader.upload( '/foo/upload' );
			loader.abort();

			wait();
		}
	} );
} )();
