﻿
/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.editor} class, which represents an
 *		editor instance.
 */

(function() {
	// Override the basic constructor defined at editor_basic.js.
	Editor.prototype = CKEDITOR.editor.prototype;
	CKEDITOR.editor = Editor;

	/**
	 * Creates an editor class instance. This constructor should be rarely
	 * used, in favor of the {@link CKEDITOR} editor creation functions.
	 * @name CKEDITOR.editor
	 * @class Represents an editor instance.
	 * @param {Object} instanceConfig Configuration values for this specific
	 *		instance.
	 * @param {String} [data] Since 3.3. Initial value for the instance.
	 * @augments CKEDITOR.event
	 * @example
	 */
	function Editor( instanceConfig ) {
		// Call the CKEDITOR.event constructor to initialize this instance.
		CKEDITOR.event.call( this );

		// Declare the private namespace.
		this._ = {};

		this.commands = {};

		/**
		 * Contains all UI templates created for this editor instance.
		 * @name CKEDITOR.editor.prototype.templates
		 * @type Object
		 */
		this.templates = {};

		/**
		 * A unique random string assigned to each editor instance in the page.
		 * @name CKEDITOR.editor.prototype.id
		 * @type String
		 */
		this.id = CKEDITOR.tools.getNextId();

		/**
		 * The configurations for this editor instance. It inherits all
		 * settings defined in (@link CKEDITOR.config}, combined with settings
		 * loaded from custom configuration files and those defined inline in
		 * the page when creating the editor.
		 * @name CKEDITOR.editor.prototype.config
		 * @type Object
		 * @example
		 * var editor = CKEDITOR.instances.editor1;
		 * alert( <b>editor.config.skin</b> );  "kama" e.g.
		 */
		this.config = CKEDITOR.tools.prototypedCopy( CKEDITOR.config );

		/**
		 * Namespace containing UI features related to this editor instance.
		 * @name CKEDITOR.editor.prototype.ui
		 * @type CKEDITOR.ui
		 * @example
		 */
		this.ui = new CKEDITOR.ui( this );

		/**
		 * Controls the focus state of this editor instance. This property
		 * is rarely used for normal API operations. It is mainly
		 * destinated to developer adding UI elements to the editor interface.
		 * @name CKEDITOR.editor.prototype.focusManager
		 * @type CKEDITOR.focusManager
		 * @example
		 */
		this.focusManager = new CKEDITOR.focusManager( this );

		this.dataProcessor = new CKEDITOR.htmlDataProcessor( this );

		// Make the editor update its command states on mode change.
		this.on( 'mode', updateCommands );

		// Handle startup focus.
		this.on( 'instanceReady', function() {
			this.config.startupFocus && this.focus();
		});

		CKEDITOR.fire( 'instanceCreated', null, this );

		// Return the editor instance immediately to enable early stage event registrations.
		CKEDITOR.tools.setTimeout( function() {
			initConfig( this, instanceConfig );
		}, 0, this )
	}

	function updateCommands() {
		var command,
			commands = this.commands;

		for ( var name in commands ) {
			command = commands[ name ];
			command[ command.startDisabled ? 'disable' : command.modes[ this.mode ] ? 'enable' : 'disable' ]();
		}
	}

	// ##### START: Config Privates

	// These function loads custom configuration files and cache the
	// CKEDITOR.editorConfig functions defined on them, so there is no need to
	// download them more than once for several instances.
	var loadConfigLoaded = {};

	function loadConfig( editor ) {
		var customConfig = editor.config.customConfig;

		// Check if there is a custom config to load.
		if ( !customConfig )
			return false;

		customConfig = CKEDITOR.getUrl( customConfig );

		var loadedConfig = loadConfigLoaded[ customConfig ] || ( loadConfigLoaded[ customConfig ] = {} );

		// If the custom config has already been downloaded, reuse it.
		if ( loadedConfig.fn ) {
			// Call the cached CKEDITOR.editorConfig defined in the custom
			// config file for the editor instance depending on it.
			loadedConfig.fn.call( editor, editor.config );

			// If there is no other customConfig in the chain, fire the
			// "configLoaded" event.
			if ( CKEDITOR.getUrl( editor.config.customConfig ) == customConfig || !loadConfig( editor ) )
				editor.fireOnce( 'customConfigLoaded' );
		} else {
			// Load the custom configuration file.
			CKEDITOR.scriptLoader.load( customConfig, function() {
				// If the CKEDITOR.editorConfig function has been properly
				// defined in the custom configuration file, cache it.
				if ( CKEDITOR.editorConfig )
					loadedConfig.fn = CKEDITOR.editorConfig;
				else
					loadedConfig.fn = function() {};

				// Call the load config again. This time the custom
				// config is already cached and so it will get loaded.
				loadConfig( editor );
			});
		}

		return true;
	}

	function initConfig( editor, instanceConfig ) {
		// Setup the lister for the "customConfigLoaded" event.
		editor.on( 'customConfigLoaded', function() {
			if ( instanceConfig ) {
				// Register the events that may have been set at the instance
				// configuration object.
				if ( instanceConfig.on ) {
					for ( var eventName in instanceConfig.on ) {
						editor.on( eventName, instanceConfig.on[ eventName ] );
					}
				}

				// Overwrite the settings from the in-page config.
				CKEDITOR.tools.extend( editor.config, instanceConfig, true );

				delete editor.config.on;
			}

			onConfigLoaded( editor );
		});

		// The instance config may override the customConfig setting to avoid
		// loading the default ~/config.js file.
		if ( instanceConfig && instanceConfig.customConfig != undefined )
			editor.config.customConfig = instanceConfig.customConfig;

		// Load configs from the custom configuration files.
		if ( !loadConfig( editor ) )
			editor.fireOnce( 'customConfigLoaded' );
	}

	// ##### END: Config Privates

	function onConfigLoaded( editor ) {
		// Set config related properties.

		// Initialize the key handler, based on the configurations.
		initKeystrokeHandler( editor );

		/**
		 * Indicates the read-only state of this editor. This is a read-only property.
		 * @name CKEDITOR.editor.prototype.readOnly
		 * @type Boolean
		 * @since 3.6
		 * @see CKEDITOR.editor#setReadOnly
		 */
		editor.readOnly = !!( editor.config.readOnly || ( editor.element && editor.element.getAttribute( 'disabled' ) ) );

		/**
		 * Indicates that the editor is running into an environment where
		 * no block elements are accepted inside the content.
		 * @name CKEDITOR.editor.prototype.blockless
		 * @type Boolean
		 */
		editor.blockless = editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && !CKEDITOR.dtd[ editor.element.getName() ][ 'p' ];

		// Fire the "configLoaded" event.
		editor.fireOnce( 'configLoaded' );

		loadSkin( editor );
	}

	function loadSkin( editor ) {
		CKEDITOR.skin.loadPart( 'editor', function() {
			loadLang( editor );
		});
	}

	function loadLang( editor ) {
		CKEDITOR.lang.load( editor.config.language, editor.config.defaultLanguage, function( languageCode, lang ) {
			/**
			 * The code for the language resources that have been loaded
			 * for the user interface elements of this editor instance.
			 * @name CKEDITOR.editor.prototype.langCode
			 * @type String
			 * @example
			 * alert( editor.langCode );  // E.g. "en"
			 */
			editor.langCode = languageCode;

			/**
			 * An object that contains all language strings used by the editor
			 * interface.
			 * @name CKEDITOR.editor.prototype.lang
			 * @type CKEDITOR.lang
			 * @example
			 * alert( editor.lang.bold );  // E.g. "Negrito" (if the language is set to Portuguese)
			 */
			// As we'll be adding plugin specific entries that could come
			// from different language code files, we need a copy of lang,
			// not a direct reference to it.
			editor.lang = CKEDITOR.tools.prototypedCopy( lang );

			// We're not able to support RTL in Firefox 2 at this time.
			if ( CKEDITOR.env.gecko && CKEDITOR.env.version < 10900 && editor.lang.dir == 'rtl' )
				editor.lang.dir = 'ltr';

			if ( !editor.config.contentsLangDirection ) {
				// Fallback to either the editable element direction or editor UI direction depending on creators.
				editor.config.contentsLangDirection = editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? editor.element.getDirection( 1 ) : editor.lang.dir;
			}

			editor.fire( 'langLoaded' );

			loadPlugins( editor );
		});
	}

	function loadPlugins( editor ) {
		var config = editor.config,
			plugins = config.plugins,
			extraPlugins = config.extraPlugins,
			removePlugins = config.removePlugins;

		if ( extraPlugins ) {
			// Remove them first to avoid duplications.
			var removeRegex = new RegExp( '(?:^|,)(?:' + extraPlugins.replace( /\s*,\s*/g, '|' ) + ')(?=,|$)', 'g' );
			plugins = plugins.replace( removeRegex, '' );

			plugins += ',' + extraPlugins;
		}

		if ( removePlugins ) {
			removeRegex = new RegExp( '(?:^|,)(?:' + removePlugins.replace( /\s*,\s*/g, '|' ) + ')(?=,|$)', 'g' );
			plugins = plugins.replace( removeRegex, '' );
		}

		// Load the Adobe AIR plugin conditionally.
		CKEDITOR.env.air && ( plugins += ',adobeair' );

		// Load all plugins defined in the "plugins" setting.
		CKEDITOR.plugins.load( plugins.split( ',' ), function( plugins ) {
			// The list of plugins.
			var pluginsArray = [];

			// The language code to get loaded for each plugin. Null
			// entries will be appended for plugins with no language files.
			var languageCodes = [];

			// The list of URLs to language files.
			var languageFiles = [];

			/**
			 * An object that contains references to all plugins used by this
			 * editor instance.
			 * @name CKEDITOR.editor.prototype.plugins
			 * @type Object
			 * @example
			 * alert( editor.plugins.dialog.path );  // E.g. "http://example.com/ckeditor/plugins/dialog/"
			 */
			editor.plugins = plugins;

			// Loop through all plugins, to build the list of language
			// files to get loaded.
			for ( var pluginName in plugins ) {
				var plugin = plugins[ pluginName ],
					pluginLangs = plugin.lang,
					lang = null;

				// If the plugin has "lang".
				if ( pluginLangs ) {
					// Resolve the plugin language. If the current language
					// is not available, get the first one (default one).
					lang = ( CKEDITOR.tools.indexOf( pluginLangs, editor.langCode ) >= 0 ? editor.langCode : pluginLangs[ 0 ] );

					if ( !plugin.langEntries || !plugin.langEntries[ lang ] ) {
						// Put the language file URL into the list of files to
						// get downloaded.
						languageFiles.push( CKEDITOR.getUrl( plugin.path + 'lang/' + lang + '.js' ) );
					} else {
						CKEDITOR.tools.extend( editor.lang, plugin.langEntries[ lang ] );
						lang = null;
					}
				}

				// Save the language code, so we know later which
				// language has been resolved to this plugin.
				languageCodes.push( lang );

				pluginsArray.push( plugin );
			}

			// Load all plugin specific language files in a row.
			CKEDITOR.scriptLoader.load( languageFiles, function() {
				// Initialize all plugins that have the "beforeInit" and "init" methods defined.
				var methods = [ 'beforeInit', 'init', 'afterInit' ];
				for ( var m = 0; m < methods.length; m++ ) {
					for ( var i = 0; i < pluginsArray.length; i++ ) {
						var plugin = pluginsArray[ i ];

						// Uses the first loop to update the language entries also.
						if ( m === 0 && languageCodes[ i ] && plugin.lang && plugin.langEntries )
							CKEDITOR.tools.extend( editor.lang, plugin.langEntries[ languageCodes[ i ] ] );

						// Call the plugin method (beforeInit and init).
						if ( plugin[ methods[ m ] ] )
							plugin[ methods[ m ] ]( editor );
					}
				}

				editor.fireOnce( 'pluginsLoaded' );
				editor.fireOnce( 'loaded' );
				CKEDITOR.fire( 'instanceLoaded', null, editor );
			});
		});
	}

	function initKeystrokeHandler( editor ) {
		/**
		 * Controls keystrokes typing in this editor instance.
		 * @name CKEDITOR.editor.prototype.keystrokeHandler
		 * @type CKEDITOR.keystrokeHandler
		 * @example
		 */
		editor.keystrokeHandler = new CKEDITOR.keystrokeHandler( editor );

		editor.specialKeys = {};

		// Move the relative keystroke settings to the keystrokeHandler object.

		var keystrokesConfig = editor.config.keystrokes,
			blockedConfig = editor.config.blockedKeystrokes;

		var keystrokes = editor.keystrokeHandler.keystrokes,
			blockedKeystrokes = editor.keystrokeHandler.blockedKeystrokes;

		for ( var i = 0; i < keystrokesConfig.length; i++ )
			keystrokes[ keystrokesConfig[ i ][ 0 ] ] = keystrokesConfig[ i ][ 1 ];

		for ( i = 0; i < blockedConfig.length; i++ )
			blockedKeystrokes[ blockedConfig[ i ] ] = 1;
	}

	// Send to data output back to editor's associated element.
	function updateEditorElement() {
		var element = this.element;

		// Some editor creation mode will not have the
		// associated element.
		if ( element ) {
			var data = this.getData();

			if ( this.config.htmlEncodeOutput )
				data = CKEDITOR.tools.htmlEncode( data );

			if ( element.is( 'textarea' ) )
				element.setValue( data );
			else
				element.setHtml( data );
		}
	}

	CKEDITOR.tools.extend( CKEDITOR.editor.prototype,
	/** @lends CKEDITOR.editor.prototype */ {
		/**
		 * Adds a command definition to the editor instance. Commands added with
		 * this function can be executed later with the <code>{@link #execCommand}</code> method.
		 * @param {String} commandName The indentifier name of the command.
		 * @param {CKEDITOR.commandDefinition} commandDefinition The command definition.
		 * @example
		 * editorInstance.addCommand( 'sample',
		 * {
		 *     exec : function( editor )
		 *     {
		 *         alert( 'Executing a command for the editor name "' + editor.name + '"!' );
		 *     }
		 * });
		 */
		addCommand: function( commandName, commandDefinition ) {
			return this.commands[ commandName ] = new CKEDITOR.command( this, commandDefinition );
		},

		/**
		 * Destroys the editor instance, releasing all resources used by it.
		 * If the editor replaced an element, the element will be recovered.
		 * @param {Boolean} [noUpdate] If the instance is replacing a DOM
		 *		element, this parameter indicates whether or not to update the
		 *		element with the instance contents.
		 * @example
		 * alert( CKEDITOR.instances.editor1 );  //  E.g "object"
		 * <strong>CKEDITOR.instances.editor1.destroy()</strong>;
		 * alert( CKEDITOR.instances.editor1 );  // "undefined"
		 */
		destroy: function( noUpdate ) {
			this.fire( 'beforeDestroy' );

			!noUpdate && updateEditorElement.call( this );

			this.editable( null );

			this.fire( 'destroy' );

			// Plug off all listeners to prevent any further events firing.
			this.removeAllListeners();

			CKEDITOR.remove( this );
			CKEDITOR.fire( 'instanceDestroyed', null, this );
		},

		/**
		 * @see {CKEDITOR.dom.elementPath}
		 * @param {CKEDITOR.dom.node} [startNode] From which the path should start, if not specified default to editor selection's
		 * start element yield by {@link CKEDITOR.dom.selection.prototype.getStartElement}.
		 * @return {CKEDITOR.dom.elementPath}
		 */
		elementPath: function( startNode ) {
			startNode = startNode || this.getSelection().getStartElement();
			return new CKEDITOR.dom.elementPath( startNode, this.editable() );
		},

		/**
		 * Shortcut to create a {@link CKEDITOR.dom.range} instance from the editable element.
		 * @see {CKEDITOR.dom.range}
		 * @return {CKEDITOR.dom.range} The dom range created if the editable has presented.
		 */
		createRange: function() {
			var editable = this.editable();
			return editable ? new CKEDITOR.dom.range( editable ) : null;
		},

		/**
		 * Executes a command associated with the editor.
		 * @param {String} commandName The indentifier name of the command.
		 * @param {Object} [data] Data to be passed to the command.
		 * @returns {Boolean} <code>true</code> if the command was executed
		 *		successfully, otherwise <code>false</code>.
		 * @see CKEDITOR.editor.addCommand
		 * @example
		 * editorInstance.execCommand( 'bold' );
		 */
		execCommand: function( commandName, data ) {
			var command = this.getCommand( commandName );

			var eventData = {
				name: commandName,
				commandData: data,
				command: command
			};

			if ( command && command.state != CKEDITOR.TRISTATE_DISABLED ) {
				if ( this.fire( 'beforeCommandExec', eventData ) !== true ) {
					eventData.returnValue = command.exec( eventData.commandData );

					// Fire the 'afterCommandExec' immediately if command is synchronous.
					if ( !command.async && this.fire( 'afterCommandExec', eventData ) !== true )
						return eventData.returnValue;
				}
			}

			// throw 'Unknown command name "' + commandName + '"';
			return false;
		},

		/**
		 * Gets one of the registered commands. Note that after registering a
		 * command definition with <code>{@link #addCommand}</code>, it is
		 * transformed internally into an instance of
		 * <code>{@link CKEDITOR.command}</code>, which will then be returned
		 * by this function.
		 * @param {String} commandName The name of the command to be returned.
		 * This is the same name that is used to register the command with
		 * 		<code>addCommand</code>.
		 * @returns {CKEDITOR.command} The command object identified by the
		 * provided name.
		 */
		getCommand: function( commandName ) {
			return this.commands[ commandName ];
		},

		/**
		 * Gets the editor data. The data will be in raw format. It is the same
		 * data that is posted by the editor.
		 * @type String
		 * @returns (String) The editor data.
		 * @example
		 * if ( CKEDITOR.instances.editor1.<strong>getData()</strong> == '' )
		 *     alert( 'There is no data available' );
		 */
		getData: function( noEvents ) {
			!noEvents && this.fire( 'beforeGetData' );

			var eventData = this._.data;

			if ( typeof eventData != 'string' ) {
				var element = this.element;
				if ( element && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE )
					eventData = element.is( 'textarea' ) ? element.getValue() : element.getHtml();
				else
					eventData = '';
			}

			eventData = { dataValue: eventData };

			// Fire "getData" so data manipulation may happen.
			!noEvents && this.fire( 'getData', eventData );

			return eventData.dataValue;
		},

		/**
		 * Gets the "raw data" currently available in the editor. This is a
		 * fast method which returns the data as is, without processing, so it is
		 * not recommended to use it on resulting pages. Instead it can be used
		 * combined with the <code>{@link #loadSnapshot}</code> method in order
		 * to be able to automatically save the editor data from time to time
		 * while the user is using the editor, to avoid data loss, without risking
		 * performance issues.
		 * @see CKEDITOR.editor.getData
		 * @example
		 * alert( editor.getSnapshot() );
		 */
		getSnapshot: function() {
			var data = this.fire( 'getSnapshot' );

			if ( typeof data != 'string' ) {
				var element = this.element;
				if ( element && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE )
					data = element.is( 'textarea' ) ? element.getValue() : element.getHtml();
			}

			return data;
		},

		/**
		 * Loads "raw data" into the editor. The data is loaded with processing
		 * straight to the editing area. It should not be used as a way to load
		 * any kind of data, but instead in combination with
		 * <code>{@link #getSnapshot}</code> produced data.
		 * @see CKEDITOR.editor.setData
		 * @example
		 * var data = editor.getSnapshot();
		 * editor.<strong>loadSnapshot( data )</strong>;
		 */
		loadSnapshot: function( snapshot ) {
			this.fire( 'loadSnapshot', snapshot );
		},

		/**
		 * Sets the editor data. The data must be provided in the raw format (HTML).<br />
		 * <br />
		 * Note that this method is asynchronous. The <code>callback</code> parameter must
		 * be used if interaction with the editor is needed after setting the data.
		 * @param {String} data HTML code to replace the curent content in the
		 *		editor.
		 * @param {Function} callback Function to be called after the <code>setData</code>
		 *		is completed.
		 *@param {Boolean} internal Whether to suppress any event firing when copying data
		 *		internally inside the editor.
		 * @example
		 * CKEDITOR.instances.editor1.<strong>setData</strong>( '&lt;p&gt;This is the editor data.&lt;/p&gt;' );
		 * @example
		 * CKEDITOR.instances.editor1.<strong>setData</strong>( '&lt;p&gt;Some other editor data.&lt;/p&gt;', function()
		 *     {
		 *         this.checkDirty();  // true
		 *     });
		 */
		setData: function( data, callback, internal ) {
			if ( callback ) {
				this.on( 'dataReady', function( evt ) {
					evt.removeListener();
					callback.call( evt.editor );
				});
			}

			// Fire "setData" so data manipulation may happen.
			var eventData = { dataValue: data };
			!internal && this.fire( 'setData', eventData );

			this._.data = eventData.dataValue;

			!internal && this.fire( 'afterSetData', eventData );
		},

		/**
		 * Puts or restores the editor into read-only state. When in read-only,
		 * the user is not able to change the editor contents, but can still use
		 * some editor features. This function sets the <code>{@link CKEDITOR.config.readOnly}</code>
		 * property of the editor, firing the <code>{@link CKEDITOR.editor#readOnly}</code> event.<br><br>
		 * <strong>Note:</strong> the current editing area will be reloaded.
		 * @param {Boolean} [isReadOnly] Indicates that the editor must go
		 *		read-only (<code>true</code>, default) or be restored and made editable
		 * 		(<code>false</code>).
		 * @since 3.6
		 */
		setReadOnly: function( isReadOnly ) {
			isReadOnly = ( isReadOnly == undefined ) || isReadOnly;

			if ( this.readOnly != isReadOnly ) {
				this.readOnly = isReadOnly;

				// Fire the readOnly event so the editor features can update
				// their state accordingly.
				this.fire( 'readOnly' );
			}
		},

		/**
		 * Inserts HTML code into the currently selected position in the editor in WYSIWYG mode.
		 * @param {String} data HTML code to be inserted into the editor.
		 * @example
		 * CKEDITOR.instances.editor1.<strong>insertHtml( '&lt;p&gt;This is a new paragraph.&lt;/p&gt;' )</strong>;
		 */
		insertHtml: function( data ) {
			this.fire( 'insertHtml', data );
		},

		/**
		 * Insert text content into the currently selected position in the
		 * editor in WYSIWYG mode. The styles of the selected element will be applied to the inserted text.
		 * Spaces around the text will be leaving untouched.
		 * <strong>Note:</strong> two subsequent line-breaks will introduce one paragraph. This depends on <code>{@link CKEDITOR.config.enterMode}</code>;
		 * A single line-break will be instead translated into one &lt;br /&gt;.
		 * @since 3.5
		 * @param {String} text Text to be inserted into the editor.
		 * @example
		 * CKEDITOR.instances.editor1.<strong>insertText( ' line1 \n\n line2' )</strong>;
		 */
		insertText: function( text ) {
			this.fire( 'insertText', text );
		},

		/**
		 * Inserts an element into the currently selected position in the
		 * editor in WYSIWYG mode.
		 * @param {CKEDITOR.dom.element} element The element to be inserted
		 *		into the editor.
		 * @example
		 * var element = CKEDITOR.dom.element.createFromHtml( '&lt;img src="hello.png" border="0" title="Hello" /&gt;' );
		 * CKEDITOR.instances.editor1.<strong>insertElement( element )</strong>;
		 */
		insertElement: function( element ) {
			this.fire( 'insertElement', element );
		},

		/**
		 * Moves the selection focus to the editing area space in the editor.
		 */
		focus: function() {
			this.fire( 'beforeFocus' );
		},

		/**
		 * Checks whether the current editor contents present changes when
		 * compared to the contents loaded into the editor at startup, or to
		 * the contents available in the editor when <code>{@link #resetDirty}</code>
		 * was called.
		 * @returns {Boolean} "true" is the contents contain changes.
		 * @example
		 * function beforeUnload( e )
		 * {
		 *     if ( CKEDITOR.instances.editor1.<strong>checkDirty()</strong> )
		 * 	        return e.returnValue = "You will lose the changes made in the editor.";
		 * }
		 *
		 * if ( window.addEventListener )
		 *     window.addEventListener( 'beforeunload', beforeUnload, false );
		 * else
		 *     window.attachEvent( 'onbeforeunload', beforeUnload );
		 */
		checkDirty: function() {
			return ( this.mayBeDirty && this._.previousValue !== this.getSnapshot() );
		},

		/**
		 * Resets the "dirty state" of the editor so subsequent calls to
		 * <code>{@link #checkDirty}</code> will return <code>false</code> if the user will not
		 * have made further changes to the contents.
		 * @example
		 * alert( editor.checkDirty() );  // E.g. "true"
		 * editor.<strong>resetDirty()</strong>;
		 * alert( editor.checkDirty() );  // "false"
		 */
		resetDirty: function() {
			if ( this.mayBeDirty )
				this._.previousValue = this.getSnapshot();
		},

		/**
		 * Updates the <code>&lt;textarea&gt;</code> element that was replaced by the editor with
		 * the current data available in the editor.
		 * <strong>Note:</strong> This method will only affect those editor instances created
		 * with {@link CKEDITOR.ELEMENT_MODE_REPLACE} element mode.
		 * @see CKEDITOR.editor.element
		 * @example
		 * CKEDITOR.instances.editor1.updateElement();
		 * alert( document.getElementById( 'editor1' ).value );  // The current editor data.
		 */
		updateElement: function() {
			if ( this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ) {
				updateEditorElement.call( this );
				return true;
			}

			return false;
		}
	});
})();

