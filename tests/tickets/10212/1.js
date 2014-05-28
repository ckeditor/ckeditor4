/* bender-tags: editor,unit,magicline */
/* bender-ckeditor-plugins: undo,magicline,sourcearea */

bender.editor = { creator: 'replace' };

bender.test( {
	// NOTE: this test usually does not work (i.e. it does not fail when code is broken)
	// on IE9 (however, sometimes it does).
	// It proves that issue exists on IE7 and IE8.
	'test undo/redo after recreating editable document': function() {
		var bot = this.editorBot,
			editor = bot.editor;

		bot.setHtmlWithSelection( '<p>fo[ob]ar</p>' );
		editor.resetUndo();

		editor.insertHtml( 'BOM' );

		// Ensure async.
		setTimeout( function() {
			editor.setMode( 'source', function() {
				editor.setMode( 'wysiwyg', function() {
					resume( function() {
						editor.execCommand( 'undo' );
						assert.areSame( '<p>foobar</p>', bot.getData() );
					} );
				} );
			} );
		} );

		wait();
	}
} );