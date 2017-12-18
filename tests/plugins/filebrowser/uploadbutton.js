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
				filebrowserUploadUrl: 'foo'
			}
		},
		submit: {
			config: {
				filebrowserUploadUrl: 'foo',
				filebrowser_forceFormSubmit: true
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

		'test for XHR request': function() {
			var editor = this.editors.xhr,
				bot = this.editorBots.xhr;

			editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
			bot.dialog( 'testDialog', function( dialog ) {
				var sendButton = dialog.getContentElement( 'Upload', 'uploadButton' ),
					inputStub = mockInput( dialog );

				// Execute just after XHR request is generated;
				editor.on( 'fileUploadRequest', function() {
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
		}
	} );
} )();
