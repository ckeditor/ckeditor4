/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */
/* bender-include: _helpers/pasting.js */
/* globals mockFileReader, assertImagePaste */

( function() {
	'use strict';

	var originalFileReader = window.FileReader;

	bender.editor = {
		config: {
			allowedContent: true,
			language: 'en'
		}
	};

	bender.test( {
		setUp: function() {
			// (#4612).
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}

			mockFileReader();
			this.editor.focus();
		},

		tearDown: function() {
			window.FileReader = originalFileReader;
		},

		'test paste .png from clipboard': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'image/png',
				expected: '<p>Paste image here:<img data-cke-saved-src="data:image/png;base64,fileMockBase64=" src="data:image/png;base64,fileMockBase64=" />^@</p>'
			} );
		},

		'test paste .jpeg from clipboard': function() {
			FileReader.setFileMockType( 'image/jpeg' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'image/jpeg',
				expected: '<p>Paste image here:<img data-cke-saved-src="data:image/jpeg;base64,fileMockBase64=" src="data:image/jpeg;base64,fileMockBase64=" />^@</p>'
			} );
		},

		'test paste .gif from clipboard': function() {
			FileReader.setFileMockType( 'image/gif' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'image/gif',
				expected: '<p>Paste image here:<img data-cke-saved-src="data:image/gif;base64,fileMockBase64=" src="data:image/gif;base64,fileMockBase64=" />^@</p>'
			} );
		},

		'test unsupported file type': function() {
			FileReader.setFileMockType( 'application/pdf' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'application/pdf',
				expected: '<p>Paste image here:^@</p>'
			} );
		},

		// (#4750)
		'test pasting unsupported file type shows notification': function() {
			var editor = this.editor,
				expectedMsgRegex  = prepareNotificationRegex( this.editor.lang.clipboard.fileFormatNotSupportedNotification ),
				expectedDuration = editor.config.clipboard_notificationDuration,
				notificationSpy = sinon.spy( editor, 'showNotification' );

			FileReader.setFileMockType( 'application/pdf' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'application/pdf',
				expected: '<p>Paste image here:^@</p>',
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
		'test pasting image when the clipboard_handleImages configuration option is OFF displays notification about unsupported image type':
			function() {
				var originalClipboard_handleImages = CKEDITOR.config.clipboard_handleImages;
				CKEDITOR.config.clipboard_handleImages = false;

				var editor = this.editor,
					expectedMsgRegex  = prepareNotificationRegex( this.editor.lang.clipboard.fileFormatNotSupportedNotification ),
					expectedDuration = editor.config.clipboard_notificationDuration,
					notificationSpy = sinon.spy( editor, 'showNotification' );

				FileReader.setFileMockType( 'image/png' );
				FileReader.setReadResult( 'load' );

				bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
				this.assertPaste( {
					type: 'image/png',
					expected: '<p>Paste image here:^@</p>',
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

		'test aborted paste': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'abort' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'image/png',
				expected: '<p>Paste image here:^@</p>'
			} );
		},

		'test failed paste': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'error' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'image/png',
				expected: '<p>Paste image here:^@</p>'
			} );
		},

		// (#3585, #3625)
		'test pasting image alongside other content': function() {
			FileReader.setFileMockType( 'image/png' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>{}</p>' );
			this.assertPaste( {
				type: 'image/png',
				expected: '<p><strong>whateva^</strong>@</p><p></p>',
				additionalData: [
					{ type: 'text/html', data: '<strong>whateva</strong>' }
				]
			} );
		},

		assertPaste: function( options ) {
			assertImagePaste( this.editor, options );
		}
	} );

	function prepareNotificationRegex( notification ) {
		notification = notification.replace( /[()]/g, '\\$&' );

		var formatsGroup = '<em>[a-z/]+<\/em>',
			regexp = '^' + notification.replace( /\$\{formats\}/g, formatsGroup ) + '$';

		return new RegExp( regexp, 'gi' );
	}
} )();
