/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {

	CKEDITOR.plugins.add( 'liststylesplit', {
		// jscs:disable maximumLineLength
		lang: 'en', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'numberedlist,bulletedlist', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'splitbutton,list',
		init: function( editor ) {



			var lang = editor.lang.liststylesplit;
			editor.ui.add( 'ListStyleSplit', CKEDITOR.UI_SPLITBUTTON, {
				label: lang.label,
				toolbar: 'list,5',
				items: [ {
					label: lang.numberedlist,
					command: 'numberedlist',
					icon: 'numberedlist',
					'default': true
				}, {
					label: lang.bulletedlist,
					command: 'bulletedlist',
					icon: 'bulletedlist'
				} ]
			} );
		}
	} );
} )();
