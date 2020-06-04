/* bender-tags: editor,clipboard,widget */
/* bender-ckeditor-plugins: uploadwidget,uploadimage,toolbar,image */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js */
/* bender-include: _helpers/waitForImage.js */
/* global pasteFiles, waitForImage */

'use strict';

bender.editors = {
	noConfig: {
		name: 'noConfig',
		creator: 'inline',
		config: {
			extraPlugins: 'uploadfile'
		}
	},
	uploadfile: {
		name: 'uploadfile',
		creator: 'inline',
		config: {
			extraPlugins: 'uploadfile',
			uploadUrl: 'http://foo/upload'
		}
	},
	uploadfileAndUploadimage: {
		name: 'uploadfileAndUploadimage',
		creator: 'replace',
		config: {
			extraPlugins: 'uploadfile,uploadimage,image',
			uploadUrl: 'http://foo/upload',
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null
		}
	},
	disposableEditor: {
		name: 'disposableEditor',
		creator: 'inline',
		config: {
			extraPlugins: 'uploadfile',
			uploadUrl: 'http://foo/upload'
		}
	},
	notificationDisposableEditor: {
		name: 'notificationDisposableEditor',
		creator: 'inline',
		config: {
			extraPlugins: 'uploadfile',
			uploadUrl: 'http://foo/upload'
		}
	}
};

var uploadCount, loadAndUploadCount, lastUploadUrl, resumeAfter,
	IMG_URL = '%BASE_PATH%_assets/logo.png';

