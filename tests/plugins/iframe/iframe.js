/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: iframe,dialogadvtab,toolbar */

bender.editor = {
	config: {
		autoParagraph: false
	}
};

bender.test( {
	'test create iframe': function() {
		var bot = this.editorBot;
		bot.dialog( 'iframe', function( dialog ) {
			dialog.setValueOf( 'info', 'src', 'http://ckeditor.com' );
			dialog.setValueOf( 'info', 'width', '100%' );
			dialog.setValueOf( 'info', 'height', '500' );
			dialog.setValueOf( 'advanced', 'advStyles', 'height:100px; width:100px;' );

			dialog.getButton( 'ok' ).click();

			assert.areEqual( '<iframe frameborder="0" height="500" scrolling="no" src="http://ckeditor.com" ' +
				'style="height:100px;width:100px;" width="100%"></iframe>', bot.getData( true ) );
		} );
	},

	'test update iframe': function() {
		var bot = this.editorBot, editor = this.editor;

		bot.setHtmlWithSelection( editor.dataProcessor.toHtml( '[<iframe frameborder="0" scrolling="no" src="http://ckeditor.com" width="100%"></iframe>]' ) );

		bot.dialog( 'iframe', function( dialog ) {
			assert.areSame( 'http://ckeditor.com', dialog.getValueOf( 'info', 'src' ) );
			assert.areSame( '100%', dialog.getValueOf( 'info', 'width' ) );

			dialog.setValueOf( 'info', 'src', 'http://cksource.com' );
			dialog.setValueOf( 'info', 'width', '400' );

			dialog.getButton( 'ok' ).click();

			assert.areEqual( '<iframe frameborder="0" scrolling="no" src="http://cksource.com" width="400"></iframe>', bot.getData( true ) );
		} );
	}
} );