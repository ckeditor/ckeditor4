/* bender-tags: editor, 1057, notification */
/* bender-ckeditor-plugins: notification */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test Notification should not leak the global scope': function() {
			// Web Notification Api is not supported by IE.
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			assert.isFunction( Notification );
			assert.beautified.js( 'function Notification() { [native code] }', Notification.toString() );
		}
	} );
} )();
