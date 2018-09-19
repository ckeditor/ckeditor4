/* bender-tags: editor */
/* bender-ckeditor-plugins: basicstyles,toolbar */

bender.editor = {
	config: {
		autoParagraph: false
	}
};

bender.test( {
	'test apply range style across input element': function() {
		var bot = this.editorBot;
		bot.editor.filter.allow( 'input[type]' );
		bot.setHtmlWithSelection( 'te[xt<input type="button" />te]xt' );
		bot.execCommand( 'bold' );
		assert.areSame( 'te<strong>xt<input type="button" />te</strong>xt', bot.getData( false, true ) );
	},

	// (#2294)
	'test apply bold to content with HTML comments': function() {
		var bot = this.editorBot;
		bender.tools.testInputOut( 'html-comments-bold', function( inputHtml, expectedHtml ) {
			bot.setHtmlWithSelection( inputHtml );
			bot.execCommand( 'bold' );

			assert.beautified.html( expectedHtml, bot.editor.getData() );
		} );
	}
} );
