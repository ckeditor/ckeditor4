/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,undo,notification */

'use strict';

function assertNotifications( editor, expectedNotifications ) {
	var actualNotifications = editor._.notificationArea.notifications;

	assert.areSame( expectedNotifications.length, actualNotifications.length, 'Expected and actual notifications count are different' );

	for ( var i = 0; i < expectedNotifications.length; i++ ) {
		assertNotification( expectedNotifications[ i ], actualNotifications[ i ] );
	}
}

function assertNotification( expectedNotification, actualNotification ) {
	assert.areSame( expectedNotification.message, actualNotification.message, 'Message should be the same.' );
	assert.areSame( expectedNotification.type, actualNotification.type, 'Type should be the same.' );
	assert.areSame( expectedNotification.duration, actualNotification.duration, 'Duration should be the same.' );
	if ( actualNotification.type == 'progresss' ) {
		assert.areSame( expectedNotification.progress, actualNotification.progress, 'Progress should be the same.' );
	}
	assertNotificationElement( expectedNotification, actualNotification.element );
}

function assertNotificationElement( expectedNotification, element ) {
	var messageElement = element.findOne( '.cke_notification_message' ),
		progressElement = element.findOne( '.cke_notification_progress' );


	assert.areSame( expectedNotification.message, messageElement.getHtml(), 'Element message should be the same.' );

	if ( typeof expectedNotification.alert === 'undefined' ) {
		expectedNotification.alert = true;
	}

	assert.areSame( expectedNotification.alert, element.getAttribute( 'role' ) === 'alert', 'Role should be alert.' );

	switch ( expectedNotification.type ) {
		case 'info':
		case 'warning':
		case 'success':
			assert.isTrue( element.hasClass( 'cke_notification_' + expectedNotification.type ), 'Element should have proper class.' );
			assert.isNull( progressElement );
			break;
		case 'progress':
			assert.isTrue( element.hasClass( 'cke_notification_info' ), 'Element should have proper class.' );
			assert.isObject( progressElement, 'There should be a progress element.' );
			if ( expectedNotification.progress ) {
				assert.areSame( Math.round( expectedNotification.progress * 100 ) + '%', progressElement.getStyle( 'width' ) );
			} else {
				assert.areSame( '0%', progressElement.getStyle( 'width' ) );
			}
			break;
	}
}

bender.editor = {
	config: {
		extraPlugins: 'toolbar,undo,notification',
		notification_duration: 100
	}
};

var listener;

