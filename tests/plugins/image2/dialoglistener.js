/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: wysiwygarea, image2, dialog, link  */

( function() {
	'use strict';

	bender.test( {
		'test dialog listener removed after editor destroy': function() {
			CKEDITOR.replace( 'editor', {
				on: {
					instanceReady: function() {
						var listeners = CKEDITOR._.events.dialogDefinition.listeners,
							listener = listeners[ listeners.length - 1 ];

						this.on( 'destroy', function() {
							resume( function() {
								arrayAssert.doesNotContain( listener, listeners, 'Listener is removed' );
							} );
						} );

						this.destroy();
					}
				}
			} );

			wait();
		}
	} );
} )();
