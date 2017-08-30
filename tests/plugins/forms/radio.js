/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog,button,forms,htmlwriter,toolbar */

bender.editor = {
	config: {
		autoParagraph: false
	}
};

bender.test( {
	'test fill fields': function() {
		var bot = this.editorBot;

		bot.dialog( 'radio', function( dialog ) {
			dialog.setValueOf( 'info', 'name', 'name' );
			dialog.setValueOf( 'info', 'value', 'value' );
			dialog.setValueOf( 'info', 'checked', 'checked' );
			dialog.setValueOf( 'info', 'required', 'checked' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input checked="checked" name="name" required="required" type="radio" value="value" />', bot.getData( false, true ) );
		} );
	},

	'test empty fields': function() {
		// IE is quite problematic. You cannot remove `value` from the input. There are some hacks design specially for IE to fix `value` problem.
		// Those customization should be removed if #844 will be fixed.
		var bot = this.editorBot;

		if ( CKEDITOR.env.ie ) {
			bot.setHtmlWithSelection( '[<input checked="checked" name="name" required="required" type="radio" />]' );
			// We need to add 'checked', after adding input to editable by setHtmlWithSelection. There is some magic with IE ;)
			this.editor.editable().findOne( 'input' ).setAttribute( 'checked', 'checked' );
		} else {
			bot.setHtmlWithSelection( '[<input checked="checked" name="name" required="required" type="radio" value="value" />]' );
		}

		bot.dialog( 'radio', function( dialog ) {
			assert.areSame( 'name', dialog.getValueOf( 'info', 'name' ) );
			if ( !CKEDITOR.env.ie ) {
				assert.areSame( 'value', dialog.getValueOf( 'info', 'value' ) );
			}
			assert.areSame( true, dialog.getValueOf( 'info', 'checked' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'required' ) );

			dialog.setValueOf( 'info', 'name', '' );
			dialog.setValueOf( 'info', 'value', '' );
			dialog.setValueOf( 'info', 'checked', '' );
			dialog.setValueOf( 'info', 'required', '' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input type="radio" />', bot.getData( false, true ) );
		} );
	}
} );
