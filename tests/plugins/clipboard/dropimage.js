/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */
/* bender-include: _helpers/pasting.js */
/* globals assertImageDrop, mockFileReader */

( function() {
	'use strict';

	var setHtmlWithSelection = bender.tools.setHtmlWithSelection,
		originalFileReader = window.FileReader;

	bender.editor = {
		config: {
			allowedContent: true,
			language: 'en'
		}
	};

	var tests = {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			mockFileReader();
			CKEDITOR.plugins.clipboard.resetDragDataTransfer();
		},

		tearDown: function() {
			window.FileReader = originalFileReader;
		},

		'test drop .png image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/png',
				expected = '<p class="p">Paste image here:<img src="data:image/png;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertImageDrop( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		'test drop .jpeg image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/jpeg',
				expected = '<p class="p">Paste image here:<img src="data:image/jpeg;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertImageDrop( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		'test drop .gif image': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/gif',
				expected = '<p class="p">Paste image here:<img src="data:image/gif;base64,fileMockBase64=" /></p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertImageDrop( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		'test drop unsupported image type': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'application/pdf',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertImageDrop( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		// (#4750)
		'test dropping unsupported image type shows notification': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'application/pdf',
				expectedData = '<p class="p">Paste image here:</p>',
				expectedMsgRegex  = prepareNotificationRegex( this.editor.lang.clipboard.fileFormatNotSupportedNotification ),
				expectedDuration = this.editor.config.clipboard_notificationDuration,
				notificationSpy = sinon.spy( this.editor, 'showNotification' );

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'load' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertImageDrop(  {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expectedData,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				},
				callback: function() {
					notificationSpy.restore();

					assert.areSame( 1, notificationSpy.callCount, 'There was only one notification' );
					assert.isMatching( expectedMsgRegex, notificationSpy.getCall( 0 ).args[ 0 ],
						'The notification had correct message' );
					assert.areSame( 'info', notificationSpy.getCall( 0 ).args[ 1 ],
					'The notification had correct type' );
					assert.areSame( expectedDuration, notificationSpy.getCall( 0 ).args[ 2 ],
						'The notification had correct duration' );
				}
			} );
		},

		// (#5431)
		'test dropping image when the clipboard_handleImages configuration option is OFF displays notification about unsupported image type':
			function() {
				var originalClipboard_handleImages = CKEDITOR.config.clipboard_handleImages;
				CKEDITOR.config.clipboard_handleImages = false;

				var dropEvt = bender.tools.mockDropEvent(),
					imageType = 'image/png',
					expectedData = '<p class="p">Paste image here:</p>',
					expectedMsgRegex  = prepareNotificationRegex( this.editor.lang.clipboard.fileFormatNotSupportedNotification ),
					expectedDuration = this.editor.config.clipboard_notificationDuration,
					notificationSpy = sinon.spy( this.editor, 'showNotification' );

				FileReader.setFileMockType( imageType );
				FileReader.setReadResult( 'load' );

				setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
				assertImageDrop(  {
					editor: this.editor,
					event: dropEvt,
					type: imageType,
					expectedData: expectedData,
					dropRange: {
						dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
						dropOffset: 17
					},
					callback: function() {
						notificationSpy.restore();

						assert.areSame( 1, notificationSpy.callCount, 'There was only one notification' );
						assert.isMatching( expectedMsgRegex, notificationSpy.getCall( 0 ).args[ 0 ],
							'The notification had correct message' );
						assert.areSame( 'info', notificationSpy.getCall( 0 ).args[ 1 ],
						'The notification had correct type' );
						assert.areSame( expectedDuration, notificationSpy.getCall( 0 ).args[ 2 ],
							'The notification had correct duration' );
					}
				} );
				CKEDITOR.config.clipboard_handleImages = originalClipboard_handleImages;
			},

		'test abort drop': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/png',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'abort' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertImageDrop( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		},

		'test failed drop': function() {
			var dropEvt = bender.tools.mockDropEvent(),
				imageType = 'image/gif',
				expected = '<p class="p">Paste image here:</p>';

			FileReader.setFileMockType( imageType );
			FileReader.setReadResult( 'error' );

			setHtmlWithSelection( this.editor, '<p class="p">Paste image here:^</p>' );
			assertImageDrop( {
				editor: this.editor,
				event: dropEvt,
				type: imageType,
				expectedData: expected,
				dropRange: {
					dropContainer: this.editor.editable().findOne( '.p' ).getChild( 0 ),
					dropOffset: 17
				}
			} );
		}
	};

	bender.test( tests );

	function prepareNotificationRegex( notification ) {
		// Escape (s)
		notification = notification.replace( /[()]/g, '\\$&' );

		var formatsGroup = '<em>[a-z/]+<\/em>',
			regexp = '^' + notification.replace( /\$\{formats\}/g, formatsGroup ) + '$';

		return new RegExp( regexp, 'gi' );
	}
} )();
