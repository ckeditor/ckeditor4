/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'pastebutton', {
		requires: 'clipboard,pastefromword,pastetext,balloontoolbar',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'paste,paste-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function() {

		}
	} );
}() );
