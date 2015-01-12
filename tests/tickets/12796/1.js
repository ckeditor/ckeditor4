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

			bot.execCommand( 'outdent' );

			var parentId = CKEDITOR.document.getById( 'editor1' ).getParent().$.id;

			assert.areEqual( 'outerListItem', parentId, 'editor unwrapped parent li' );
		} );
	}
} );
