/* bender-tags: editor,unit,clipboard,widget,filetools */
/* bender-ckeditor-plugins: uploadwidget,toolbar,undo,basicstyles */

'use strict';

var bindNotifications, FileLoader, notificationShowStub, notificationUpdateStub, file;

bender.editor = {
	config: {
		language: 'en'
	}
};

bender.test( {
	assertNotification: function( expected, notification, message ) {
		if ( expected.message ) {
			assert.areSame( expected.message, notification.message, message + 'Message should match.' );
		}

		if ( expected.progress ) {
			assert.areSame( expected.progress, notification.progress, message + 'Progress should match.' );
		}

		if ( expected.type ) {
			assert.areSame( expected.type, notification.type, message + 'Type should match.' );
		}
	},

	init: function() {
		var editor = this.editor;

		bindNotifications = CKEDITOR.fileTools.bindNotifications,
		FileLoader = CKEDITOR.fileTools.fileLoader,
		file = bender.tools.getTestPngFile( 'test1.png' );

		notificationShowStub = sinon.stub().returns( false );
		notificationUpdateStub = sinon.stub().returns( false );

		editor.on( 'notificationShow', notificationShowStub );
		editor.on( 'notificationUpdate', notificationUpdateStub );
	},

	setUp: function() {
		notificationShowStub.reset();
		notificationUpdateStub.reset();
	},

	'test uploaded': function() {
		var editor = this.editor,
			loader = new FileLoader( editor, file );

		bindNotifications( editor, loader );

		loader.fire( 'uploaded' );

		assert.areSame( 2, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading done.', type: 'success' },
			notificationShowStub.lastCall.args[ 0 ].data.notification );
	},

	'test loaded': function() {
		var editor = this.editor,
			loader = new FileLoader( editor, file );

		bindNotifications( editor, loader );

		loader.fire( 'loaded' );

		assert.areSame( 2, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading done.', type: 'success' },
			notificationShowStub.lastCall.args[ 0 ].data.notification );
	},

	'test uploading': function() {
		var editor = this.editor,
			loader = new FileLoader( editor, file );

		loader.total = 4;

		bindNotifications( editor, loader );

		loader.status = 'uploading';
		loader.uploaded = 1;
		loader.fire( 'update' );

		assert.areSame( 1, notificationShowStub.callCount, 'show' );
		this.assertNotification(
			{ message: 'Uploading file (25%)...', progress: 0.25, type: 'progress' },
			notificationUpdateStub.lastCall.args[ 0 ].data.notification,
			'1/4: ' );

		loader.status = 'uploading';
		loader.uploaded = 2;
		loader.fire( 'update' );

		assert.areSame( 1, notificationShowStub.callCount, 'show' );
		this.assertNotification(
			{ message: 'Uploading file (50%)...', progress: 0.5, type: 'progress' },
			notificationUpdateStub.lastCall.args[ 0 ].data.notification,
			'2/4: ' );

		loader.fire( 'uploaded' );

		assert.areSame( 2, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading file (100%)...', progress: 1, type: 'progress' },
			notificationUpdateStub.lastCall.args[ 0 ].data.notification,
			'4/4: ' );
		this.assertNotification(
			{ message: 'Uploading done.', type: 'success' },
			notificationShowStub.secondCall.args[ 0 ].data.notification,
			'Done: ' );
	},

	'test error': function() {
		var editor = this.editor,
			loader = new FileLoader( editor, file );

		bindNotifications( editor, loader );

		loader.message = 'foo';
		loader.fire( 'error' );

		assert.areSame( 2, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'foo', type: 'warning' },
			notificationShowStub.secondCall.args[ 0 ].data.notification );
	},

	'test abort': function() {
		var editor = this.editor,
			loader = new FileLoader( editor, file );

		bindNotifications( editor, loader );

		loader.fire( 'abort' );

		assert.areSame( 2, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Upload aborted by user.', type: 'info' },
			notificationShowStub.secondCall.args[ 0 ].data.notification,
			'First notification: ' );
	},

	'test uploaded multiple': function() {
		var editor = this.editor,
			loader1 = new FileLoader( editor, file ),
			loader2 = new FileLoader( editor, file ),
			loader3 = new FileLoader( editor, file );

		bindNotifications( editor, loader1 );
		bindNotifications( editor, loader2 );
		bindNotifications( editor, loader3 );

		loader1.total = 10;
		loader1.status = 'uploading';
		loader1.uploaded = 1;
		loader1.fire( 'update' );

		loader2.total = 10;
		loader2.status = 'uploading';
		loader2.uploaded = 1;
		loader2.fire( 'update' );

		loader3.total = 10;
		loader3.status = 'uploading';
		loader3.uploaded = 1;
		loader3.fire( 'update' );

		loader1.fire( 'uploaded' );

		assert.areSame( 1, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading files, 1 of 3 done (34%)...', type: 'progress' },
			notificationShowStub.lastCall.args[ 0 ].data.notification );

		loader2.fire( 'uploaded' );

		assert.areSame( 1, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading files, 2 of 3 done (67%)...', type: 'progress' },
			notificationShowStub.lastCall.args[ 0 ].data.notification );

		loader3.fire( 'uploaded' );

		assert.areSame( 2, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading done.', type: 'success' },
			notificationShowStub.lastCall.args[ 0 ].data.notification );
	},

	'test error during uploaded multiple': function() {
		var editor = this.editor,
			loader1 = new FileLoader( editor, file ),
			loader2 = new FileLoader( editor, file ),
			loader3 = new FileLoader( editor, file );

		bindNotifications( editor, loader1 );
		bindNotifications( editor, loader2 );
		bindNotifications( editor, loader3 );

		loader1.total = 10;
		loader1.status = 'uploading';
		loader1.uploaded = 1;
		loader1.fire( 'update' );

		loader2.total = 10;
		loader2.status = 'uploading';
		loader2.uploaded = 1;
		loader2.fire( 'update' );

		loader3.total = 10;
		loader3.status = 'uploading';
		loader3.uploaded = 1;
		loader3.fire( 'update' );

		loader1.fire( 'uploaded' );

		assert.areSame( 1, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading files, 1 of 3 done (34%)...', type: 'progress' },
			notificationShowStub.lastCall.args[ 0 ].data.notification );

		loader2.message = 'foo';
		loader2.fire( 'error' );

		assert.areSame( 2, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading files, 1 of 2 done (34%)...', type: 'progress' },
			notificationShowStub.firstCall.args[ 0 ].data.notification );
		this.assertNotification(
			{ message: 'foo', type: 'warning' },
			notificationShowStub.lastCall.args[ 0 ].data.notification );

		loader3.fire( 'uploaded' );

		assert.areSame( 3, notificationShowStub.callCount );
		this.assertNotification(
			{ message: 'Uploading done.', type: 'success' },
			notificationShowStub.lastCall.args[ 0 ].data.notification );
	}
} );