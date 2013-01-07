/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'about', {
	requires: 'dialog',
	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
	icons: 'about', // %REMOVE_LINE_CORE%
	init: function( editor ) {
		var command = editor.addCommand( 'about', new CKEDITOR.dialogCommand( 'about' ) );
		command.modes = { wysiwyg:1,source:1 };
		command.canUndo = false;
		command.readOnly = 1;

		editor.ui.addButton && editor.ui.addButton( 'About', {
			label: editor.lang.about.title,
			command: 'about',
			toolbar: 'about'
		});

		CKEDITOR.dialog.add( 'about', this.path + 'dialogs/about.js' );
	}
});
