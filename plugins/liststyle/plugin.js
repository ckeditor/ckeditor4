/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	CKEDITOR.plugins.liststyle = {
		requires: 'dialog,contextmenu',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		init: function( editor ) {
			if ( editor.blockless )
				return;

			var def, cmd;

			def = new CKEDITOR.dialogCommand( 'numberedListStyle', {
				requiredContent: 'ol',
				allowedContent: 'ol{list-style-type}[start]; li{list-style-type}[value]',
				contentTransformations: [
					[ 'ol: listTypeToStyle' ]
				]
			} );
			cmd = editor.addCommand( 'numberedListStyle', def );
			editor.addFeature( cmd );
			CKEDITOR.dialog.add( 'numberedListStyle', this.path + 'dialogs/liststyle.js' );

			def = new CKEDITOR.dialogCommand( 'bulletedListStyle', {
				requiredContent: 'ul',
				allowedContent: 'ul{list-style-type}',
				contentTransformations: [
					[ 'ul: listTypeToStyle' ]
				]
			} );
			cmd = editor.addCommand( 'bulletedListStyle', def );
			editor.addFeature( cmd );
			CKEDITOR.dialog.add( 'bulletedListStyle', this.path + 'dialogs/liststyle.js' );

			//Register map group;
			editor.addMenuGroup( 'list', 108 );

			editor.addMenuItems( {
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
			} );

			editor.contextMenu.addListener( function( element ) {
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
			} );
		}
	};

	CKEDITOR.plugins.add( 'liststyle', CKEDITOR.plugins.liststyle );
} )();
