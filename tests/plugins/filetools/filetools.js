/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: filetools */

'use strict';

( function() {
	var getUploadUrl, isExtentionSupported;

	bender.test( {
		'setUp': function() {
			getUploadUrl = CKEDITOR.filetools.getUploadUrl;
			isExtentionSupported = CKEDITOR.filetools.isExtentionSupported;
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
				'filebrowserUploadUrl': 'filebrowserUploadUrl',
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
	} );
} )();
