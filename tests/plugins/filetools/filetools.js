/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: filetools */

'use strict';

( function() {
	var getUploadUrl;

	bender.test( {
		'setUp': function() {
			getUploadUrl = CKEDITOR.filetools.getUploadUrl;
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
		}
	} );
} )();
