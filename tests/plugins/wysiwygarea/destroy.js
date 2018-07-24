/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.test( {
		// (#https://dev.ckeditor.com/ticket/14613)
		'test destroy editor on instance created': function() {
			var init = sinon.spy(),
				editor;

			CKEDITOR.plugins.add( 'test', {
				init: init
			} );

			CKEDITOR.tools.setTimeout( function() {
				// Seemingly redundant resume here, to make sure we catch exceptions occurred in destroy().
				resume( function() {
					editor.destroy();

					setTimeout( function() {
						resume( function() {
							assert.isFalse( init.called, 'plugin init called when editor already destroyed' );
						} );
					}, 100 );

					wait();

				} );
			}, 0 );

			editor = CKEDITOR.replace( 'destroyed', {
				extraPlugins: 'test'
			} );

			wait();
		}
	} );
} )();
