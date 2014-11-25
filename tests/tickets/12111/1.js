/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,image */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test image properties with link plugin enabled': function() {
			var bot = this.editorBot,
				editor = this.editor,
				src = '%BASE_PATH%_assets/img.gif',
				inputHtml = '<p><a id="imgLink" href="http://ckeditor.com">li[<img id="img1" alt="" src="' + src + '" />]nk</a></p>';

			bot.setHtmlWithSelection( inputHtml );

			var evt = {
				element: bot.editor.editable().findOne( 'img#img1' )
			};

			editor.once( 'dialogShow', function() {
				var dialog = CKEDITOR.dialog.getCurrent(),
					urlField;

				resume( function() {
					try {
						assert.isTrue( !!dialog, 'dialog is created' );
						urlField = dialog.getContentElement( 'info', 'txtUrl' ).getInputElement();
						assert.areEqual( src, urlField.getValue() );
					} catch ( e ) {
						// Propagate the exception.
						throw e;
					} finally {
						// In any case hide the dialog.
						if ( dialog ) {
							dialog.hide();
						}
					}
				} );
			} );

			editor.fire( 'doubleclick', evt );

			wait();
		}
	} );
} )();