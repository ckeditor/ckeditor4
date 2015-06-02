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

			// Reset uploadsRepository.
			this.editor.uploadsRepository.loaders = [];
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
			try {
				getUploadUrl( {} );
				assert.fail( 'getUploadUrl should throw error if no matching configuration option was found.' );
			} catch ( err ) {
				assert.areSame( 'Upload URL is not defined.', err );
			}
		},

		'test isTypeSupported 1': function() {
			assert.isTrue( isTypeSupported( { type: 'image/jpeg' }, /image\/(png|jpeg|gif)/ ) );
		},

		'test isTypeSupported 2': function() {
			assert.isFalse( isTypeSupported( { type: 'image/jpeg' }, /image\/(png|gif)/ ) );
		},

		'test UploadsRepository': function() {
			var repository = this.editor.uploadsRepository;

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


		'test UploadsRepository instanceCreated event': function() {
			var repository = this.editor.uploadsRepository,
				listener = sinon.spy();

			repository.on( 'instanceCreated', listener );

			var loader = repository.create( { name: 'foo' } );

			assert.isTrue( listener.calledOnce, 'Should be called once.' );
			assert.areSame( loader, listener.firstCall.args[ 0 ].data, 'Should be called with loader.' );
		},

		'test UploadsRepository isFinished': function() {
			var repository = this.editor.uploadsRepository;


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
			var log = window.console && sinon.stub( window.console, 'log' );

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

			log && log.restore();

			assert.areEqual( data.message, error );
			assert.isTrue( log ? log.calledWith( message ) : true );
		}
	} );
} )();
