/* bender-tags: editor,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,font */

bender.editor = {
	config: {
		pasteFromWordRemoveFontStyles: false,
		pasteFromWordRemoveStyles: false
	}
};

bender.test( {
	'test pasting certain content': function() {
		var editor = this.editor,
			counter = 0,
			looped = false;

		// Add a stoper.
		editor.on( 'beforeCleanWord', function( evt ) {
			evt.data.filter.addRules( {
				elements: {
					span: function() {
						if ( counter++ > 100 ) {
							looped = true;
							throw new Error( 'Infinite loop' );
						}
					}
				}
			} );
		} );

		editor.on( 'afterPaste', function() {
			resume( function() {
				assert.isMatching( /FOO/, editor.getData(), 'Something was pasted' );
				assert.isFalse( looped );
			} );
		} );

		editor.execCommand( 'paste', '<p class="MsoNormal"><span style="font-size:24.0pt">FOO</span></p>' );

		wait();
	}
} );
