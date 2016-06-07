/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog,button,forms,htmlwriter,toolbar */

bender.editor = {
	config: {
		autoParagraph: false
	}
};

bender.test( {
	'test fill fields': function() {
		// That feature is generally broken in IEs.
		if ( CKEDITOR.env.ie )
			assert.ignore();

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
		// That feature is generally broken in IEs.
		if ( CKEDITOR.env.ie )
			assert.ignore();

		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input checked="checked" name="name" required="required" type="radio" value="value" />]' );

		bot.dialog( 'radio', function( dialog ) {
			assert.areSame( 'name', dialog.getValueOf( 'info', 'name' ) );
			assert.areSame( 'value', dialog.getValueOf( 'info', 'value' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'checked' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'required' ) );

			dialog.setValueOf( 'info', 'name', '' );
			dialog.setValueOf( 'info', 'value', '' );
			dialog.setValueOf( 'info', 'checked', '' );
			dialog.setValueOf( 'info', 'required', '' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input type="radio" />', bot.getData( false, true ) );
		} );
	},

	'test read collapsed required attribute': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input type="radio" required />]' );

		bot.dialog( 'radio', function( dialog ) {
			assert.isTrue( dialog.getValueOf( 'info', 'required' ) );
		} );
	},

	'test read empty required attribute': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input type="radio" required="" />]' );

		bot.dialog( 'radio', function( dialog ) {
			assert.isTrue( dialog.getValueOf( 'info', 'required' ) );
		} );
	},

	'test read required attribute with value `required`': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input type="radio" required="required" />]' );

		bot.dialog( 'radio', function( dialog ) {
			assert.isTrue( dialog.getValueOf( 'info', 'required' ) );
		} );
	},

	'test required attribute absent': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input type="radio" />]' );

		bot.dialog( 'radio', function( dialog ) {
			assert.isFalse( dialog.getValueOf( 'info', 'required' ) );
		} );
	},

	'test read required attribute with invalid value': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input type="radio" required="any value other than empty string or required" />]' );

		bot.dialog( 'radio', function( dialog ) {
			assert.isFalse( dialog.getValueOf( 'info', 'required' ) );
		} );
	}
} );
