/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2 */

bender.editor = {};

bender.test( {
	'test image long alt visible in editor': function() {
		var bot = this.editorBot,
			editor = bot.editor;

		bot.setData( '<img src="%BASE_PATH%/_assets/logo.png" alt="foo">', function() {
			var altContainer;

			editor.widgets.instances[0].focus();
			altContainer = editor.editable().findOne( '[data-cke-hidden-sel]' );
			assert.areEqual( '0px', altContainer.getStyle( 'height' ) );
			assert.areEqual( '0px', altContainer.getStyle( 'width' ) );
		} );
	}
} );
