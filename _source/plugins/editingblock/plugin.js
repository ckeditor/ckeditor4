/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The default editing block plugin, which holds the editing area
 *		and source view.
 */

(function() {
	var getMode = function( editor, mode ) {
			return editor._.modes && editor._.modes[ mode || editor.mode ];
		};

	// This is a semaphore used to avoid recursive calls between
	// the following data handling functions.
	var isHandlingData;

	CKEDITOR.plugins.add( 'editingblock', {
		init: function( editor, pluginPath ) {
			if ( !editor.config.editingBlock )
				return;

			editor.on( 'themeSpace', function( event ) {
				if ( event.data.space == 'contents' )
					event.data.html += '<br>';
			});

			editor.on( 'themeLoaded', function() {
				editor.fireOnce( 'editingBlockReady' );
			});

			editor.on( 'uiReady', function() {
				editor.setMode( editor.config.startupMode );

				if ( editor.config.startupFocus )
					editor.focus();
			});

			editor.on( 'afterSetData', function() {
				if ( !isHandlingData && editor.mode ) {
					isHandlingData = true;
					getMode( editor ).loadData( editor.getData() );
					isHandlingData = false;
				}
			});

			editor.on( 'beforeGetData', function() {
				if ( !isHandlingData && editor.mode ) {
					isHandlingData = true;
					editor.setData( getMode( editor ).getData() );
					isHandlingData = false;
				}
			});
		}
	});

	/**
	 * The current editing mode. An editing mode is basically a viewport for
	 * editing or content viewing. By default the possible values for this
	 * property are "wysiwyg" and "source".
	 * @type String
	 * @example
	 * alert( CKEDITOR.instances.editor1.mode );  // "wysiwyg" (e.g.)
	 */
	CKEDITOR.editor.prototype.mode = '';

	/**
	 * Registers an editing mode. This function is to be used mainly by plugins.
	 * @param {String} mode The mode name.
	 * @param {Object} modeEditor The mode editor definition.
	 * @example
	 */
	CKEDITOR.editor.prototype.addMode = function( mode, modeEditor ) {
		modeEditor.name = mode;
		( this._.modes || ( this._.modes = {} ) )[ mode ] = modeEditor;
	};

	/**
	 * Sets the current editing mode in this editor instance.
	 * @param {String} mode A registered mode name.
	 * @example
	 * // Switch to "source" view.
	 * CKEDITOR.instances.editor1.setMode( 'source' );
	 */
	CKEDITOR.editor.prototype.setMode = function( mode ) {
		var data,
			holderElement = this.getThemeSpace( 'contents' );

		// Unload the previous mode.
		if ( this.mode ) {
			if ( mode == this.mode )
				return;

			var currentMode = getMode( this );
			data = currentMode.getData();
			currentMode.unload( holderElement );
			this.mode = '';
		}

		holderElement.setHtml( '' );

		// Load required mode.
		var modeEditor = getMode( this, mode );
		if ( !modeEditor )
			throw '[CKEDITOR.editor.setMode] Unknown mode "' + mode + '".';

		modeEditor.load( holderElement, data || this.getData() );

		this.mode = mode;
		this.fire( 'mode' );
	};

	/**
	 * Moves the selection focus to the editing are space in the editor.
	 */
	CKEDITOR.editor.prototype.focus = function() {
		var mode = getMode( this );
		if ( mode )
			mode.focus();
	};
})();

/**
 * The mode to load at the editor startup. It depends on the plugins
 * loaded. By default, the "wysiwyg" and "source" modes are available.
 * @type String
 * @default 'wysiwyg'
 * @example
 * config.toolbarLocation = 'source';
 */
CKEDITOR.config.startupMode = 'wysiwyg';

/**
 * Sets whether the editor should have the focus when the page loads.
 * @type Boolean
 * @default false
 */
CKEDITOR.config.startupFocus = false;

CKEDITOR.config.editingBlock = true;
