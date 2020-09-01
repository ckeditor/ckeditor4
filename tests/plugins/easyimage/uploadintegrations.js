/* bender-tags: editor, clipboard, upload */
/* bender-ckeditor-plugins: sourcearea, wysiwygarea, easyimage */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js, %BASE_PATH%/plugins/imagebase/features/_helpers/tools.js */
/* global imageBaseFeaturesTools, pasteFiles, assertPasteEvent */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// Disable ACF, we want to catch any uncontrolled junk.
			allowedContent: true,
			language: 'en'
		}
	};

	// Loader mock that successes asynchronously.
	function AsyncSuccessFileLoader( editor, fileOrData, fileName ) {
		CKEDITOR.fileTools.fileLoader.call( this, editor, fileOrData, fileName );
	}

	function AsyncFailFileLoader( editor, fileOrData, fileName ) {
		CKEDITOR.fileTools.fileLoader.call( this, editor, fileOrData, fileName );
	}

	var assertPasteFiles = imageBaseFeaturesTools.assertPasteFiles,
		tests = {
			init: function() {
				// We need to ignore entire test suit to prevent of fireing init, which breaks test suit on IE8-IE10.
				if ( !this.editor.plugins.easyimage.isSupportedEnvironment() ) {
					bender.ignore();
				}

				var sampleCloudServicesResponse = {
						210: '%BASE_PATH%/_assets/logo.png?w=210',
						420: '%BASE_PATH%/_assets/logo.png?w=420',
						630: '%BASE_PATH%/_assets/logo.png?w=630',
						840: '%BASE_PATH%/_assets/logo.png?w=840',
						1050: '%BASE_PATH%/_assets/logo.png?w=1050',
						1260: '%BASE_PATH%/_assets/logo.png?w=1260',
						1470: '%BASE_PATH%/_assets/logo.png?w=1470',
						1680: '%BASE_PATH%/_assets/logo.png?w=1680',
						1890: '%BASE_PATH%/_assets/logo.png?w=1890',
						2048: '%BASE_PATH%/_assets/logo.png?w=2048',
						'default': '%BASE_PATH%/_assets/logo.png'
					},
					failCloudServicesResponse = {
						statusCode: 400,
						error: 'Bad Request',
						message: 'Input buffer contains unsupported image format'
					};

				// Array of listeners to be cleared after each TC.
				this.listeners = [];
				this.sandbox = sinon.sandbox.create();

				this.editor.widgets.registered.easyimage.loaderType = AsyncSuccessFileLoader;

				this.editor.on( 'fileUploadResponse', function( evt ) {
					// Prevent this guy from picking up https://github.com/ckeditor/ckeditor4/blob/565d9c3a3613f35167d6555123b6ca316ead7ab9/plugins/filetools/plugin.js#L93-L122
					// it would complain about missing uploaded/error properties.
					evt.cancel();
				}, null, null, 5 );

				AsyncSuccessFileLoader.prototype = CKEDITOR.tools.extend( {
					upload: function() {
						var that = this;

						setTimeout( function() {
							that.changeStatus( 'uploading' );
						}, 0 );

						setTimeout( function() {
							that.update();
						}, 40 );

						setTimeout( function() {
							that.update();
						}, 120 );

						setTimeout( function() {
							var evtData = {
								sender: that
							};

							that.xhr = {
								readyState: 4
							};

							that._lastTimeout( evtData );
						}, 350 );
					},
					_lastTimeout: function( evtData ) {
						this.responseData = {
							response: sampleCloudServicesResponse
						};

						this.editor.fire( 'fileUploadResponse', evtData );
						this.changeStatus( 'uploaded' );
					}
				}, CKEDITOR.fileTools.fileLoader.prototype );

				AsyncFailFileLoader.prototype = CKEDITOR.tools.extend( {
					_lastTimeout: function( evtData ) {
						this.responseData = {
							response: failCloudServicesResponse
						};

						this.editor.fire( 'fileUploadResponse', evtData );
						this.changeStatus( 'error' );
					}
				}, AsyncSuccessFileLoader.prototype );
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
				if ( bender.config.isTravis && CKEDITOR.env.gecko ) {
					assert.ignore();
				}
				this.sandbox.stub( window, 'alert' );

				this.editorBot.setHtmlWithSelection( '<p>^</p>' );
			},

			// tp3390
			'test paste img as HTML': function() {
				var editor = this.editor,
					widgets;

				this.editorBot.setHtmlWithSelection( '<p>foo [bar] baz</p>' );

				editor.once( 'afterPaste', function() {
					resume( function() {
						widgets = bender.tools.objToArray( editor.widgets.instances );

						assert.areSame( 1, widgets.length, 'Widget count' );
						assert.areSame( 'easyimage', widgets[ 0 ].name, 'Widget type' );
						assert.areSame( bender.tools.pngBase64, widgets[ 0 ].parts.image.getAttribute( 'src' ), 'Image src attribute' );

						assert.beautified.html( CKEDITOR.document.getById( 'expected-image-base64' ).getHtml(), editor.getData(), 'Editor data' );

						this.listeners.push( widgets[ 0 ].once( 'uploadDone', function() {
							resume( function() {
								assert.areSame( '%BASE_PATH%/_assets/logo.png', widgets[ 0 ].parts.image.getAttribute( 'src' ), 'Image src after load' );
							} );
						} ) );

						wait();
					} );
				} );

				pasteFiles( editor, [], '<img src="' + bender.tools.pngBase64 + '">', { type: 'auto', method: 'paste' } );
				wait();
			},

			// tp3390
			'test paste multiple imgs as HTML': function() {
				var editor = this.editor,
					widgets;

				this.editorBot.setHtmlWithSelection( '<p>foo [bar] baz</p>' );

				editor.once( 'afterPaste', function() {
					resume( function() {
						widgets = bender.tools.objToArray( editor.widgets.instances );

						assert.areSame( 2, widgets.length, 'Widget count' );

						assert.areSame( 'easyimage', widgets[ 0 ].name, 'Widget 0 type' );
						assert.areSame( bender.tools.pngBase64, widgets[ 0 ].parts.image.getAttribute( 'src' ), 'Image 0 src attribute' );

						assert.areSame( 'easyimage', widgets[ 1 ].name, 'Widget 1 type' );
						assert.areSame( bender.tools.pngBase64, widgets[ 1 ].parts.image.getAttribute( 'src' ), 'Image 1 src attribute' );
						assert.beautified.html( CKEDITOR.document.getById( 'expected-multiple-image-base64' ).getHtml(), editor.getData(), 'Editor data' );
					} );
				} );

				pasteFiles( editor, [], '<img src="' + bender.tools.pngBase64 + '"><img src="' + bender.tools.pngBase64 + '">', { type: 'auto', method: 'paste' } );
				wait();
			},

			// #1529
			'test uploaded image has correct focus': function() {
				var editor = this.editor;

				this.listeners.push( this.editor.widgets.on( 'instanceCreated', function( evt ) {
					var widget = evt.data;
					if ( widget.name == 'easyimage' ) {
						widget.once( 'uploadDone', function() {
							resume( function() {
								assert.areSame( editor.window.getFrame(), CKEDITOR.document.getActive(), 'Focus should remain on editor frame' );
								assert.areSame( 'easyimage', editor.widgets.focused.name );
							} );
						} );
					}
				} ) );

				pasteFiles( editor, [ bender.tools.getTestPngFile() ], null, { type: 'auto', method: 'paste' } );

				wait();
			},

			'test pasting mixed HTML content': function() {
				var editor = this.editor,
					widgets;

				this.editorBot.setHtmlWithSelection( '<p>^</p>' );

				editor.once( 'afterPaste',  function() {
					resume( function() {
						widgets = bender.tools.objToArray( editor.widgets.instances );

						assert.areSame( 1, widgets.length, 'Widget count' );

						assert.beautified.html( CKEDITOR.document.getById( 'expected-mixed-content' ).getHtml(), editor.getData(), 'Editor data' );
					} );
				} );

				pasteFiles( editor, [], '<p>first<img src="' + bender.tools.pngBase64 + '">last</p>', { type: 'auto', method: 'paste' } );
				wait();
			},

			'test pasting mixed HTML content image inline': function() {
				var editor = this.editor,
					widgets;

				this.editorBot.setHtmlWithSelection( '<p>^</p>' );

				editor.once( 'afterPaste', function() {
					resume( function() {
						widgets = bender.tools.objToArray( editor.widgets.instances );

						assert.beautified.html( CKEDITOR.document.getById( 'expected-mixed-content-inline-img' ).getHtml(), editor.getData(), 'Editor data' );
					} );
				} );

				pasteFiles( editor, [], '<p>Imagine its a cool <img src="' + bender.tools.pngBase64 + '"> emoji!</p><p>It should work.</p>', { type: 'auto', method: 'paste' } );
				wait();
			},

			'test downcast does not include progress bar': function() {
				var editor = this.editor;

				this.sandbox.stub( URL, 'createObjectURL' ).returns( '%BASE_PATH%_assets/logo.png' );

				assertPasteFiles( editor, {
					files: [ bender.tools.getTestPngFile() ],
					callback: function() {
						var expected = CKEDITOR.document.getById( 'expected-progress-bar-downcast' ).getHtml(),
							// In Edge 18 test callback is fired before image width can be set.
							// Remove width attribute as it's irrelevant to this TC (#2057).
							actual = editor.getData().replace( 'width="163"', '' );

						assert.beautified.html( expected, actual );
					}
				} );
			},

			'test handling failed uploads': function() {
				var easyImageDef = this.editor.widgets.registered.easyimage,
					originalLoader = easyImageDef.loaderType;

				easyImageDef.loaderType = AsyncFailFileLoader;

				assertPasteFiles( this.editor, {
					files: [ bender.tools.getTestPngFile() ],
					fullLoad: true,
					callback: function( widgets ) {
						easyImageDef.loaderType = originalLoader;

						assert.areSame( 1, window.alert.callCount, 'Alert call count' );
						sinon.assert.alwaysCalledWith( window.alert, 'Your image could not be uploaded due to a network error.' );

						// Widget should be removed.
						assert.areSame( 0, widgets.length, 'Widgets count' );
					}
				} );
			},

			'test nothing explodes when upload finishes in a different mode': function() {
				// Test edge case: changing editor mode during upload.
				var editor = this.editor,
					disposableListeners = this.listeners;

				assertPasteFiles( editor, {
					files: [ bender.tools.getTestPngFile() ],
					callback: function( widgets ) {
						assert.areSame( 1, widgets.length, 'Widgets count' );

						// Switch to source mode, this is where the XHR request will complete.
						editor.setMode( 'source', function() {
							// And now listen for fileLoader#uploaded (in source mode).
							disposableListeners.push( editor.uploadRepository.loaders[ 0 ].on( 'uploaded', function() {
								// Switch back to wysiwyg to not affect other tests.
								editor.setMode( 'wysiwyg', function() {
									resume( function() {
										assert.isTrue( true );
									} );
								} );
							}, null, null, 999 ) );
						} );

						wait();
					}
				} );
			},

			'test copy and paste in progress widget while original was loaded': function() {
				// Yet another tricky variation.
				// 1. In This case user starts to upload file that takes say 1 sec.
				// 2. Copies the file during the upload.
				// 3. Wait for the file upload to complete.
				// 4. Then paste what he has in clipboard (incomplete) widget as a new widget.
				var editor = this.editor,
					doneEventSpy = sinon.spy(),
					firstWidgetHtml;

				this.listeners.push( this.editor.widgets.on( 'instanceCreated', function( evt ) {
					var widget = evt.data;
					if ( widget.name == 'easyimage' ) {
						// Both widgets will share the same spy.
						widget.on( 'uploadDone', doneEventSpy );

						if ( !firstWidgetHtml ) {
							widget.once( 'ready', function() {
								firstWidgetHtml = widget.wrapper.getOuterHtml();
							} );
						}
					}
				} ) );

				assertPasteFiles( editor, {
					files: [ bender.tools.getTestPngFile() ],
					fullLoad: true,
					callback: function() {
						var rng = editor.createRange(),
							editable = editor.editable();

						rng.setStart( editable, CKEDITOR.POSITION_BEFORE_END );
						rng.setEnd( editable, CKEDITOR.POSITION_BEFORE_END );

						editor.getSelection().selectRanges( [ rng ] );

						// This time we need to use assertPasteEventas assertPasteFiles applies uploadDone
						// listeners **after** the DOM is inserted, which is too late.
						assertPasteEvent( editor, {
							dataValue: firstWidgetHtml
						}, function() {
							assert.isTrue( true );
							var widgets = editor.widgets.instances,
								keys = CKEDITOR.tools.object.keys( widgets );

							assert.areSame( '%BASE_PATH%/_assets/logo.png', widgets[ keys[ 0 ] ].parts.image.getAttribute( 'src' ), 'Widget#0 src' );
							assert.areSame( '%BASE_PATH%/_assets/logo.png', widgets[ keys[ 1 ] ].parts.image.getAttribute( 'src' ), 'Widget#1 src' );
						}, null, true, true );
					}
				} );
			},

			// #1730
			'test required upload command': function() {
				assert.isNotUndefined( this.editor.getCommand( 'easyimageUpload' ), 'Upload command is present in editor' );
			}

		};

	bender.test( tests );
} )();
