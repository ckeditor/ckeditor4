/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,floatingspace,list,indentlist */

CKEDITOR.disableAutoInline = true;

bender.editor = {
	creator: 'inline',
	name: 'editor1'
};

bender.test( {
	'test outdent does not unwrap parent li with multiple lists and both lists selected': function() {
		var bot = this.editorBot,
			editor = bot.editor;

		editor.focus();
		bender.tools.selection.setWithHtml( editor, '<ul><li>[1</li></ul><ol><li>2]</li></ol>' );

		var originalEditable = editor.editable(),
			originalEditableParent = originalEditable.getParent();

		bot.execCommand( 'outdent' );

		var body = CKEDITOR.document.getBody();
		assert.isTrue( body.contains( originalEditableParent ), 'editable\'s parent was not removed from the body element' );
		assert.areSame( originalEditableParent, originalEditable.getParent(), 'editable\'s parent did not change' );

		// It is not necessarily the most expected result (I would expect both lists to be outdented),
		// but this is how the algorithm works in an iframed editor at the moment.
		assert.areSame( '<p>1</p><ol><li>2</li></ol>', editor.getData(), 'the first of the selected lists was outdented' );
	},

	'test outdent does not unwrap parent li with multiple lists and one list selected': function() {
		var bot = this.editorBot,
			editor = bot.editor;

		editor.focus();
		bender.tools.selection.setWithHtml( editor, '<ul><li>[1]</li></ul><ol><li>2</li></ol>' );

		var originalEditable = editor.editable(),
			originalEditableParent = originalEditable.getParent();

		bot.execCommand( 'outdent' );

		var body = CKEDITOR.document.getBody();
		assert.isTrue( body.contains( originalEditableParent ), 'editable\'s parent was not removed from the body element' );
		assert.areSame( originalEditableParent, originalEditable.getParent(), 'editable\'s parent did not change' );

		// It is not necessarily the most expected result (I would expect both lists to be outdented),
		// but this is how the algorithm works in an iframed editor at the moment.
		assert.areSame( '<p>1</p><ol><li>2</li></ol>', editor.getData(), 'the first of the selected lists was outdented' );
	},

	'test outdent does not unwrap parent li with a single list': function() {
		var bot = this.editorBot,
			editor = bot.editor;

		editor.focus();
		bender.tools.selection.setWithHtml( editor, '<ul><li>[1]</li></ul>' );

		var originalEditable = editor.editable(),
			originalEditableParent = originalEditable.getParent();

		bot.execCommand( 'outdent' );

		var body = CKEDITOR.document.getBody();
		assert.isTrue( body.contains( originalEditableParent ), 'editable\'s parent was not removed from the body element' );
		assert.areSame( originalEditableParent, originalEditable.getParent(), 'editable\'s parent did not change' );

		assert.areSame( '<p>1</p>', editor.getData(), 'the first of the selected lists was outdented' );
	}
} );
