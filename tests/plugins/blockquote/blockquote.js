/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: blockquote,toolbar */

bender.editor = { config : { enterMode : CKEDITOR.ENTER_P, allowedContent: true } };

bender.test(
{
	'test apply blockquote' : function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '[<p>foo</p><p>bar</p>]' );
		bot.execCommand( 'blockquote' );
		assert.areSame( '<blockquote><p>foo</p><p>bar</p></blockquote>', bot.getData( 1 ) );
	},

	'test command state(ON) in blockquote' : function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<blockquote><p>^foo</p></blockquote>' );

		assert.isTrue( this.editor.getCommand( 'blockquote' ).state == CKEDITOR.TRISTATE_ON );
	},

	'test blockquote on non-editable block': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '[<p contenteditable="false">foo</p>]' );
		bot.execCommand( 'blockquote' );
		assert.areSame( '<blockquote><p contenteditable="false">foo</p></blockquote>', bot.getData( 1 ) );
	}
} );