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

	var tests = {
		init: function() {
			// ProgressBar = CKEDITOR.plugins.imagebase.progressBar;

			// CKEDITOR.event.implementOn( loaderMock );

			// // Store the content of #nested-sandbox - it will be used to restore original HTML
			// // before each test case.
			// this.nestedSandbox = doc.getById( 'nested-sandbox' );
			// this._nestedSandboxContent = this.nestedSandbox.getHtml();
			var plugin = CKEDITOR.plugins.imagebase,
				editor = this.editor,
				imageWidgetDef = {
					name: 'testImageWidget',
					supportedTypes: /image\/(jpeg|png)/
				},
				textWidgetDef = {
					name: 'testTextWidget',
					supportedTypes: /text\/plain/
				};

			plugin.addImageWidget( editor, imageWidgetDef.name, plugin.addFeature( editor, 'upload', imageWidgetDef ) );

			plugin.addImageWidget( editor, textWidgetDef.name, plugin.addFeature( editor, 'upload', textWidgetDef ) );
		},

		setUp: function() {
			this.editor.widgets.destroyAll( true );
			this.editorBot.setHtmlWithSelection( '<p>^</p>' );
		},

		// To test - dropped file type (matching) - possible enhancement: function.
		// To test - multiple dropped files type (matching).
		// To test - event firing.
		// To test - loader customization.
		// To test - progress bar customization.
		// To test - multiple widgets can use the feature side by side.
		// To test - edge case: changing mode during upload.
		// To test - edge case: dropping into readonly editor.

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

		'test widgets can exist side by side': function() {
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
