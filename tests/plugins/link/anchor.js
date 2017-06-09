/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test editing anchor': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.dialog( 'anchor', function( dialog ) {
				dialog.setValueOf( 'info', 'txtName', 'foo' );
				dialog.getButton( 'ok' ).click();

				var range = new CKEDITOR.dom.range( editor.document );
				range.selectNodeContents( editor.editable().findOne( '[data-cke-real-element-type=anchor]' ) );
				range.select();

				bot.dialog( 'anchor', function( dialog ) {
					dialog.setValueOf( 'info', 'txtName', 'bar' );
					dialog.getButton( 'ok' ).click();
					assert.isInnerHtmlMatching( '<p><a id="bar" name="bar"></a></p>', this.editor.getData() );
				} );
			} );
		}
	} );
}() );
