/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Print Plugin
 */

CKEDITOR.plugins.add( 'print', {
	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
	icons: 'print,', // %REMOVE_LINE_CORE%
	init: function( editor ) {
		// Print plugin isn't available in inline mode yet.
		if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
			return;

		var pluginName = 'print';

		// Register the command.
		var command = editor.addCommand( pluginName, CKEDITOR.plugins.print );

		// Register the toolbar button.
		editor.ui.addButton && editor.ui.addButton( 'Print', {
			label: editor.lang.print.toolbar,
			command: pluginName,
			toolbar: 'document,50'
		});
	}
});

CKEDITOR.plugins.print = {
	exec: function( editor ) {
		if ( CKEDITOR.env.opera )
			return;
		else if ( CKEDITOR.env.gecko )
			editor.window.$.print();
		else
			editor.document.$.execCommand( "Print" );
	},
	canUndo: false,
	readOnly: 1,
	modes: { wysiwyg: !( CKEDITOR.env.opera ) } // It is imposible to print the inner document in Opera.
};
