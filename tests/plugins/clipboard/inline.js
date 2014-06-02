/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: clipboard */

( function() {
	'use strict';

	bender.editor = {
		creator: 'inline',
		config: {
			clipboard_defaultContentType: 'text',
			allowedContent: true
		}
	};

	function assertAfterPasteContent( tc, html ) {
		tc.editor.on( 'afterPaste', function( evt ) {
			evt.removeListener();
			resume( function() {
				assert.areSame( html, tc.editor.getData() );
			} );
		} );
	}

	bender.test( {
		setUp: function() {
			// Force result data un-formatted.
			this.editor.dataProcessor.writer._.rules = {};
			this.editor.focus();
		},

		// #10787
		'test paste text in non-empty text selection': function() {
			// See (#11384 #10787). Couldn't be added to regressions, because it throws error.
			if ( CKEDITOR.env.ie )
				assert.ignore();

			var editor = this.editor;

			this.editorBot.setData( '<p>foo moo bar</p>', function() {
				var text = editor.editable().getFirst().getFirst(),
					range = editor.createRange();

				editor.focus();

				range.setStart( text, 4 ); // [moo
				range.setEnd( text, 7 ); // moo]
				range.select();

				bender.tools.emulatePaste( this.editor, 'bonk!' );
				assertAfterPasteContent( this, '<p>foo bonk! bar</p>' );

				wait();
			} );
		}
	} );
} )();