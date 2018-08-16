/* bender-tags: editor */
/* bender-ckeditor-plugins: list,button,toolbar */

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_BR
	}
};

bender.test( {
	supportForSelectFullList: function() {
		// With full selection, it will break inline in old IEs.
		return !( this.editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE &&
			CKEDITOR.env.ie && CKEDITOR.env.version < 9 );
	},

	setUp: function() {
		// Force result data un-formatted.
		this.editor.dataProcessor.writer._.rules = {};
		this.editor.focus();
	},

	// Test list creation.
	'test apply list': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[foo<br />bar]' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( '<ol><li>foo</li><li>bar</li></ol>', bot.getData( 1 ) );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul><li>foo</li><li>bar</li></ul>', bot.getData( 1 ) );
	},

	// Test list removal.
	'test remove list': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<ol><li>^text</li></ol>' );
		bot.execCommand( 'numberedlist' );
		assert.areSame( 'text', bot.getData( 1 ) );

		if ( this.supportForSelectFullList() ) {
			// With full selection.
			bot.setHtmlWithSelection( '[<ol><li>text</li></ol>]' );
			bot.execCommand( 'numberedlist' );
			assert.areSame( 'text', bot.getData( 1 ) );
		}
	},

	/**
	 *  Test merge newlist with previous list. (https://dev.ckeditor.com/ticket/3820)
	 */
	'test create list with merge': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<ul><li>bullet line 1</li><li>bullet line 2</li></ul>^second line' );
		bot.execCommand( 'bulletedlist' );
		assert.areSame( '<ul><li>bullet line 1</li><li>bullet line 2</li><li>second line</li></ul>', bot.getData( 1 ) );
	},

	/**
	 *  Test remove list first list item not merging with previous text node. (https://dev.ckeditor.com/ticket/3836)
	 */
	'test remove list without merge': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( 'line1<ul><li>[item1</li><li>item2]</li></ul>line2' );
		// Remove list.
		bot.execCommand( 'bulletedlist' );
		assert.areSame( 'line1<br />item1<br />item2<br />line2', bot.getData( 1 ) );
	}
} );
