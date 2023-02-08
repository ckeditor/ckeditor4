/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview This plugin handles pasting content from Microsoft Office applications.
 */

( function() {
	/* global confirm */

	CKEDITOR.plugins.add( 'pastefromword', {
		requires: 'pastetools',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'pastefromword,pastefromword-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			// Flag indicate this command is actually been asked instead of a generic pasting.
			var forceFromWord = 0,
				pastetoolsPath = CKEDITOR.plugins.getPath( 'pastetools' ),
				path = this.path,
				configInlineImages = editor.config.pasteFromWord_inlineImages === undefined ? true : editor.config.pasteFromWord_inlineImages,
				defaultFilters = [
					CKEDITOR.getUrl( pastetoolsPath + 'filter/common.js' ),
					CKEDITOR.getUrl( pastetoolsPath + 'filter/image.js' ),
					CKEDITOR.getUrl( path + 'filter/default.js' )
				];

			editor.addCommand( 'pastefromword', {
				// Snapshots are done manually by editable.insertXXX methods.
				canUndo: false,
				async: true,

				/**
				 * The Paste from Word command. It will determine its pasted content from Word automatically if possible.
				 *
				 * At the time of writing it was working correctly only in Internet Explorer browsers, due to their
				 * `paste` support in `document.execCommand`.
				 *
				 * @private
				 * @param {CKEDITOR.editor} editor An instance of the editor where the command is being executed.
				 * @param {Object} [data] The options object.
				 * @param {Boolean/String} [data.notification=true] Content for a notification shown after an unsuccessful
				 * paste attempt. If `false`, the notification will not be displayed. This parameter was added in 4.7.0.
				 * @member CKEDITOR.editor.commands.pastefromword
				 */
				exec: function( editor, data ) {
					forceFromWord = 1;
					editor.execCommand( 'paste', {
						type: 'html',
						notification: data && typeof data.notification !== 'undefined' ? data.notification : true
					} );
				}
			} );

			// Register the toolbar button.
			CKEDITOR.plugins.clipboard.addPasteButton( editor, 'PasteFromWord', {
				label: editor.lang.pastefromword.toolbar,
				command: 'pastefromword',
				toolbar: 'clipboard,50'
			} );

			// Features brought by this command beside the normal process:
			// 1. No more bothering of user about the clean-up.
			// 2. Perform the clean-up even if content is not from Microsoft Word.
			// (e.g. from a Microsoft Word similar application.)
			// 3. Listen with high priority (3), so clean up is done before content
			// type sniffing (priority = 6).
			editor.pasteTools.register( {
				filters: editor.config.pasteFromWordCleanupFile ? [ editor.config.pasteFromWordCleanupFile ] :
					defaultFilters,

				canHandle: function( evt ) {
					var data = evt.data,
						// Always get raw clipboard data (#3586).
						mswordHtml = CKEDITOR.plugins.pastetools.getClipboardData( data, 'text/html' ),
						generatorName = CKEDITOR.plugins.pastetools.getContentGeneratorName( mswordHtml ),
						wordRegexp = /(class="?Mso|style=["'][^"]*?\bmso\-|w:WordDocument|<o:\w+>|<\/font>)/,
						// Use wordRegexp only when there is no meta generator tag in the content
						isOfficeContent = generatorName ? generatorName === 'microsoft' : wordRegexp.test( mswordHtml );

					return mswordHtml && ( forceFromWord || isOfficeContent );
				},

				handle: function( evt, next ) {
					var data = evt.data,
						mswordHtml = CKEDITOR.plugins.pastetools.getClipboardData( data, 'text/html' ),
						// Required in Paste from Word Image plugin (#662).
						dataTransferRtf = CKEDITOR.plugins.pastetools.getClipboardData( data, 'text/rtf' ),
						pfwEvtData = { dataValue: mswordHtml, dataTransfer: { 'text/rtf': dataTransferRtf } };

					// PFW might still get prevented, if it's not forced.
					if ( editor.fire( 'pasteFromWord', pfwEvtData ) === false && !forceFromWord ) {
						return;
					}

					// Do not apply paste filter to data filtered by the Word filter (https://dev.ckeditor.com/ticket/13093).
					data.dontFilter = true;

					if ( forceFromWord || confirmCleanUp() ) {
						pfwEvtData.dataValue = CKEDITOR.cleanWord( pfwEvtData.dataValue, editor );

						// Paste From Word Image:
						// RTF clipboard is required for embedding images.
						// If img tags are not allowed there is no point to process images.
						// Also skip embedding images if image filter is not loaded.
						if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported && configInlineImages &&
							CKEDITOR.pasteFilters.image ) {
							pfwEvtData.dataValue = CKEDITOR.pasteFilters.image( pfwEvtData.dataValue, editor, dataTransferRtf );
						}

						editor.fire( 'afterPasteFromWord', pfwEvtData );

						data.dataValue = pfwEvtData.dataValue;

						if ( editor.config.forcePasteAsPlainText === true ) {
							// If `config.forcePasteAsPlainText` set to true, force plain text even on Word content (#1013).
							data.type = 'text';
						} else if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported && editor.config.forcePasteAsPlainText === 'allow-word' ) {
							// In browsers using pastebin when pasting from Word, evt.data.type is 'auto' (not 'html') so it gets converted
							// by 'pastetext' plugin to 'text'. We need to restore 'html' type (#1013) and (#1638).
							data.type = 'html';
						}
					}

					// Reset forceFromWord.
					forceFromWord = 0;

					next();

					function confirmCleanUp() {
						return !editor.config.pasteFromWordPromptCleanup ||
							confirm( editor.lang.pastefromword.confirmCleanup );
					}
				}
			} );
		}
	} );
} )();


