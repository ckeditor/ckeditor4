/* bender-tags: editor,clipboard,widget,filetools */
/* bender-ckeditor-plugins: uploadwidget */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js */
/* global pasteFiles */

'use strict';

( function() {
	var fileTools, File, resumeAfter, lastFormData;

	function createFileMock() {
		window.File = File = function( data, name ) {
			var file = new Blob( data , {} );
			file.name = name;

			return file;
		};
	}

	function createFormDataMock() {
		window.FormData = function() {
			var entries = {},
				mock = {
					get: function( name ) {
						return entries[ name ] || null;
					},
					append: function( name, value, fileName ) {
						if ( value instanceof File && ( value.name === fileName || !fileName ) )
							entries[ name ] = value;
						else if ( value instanceof Blob ) {
							fileName = fileName || value.name || 'blob';

							entries [ name ] = new File( [ value ], fileName );
						}
						else
							entries[ name ] = value + '';
					},
					has: function( name ) {
						return Object.prototype.hasOwnProperty.call( entries, name );
					}
				};

			return mock;
		};
	}

	function createXMLHttpRequestMock() {
		var basePath = bender.config.tests[ bender.testData.group ].basePath;

		window.XMLHttpRequest = function() {
			return {
				open: function() {},

				send: function( data ) {
					var xhr = this,
						uploaded = data.get( 'upload' ),
						responseData = {
							fileName: uploaded.name,
							uploaded: 1,
							url: '\/' + basePath + '_assets\/lena.jpg'
						};

					lastFormData = data;

					// xhr should be asynchronous.
					setTimeout( function() {
						xhr.status = 200;
						xhr.responseText = JSON.stringify( responseData );

						xhr.onload();
					}, 50 );
				}
			};
		};
	}

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
				this.replaceWith( 'uploaded' );
			}
		} );

		fileTools.addUploadWidget( editor, name, def );
	}

	bender.editor = {
		config: {
			extraPlugins: 'uploadwidget'
		}
	};

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'uploadwidget' );

			// IE doesn't support File constructor, so there is a need to mimic it.
			if ( typeof MSBlobBuilder === 'function' )
				createFileMock();

			File = window.File;

			var isEdge18 = CKEDITOR.env.edge && CKEDITOR.env.version >= 18;

			// FormData in IE & Chrome 47- supports only adding data, not getting it, so mocking (polyfilling?) is required.
			// Note that mocking is needed only for tests, as CKEditor.fileTools uses only append method.
			// Edge 18+ upstream issue breaks tests, workaround by forcing polyfill (#3184).
			// developer.microsoft.com/en-us/microsoft-edge/platform/issues/22326784

			if ( !FormData.prototype.get || !FormData.prototype.has || isEdge18 ) {
				createFormDataMock();
			}

			createXMLHttpRequestMock();

			fileTools = CKEDITOR.fileTools;

			resumeAfter = bender.tools.resumeAfter;
		},

		'test loadAndUpload with additional request parameters (integration test)': function() {
			var loader,
				bot = this.editorBot,
				editor = bot.editor,
				additionalRequestParameters = {
					foo: 'bar',
					file: { name: 'file', file: new File( [], 'file.png' ) }
				};

			addTestUploadWidget( editor, 'testLoadAndUpload', {
				additionalRequestParameters: additionalRequestParameters
			} );

			resumeAfter( editor, 'paste', function() {
				loader = editor.uploadRepository.loaders[ 0 ];

				resumeAfter( loader, 'uploaded', function() {
					var file = new File( [], 'file' );

					assert.areSame( 'bar', lastFormData.get( 'foo' ) );
					objectAssert.areEqual( file, lastFormData.get( 'file' ) );
				} );

				wait();
			} );

			pasteFiles( editor, [ bender.tools.getTestPngFile() ] );

			wait();
		}
	} );
} )();
