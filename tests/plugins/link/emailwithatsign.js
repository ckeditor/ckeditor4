/* bender-tags: editor, link, email */
/* bender-ckeditor-plugins: link,button,toolbar,dialog */

bender.editor = {};

bender.test( {
	// (#2027)
	'test link target keywords': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<h1>Mail to <a href="mailto:ckeditor@cksource.com">[@CKSource]</a>!</h1>' );

		bot.dialog( 'link', function( dialog ) {
			dialog.getButton( 'ok' ).click();

			assert.areSame( '<h1>Mail to <a href="mailto:ckeditor@cksource.com">@CKSource</a>!</h1>', bot.getData() );
		} );
	}
} );
