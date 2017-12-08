/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {

	CKEDITOR.plugins.add( 'basicstylessplit', {
		// jscs:disable maximumLineLength
		lang: 'en', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'bold,italic,underline,strike,subscript,superscript', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'splitbutton,basicstyles',
		init: function( editor ) {

			var lang = editor.lang.basicstyles;
			editor.ui.add( 'BasicStylesSplit', CKEDITOR.UI_SPLITBUTTON, {
				label: 'Basic Styles',
				toolbar: 'basicstyles,5',
				items: [ {
					label: lang.bold,
					command: 'bold',
					icon: 'bold'
				}, {
					label: lang.italic,
					command: 'italic',
					icon: 'italic'
				}, {
					label: lang.underline,
					command: 'underline',
					icon: 'underline'
				}, {
					label: lang.strike,
					command: 'strike',
					icon: 'strike'
				}, {
					label: lang.subscript,
					command: 'subscript',
					icon: 'subscript'
				}, {
					label: lang.superscript,
					command: 'superscript',
					icon: 'superscript',
					'default': true
				} ]
			} );
		}
	} );
} )();
