/* bender-ckeditor-plugins: notification */

( function() {
	'use strict';

	bender.editor = {
		config: {
			width: 800,
			height: 400
		}
	};

	bender.test( {
		'test for appearing in editable area': function() {
			var editor = this.editor;

			editor.once( 'notificationShow', function( evt ) {
				// just wait after entire call stack will be free, so notification will be visible.
				setTimeout( function() {
					resume( function() {
						var contentRect = editor.ui.contentsElement.getClientRect(),
							notificationRect = evt.data.notification.element.getClientRect();

						assert.areSame( 'foo', evt.data.notification.message );
						assert.areSame( 'warn', evt.data.notification.type );

						// editor size should be enought to kept message inside editable
						bender.assert.isNumberInRange( parseInt( notificationRect.left, 10 ), parseInt( contentRect.left, 10 ), parseInt( contentRect.right, 10 ) );
						bender.assert.isNumberInRange( parseInt( notificationRect.right, 10 ), parseInt( contentRect.left, 10 ), parseInt( contentRect.right, 10 ) );
						bender.assert.isNumberInRange( parseInt( notificationRect.top, 10 ), parseInt( contentRect.top, 10 ), parseInt( contentRect.bottom, 10 ) );
						bender.assert.isNumberInRange( parseInt( notificationRect.bottom, 10 ), parseInt( contentRect.top, 10 ), parseInt( contentRect.bottom, 10 ) );

						evt.data.notification.hide();
					} );
				}, 0 );
			} );

			editor.showNotification( 'foo', 'warn' );
			wait();
		},

		'test for disappering notifications': function() {
			var editor = this.editor;

			editor.once( 'notificationShow', function( evt ) {
				setTimeout( function() {
					evt.data.notification.hide();
				} );
			} );

			editor.once( 'notificationHide', function( evt ) {
				assert.areSame( 'bar', evt.data.notification.message );
				assert.areSame( 'info', evt.data.notification.type );

				assert.isTrue( evt.data.notification.isVisible() );
				setTimeout( function() {
					resume();
					assert.isFalse( evt.data.notification.isVisible() );
					evt.data.notification.hide();
				}, 0 );
			} );

			editor.showNotification( 'bar', 'info' );
			wait();
		}
	} );
} )();