/**
 * Whether to prompt the user about the clean up of content being pasted from Microsoft Word.
 *
 *		config.pasteFromWordPromptCleanup = true;
 *
 * @since 3.1.0
 * @cfg {Boolean} [pasteFromWordPromptCleanup=false]
 * @member CKEDITOR.config
 */

/**
 * The file that provides the Microsoft Word cleanup function for pasting operations.
 *
 * **Note:** This is a global configuration shared by all editor instances present
 * on the page.
 *
 *		// Load from the 'pastefromword' plugin 'filter' sub folder (custom.js file) using a path relative to the CKEditor installation folder.
 *		CKEDITOR.config.pasteFromWordCleanupFile = 'plugins/pastefromword/filter/custom.js';
 *
 *		// Load from the 'pastefromword' plugin 'filter' sub folder (custom.js file) using a full path (including the CKEditor installation folder).
 *		CKEDITOR.config.pasteFromWordCleanupFile = '/ckeditor/plugins/pastefromword/filter/custom.js';
 *
 *		// Load custom.js file from the 'customFilters' folder (located in server's root) using the full URL.
 *		CKEDITOR.config.pasteFromWordCleanupFile = 'http://my.example.com/customFilters/custom.js';
 *
 * @since 3.1.0
 * @cfg {String} [pasteFromWordCleanupFile=<plugin path> + 'filter/default.js']
 * @member CKEDITOR.config
 */

/**
 * Flag decides whether embedding images pasted with Word content is enabled or not.
 *
 * **Note:** Please be aware that embedding images requires Clipboard API support, available only in modern browsers, that is indicated by
 * {@link CKEDITOR.plugins.clipboard#isCustomDataTypesSupported} flag.
 *
 *		// Disable embedding images pasted from Word.
 *		config.pasteFromWord_inlineImages = false;
 *
 * @since 4.8.0
 * @cfg {Boolean} [pasteFromWord_inlineImages=true]
 * @member CKEDITOR.config
 */

/**
 * See {@link #pasteTools_keepZeroMargins}.
 * @since 4.12.0
 * @deprecated 4.13.0
 * @cfg {Boolean} [pasteFromWord_keepZeroMargins=false]
 * @member CKEDITOR.config
 */

/**
 * Fired when the pasted content was recognized as Microsoft Word content.
 *
 * This event is cancellable. If canceled, it will prevent Paste from Word processing.
 *
 * @since 4.6.0
 * @event pasteFromWord
 * @param data
 * @param {String} data.dataValue Pasted content. Changes to this property will affect the pasted content.
 * @member CKEDITOR.editor
 */

/**
 * Fired after the Paste form Word filters have been applied.
 *
 * @since 4.6.0
 * @event afterPasteFromWord
 * @param data
 * @param {String} data.dataValue Pasted content after processing. Changes to this property will affect the pasted content.
 * @member CKEDITOR.editor
 */
