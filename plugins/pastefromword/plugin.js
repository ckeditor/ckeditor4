/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	/* global confirm */

	CKEDITOR.plugins.add( 'pastefromword', {
		requires: 'clipboard',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'pastefromword,pastefromword-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			// Flag indicate this command is actually been asked instead of a generic pasting.
			var forceFromWord = 0,
				path = this.path;

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
			editor.ui.addButton && editor.ui.addButton( 'PasteFromWord', {
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
			editor.on( 'paste', function( evt ) {
				var data = evt.data,
					dataTransferHtml = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ?
						data.dataTransfer.getData( 'text/html', true ) : null,
					// Some commands fire paste event without setting dataTransfer property. In such case
					// dataValue should be used.
					mswordHtml = dataTransferHtml || data.dataValue,
					pfwEvtData = { dataValue: mswordHtml },
					officeMetaRegexp = /<meta\s*name=(?:\"|\')?generator(?:\"|\')?\s*content=(?:\"|\')?microsoft/gi,
					wordRegexp = /(class=\"?Mso|style=(?:\"|\')[^\"]*?\bmso\-|w:WordDocument|<o:\w+>|<\/font>)/,
					isOfficeContent = officeMetaRegexp.test( mswordHtml ) || wordRegexp.test( mswordHtml );

				if ( !mswordHtml || !( forceFromWord || isOfficeContent ) ) {
					return;
				}

				// PFW might still get prevented, if it's not forced.
				if ( editor.fire( 'pasteFromWord', pfwEvtData ) === false && !forceFromWord ) {
					return;
				}

				// Do not apply paste filter to data filtered by the Word filter (http://dev.ckeditor.com/ticket/13093).
				data.dontFilter = true;

				// If filter rules aren't loaded then cancel 'paste' event,
				// load them and when they'll get loaded fire new paste event
				// for which data will be filtered in second execution of
				// this listener.
				var isLazyLoad = loadFilterRules( editor, path, function() {
					// Event continuation with the original data.
					if ( isLazyLoad ) {
						editor.fire( 'paste', data );
					} else if ( !editor.config.pasteFromWordPromptCleanup || ( forceFromWord || confirm( editor.lang.pastefromword.confirmCleanup ) ) ) {
						pfwEvtData.dataValue = CKEDITOR.cleanWord( pfwEvtData.dataValue, editor );

						editor.fire( 'afterPasteFromWord', pfwEvtData );

						data.dataValue = pfwEvtData.dataValue;
					}

					// Reset forceFromWord.
					forceFromWord = 0;
				} );

				// The cleanup rules are to be loaded, we should just cancel
				// this event.
				isLazyLoad && evt.cancel();
			}, null, null, 3 );
		}

	} );

	function loadFilterRules( editor, path, callback ) {
		var isLoaded = CKEDITOR.cleanWord;

		if ( isLoaded )
			callback();
		else {
			var filterFilePath = CKEDITOR.getUrl( editor.config.pasteFromWordCleanupFile || ( path + 'filter/default.js' ) );

			// Load with busy indicator.
			CKEDITOR.scriptLoader.load( filterFilePath, callback, null, true );
		}

		return !isLoaded;
	}
} )();


/**
 * Whether to prompt the user about the clean up of content being pasted from Microsoft Word.
 *
 *		config.pasteFromWordPromptCleanup = true;
 *
 * @since 3.1
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
 * @since 3.1
 * @cfg {String} [pasteFromWordCleanupFile=<plugin path> + 'filter/default.js']
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
