/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test whether default filter is loaded': function() {
			var editor = this.editor;

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.areSame( '<p>text <strong>text</strong></p>', evt.data.dataValue, 'Basic filter was applied' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				// This data will be recognized as pasted from Word.
				dataValue: '<p>text <strong class="MsoNormal">text</strong></p>',
				method: 'paste',
				dataTransfer: new CKEDITOR.plugins.clipboard.dataTransfer()
			} );

			wait();
		},

		'test paste data structure': function() {
			if ( CKEDITOR.env.ie )
				assert.ignore();

			var editor = this.editor,
				editable = editor.editable();

			CKEDITOR.env.ie && editable.once( 'beforepaste', function( evt ) {
				evt.cancel();
				return false;
			}, null, null, 1001 );

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
				editor.execCommand( 'pastefromword' );
			} );
			this.wait();
		}
	} );

} )();