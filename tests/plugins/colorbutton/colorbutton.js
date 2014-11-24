/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test opening text/background color': function() {
			var ed = this.editor, bot = this.editorBot;
			var txtColorBtn = ed.ui.get( 'TextColor' ),
				bgColorBtn = ed.ui.get( 'BGColor' );

			bot.setHtmlWithSelection( '[<h1 style="color: #00FF00; background: #FF0000">Moo</h1>]' );

			// Check if automatic text color is obtained correctly.
			txtColorBtn.click( ed );
			assert.areEqual( '#00ff00', CKEDITOR.tools.convertRgbToHex( txtColorBtn.onOpen() ), 'Text color must match.' );

			// Check if automatic background color is obtained correctly.
			bgColorBtn.click( ed );
			assert.areEqual( '#ff0000', CKEDITOR.tools.convertRgbToHex( bgColorBtn.onOpen() ), 'Text color must match.' );
		},

		// #10975
		'test open palette without focus': function() {
			var editor = CKEDITOR.replace( 'noFocus' );
			editor.on( 'instanceReady', function() {
				resume( function() {
					var txtColorBtn = editor.ui.get( 'TextColor' );
					txtColorBtn.click( editor );

					assert.areEqual( CKEDITOR.TRISTATE_ON, txtColorBtn._.state, 'txtColorBtn.click should not throw an error.' );
				} );
			} );

			wait();
		}
	} );
} )();