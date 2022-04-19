/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */
/* bender-include: _helpers/pasting.js */
/* globals assertImageDrop, mockFileReader */

( function() {
	'use strict';

	var setHtmlWithSelection = bender.tools.setHtmlWithSelection,
		originalFileReader = window.FileReader;

	var config = {
		allowedContent: true,
		language: 'en'
	};

	bender.editors = {
		classic: {
			config: config
		},
		inline: {
			creator: 'inline',
			config: config
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

			for ( var name in this.editors ) {
				this.editors[ name ].config.clipboard_disableNotification = false;
				this.editors[ name ].config.clipboard_ignoreNotificationsForImages = false;
				this.editors[ name ].config.clipboard_ignoreNotificationsForNonImages = false;
				this.editors[ name ].config.clipboard_ignoreNotificationsForExtensions = [];
			}
		},

		'test dropping unsupported file extension shows notification': function( editor ) {
			assertDropFile( editor, 'application/pdf', 1 );
		},

		'test dropping unsupported file extension do not shows notification when they are disabled': function( editor ) {
			editor.config.clipboard_disableNotification = true;

			assertDropFile( editor, 'application/zip', 0 );
		},

		'test dropping unsupported image extension do not shows notification when notifications are disabled and ignoring notifications for unsupported images is enabled': function( editor ) {
			editor.config.clipboard_disableNotification = true;
			editor.config.clipboard_ignoreNotificationsForImages = false;

			assertDropFile( editor, 'application/jp2', 0 );
		},

		'test dropping unsupported file extension do not shows notification when notifications are disabled and ignoring notifications for unsupported non-images is enabled': function( editor ) {
			editor.config.clipboard_disableNotification = true;
			editor.config.clipboard_ignoreNotificationsForNonImages = false;

			assertDropFile( editor, 'application/zip', 0 );
		},

		'test dropping unsupported file extension do not shows notification when notifications are disabled and ignoring notifications for specific unsupported extensions is enabled': function( editor ) {
			editor.config.clipboard_disableNotification = true;
			editor.config.clipboard_ignoreNotificationsForExtensions = [ 'pdf' ];

			assertDropFile( editor, 'application/pdf', 0 );
		},

		// jscs:disable maximumLineLength
		'test dropping unsupported image extension shows notification when ignoring notifications for non-images is enabled and ignoring notifications for unsupported image extensions is disabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForImages = false;
			editor.config.clipboard_ignoreNotificationsForNonImages = true;

			assertDropFile( editor, 'image/webp', 1 );
		},

		// jscs:disable maximumLineLength
		'test dropping unsupported file extension shows notification when ignoring notifications for non-images is disabled and ignoring notifications for unsupported image extensions is enabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForImages = true;
			editor.config.clipboard_ignoreNotificationsForNonImages = false;

			assertDropFile( editor, 'application/pdf', 1 );
		},

		'test dropping unsupported file extension do not shows notification when ignoring notifications for images and non-images is enabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForImages = true;
			editor.config.clipboard_ignoreNotificationsForNonImages = true;

			assertDropFile( editor, 'application/pdf', 0 );
		},

		'test dropping unsupported image extension do not shows notification when ignoring notifications for images and non-images is enabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForImages = true;
			editor.config.clipboard_ignoreNotificationsForNonImages = true;

			assertDropFile( editor, 'image/webp', 0 );
		},

		'test dropping unsupported image extension do not shows notification when ignoring notifications for images is disabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForImages = true;

			assertDropFile( editor, 'image/webp', 0 );
		},

		'test dropping unsupported file extension do not shows notification when ignoring notifications for non-images is disabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForNonImages = true;

			assertDropFile( editor, 'application/pdf', 0 );
		},

		'test dropping unsupported file extension do not shows notification when ignoring notifications for specific extensions is disabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForExtensions = [ 'pdf' ];

			assertDropFile( editor, 'application/pdf', 0 );
		},

		'test dropping unsupported image extension shows notification when ignoring notifications for non-images is disabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForNonImages = false;

			assertDropFile( editor, 'image/webp', 1 );
		},

		'test dropping unsupported file extension shows notification when ignoring notifications for images is disabled': function( editor ) {
			editor.config.clipboard_ignoreNotificationsForImages = false;

			assertDropFile( editor, 'image/webp', 1 );
		}
	};

	function assertDropFile( editor, fileType, expectedNotificationCount ) {
		var dropEvt = bender.tools.mockDropEvent(),
			expectedData = '<p class="p">Paste file here:</p>',
			notificationSpy = sinon.spy( editor, 'showNotification' );

		FileReader.setFileMockType( fileType );
		FileReader.setReadResult( 'load' );

		setHtmlWithSelection( editor, '<p class="p">Paste file here:^</p>' );

		assertImageDrop( {
			editor: editor,
			event: dropEvt,
			type: fileType,
			expectedData: expectedData,
			dropRange: {
				dropContainer: editor.editable().findOne( '.p' ).getChild( 0 ),
				dropOffset: 16
			},
			callback: function() {
				notificationSpy.restore();

				assert.areSame( expectedNotificationCount, notificationSpy.callCount,
					'Expected notification call count is incorrect' );
			}
		} );
	}

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
