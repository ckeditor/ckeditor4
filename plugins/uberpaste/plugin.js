/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	/* global confirm */

	// Flag indicate this command is actually been asked instead of a generic pasting.
	var forcePaste = false,
		path;

	CKEDITOR.plugins.add( 'uberpaste', {
		requires: 'clipboard',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'uberpaste,uberpaste-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			path = this.path;

			editor.addCommand( 'uberpaste', {
				// Snapshots are done manually by editable.insertXXX methods.
				canUndo: false,
				async: true,

				/**
				 * The Uber Paste command. It will determine its pasted content from different editors automatically if possible.
				 *
				 * At the time of writing it was working correctly only in Internet Explorer browsers, due to their
				 * `paste` support in `document.execCommand`.
				 *
				 * @private
				 * @param {CKEDITOR.editor} editor An instance of the editor where the command is being executed.
				 * @param {Object} [data] The options object.
				 * @param {Boolean/String} [data.notification=true] Content for a notification shown after an unsuccessful
				 * paste attempt. If `false`, the notification will not be displayed. This parameter was added in 4.7.0.
				 * @member CKEDITOR.editor.commands.uberpaste
				 */
				exec: function( editor, data ) {
					forcePaste = true;
					editor.execCommand( 'paste', {
						type: 'html',
						notification: data && typeof data.notification !== 'undefined' ? data.notification : true
					} );
				}
			} );

			CKEDITOR.plugins.clipboard.addPasteButton( editor, 'UberPaste', {
				label: editor.lang.uberpaste.toolbar,
				command: 'uberpaste',
				toolbar: 'clipboard,50'
			} );

			new PasteParser( editor, {
				cleanFn: function() {
					return CKEDITOR.cleanWord;
				},

				canHandle: function( evt ) {
					var html = evt.dataValue,
						officeMetaRegexp = /<meta\s*name=(?:\"|\')?generator(?:\"|\')?\s*content=(?:\"|\')?microsoft/gi,
						wordRegexp = /(class=\"?Mso|style=(?:\"|\')[^\"]*?\bmso\-|w:WordDocument|<o:\w+>|<\/font>)/,
						isOfficeContent = officeMetaRegexp.test( html ) || wordRegexp.test( html );

					if ( !html || !( forcePaste || isOfficeContent ) ) {
						return false;
					}

					// PFW might still get prevented, if it's not forced.
					if ( editor.fire( 'pasteFromWord', evt ) === false && !forcePaste ) {
						return false;
					}

					return true;
				}
			} ).register();

			new PasteParser( editor, {
				cleanFn: function() {
					return CKEDITOR.cleanGdocs;
				},

				canHandle: function( evt ) {
					return evt.dataValue.match( /id=(\"|\')docs\-internal\-guid\-/ );
				}

			} ).register();

		}

	} );

	function PasteParser( editor, strategy ) {
		this.editor = editor;
		this.strategy = strategy;
	}

	PasteParser.prototype = {

		register: function() {
			// Listen with high priority (3), so clean up is done before content
			// type sniffing (priority = 6).
			this.editor.on( 'paste', function( evt ) {
				this.pasteListener( evt );
			}, this, null, 3 );

			if ( this.requiresImagesProcessing() ) {
				this.editor.on( 'afterPasteFromWord', function( evt ) {
					this.imagePastingListener( evt );
				}, this );
			}
		},

		// Paste From Word Image:
		// RTF clipboard is required for embedding images.
		// If img tags are not allowed there is no point to process images.
		requiresImagesProcessing: function() {
			return this.editor.config.pasteFromWord_inlineImages === undefined || this.editor.config.pasteFromWord_inlineImages;
		},

		loadFilterRules: function( callback ) {
			var isLoaded = Boolean( this.strategy.cleanFn() );

			if ( isLoaded ) {
				callback();
			}

			else {
				var filterFilePath = CKEDITOR.getUrl( this.editor.config.pasteFromWordCleanupFile || ( path + 'filter/default.js' ) );
				// Load with busy indicator.
				CKEDITOR.scriptLoader.load( filterFilePath, callback, null, true );
			}

			return !isLoaded;
		},

		pasteListener: function( evt ) {
			var data = evt.data,
				editor = this.editor,
				strategy = this.strategy,
				isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
				dataTransferHtml = isCustomDataTypesSupported ? data.dataTransfer.getData( 'text/html', true ) : null,
				// Required in Paste from Word Image plugin (#662).
				dataTransferRtf = isCustomDataTypesSupported ? data.dataTransfer.getData( 'text/rtf' ) : null,
				// Some commands fire paste event without setting dataTransfer property. In such case
				// dataValue should be used.
				html = dataTransferHtml || data.dataValue,
				pasteEvtData = { dataValue: html, dataTransfer: { 'text/rtf': dataTransferRtf } };

			if ( !this.strategy.canHandle( pasteEvtData ) ) {
				return;
			}

			// Do not apply paste filter to data filtered by uberpaste (https://dev.ckeditor.com/ticket/13093).
			data.dontFilter = true;

			// If filter rules aren't loaded then cancel 'paste' event,
			// load them and when they'll get loaded fire new paste event
			// for which data will be filtered in second execution of
			// this listener.
			var isLazyLoad = this.loadFilterRules( function() {
				// Event continuation with the original data.
				if ( isLazyLoad ) {
					editor.fire( 'paste', data );
				} else if ( !editor.config.pasteFromWordPromptCleanup || ( forcePaste || confirm( editor.lang.uberpaste.confirmCleanup ) ) ) {

					pasteEvtData.dataValue = strategy.cleanFn()( html, editor );

					editor.fire( 'afterPasteFromWord', pasteEvtData );

					data.dataValue = pasteEvtData.dataValue;

					if ( editor.config.forcePasteAsPlainText === true ) {
						// If `config.forcePasteAsPlainText` set to true, force plain text even on Word content (#1013).
						data.type = 'text';
					} else if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported && editor.config.forcePasteAsPlainText === 'allow-word' ) {
						// In browsers using pastebin when pasting from Word, evt.data.type is 'auto' (not 'html') so it gets converted
						// by 'pastetext' plugin to 'text'. We need to restore 'html' type (#1013) and (#1638).
						data.type = 'html';
					}
				}

				// Reset forcePaste.
				forcePaste = false;
			} );

			// The cleanup rules are to be loaded, we should just cancel
			// this event.
			isLazyLoad && evt.cancel();

		},

		imagePastingListener: function( evt ) {
			var images = CKEDITOR.plugins.uberpaste && CKEDITOR.plugins.uberpaste.images,
				imgTags,
				hexImages,
				newSrcValues = [],
				i;

			// If images images namespace is unavailable or img tags are not allowed we simply skip adding images.
			if ( !images || !evt.editor.filter.check( 'img[src]' ) ) {
				return;
			}

			imgTags = images.extractTagsFromHtml( evt.data.dataValue );
			if ( imgTags.length === 0 ) {
				return;
			}

			hexImages = images.extractFromRtf( evt.data.dataTransfer[ 'text/rtf' ] );
			if ( hexImages.length === 0 ) {
				return;
			}

			CKEDITOR.tools.array.forEach( hexImages, function( img ) {
				newSrcValues.push( this.createSrcWithBase64( img ) );
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
		},

		createSrcWithBase64: function( img ) {
			return img.type ?
				'data:' + img.type + ';base64,' + CKEDITOR.tools.convertBytesToBase64( CKEDITOR.tools.convertHexStringToBytes( img.hex ) )
				: null;
		}
	};

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
