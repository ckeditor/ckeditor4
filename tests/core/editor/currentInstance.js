/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		// (#589)
		'test currentInstance after editor destroy': function() {
			this.editor.fire( 'focus' );
			this.editor.on( 'destroy', function() {
				setTimeout( function() {
					resume( function() {
						assert.isNull( CKEDITOR.currentInstance );
					} );
				} );
			} );

			assert.areSame( this.editor, CKEDITOR.currentInstance );

			this.editor.destroy();
			wait();
		}
	} );
} )();
