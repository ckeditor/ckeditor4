/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,floatingspace,list */

CKEDITOR.disableAutoInline = true;

bender.test( {
	'test delete at the beginning of editable': function() {
		bender.editorBot.create( {
			creator: 'inline',
			name: 'editor1'
		}, function( bot ) {
			var editor = bot.editor;

			editor.focus();
			bot.setHtmlWithSelection( '<p>^YYY</p>' );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 8 } ) ); // Backspace.

			assert.areSame( '<p>YYY</p>', editor.getData(), 'editor\'s content was not modified' );

			CKEDITOR.document.getById( 'editor1' ).remove();
			assert.areSame( -1, CKEDITOR.document.getById( 'outerListItem' ).getHtml().indexOf( 'YYY' ),
				'editors\'s content stayed in editable' );
		} );
	}
} );
