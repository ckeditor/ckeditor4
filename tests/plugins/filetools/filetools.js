/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: filetools */

'use strict';

( function() {
	var getUploadUrl, isExtentionSupported, getExtention;

	bender.editor = {
		config: {
			extraPlugins: 'filetools'
		}
	};

	bender.test( {
		'setUp': function() {
			getUploadUrl = CKEDITOR.filetools.getUploadUrl;
			isExtentionSupported = CKEDITOR.filetools.isExtentionSupported;
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

		'test isExtentionSupported 1': function() {
			assert.isTrue( isExtentionSupported( { name: 'foo.jpg' } ) );
		},

		'test isExtentionSupported 2': function() {
			assert.isTrue( isExtentionSupported( { name: 'foo.jpg' }, [ 'png', 'jpg', 'gif' ] ) );
		},

		'test isExtentionSupported 3': function() {
			assert.isFalse( isExtentionSupported( { name: 'foo.jpg' }, [ 'png', 'gif' ] ) );
		},

		'test getExtention 1': function() {
			assert.areSame( '', getExtention( 'foo' ) );
		},

		'test getExtention 2': function() {
			assert.areSame( '', getExtention( 'foo.' ) );
		},

		'test getExtention 3': function() {
			assert.areSame( '', getExtention( '.foo' ) );
		},

		'test getExtention 4': function() {
			assert.areSame( 'bar', getExtention( 'foo.bar' ) );
		},

		'test getExtention 5': function() {
			assert.areSame( 'bom', getExtention( 'foo.bar.bom' ) );
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
