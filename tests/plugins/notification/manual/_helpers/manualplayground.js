/* global editor, console */
/* exported manualPlayground */

'use strict';

var manualPlayground = {
	init: function() {
		editor.on( 'notificationShow', function( evt ) {
			console.log( evt );
		} );
		editor.on( 'notificationUpdate', function( evt ) {
			console.log( evt );
		} );
		editor.on( 'notificationHide', function( evt ) {
			console.log( evt );
		} );
	},

	emulateProgress: function() {
		var notification = editor.showNotification( 'Uploading image.png', 'progress', 0 ),
			scenario = [
				{ progress: 0.05, message: 'Uploading image.png 5%...' },
				{ progress: 0.1, message: 'Uploading image.png 10%...' },
				{ progress: 0.15, message: 'Uploading image.png 15%...' },
				{ progress: 0.2, message: 'Uploading image.png 20%...' },
				{ progress: 0.25, message: 'Uploading image.png 25%...' },
				{ progress: 0.3, message: 'Uploading image.png 30%...' },
				{ progress: 0.35, message: 'Uploading image.png 35%...' },
				{ progress: 0.4, message: 'Uploading image.png 40%...' },
				{ progress: 0.45, message: 'Uploading image.png 45%...' },
				{ progress: 0.5, message: 'Uploading image.png 50%...' },
				{ progress: 0.55, message: 'Uploading image.png 55%...' },
				{ progress: 0.6, message: 'Uploading image.png 60%...' },
				{ progress: 0.65, message: 'Uploading image.png 65%...' },
				{ progress: 0.7, message: 'Uploading image.png 70%...' },
				{ progress: 0.75, message: 'Uploading image.png 75%...' },
				{ progress: 0.8, message: 'Uploading image.png 80%...' },
				{ progress: 0.85, message: 'Uploading image.png 85%...' },
				{ progress: 0.9, message: 'Uploading image.png 90%...' },
				{ progress: 0.95, message: 'Uploading image.png 95%...' },
				{ type: 'success', message: 'File image.png uploaded.', important: true }
			];

		var interval = setInterval( function() {
			if ( !scenario.length ) {
				clearInterval( interval );
			} else {
				notification.update( scenario.shift() );
			}
		}, 300 );
	},

	showWarning: function() {
		editor.showNotification( 'Vitae risus eget ante <a href="http://test/">mau</a> convallis.', 'warning' );
	},

	showSuccess: function() {
		editor.showNotification( 'Success!', 'success' );
	},

	showInfo: function() {
		editor.showNotification( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae risus eget ante mae convallis.', 'info' );
	}
};
