/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: clipboard,pastetext */

( function() {
	'use strict';

	Array.prototype.$constructor = function() {
		throw new Error( 'BOOM!' );
	};

	bender.editor = {
		config: {
			forcePasteAsPlainText: true,
			allowedContent: true
		}
	};

	bender.test( {
		'test pasting': function() {
			this.editor.on( 'afterPaste', function() {
				assert.isTrue( true );
				resume();
			} );

			this.editor.execCommand( 'paste', '<p><b>foo</b></p>' );
			wait();
		}
	} );
} )();