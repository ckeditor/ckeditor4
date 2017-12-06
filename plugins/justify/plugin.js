/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Justify commands.
 */

( function() {
	CKEDITOR.plugins.add( 'justify', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'justifyblock,justifycenter,justifyleft,justifyright', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'justifycore',
		init: function( editor ) {
			if ( editor.ui.addButton ) {
				editor.ui.addButton( 'JustifyLeft', {
					label: editor.lang.justify.left,
					command: 'justifyleft',
					toolbar: 'align,10'
				} );
				editor.ui.addButton( 'JustifyCenter', {
					label: editor.lang.justify.center,
					command: 'justifycenter',
					toolbar: 'align,20'
				} );
				editor.ui.addButton( 'JustifyRight', {
					label: editor.lang.justify.right,
					command: 'justifyright',
					toolbar: 'align,30'
				} );
				editor.ui.addButton( 'JustifyBlock', {
					label: editor.lang.justify.block,
					command: 'justifyblock',
					toolbar: 'align,40'
				} );
			}
		}
	} );
} )();
