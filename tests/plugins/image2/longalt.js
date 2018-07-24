/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2 */

bender.editor = {};

bender.test( {
	// (#898)
	'test image long alt visible in editor': function() {
		var bot = this.editorBot,
			editor = bot.editor;

		bot.setData( '<img src="%BASE_PATH%/_assets/logo.png" alt="foo">', function() {
			var altContainer;

			editor.widgets.instances[0].focus();
			altContainer = editor.editable().findOne( '[data-cke-hidden-sel]' );

			// On IE and Edge < 14 element should have `display:none`.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 14 ) {
				assert.areEqual( 'none', altContainer.getStyle( 'display' ) );
			} else {
				// Other browers should have 0 with and 0 height.
				assert.areEqual( '0px', altContainer.getStyle( 'height' ) );
				assert.areEqual( '0px', altContainer.getStyle( 'width' ) );
			}
		} );
	}
} );
