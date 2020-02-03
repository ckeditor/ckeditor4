/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastefromlibreoffice */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		// (#3824)
		'test handler is loaded only in supported environments': function() {
			var editor = this.editor,
				pasteEvt = {
					data: {
						dataTransfer: new CKEDITOR.plugins.clipboard.dataTransfer(),
						dataValue: '<meta name="generator" content="libreoffice">'
					}
				},
				pfloHandler = CKEDITOR.tools.array.find( editor.pasteTools.handlers, function( handler ) {
					return handler.canHandle( pasteEvt );
				} ),
				isSupportedEnv = editor.plugins.pastefromlibreoffice.isSupportedEnvironment(),
				assertion =  isSupportedEnv ? 'isNotUndefined' : 'isUndefined';

			assert[ assertion ]( pfloHandler );
		}
	} );
} )();
