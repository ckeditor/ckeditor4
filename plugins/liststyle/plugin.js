/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	CKEDITOR.plugins.liststyle = {
		requires: 'dialog,contextmenu',
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			editor.addCommand( 'numberedListStyle', new CKEDITOR.dialogCommand( 'numberedListStyle' ) );
			CKEDITOR.dialog.add( 'numberedListStyle', this.path + 'dialogs/liststyle.js' );
			editor.addCommand( 'bulletedListStyle', new CKEDITOR.dialogCommand( 'bulletedListStyle' ) );
			CKEDITOR.dialog.add( 'bulletedListStyle', this.path + 'dialogs/liststyle.js' );

			//Register map group;
			editor.addMenuGroup( "list", 108 );

			editor.addMenuItems({
				numberedlist: {
					label: editor.lang.liststyle.numberedTitle,
					group: 'list',
					command: 'numberedListStyle'
				},
				bulletedlist: {
					label: editor.lang.liststyle.bulletedTitle,
					group: 'list',
					command: 'bulletedListStyle'
				}
			});

			editor.contextMenu.addListener( function( element, selection ) {
				if ( !element || element.isReadOnly() )
					return null;

				while ( element ) {
					var name = element.getName();
					if ( name == 'ol' )
						return { numberedlist: CKEDITOR.TRISTATE_OFF };
					else if ( name == 'ul' )
						return { bulletedlist: CKEDITOR.TRISTATE_OFF };

					element = element.getParent();
				}
				return null;
			});
		}
	};

	CKEDITOR.plugins.add( 'liststyle', CKEDITOR.plugins.liststyle );
})();
