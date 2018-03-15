/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'justifysplit', {
	requires: 'splitbutton,justify',
	init: function( editor ) {

		var lang = editor.lang.common;
		editor.ui.add( 'JustifySplit', CKEDITOR.UI_SPLITBUTTON, {
			label: 'Justify',
			items: [ {
				label: lang.alignLeft,
				command: 'justifyleft',
				icon: 'justifyleft',
				'default': true
			}, {
				label: lang.center,
				command: 'justifycenter',
				icon: 'justifycenter'
			}, {
				label: lang.alignRight,
				command: 'justifyright',
				icon: 'justifyright'
			}, {
				label: lang.justify,
				command: 'justifyblock',
				icon: 'justifyblock'
			} ]
		} );
	}
} );
