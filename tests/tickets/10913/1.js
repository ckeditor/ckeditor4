/* bender-tags: editor,unit */

CKEDITOR.plugins.addExternal( 'plugin1', '%TEST_DIR%_assets/plugin1/', 'plugin.js' );
CKEDITOR.plugins.addExternal( 'plugin2', '%TEST_DIR%_assets/plugin2/plugin.js', '' );
CKEDITOR.plugins.addExternal( 'plugin3', '%TEST_DIR%_assets/plugin3/plugin.js' );
CKEDITOR.plugins.addExternal( 'plugin4', '%TEST_DIR%_assets/plugin4/' );

bender.editor = {
	creator: 'replace',
	config: {
		extraPlugins : 'plugin1,plugin2,plugin3,plugin4'
	}
};

// Simply check if the plugins' language entries have been properly created.

bender.test( {
	'Check addExternal with file name separated': function() {
		assert.isObject( this.editor.lang.plugin1 );
	},
	'Check addExternal with file name empty': function() {
		assert.isObject( this.editor.lang.plugin2 );
	},
	'Check addExternal with file name included in path': function() {
		assert.isObject( this.editor.lang.plugin3 );
	},
	'Check addExternal with file name missing': function() {
		assert.isObject( this.editor.lang.plugin4 );
	}
} );