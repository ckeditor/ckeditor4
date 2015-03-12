/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: toolbar,clipboard */

'use strict';

bender.editor = true;

bender.test( {
	'test showNotification if command execution fail': function() {
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = this.editor;

		bot.setHtmlWithSelection( '<p>[foo]</p>' );

		sinon.stub( editor.document.$, 'execCommand' ).withArgs( 'cut' ).throws( '' );

		sinon.stub( editor, 'showNotification', function() {
			assert.isTrue( true );
		} );

		editor.execCommand( 'cut' );
	}
} );