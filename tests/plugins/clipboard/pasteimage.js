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
		'test pasting unsupported image type shows notification': function() {
			var editor = this.editor,
				expectedMsgRegex  = prepareNotificationRegex( this.editor.lang.clipboard.fileFormatNotSupportedNotification ),
				expectedDuration = editor.config.clipboard_notificationDuration,
				notificationSpy = sinon.spy( editor, 'showNotification' );

			FileReader.setFileMockType( 'image/webp' );
			FileReader.setReadResult( 'load' );

			bender.tools.selection.setWithHtml( this.editor, '<p>Paste image here:{}</p>' );
			this.assertPaste( {
				type: 'image/webp',
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

		// (#5095)
		'test pasting `image/x-icon` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/x-icon' );
		},

		// (#5095)
		'test pasting `image/apng` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/apng' );
		},

		// (#5095)
		'test pasting `image/webp` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/webp' );
		},

		// (#5095)
		'test pasting `image/svg` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/svg' );
		},

		// (#5095)
		'test pasting `image/vnd.ms-photo` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/vnd.ms-photo' );
		},

		// (#5095)
		'test pasting `image/bmp` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/bmp' );
		},

		// (#5095)
		'test pasting `image/x-bmp` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/x-bmp' );
		},

		// (#5095)
		'test pasting `image/jpm` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/jpm' );
		},

		// (#5095)
		'test pasting `image/jpx` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/jpx' );
		},

		// (#5095)
		'test pasting `image/jp2` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/jp2' );
		},

		// (#5095)
		'test pasting `image/xbm` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/xbm' );
		},

		// (#5095)
		'test pasting `image/xbitmap` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/xbitmap' );
		},

		// (#5095)
		'test pasting `image/jxr` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/jxr' );
		},

		// (#5095)
		'test pasting `image/tiff-fx` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/tiff-fx' );
		},

		// (#5095)
		'test pasting `image/tiff` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/tiff' );
		},

		// (#5095)
		'test pasting `image/avif` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/avif' );
		},

		// (#5095)
		'test pasting `image/heif` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/heif' );
		},

		// (#5095)
		'test pasting `image/heic` type will not show notification when custom type will be allowed': function() {
			assertNotificationWithCustomImageType( this.editor, this, 'image/heic' );
		},

		assertPaste: function( options ) {
			assertImagePaste( this.editor, options );
		}
	} );

	function prepareNotificationRegex( notification ) {
		var formatsGroup = '[a-z,\\s]+',
			regexp = '^' + notification.replace( /\$\{formats\}/g, formatsGroup ) + '$';

		return new RegExp( regexp, 'gi' );
	}

	// (#5095)
	function assertNotificationWithCustomImageType( editor, bend, mimeType ) {
		var notificationSpy = sinon.spy( editor, 'showNotification' );

		CKEDITOR.plugins.clipboard.setIgnoredImageMimeType( [ mimeType ] );

		FileReader.setFileMockType( mimeType );
		FileReader.setReadResult( 'load' );

		bender.tools.selection.setWithHtml( editor, '<p>Paste image here:{}</p>' );
		bend.assertPaste( {
			type: mimeType,
			expected: '<p>Paste image here:^</p>',
			callback: function() {
				notificationSpy.restore();
				assert.areSame( 0, notificationSpy.callCount,
					'Notification should not be shown when type ' + mimeType + ' is added as supported' );
			}
		} );
	}
} )();