bender.test( {
	tearDown: function() {
		var editor = this.editor,
			notifications = editor._.notificationArea.notifications;

		while ( notifications.length ) {
			editor._.notificationArea.remove( notifications[ 0 ] );
		}

		editor.removeListener( 'notificationShow', listener );
		editor.removeListener( 'notificationUpdate', listener );
		editor.removeListener( 'notificationHide', listener );

		if ( this.clock ) {
			this.clock.restore();
		}
	},

	'test showNotification info': function() {
		var editor = this.editor;

		editor.showNotification( 'Foo' );

		assertNotifications( editor, [ { message: 'Foo', type: 'info' } ] );
	},

	'test showNotification warning': function() {
		var editor = this.editor;

		editor.showNotification( 'Foo', 'warning' );

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );
	},

	'test showNotification error': function() {
		var editor = this.editor;

		editor.showNotification( 'Foo', 'error', 3000 );

		assertNotifications( editor, [ { message: 'Foo', type: 'error', duration: 3000 } ] );
	},

	'test showNotification progress': function() {
		var editor = this.editor;

		editor.showNotification( 'Foo', 'progress', 0.4 );

		assertNotifications( editor, [ { message: 'Foo', type: 'progress', progress: 0.4 } ] );
	},

	'test isVisible': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		assert.isFalse( notification.isVisible(), 'Before show' );

		notification.show();

		assert.isTrue( notification.isVisible(), 'After show' );

		notification.hide();

		assert.isFalse( notification.isVisible(), 'After hide' );
	},

	'test close after timeout - info': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'info', duration: 100 } );

		assertNotifications( editor, [] );

		this.clock = sinon.useFakeTimers();

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'info', duration: 100 } ] );

		this.clock.tick( 110 );

		assertNotifications( editor, [] );
	},

	'test close after timeout - warning': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } );

		assertNotifications( editor, [] );

		this.clock = sinon.useFakeTimers();

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );

		this.clock.tick( 110 );

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );
	},

	'test close after timeout - default value': function() {
		var tc = this;

		bender.editorBot.create( {
			creator: 'inline',
			name: 'editor_duration',
			config: {
				extraPlugins: 'toolbar,undo,notification'
			}
		},
		function( bot ) {
			var editor = bot.editor,
				notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

			tc.clock = sinon.useFakeTimers();

			notification.show();

			assertNotifications( editor, [ { message: 'Foo', type: 'info', alert: true } ] );

			tc.clock.tick( 4900 );

			assertNotifications( editor, [ { message: 'Foo', type: 'info', alert: true } ] );

			tc.clock.tick( 5100 );

			assertNotifications( editor, [] );
		} );
	},

	'test remove close timeout after update': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'info' } );

		this.clock = sinon.useFakeTimers();

		notification.show();

		notification.update( { type: 'warning' } );

		this.clock.tick( 110 );

		assertNotifications( editor, [ { message: 'Foo', type: 'warning', alert: false } ] );
	},

	'test close using X': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );

		notification.element.findOne( '.cke_notification_close' ).fire( 'click' );

		assertNotifications( editor, [] );
	},

	'test close using ESC': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } ),
			doc = new CKEDITOR.dom.document( document ),
			ariaElement;

		this.clock = sinon.useFakeTimers();

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );

		editor.fire( 'key', { keyCode: 27, domEvent: { getKey: sinon.stub().returns( 27 ) } } ); /* ESC */

		assertNotifications( editor, [] );

		ariaElement = doc.findOne( 'div[aria-live="assertive"][aria-atomic="true"]' );
		assert.isObject( ariaElement, 'Aria element should be created.' );

		this.clock.tick( 110 );

		ariaElement = doc.findOne( 'div[aria-live="assertive"][aria-atomic="true"]' );
		assert.isNull( ariaElement, 'Aria element should be removed.' );
	},

	'test close using ESC (twice)': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );

		editor.fire( 'key', { keyCode: 27, domEvent: { getKey: sinon.stub().returns( 27 ) } } ); /* ESC */

		assertNotifications( editor, [] );

		editor.fire( 'key', { keyCode: 27, domEvent: { getKey: sinon.stub().returns( 27 ) } } ); /* ESC */

		assertNotifications( editor, [] ); // nothing should happen
	},

	'test do not close on other than ESC key': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );

		editor.fire( 'key', { keyCode: 65, domEvent: { getKey: sinon.stub().returns( 65 ) } } ); /* A */

		assertNotifications( editor, [ { message: 'Foo', type: 'warning' } ] );
	},

	'test update shown message': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'info', alert: true } ] );

		notification.update( { message: 'Bar' } );

		assertNotifications( editor, [ { message: 'Bar', type: 'info', alert: false } ] );
	},

	'test update hidden message': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		assertNotifications( editor, [] );
		assertNotification( { message: 'Foo', type: 'info', alert: true }, notification );

		notification.update( { message: 'Bar' } );

		assertNotifications( editor, [] );
		assertNotification( { message: 'Bar', type: 'info', alert: false }, notification );
	},

	'test update shown message - important': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'info', alert: true } ] );

		notification.update( { message: 'Bar', important: true } );

		assertNotifications( editor, [ { message: 'Bar', type: 'info', alert: true } ] );
	},

	'test update hidden message - important': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		assertNotifications( editor, [] );
		assertNotification( { message: 'Foo', type: 'info', alert: true }, notification );

		notification.update( { message: 'Bar', important: true } );

		assertNotifications( editor, [ { message: 'Bar', type: 'info', alert: true } ] );
	},

	'test update type': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'info', alert: true } ] );

		notification.update( { type: 'warning' } );

		assertNotifications( editor, [ { message: 'Foo', type: 'warning', alert: false } ] );
	},

	'test update progress': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'info' } ] );

		notification.update( { type: 'progress', progress: 0 } );

		assertNotifications( editor, [ { message: 'Foo', type: 'progress', progress: 0, alert: false } ] );

		notification.update( { type: 'progress', progress: 0.5 } );

		assertNotifications( editor, [ { message: 'Foo', type: 'progress', progress: 0.5, alert: false } ] );

		notification.update( { type: 'progress', progress: 1 } );

		assertNotifications( editor, [ { message: 'Foo', type: 'progress', progress: 1, alert: false } ] );

		notification.update( { type: 'success' } );

		assertNotifications( editor, [ { message: 'Foo', type: 'success', alert: false } ] );
	},

	'test notification change type if progress is set': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo', type: 'warning' } );

		notification.show();

		assertNotifications( editor, [ { message: 'Foo', type: 'warning', alert: true } ] );

		notification.update( { progress: 0.5 } );

		assertNotifications( editor, [ { message: 'Foo', type: 'progress', progress: 0.5, alert: false } ] );
	},

	'test notificationShow event': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		listener = sinon.stub().returns( false );

		this.editor.on( 'notificationShow', listener );

		notification.show();

		assert.isTrue( listener.calledOnce );

		assertNotifications( editor, [] );
	},

	'test notificationUpdate event': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		listener = sinon.stub().returns( false );

		this.editor.on( 'notificationUpdate', listener );

		notification.show();

		notification.update( { type: 'warning' } );

		assert.isTrue( listener.calledOnce );

		assertNotifications( editor, [ { message: 'Foo', type: 'warning', alert: false } ] );
	},

	'test notificationUpdate event do not show if event canceled': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		listener = sinon.stub().returns( false );

		this.editor.on( 'notificationUpdate', listener );

		notification.update( { important: true } );

		assert.isTrue( listener.calledOnce );

		assertNotifications( editor, [] );
	},

	'test notificationHide event': function() {
		var editor = this.editor,
			notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		listener = sinon.stub().returns( false );

		this.editor.on( 'notificationHide', listener );

		notification.show();

		notification.hide();

		assert.isTrue( listener.calledOnce );

		assertNotifications( editor, [ { message: 'Foo', type: 'info', alert: true } ] );
	}
} );