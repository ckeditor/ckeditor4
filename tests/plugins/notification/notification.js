/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,undo,notification */

'use strict';

function assertNotifications( editor, expectedNotifications ) {
	var actualNotifications = editor.notificationArea.notifications;

	assert.areSame( expectedNotifications.length, actualNotifications.length, 'Expected and actual notifications are different' );

	for ( var i = 0; i < expectedNotifications.length; i++ ) {
		assertNotification( expectedNotifications[ i ], actualNotifications[ i ] );
	}
}

function assertNotification( expectedNotification, actualNotification ) {
	assert.areSame( expectedNotification.message, actualNotification.message, 'Message should be the same.' );
	assert.areSame( expectedNotification.type, actualNotification.type, 'Type should be the same.' );
	assert.areSame( expectedNotification.progress, actualNotification.progress, 'Progress should be the same.' );
	assert.areSame( expectedNotification.duration, actualNotification.duration, 'Duration should be the same.' );

	assertNotificationElement( expectedNotification, actualNotification.element );
}

function assertNotificationElement( expectedNotification, element ) {
	var messageElement = element.findOne( '.cke_notification_message' ),
		progressElement = element.findOne( '.cke_notification_progress' );

	assert.areSame( expectedNotification.message, messageElement.getHtml(), 'Element message should be the same.' );

	switch ( expectedNotification.type ) {
		case 'info':
		case 'warning':
		case 'success':
			assert.isTrue( element.hasClass( 'cke_notification_' + expectedNotification.type ), 'Element should have proper class.' );
			assert.isNull( progressElement );
			break;
		case 'progress':
			assert.isTrue( element.hasClass( 'cke_notification_info' ), 'Element should have proper class.' );
			assert.isObject( progressElement );
			assert.areSame( Math.round( expectedNotification.progress * 100 ) + '%', progressElement.getStyle( 'width' ) );
			break;
	}
}

bender.editor = {
	config: {
		extraPlugins: 'toolbar,undo,notification',
		notification_duration: 100
	}
};

bender.test( {
	tearDown: function() {
		var editor = this.editor,
			notifications = editor.notificationArea.notifications;

		for ( var i = 0; i < notifications.length; i++ ) {
			editor.notificationArea.remove( notifications[ i ] );
		}
	},

	'showNotification info': function() {
		var editor = this.editor;

		editor.showNotification( 'Foo' );

		assertNotifications( editor, [ { message: 'Foo', type: 'info' } ] );
	},

	'showNotification warning': function() {
		var editor = this.editor;

		editor.showNotification( 'Foo', 'warning' );

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );
	},

	'showNotification error': function() {
		var editor = this.editor;

		editor.showNotification( 'Foo', 'error', 3000 );

		assertNotifications( editor, [ { message: 'Foo', type: 'error', duration: 3000 } ] );
	},

	'showNotification progress': function() {
		var editor = this.editor;

		editor.showNotification( 'Foo', 'progress', 0.4 );

		assertNotifications( editor, [ { message: 'Foo', type: 'progress', progress: 0.4 } ] );
	},

	'close after change - info': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'info', duration: 100 } );

		assertNotifications( editor, [] );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'info', duration: 100 } ] );

		wait( function() {
			assertNotifications( editor, [ { message: 'Foo', type: 'info', duration: 100 } ] );
			editor.fire( 'change' );
			wait( function() {
				assertNotifications( editor, [] );
			}, 110 );
		}, 110 );
	},

	'close after change - warning': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } );

		assertNotifications( editor, [] );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );

		wait( function() {
			assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );
			editor.fire( 'change' );
			wait( function() {
				assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );
			}, 110 );
		}, 110 );
	},

	'close using X': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );

		notification.element.findOne( '.cke_notification_close' ).fire( 'click' );

		assertNotifications( editor, [] );
	},

	'close using ESC': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } ),
			document = new CKEDITOR.dom.document( document ),
			ariaElement;

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );

		editor.fire( 'key', { keyCode: 27 /* ESC */ } );

		assertNotifications( editor, [] );

		ariaElement = document.findOne( '[position:fixed;margin-left:-9999]' );
		assert.isObject( ariaElement, 'Aria element should be created.' );

		wait( function() {
			ariaElement = document.findOne( '[position:fixed;margin-left:-9999]' );
			assert.isNull( ariaElement, 'Aria element should be removed.' );
		}, 110 );
	}
} );