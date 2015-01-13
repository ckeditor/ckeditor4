/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,floatingspace,list */

CKEDITOR.disableAutoInline = true;

bender.test( {
	'test outdent does not unwrap parent li': function() {
		bender.editorBot.create( {
			creator: 'inline',
			name: 'editor1'
		}, function( bot ) {
			var editor = bot.editor;

			editor.focus();
			bender.tools.selection.setWithHtml( editor, '<ul>[<li>1</li></ul><ol><li>2</li>]</ol>' );

			var originalEditable = editor.editable(),
				originalEditableParent = originalEditable.getParent();

			bot.execCommand( 'outdent' );

			var body = CKEDITOR.document.getBody();
			assert.isTrue( body.contains( originalEditableParent ), 'editable\'s parent was not removed from the body element' );
			assert.areSame( originalEditableParent, originalEditable.getParent(), 'editable\'s parent did not change' );
		} );
	}
} );
