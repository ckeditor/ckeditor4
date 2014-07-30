/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog,button,forms,htmlwriter,toolbar */

bender.editor = { config : { autoParagraph : false } };

bender.test(
{
	'test fill fields' : function() {
		var bot = this.editorBot;

		bot.dialog( 'radio', function( dialog ) {
				dialog.setValueOf( 'info', 'name', 'name' );
				dialog.setValueOf( 'info', 'value', 'value' );
				dialog.setValueOf( 'info', 'checked', 'checked' );
				dialog.setValueOf( 'info', 'required', 'checked' );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<input checked="checked" name="name" required="required" type="radio" value="value" />',
								bot.getData( false, true ) );
			} );
	},

	'test empty fields': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input checked="checked" name="name" required="required" type="radio" value="value" />]' );

		bot.dialog( 'radio', function( dialog ) {
				dialog.setValueOf( 'info', 'name', '' );
				dialog.setValueOf( 'info', 'value', '' );
				dialog.setValueOf( 'info', 'checked', '' );
				dialog.setValueOf( 'info', 'required', '' );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<input type="radio" />', bot.getData( false, true ) );
			} );
	}
} );
