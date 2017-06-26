/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,toolbar,table,tableselection */

( function() {
	'use strict';

	bender.editor = {
			name: 'editor_copy_image_to_table',
			config: {}
		};

	function assertAfterPasteContent( tc ) {
		tc.editor.on( 'afterPaste', function( evt ) {
			evt.removeListener();
			resume( function() {
				assert.isFalse( tc.editor.editable().findOne( '.cke_widget_image' ).hasClass( 'cke_widget_new' ) );
			} );
		} );
	}

	bender.test( {
		'the copied image to table shoud be initialized': function() {
			this.editor.insertHtml( '<table border="1"><tbody><tr><td></td></tr></tbody></table>' );
			this.editorBot.editor.focus();

			bender.tools.emulatePaste( this.editor, '<img src="_assets/bar.png" alt="xalt" width="100" id="image" />' );
			assertAfterPasteContent( this );
			wait();
		}
	} );
} )();
