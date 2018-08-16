/* bender-tags: editor */
/* bender-ckeditor-plugins: enterkey */
/* bender-ckeditor-remove-plugins: basicstyles */

bender.editor = {
	name: 'heading',
	creator: 'inline',
	allowedForTests: 'b'
};

bender.test( {
	// Executes ENTER on input, type some text and check output.
	enterKey: function( html ) {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( html );
		bot.execCommand( 'enter' );
		return bot.getData( 1, true );
	},

	'test enter among inline text': function() {
		assert.areSame( 'foo<br />bar', this.enterKey( 'foo^bar' ) );
		assert.areSame( 'foo<br />&nbsp;', this.enterKey( 'foo^' ) );
		assert.areSame( '<br />foo', this.enterKey( '^foo' ) );
		assert.areSame( '<b>foo</b><br />bar', this.enterKey( '<b>foo^</b>bar' ) );
		assert.areSame( '<br /><b>foo</b>', this.enterKey( '<b>^foo</b>' ) );
	}
} );
