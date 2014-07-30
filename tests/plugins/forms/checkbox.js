/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog,button,forms,htmlwriter,toolbar */

bender.editor = {
	config: {
		autoParagraph: false
	}
};

bender.test( {
	'test fill fields' : function() {
		var bot = this.editorBot;

		bot.dialog( 'checkbox', function( dialog ) {
			dialog.setValueOf( 'info', 'txtName', 'name' );
			dialog.setValueOf( 'info', 'txtValue', 'value' );
			dialog.setValueOf( 'info', 'cmbSelected', 'checked' );
			dialog.setValueOf( 'info', 'required', 'checked' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input checked="checked" name="name" required="required" type="checkbox" value="value" />', bot.getData( false, true ) );
		} );
	},

	'test empty fields': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input checked="checked" name="name" required="required" type="checkbox" value="value" />]' );

		bot.dialog( 'checkbox', function( dialog ) {
			dialog.setValueOf( 'info', 'txtName', '' );
			dialog.setValueOf( 'info', 'txtValue', '' );
			dialog.setValueOf( 'info', 'cmbSelected', '' );
			dialog.setValueOf( 'info', 'required', '' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input type="checkbox" />', bot.getData( false, true ) );
		} );
	}
} );