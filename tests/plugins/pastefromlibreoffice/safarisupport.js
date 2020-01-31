/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastefromlibreoffice */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		// (#3824)
		'test handler is not loaded in Safari': function() {
			if ( !CKEDITOR.env.webkit || CKEDITOR.env.chrome ) {
				assert.ignore();
			}

			var pasteEvt = {
					data: {
						dataTransfer: new CKEDITOR.plugins.clipboard.dataTransfer(),
						dataValue: '<meta name="generator" content="libreoffice">'
					}
				},
				pfloHandler = CKEDITOR.tools.array.find( this.editor.pasteTools.handlers, function( handler ) {
					return handler.canHandle( pasteEvt );
				} );

			assert.isUndefined( pfloHandler );
		}
	} );
} )();
