/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
				path = this.path,
				configInlineImages = editor.config.pasteFromWord_inlineImages === undefined ? true : editor.config.pasteFromWord_inlineImages;

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
			editor.on( 'paste', function( evt ) {
				var data = evt.data,
					dataTransferHtml = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ?
						data.dataTransfer.getData( 'text/html', true ) : null,
					// Required in Paste from Word Image plugin (#662).
					dataTransferRtf = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ?
						data.dataTransfer.getData( 'text/rtf' ) : null,
					// Some commands fire paste event without setting dataTransfer property. In such case
					// dataValue should be used.
					mswordHtml = dataTransferHtml || data.dataValue,
					pfwEvtData = { dataValue: mswordHtml, dataTransfer: { 'text/rtf': dataTransferRtf } },
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

				// Do not apply paste filter to data filtered by the Word filter (https://dev.ckeditor.com/ticket/13093).
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
				} );

				// The cleanup rules are to be loaded, we should just cancel
				// this event.
				isLazyLoad && evt.cancel();
			}, null, null, 3 );

			// Paste From Word Image:
			// RTF clipboard is required for embedding images.
			// If img tags are not allowed there is no point to process images.
			if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported && configInlineImages ) {
				editor.on( 'afterPasteFromWord', imagePastingListener );
			}

			function imagePastingListener( evt ) {
				var pfw = CKEDITOR.plugins.pastefromword && CKEDITOR.plugins.pastefromword.images,
					imgTags,
					hexImages,
					newSrcValues = [],
					i;

				// If pfw images namespace is unavailable or img tags are not allowed we simply skip adding images.
				if ( !pfw || !evt.editor.filter.check( 'img[src]' ) ) {
					return;
				}

				function createSrcWithBase64( img ) {
					return img.type ? 'data:' + img.type + ';base64,' + CKEDITOR.tools.convertBytesToBase64( CKEDITOR.tools.convertHexStringToBytes( img.hex ) ) : null;
				}

				imgTags = pfw.extractTagsFromHtml( evt.data.dataValue );
				if ( imgTags.length === 0 ) {
					return;
				}

				hexImages = pfw.extractFromRtf( evt.data.dataTransfer[ 'text/rtf' ] );
				if ( hexImages.length === 0 ) {
					return;
				}

				CKEDITOR.tools.array.forEach( hexImages, function( img ) {
					newSrcValues.push( createSrcWithBase64( img ) );
				}, this );

				// Assuming there is equal amount of Images in RTF and HTML source, so we can match them accordingly to the existing order.
				if ( imgTags.length === newSrcValues.length ) {
					for ( i = 0; i < imgTags.length; i++ ) {
						// Replace only `file` urls of images ( shapes get newSrcValue with null ).
						if ( ( imgTags[ i ].indexOf( 'file://' ) === 0 ) && newSrcValues[ i ] ) {
							evt.data.dataValue = evt.data.dataValue.replace( imgTags[ i ], newSrcValues[ i ] );
						}
					}
				}
			}
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
 * Whether pasted elements `margin` style which equals to 0 should be removed.
 *
 *		// Disable removing `margin:0`, `margin-left:0`, etc.
 *		config.pasteFromWord_keepZeroMargins = true;
 *
 * @since 4.12.0
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
