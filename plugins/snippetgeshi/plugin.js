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

			var path = CKEDITOR.getUrl( this.path ),
				languages = {
					javascript: 'JavaScript',
					php: 'PHP',
					html4strict: 'HTML',
					html5: 'HTML5',
					css: 'CSS'
				};

			editor.plugins.snippet.setHighlighter( editor, languages, function( code, lang, callback ) {
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