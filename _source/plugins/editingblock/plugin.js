/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The default editing block plugin that contains the editing area
 *		and the source view.
 */

(function() {
	// This is a semaphore used to avoid recursive calls between
	// the following data handling functions.
	var isHandlingData;

	CKEDITOR.plugins.add( 'editingblock', {
		init: function( editor ) {
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
			});

			editor.on( 'afterSetData', function() {
				if ( !isHandlingData ) {
					function setData() {
						isHandlingData = true;
						editor.getMode().loadData( editor.getData() );
						isHandlingData = false;
					}

					if ( editor.mode )
						setData();
					else {
						editor.on( 'mode', function() {
							if ( editor.mode ) {
								setData();
								editor.removeListener( 'mode', arguments.callee );
							}
						});
					}
				}
			});

			editor.on( 'beforeGetData', function() {
				if ( !isHandlingData && editor.mode ) {
					isHandlingData = true;
					editor.setData( editor.getMode().getData(), null, 1 );
					isHandlingData = false;
				}
			});

			editor.on( 'getSnapshot', function( event ) {
				if ( editor.mode )
					event.data = editor.getMode().getSnapshotData();
			});

			editor.on( 'loadSnapshot', function( event ) {
				if ( editor.mode )
					editor.getMode().loadSnapshotData( event.data );
			});

			// For the first "mode" call, we'll also fire the "instanceReady"
			// event.
			editor.on( 'mode', function( event ) {
				// Do that once only.
				event.removeListener();

				// Redirect the focus into editor for webkit. (#5713)
				CKEDITOR.env.webkit && editor.container.on( 'focus', function() {
					editor.focus();
				});

				if ( editor.config.startupFocus )
					editor.focus();

				// Fire instanceReady for both the editor and CKEDITOR, but
				// defer this until the whole execution has completed
				// to guarantee the editor is fully responsible.
				setTimeout( function() {
					editor.fireOnce( 'instanceReady' );
					CKEDITOR.fire( 'instanceReady', null, editor );
				}, 0 );
			});

			editor.on( 'destroy', function() {
				// ->		currentMode.unload( holderElement );
				if ( this.mode )
					this._.modes[ this.mode ].unload( this.getThemeSpace( 'contents' ) );
			});
		}
	});

	/**
	 * The current editing mode. An editing mode is basically a viewport for
	 * editing or content viewing. By default the possible values for this
	 * property are <code>wysiwyg</code> and <code>source</code>.
	 * @type String
	 * @example
	 * alert( CKEDITOR.instances.editor1.<strong>mode</strong> );  // E.g. "wysiwyg"
	 */
	CKEDITOR.editor.prototype.mode = '';

	/**
	 * Registers an editing mode. This function is to be mainly used by plugins.
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
	 * CKEDITOR.instances.editor1.<strong>setMode( 'source' )</strong>;
	 */
	CKEDITOR.editor.prototype.setMode = function( mode ) {
		this.fire( 'beforeSetMode', { newMode: mode } );

		var data,
			holderElement = this.getThemeSpace( 'contents' ),
			isDirty = this.checkDirty();

		// Unload the previous mode.
		if ( this.mode ) {
			if ( mode == this.mode )
				return;

			this._.previousMode = this.mode;

			this.fire( 'beforeModeUnload' );

			var currentMode = this.getMode();
			data = currentMode.getData();
			currentMode.unload( holderElement );
			this.mode = '';
		}

		holderElement.setHtml( '' );

		// Load required mode.
		var modeEditor = this.getMode( mode );
		if ( !modeEditor )
			throw '[CKEDITOR.editor.setMode] Unknown mode "' + mode + '".';

		if ( !isDirty ) {
			this.on( 'mode', function() {
				this.resetDirty();
				this.removeListener( 'mode', arguments.callee );
			});
		}

		modeEditor.load( holderElement, ( typeof data ) != 'string' ? this.getData() : data );
	};

	/**
	 * Gets the current or any of the objects that represent the editing
	 * area modes. The two most common editing modes are <code>wysiwyg</code>
	 * and <code>source</code>.
	 * @param {String} [mode] The mode to be retrieved. If not specified, the
	 *		current one is returned.
	 */
	CKEDITOR.editor.prototype.getMode = function( mode ) {
		return this._.modes && this._.modes[ mode || this.mode ];
	};

	/**
	 * Moves the selection focus to the editing area space in the editor.
	 */
	CKEDITOR.editor.prototype.focus = function() {
		this.forceNextSelectionCheck();
		var mode = this.getMode();
		if ( mode )
			mode.focus();
	};
})();

/**
 * The mode to load at the editor startup. It depends on the plugins
 * loaded. By default the <code>wysiwyg</code> and <code>source</code>
 * modes are available.
 * @type String
 * @default <code>'wysiwyg'</code>
 * @example
 * config.startupMode = 'source';
 */
CKEDITOR.config.startupMode = 'wysiwyg';

/**
 * Whether the editor should have the focus when the page loads.
 * @name CKEDITOR.config.startupFocus
 * @type Boolean
 * @default <code>false</code>
 * @example
 * config.startupFocus = true;
 */

/**
 * Whether to render the editing block area in the editor interface.
 * @type Boolean
 * @default <code>true</code>
 * @example
 * config.editingBlock = false;
 */
CKEDITOR.config.editingBlock = true;

/**
 * Fired when a CKEDITOR instance is created, fully initialized, and ready for interaction.
 * @name CKEDITOR#instanceReady
 * @event
 * @param {CKEDITOR.editor} editor The editor instance that has been created.
 */

/**
 * Fired when the CKEDITOR instance is created, fully initialized, and ready for interaction.
 * @name CKEDITOR.editor#instanceReady
 * @event
 */

/**
 * Fired before changing the editing mode. See <code>{@link CKEDITOR.editor#event:beforeSetMode}</code> and <code>{@link CKEDITOR.editor#event:mode}</code> for more information.
 * @see CKEDITOR.editor#event:beforeSetMode
 * @see CKEDITOR.editor#event:mode
 * @name CKEDITOR.editor#beforeModeUnload
 * @event
 */

/**
 * Fired before the editor mode is set. See <code>{@link CKEDITOR.editor#event:mode}</code> and <code>{@link CKEDITOR.editor#event:beforeModeUnload}</code> for more information.
 * @see CKEDITOR.editor#event:mode
 * @see CKEDITOR.editor#event:beforeModeUnload
 * @name CKEDITOR.editor#beforeSetMode
 * @event
 * @since 3.5.3
 * @param {String} newMode The name of the mode which is about to be set.
 */

/**
 * Fired after setting the editing mode. See <code>{@link CKEDITOR.editor#event:beforeSetMode}</code> and <code>{@link CKEDITOR.editor#event:beforeModeUnload}</code> for more information.
 * @see CKEDITOR.editor#event:beforeSetMode
 * @see CKEDITOR.editor#event:beforeModeUnload
 * @name CKEDITOR.editor#mode
 * @event
 * @param {String} previousMode The previous mode of the editor.
 */