bender.test( {
	init: function() {
		resumeAfter = bender.tools.resumeAfter;

		CKEDITOR.fileTools.fileLoader.prototype.loadAndUpload = function( url ) {
			loadAndUploadCount++;
			lastUploadUrl = url;

			this.responseData = {};
		};

		CKEDITOR.fileTools.fileLoader.prototype.load = function() {};

		CKEDITOR.fileTools.fileLoader.prototype.upload = function( url ) {
			uploadCount++;
			lastUploadUrl = url;

			this.responseData = {};
		};
	},

	setUp: function() {
		bender.tools.ignoreUnsupportedEnvironment( 'uploadfile' );

		var editorName;

		uploadCount = 0;
		loadAndUploadCount = 0;

		for ( editorName in this.editors ) {
			// Clear upload repository.
			this.editors[ editorName ].uploadRepository.loaders = [];
		}

		if ( CKEDITOR.fileTools.bindNotifications.reset ) {
			CKEDITOR.fileTools.bindNotifications.reset();
		}
	},

	'test with no config': function() {
		var editor = this.editors.noConfig;

		pasteFiles( editor, [ bender.tools.getTestTxtFile() ] );

		assert.areSame( 0, editor.editable().find( 'a[data-widget="uploadfile"]' ).count() );
	},

	'test with uploadfile plugin': function() {
		var editor = this.editors.uploadfile,
			rng = editor.createRange();

		// Fix possible case, when there might be no ranges in Firefox 66 (#2971).
		rng.setStartAt( editor.editable().getFirst(), CKEDITOR.POSITION_AFTER_START );
		rng.select();

		pasteFiles( editor, [ bender.tools.getTestTxtFile() ] );

		assert.areSame( 1, editor.editable().find( 'a[data-widget="uploadfile"]' ).count() );
		assert.areSame( '', editor.getData(), 'getData on loading.' );

		var loader = editor.uploadRepository.loaders[ 0 ];

		loader.data = bender.tools.txtBase64;
		loader.uploadTotal = 10;
		loader.changeStatus( 'uploading' );

		assert.areSame( 1, editor.editable().find( 'a[data-widget="uploadfile"]' ).count() );
		assert.areSame( '', editor.getData(), 'getData on uploading.' );

		loader.url = '%BASE_PATH%_assets/sample.txt';
		loader.changeStatus( 'uploaded' );

		assert.sameData( '<p><a href="%BASE_PATH%_assets/sample.txt" target="_blank">name.txt</a></p>', editor.getData() );
		assert.areSame( 0, editor.editable().find( 'a[data-widget="uploadfile"]' ).count() );

		assert.areSame( 1, loadAndUploadCount );
		assert.areSame( 0, uploadCount );
		assert.areSame( 'http://foo/upload', lastUploadUrl );
	},

	'test pasting files in the editor with uploadfile and uploadimage plugins': function() {
		var editor = this.editors.uploadfileAndUploadimage;

		pasteFiles( editor, [ bender.tools.getTestTxtFile() ] );

		assert.areSame( 1, editor.editable().find( 'a[data-widget="uploadfile"]' ).count() );
		assert.areSame( '', editor.getData(), 'getData on loading.' );

		var loader = editor.uploadRepository.loaders[ 0 ];

		loader.data = bender.tools.txtBase64;
		loader.uploadTotal = 10;
		loader.changeStatus( 'uploading' );

		assert.areSame( 1, editor.editable().find( 'a[data-widget="uploadfile"]' ).count() );
		assert.areSame( '', editor.getData(), 'getData on uploading.' );

		loader.url = '%BASE_PATH%_assets/sample.txt';
		loader.changeStatus( 'uploaded' );

		assert.sameData( '<p><a href="%BASE_PATH%_assets/sample.txt" target="_blank">name.txt</a></p>', editor.getData() );
		assert.areSame( 0, editor.editable().find( 'a[data-widget="uploadfile"]' ).count() );

		assert.areSame( 1, loadAndUploadCount );
		assert.areSame( 0, uploadCount );
		assert.areSame( 'http://foo/upload', lastUploadUrl );
	},

	'test pasting images in the editor with uploadfile and uploadimage plugins': function() {
		var editor = this.editors.uploadfileAndUploadimage;

		pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

		assert.areSame( 1, editor.editable().find( 'img[data-widget="uploadimage"]' ).count() );
		assert.areSame( '', editor.getData(), 'getData on loading.' );

		var loader = editor.uploadRepository.loaders[ 0 ];

		loader.data = bender.tools.pngBase64;
		loader.uploadTotal = 10;
		loader.changeStatus( 'uploading' );

		assert.areSame( 1, editor.editable().find( 'img[data-widget="uploadimage"]' ).count() );
		assert.areSame( '', editor.getData(), 'getData on uploading.' );

		var image = editor.editable().find( 'img[data-widget="uploadimage"]' ).getItem( 0 );

		waitForImage( image, function() {
			loader.url = IMG_URL;
			loader.changeStatus( 'uploaded' );

			assert.sameData( '<p><img src="' + IMG_URL + '" style="height:1px; width:1px" /></p>', editor.getData() );
			assert.areSame( 0, editor.editable().find( 'img[data-widget="uploadimage"]' ).count() );

			assert.areSame( 1, loadAndUploadCount );
			assert.areSame( 0, uploadCount );
			assert.areSame( 'http://foo/upload', lastUploadUrl );
		} );
	},

	'test removing editor during upload wont break it': function() {
		var editor = this.editors.disposableEditor;

		pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

		assert.areSame( 1, editor.editable().find( 'img[data-widget="uploadimage"]' ).count() );
		assert.areSame( '', editor.getData(), 'getData on loading.' );

		var loader = editor.uploadRepository.loaders[ 0 ];

		loader.data = bender.tools.pngBase64;
		loader.uploadTotal = 10;

		loader.uplaoded = 5;
		loader.update();

		editor.destroy();

		loader.uplaoded = 10;
		loader.update();

		assert.areSame( 'abort', loader.status, 'Loader status' );
	},

	'test aborting the upload after editor was removed wont break it': function() {
		var editor = this.editors.notificationDisposableEditor;

		pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

		var loader = editor.uploadRepository.loaders[ 0 ];

		editor.destroy();

		loader.abort();

		assert.areSame( 'abort', loader.status, 'Loader status' );
	}
} );
