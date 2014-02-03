/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

 /**
 * @fileOverview Rich code snippets for CKEditor.
 */

'use strict';

(function() {

	CKEDITOR.plugins.add( 'snippetgeshi', {
		requires: 'ajax,snippet',

		init: function( editor ) {

			var path = CKEDITOR.getUrl( this.path );

			editor.plugins.snippet.setHighlighter( editor, function( code, lang, callback ) {
				var requestConfig = {
					lang: lang,
					html: code
				};

				CKEDITOR.ajax.post( path + 'lib/geshi/colorize.php', requestConfig, function( data ) {
					callback( data );
				} );
			} );
		}
	} );

})();