/**
 * Whether to escape HTML when the editor updates the original input element.
 * @name CKEDITOR.config.htmlEncodeOutput
 * @since 3.1
 * @type Boolean
 * @default false
 * @example
 * config.htmlEncodeOutput = true;
 */

/**
 * If <code>true</code>, makes the editor start in read-only state. Otherwise, it will check
 * if the linked <code>&lt;textarea&gt;</code> element has the <code>disabled</code> attribute.
 * @name CKEDITOR.config.readOnly
 * @see CKEDITOR.editor#setReadOnly
 * @type Boolean
 * @default false
 * @since 3.6
 * @example
 * config.readOnly = true;
 */

/**
 * Fired when a CKEDITOR instance is created, but still before initializing it.
 * To interact with a fully initialized instance, use the
 * <code>{@link CKEDITOR#instanceReady}</code> event instead.
 * @name CKEDITOR#instanceCreated
 * @event
 * @param {CKEDITOR.editor} editor The editor instance that has been created.
 */

/**
 * Fired when a CKEDITOR instance is destroyed.
 * @name CKEDITOR#instanceDestroyed
 * @event
 * @param {CKEDITOR.editor} editor The editor instance that has been destroyed.
 */

/**
 * Fired when the language is loaded into the editor instance.
 * @name CKEDITOR.editor#langLoaded
 * @event
 * @since 3.6.1
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired when all plugins are loaded and initialized into the editor instance.
 * @name CKEDITOR.editor#pluginsLoaded
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired before the command execution when <code>{@link #execCommand}</code> is called.
 * @name CKEDITOR.editor#beforeCommandExec
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data.name The command name.
 * @param {Object} data.commandData The data to be sent to the command. This
 *		can be manipulated by the event listener.
 * @param {CKEDITOR.command} data.command The command itself.
 */

