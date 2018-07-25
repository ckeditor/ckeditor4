/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.test( {
		// (#2257)
		'test destroy editor on instance created': function() {
			var init = sinon.spy(),
				editor;

			CKEDITOR.plugins.add( 'test', {
				init: init
			} );

			// Note that resumes under the hood causes yet another setTimeout(). If it was wrapped with other timeout (for readability)
			// it failed on IE8, due to yet another race condition.
			resume( function() {
				editor.on( 'destroy', function() {
					// Seemingly redundant timeout here, as the plugins are also loaded in a timeout launched during editor creation.
					setTimeout( function() {
						resume( function() {
							assert.isFalse( init.called, 'plugin init called when editor already destroyed' );
						} );
					}, 150 );
				} );

				editor.destroy();

				wait();
			} );

			editor = CKEDITOR.replace( 'destroyed', {
				plugins: 'test'
			} );

			wait();
		}
	} );
} )();
