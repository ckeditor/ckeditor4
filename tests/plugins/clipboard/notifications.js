/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard */
/* bender-include: _helpers/pasting.js */
/* bender-include: %BASE_PATH%/plugins/imagebase/features/_helpers/tools.js */
/* global imageBaseFeaturesTools */

( function() {
	'use strict';

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

	var pasteFiles = imageBaseFeaturesTools.pasteFiles,
		tests = {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}
		},

		'test showing notification for unsupported file types should emphasize file type': function( editor ) {
			var notificationSpy = sinon.spy( editor, 'showNotification' ),
				notificationMessage = 'The <em>image/webp</em> file format(s) are not supported.',
				file = [ { name: 'test.webp', type: 'image/webp' } ];

			pasteFiles( editor, file );

			resume( function() {
				notificationSpy.restore();

				assert.areSame( 1, notificationSpy.callCount, 'Notification should be called once' );
				assert.areSame( notificationMessage, notificationSpy.getCall( 0 ).args[ 0 ],
					'The notification has incorrect message' );
				assert.areSame( 'info', notificationSpy.getCall( 0 ).args[ 1 ],
					'The notification type is incorrect' );
			}, 50 );

			wait();
		},

		'test showing proper notification for file without type': function( editor ) {
			var notificationSpy = sinon.spy( editor, 'showNotification' ),
				notificationMessage = 'The file format is not supported.',
				file = [ { name: 'test1.xyz', type: '' } ];

			pasteFiles( editor, file );

			resume( function() {
				notificationSpy.restore();

				assert.areSame( 1, notificationSpy.callCount, 'Notification should be called once' );
				assert.areSame( notificationMessage, notificationSpy.getCall( 0 ).args[ 0 ],
					'The notification has incorrect message' );
				assert.areSame( 'info', notificationSpy.getCall( 0 ).args[ 1 ],
					'The notification type is incorrect' );
			}, 50 );

			wait();
		},

		'test notification should not be displayed when paste event do not contain files': function( editor ) {
			var notificationSpy = sinon.spy( editor, 'showNotification' ),
				file = [];

			pasteFiles( editor, file );

			resume( function() {
				notificationSpy.restore();
				assert.areSame( 0, notificationSpy.callCount, 'Notification should not be be called' );
			}, 50 );

			wait();
		},

		'test notification should not be displayed when paste event contains also dataValue': function( editor ) {
			var notificationSpy = sinon.spy( editor, 'showNotification' ),
				file = [ { name: 'test.webp', type: 'image/webp' } ],
				dataValue = '<p>I should take precedence over files!</p>';

			pasteFiles( editor, file, dataValue );

			resume( function() {
				notificationSpy.restore();
				assert.areSame( 0, notificationSpy.callCount, 'Notification should not be be called' );
			}, 50 );

			wait();
		},

		'test showing notification for unsupported file types': function( editor ) {
			var notificationSpy = sinon.spy( editor, 'showNotification' ),
				notificationMessage = 'The <em>image/cke, image/cks</em> file format(s) are not supported.',
				files = [
					{ name: 'test1.cke', type: 'image/cke' },
					{ name: 'test2.cks', type: 'image/cks' }
				];

			pasteFiles( editor, files );

			resume( function() {
				notificationSpy.restore();

				assert.areSame( 1, notificationSpy.callCount, 'Notification should be called once' );
				assert.areSame( notificationMessage, notificationSpy.getCall( 0 ).args[ 0 ],
					'The notification has incorrect message' );
				assert.areSame( 'info', notificationSpy.getCall( 0 ).args[ 1 ],
					'The notification type is incorrect' );
			}, 50 );

			wait();
		},

		'test showing notification for unsupported file types should not contain repeated types': function( editor ) {
			var notificationSpy = sinon.spy( editor, 'showNotification' ),
				notificationMessage = 'The <em>image/webp</em> file format(s) are not supported.',
				files = [
					{ name: 'test1.webp', type: 'image/webp' },
					{ name: 'test2.webp', type: 'image/webp' }
				];

			pasteFiles( editor, files );

			resume( function() {
				notificationSpy.restore();

				assert.areSame( 1, notificationSpy.callCount, 'Notification should be called once' );
				assert.areSame( notificationMessage, notificationSpy.getCall( 0 ).args[ 0 ],
					'The notification has incorrect message' );
				assert.areSame( 'info', notificationSpy.getCall( 0 ).args[ 1 ],
					'The notification type is incorrect' );
			}, 50 );

			wait();
		},

		'test notification should contain only information about unsupported file types': function( editor ) {
			var notificationSpy = sinon.spy( editor, 'showNotification' ),
				notificationMessage = 'The <em>application/pdf</em> file format(s) are not supported.',
				files = [
					{ name: 'supported.png', type: 'image/png' },
					{ name: 'unsupported.pdf', type: 'application/pdf' }
				];

			pasteFiles( editor, files );

			resume( function() {
				notificationSpy.restore();

				assert.areSame( 1, notificationSpy.callCount, 'Notification should be called once' );
				assert.areSame( notificationMessage, notificationSpy.getCall( 0 ).args[ 0 ],
					'The notification has incorrect message' );
				assert.areSame( 'info', notificationSpy.getCall( 0 ).args[ 1 ],
					'The notification type is incorrect' );
			}, 50 );

			wait();
		},

		// (#5431)
		'test notification with information about unsupported file types should be displayed when the clipboard_handleImages is disabled': function( editor ) {
			var originalClipboard_handleImages = CKEDITOR.config.clipboard_handleImages;
			CKEDITOR.config.clipboard_handleImages = false;

			var notificationSpy = sinon.spy( editor, 'showNotification' ),
				notificationMessage = 'The <em>image/jpeg, image/png, image/gif</em> file format(s) are not supported.',
				files = [
					{ name: 'test.jpeg', type: 'image/jpeg' },
					{ name: 'test.png', type: 'image/png' },
					{ name: 'test.gif', type: 'image/gif' }
				];

			pasteFiles( editor, files );

			resume( function() {
				CKEDITOR.config.clipboard_handleImages = originalClipboard_handleImages;

				notificationSpy.restore();

				assert.areSame( 1, notificationSpy.callCount, 'Notification should be called once' );
				assert.areSame( notificationMessage, notificationSpy.getCall( 0 ).args[ 0 ],
					'The notification has incorrect message' );
				assert.areSame( 'info', notificationSpy.getCall( 0 ).args[ 1 ],
					'The notification type is incorrect' );
			}, 50 );

			wait();
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
