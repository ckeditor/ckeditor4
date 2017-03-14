/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.test( {
		'test destroy editor on instance created': function() {
			var init = sinon.spy(),
				editor;

			CKEDITOR.plugins.add( 'test', {
				init: init
			} );

			CKEDITOR.tools.setTimeout( function() {
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
