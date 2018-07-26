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

			CKEDITOR.tools.setTimeout( function() {
				resume( function() {
					editor.on( 'destroy', function() {
						// Another  timeout as the plugins are also loaded in a timeout launched during editor creation.
						setTimeout( function() {
							resume( function() {
								assert.isFalse( init.called, 'plugin init called when editor already destroyed' );
							} );
						}, 150 );
					} );

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
