/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: uploadwidget,toolbar,undo,basicstyles */

'use strict';

( function() {
	var filetools, resumeAfter, lastUploadUrl,
		loadAndUploadCount = 0;

	bender.editor = {
		config: {
			extraPlugins: 'uploadwidget,toolbar,undo,basicstyles'
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
		var widgets = CKEDITOR.dom.element.createFromHtml( '<div>' + editor.editable().getHtml() + '</div>' ).find( 'span[data-widget="' + widgetName + '"]' ),
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
		},

		'test error during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testErrorDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testErrorDuring">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testErrorDuring' );
				assert.areSame( '<p>xx</p>', editor.getData() );

				loader.changeStatusAndFire( 'error' );

				assert.areSame( '<p>xx</p>', editor.getData(), 'After error.' );
				assertUploadingWidgets( editor, 'testErrorDuring', 0 );
			} );
		},

		'test changes and undo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">foo</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoDuring">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );

				editor.execCommand( 'bold' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				editor.execCommand( 'undo' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				loader.changeStatusAndFire( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploadedx</p>[<p id="p">foo</p>]', bender.tools.selection.getWithHtml( editor ) );
			} );
		},

		'test changes, undo and redo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoRedoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">foo</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoRedoDuring">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedoDuring' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );

				editor.execCommand( 'bold' );

				assertUploadingWidgets( editor, 'testUndoRedoDuring' );
				assert.areSame( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				editor.execCommand( 'undo' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedoDuring' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				editor.execCommand( 'redo' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedoDuring' );
				assert.areSame( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				loader.changeStatusAndFire( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploadedx</p><p id="p"><strong>[foo]</strong></p>', bender.tools.selection.getWithHtml( editor ) );
			} );
		},

		'test changes during upload and undo after upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoRedoAfter' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">foo</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoRedoAfter">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedoAfter' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );

				editor.execCommand( 'bold' );

				assertUploadingWidgets( editor, 'testUndoRedoAfter' );
				assert.areSame( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				loader.changeStatusAndFire( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploadedx</p><p id="p"><strong>[foo]</strong></p>', bender.tools.selection.getWithHtml( editor ) );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p>xuploadedx</p>[<p id="p">foo</p>]', bender.tools.selection.getWithHtml( editor ) );

				editor.execCommand( 'redo' );

				assert.isInnerHtmlMatching( '<p>xuploadedx</p><p id="p"><strong>[foo]</strong></p>', bender.tools.selection.getWithHtml( editor ) );
			} );
		},

		'test copy upload widget': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testCopy' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testCopy">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testCopy' );
				assert.areSame( '<p>xx</p><p id="p">x</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testCopy">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testCopy', 2 );
				assert.areSame( '<p>xx</p><p></p>', editor.getData() );

				loader.changeStatusAndFire( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploadedx</p><p>uploaded{}</p>', bender.tools.selection.getWithHtml( editor ) );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p>xuploadedx</p>[<p id="p">x</p>]', bender.tools.selection.getWithHtml( editor ) );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p>x{}x</p><p id="p">x</p>', bender.tools.selection.getWithHtml( editor ) );
			} );
		},

		'test remove during upload': function() {
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

				bot.setData( '', function() {
					assertUploadingWidgets( editor, 'testUndoDuring', 0 );
					assert.areSame( '', editor.getData() );

					loader.changeStatusAndFire( 'progress' );

					assert.areSame( 'abort', loader.status );

					editor.execCommand( 'undo' );

					assert.areSame( '<p>xx</p>', editor.getData() );
					assert.areSame( 'abort', loader.status );
				} );
			} );
		},

		'test markElement': function() {
			var element = new CKEDITOR.dom.element( 'p' );
			CKEDITOR.filetools.markElement( element, 'widgetName', 1 );
			assert.areSame( '<p data-cke-upload-id="1" data-widget="widgetName"></p>', element.getOuterHtml() );
		}
	} );
} )();