/**
 * Fired after the command execution when <code>{@link #execCommand}</code> is called.
 * @name CKEDITOR.editor#afterCommandExec
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data.name The command name.
 * @param {Object} data.commandData The data sent to the command.
 * @param {CKEDITOR.command} data.command The command itself.
 * @param {Object} data.returnValue The value returned by the command execution.
 */

/**
 * Fired when the custom configuration file is loaded, before the final
 * configurations initialization.<br />
 * <br />
 * Custom configuration files can be loaded thorugh the
 * <code>{@link CKEDITOR.config.customConfig}</code> setting. Several files can be loaded
 * by changing this setting.
 * @name CKEDITOR.editor#customConfigLoaded
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired once the editor configuration is ready (loaded and processed).
 * @name CKEDITOR.editor#configLoaded
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired when this editor instance is destroyed. The editor at this
 * point is not usable and this event should be used to perform the clean-up
 * in any plugin.
 * @name CKEDITOR.editor#destroy
 * @event
 */

/**
 * Internal event to get the current data.
 * @name CKEDITOR.editor#beforeGetData
 * @event
 */

/**
 * Internal event to perform the <code>#getSnapshot</code> call.
 * @name CKEDITOR.editor#getSnapshot
 * @event
 */

/**
 * Internal event to perform the <code>#loadSnapshot</code> call.
 * @name CKEDITOR.editor#loadSnapshot
 * @event
 */

