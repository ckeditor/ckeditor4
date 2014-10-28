/* bender-tags: editor,unit,clipboard */
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
		'setUp': function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			getUploadUrl = CKEDITOR.filetools.getUploadUrl;
			isTypeSupported = CKEDITOR.filetools.isTypeSupported;
			getExtention = CKEDITOR.filetools.getExtention;
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
			assert.isTrue( isTypeSupported( { type: 'image/jpeg' } ) );
		},

		'test isTypeSupported 2': function() {
			assert.isTrue( isTypeSupported( { type: 'image/jpeg' }, /image\/(png|jpeg|gif)/ ) );
		},

		'test isTypeSupported 3': function() {
			assert.isFalse( isTypeSupported( { type: 'image/jpeg' }, /image\/(png|gif)/ ) );
		},

		'test UploadsRepository': function() {
			var repository = this.editor.uploadsRepository;

			assert.areSame( 0, repository._.loaders.length );
			assert.isUndefined( repository.get( 0 ) );

			var loader1 = repository.create( { name: 'name1' } );

			assert.areSame( 0, loader1.id );
			assert.areSame( 'name1', loader1.fileName );

			assert.areSame( 1, repository._.loaders.length );
			assert.areSame( 'name1', repository.get( 0 ).fileName );
			assert.isUndefined( repository.get( 1 ) );

			var loader2 = repository.create( { name: 'name2' } );

			assert.areSame( 1, loader2.id );
			assert.areSame( 'name2', loader2.fileName );

			assert.areSame( 2, repository._.loaders.length );
			assert.areSame( 'name1', repository.get( 0 ).fileName );
			assert.areSame( 'name2', repository.get( 1 ).fileName );
			assert.isUndefined( repository.get( 2 ) );
		}
	} );
} )();
