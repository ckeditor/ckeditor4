/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog,filebrowser,filetools,clipboard */
/* bender-include: ../filetools/_helpers/tools.js */
/* global fileTools */

( function() {
	'use strict';

	function mockInput( dialog, submit ) {
		return sinon.stub( dialog, 'getContentElement' ).returns( {
			getInputElement: function() {
				var ret = {
					$: {
						value: 'C:\\fakepath\\sample.gif',
						form: ( new CKEDITOR.dom.element( 'form' ) ).$
					}
				};

				if ( CKEDITOR.fileTools.isFileUploadSupported ) {
					// Only modern browsers will contain files property.
					ret.$.files = [
						new File( [ '' ], 'sample.png' )
					];
				}

				return ret;
			},
			getAction: function() {
				return 'http://url-to-php-form';
			},
			submit: submit
		} );
	}

	bender.editors = {
		xhr: {
			config: {
				fileTools_requestHeaders: {
					foo: 'bar',
					hello: 'world'
				},
				filebrowserUploadUrl: 'foo',
				filebrowserUploadMethod: 'xhr',
				language: 'en'
			}
		},

		xhrCkf: {
			config: {
				filebrowserUploadUrl: 'upload/?command=QuickUpload'
			}
		},

		xhrCkfJson: {
			config: {
				filebrowserUploadUrl: 'upload/?command=QuickUpload&responseType=json'
			}
		},

		submitCkf: {
			config: {
				filebrowserUploadUrl: 'upload/?command=QuickUpload',
				filebrowserUploadMethod: 'form'
			}
		},

		submit: {
			config: {
				filebrowserUploadUrl: 'foo',
				filebrowserUploadMethod: 'form'
			}
		}
	};

	CKEDITOR.on( 'instanceLoaded', function() {
		CKEDITOR.dialog.add( 'testDialog', function() {
			return {
				title: 'Test Dialog',
				contents: [
					{
						id: 'Upload',
						hidden: true,
						filebrowser: 'uploadButton',
						label: 'Upload input',
						elements: [ {
							type: 'file',
							id: 'upload',
							label: 'Load file',
							style: 'height:40px',
							size: 38
						},
						{
							type: 'fileButton',
							id: 'uploadButton',
							filebrowser: 'Upload:upload',
							label: 'Send',
							'for': [ 'Upload', 'upload' ]
						} ]
					}
				]
			};
		} );
	} );

	bender.test( {
		setUp: function() {
			fileTools.mockFileType();

			this.xhr = sinon.useFakeXMLHttpRequest();
			var requests = this.requests = [];

			this.xhr.onCreate = function( xhr ) {
				requests.push( xhr );
			};
		},

		tearDown: function() {
			this.xhr.restore();
		},

		'test for XHR request': function() {
			if ( !CKEDITOR.fileTools.isFileUploadSupported ) {
				assert.ignore();
			}

			var editor = this.editors.xhr,
				bot = this.editorBots.xhr;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var sendButton = dialog.getContentElement( 'Upload', 'uploadButton' ),
					inputStub = mockInput( dialog );

				// Execute just after XHR request is generated;
				editor.once( 'fileUploadRequest', function() {
					resume( function() {
						arrayAssert.isNotEmpty( this.requests );
						objectAssert.areEqual( { 'foo': 'bar', 'hello': 'world' }, this.requests[ 0 ].requestHeaders );
						dialog.hide();
						inputStub.restore();
					} );
				}, null, null, 1000 );

				sendButton.click();
				wait();
			} );
		},

		// (#1835)
		'test for XHR request to CKFinder (no responseType parameter)': function() {
			if ( !CKEDITOR.fileTools.isFileUploadSupported ) {
				assert.ignore();
			}

			var editor = this.editors.xhrCkf,
				bot = this.editorBots.xhrCkf;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var sendButton = dialog.getContentElement( 'Upload', 'uploadButton' ),
					inputStub = mockInput( dialog );

				// Execute just after XHR request is generated;
				editor.once( 'fileUploadRequest', function() {
					resume( function() {
						assert.isMatching( /responseType=json/g, this.requests[ 0 ].url, 'responseType parameter was added' );
						dialog.hide();
						inputStub.restore();
					} );
				}, null, null, 1000 );

				sendButton.click();
				wait();
			} );
		},

		// (#1835)
		'test for XHR request to CKFinder (responseType parameter present)': function() {
			if ( !CKEDITOR.fileTools.isFileUploadSupported ) {
				assert.ignore();
			}

			var editor = this.editors.xhrCkfJson,
				bot = this.editorBots.xhrCkfJson;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var sendButton = dialog.getContentElement( 'Upload', 'uploadButton' ),
					inputStub = mockInput( dialog );

				// Execute just after XHR request is generated;
				editor.once( 'fileUploadRequest', function() {
					resume( function() {
						assert.areSame( 1, this.requests[ 0 ].url.match( /responseType=json/g ).length,
							'responseType parameter count' );
						dialog.hide();
						inputStub.restore();
					} );
				}, null, null, 1000 );

				sendButton.click();
				wait();
			} );
		},

		// (#1835)
		'test for XHR request not to CKFinder (responseType parameter)': function() {
			if ( !CKEDITOR.fileTools.isFileUploadSupported ) {
				assert.ignore();
			}

			var editor = this.editors.xhr,
				bot = this.editorBots.xhr;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var sendButton = dialog.getContentElement( 'Upload', 'uploadButton' ),
					inputStub = mockInput( dialog );

				// Execute just after XHR request is generated;
				editor.once( 'fileUploadRequest', function() {
					resume( function() {
						assert.isNotMatching( /responseType=json/g, this.requests[ 0 ].url, 'responseType parameter is not added' );
						dialog.hide();
						inputStub.restore();
					} );
				}, null, null, 1000 );

				sendButton.click();
				wait();
			} );
		},

		'test for submit form': function() {
			var editor = this.editors.submit,
				bot = this.editorBots.submit;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var sendButton = dialog.getContentElement( 'Upload', 'uploadButton' ),
					mockSubmit = sinon.spy(),
					inputStub = mockInput( dialog, mockSubmit );

				sendButton.click();
				assert.isTrue( mockSubmit.called, 'Submit method should be used.' );
				inputStub.restore();
				dialog.hide();
			} );
		},

		// (#1835)
		'test form action with CKFinder': function() {
			var editor = this.editors.submitCkf,
				bot = this.editorBots.submitCkf;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var input = dialog.getContentElement( 'Upload', 'upload' );

				assert.isNotMatching( /responseType=json/g, input.action, 'responseType parameter is not added' );
				dialog.hide();
			} );
		},

		'test for xhr loader error': function() {
			if ( !CKEDITOR.fileTools.isFileUploadSupported ) {
				assert.ignore();
			}

			var editor = this.editors.xhr,
				bot = this.editorBots.xhr;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var sendButton = dialog.getContentElement( 'Upload', 'uploadButton' ),
					inputStub = mockInput( dialog );

				var alertStub = sinon.stub( window, 'alert' );

				editor.once( 'fileUploadRequest', function( evt ) {
					var loader = evt.data.fileLoader;
					loader.once( 'error', function() {
						resume( function() {
							sinon.assert.calledWithExactly( alertStub, 'HTTP error occurred during file upload (403: Forbidden).' );
							assert.isTrue( sendButton.isEnabled(), 'Button should be enabled after error' );

							dialog.hide();
							inputStub.restore();
							alertStub.restore();
						} );
					} );

					assert.isFalse( sendButton.isEnabled(), 'Button should be disabled during upload' );

					// Simulate loading error
					loader.xhr.status = 403;
					loader.xhr.onload();
				} );

				sendButton.click();
				wait();
			} );
		},

		'test for xhr loader abort': function() {
			if ( !CKEDITOR.fileTools.isFileUploadSupported ) {
				assert.ignore();
			}

			var editor = this.editors.xhr,
				bot = this.editorBots.xhr;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var sendButton = dialog.getContentElement( 'Upload', 'uploadButton' ),
					inputStub = mockInput( dialog );

				var alertStub = sinon.stub( window, 'alert' );

				editor.once( 'fileUploadRequest', function( evt ) {
					var loader = evt.data.fileLoader;
					loader.once( 'abort', function() {
						resume( function() {
							assert.isTrue( alertStub.called, 'Abort message should appear' );
							assert.isTrue( sendButton.isEnabled(), 'Button should be enabled after abort' );

							dialog.hide();
							inputStub.restore();
							alertStub.restore();
						} );
					} );

					assert.isFalse( sendButton.isEnabled(), 'Button should be disabled during upload' );

					loader.changeStatus( 'abort' );
				} );

				sendButton.click();
				wait();
			} );
		}
	} );
} )();
