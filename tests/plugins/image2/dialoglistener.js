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
							listener = listeners[ 0 ];

						this.on( 'destroy', function() {
							resume( function() {
								assert.areNotSame( listeners[ 0 ], listener, 'Listener is removed.' );
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
