/* @bender-ckeditor-plugins: livebutton */

bender.editor = true;

bender.test( {
	'plugin is loaded': function() {
		this.editorBot.setHtmlWithSelection( '<p>This is an example text with<span style="color:#ff0000">red^ color</span>.</p>' );

		assert.isTrue( 'livebutton' in this.editor.plugins, 'Plugin is loaded' );
	}
} );