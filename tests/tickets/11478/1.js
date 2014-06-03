/* bender-tags: editor,unit */
/* bender-ckeditor-adapters: jquery */
/* bender-ckeditor-plugins: wysiwygarea */

bender.test( {
	'test pass jQuery object into config': function() {
		var config = {
			element: $( '#container' )
		};

		$( '#editable' ).ckeditor( function() {
			var _config = this.config;

			resume( function() {
				assert.areSame( _config.element[ 0 ], config.element[ 0 ] );
			} );
		}, config );

		wait();
	}
} );