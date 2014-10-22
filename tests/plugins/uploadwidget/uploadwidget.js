/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: uploadwidget,toolbar,undo */

'use strict';

( function() {
	var filetools, resumeAfter, lastUploadUrl,
		loadAndUploadCount = 0;

	bender.editor = {
		config: {
			extraPlugins: 'uploadwidget,toolbar,undo'
		}
	};

	function pasteFiles( editor, files, dataValue ) {
		var	nativeData = bender.tools.mockNativeDataTransfer();

		nativeData.files = files;

		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		editor.fire( 'paste', {
			dataTransfer: dataTransfer,
			dataValue: dataValue ? dataValue : ''
		} );
	}

	function addTestUploadWidget( editor, name, def ) {
		if ( !def ) {
			def = {};
		}

		CKEDITOR.tools.extend( def, {
			uploadUrl: 'uploadUrl',

			fileToElement: function( file ) {
				var span = new CKEDITOR.dom.element( 'span' );
				span.setText( 'uploading...' );
				return span;
			},

			onuploaded: function( upload ) {
				this.replaceWith( 'uploaded' );
			}
		} );

		filetools.addUploadWidget( editor, name, def );
	}

	function assertUploadingWidgets( editor, widgetName, expectedWidgetsCount ) {
		var widgets = CKEDITOR.dom.element.createFromHtml( editor.editable().getHtml() ).find( 'span[data-widget="' + widgetName + '"]' ),
			widget, i;

		if ( expectedWidgetsCount === undefined ) {
			expectedWidgetsCount = 1;
		}

		assert.areSame( expectedWidgetsCount, widgets.count(), 'Expected ' + widgetName + ' count should be ' + expectedWidgetsCount );

		for ( i = 0; i < widgets.count(); i++ ) {
			widget = widgets.getItem( i );
			assert.areSame( '0', widget.getAttribute( 'data-cke-upload-id' ) );
			assert.areSame( 'uploading...', widget.getHtml() );
		};
	}

	function mockEditorForPaste() {
		var editor = {
			widgets: {
				add: function() {}
			},
			lang: {}
		};

		editor.uploadsRepository = new CKEDITOR.filetools.UploadsRepository( editor );

		CKEDITOR.event.implementOn( editor );

		return editor;
	}

	bender.test( {
		'setUp': function() {
			filetools = CKEDITOR.filetools;
			resumeAfter = bender.tools.resumeAfter;

			CKEDITOR.filetools.FileLoader.prototype.loadAndUpload = function() {
				loadAndUploadCount++;
			}

			CKEDITOR.filetools.FileLoader.prototype.load = function() {};

			CKEDITOR.filetools.FileLoader.prototype.upload = function( url ) {
				lastUploadUrl = url;
			};
		},

		'tearDown': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			// Clear uploads repository.
			editor.uploadsRepository._.loaders = [];
			loadAndUploadCount = 0;

			editor.resetUndo();
		},

		'test upload (integration test)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			addTestUploadWidget( editor, 'testuploadwidget' );

			pasteFiles( editor, [ bender.tools.getTestFile() ] );

			assertUploadingWidgets( editor, 'testuploadwidget' );
			assert.areSame( '', editor.getData(), 'getData on uploading.' );

			assert.areSame( 1, loadAndUploadCount, 'loadAndUpload should be called once.' );

			var loader = editor.uploadsRepository.get( 0 );

			loader.changeStatusAndFire( 'uploaded' );

			assert.areSame( '<p>uploaded</p>', editor.getData() );
		},

		'test mark specific widget before general': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'generalWidget1', {
				fileToElement: function( file ) {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'general' );
					return span;
				}
			} );
			addTestUploadWidget( editor, 'specificWidget1', {
				supportedExtensions: [ 'txt' ],

				fileToElement: function( file ) {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'specific' );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '<span data-cke-upload-id="0" data-widget="specificWidget1">specific</span>', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestFile( 'test.txt' ) ] );

			wait();
		},

		'test mark specific widget not handle not supported extension': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'generalWidget2', {
				fileToElement: function( file ) {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'general' );
					return span;
				}
			} );
			addTestUploadWidget( editor, 'specificWidget2', {
				supportedExtentions: [ 'txt' ],

				fileToElement: function( file ) {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'specific' );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '<span data-cke-upload-id="0" data-widget="generalWidget2">general</span>', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestFile( 'test.jpg' ) ] );

			wait();
		},

		'test no paste if there is no supported extension': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'specificWidget3', {
				supportedExtensions: [ 'txt' ],

				fileToElement: function( file ) {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'specific' );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestFile( 'test.jpg' ) ] );

			wait();
		},

		'test paste multiple files': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'pngWidget', {
				supportedExtensions: [ 'png' ],

				fileToElement: function( file ) {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'png' );
					return span;
				}
			} );
			addTestUploadWidget( editor, 'txtWidget', {
				supportedExtensions: [ 'txt' ],

				fileToElement: function( file ) {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'txt' );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame(
					'<span data-cke-upload-id="0" data-widget="pngWidget">png</span>' +
					'<span data-cke-upload-id="1" data-widget="pngWidget">png</span>', evt.data.dataValue,
					'Only one type of file should be supported but all of the files on this type.' );
			} );

			pasteFiles( editor, [
				bender.tools.getTestFile( 'test1.png' ),
				bender.tools.getTestFile( 'test2.txt' ),
				bender.tools.getTestFile( 'test3.png' ) ] );

			wait();
		},

		'test paste no files': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'noFilesWidget' );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '', evt.data.dataValue );
			} );

			pasteFiles( editor, [] );

			wait();
		},

		'test no file handling if data value is not empty': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'noFilesWidget' );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( 'some data', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestFile() ], 'some data' );

			wait();
		},

		'test fileToElement returns null': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'pngWidget', {
				fileToElement: function( file ) {
					return null;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestFile() ] );

			wait();
		},

		'test no fileToElement method': function() {
			var editor = mockEditorForPaste();

			filetools.addUploadWidget( editor, 'noFileToElement', {} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestFile() ] );

			wait();
		},

		'test undo and redo': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoRedo' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoRedo">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedo' );
				assert.areSame( '<p>xx</p>', editor.getData() );

				loader.changeStatusAndFire( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploaded{}x</p>', bender.tools.selection.getWithHtml( editor ), 'After redo.' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p>xx</p>', editor.getData(), 'After undo.' );

				editor.execCommand( 'redo' );

				assert.isInnerHtmlMatching( '<p>xuploaded{}x</p>', bender.tools.selection.getWithHtml( editor ), 'After redo.' );
			} );
		},

		'test undo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoDuring">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p>', editor.getData() );

				editor.execCommand( 'undo' );

				assert.areSame( '<p>xx</p>', editor.getData(), 'After undo.' );

				loader.changeStatusAndFire( 'progress' );

				assert.areSame( 'abort', loader.status );

				editor.execCommand( 'redo' );

				assert.areSame( '<p>xx</p>', editor.getData(), 'After redo.' );
			} );
		}
	} );
} )();