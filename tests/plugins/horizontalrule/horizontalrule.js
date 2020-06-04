/* bender-tags: editor */
/* bender-ckeditor-plugins: entities,horizontalrule,link,toolbar */

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P
	}
};

bender.test( {
	'test insert hr at doc end': function() {
		var bot = this.editorBot;
		bot.execCommand( 'horizontalrule' );
		assert.areSame( '<hr /><p>&nbsp;</p>', bot.getData( false, true ) );
	},

	'test insert hr among text': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( 'foo^bar' );
		bot.execCommand( 'horizontalrule' );
		assert.areSame( '<p>foo</p><hr /><p>bar</p>', bot.getData( false, true ) );
	},

	'test insert hr at the end of block': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>foo^</p>' );
		bot.execCommand( 'horizontalrule' );
		assert.areSame( '<p>foo</p><hr /><p>&nbsp;</p>', bot.getData( false, true ) );
	},

	'test insert hr at the start of block': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>^foo</p>' );
		bot.execCommand( 'horizontalrule' );
		assert.areSame( '<hr /><p>foo</p>', bot.getData( false, true ) );
	},

	'test insert hr at the middle of block': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>foo^bar</p>' );
		bot.execCommand( 'horizontalrule' );
		assert.areSame( '<p>foo</p><hr /><p>bar</p>', bot.getData( false, true ) );
	},

	'test insert hr with text selection': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>t[ext<a href="http://ckeditor.com/">lin]k</a></p>' );
		bot.execCommand( 'horizontalrule' );
		assert.areSame( '<p>t</p><hr /><p><a href="http://ckeditor.com/">k</a></p>', bot.getData( false, true ) );
	}
} );
