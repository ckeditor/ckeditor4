/* bender-tags: editor, clipboard, upload */
/* bender-ckeditor-plugins: sourcearea, wysiwygarea, easyimage */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js, %BASE_PATH%/plugins/imagebase/features/_helpers/tools.js */
/* bender-include: %BASE_PATH%/plugins/widget/_helpers/tools.js */
/* global imageBaseFeaturesTools, pasteFiles, widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// Disable ACF, we want to catch any uncontrolled junk.
			allwoedContent: true
		}
	};

	// Loader mock that successes asynchronously.
	function AsyncSuccessFileLoader( editor, fileOrData, fileName ) {
		CKEDITOR.fileTools.fileLoader.call( this, editor, fileOrData, fileName );
	}

	var assertPasteFiles = imageBaseFeaturesTools.assertPasteFiles,
		tests = {
			init: function() {
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
				};

				// Array of listeners to be cleared after each TC.
				this.listeners = [];
				this.sandbox = sinon.sandbox.create();

				this.editor.widgets.registered.easyimage.loaderType = AsyncSuccessFileLoader;

				this.editor.on( 'fileUploadResponse', function( evt ) {
					// Prevent this guy from picking up https://github.com/ckeditor/ckeditor-dev/blob/565d9c3a3613f35167d6555123b6ca316ead7ab9/plugins/filetools/plugin.js#L93-L122
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
						}, 200 );

						setTimeout( function() {
							that.update();
						}, 400 );

						setTimeout( function() {
							var evtData = {
								sender: that
							};

							that.responseData = {
								response: sampleCloudServicesResponse
							};

							that.editor.fire( 'fileUploadResponse', evtData );
							that.changeStatus( 'uploaded' );
						}, 1000 );
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
				if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) {
					assert.ignore();
				}

				this.editorBot.setHtmlWithSelection( '<p>^</p>' );
			},

			// tp3390
			'test paste img as HTML': function() {
				var editor = this.editor,
					widgets;

				this.editorBot.setHtmlWithSelection( '<p>foo [bar] baz</p>' );

				pasteFiles( editor, [], '<img src="' + bender.tools.pngBase64 + '">' );
				widgets = widgetTestsTools.obj2Array( editor.widgets.instances );

				assert.areSame( 1, widgets.length, 'Widget count' );
				assert.areSame( 'easyimage', widgets[ 0 ].name, 'Widget type' );
				assert.areSame( bender.tools.pngBase64, widgets[ 0 ].parts.image.getAttribute( 'src' ), 'Image src attribute' );

				assert.beautified.html( CKEDITOR.document.getById( 'expected-image-base64' ).getHtml(), editor.getData(), 'Editor data' );
			},

			// tp3390
			'test paste multiple imgs as HTML': function() {
				var editor = this.editor,
					widgets;

				this.editorBot.setHtmlWithSelection( '<p>foo [bar] baz</p>' );

				pasteFiles( editor, [], '<img src="' + bender.tools.pngBase64 + '"><img src="' + bender.tools.pngBase64 + '">' );
				widgets = widgetTestsTools.obj2Array( editor.widgets.instances );

				assert.areSame( 2, widgets.length, 'Widget count' );

				assert.areSame( 'easyimage', widgets[ 0 ].name, 'Widget 0 type' );
				assert.areSame( bender.tools.pngBase64, widgets[ 0 ].parts.image.getAttribute( 'src' ), 'Image 0 src attribute' );

				assert.areSame( 'easyimage', widgets[ 1 ].name, 'Widget 1 type' );
				assert.areSame( bender.tools.pngBase64, widgets[ 1 ].parts.image.getAttribute( 'src' ), 'Image 1 src attribute' );

				assert.beautified.html( CKEDITOR.document.getById( 'expected-multiple-image-base64' ).getHtml(), editor.getData(), 'Editor data' );
			},

			'test downcast does not include progress bar': function() {
				var editor = this.editor;

				this.sandbox.stub( URL, 'createObjectURL' ).returns( '%BASE_PATH%_assets/logo.png' );

				assertPasteFiles( editor, {
					files: [ bender.tools.getTestPngFile() ],
					callback: function() {
						assert.beautified.html( CKEDITOR.document.getById( 'expected-progress-bar-downcast' ).getHtml(), editor.getData() );
					}
				} );
			},

			// To test - edge case: changing mode during upload.
			'test nothing explodes when upload finishes in a different mode': function() {
				var editor = this.editor,
					disposableListeners = this.listeners;

				assertPasteFiles( editor, {
					files: [ bender.tools.getTestPngFile() ],
					callback: function( widgets ) {
						assert.areSame( 1, widgets.length, 'Widgets count' );

						var doneSpy = sinon.spy();
						disposableListeners.push( widgets[ 0 ].on( 'uploadDone', doneSpy ) );

						editor.setMode( 'source', function() {
							resume( function() {
								// It's unlikely, but theoretically possible that upload will complete before
								// the mode is changed. Inform about this case.
								assert.isFalse( doneSpy.called, 'Race condition didn\'t occur' );

								disposableListeners.push( widgets[ 0 ].once( 'uploadDone', function() {
									editor.setMode( 'wysiwyg', function() {
										resume( function() {
											assert.isTrue( true );
										} );
									} );
								} ) );

								wait();
							} );
						} );

						wait();
					}
				} );
			}
		};

	bender.test( tests );
} )();
