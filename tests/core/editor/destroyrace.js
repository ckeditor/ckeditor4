/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.test( {
		// (#718, #2257)
		'test destroy editor on instance created': function() {
			var init = sinon.spy(),
				editor;

			CKEDITOR.plugins.add( 'test', {
				init: init
			} );

			CKEDITOR.tools.setTimeout( function() {
				resume( function() {
					editor.on( 'destroy', function() {
						// Another  timeout as the plugins are also loaded in a timeout launched during editor creation.
						CKEDITOR.tools.setTimeout( function() {
							resume( function() {
								assert.isFalse( init.called, 'Plugin init called when editor already destroyed' );
							} );
						}, 150 );
					} );

					// Init called synchronously, we can't test it.
					if ( init.called ) {
						assert.ignore();
					}

					editor.destroy();

					wait();

				} );
			}, 0 );

			editor = CKEDITOR.replace( 'destroyed', {
				plugins: 'test'
			} );

			wait();
		}
	} );
} )();
