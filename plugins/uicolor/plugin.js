/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'uicolor', {
	requires: 'dialog',
	lang: 'af,ar,az,bg,ca,cs,cy,da,de,de-ch,el,en,en-gb,eo,es,et,eu,fa,fi,fr,fr-ca,gl,he,hr,hu,id,it,ja,km,ko,ku,lv,mk,nb,nl,no,oc,pl,pt,pt-br,ru,si,sk,sl,sq,sv,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	icons: 'uicolor', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function( editor ) {
		if ( CKEDITOR.env.ie6Compat )
			return;

		editor.addCommand( 'uicolor', new CKEDITOR.dialogCommand( 'uicolor' ) );
		editor.ui.addButton && editor.ui.addButton( 'UIColor', {
			label: editor.lang.uicolor.title,
			command: 'uicolor',
			toolbar: 'tools,1'
		} );
		CKEDITOR.dialog.add( 'uicolor', this.path + 'dialogs/uicolor.js' );

		// Load YUI js files.
		CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( 'plugins/uicolor/yui/yui.js' ) );

		// Load YUI css files.
		CKEDITOR.document.appendStyleSheet( CKEDITOR.getUrl( 'plugins/uicolor/yui/assets/yui.css' ) );
	}
} );