/**
 * Event fired before the <code>#getData</code> call returns allowing additional manipulation.
 * @name CKEDITOR.editor#getData
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data.dataValue The data that will be returned.
 */

/**
 * Event fired before the <code>#setData</code> call is executed allowing additional manipulation.
 * @name CKEDITOR.editor#setData
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data.dataValue The data that will be used.
 */

/**
 * Event fired at the end of the <code>#setData</code> call execution. Usually it is better to use the
 * <code>{@link CKEDITOR.editor#dataReady}</code> event.
 * @name CKEDITOR.editor#afterSetData
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data.dataValue The data that has been set.
 */

/**
 * Fired as an indicator of the editor data loading. It may be the result of
 * calling {@link CKEDITOR.editor.prototype.setData} explicitly or an internal
 * editor function, like the editor editing mode switching (move to Source and back).
 * @name CKEDITOR.editor#dataReady
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired when a CKEDITOR instance is created, fully initialized and ready for interaction.
 * @name CKEDITOR#instanceReady
 * @event
 * @param {CKEDITOR.editor} editor The editor instance that has been created.
 */

/**
 * Fired when the CKEDITOR instance is completely created, fully initialized
 * and ready for interaction.
 * @name CKEDITOR.editor#instanceReady
 * @event
 */

/**
 * Internal event to perform the <code>#insertHtml</code> call
 * @name CKEDITOR.editor#insertHtml
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data The HTML to insert.
 */

/**
 * Internal event to perform the <code>#insertText</code> call
 * @name CKEDITOR.editor#insertText
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} text The text to insert.
 */

/**
 * Internal event to perform the <code>#insertElement</code> call
 * @name CKEDITOR.editor#insertElement
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {Object} element The element to insert.
 */

/**
 * Event fired after the <code>{@link CKEDITOR.editor#readOnly}</code> property changes.
 * @name CKEDITOR.editor#readOnly
 * @event
 * @since 3.6
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when an UI template is added to the editor instance. It makes
 * it possible to bring customizations to the template source.
 * @name CKEDITOR.editor#template
 * @event
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} name The template name.
 * @param {String} source The source data for this template.
 */

/**
 * Sets whether the editable should have the focus when editor is loading for the first time.
 * @name CKEDITOR.config.startupFocus
 * @type Boolean
 * @default false
 * @example
 * config.startupFocus = true;
 */
