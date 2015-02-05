/* bender-tags: editor,unit,clipboard,widget,filetools */
/* bender-ckeditor-plugins: uploadwidget,toolbar,undo,basicstyles */

'use strict';

var bindNotifications, FileLoader, notificationShowStub, notificationUpdateStub, file;

bender.editor = true;

bender.test( {
	init: function() {
		var editor = this.editor;

		bindNotifications = CKEDITOR.fileTools.bindNotifications,
		FileLoader = CKEDITOR.fileTools.fileLoader,
		file = bender.tools.getTestPngFile( 'test1.png' );

		notificationShowStub = sinon.stub().returns( false );
		notificationUpdateStub = sinon.stub().returns( false );

		editor.on( 'notificationShow', notificationShowStub );
		editor.on( 'notificationUpdateStub', notificationUpdateStub );
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
	}
} );