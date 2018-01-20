/* bender-tags: editor, clipboard, upload */
/* bender-ckeditor-plugins: imagebase */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js */
/* global pasteFiles */

( function() {
	'use strict';

	bender.editor = true;

	function objToArray( obj ) {
		var tools = CKEDITOR.tools;

		return tools.array.map( tools.objectKeys( obj ), function( key ) {
			return obj[ key ];
		} );
	}

	function getTestHtmlFile( fileName ) {
		var file = bender.tools.srcToFile( 'data:text/html;base64,Zm9v' );
		file.name = fileName ? fileName : 'name.html';
		return file;
	}

	// A mocked Loader type that synchronously notifies that the file has been uploaded.
	function SuccessFileLoader( editor, fileOrData, fileName ) {
		CKEDITOR.fileTools.fileLoader.call( this, editor, fileOrData, fileName );
	}

	// A mocked Loader type that synchronously notifies that the file has been failed.
	function FailFileLoader( editor, fileOrData, fileName ) {
		CKEDITOR.fileTools.fileLoader.call( this, editor, fileOrData, fileName );
	}

	var tests = {
		init: function() {
			var plugin = CKEDITOR.plugins.imagebase,
				editor = this.editor,
				imageWidgetDef = {
					name: 'testImageWidget',
					supportedTypes: /image\/(jpeg|png)/,
					loaderType: SuccessFileLoader
				},
				textWidgetDef = {
					name: 'testTextWidget',
					supportedTypes: /text\/plain/,
					loaderType: SuccessFileLoader
				};

			// Array of listeners to be cleared after each TC.
			this.listeners = [];
			this.sandbox = sinon.sandbox.create();

			plugin.addImageWidget( editor, imageWidgetDef.name, plugin.addFeature( editor, 'upload', imageWidgetDef ) );

			plugin.addImageWidget( editor, textWidgetDef.name, plugin.addFeature( editor, 'upload', textWidgetDef ) );

			SuccessFileLoader.prototype = CKEDITOR.tools.extend( {
				upload: function() {
					this.changeStatus( 'uploaded' );
				}
			}, CKEDITOR.fileTools.fileLoader.prototype );

			FailFileLoader.prototype = CKEDITOR.tools.extend( {
				upload: function() {
					this.changeStatus( 'error' );
				}
			}, CKEDITOR.fileTools.fileLoader.prototype );
		},

		tearDown: function() {
			// Clean up the listeners so it doesn't affect subsequent tests.
			CKEDITOR.tools.array.forEach( this.listeners, function( listener ) {
				listener.removeListener();
			} );

			this.sandbox.restore();
			this.editor.widgets.destroyAll( true );

			this.listeners = [];
			this.editor.uploadRepository.loaders = [];
		},

		setUp: function() {
			this.editorBot.setHtmlWithSelection( '<p>^</p>' );
		},

		// To test - test mixed dropped files types (e.g. 1 image, 1 text, 1 unsupported).

		'test dropping supported file type creates a widget': function() {
			var editor = this.editor;

			this._assertPasteFiles( editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function( widgets ) {
					assert.areSame( 1, widgets.length, 'Widgets count' );
					assert.areSame( widgets[ 0 ].name, 'testImageWidget', 'Widget name' );
				}
			} );
		},

		'test dropping unsupported file does not create a widget': function() {
			var editor = this.editor;

			this._assertPasteFiles( editor, {
				files: [ getTestHtmlFile() ],
				callback: function( widgets ) {
					assert.areSame( 0, widgets.length, 'Widgets count' );
				}
			} );
		},

		'test multiple files create multiple widgets': function() {
			var editor = this.editor;

			this._assertPasteFiles( editor, {
				files: [
					bender.tools.getTestPngFile(),
					bender.tools.getTestPngFile(),
					bender.tools.getTestPngFile()
				],
				callback: function( widgets ) {
					assert.areSame( 3, widgets.length, 'Widgets count' );
					assert.areSame( widgets[ 0 ].name, 'testImageWidget', 'Widget 0 name' );
					assert.areSame( widgets[ 1 ].name, 'testImageWidget', 'Widget 1 name' );
					assert.areSame( widgets[ 2 ].name, 'testImageWidget', 'Widget 2 name' );
				}
			} );
		},

		'test loader can be customized': function() {
			var editor = this.editor,
				originalLoader = editor.widgets.registered.testImageWidget.loaderType,
				CustomDummyType = sinon.spy( SuccessFileLoader );

			// Force a dummy loader.
			editor.widgets.registered.testImageWidget.loaderType = CustomDummyType;

			this._assertPasteFiles( editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function() {
					// Restore original loader.
					editor.widgets.registered.testImageWidget.loaderType = originalLoader;

					assert.areSame( 1, CustomDummyType.callCount, 'CustomDummyType constructor calls' );
				}
			} );
		},

		'test events': function() {
			var editor = this.editor,
				stubs = {
					uploadBegan: sinon.stub(),
					uploadDone: sinon.stub(),
					uploadFailed: sinon.stub()
				},
				that = this;

			this.listeners.push( editor.widgets.on( 'instanceCreated', function( evt ) {
				// Add spies to the widget.
				for ( var i in stubs ) {
					that.listeners.push( evt.data.on( i, stubs[ i ] ) );
				}
			} ) );

			this._assertPasteFiles( editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function() {
					assert.areSame( 1, stubs.uploadBegan.callCount, 'uploadBegan event count' );
					sinon.assert.calledWithExactly( stubs.uploadBegan, sinon.match.has( 'data', editor.uploadRepository.loaders[ 0 ] ) );

					assert.areSame( 1, stubs.uploadDone.callCount, 'uploadDone event count' );

					assert.areSame( 0, stubs.uploadFailed.callCount, 'uploadFailed event count' );
				}
			} );
		},

		'test upload error': function() {
			var editor = this.editor,
				stubs = {
					uploadBegan: sinon.stub(),
					uploadDone: sinon.stub(),
					uploadFailed: sinon.stub()
				},
				that = this,
				originalLoader = editor.widgets.registered.testImageWidget.loaderType;

			// Force a loader that will fail.
			editor.widgets.registered.testImageWidget.loaderType = FailFileLoader;

			this.listeners.push( editor.widgets.on( 'instanceCreated', function( evt ) {
				// Add spies to the widget.
				for ( var i in stubs ) {
					that.listeners.push( evt.data.on( i, stubs[ i ] ) );
				}
			} ) );

			this._assertPasteFiles( editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function( widgets ) {
					// Restore original loader.
					editor.widgets.registered.testImageWidget.loaderType = originalLoader;

					var loaderInstance = editor.uploadRepository.loaders[ 0 ];

					assert.areSame( 1, stubs.uploadBegan.callCount, 'uploadBegan event count' );
					sinon.assert.calledWithExactly( stubs.uploadBegan, sinon.match.has( 'data', loaderInstance ) );

					assert.areSame( 0, stubs.uploadDone.callCount, 'uploadDone event count' );

					assert.areSame( 1, stubs.uploadFailed.callCount, 'uploadFailed event count' );
					assert.areSame( loaderInstance, stubs.uploadFailed.args[ 0 ][ 0 ].data.sender, 'Event data.sender' );

					assert.areSame( 0, widgets.length, 'Widget count' );
				}
			} );
		},

		'test upload error event is cancelable': function() {
			var editor = this.editor,
				that = this,
				originalLoader = editor.widgets.registered.testImageWidget.loaderType;

			// Force a loader that will fail.
			editor.widgets.registered.testImageWidget.loaderType = FailFileLoader;

			this.listeners.push( editor.widgets.on( 'instanceCreated', function( evt ) {
				that.listeners.push( evt.data.on( 'uploadFailed', function( evt ) {
					evt.cancel();
				} ) );
			} ) );

			this._assertPasteFiles( editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function( widgets ) {
					editor.widgets.registered.testImageWidget.loaderType = originalLoader;

					assert.areSame( 1, widgets.length, 'Widget was not removed' );
				}
			} );
		},

		'test widgets can coexist side by side': function() {
			// In other tests we're using image widget, if text widget works it means they work side
			// by side just fine.
			var editor = this.editor;

			this._assertPasteFiles( editor, {
				files: [ bender.tools.getTestTxtFile() ],
				callback: function( widgets ) {
					assert.areSame( 1, widgets.length, 'Widgets count' );
					assert.areSame( 'testTextWidget', widgets[ 0 ].name, 'Widget name' );
				}
			} );
		},

		'test default progress reporter': function() {
			var imageBase = CKEDITOR.plugins.imagebase,
				createForElementSpy = this.sandbox.spy( imageBase.progressBar, 'createForElement' ),
				bindLoaderSpy = this.sandbox.spy( imageBase.progressBar.prototype, 'bindLoader' ),
				editor = this.editor;

			this._assertPasteFiles( this.editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function( widgets ) {
					assert.areSame( 1, createForElementSpy.callCount, 'ProgressBar.createForElement call count' );

					sinon.assert.calledWithExactly( createForElementSpy, widgets[ 0 ].element );

					sinon.assert.calledWithExactly( bindLoaderSpy, editor.uploadRepository.loaders[ 0 ] );
				}
			} );
		},

		'test progress reporter customization': function() {
			var CustomProgress = this.sandbox.spy( CKEDITOR.plugins.imagebase, 'progressBar' ),
				widgetDefinition = this.editor.widgets.registered.testImageWidget,
				originalProgress = widgetDefinition.progressIndicatorType;

			CustomProgress.createForElement = sinon.spy( function() {
				return new CustomProgress();
			} );

			widgetDefinition.progressIndicatorType = CustomProgress;


			this._assertPasteFiles( this.editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function() {
					widgetDefinition.progressIndicatorType = originalProgress;

					assert.areSame( 1, CustomProgress.callCount, 'ProgressBar.createForElement call count' );
				}
			} );
		},

		'test preventing default progress reporter with event': function() {
			// This test is a bit tricky, we need to add a new widget so that we can hook to widget.init method because
			// widget#instanceCreated event is fired too late for this assertion.
			var imageBase = CKEDITOR.plugins.imagebase,
				createForElementSpy = this.sandbox.spy( imageBase.progressBar, 'createForElement' ),
				editor = this.editor,
				disposableListeners = this.listeners,
				def = {
					name: 'progressPrevent',
					supportedTypes: /text\/html/,
					init: function() {
						disposableListeners.push( this.on( 'uploadBegan', function( evt ) {
							evt.cancel();
						} ) );
					}
				};

			imageBase.addImageWidget( editor, def.name, imageBase.addFeature( editor, 'upload', def ) );

			this._assertPasteFiles( editor, {
				files: [ getTestHtmlFile() ],
				callback: function() {
					// Remove progressPrevent widget, not to affect other test cases.
					editor.widgets.destroyAll( true );
					delete editor.widgets.registered.progressPrevent;

					assert.areSame( 0, createForElementSpy.callCount, 'ProgressBar.createForElement call count' );
				}
			} );
		},

		'test preventing default progress reporter with widgetDefinition.progressIndicatorType': function() {
			var createForElementSpy = this.sandbox.spy( CKEDITOR.plugins.imagebase.progressBar, 'createForElement' ),
				widgetDefinition = this.editor.widgets.registered.testImageWidget,
				originalProgress = widgetDefinition.progressIndicatorType;

			// Setting to null will disable loading bar.
			widgetDefinition.progressIndicatorType = null;

			this._assertPasteFiles( this.editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function() {
					widgetDefinition.progressIndicatorType = originalProgress;

					assert.areSame( 0, createForElementSpy.callCount, 'ProgressBar.createForElement call count' );
				}
			} );
		},

		'test dropping file into a readonly does not create a widget': function() {
			var editor = this.editor;

			editor.setReadOnly( true );

			this._assertPasteFiles( editor, {
				files: [ bender.tools.getTestPngFile() ],
				callback: function( widgets ) {
					editor.setReadOnly( false );

					assert.areSame( 0, widgets.length, 'Widgets count' );
				}
			} );
		},

		/*
		 * Main assertion for pasting files.
		 *
		 * @param {CKEDITOR.editor} editor
		 * @param {Object} options
		 * @param {File[]} [options.files=[]] Files to be dropped.
		 * @param {Function} options.callback Function to be called after the paste event.
		 * Params:
		 *
		 * * `CKEDITOR.plugins.widget[]` widgets - Array of widgets in a given editor.
		 * * `CKEDITOR.eventInfo` evt - Paste event.
		 */
		_assertPasteFiles: function( editor, options ) {
			var files = options.files || [],
				callback = options.callback;

			editor.once( 'paste', function( evt ) {
				// Unfortunately at the time being we need to do additional timeout here, as
				// the paste event gets cancelled.
				setTimeout( function() {
					resume( function() {
						callback( objToArray( editor.widgets.instances ), evt );
					} );
				}, 0 );
			}, null, null, -1 );


			pasteFiles( editor, files );

			wait();
		}
	};

	bender.test( tests );
} )();
