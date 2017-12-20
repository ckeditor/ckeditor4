/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog,filebrowser,filetools,clipboard */

( function() {
	'use strict';

	function mockInput( dialog, submit ) {
		return sinon.stub( dialog, 'getContentElement', function() {
			return {
				getInputElement: function() {
					return {
						$: {
							files: [
								new File( [ '' ], 'sample.png' )
							],
							value: 'C:\\fakepath\\sample.gif',
							form: ( new CKEDITOR.dom.element( 'form' ) ).$
						}
					};
				},
				getAction: function() {
					return 'http://url-to-php-form';
				},
				submit: submit
			};
		} );
	}

	bender.editors = {
		xhr: {
			config: {
				xmlHttpRequestHeaders: {
					foo: 'bar',
					hello: 'world'
				},
				filebrowserUploadUrl: 'foo',
				filebrowserUploadMethod: 'xhr',
				lang: 'en'
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
		_should: {
			ignore: {
				'test for XHR request': CKEDITOR.env.ie && CKEDITOR.env.version < 9
			}
		},

		setUp: function() {
			this.xhr = sinon.useFakeXMLHttpRequest();
			var requests = this.requests = [];

			this.xhr.onCreate = function( xhr ) {
				requests.push( xhr );
			};
		},

		tearDown: function() {
			this.xhr.restore();
		},

		'test for xhr request': function() {
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

		'test for xhr loader error': function() {
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
