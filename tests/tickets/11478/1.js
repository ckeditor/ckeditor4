/* bender-tags: editor,unit */
/* bender-ckeditor-adapters: jquery */
/* bender-ckeditor-plugins: wysiwygarea */

( function() {
	'use strict';

	bender.test( {
		'test pass jQuery object into config': function() {
			var configObj = {
				element: $( '#container' )
			};

			$( '#editable' ).ckeditor( function() {
				var editor = this;

				resume( function() {
					assert.areSame( configObj.element[ 0 ], editor.config.element[ 0 ], 'element was passed safely to editor.config' );
				} );
			}, configObj );

			wait();
		}
	} );
} )();