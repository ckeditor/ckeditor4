/* bender-tags: editor,clipboard */
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
	},

	// #869
	'test check if collapse selection is not copied': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
			assert.ignore();
		}

		var editor = this.editor,
			bot = this.editorBot,
			range;

		bot.setHtmlWithSelection( '<p>[Some] text</p>' );

		editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
		assert.areSame( 'Some', CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );

		range = editor.getSelection().getRanges()[ 0 ];
		range.collapse();
		range.select();

		editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );
		assert.areSame( 'Some', CKEDITOR.plugins.clipboard.copyCutData.getData( 'text/html' ) );
	}
} );
