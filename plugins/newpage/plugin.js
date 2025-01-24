﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Horizontal Page Break.
 */

// Register a plugin named "newpage".
CKEDITOR.plugins.add( 'newpage', {
	// jscs:disable maximumLineLength
	lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	// jscs:enable maximumLineLength
	icons: 'newpage,newpage-rtl', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function( editor ) {
		editor.addCommand( 'newpage', { modes: { wysiwyg: 1, source: 1 },

			exec: function( editor ) {
				var command = this;
				editor.setData( editor.config.newpage_html || '', function() {
					editor.focus();
					// Save the undo snapshot after all document changes are affected. (https://dev.ckeditor.com/ticket/4889)
					setTimeout( function() {
						editor.fire( 'afterCommandExec', {
							name: 'newpage',
							command: command
						} );
						editor.selectionChange();

					}, 200 );
				} );
			},
			async: true
		} );

		editor.ui.addButton && editor.ui.addButton( 'NewPage', {
			label: editor.lang.newpage.toolbar,
			command: 'newpage',
			toolbar: 'document,20'
		} );
	}
} );

/**
 * The HTML to load in the editor when the "new page" command is executed.
 *
 *		config.newpage_html = '<p>Type your text here.</p>';
 *
 * @cfg {String} [newpage_html='']
 * @member CKEDITOR.config
 */
