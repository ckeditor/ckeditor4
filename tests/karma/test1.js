/* bender-ckeditor-plugins: basicstyles */

bender.editor = true;

bender.test( {

	'test if plugin loaded': function() {
		// Set some global var.
		window.testVar = true;

		assert.isObject( CKEDITOR.plugins.registered.basicstyles );
	}
} );
