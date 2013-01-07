/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Horizontal Page Break.
 */

// Register a plugin named "newpage".
CKEDITOR.plugins.add( 'newpage', {
	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
	icons: 'newpage,newpage-rtl', // %REMOVE_LINE_CORE%
	init: function( editor ) {
		editor.addCommand( 'newpage', { modes:{wysiwyg:1,source:1 },

			exec: function( editor ) {
				var command = this;
				editor.setData( editor.config.newpage_html || '', function() {
					editor.focus();
					// Save the undo snapshot after all document changes are affected. (#4889)
					setTimeout( function() {
						editor.fire( 'afterCommandExec', {
							name: 'newpage',
							command: command
						});
						editor.selectionChange();

					}, 200 );
				});
			},
			async: true
		});

		editor.ui.addButton && editor.ui.addButton( 'NewPage', {
			label: editor.lang.newpage.toolbar,
			command: 'newpage',
			toolbar: 'document,20'
		});
	}
});

/**
 * The HTML to load in the editor when the "new page" command is executed.
 *
 *		config.newpage_html = '<p>Type your text here.</p>';
 *
 * @cfg {String} [newpage_html='']
 * @member CKEDITOR.config
 */
