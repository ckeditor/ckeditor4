/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The Paste as plain text plugin.
 */

( function() {
	// The pastetext command definition.
	var pasteTextCmd = {
		// Snapshots are done manually by editable.insertXXX methods.
		canUndo: false,
		async: true,

		/**
		 * The Paste as plain text command. It will determine its pasted text automatically if possible.
		 *
		 * At the time of writing it was working correctly only in Internet Explorer browsers, due to their
		 * `paste` support in `document.execCommand`.
		 *
		 * @private
		 * @param {CKEDITOR.editor} editor An instance of the editor where the command is being executed.
		 * @param {Object} [data] The options object.
		 * @param {Boolean/String} [data.notification=true] Content for a notification shown after an unsuccessful
		 * paste attempt. If `false`, the notification will not be displayed. This parameter was added in 4.7.0.
		 * @member CKEDITOR.editor.commands.pastetext
		 */
		exec: function( editor, data ) {
			var lang = editor.lang,
				// In IE we must display keystroke for `paste` command as blocked `pastetext`
				// can fallback only to native paste.
				keyInfo = CKEDITOR.tools.keystrokeToString( lang.common.keyboard,
					editor.getCommandKeystroke( CKEDITOR.env.ie ? editor.commands.paste : this ) ),
				notification = ( data && typeof data.notification !== 'undefined' ) ? data.notification :
					!data || !data.from || ( data.from === 'keystrokeHandler' && CKEDITOR.env.ie ),
				msg = ( notification && typeof notification === 'string' ) ? notification : lang.pastetext.pasteNotification
					.replace( /%1/, '<kbd aria-label="' + keyInfo.aria + '">' + keyInfo.display + '</kbd>' );

			editor.execCommand( 'paste', {
				type: 'text',
				notification: notification ? msg : false
			} );
		}
	};

	// Register the plugin.
	CKEDITOR.plugins.add( 'pastetext', {
		requires: 'clipboard',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'pastetext,pastetext-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var commandName = 'pastetext',
				pasteKeystroke = !CKEDITOR.env.safari ? CKEDITOR.CTRL + CKEDITOR.SHIFT + 86 : // Ctrl + Shift + V
					CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + 86; // Ctrl + Shift + Alt + V

			editor.addCommand( commandName, pasteTextCmd );

			editor.setKeystroke( pasteKeystroke, commandName );

			CKEDITOR.plugins.clipboard.addPasteButton( editor, 'PasteText', {
				label: editor.lang.pastetext.button,
				command: commandName,
				toolbar: 'clipboard,40'
			} );

			if ( editor.config.forcePasteAsPlainText ) {
				editor.on( 'beforePaste', function( evt ) {
					// Do NOT overwrite if HTML format is explicitly requested.
					// This allows pastefromword dominates over pastetext.
					if ( evt.data.type != 'html' ) {
						evt.data.type = 'text';
					}
				} );
			}

			editor.on( 'pasteState', function( evt ) {
				editor.getCommand( commandName ).setState( evt.data );
			} );
		}
	} );
} )();


/**
 * Whether to force all pasting operations to insert plain text into the
 * editor, losing any formatting information possibly available in the source text.
 *
 * This option accepts the following settings:
 *
 * *  `true` &ndash; Pastes all content as plain text.
 * *  `false` &ndash; Preserves content formatting.
 * *  `allow-word` &ndash; Content pasted from Microsoft Word will keep its formatting
 *     while any other content will be pasted as plain text.
 *
 * Example:
 *
 *		// All content will be pasted as plain text.
 *		config.forcePasteAsPlainText = true;
 *
 *		// Only Microsoft Word content formatting will be preserved.
 * 		config.forcePasteAsPlainText = 'allow-word';
 *
 * @cfg {Boolean/String} [forcePasteAsPlainText=false]
 * @member CKEDITOR.config
 */
