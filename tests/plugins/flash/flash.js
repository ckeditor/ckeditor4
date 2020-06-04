/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: flash,toolbar */

( function() {
	'use strict';

	bender.editor = true;

	var flashHtml = '<p><object align="left" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" ' +
		'height="50" hspace="10" vspace="20" width="100">' +
		'<param name="quality" value="high" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" />' +
		'<param name="scale" value="showall" /><param name="movie" value="http://t.t" />' +
		'<embed allowscriptaccess="always" height="50" hspace="10" pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" scale="showall" ' +
		'src="http://t.t" type="application/x-shockwave-flash" vspace="20" width="100" wmode="window" /></object></p>';

	bender.test( {
		tearDown: function() {
			var dialog = CKEDITOR.dialog.getCurrent();

			if ( dialog ) {
				dialog.hide();
			}
		},

		'test allowed content filter': function() {
			this.editorBot.assertInputOutput(
				flashHtml,
				// jscs:disable maximumLineLength
				/<p><img align="left" alt="[^"]+" class="cke_flash" data-cke-real-element-type="flash" data-cke-real-node-type="1" data-cke-realelement="[^"]+" data-cke-resizable="true" src="[^"]+" style="width:\s?100px;\s?height:\s?50px;?" title="[^"]+" \/><\/p>/i
				// jscs:enable maximumLineLength
			);
		},

		// (#2423)
		'test dialog model during flash creation': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '', function() {
				bot.dialog( 'flash', function( dialog ) {
					assert.isNull( dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
				} );
			} );
		},

		// (#2423)
		'test dialog model with existing flash': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( flashHtml, function() {
				bot.dialog( 'flash', function( dialog ) {
					var flash = editor.editable().findOne( '.cke_flash' );

					editor.getSelection().selectElement( flash );

					assert.areEqual( flash, dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );
				} );
			} );
		}

	} );

} )();
