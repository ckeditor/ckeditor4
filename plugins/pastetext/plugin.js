/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Paste as plain text plugin.
 */

( function() {
	// The pastetext command definition.
	var pasteTextCmd = {
		// Snapshots are done manually by editable.insertXXX methods.
		canUndo: false,
		async: true,

		exec: function( editor, data ) {
			var keystroke = CKEDITOR.env.ie ? null : ( editor.getCommandKeystroke( this ) ),
				showNotification = typeof data.showNotification !== 'undefined' ? data.showNotification :
					!data || !data.from || ( data.from === 'keystrokeHandler' && CKEDITOR.env.ie );

			editor.execCommand( 'paste', {
				description: editor.lang.pastetext.description,
				keystroke: keystroke,
				type: 'text',
				showNotification: showNotification } );
		}
	};

	// Register the plugin.
	CKEDITOR.plugins.add( 'pastetext', {
		requires: 'clipboard',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'pastetext,pastetext-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var commandName = 'pastetext';

			editor.addCommand( commandName, pasteTextCmd );

			editor.setKeystroke( CKEDITOR.CTRL + CKEDITOR.SHIFT + 86, commandName ); // Ctrl + Shift + V

			editor.ui.addButton && editor.ui.addButton( 'PasteText', {
				label: editor.lang.pastetext.button,
				command: commandName,
				toolbar: 'clipboard,40'
			} );

			if ( editor.config.forcePasteAsPlainText ) {
				editor.on( 'beforePaste', function( evt ) {
					// Do NOT overwrite if HTML format is explicitly requested.
					// This allows pastefromword dominates over pastetext.
					if ( evt.data.type != 'html' )
						evt.data.type = 'text';
				} );
			}

			editor.on( 'pasteState', function( evt ) {
				editor.getCommand( commandName ).setState( evt.data );
			} );
		}
	} );
} )();


/**
 * Whether to force all pasting operations to insert on plain text into the
 * editor, loosing any formatting information possibly available in the source
 * text.
 *
 * **Note:** paste from word (dialog) is not affected by this configuration.
 *
 *		config.forcePasteAsPlainText = true;
 *
 * @cfg {Boolean} [forcePasteAsPlainText=false]
 * @member CKEDITOR.config
 */
