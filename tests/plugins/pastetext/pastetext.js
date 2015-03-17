/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastetext */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test paste data structure': function() {
			if ( CKEDITOR.env.ie )
				assert.ignore();

			var editor = this.editor;

			editor.once( 'paste', function( evt ) {
				evt.cancel();

				resume( function() {
					assert.areSame( 'foo', evt.data.dataValue, 'dataValue' );
					assert.areSame( 'paste', evt.data.method, 'method' );
					assert.isInstanceOf( CKEDITOR.plugins.clipboard.dataTransfer, evt.data.dataTransfer, 'dataTransfer' );
				} );
			} );

			editor.once( 'dialogShow', function() {
				var dialog = editor._.storedDialogs.paste,
					frameDoc = dialog.getContentElement( 'general', 'editing_area' )
					.getInputElement().getFrameDocument();

				frameDoc.getBody().setHtml( 'foo' );

				dialog.fire( 'ok' );
				dialog.hide();
			} );

			setTimeout( function() {
				editor.execCommand( 'pastetext' );
			} );
			this.wait();
		}
	} );

} )();