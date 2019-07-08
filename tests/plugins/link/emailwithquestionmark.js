/* bender-tags: editor, link, email */
/* bender-ckeditor-plugins: link,button,toolbar,dialog */

bender.editor = {};

bender.test( {
	// (#2138)
	'test email address with "?"': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<h1>Mail to <a href="mailto:ck?editor@cksource.com">[CKSource]</a>!</h1>' );

		bot.dialog( 'link', function( dialog ) {
			dialog.getButton( 'ok' ).click();

			assert.areSame( '<h1>Mail to <a href="mailto:ck?editor@cksource.com">CKSource</a>!</h1>', bot.getData() );
		} );
	}
} );
