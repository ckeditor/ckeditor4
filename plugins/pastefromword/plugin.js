/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	CKEDITOR.plugins.add( 'pastefromword', {
		requires: 'uberpaste',
		init: function( editor ) {
			editor.once( 'pluginsLoaded', function() {
				// Create an alias for `pastefromword` command.
				editor.addCommand( 'pastefromword', editor.getCommand( 'uberpaste' ) );
			} );
		}
	} );

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
