/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: magicline,sourcearea,wysiwygarea */

( function() {
	'use strict';

	bender.editor = { creator: 'replace' };

	bender.test( {
		'fast switching between modes': function() {
			var tc = this,
				editor = this.editor,
				counter = 5,
				errorCaught = false;

			function loop() {
				if ( --counter ) {
					try {
						editor.setMode( editor.mode == 'source' ? 'wysiwyg' : 'source', loop );
					} catch ( e ) {
						errorCaught = true;
					}
				} else {
					tc.resume( function() {
						assert.areEqual( 0, counter );
						assert.isFalse( errorCaught, 'Error shouldn\'t be caught.' );
					} );
				}
			}

			loop();
			tc.wait();
		}
	} );

} )();