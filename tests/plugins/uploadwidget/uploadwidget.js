/* bender-tags: editor,clipboard,widget,filetools */
/* bender-ckeditor-plugins: uploadwidget,toolbar,undo,basicstyles */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js */
/* global pasteFiles */

'use strict';

( function() {
	var fileTools, resumeAfter, lastUploadUrl, lastAdditionalRequestParameters,
		loadAndUploadCount, loadCount, uploadCount,
		htmlMatchingOpts = {
			compareSelection: true,
			normalizeSelection: true
		},
		UPLOADED_MARKER = 'uploaded';

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

			onUploaded: function() {
				this.replaceWith( UPLOADED_MARKER );
			}
		} );

		fileTools.addUploadWidget( editor, name, def );
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
				add: function( name, def ) {
					// Note that widget system makes a duplicate of a definition.
					this.registered[ name ] = CKEDITOR.tools.prototypedCopy( def );
				},
				registered: {}
			},
			lang: {},
			config: {},
			plugins: {
				clipboard: {
					_supportedFileMatchers: []
				}
			}
		};

		editor.uploadRepository = new CKEDITOR.fileTools.uploadRepository( editor );

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
		init: function() {
			CKEDITOR.fileTools.bindNotifications = sinon.spy();
		},

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'uploadwidget' );

			fileTools = CKEDITOR.fileTools;
			resumeAfter = bender.tools.resumeAfter;

			CKEDITOR.fileTools.fileLoader.prototype.loadAndUpload = function( url, additionalRequestParameters ) {
				loadAndUploadCount++;
				lastUploadUrl = url;
				lastAdditionalRequestParameters = additionalRequestParameters;
			};

			CKEDITOR.fileTools.fileLoader.prototype.load = function() {
				loadCount++;
			};

			CKEDITOR.fileTools.fileLoader.prototype.upload = function( url, additionalRequestParameters ) {
				uploadCount++;
				lastUploadUrl = url;
				lastAdditionalRequestParameters = additionalRequestParameters;
			};

			loadAndUploadCount = 0;
			loadCount = 0;
			uploadCount = 0;

			CKEDITOR.fileTools.bindNotifications.reset();
		},

		tearDown: function() {
			var bot = this.editorBot,
				editor = bot.editor;

			// Clear upload repository.
			editor.uploadRepository.loaders = [];

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

				var loader = editor.uploadRepository.loaders[ 0 ];

				loader.changeStatus( 'uploaded' );

				assert.areSame( '<p>uploaded</p>', editor.getData() );
			} );
		},

		// (#1454)
		'test calling widget onAbort function when widget is destroyed': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				stub = sinon.stub().returns( true );

			addTestUploadWidget( editor, 'testuploadwidget', {
				onAbort: stub
			} );

			bot.setData( '', function() {
				pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

				var loader = editor.uploadRepository.loaders[ 0 ];

				bender.tools.objToArray( editor.widgets.instances )[ 0 ].wrapper = null;
				editor.editable().findOne( '[data-cke-upload-id="' + loader.id + '"]' ).remove();

				loader.fire( 'update' );

				assert.isTrue( stub.calledOnce );
			} );
		},

		// (#1454)
		'test onAbort can be called only once': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				stub = sinon.stub().returns( true );

			addTestUploadWidget( editor, 'testuploadwidget', {
				onAbort: stub
			} );

			bot.setData( '', function() {
				pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

				var loader = editor.uploadRepository.loaders[ 0 ];

				loader.abort();
				loader.abort();

				assert.isTrue( stub.calledOnce );
			} );
		},

		'test markElement': function() {
			var element = new CKEDITOR.dom.element( 'p' );
			CKEDITOR.fileTools.markElement( element, 'widgetName', 1 );
			assert.sameData( '<p data-cke-upload-id="1" data-widget="widgetName"></p>', element.getOuterHtml() );
		},

		'test _getLoader': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			addTestUploadWidget( editor, 'testGetLoader' );

			bot.setData( '<p>x<span data-cke-upload-id="' + loader.id + '" data-widget="testGetLoader">uploading...</span>x</p>', function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'span[data-widget="testGetLoader"]' ) );

				assert.areSame( loader, widget._getLoader(), '_getLoader return value' );
			} );
		},

		'test replaceWith 1 element': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testReplaceWith1', {
				onUploaded: function() {
					// We're using strong to force editable.insertHtml to do some elements merging.
					this.replaceWith( '<strong>uploaded</strong>' );
				}
			} );

			bot.setData( '<p>x<span data-cke-upload-id="' + loader.id + '" data-widget="testReplaceWith1">uploading...</span>x</p>', function() {
				editor.widgets.getByElement( editor.editable().findOne( 'span[data-widget="testReplaceWith1"]' ) ).focus(); // focus widget

				loader.changeStatus( 'uploaded' );

				assertUploadingWidgets( editor, 'testReplaceWith1', 0 );

				// On Safari selection will be normalised to the inside of the <strong> tags.
				assert.isMatching( /^<p>x(\[<strong>|<strong>\[)uploaded(\]<\/strong>|<\/strong>\])x(<br(?: type="_moz")? \/>)?<\/p>$/,
					bender.tools.html.prepareInnerHtmlForComparison( bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts ) );
			} );
		},

		'test replaceWith empty element': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testReplaceWith1', {
				onUploaded: function() {
					this.replaceWith( '' );
				}
			} );

			bot.setData( '<p>x<span data-cke-upload-id="' + loader.id + '" data-widget="testReplaceWith1">uploading...</span>x</p>', function() {
				editor.widgets.getByElement( editor.editable().findOne( 'span[data-widget="testReplaceWith1"]' ) ).focus(); // focus widget

				loader.changeStatus( 'uploaded' );

				assertUploadingWidgets( editor, 'testReplaceWith1', 0 );

				assert.isInnerHtmlMatching( '<p>x^x@</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );
			} );
		},

		'test replaceWith multiple elements': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testReplaceWith1', {
				onUploaded: function() {
					this.replaceWith( 'y<strong>uploaded1</strong><em>upl<u>oad</u>ed2</em>y' );
				}
			} );

			bot.setData( '<p>x<span data-cke-upload-id="' + loader.id + '" data-widget="testReplaceWith1">uploading...</span>x</p>', function() {
				editor.widgets.getByElement( editor.editable().findOne( 'span[data-widget="testReplaceWith1"]' ) ).focus(); // focus widget

				loader.changeStatus( 'uploaded' );

				assertUploadingWidgets( editor, 'testReplaceWith1', 0 );

				assert.isInnerHtmlMatching( '<p>x[y<strong>uploaded1</strong><em>upl<u>oad</u>ed2</em>y]x@</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );
			} );
		},

		'test replaceWith preserves selection placed before the widget': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testReplaceWith1', {
				onUploaded: function() {
					// We're using strong to force editable.insertHtml to do some elements merging.
					this.replaceWith( '<strong>uploaded</strong>' );
				}
			} );

			bot.setData( '<p><strong>foo<span data-cke-upload-id="' + loader.id + '" data-widget="testReplaceWith1">uploading...</span>x</strong></p>', function() {
				var range = editor.createRange();
				range.setStart( editor.editable().findOne( 'strong' ).getFirst(), 2 ); // fo^o
				range.collapse( true );
				editor.getSelection().selectRanges( [ range ] );

				loader.changeStatus( 'uploaded' );

				assertUploadingWidgets( editor, 'testReplaceWith1', 0 );

				assert.isInnerHtmlMatching( '<p><strong>fo^ouploadedx</strong>@</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );
			} );
		},

		'test replaceWith preserves selection placed after the widget': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testReplaceWith1', {
				onUploaded: function() {
					// We're using strong to force editable.insertHtml to do some elements merging.
					this.replaceWith( '<strong>uploaded</strong>' );
				}
			} );

			bot.setData( '<p><strong>x<span data-cke-upload-id="' + loader.id + '" data-widget="testReplaceWith1">uploading...</span>foo</strong></p>', function() {
				var range = editor.createRange();
				range.setStart( editor.editable().findOne( 'strong' ).getLast(), 2 ); // fo^o
				range.collapse( true );
				editor.getSelection().selectRanges( [ range ] );

				loader.changeStatus( 'uploaded' );

				assertUploadingWidgets( editor, 'testReplaceWith1', 0 );

				assert.isInnerHtmlMatching( '<p><strong>xuploadedfo^o</strong>@</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );
			} );
		},

		'test custom event lister': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				onErrorCount = 0, uploadId;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testOnError', {
				onError: function( upload ) {
					onErrorCount++;
					uploadId = upload.id;
				}
			} );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testOnError">uploading...</span>' );

				loader.changeStatus( 'error' );

				assert.areSame( 'error', loader.status );
				assert.areSame( 1, onErrorCount );
				assert.areSame( loader.id, uploadId );
				assertUploadingWidgets( editor, 'testOnError', 0 );
			} );
		},

		'test custom event lister with prevent default': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				onErrorCount = 0, uploadId;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testOnAbortFalse', {
				onError: function( upload ) {
					onErrorCount++;
					uploadId = upload.id;
					return false;
				}
			} );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testOnAbortFalse">uploading...</span>' );

				loader.changeStatus( 'error' );

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
				assert.sameData( '<span data-cke-upload-id="0" data-widget="specificWidget1">specific</span>', evt.data.dataValue );
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
				assert.sameData( '<span data-cke-upload-id="0" data-widget="generalWidget2">general</span>', evt.data.dataValue );
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
				assert.sameData(
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

		'test loadMethod load': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'loadMethodLoad', {
				loadMethod: 'load',

				fileToElement: function() {
					return new CKEDITOR.dom.element( 'span' );
				}
			} );

			resumeAfter( editor, 'paste', function() {
				assert.areSame( 1, loadCount, 'Load should be called.' );
				assert.areSame( 0, uploadCount, 'Upload should not be called.' );
				assert.areSame( 0, loadAndUploadCount, 'LoadAndUpload should not be called once.' );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test1.png' ) ] );

			wait();
		},

		'test loadMethod upload': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'loadMethodLoad', {
				loadMethod: 'upload',

				fileToElement: function() {
					return new CKEDITOR.dom.element( 'span' );
				}
			} );

			resumeAfter( editor, 'paste', function() {
				assert.areSame( 0, loadCount, 'Load should not be called.' );
				assert.areSame( 1, uploadCount, 'Upload should be called once.' );
				assert.areSame( 0, loadAndUploadCount, 'LoadAndUpload should not be called once.' );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test1.png' ) ] );

			wait();
		},

		// (#1068).
		'test supports definition changes at a runtime': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'runtimeDefChanges', {
				supportedTypes: /image\/png/,

				loadMethod: 'upload',

				fileToElement: function() {
					return new CKEDITOR.dom.element( 'span' );
				}
			} );

			// Change supported type, so that paste does not match.
			editor.widgets.registered.runtimeDefChanges.supportedTypes = /text\/plain/;

			resumeAfter( editor, 'paste', function() {
				assert.areSame( 0, uploadCount, 'Upload call count' );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test1.png' ) ] );

			wait();
		},

		'test custom def.loaderType': function() {
			var editor = mockEditorForPaste(),
				uploadStub = sinon.stub();

			function CustomLoaderType() {
				this.upload = uploadStub;
			}

			addTestUploadWidget( editor, 'customLoaderType', {
				loaderType: CustomLoaderType,
				loadMethod: 'upload'
			} );

			resumeAfter( editor, 'paste', function() {
				assert.areSame( 1, uploadStub.callCount, 'CustomLoaderType.upload call count' );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test1.png' ) ] );

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
				assert.sameData(
					'<span data-cke-upload-id="0" data-widget="pngWidget">png</span>' +
					'<span data-cke-upload-id="1" data-widget="pngWidget">png</span>',
					evt.data.dataValue,
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

			fileTools.addUploadWidget( editor, 'noFileToElement', {} );

			resumeAfter( editor, 'paste', function( evt ) {
				assert.areSame( '', evt.data.dataValue );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			wait();
		},

		'test bindNotifications on paste': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'bindNotificationsWidget' );

			resumeAfter( editor, 'paste', function() {
				var spy = CKEDITOR.fileTools.bindNotifications;
				assert.areSame( 1, spy.callCount );
				assert.isTrue( spy.calledWith( editor ) );
				assert.areSame( bender.tools.getTestPngFile().name, spy.firstCall.args[ 1 ].fileName );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			wait();
		},

		// (#1145).
		'test uploadWidgetDefinition.skipNotifications': function() {
			var editor = mockEditorForPaste();

			addTestUploadWidget( editor, 'bindNotificationsWidget', {
				skipNotifications: true
			} );

			resumeAfter( editor, 'paste', function() {
				var spy = CKEDITOR.fileTools.bindNotifications;
				assert.areSame( 0, spy.callCount, 'CKEDITOR.fileTools.bindNotifications call count' );
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			wait();
		},

		'test undo and redo': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoRedo' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoRedo">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedo' );
				assert.areSame( '<p>xx</p>', editor.getData() );

				loader.changeStatus( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>x[uploaded]x@</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'After redo.' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p>xx</p>', editor.getData(), 'After undo.' );

				editor.execCommand( 'redo' );

				assert.isInnerHtmlMatching( '<p>x[uploaded]x@</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'After redo.' );
			} );
		},

		'test undo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoDuring">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p>', editor.getData() );

				editor.execCommand( 'undo' );

				assert.areSame( '<p>xx</p>', editor.getData(), 'After undo.' );

				loader.changeStatus( 'progress' );

				assert.areSame( 'abort', loader.status );

				editor.execCommand( 'redo' );

				assert.areSame( '<p>xx</p>', editor.getData(), 'After redo.' );
			} );
		},

		'test error during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testErrorDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testErrorDuring">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testErrorDuring' );
				assert.areSame( '<p>xx</p>', editor.getData() );

				loader.changeStatus( 'error' );

				assert.areSame( '<p>xx</p>', editor.getData(), 'After error.' );
				assertUploadingWidgets( editor, 'testErrorDuring', 0 );
			} );
		},

		'test changes and undo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">foo</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoDuring">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );

				editor.execCommand( 'bold' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				editor.execCommand( 'undo' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				loader.changeStatus( 'uploaded' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p">[foo@]</p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'After undo.' );
			} );
		},

		'test changes, undo and redo during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoRedoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">foo</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoRedoDuring">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedoDuring' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );

				editor.execCommand( 'bold' );

				assertUploadingWidgets( editor, 'testUndoRedoDuring' );
				assert.areSame( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				editor.execCommand( 'undo' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedoDuring' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				editor.execCommand( 'redo' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedoDuring' );
				assert.areSame( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				loader.changeStatus( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p"><strong>[foo@]</strong></p>', bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );
			} );
		},

		'test changes during upload and undo after upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoRedoAfter' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">foo</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoRedoAfter">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoRedoAfter' );
				assert.areSame( '<p>xx</p><p id="p">foo</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );

				editor.execCommand( 'bold' );

				assertUploadingWidgets( editor, 'testUndoRedoAfter' );
				assert.areSame( '<p>xx</p><p id="p"><strong>foo</strong></p>', editor.getData() );

				loader.changeStatus( 'uploaded' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p"><strong>[foo@]</strong></p>',
					bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'Before undo' );

				editor.execCommand( 'undo' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p">[foo@]</p>',
					bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'After undo' );

				editor.execCommand( 'redo' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p id="p"><strong>[foo@]</strong></p>',
					bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts, 'After redo' );
			} );
		},

		'test copy upload widget': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				p;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testCopy' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p><p id="p">x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testCopy">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testCopy' );
				assert.areSame( '<p>xx</p><p id="p">x</p>', editor.getData() );

				p = editor.document.getById( 'p' );
				editor.getSelection().selectElement( p );
				// Every browser expect Safari removes id attribute automatically.
				p.removeAttribute( 'id' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testCopy">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testCopy', 2 );
				assert.areSame( '<p>xx</p><p></p>', editor.getData() );

				loader.changeStatus( 'uploaded' );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p>[uploaded]@</p>',
					bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );

				editor.execCommand( 'undo' );

				shrinkRange( editor );

				assert.isInnerHtmlMatching( '<p>xuploadedx@</p><p>[x@]</p>',
					bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p>x^x@</p><p id="p">x@</p>',
					bender.tools.selection.getWithHtml( editor ), htmlMatchingOpts );
			} );
		},

		'test remove during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testUndoDuring' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testUndoDuring">uploading...</span>' );

				loader.changeStatus( 'progress' );

				assertUploadingWidgets( editor, 'testUndoDuring' );
				assert.areSame( '<p>xx</p>', editor.getData() );

				bot.setData( '', function() {
					assertUploadingWidgets( editor, 'testUndoDuring', 0 );
					assert.areSame( '', editor.getData() );

					loader.changeStatus( 'progress' );

					assert.areSame( 'abort', loader.status );

					editor.execCommand( 'undo' );

					assert.areSame( '<p>xx</p>', editor.getData() );
					assert.areSame( 'abort', loader.status );
				} );
			} );
		},

		'test set Class during upload': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() ),
				wrapper;

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testClass' );

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<span data-cke-upload-id="' + loader.id + '" data-widget="testClass">...</span>' );

				wrapper = editor.editable().findOne( 'span[data-cke-widget-wrapper="1"]' );

				loader.changeStatus( 'loading' );

				assert.isTrue( wrapper.hasClass( 'cke_upload_loading' ), 'Has class loading.' );
				assert.isFalse( wrapper.hasClass( 'cke_upload_uploading' ), 'Has NOT class uploading.' );

				loader.changeStatus( 'uploading' );

				assert.isFalse( wrapper.hasClass( 'cke_upload_loading' ), 'Has NOT class loading.' );
				assert.isTrue( wrapper.hasClass( 'cke_upload_uploading' ), 'Has class uploading.' );
			} );
		},

		'test text mode': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testTextMode', {
				onUploaded: function() {
					this.replaceWith( '<p>x</p>', 'text' );
				}
			} );

			bot.setData( '<p><u>x<span data-cke-upload-id="' + loader.id + '" data-widget="testTextMode">uploading...</span>x</u></p>', function() {
				loader.changeStatus( 'uploaded' );

				assert.areSame( '<p><u>xxx</u></p>', editor.getData() );
			} );
		},

		// (#5414)
		'test firing change after calling replaceWith() method': function() {
			var bot = this.editorBot,
				editor = bot.editor,
				uploads = editor.uploadRepository,
				loader = uploads.create( bender.tools.getTestPngFile() );

			loader.loadAndUpload( 'uploadUrl' );

			addTestUploadWidget( editor, 'testChange' );

			bot.setData( '<span data-cke-upload-id="' + loader.id + '" data-widget="testChange">...</span>', function() {
				editor.once( 'change', function() {
					resume( function() {
						var editorContent = editor.getData(),
							containsUploadedContent = editorContent.indexOf( UPLOADED_MARKER ) !== -1;

						assert.isTrue( containsUploadedContent, 'The editor contains the marker of the uploaded widget' );
					} );
				} );

				loader.changeStatus( 'uploaded' );

				wait();
			} );
		}
	} );
} )();
