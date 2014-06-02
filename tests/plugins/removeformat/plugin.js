/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,removeformat */

bender.editor = {
	config: {
		autoParagraph: false,
		allowedContent: true
	}
};

bender.test(
{
	'test remove format always fire editor#selectionChange': function() {
		var ed = this.editor, bot = this.editorBot;
		bot.setHtmlWithSelection( '[<p style="text-align:right">foo</p>]' );
		ed.once( 'selectionChange', function() {
			assert.isTrue( true, '"selectionChange" event always fired after remove format.' );
		} );
		ed.execCommand( 'removeFormat' );
	},

	'test remove format inside nested editable': function() {
		var editor = this.editor,
			bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>foo</p><div contenteditable="false"><p contenteditable="true">[<b>foo</b> bar]</p></div>' );

		bot.editor.execCommand( 'removeFormat' );
		assert.areEqual( '<p>foo</p><div contenteditable="false"><p contenteditable="true">foo bar</p></div>', bot.getData() );

		var nestedE = editor.document.findOne( 'p[contenteditable=true]' ),
			sel = editor.getSelection();

		assert.areSame( nestedE, sel.getCommonAncestor(), 'Selection should not leak from nested editable' );
	},

	'test editor#addRemoveFormatFilter': function() {
		bender.editorBot.create( {
			name: 'test_editor2',
			config: { allowedContent: true }
		}, function( bot ) {
			bot.setHtmlWithSelection( '[<p><span style="color:red">foo</span> <b>bar</b></p>]' );

			bot.editor.addRemoveFormatFilter( function( element ) {
				return !element.is( 'b' ); // Don't remove 'b' elements.
			} );

			bot.editor.execCommand( 'removeFormat' );
			assert.areEqual( '<p>foo <b>bar</b></p>', bot.getData() );
		} );
	}

} );