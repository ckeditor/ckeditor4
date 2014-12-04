/* bender-tags: editor,unit,clipboard,widget,filetools */
/* bender-ckeditor-plugins: uploadwidget,toolbar,undo,basicstyles */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js */

/*global pasteFiles */

'use strict';

( function() {
	var filetools, resumeAfter, lastUploadUrl,
		loadAndUploadCount = 0,
		htmlMatchingOpts = {
			compareSelection: true,
			normalizeSelection: true
		};

	bender.editor = {
		config: {
			extraPlugins: 'uploadwidget,toolbar,undo,basicstyles'
		}
	};

	function addTestUploadWidget( editor, name, def ) {
		if ( !def ) {
			def = {};
		}

		CKEDITOR.tools.extend( def, {
			uploadUrl: 'uploadUrl',

			fileToElement: function() {
				var span = new CKEDITOR.dom.element( 'span' );
				span.setText( 'uploading...' );
				return span;
			},

			onuploaded: function() {
				this.replaceWith( 'uploaded' );
			}
		} );

		filetools.addUploadWidget( editor, name, def );
	}

	function assertUploadingWidgets( editor, widgetName, expectedWidgetsCount ) {
		var widgets = editor.editable().find( 'span[data-widget="' + widgetName + '"]' ),
			widget, i;

		if ( expectedWidgetsCount === undefined ) {
			expectedWidgetsCount = 1;
		}

		assert.areSame( expectedWidgetsCount, widgets.count(), 'Expected ' + widgetName + ' count should be ' + expectedWidgetsCount );

		for ( i = 0; i < widgets.count(); i++ ) {
			widget = widgets.getItem( i );
			assert.areSame( '0', widget.getAttribute( 'data-cke-upload-id' ) );
			assert.areSame( 'uploading...', widget.getHtml() );
		}
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

	// Safari has different range then other browsers and we need to normalize it.
	function shrinkRange( editor ) {
		var range = editor.getSelection().getRanges()[ 0 ];

		range.shrink( CKEDITOR.SHRINK_ELEMENT );
		range.shrink( CKEDITOR.SHRINK_TEXT );
		range.select();
	}

	bender.test( {
		'setUp': function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			filetools = CKEDITOR.filetools;
			resumeAfter = bender.tools.resumeAfter;

			CKEDITOR.filetools.FileLoader.prototype.loadAndUpload = function( url ) {
				loadAndUploadCount++;
				lastUploadUrl = url;
			};

			CKEDITOR.filetools.FileLoader.prototype.load = function() {};

			CKEDITOR.filetools.FileLoader.prototype.upload = function() {};
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

			bot.setData( '', function() {
				pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

				assertUploadingWidgets( editor, 'testuploadwidget' );
				assert.areSame( '', editor.getData(), 'getData on uploading.' );

				assert.areSame( 1, loadAndUploadCount, 'loadAndUpload should be called once.' );
				assert.areSame( 'uploadUrl', lastUploadUrl );

				var loader = editor.uploadsRepository.get( 0 );

				loader.changeStatusAndFire( 'uploaded' );

				assert.areSame( '<p>uploaded</p>', editor.getData() );
			} );
		},

		'test markElement': function() {
			var element = new CKEDITOR.dom.element( 'p' );
			CKEDITOR.filetools.markElement( element, 'widgetName', 1 );
			assert.isInnerHtmlMatching( '<p data-cke-upload-id="1" data-widget="widgetName"></p>', element.getOuterHtml() );
		},

		'test replaceWith 1 element': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testReplaceWith1', {
				onuploaded: function() {
					this.replaceWith( '<strong>uploaded</strong>' );
				}
			} );

			bot.setData( '<p>x<span data-cke-upload-id="' + loader.id + '" data-widget="testReplaceWith1">uploading...</span>x</p>', function() {
				loader.changeStatusAndFire( 'uploaded' );

				assertUploadingWidgets( editor, 'testReplaceWith1', 0 );
				assert.isInnerHtmlMatching( '<p>x<strong>uploaded</strong>x</p>', editor.getData() );
			} );
		},

		'test replaceWith empty element': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testReplaceWith1', {
				onuploaded: function() {
					this.replaceWith( '' );
				}
			} );

			bot.setData( '<p>x<span data-cke-upload-id="' + loader.id + '" data-widget="testReplaceWith1">uploading...</span>x</p>', function() {
				loader.changeStatusAndFire( 'uploaded' );

				assertUploadingWidgets( editor, 'testReplaceWith1', 0 );
				assert.isInnerHtmlMatching( '<p>xx</p>', editor.getData() );
			} );
		},

		'test replaceWith multiple elements': function() {
			// replaceWith must use insertHtmlIntoRange to handle multiple elements.
			assert.ignore();

			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testReplaceWith1', {
				onuploaded: function() {
					this.replaceWith( '<strong>uploaded1</strong><em>upl<u>oad</u>ed2</em>' );
				}
			} );

			bot.setData( '<p>x<span data-cke-upload-id="' + loader.id + '" data-widget="testReplaceWith1">uploading...</span>x</p>', function() {
				loader.changeStatusAndFire( 'uploaded' );

				assertUploadingWidgets( editor, 'testReplaceWith1', 0 );
				assert.isInnerHtmlMatching( '<p>x<strong>uploaded1</strong><em>upl<u>oad</u>ed2</em>x</p>', editor.getData() );
			} );
		},

		'test custom event lister': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				onErrorCount = 0, uploadId;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testOnError', {
				onerror: function( upload ) {
					onErrorCount++;
					uploadId = upload.id;
				}
			} );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testOnError">uploading...</span>' );

				loader.changeStatusAndFire( 'error' );

				assert.areSame( 'error', loader.status );
				assert.areSame( 1, onErrorCount );
				assert.areSame( loader.id, uploadId );
				assertUploadingWidgets( editor, 'testOnError', 0 );
			} );
		},

		'test custom event lister with prevent default': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				onErrorCount = 0, uploadId;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testOnAbortFalse', {
				onerror: function( upload ) {
					onErrorCount++;
					uploadId = upload.id;
					return false;
				}
			} );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testOnAbortFalse">uploading...</span>' );

				loader.changeStatusAndFire( 'error' );

				assert.areSame( 'error', loader.status );
				assert.areSame( 1, onErrorCount );
				assert.areSame( loader.id, uploadId );
				assertUploadingWidgets( editor, 'testOnAbortFalse' );
			} );
		},

		'test mark specific widget before general': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'generalWidget1', {
				fileToElement: function() {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'general' );
					return span;
				}
			} );
			addTestUploadWidget( editor, 'specificWidget1', {
				supportedTypes: /text\/plain/,

				fileToElement: function() {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'specific' );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.isInnerHtmlMatching( '<span data-cke-upload-id="0" data-widget="specificWidget1">specific</span>', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestTxtFile( 'test.txt' ) ] );

			wait();
		},

		'test mark specific widget not handle not supported extension': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'generalWidget2', {
				fileToElement: function() {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'general' );
					return span;
				}
			} );
			addTestUploadWidget( editor, 'specificWidget2', {
				supportedTypes: /text\/plain/,

				fileToElement: function() {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'specific' );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.isInnerHtmlMatching( '<span data-cke-upload-id="0" data-widget="generalWidget2">general</span>', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test.png' ) ] );

			wait();
		},

		'test no paste if there is no supported extension': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'specificWidget3', {
				supportedTypes: /text\/plain/,

				fileToElement: function() {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'specific' );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test.png' ) ] );

			wait();
		},

		'test multiple supported extension': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'multiSupportedExtension', {
				supportedTypes: /image\/(jpeg|png)/,

				fileToElement: function( file ) {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( file.name );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.isInnerHtmlMatching(
					'<span data-cke-upload-id="0" data-widget="multiSupportedExtension">test1.png</span>' +
					'<span data-cke-upload-id="1" data-widget="multiSupportedExtension">test3.png</span>',
					evt.data.dataValue );
			} );

			pasteFiles( editor, [
				bender.tools.getTestPngFile( 'test1.png' ),
				bender.tools.getTestTxtFile( 'test2.txt' ),
				bender.tools.getTestPngFile( 'test3.png' ) ] );

			wait();
		},

		'test paste multiple files': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'pngWidget', {
				supportedTypes: /image\/png/,

				fileToElement: function() {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'png' );
					return span;
				}
			} );
			addTestUploadWidget( editor, 'txtWidget', {
				supportedTypes: /text\/plain/,

				fileToElement: function() {
					var span = new CKEDITOR.dom.element( 'span' );
					span.setText( 'txt' );
					return span;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.isInnerHtmlMatching(
					'<span data-cke-upload-id="0" data-widget="pngWidget">png</span>' +
					'<span data-cke-upload-id="1" data-widget="pngWidget">png</span>', evt.data.dataValue,
					'Only one type of file should be supported but all of the files on this type.' );
			} );

			pasteFiles( editor, [
				bender.tools.getTestPngFile( 'test1.png' ),
				bender.tools.getTestTxtFile( 'test2.txt' ),
				bender.tools.getTestPngFile( 'test3.png' ) ] );

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

			pasteFiles( editor, [ bender.tools.getTestPngFile() ], 'some data' );

			wait();
		},

		'test fileToElement returns null': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'pngWidget', {
				fileToElement: function() {
					return null;
				}
			} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			wait();
		},

		'test no fileToElement method': function() {
			var editor = mockEditorForPaste();

			filetools.addUploadWidget( editor, 'noFileToElement', {} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			wait();
		},

		'test undo and redo': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoRedo' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoRedo">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedo' );
				assert.areSame( '<p>xx</p>', editor.getData() );

				loader.changeStatusAndFire( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploaded{}x@</p>', bender.tools.selection.getWithHtml( editor ), 'After redo.' );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p>xx@</p>', editor.getData(), 'After undo.' );

				editor.execCommand( 'redo' );

				assert.isInnerHtmlMatching( '<p>xuploaded{}x@</p>', bender.tools.selection.getWithHtml( editor ), 'After redo.' );
			} );
		},

		'test undo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoDuring">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.isInnerHtmlMatching( '<p>xx@</p>', editor.getData() );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p>xx@</p>', editor.getData(), 'After undo.' );

				loader.changeStatusAndFire( 'progress' );

				assert.areSame( 'abort', loader.status );

				editor.execCommand( 'redo' );

				assert.isInnerHtmlMatching( '<p>xx@</p>', editor.getData(), 'After redo.' );
			} );
		},

		'test error during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testErrorDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testErrorDuring">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testErrorDuring' );
				assert.isInnerHtmlMatching( '<p>xx@</p>', editor.getData() );

				loader.changeStatusAndFire( 'error' );

				assert.isInnerHtmlMatching( '<p>xx@</p>', editor.getData(), 'After error.' );
				assertUploadingWidgets( editor, 'testErrorDuring', 0 );
			} );
		},

		'test changes and undo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">foo</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoDuring">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.isInnerHtmlMatching( '<p>xx</p><p id="p">foo@</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );

				editor.execCommand( 'bold' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.isInnerHtmlMatching( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				editor.execCommand( 'undo' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.isInnerHtmlMatching( '<p>xx</p><p id="p">foo@</p>', editor.getData() );

				loader.changeStatusAndFire( 'uploaded' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p">[foo@]</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'After undo.' );
			} );
		},

		'test changes, undo and redo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
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

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p"><strong>[foo@]</strong></p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );
			} );
		},

		'test changes during upload and undo after upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
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

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p"><strong>[foo@]</strong></p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'Before undo' );

				editor.execCommand( 'undo' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p">[foo@]</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'After undo' );

				editor.execCommand( 'redo' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p"><strong>[foo@]</strong></p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'After redo' );
			} );
		},

		'test copy upload widget': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testCopy' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testCopy">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testCopy' );
				assert.isInnerHtmlMatching( '<p>xx</p><p id="p">x</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );
				// Every browser expect Safari removes id attribute automatically.
				p.removeAttribute( 'id' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testCopy">uploading...</span>' );

				loader.changeStatusAndFire( 'progress' );

				assertUploadingWidgets( editor, 'testCopy', 2 );
				assert.isInnerHtmlMatching( '<p>xx</p><p></p>', editor.getData() );

				loader.changeStatusAndFire( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p>uploaded^@</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );

				editor.execCommand( 'undo' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p>[x@]</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p>x^x@</p><p id="p">x@</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );
			} );
		},

		'test remove during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadsRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

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
		}
	} );
} )();