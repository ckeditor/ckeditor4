bender.editor = false;

bender.test( {

	'test if test suite sandboxed': function() {
		assert.isTrue( window.testVar !== true, 'Global var not set' );
		assert.isUndefined( CKEDITOR.plugins.registered.basicstyles, 'Plugin not loaded' );
	}
} );
