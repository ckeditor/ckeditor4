/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.editor} class that represents an
 *		editor instance.
 */

( function() {
	// Override the basic constructor defined at editor_basic.js.
	Editor.prototype = CKEDITOR.editor.prototype;
	CKEDITOR.editor = Editor;

	/**
	 * Represents an editor instance. This constructor should be rarely
	 * used in favor of the {@link CKEDITOR} editor creation functions.
	 *
	 * @class CKEDITOR.editor
	 * @mixins CKEDITOR.event
	 * @constructor Creates an editor class instance.
	 * @param {Object} [instanceConfig] Configuration values for this specific instance.
	 * @param {CKEDITOR.dom.element} [element] The DOM element upon which this editor
	 * will be created.
	 * @param {Number} [mode] The element creation mode to be used by this editor.
	 */
	function Editor( instanceConfig, element, mode ) {
		// Call the CKEDITOR.event constructor to initialize this instance.
		CKEDITOR.event.call( this );

		// Make a clone of the config object, to avoid having it touched by our code. (https://dev.ckeditor.com/ticket/9636)
		instanceConfig = instanceConfig && CKEDITOR.tools.clone( instanceConfig );

		// if editor is created off one page element.
		if ( element !== undefined ) {
			// Asserting element and mode not null.
			if ( !( element instanceof CKEDITOR.dom.element ) )
				throw new Error( 'Expect element of type CKEDITOR.dom.element.' );
			else if ( !mode )
				throw new Error( 'One of the element modes must be specified.' );

			if ( CKEDITOR.env.ie && CKEDITOR.env.quirks && mode == CKEDITOR.ELEMENT_MODE_INLINE )
				throw new Error( 'Inline element mode is not supported on IE quirks.' );

			if ( !isSupportedElement( element, mode ) )
				throw new Error( 'The specified element mode is not supported on element: "' + element.getName() + '".' );

			/**
			 * The original host page element upon which the editor is created. It is only
			 * supposed to be provided by the particular editor creator and is not subject to
			 * be modified.
			 *
			 * @readonly
			 * @property {CKEDITOR.dom.element}
			 */
			this.element = element;

			/**
			 * This property indicates the way this instance is associated with the {@link #element}.
			 * See also {@link CKEDITOR#ELEMENT_MODE_INLINE} and {@link CKEDITOR#ELEMENT_MODE_REPLACE}.
			 *
			 * @readonly
			 * @property {Number}
			 */
			this.elementMode = mode;

			this.name = ( this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO ) && ( element.getId() || element.getNameAtt() );
		} else {
			this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
		}

		// Declare the private namespace.
		this._ = {};

		this.commands = {};

		/**
		 * Contains all UI templates created for this editor instance.
		 *
		 * @readonly
		 * @property {Object}
		 */
		this.templates = {};

		/**
		 * A unique identifier of this editor instance.
		 *
		 * **Note:** It will be originated from the `id` or `name`
		 * attribute of the {@link #element}, otherwise a name pattern of
		 * `'editor{n}'` will be used.
		 *
		 * @readonly
		 * @property {String}
		 */
		this.name = this.name || genEditorName();

		/**
		 * A unique random string assigned to each editor instance on the page.
		 *
		 * @readonly
		 * @property {String}
		 */
		this.id = CKEDITOR.tools.getNextId();

		/**
		 * Indicates editor initialization status. The following statuses are available:
		 *
		 *	* **unloaded**: The initial state &mdash; the editor instance was initialized,
		 *	but its components (configuration, plugins, language files) are not loaded yet.
		 *	* **loaded**: The editor components were loaded &mdash; see the {@link CKEDITOR.editor#loaded} event.
		 *	* **recreating**: The editor editable area is recreating due to iframe reloading &mdash; see the {@link CKEDITOR.config#observableParent} configuration option.
		 *	* **ready**: The editor is fully initialized and ready &mdash; see the {@link CKEDITOR.editor#instanceReady} event.
		 *	* **destroyed**: The editor was destroyed &mdash; see the {@link CKEDITOR.editor#method-destroy} method.
		 *
		 * @since 4.1.0
		 * @readonly
		 * @property {String}
		 */
		this.status = 'unloaded';

		/**
		 * The configuration for this editor instance. It inherits all
		 * settings defined in {@link CKEDITOR.config}, combined with settings
		 * loaded from custom configuration files and those defined inline in
		 * the page when creating the editor.
		 *
		 *		var editor = CKEDITOR.instances.editor1;
		 *		alert( editor.config.skin ); // e.g. 'moono'
		 *
		 * @readonly
		 * @property {CKEDITOR.config}
		 */
		this.config = CKEDITOR.tools.prototypedCopy( CKEDITOR.config );

		/**
		 * The namespace containing UI features related to this editor instance.
		 *
		 * @readonly
		 * @property {CKEDITOR.ui}
		 */
		this.ui = new CKEDITOR.ui( this );

		/**
		 * Controls the focus state of this editor instance. This property
		 * is rarely used for normal API operations. It is mainly
		 * targeted at developers adding UI elements to the editor interface.
		 *
		 * @readonly
		 * @property {CKEDITOR.focusManager}
		 */
		this.focusManager = new CKEDITOR.focusManager( this );

		/**
		 * Controls keystroke typing in this editor instance.
		 *
		 * @readonly
		 * @property {CKEDITOR.keystrokeHandler}
		 */
		this.keystrokeHandler = new CKEDITOR.keystrokeHandler( this );

		// Make the editor update its command states on mode change.
		this.on( 'readOnly', updateCommands );
		this.on( 'selectionChange', function( evt ) {
			updateCommandsContext( this, evt.data.path );
		} );
		this.on( 'activeFilterChange', function() {
			updateCommandsContext( this, this.elementPath(), true );
		} );
		this.on( 'mode', updateCommands );

		// Optimize selection starting/ending on element boundaries (#3175).
		CKEDITOR.dom.selection.setupEditorOptimization( this );

		// Handle startup focus.
		this.on( 'instanceReady', function() {
			if ( this.config.startupFocus ) {
				if ( this.config.startupFocus === 'end' ) {
					var range = this.createRange();
					range.selectNodeContents( this.editable() );
					range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
					range.collapse();
					this.getSelection().selectRanges( [ range ] );
				}
				this.focus();
			}
		} );

		CKEDITOR.fire( 'instanceCreated', null, this );

		// Add this new editor to the CKEDITOR.instances collections.
		CKEDITOR.add( this );

		// Return the editor instance immediately to enable early stage event registrations.
		CKEDITOR.tools.setTimeout( function() {
			if ( !this.isDestroyed() && !this.isDetached() ) {
				initConfig( this, instanceConfig );
			}
		}, 0, this );
	}

	var nameCounter = 0;

	function genEditorName() {
		do {
			var name = 'editor' + ( ++nameCounter );
		}
		while ( CKEDITOR.instances[ name ] );

		return name;
	}

	// Asserting element DTD depending on mode.
	function isSupportedElement( element, mode ) {
		if ( mode == CKEDITOR.ELEMENT_MODE_INLINE )
			return element.is( CKEDITOR.dtd.$editable ) || element.is( 'textarea' );
		else if ( mode == CKEDITOR.ELEMENT_MODE_REPLACE )
			return !element.is( CKEDITOR.dtd.$nonBodyContent );
		return 1;
	}

	function updateCommands() {
		var commands = this.commands,
			name;

		for ( name in commands )
			updateCommand( this, commands[ name ] );
	}

	function updateCommand( editor, cmd ) {
		cmd[ cmd.startDisabled ? 'disable' : editor.readOnly && !cmd.readOnly ? 'disable' : cmd.modes[ editor.mode ] ? 'enable' : 'disable' ]();
	}

	function updateCommandsContext( editor, path, forceRefresh ) {
		// Commands cannot be refreshed without a path. In edge cases
		// it may happen that there's no selection when this function is executed.
		// For example when active filter is changed in https://dev.ckeditor.com/ticket/10877.
		if ( !path )
			return;

		var command,
			name,
			commands = editor.commands;

		for ( name in commands ) {
			command = commands[ name ];

			if ( forceRefresh || command.contextSensitive )
				command.refresh( editor, path );
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
		if ( !customConfig ) {
			return false;
		}

		customConfig = CKEDITOR.getUrl( customConfig );

		var loadedConfig = loadConfigLoaded[ customConfig ] || ( loadConfigLoaded[ customConfig ] = {} );

		// If the custom config has already been downloaded, reuse it.
		if ( loadedConfig.fn ) {
			// Call the cached CKEDITOR.editorConfig defined in the custom
			// config file for the editor instance depending on it.
			loadedConfig.fn.call( editor, editor.config );

			// If there is no other customConfig in the chain, fire the
			// "configLoaded" event.
			if ( CKEDITOR.getUrl( editor.config.customConfig ) == customConfig || !loadConfig( editor ) ) {
				editor.fireOnce( 'customConfigLoaded' );
			}

		} else {
			// Load the custom configuration file.
			// To resolve customConfig race conflicts, use scriptLoader#queue
			// instead of scriptLoader#load (https://dev.ckeditor.com/ticket/6504).
			CKEDITOR.scriptLoader.queue( customConfig, function() {
				// Cache config if it has been properly set using `editorConfig`,
				// but make sure to not overwrite existing cache if the same config has
				// been loaded multiple times by different editors (#3361).
				loadedConfig.fn = loadedConfig.fn || CKEDITOR.editorConfig || function() {};

				// Call the load config again. This time the custom
				// config is already cached and so it will get loaded.
				loadConfig( editor );
			} );
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
		} );

		// The instance config may override the customConfig setting to avoid
		// loading the default ~/config.js file.
		if ( instanceConfig && instanceConfig.customConfig != null )
			editor.config.customConfig = instanceConfig.customConfig;

		// Load configs from the custom configuration files.
		if ( !loadConfig( editor ) )
			editor.fireOnce( 'customConfigLoaded' );
	}

	// ##### END: Config Privates

	// Set config related properties.
	function onConfigLoaded( editor ) {
		var config = editor.config;

		/**
		 * Indicates the read-only state of this editor. This is a read-only property.
		 * See also {@link CKEDITOR.editor#setReadOnly}.
		 *
		 * @since 3.6.0
		 * @readonly
		 * @property {Boolean}
		 */
		editor.readOnly = isEditorReadOnly();

		function isEditorReadOnly() {
			if ( config.readOnly ) {
				return true;
			}

			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ) {
				if ( editor.element.is( 'textarea' ) ) {
					return editor.element.hasAttribute( 'disabled' ) || editor.element.hasAttribute( 'readonly' );
				} else {
					return editor.element.isReadOnly();
				}
			} else if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ) {
				return editor.element.hasAttribute( 'disabled' ) || editor.element.hasAttribute( 'readonly' );
			}

			return false;
		}

		/**
		 * Indicates that the editor is running in an environment where
		 * no block elements are accepted inside the content.
		 *
		 * This can be for example inline editor based on an `<h1>` element.
		 *
		 * @readonly
		 * @property {Boolean}
		 */
		editor.blockless = editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ?
			!( editor.element.is( 'textarea' ) || CKEDITOR.dtd[ editor.element.getName() ].p ) :
			false;

		/**
		 * The [tabbing navigation](http://en.wikipedia.org/wiki/Tabbing_navigation) order determined for this editor instance.
		 * This can be set by the <code>{@link CKEDITOR.config#tabIndex}</code>
		 * setting or taken from the `tabindex` attribute of the
		 * {@link #element} associated with the editor.
		 *
		 *		alert( editor.tabIndex ); // e.g. 0
		 *
		 * @readonly
		 * @property {Number} [=0]
		 */
		editor.tabIndex = config.tabIndex || editor.element && editor.element.getAttribute( 'tabindex' ) || 0;

		editor.activeEnterMode = editor.enterMode = validateEnterMode( editor, config.enterMode );
		editor.activeShiftEnterMode = editor.shiftEnterMode = validateEnterMode( editor, config.shiftEnterMode );

		// Set CKEDITOR.skinName. Note that it is not possible to have
		// different skins on the same page, so the last one to set it "wins".
		if ( config.skin )
			CKEDITOR.skinName = config.skin;

		// Fire the "configLoaded" event.
		editor.fireOnce( 'configLoaded' );

		initComponents( editor );
	}

	// Various other core components that read editor configuration.
	function initComponents( editor ) {
		// Documented in dataprocessor.js.
		editor.dataProcessor = new CKEDITOR.htmlDataProcessor( editor );

		// Set activeFilter directly to avoid firing event.
		editor.filter = editor.activeFilter = new CKEDITOR.filter( editor );

		loadSkin( editor );
	}

	function loadSkin( editor ) {
		CKEDITOR.skin.loadPart( 'editor', function() {
			loadLang( editor );
		} );
	}

	function loadLang( editor ) {
		CKEDITOR.lang.load( editor.config.language, editor.config.defaultLanguage, function( languageCode, lang ) {
			var configTitle = editor.config.title,
				configApplicationTitle = editor.config.applicationTitle;

			/**
			 * The code for the language resources that have been loaded
			 * for the user interface elements of this editor instance.
			 *
			 *		alert( editor.langCode ); // e.g. 'en'
			 *
			 * @readonly
			 * @property {String}
			 */
			editor.langCode = languageCode;

			/**
			 * An object that contains all language strings used by the editor interface.
			 *
			 *		alert( editor.lang.basicstyles.bold ); // e.g. 'Negrito' (if the language is set to Portuguese)
			 *
			 * @readonly
			 * @property {Object} lang
			 */
			// As we'll be adding plugin specific entries that could come
			// from different language code files, we need a copy of lang,
			// not a direct reference to it.
			editor.lang = CKEDITOR.tools.prototypedCopy( lang );

			/**
			 * Indicates the human-readable title of this editor. Although this is a read-only property,
			 * it can be initialized with {@link CKEDITOR.config#title}.
			 *
			 * **Note:** Please do not confuse this property with {@link CKEDITOR.editor#name editor.name}
			 * which identifies the instance in the {@link CKEDITOR#instances} literal.
			 *
			 * @since 4.2.0
			 * @readonly
			 * @property {String/Boolean}
			 */
			editor.title = typeof configTitle == 'string' || configTitle === false ? configTitle : [ editor.lang.editor, editor.name ].join( ', ' );

			/**
			 * Indicates the human-readable title of this editor's application (the website's region
			 * that contains the editor and its whole UI). Although this is a read-only property,
			 * it can be initialized with {@link CKEDITOR.config#applicationTitle}.
			 *
			 * **Note:** Please do not confuse this property with {@link CKEDITOR.editor#name editor.name}
			 * which identifies the literal instance in the {@link CKEDITOR#instances}.
			 *
			 * @since 4.19.0
			 * @readonly
			 * @property {String/Boolean}
			 */
			editor.applicationTitle = typeof configApplicationTitle == 'string' || configApplicationTitle === false ?
				configApplicationTitle : [ editor.lang.application, editor.name ].join( ', ' );

			if ( !editor.config.contentsLangDirection ) {
				// Fallback to either the editable element direction or editor UI direction depending on creators.
				editor.config.contentsLangDirection = editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? editor.element.getDirection( 1 ) : editor.lang.dir;
			}

			editor.fire( 'langLoaded' );

			preloadStylesSet( editor );
		} );
	}

	// Preloads styles set file (config.stylesSet).
	// If stylesSet was defined directly (by an array)
	// this function will call loadPlugins fully synchronously.
	// If stylesSet is a string (path) loadPlugins will
	// be called asynchronously.
	// In both cases - styles will be preload before plugins initialization.
	function preloadStylesSet( editor ) {
		editor.getStylesSet( function( styles ) {
			// Wait for editor#loaded, so plugins could add their listeners.
			// But listen with high priority to fire editor#stylesSet before editor#uiReady and editor#setData.
			editor.once( 'loaded', function() {
				// Note: we can't use fireOnce because this event may canceled and fired again.
				editor.fire( 'stylesSet', { styles: styles } );
			}, null, null, 1 );

			loadPlugins( editor );
		} );
	}

	function loadPlugins( editor ) {
		var config = editor.config,
			plugins = parsePluginsOption( config.plugins ),
			extraPlugins = parsePluginsOption( config.extraPlugins ),
			removePlugins = parsePluginsOption( config.removePlugins );

		if ( extraPlugins ) {
			// Remove them first to avoid duplications.
			var extraRegex = new RegExp( '(?:^|,)(?:' + extraPlugins.replace( /,/g, '|' ) + ')(?=,|$)', 'g' );
			plugins = plugins.replace( extraRegex, '' );

			plugins += ',' + extraPlugins;
		}

		if ( removePlugins ) {
			var removeRegex = new RegExp( '(?:^|,)(?:' + removePlugins.replace( /,/g, '|' ) + ')(?=,|$)', 'g' );
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

			editor.plugins = CKEDITOR.tools.extend( {}, editor.plugins, plugins );

			// Loop through all plugins, to build the list of language
			// files to get loaded.
			//
			// Check also whether any of loaded plugins doesn't require plugins
			// defined in config.removePlugins. Throw non-blocking error if this happens.
			for ( var pluginName in plugins ) {
				var plugin = plugins[ pluginName ],
					pluginLangs = plugin.lang,
					lang = null,
					requires = plugin.requires,
					match, name;

				// Transform it into a string, if it's not one.
				if ( CKEDITOR.tools.isArray( requires ) )
					requires = requires.join( ',' );

				if ( requires && ( match = requires.match( removeRegex ) ) ) {
					while ( ( name = match.pop() ) ) {
						CKEDITOR.error( 'editor-plugin-required', { plugin: name.replace( ',', '' ), requiredBy: pluginName } );
					}
				}

				// If the plugin has "lang".
				if ( pluginLangs && !editor.lang[ pluginName ] ) {
					// Trasnform the plugin langs into an array, if it's not one.
					if ( pluginLangs.split )
						pluginLangs = pluginLangs.split( ',' );

					// Resolve the plugin language. If the current language
					// is not available, get English or the first one.
					if ( CKEDITOR.tools.indexOf( pluginLangs, editor.langCode ) >= 0 )
						lang = editor.langCode;
					else {
						// The language code may have the locale information (zh-cn).
						// Fall back to locale-less in that case (zh).
						var langPart = editor.langCode.replace( /-.*/, '' );
						if ( langPart != editor.langCode && CKEDITOR.tools.indexOf( pluginLangs, langPart ) >= 0 )
							lang = langPart;
						// Try the only "generic" option we have: English.
						else if ( CKEDITOR.tools.indexOf( pluginLangs, 'en' ) >= 0 )
							lang = 'en';
						else
							lang = pluginLangs[ 0 ];
					}

					if ( !plugin.langEntries || !plugin.langEntries[ lang ] ) {
						// Put the language file URL into the list of files to
						// get downloaded.
						languageFiles.push( CKEDITOR.getUrl( plugin.path + 'lang/' + lang + '.js' ) );
					} else {
						editor.lang[ pluginName ] = plugin.langEntries[ lang ];
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
				if ( editor.isDestroyed() || editor.isDetached() ) {
					return;
				}

				// Initialize all plugins that have the "beforeInit" and "init" methods defined.
				var methods = [ 'beforeInit', 'init', 'afterInit' ];
				for ( var m = 0; m < methods.length; m++ ) {
					for ( var i = 0; i < pluginsArray.length; i++ ) {
						var plugin = pluginsArray[ i ];

						// Uses the first loop to update the language entries also.
						if ( m === 0 && languageCodes[ i ] && plugin.lang && plugin.langEntries )
							editor.lang[ plugin.name ] = plugin.langEntries[ languageCodes[ i ] ];

						// Call the plugin method (beforeInit and init).
						if ( plugin[ methods[ m ] ] ) {
							plugin[ methods[ m ] ]( editor );
						}
					}
				}

				editor.fireOnce( 'pluginsLoaded' );

				// Setup the configured keystrokes.
				config.keystrokes && editor.setKeystroke( editor.config.keystrokes );

				// Setup the configured blocked keystrokes.
				for ( i = 0; i < editor.config.blockedKeystrokes.length; i++ )
					editor.keystrokeHandler.blockedKeystrokes[ editor.config.blockedKeystrokes[ i ] ] = 1;

				editor.status = 'loaded';
				editor.fireOnce( 'loaded' );
				CKEDITOR.fire( 'instanceLoaded', null, editor );
			} );
		} );

		// Parse *plugins option into a string (#1802).
		function parsePluginsOption( option ) {
			if ( !option ) {
				return '';
			}

			if ( CKEDITOR.tools.isArray( option ) ) {
				option = option.join( ',' );
			}

			// We have to remove whitespaces (#1712).
			return option.replace( /\s/g, '' );
		}
	}

	// Send to data output back to editor's associated element.
	function updateEditorElement() {
		var element = this.element;

		// Some editor creation mode will not have the
		// associated element.
		if ( element && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO ) {
			var data = this.getData();

			if ( this.config.htmlEncodeOutput )
				data = CKEDITOR.tools.htmlEncode( data );

			if ( element.is( 'textarea' ) )
				element.setValue( data );
			else
				element.setHtml( data );

			return true;
		}
		return false;
	}

	// Always returns ENTER_BR in case of blockless editor.
	function validateEnterMode( editor, enterMode ) {
		return editor.blockless ? CKEDITOR.ENTER_BR : enterMode;
	}

	// Create DocumentFragment from specified ranges. For now it handles only tables
	// and returns DocumentFragment from the 1. range for other cases. (https://dev.ckeditor.com/ticket/13884)
	function createDocumentFragmentFromRanges( ranges, editable ) {
		var docFragment = new CKEDITOR.dom.documentFragment(),
			tableClone,
			currentRow,
			currentRowClone;

		// We must handle two cases here:
		// 1. <tr>[<td>Cell</td>]</tr> (IE9+, Edge, Chrome, Firefox)
		// 2. <td>[Cell]</td> (IE8-, Safari)
		function isSelectedCell( range ) {
			var start = range.startContainer,
				end = range.endContainer,
				startIsTr = start.is && start.is( 'tr' ),
				startIsTd = start.is && start.is( 'td' ),
				startIsTdWithEqualChildCount = startIsTd && start.equals( end ) && range.endOffset === start.getChildCount(),
				// (#4952)
				startIsTdAndIncludeOnlyImage = startIsTd && start.getChildCount() === 1 && start.getChildren().getItem( 0 ).getName() === 'img';

			if ( startIsTr || ( startIsTdWithEqualChildCount && !startIsTdAndIncludeOnlyImage ) ) {
				return true;
			}

			return false;
		}

		function cloneCell( range ) {
			var start = range.startContainer;

			if ( start.is( 'tr' ) ) {
				return range.cloneContents();
			}

			return start.clone( true );
		}

		for ( var i = 0; i < ranges.length; i++ ) {
			var range = ranges[ i ],
				container = range.startContainer.getAscendant( 'tr', true );

			if ( isSelectedCell( range ) ) {
				if ( !tableClone ) {
					tableClone = container.getAscendant( 'table' ).clone();
					tableClone.append( container.getAscendant( { thead: 1, tbody: 1, tfoot: 1 } ).clone() );
					docFragment.append( tableClone );
					tableClone = tableClone.findOne( 'thead, tbody, tfoot' );
				}

				if ( !( currentRow && currentRow.equals( container ) ) ) {
					currentRow = container;
					currentRowClone = container.clone();
					tableClone.append( currentRowClone );
				}

				currentRowClone.append( cloneCell( range ) );
			} else {
				// If there was something else copied with table,
				// append it to DocumentFragment.
				docFragment.append( range.cloneContents() );
			}
		}

		if ( !tableClone ) {
			return editable.getHtmlFromRange( ranges[ 0 ] );
		}

		return docFragment;
	}

	CKEDITOR.tools.extend( CKEDITOR.editor.prototype, {
		/**
		 * An object that contains references to all plugins used by this
		 * editor instance.
		 *
		 *		alert( editor.plugins.dialog.path ); // e.g. 'http://example.com/ckeditor/plugins/dialog/'
		 *
		 *		// Check if a plugin is available.
		 *		if ( editor.plugins.image ) {
		 *			...
		 *		}
		 *
		 * @readonly
		 * @property {CKEDITOR.editor.plugins}
		 */
		plugins: {
			/**
			 * Checks the plugin for conflicts with other plugins.
			 *
			 * If a conflict occurs, this function will send a {@link CKEDITOR#warn console warning}
			 * with the `editor-plugin-conflict` error code. The order of the `conflicted` names is respected
			 * where the first conflicted plugin has the highest priority and will be used in a warning
			 * message.
			 *
			 * ```js
			 * editor.plugins.detectConflict( 'image', [ 'image2', 'easyimage' ] );
			 * ```
			 *
			 * @member CKEDITOR.editor.plugins
			 * @since 4.10.1
			 * @param {String} plugin Current plugin name.
			 * @param {String[]} conflicted Names of plugins that conflict with the current plugin.
			 * @return {Boolean} Returns `true` if there is a conflict. Returns `false` otherwise.
			 */
			detectConflict: function( plugin, conflicted ) {
				for ( var i = 0; i < conflicted.length; i++ ) {
					var pluginName = conflicted[ i ];

					if ( this[ pluginName ] ) {
						CKEDITOR.warn( 'editor-plugin-conflict', {
							plugin: plugin,
							replacedWith: pluginName
						} );

						return true;
					}
				}

				return false;
			}
		},
		/**
		 * Adds a command definition to the editor instance. Commands added with
		 * this function can be executed later with the {@link #execCommand} method.
		 *
		 * 		editorInstance.addCommand( 'sample', {
		 * 			exec: function( editor ) {
		 * 				alert( 'Executing a command for the editor name "' + editor.name + '"!' );
		 * 			}
		 * 		} );
		 *
		 * Since 4.10.0 this method also accepts a {@link CKEDITOR.command} instance as a parameter.
		 *
		 * @param {String} commandName The indentifier name of the command.
		 * @param {CKEDITOR.commandDefinition/CKEDITOR.command} commandDefinition The command definition or a `CKEDITOR.command` instance.
		 */
		addCommand: function( commandName, commandDefinition ) {
			commandDefinition.name = commandName.toLowerCase();
			var cmd = commandDefinition instanceof CKEDITOR.command ? commandDefinition : new CKEDITOR.command( this, commandDefinition );

			// Update command when mode is set.
			// This guarantees that commands added before first editor#mode
			// aren't immediately updated, but waits for editor#mode and that
			// commands added later are immediately refreshed, even when added
			// before instanceReady. https://dev.ckeditor.com/ticket/10103, https://dev.ckeditor.com/ticket/10249
			if ( this.mode )
				updateCommand( this, cmd );

			return this.commands[ commandName ] = cmd;
		},

		/**
		 * Attaches the editor to a form to call {@link #updateElement} before form submission.
		 * This method is called by both creators ({@link CKEDITOR#replace replace} and
		 * {@link CKEDITOR#inline inline}), so there is no reason to call it manually.
		 *
		 * @private
		 */
		_attachToForm: function() {
			var editor = this,
				element = editor.element,
				form = new CKEDITOR.dom.element( element.$.form );

			// If are replacing a textarea, we must
			if ( element.is( 'textarea' ) ) {
				if ( form ) {
					form.on( 'submit', onSubmit );

					// Check if there is no element/elements input with name == "submit".
					// If they exists they will overwrite form submit function (form.$.submit).
					// If form.$.submit is overwritten we can not do anything with it.
					if ( isFunction( form.$.submit ) ) {
						// Setup the submit function because it doesn't fire the
						// "submit" event.
						form.$.submit = CKEDITOR.tools.override( form.$.submit, function( originalSubmit ) {
							return function() {
								onSubmit();

								// For IE, the DOM submit function is not a
								// function, so we need third check.
								if ( originalSubmit.apply )
									originalSubmit.apply( this );
								else
									originalSubmit();
							};
						} );
					}

					// Remove 'submit' events registered on form element before destroying.(https://dev.ckeditor.com/ticket/3988)
					editor.on( 'destroy', function() {
						form.removeListener( 'submit', onSubmit );
					} );
				}
			}

			function onSubmit( evt ) {
				editor.updateElement();

				// https://dev.ckeditor.com/ticket/8031 If textarea had required attribute and editor is empty fire 'required' event and if
				// it was cancelled, prevent submitting the form.
				if ( editor._.required && !element.getValue() && editor.fire( 'required' ) === false ) {
					// When user press save button event (evt) is undefined (see save plugin).
					// This method works because it throws error so originalSubmit won't be called.
					// Also this error won't be shown because it will be caught in save plugin.
					evt.data.preventDefault();
				}
			}

			function isFunction( f ) {
				// For IE8 typeof fun == object so we cannot use it.
				return !!( f && f.call && f.apply );
			}
		},

		/**
		 * Destroys the editor instance, releasing all resources used by it.
		 * If the editor replaced an element, the element will be recovered.
		 *
		 *		alert( CKEDITOR.instances.editor1 ); // e.g. object
		 *		CKEDITOR.instances.editor1.destroy();
		 *		alert( CKEDITOR.instances.editor1 ); // undefined
		 *
		 * @param {Boolean} [noUpdate] If the instance is replacing a DOM
		 * element, this parameter indicates whether or not to update the
		 * element with the instance content.
		 */
		destroy: function( noUpdate ) {
			var filters = CKEDITOR.filter.instances,
				self = this;

			this.fire( 'beforeDestroy' );

			!noUpdate && updateEditorElement.call( this );

			this.editable( null );

			if ( this.filter ) {
				delete this.filter;
			}

			// Destroy filters attached to the editor (#1722).
			CKEDITOR.tools.array.forEach( CKEDITOR.tools.object.keys( filters ), function( id ) {
				var filter = filters[ id ];
				if ( self === filter.editor ) {
					filter.destroy();
				}
			} );

			delete this.activeFilter;

			this.status = 'destroyed';

			this.fire( 'destroy' );

			// Plug off all listeners to prevent any further events firing.
			this.removeAllListeners();

			CKEDITOR.remove( this );
			CKEDITOR.fire( 'instanceDestroyed', null, this );
		},

		/**
		 * Returns an {@link CKEDITOR.dom.elementPath element path} for the selection in the editor.
		 *
		 * @param {CKEDITOR.dom.node} [startNode] From which the path should start,
		 * if not specified defaults to editor selection's
		 * start element yielded by {@link CKEDITOR.dom.selection#getStartElement}.
		 * @returns {CKEDITOR.dom.elementPath}
		 */
		elementPath: function( startNode ) {
			if ( !startNode ) {
				var sel = this.getSelection();
				if ( !sel )
					return null;

				startNode = sel.getStartElement();
			}

			return startNode ? new CKEDITOR.dom.elementPath( startNode, this.editable() ) : null;
		},

		/**
		 * Shortcut to create a {@link CKEDITOR.dom.range} instance from the editable element.
		 *
		 * @returns {CKEDITOR.dom.range} The DOM range created if the editable has presented.
		 * @see CKEDITOR.dom.range
		 */
		createRange: function() {
			var editable = this.editable();
			return editable ? new CKEDITOR.dom.range( editable ) : null;
		},

		/**
		 * Executes a command associated with the editor.
		 *
		 *		editorInstance.execCommand( 'bold' );
		 *
		 * @param {String} commandName The identifier name of the command.
		 * @param {Object} [data] The data to be passed to the command. It defaults to
		 * an empty object starting from 4.7.0.
		 * @returns {Boolean} `true` if the command was executed successfully, `false` otherwise.
		 * @see CKEDITOR.editor#addCommand
		 */
		execCommand: function( commandName, data ) {
			var command = this.getCommand( commandName );

			var eventData = {
				name: commandName,
				commandData: data || {},
				command: command
			};

			if ( command && command.state != CKEDITOR.TRISTATE_DISABLED ) {
				if ( this.fire( 'beforeCommandExec', eventData ) !== false ) {
					eventData.returnValue = command.exec( eventData.commandData );

					// Fire the 'afterCommandExec' immediately if command is synchronous.
					if ( !command.async && this.fire( 'afterCommandExec', eventData ) !== false )
						return eventData.returnValue;
				}
			}

			// throw 'Unknown command name "' + commandName + '"';
			return false;
		},

		/**
		 * Gets one of the registered commands. Note that after registering a
		 * command definition with {@link #addCommand}, it is
		 * transformed internally into an instance of
		 * {@link CKEDITOR.command}, which will then be returned by this function.
		 *
		 * @param {String} commandName The name of the command to be returned.
		 * This is the same name that is used to register the command with `addCommand`.
		 * @returns {CKEDITOR.command} The command object identified by the provided name.
		 */
		getCommand: function( commandName ) {
			return this.commands[ commandName ];
		},

		/**
		 * Gets the editor data. The data will be in "raw" format. It is the same
		 * data that is posted by the editor.
		 *
		 *		if ( CKEDITOR.instances.editor1.getData() == '' )
		 *			alert( 'There is no data available.' );
		 *
		 * @param {Boolean} internal If set to `true`, it will prevent firing the
		 * {@link CKEDITOR.editor#beforeGetData} and {@link CKEDITOR.editor#event-getData} events, so
		 * the real content of the editor will not be read and cached data will be returned. The method will work
		 * much faster, but this may result in the editor returning the data that is not up to date. This parameter
		 * should thus only be set to `true` when you are certain that the cached data is up to date.
		 *
		 * @returns {String} The editor data.
		 */
		getData: function( internal ) {
			!internal && this.fire( 'beforeGetData' );

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
			!internal && this.fire( 'getData', eventData );

			return eventData.dataValue;
		},

		/**
		 * Gets the "raw data" currently available in the editor. This is a
		 * fast method which returns the data as is, without processing, so it is
		 * not recommended to use it on resulting pages. Instead it can be used
		 * combined with the {@link #method-loadSnapshot} method in order
		 * to automatically save the editor data from time to time
		 * while the user is using the editor, to avoid data loss, without risking
		 * performance issues.
		 *
		 *		alert( editor.getSnapshot() );
		 *
		 * See also:
		 *
		 * * {@link CKEDITOR.editor#method-getData}.
		 *
		 * @returns {String} Editor "raw data".
		 */
		getSnapshot: function() {
			var data = this.fire( 'getSnapshot' );

			if ( typeof data != 'string' ) {
				var element = this.element;

				if ( element && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ) {
					data = element.is( 'textarea' ) ? element.getValue() : element.getHtml();
				}
				else {
					// If we don't have a proper element, set data to an empty string,
					// as this method is expected to return a string. (https://dev.ckeditor.com/ticket/13385)
					data = '';
				}
			}

			return data;
		},

		/**
		 * Loads "raw data" into the editor. The data is loaded with processing
		 * straight to the editing area. It should not be used as a way to load
		 * any kind of data, but instead in combination with
		 * {@link #method-getSnapshot}-produced data.
		 *
		 *		var data = editor.getSnapshot();
		 *		editor.loadSnapshot( data );
		 *
		 * @see CKEDITOR.editor#setData
		 */
		loadSnapshot: function( snapshot ) {
			this.fire( 'loadSnapshot', snapshot );
		},

		/**
		 * Sets the editor data. The data must be provided in the "raw" format (HTML).
		 *
		 * Note that this method is asynchronous. The `callback` parameter must
		 * be used if interaction with the editor is needed after setting the data.
		 *
		 *		CKEDITOR.instances.editor1.setData( '<p>This is the editor data.</p>' );
		 *
		 *		CKEDITOR.instances.editor1.setData( '<p>Some other editor data.</p>', {
		 *			callback: function() {
		 *				this.checkDirty(); // true
		 *			}
		 *		} );
		 *
		 * Note: In **CKEditor 4.4.2** the signature of this method has changed. All arguments
		 * except `data` were wrapped into the `options` object. However, backward compatibility
		 * was preserved and it is still possible to use the `data, callback, internal` arguments.
		 *
		 *
		 * @param {String} data The HTML code to replace current editor content.
		 * @param {Object} [options]
		 * @param {Boolean} [options.internal=false] Whether to suppress any event firing when copying data internally inside the editor.
		 * @param {Function} [options.callback] Function to be called after `setData` is completed (on {@link #dataReady}).
		 * @param {Boolean} [options.noSnapshot=false] If set to `true`, it will prevent recording an undo snapshot.
		 * Introduced in CKEditor 4.4.2.
		 * @param {Boolean} [internal=false] Old equivalent of `options.internal` parameter. It is only available
		 * to provide backwards compatibility for calls with `data, callback, internal` parameters.
		 * It is recommended to use `options.internal` parameter instead.
		 */
		setData: function( data, options, internal ) {
			var fireSnapshot = true,
				// Backward compatibility.
				callback = options,
				eventData;

			if ( options && typeof options == 'object' ) {
				internal = options.internal;
				callback = options.callback;
				fireSnapshot = !options.noSnapshot;
			}

			if ( !internal && fireSnapshot )
				this.fire( 'saveSnapshot' );

			if ( callback || !internal ) {
				this.once( 'dataReady', function( evt ) {
					if ( !internal && fireSnapshot )
						this.fire( 'saveSnapshot' );

					if ( callback )
						callback.call( evt.editor );
				} );
			}

			// Fire "setData" so data manipulation may happen.
			eventData = { dataValue: data };
			!internal && this.fire( 'setData', eventData );

			this._.data = eventData.dataValue;

			!internal && this.fire( 'afterSetData', eventData );
		},

		/**
		 * Puts or restores the editor into the read-only state. When in read-only,
		 * the user is not able to change the editor content, but can still use
		 * some editor features. This function sets the {@link #property-readOnly}
		 * property of the editor, firing the {@link #event-readOnly} event.
		 *
		 * **Note:** The current editing area will be reloaded.
		 *
		 * @since 3.6.0
		 * @param {Boolean} [isReadOnly] Indicates that the editor must go
		 * read-only (`true`, default) or be restored and made editable (`false`).
		 */
		setReadOnly: function( isReadOnly ) {
			isReadOnly = ( isReadOnly == null ) || isReadOnly;

			if ( this.readOnly != isReadOnly ) {
				this.readOnly = isReadOnly;

				// Block or release BACKSPACE key according to current read-only
				// state to prevent browser's history navigation (https://dev.ckeditor.com/ticket/9761).
				this.keystrokeHandler.blockedKeystrokes[ 8 ] = +isReadOnly;

				this.editable().setReadOnly( isReadOnly );

				// Fire the readOnly event so the editor features can update
				// their state accordingly.
				this.fire( 'readOnly' );
			}
		},

		/**
		 * Inserts HTML code into the currently selected position in the editor in WYSIWYG mode.
		 *
		 * Example:
		 *
		 *		CKEDITOR.instances.editor1.insertHtml( '<p>This is a new paragraph.</p>' );
		 *
		 * Fires the {@link #event-insertHtml} and {@link #event-afterInsertHtml} events. The HTML is inserted
		 * in the {@link #event-insertHtml} event's listener with a default priority (10) so you can add listeners with
		 * lower or higher priorities in order to execute some code before or after the HTML is inserted.
		 *
		 * @param {String} html HTML code to be inserted into the editor.
		 * @param {String} [mode='html'] The mode in which the HTML code will be inserted. One of the following:
		 *
		 * * `'html'` &ndash; The inserted content  will completely override the styles at the selected position.
		 * * `'unfiltered_html'` &ndash; Like `'html'` but the content is not filtered with {@link CKEDITOR.filter}.
		 * * `'text'` &ndash; The inserted content will inherit the styles applied in
		 *    the selected position. This mode should be used when inserting "htmlified" plain text
		 *    (HTML without inline styles and styling elements like `<b>`, `<strong>`, `<span style="...">`).
		 *
		 * @param {CKEDITOR.dom.range} [range] If specified, the HTML will be inserted into the range
		 * instead of into the selection. The selection will be placed at the end of the insertion (like in the normal case).
		 * Introduced in CKEditor 4.5.
		 */
		insertHtml: function( html, mode, range ) {
			this.fire( 'insertHtml', { dataValue: html, mode: mode, range: range } );
		},

		/**
		 * Inserts text content into the currently selected position in the
		 * editor in WYSIWYG mode. The styles of the selected element will be applied to the inserted text.
		 * Spaces around the text will be left untouched.
		 *
		 *		CKEDITOR.instances.editor1.insertText( ' line1 \n\n line2' );
		 *
		 * Fires the {@link #event-insertText} and {@link #event-afterInsertHtml} events. The text is inserted
		 * in the {@link #event-insertText} event's listener with a default priority (10) so you can add listeners with
		 * lower or higher priorities in order to execute some code before or after the text is inserted.
		 *
		 * @since 3.5.0
		 * @param {String} text Text to be inserted into the editor.
		 */
		insertText: function( text ) {
			this.fire( 'insertText', text );
		},

		/**
		 * Inserts an element into the currently selected position in the editor in WYSIWYG mode.
		 *
		 *		var element = CKEDITOR.dom.element.createFromHtml( '<img src="hello.png" border="0" title="Hello" />' );
		 *		CKEDITOR.instances.editor1.insertElement( element );
		 *
		 * Fires the {@link #event-insertElement} event. The element is inserted in the listener with a default priority (10),
		 * so you can add listeners with lower or higher priorities in order to execute some code before or after
		 * the element is inserted.
		 *
		 * @param {CKEDITOR.dom.element} element The element to be inserted into the editor.
		 */
		insertElement: function( element ) {
			this.fire( 'insertElement', element );
		},

		/**
		 * Gets the selected HTML (it is returned as a {@link CKEDITOR.dom.documentFragment document fragment}
		 * or a string). This method is designed to work as the user would expect the copy functionality to work.
		 * For instance, if the following selection was made:
		 *
		 *		<p>a<b>b{c}d</b>e</p>
		 *
		 * The following HTML will be returned:
		 *
		 *		<b>c</b>
		 *
		 * As you can see, the information about the bold formatting was preserved, even though the selection was
		 * anchored inside the `<b>` element.
		 *
		 * See also:
		 *
		 * * the {@link #extractSelectedHtml} method,
		 * * the {@link CKEDITOR.editable#getHtmlFromRange} method.
		 *
		 * @since 4.5.0
		 * @param {Boolean} [toString] If `true`, then stringified HTML will be returned.
		 * @returns {CKEDITOR.dom.documentFragment/String}
		 */
		getSelectedHtml: function( toString ) {
			var editable = this.editable(),
				selection = this.getSelection(),
				ranges = selection && selection.getRanges();

			if ( !editable || !ranges || ranges.length === 0 ) {
				return null;
			}

			var docFragment = createDocumentFragmentFromRanges( ranges, editable );

			return toString ? docFragment.getHtml() : docFragment;
		},

		/**
		 * Gets the selected HTML (it is returned as a {@link CKEDITOR.dom.documentFragment document fragment}
		 * or a string) and removes the selected part of the DOM. This method is designed to work as the user would
		 * expect the cut and delete functionalities to work.
		 *
		 * See also:
		 *
		 * * the {@link #getSelectedHtml} method,
		 * * the {@link CKEDITOR.editable#extractHtmlFromRange} method.
		 *
		 * @since 4.5.0
		 * @param {Boolean} [toString] If `true`, then stringified HTML will be returned.
		 * @param {Boolean} [removeEmptyBlock=false] Default `false` means that the function will keep an empty block (if the
		 * entire content was removed) or it will create it (if a block element was removed) and set the selection in that block.
		 * If `true`, the empty block will be removed or not created. In this case the function will not handle the selection.
		 * @returns {CKEDITOR.dom.documentFragment/String/null}
		 */
		extractSelectedHtml: function( toString, removeEmptyBlock ) {
			var editable = this.editable(),
				ranges = this.getSelection().getRanges(),
				docFragment = new CKEDITOR.dom.documentFragment(),
				i;

			if ( !editable || ranges.length === 0 ) {
				return null;
			}

			for ( i = 0; i < ranges.length; i++ ) {
				docFragment.append( editable.extractHtmlFromRange( ranges[ i ], removeEmptyBlock ) );
			}

			if ( !removeEmptyBlock ) {
				this.getSelection().selectRanges( [ ranges[ 0 ] ] );
			}

			return toString ? docFragment.getHtml() : docFragment;
		},

		/**
		 * Moves the selection focus to the editing area space in the editor.
		 */
		focus: function() {
			this.fire( 'beforeFocus' );
		},

		/**
		 * Checks whether the current editor content contains changes when
		 * compared to the content loaded into the editor at startup, or to
		 * the content available in the editor when {@link #resetDirty}
		 * was called.
		 *
		 *		function beforeUnload( evt ) {
		 *			if ( CKEDITOR.instances.editor1.checkDirty() )
		 *				return evt.returnValue = "You will lose the changes made in the editor.";
		 *		}
		 *
		 *		if ( window.addEventListener )
		 *			window.addEventListener( 'beforeunload', beforeUnload, false );
		 *		else
		 *			window.attachEvent( 'onbeforeunload', beforeUnload );
		 *
		 * @returns {Boolean} `true` if the content contains changes.
		 */
		checkDirty: function() {
			return this.status == 'ready' && this._.previousValue !== this.getSnapshot();
		},

		/**
		 * Resets the "dirty state" of the editor so subsequent calls to
		 * {@link #checkDirty} will return `false` if the user will not
		 * have made further changes to the content.
		 *
		 *		alert( editor.checkDirty() ); // e.g. true
		 *		editor.resetDirty();
		 *		alert( editor.checkDirty() ); // false
		 */
		resetDirty: function() {
			this._.previousValue = this.getSnapshot();
		},

		/**
		 * Updates the `<textarea>` element that was replaced by the editor with
		 * the current data available in the editor.
		 *
		 * **Note:** This method will only affect those editor instances created
		 * with the {@link CKEDITOR#ELEMENT_MODE_REPLACE} element mode or inline instances
		 * bound to `<textarea>` elements.
		 *
		 *		CKEDITOR.instances.editor1.updateElement();
		 *		alert( document.getElementById( 'editor1' ).value ); // The current editor data.
		 *
		 * @see CKEDITOR.editor#element
		 */
		updateElement: function() {
			return updateEditorElement.call( this );
		},

		/**
		 * Assigns keystrokes associated with editor commands.
		 *
		 *		editor.setKeystroke( CKEDITOR.CTRL + 115, 'save' );	// Assigned Ctrl+S to the "save" command.
		 *		editor.setKeystroke( CKEDITOR.CTRL + 115, false );	// Disabled Ctrl+S keystroke assignment.
		 *		editor.setKeystroke( [
		 *			[ CKEDITOR.ALT + 122, false ],
		 *			[ CKEDITOR.CTRL + 121, 'link' ],
		 *			[ CKEDITOR.SHIFT + 120, 'bold' ]
		 *		] );
		 *
		 * This method may be used in the following cases:
		 *
		 * * By plugins (like `link` or `basicstyles`) to set their keystrokes when plugins are being loaded.
		 * * During the runtime to modify existing keystrokes.
		 *
		 * The editor handles keystroke configuration in the following order:
		 *
		 * 1. Plugins use this method to define default keystrokes.
		 * 2. Editor extends default keystrokes with {@link CKEDITOR.config#keystrokes}.
		 * 3. Editor blocks keystrokes defined in {@link CKEDITOR.config#blockedKeystrokes}.
		 *
		 * You can then set new keystrokes using this method during the runtime.
		 *
		 * @since 4.0.0
		 * @param {Number/Array} keystroke A keystroke or an array of keystroke definitions.
		 * @param {String/Boolean} [behavior] A command to be executed on the keystroke.
		 */
		setKeystroke: function() {
			var keystrokes = this.keystrokeHandler.keystrokes,
				newKeystrokes = CKEDITOR.tools.isArray( arguments[ 0 ] ) ? arguments[ 0 ] : [ [].slice.call( arguments, 0 ) ],
				keystroke, behavior;

			for ( var i = newKeystrokes.length; i--; ) {
				keystroke = newKeystrokes[ i ];
				behavior = 0;

				// It may be a pair of: [ key, command ]
				if ( CKEDITOR.tools.isArray( keystroke ) ) {
					behavior = keystroke[ 1 ];
					keystroke = keystroke[ 0 ];
				}

				if ( behavior )
					keystrokes[ keystroke ] = behavior;
				else
					delete keystrokes[ keystroke ];
			}
		},

		/**
		 * Returns the keystroke that is assigned to a specified {@link CKEDITOR.command}. If no keystroke is assigned,
		 * it returns `null`.
		 *
		 * Since version 4.7.0 this function also accepts a `command` parameter as a string.
		 *
		 * @since 4.6.0
		 * @param {CKEDITOR.command/String} command The {@link CKEDITOR.command} instance or a string with the command name.
		 * @param {Boolean} [all=false] If `true`, the function will return an array of assigned keystrokes.
		 * Available since 4.11.0.
		 * @returns {Number/Number[]/null} Depending on the `all` parameter value:
		 *
		 * * `false` &ndash; The first keystroke assigned to the provided command or `null` if there is no keystroke.
		 * * `true` &ndash; An array of all assigned keystrokes or an empty array if there is no keystroke.
		 */
		getCommandKeystroke: function( command, all ) {
			var commandInstance = ( typeof command === 'string' ? this.getCommand( command ) : command ),
				ret = [];

			if ( commandInstance ) {
				var commandName = CKEDITOR.tools.object.findKey( this.commands, commandInstance ),
					keystrokes = this.keystrokeHandler.keystrokes;

				// Some commands have a fake keystroke - for example CUT/COPY/PASTE commands are handled natively.
				// If fake key was used, the regular keystrokes should be skipped.
				if ( commandInstance.fakeKeystroke ) {
					ret.push( commandInstance.fakeKeystroke );
				} else {
					for ( var i in keystrokes ) {
						if ( keystrokes[ i ] === commandName ) {
							ret.push( i );
						}
					}
				}
			}

			return all ? ret : ( ret[ 0 ] || null );
		},

		/**
		 * Shorthand for {@link CKEDITOR.filter#addFeature}.
		 *
		 * @since 4.1.0
		 * @param {CKEDITOR.feature} feature See {@link CKEDITOR.filter#addFeature}.
		 * @returns {Boolean} See {@link CKEDITOR.filter#addFeature}.
		 */
		addFeature: function( feature ) {
			return this.filter.addFeature( feature );
		},

		/**
		 * Sets the active filter ({@link #activeFilter}). Fires the {@link #activeFilterChange} event.
		 *
		 *		// Set active filter which allows only 4 elements.
		 *		// Buttons like Bold, Italic will be disabled.
		 *		var filter = new CKEDITOR.filter( 'p strong em br' );
		 *		editor.setActiveFilter( filter );
		 *
		 * Setting a new filter will also change the {@link #setActiveEnterMode active Enter modes} to the first values
		 * allowed by the new filter (see {@link CKEDITOR.filter#getAllowedEnterMode}).
		 *
		 * @since 4.3.0
		 * @param {CKEDITOR.filter} filter Filter instance or a falsy value (e.g. `null`) to reset to the default one.
		 */
		setActiveFilter: function( filter ) {
			if ( !filter )
				filter = this.filter;

			if ( this.activeFilter !== filter ) {
				this.activeFilter = filter;
				this.fire( 'activeFilterChange' );

				// Reset active filter to the main one - it resets enter modes, too.
				if ( filter === this.filter )
					this.setActiveEnterMode( null, null );
				else
					this.setActiveEnterMode(
						filter.getAllowedEnterMode( this.enterMode ),
						filter.getAllowedEnterMode( this.shiftEnterMode, true )
					);
			}
		},

		/**
		 * Sets the active Enter modes: ({@link #enterMode} and {@link #shiftEnterMode}).
		 * Fires the {@link #activeEnterModeChange} event.
		 *
		 * Prior to CKEditor 4.3.0 Enter modes were static and it was enough to check {@link CKEDITOR.config#enterMode}
		 * and {@link CKEDITOR.config#shiftEnterMode} when implementing a feature which should depend on the Enter modes.
		 * Since CKEditor 4.3.0 these options are source of initial:
		 *
		 * * static {@link #enterMode} and {@link #shiftEnterMode} values,
		 * * dynamic {@link #activeEnterMode} and {@link #activeShiftEnterMode} values.
		 *
		 * However, the dynamic Enter modes can be changed during runtime by using this method, to reflect the selection context.
		 * For example, if selection is moved to the {@link CKEDITOR.plugins.widget widget}'s nested editable which
		 * is a {@link #blockless blockless one}, then the active Enter modes should be changed to {@link CKEDITOR#ENTER_BR}
		 * (in this case {@glink guide/dev_widgets Widget System} takes care of that).
		 *
		 * **Note:** This method should not be used to configure the editor &ndash; use {@link CKEDITOR.config#enterMode} and
		 * {@link CKEDITOR.config#shiftEnterMode} instead. This method should only be used to dynamically change
		 * Enter modes during runtime based on selection changes.
		 * Keep in mind that changed Enter mode may be overwritten by another plugin/feature when it decided that
		 * the changed context requires this.
		 *
		 * **Note:** In case of blockless editor (inline editor based on an element which cannot contain block elements
		 * &mdash; see {@link CKEDITOR.editor#blockless}) only {@link CKEDITOR#ENTER_BR} is a valid Enter mode. Therefore
		 * this method will not allow to set other values.
		 *
		 * **Note:** Changing the {@link #activeFilter active filter} may cause the Enter mode to change if default Enter modes
		 * are not allowed by the new filter.
		 *
		 * @since 4.3.0
		 * @param {Number} enterMode One of {@link CKEDITOR#ENTER_P}, {@link CKEDITOR#ENTER_DIV}, {@link CKEDITOR#ENTER_BR}.
		 * Pass falsy value (e.g. `null`) to reset the Enter mode to the default value ({@link #enterMode} and/or {@link #shiftEnterMode}).
		 * @param {Number} shiftEnterMode See the `enterMode` argument.
		 */
		setActiveEnterMode: function( enterMode, shiftEnterMode ) {
			// Validate passed modes or use default ones (validated on init).
			enterMode = enterMode ? validateEnterMode( this, enterMode ) : this.enterMode;
			shiftEnterMode = shiftEnterMode ? validateEnterMode( this, shiftEnterMode ) : this.shiftEnterMode;

			if ( this.activeEnterMode != enterMode || this.activeShiftEnterMode != shiftEnterMode ) {
				this.activeEnterMode = enterMode;
				this.activeShiftEnterMode = shiftEnterMode;
				this.fire( 'activeEnterModeChange' );
			}
		},

		/**
		 * Shows a notification to the user.
		 *
		 * If the [Notification](https://ckeditor.com/cke4/addon/notification) plugin is not enabled, this function shows
		 * a normal alert with the given `message`. The `type` and `progressOrDuration` parameters are supported
		 * only by the Notification plugin.
		 *
		 * If the Notification plugin is enabled, this method creates and shows a new notification.
		 * By default the notification is shown over the editor content, in the viewport if it is possible.
		 *
		 * See {@link CKEDITOR.plugins.notification}.
		 *
		 * @since 4.5.0
		 * @member CKEDITOR.editor
		 * @param {String} message The message displayed in the notification.
		 * @param {String} [type='info'] The type of the notification. Can be `'info'`, `'warning'`, `'success'` or `'progress'`.
		 * @param {Number} [progressOrDuration] If the type is `progress`, the third parameter may be a progress from `0` to `1`
		 * (defaults to `0`). Otherwise the third parameter may be a notification duration denoting after how many milliseconds
		 * the notification should be closed automatically. `0` means that the notification will not close automatically and the user
		 * needs to close it manually. See {@link CKEDITOR.plugins.notification#duration}.
		 * Note that `warning` notifications will not be closed automatically.
		 * @returns {CKEDITOR.plugins.notification} Created and shown notification.
		 */
		showNotification: function( message ) {
			alert( message ); // jshint ignore:line
		},

		/**
		 * Provides information whether the editor's {@link CKEDITOR.editor#container container}
		 * {@link CKEDITOR.dom.element#isDetached is detached}.
		 *
		 * @since 4.13.0
		 * @returns {Boolean} true if the editor's container is detached.
		 */
		isDetached: function() {
			return !!this.container && this.container.isDetached();
		},

		/**
		 * Determines if the current editor instance is destroyed.
		 *
		 * @since 4.13.0
		 * @returns {Boolean} true if the editor is destroyed.
		 */
		isDestroyed: function() {
			return this.status === 'destroyed';
		}
	} );

	/**
	 * Gets the element from the DOM and checks if the editor can be instantiated on it.
	 * This function is available for internal use only.
	 *
	 * @private
	 * @since 4.12.0
	 * @static
	 * @param {String/CKEDITOR.dom.element} elementOrId
	 * @member CKEDITOR.editor
	 * @returns {CKEDITOR.dom.element/null}
	 */
	CKEDITOR.editor._getEditorElement = function( elementOrId ) {
		if ( !CKEDITOR.env.isCompatible ) {
			return null;
		}

		var element = CKEDITOR.dom.element.get( elementOrId );

		// Throw error on missing target element.
		if ( !element ) {
			CKEDITOR.error( 'editor-incorrect-element', {
				element: elementOrId
			} );

			return null;
		}

		// Avoid multiple inline editor instances on the same element.
		if ( element.getEditor() ) {
			CKEDITOR.error( 'editor-element-conflict', {
				editorName: element.getEditor().name
			} );

			return null;
		}

		return element;
	};

	/**
	 * Initializes delayed editor creation based on provided configuration.
	 *
	 * If the {@link CKEDITOR.config#delayIfDetached_callback} function is declared, it will be invoked with a single argument:
	 *
	 * * A callback, that should be called to create editor.
	 *
	 * Otherwise, it periodically (with `setInterval()` calls) checks if element is attached to DOM and creates editor automatically.
	 * The interval can be canceled by executing a callback function (a handle) clearing the interval.
	 *
	 * ```js
	 *	CKEDITOR.inline( detachedEditorElement, {
	 *		delayIfDetached: true,
	 *		delayIfDetached_callback: registerCallback
	 *	} );
	 * ```
	 *
	 * @private
	 * @since 4.17.0
	 * @static
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.dom.element} element The DOM element on which editor should be initialized.
	 * @param {Object} config The specific configuration to apply to the editor instance.
	 * Configuration set here will override the global CKEditor settings.
	 * @param {String} editorCreationMethod Creator function that should be used to initialize editor (inline/replace).
	 * @returns {Function/null} A handle allowing to cancel delayed editor initialization creation
	 * or null if {@link CKEDITOR.config#delayIfDetached_callback} option is set.
	 */
	CKEDITOR.editor.initializeDelayedEditorCreation = function( element, config, editorCreationMethod ) {
		if ( config.delayIfDetached_callback ) {
			CKEDITOR.warn( 'editor-delayed-creation', {
				method: 'callback'
			} );

			config.delayIfDetached_callback( function() {
				CKEDITOR[ editorCreationMethod ]( element, config );

				CKEDITOR.warn( 'editor-delayed-creation-success', {
					method: 'callback'
				} );
			} );

			return null;
		}

		var interval = config.delayIfDetached_interval === undefined ?
			CKEDITOR.config.delayIfDetached_interval
			: config.delayIfDetached_interval;

		CKEDITOR.warn( 'editor-delayed-creation', {
			method: 'interval - ' + interval + ' ms'
		} );

		var intervalId = setInterval( function() {
			if ( !element.isDetached() ) {
				clearInterval( intervalId );

				CKEDITOR[ editorCreationMethod ]( element, config );

				CKEDITOR.warn( 'editor-delayed-creation-success', {
					method: 'interval - ' + interval + ' ms'
				} );
			}
		}, interval );

		return function() {
			clearInterval( intervalId );
		};
	};

	/**
	 * Whether editor creation should be delayed.
	 *
	 * @private
	 * @since 4.17.0
	 * @static
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.dom.element} element The DOM element on which editor should be initialized.
	 * @param {Object} config Editor configuration.
	 * @returns {Boolean} True if creation should be delayed.
	 */
	CKEDITOR.editor.shouldDelayEditorCreation = function( element, config ) {
		CKEDITOR.editor.mergeDelayedCreationConfigs( config );
		return config && config.delayIfDetached && element.isDetached();
	};

	/**
	 * Merges user provided configuration options for delayed creation with {@link CKEDITOR.config default config}.
	 *
	 * User provided options are the preferred ones.
	 *
	 * @private
	 * @since 4.17.0
	 * @static
	 * @member CKEDITOR.editor
	 * @param {Object} userConfig Config provided by the user to create editor.
	 */
	CKEDITOR.editor.mergeDelayedCreationConfigs = function( userConfig ) {
		if ( !userConfig ) {
			return;
		}

		userConfig.delayIfDetached = typeof userConfig.delayIfDetached === 'boolean' ? userConfig.delayIfDetached : CKEDITOR.config.delayIfDetached;
		userConfig.delayIfDetached_interval = isNaN( userConfig.delayIfDetached_interval ) ? CKEDITOR.config.delayIfDetached_interval : userConfig.delayIfDetached_interval;
		userConfig.delayIfDetached_callback = userConfig.delayIfDetached_callback || CKEDITOR.config.delayIfDetached_callback;
	};

} )();

/**
 * The editor has no associated element.
 *
 * @readonly
 * @property {Number} [=0]
 * @member CKEDITOR
 */
CKEDITOR.ELEMENT_MODE_NONE = 0;

/**
 * The element is to be replaced by the editor instance.
 *
 * @readonly
 * @property {Number} [=1]
 * @member CKEDITOR
 */
CKEDITOR.ELEMENT_MODE_REPLACE = 1;

/**
 * The editor is to be created inside the element.
 *
 * @readonly
 * @property {Number} [=2]
 * @member CKEDITOR
 */
CKEDITOR.ELEMENT_MODE_APPENDTO = 2;

/**
 * The editor is to be attached to the element, using it as the editing block.
 *
 * @readonly
 * @property {Number} [=3]
 * @member CKEDITOR
 */
CKEDITOR.ELEMENT_MODE_INLINE = 3;

/**
 * Whether to escape HTML when the editor updates the original input element.
 *
 *		config.htmlEncodeOutput = true;
 *
 * @since 3.1.0
 * @cfg {Boolean} [htmlEncodeOutput=false]
 * @member CKEDITOR.config
 */

/**
 * If `true`, makes the editor start in read-only state. Otherwise, it will check
 * if the linked `<textarea>` element has the `disabled` attribute.
 *
 * Read more in the {@glink features/readonly documentation}
 * and see the {@glink examples/readonly example}.
 *
 *		config.readOnly = true;
 *
 * @since 3.6.0
 * @cfg {Boolean} [readOnly=false]
 * @member CKEDITOR.config
 * @see CKEDITOR.editor#setReadOnly
 */

/**
 * Whether an editable element should have focus when the editor is loading for the first time.
 *
 *		// Focus at the beginning of the editable.
 *		config.startupFocus = true;
 *
 * Since CKEditor 4.9.0, `startupFocus` can be explicitly set to either the `start` or the `end`
 * of the editable:
 *
 *		// Focus at the beginning of the editable.
 *		config.startupFocus = 'start';
 *
 *		// Focus at the end of the editable.
 *		config.startupFocus = 'end';
 *
 * @cfg {String/Boolean} [startupFocus=false]
 * @member CKEDITOR.config
 */

/**
 * Customizes the {@link CKEDITOR.editor#title human-readable title} of this editor. This title is displayed in
 * tooltips and impacts various [accessibility aspects](#!/guide/dev_a11y-section-announcing-the-editor-on-the-page),
 * e.g. it is commonly used by screen readers for distinguishing editor instances and for navigation.
 * Accepted values are a string or `false`.
 *
 * **Note:** When `config.title` is set globally, the same value will be applied to all editor instances
 * loaded with this config. This may adversely affect accessibility as screen reader users will be unable
 * to distinguish particular editor instances and navigate between them.
 *
 * **Note:** Setting `config.title = false` may also impair accessibility in a similar way.
 *
 * **Note:** Please do not confuse this property with {@link CKEDITOR.editor#name}
 * which identifies the instance in the {@link CKEDITOR#instances} literal.
 *
 *		// Sets the title to 'My WYSIWYG editor.'. The original title of the element (if it exists)
 *		// will be restored once the editor instance is destroyed.
 *		config.title = 'My WYSIWYG editor.';
 *
 *		// Do not touch the title. If the element already has a title, it remains unchanged.
 *		// Also if no `title` attribute exists, nothing new will be added.
 *		config.title = false;
 *
 * See also:
 * * CKEDITOR.editor#title
 * * CKEDITOR.editor#name
 * * CKEDITOR.editor#applicationTitle
 * * CKEDITOR.config#applicationTitle
 *
 * @since 4.2.0
 * @cfg {String/Boolean} [title=based on editor.name]
 * @member CKEDITOR.config
 */

/**
 * Customizes the {@link CKEDITOR.editor#applicationTitle human-readable title} of the application for this
 * editor. This title is used as a label for the whole website's region containing the editor with its toolbars and other
 * UI parts. Application title impacts various
 * [accessibility aspects](#!/guide/dev_a11y-section-announcing-the-editor-on-the-page),
 * e.g. it is commonly used by screen readers for distinguishing editor instances and for navigation.
 * Accepted values are a string or `false`.
 *
 * **Note:** When `config.applicationTitle` is set globally, the same value will be applied to all editor instances
 * loaded with this config. This may adversely affect accessibility as screen reader users will be unable
 * to distinguish particular editor instances and navigate between them.
 *
 * **Note:** Setting `config.applicationTitle = false` may also impair accessibility in a similar way.
 *
 * **Note:** Please do not confuse this property with {@link CKEDITOR.editor#name}
 * which identifies the instance in the {@link CKEDITOR#instances} literal.
 *
 *		// Set the application title to 'My WYSIWYG'.
 *		config.applicationTitle = 'My WYSIWYG';
 *
 *		// Do not add the application title.
 *		config.applicationTitle = false;
 *
 * See also:
 *
 * * CKEDITOR.editor#applicationTitle
 * * CKEDITOR.editor#name
 * * CKEDITOR.editor#title
 * * CKEDITOR.config#title
 *
 * @since 4.19.0
 * @cfg {String/Boolean} [applicationTitle=based on editor.name]
 * @member CKEDITOR.config
 */

/**
 * Sets listeners on editor events.
 *
 * **Note:** This property can only be set in the `config` object passed directly
 * to {@link CKEDITOR#replace}, {@link CKEDITOR#inline}, and other creators.
 *
 *		CKEDITOR.replace( 'editor1', {
 *			on: {
 *				instanceReady: function() {
 *					alert( this.name ); // 'editor1'
 *				},
 *
 *				key: function() {
 *					// ...
 *				}
 *			}
 *		} );
 *
 * @cfg {Object} on
 * @member CKEDITOR.config
 */

/**
 * The outermost element in the DOM tree in which the editable element resides. It is provided
 * by a specific editor creator after the editor UI is created and is not intended to
 * be modified.
 *
 *		var editor = CKEDITOR.instances.editor1;
 *		alert( editor.container.getName() ); // 'span'
 *
 * @readonly
 * @property {CKEDITOR.dom.element} container
 */

/**
 * The document that stores the editor content.
 *
 * * For the classic (`iframe`-based) editor it is equal to the document inside the
 * `iframe` containing the editable element.
 * * For the inline editor it is equal to {@link CKEDITOR#document}.
 *
 * The document object is available after the {@link #contentDom} event is fired
 * and may be invalidated when the {@link #contentDomUnload} event is fired
 * (classic editor only).
 *
 *		editor.on( 'contentDom', function() {
 *			console.log( editor.document );
 *		} );
 *
 * @readonly
 * @property {CKEDITOR.dom.document} document
 */

/**
 * The window instance related to the {@link #document} property.
 *
 * It is always equal to the `editor.document.getWindow()`.
 *
 * See the {@link #document} property documentation.
 *
 * @readonly
 * @property {CKEDITOR.dom.window} window
 */

/**
 * The main filter instance used for input data filtering, data
 * transformations, and activation of features.
 *
 * It points to a {@link CKEDITOR.filter} instance set up based on
 * editor configuration.
 *
 * @since 4.1.0
 * @readonly
 * @property {CKEDITOR.filter} filter
 */

/**
 * The active filter instance which should be used in the current context (location selection).
 * This instance will be used to make a decision which commands, buttons and other
 * {@link CKEDITOR.feature features} can be enabled.
 *
 * By default it equals the {@link #filter} and it can be changed by the {@link #setActiveFilter} method.
 *
 *		editor.on( 'activeFilterChange', function() {
 *			if ( editor.activeFilter.check( 'cite' ) )
 *				// Do something when <cite> was enabled - e.g. enable a button.
 *			else
 *				// Otherwise do something else.
 *		} );
 *
 * See also the {@link #setActiveEnterMode} method for an explanation of dynamic settings.
 *
 * @since 4.3.0
 * @readonly
 * @property {CKEDITOR.filter} activeFilter
 */

/**
 * The main (static) Enter mode which is a validated version of the {@link CKEDITOR.config#enterMode} setting.
 * Currently only one rule exists &mdash; {@link #blockless blockless editors} may have
 * Enter modes set only to {@link CKEDITOR#ENTER_BR}.
 *
 * @since 4.3.0
 * @readonly
 * @property {Number} enterMode
 */

/**
 * See the {@link #enterMode} property.
 *
 * @since 4.3.0
 * @readonly
 * @property {Number} shiftEnterMode
 */

/**
 * The dynamic Enter mode which should be used in the current context (selection location).
 * By default it equals the {@link #enterMode} and it can be changed by the {@link #setActiveEnterMode} method.
 *
 * See also the {@link #setActiveEnterMode} method for an explanation of dynamic settings.
 *
 * @since 4.3.0
 * @readonly
 * @property {Number} activeEnterMode
 */

/**
 * See the {@link #activeEnterMode} property.
 *
 * @since 4.3.0
 * @readonly
 * @property {Number} activeShiftEnterMode
 */

/**
 * Event fired by the {@link #setActiveFilter} method when the {@link #activeFilter} is changed.
 *
 * @since 4.3.0
 * @event activeFilterChange
 */

/**
 * Event fired by the {@link #setActiveEnterMode} method when any of the active Enter modes is changed.
 * See also the {@link #activeEnterMode} and {@link #activeShiftEnterMode} properties.
 *
 * @since 4.3.0
 * @event activeEnterModeChange
 */

/**
 * Event fired when a CKEDITOR instance is created, but still before initializing it.
 * To interact with a fully initialized instance, use the
 * {@link CKEDITOR#instanceReady} event instead.
 *
 * @event instanceCreated
 * @member CKEDITOR
 * @param {CKEDITOR.editor} editor The editor instance that has been created.
 */

/**
 * Event fired when CKEDITOR instance's components (configuration, languages and plugins) are fully
 * loaded and initialized. However, the editor will be fully ready for interaction
 * on {@link CKEDITOR#instanceReady}.
 *
 * @event instanceLoaded
 * @member CKEDITOR
 * @param {CKEDITOR.editor} editor This editor instance that has been loaded.
 */

/**
 * Event fired when a CKEDITOR instance is destroyed.
 *
 * @event instanceDestroyed
 * @member CKEDITOR
 * @param {CKEDITOR.editor} editor The editor instance that has been destroyed.
 */

/**
 * Event fired when a CKEDITOR instance is created, fully initialized and ready for interaction.
 *
 * @event instanceReady
 * @member CKEDITOR
 * @param {CKEDITOR.editor} editor The editor instance that has been created.
 */

/**
 * Event fired when the language is loaded into the editor instance.
 *
 * @since 3.6.1
 * @event langLoaded
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when all plugins are loaded and initialized into the editor instance.
 *
 * @event pluginsLoaded
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when the styles set is loaded. During the editor initialization
 * phase the {@link #getStylesSet} method returns only styles that
 * are already loaded, which may not include e.g. styles parsed
 * by the `stylesheetparser` plugin. Thus, to be notified when all
 * styles are ready, you can listen on this event.
 *
 * @since 4.1.0
 * @event stylesSet
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {Array} styles An array of styles definitions.
 */

/**
 * Event fired before the command execution when {@link #execCommand} is called.
 *
 * @event beforeCommandExec
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.name The command name.
 * @param {Object} data.commandData The data to be sent to the command. This
 * can be manipulated by the event listener.
 * @param {CKEDITOR.command} data.command The command itself.
 */

/**
 * Event fired after the command execution when {@link #execCommand} is called.
 *
 * @event afterCommandExec
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.name The command name.
 * @param {Object} data.commandData The data sent to the command.
 * @param {CKEDITOR.command} data.command The command itself.
 * @param {Object} data.returnValue The value returned by the command execution.
 */

/**
 * Event fired when a custom configuration file is loaded, before the final
 * configuration initialization.
 *
 * Custom configuration files can be loaded thorugh the
 * {@link CKEDITOR.config#customConfig} setting. Several files can be loaded
 * by changing this setting.
 *
 * @event customConfigLoaded
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired once the editor configuration is ready (loaded and processed).
 *
 * @event configLoaded
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when this editor instance is destroyed. The editor at this
 * point is not usable and this event should be used to perform the clean-up
 * in any plugin.
 *
 * @event destroy
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when the {@link #method-destroy} method is called,
 * but before destroying the editor.
 *
 * @event beforeDestroy
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Internal event to get the current data.
 *
 * @event beforeGetData
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Internal event to perform the {@link #method-getSnapshot} call.
 *
 * @event getSnapshot
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Internal event to perform the {@link #method-loadSnapshot} call.
 *
 * @event loadSnapshot
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data The data that will be used.
 */

/**
 * Event fired before the {@link #method-getData} call returns, allowing for additional manipulation.
 *
 * @event getData
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.dataValue The data that will be returned.
 */

/**
 * Event fired before the {@link #method-setData} call is executed, allowing for additional manipulation.
 *
 * @event setData
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.dataValue The data that will be used.
 */

/**
 * Event fired at the end of the {@link #method-setData} call execution. Usually it is better to use the
 * {@link #dataReady} event.
 *
 * @event afterSetData
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.dataValue The data that has been set.
 */

/**
 * Event fired as an indicator of the editor data loading. It may be the result of
 * calling {@link #method-setData} explicitly or an internal
 * editor function, like the editor editing mode switching (move to Source and back).
 *
 * @event dataReady
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when the CKEDITOR instance is completely created, fully initialized
 * and ready for interaction.
 *
 * @event instanceReady
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when editor components (configuration, languages and plugins) are fully
 * loaded and initialized. However, the editor will be fully ready to for interaction
 * on {@link #instanceReady}.
 *
 * @event loaded
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired by the {@link #method-insertHtml} method. See the method documentation for more information
 * about how this event can be used.
 *
 * @event insertHtml
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.mode The mode in which the data is inserted (see {@link #method-insertHtml}).
 * @param {String} data.dataValue The HTML code to insert.
 * @param {CKEDITOR.dom.range} [data.range] See {@link #method-insertHtml}'s `range` parameter.
 */

/**
 * Event fired by the {@link #method-insertText} method. See the method documentation for more information
 * about how this event can be used.
 *
 * @event insertText
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {String} data The text to insert.
 */

/**
 * Event fired by the {@link #method-insertElement} method. See the method documentation for more information
 * about how this event can be used.
 *
 * @event insertElement
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {CKEDITOR.dom.element} data The element to insert.
 */

/**
 * Event fired after data insertion using the {@link #method-insertHtml}, {@link CKEDITOR.editable#insertHtml},
 * or {@link CKEDITOR.editable#insertHtmlIntoRange} methods.
 *
 * @since 4.5.0
 * @event afterInsertHtml
 * @param data
 * @param {CKEDITOR.dom.range} [data.intoRange] If set, the HTML was not inserted into the current selection, but into
 * the specified range. This property is set if the {@link CKEDITOR.editable#insertHtmlIntoRange} method was used,
 * but not if for the {@link CKEDITOR.editable#insertHtml} method.
 */

/**
 * Event fired after the {@link #property-readOnly} property changes.
 *
 * @since 3.6.0
 * @event readOnly
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when a UI template is added to the editor instance. It makes
 * it possible to bring customizations to the template source.
 *
 * @event template
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.name The template name.
 * @param {String} data.source The source data for this template.
 */

/**
 * Event fired when the editor content (its DOM structure) is ready.
 * It is similar to the native `DOMContentLoaded` event, but it applies to
 * the editor content. It is also the first event fired after
 * the {@link CKEDITOR.editable} is initialized.
 *
 * This event is particularly important for classic (`iframe`-based)
 * editor, because on editor initialization and every time the data are set
 * (by {@link CKEDITOR.editor#method-setData}) content DOM structure
 * is rebuilt. Thus, e.g. you need to attach DOM event listeners
 * on editable one more time.
 *
 * For inline editor this event is fired only once &mdash; when the
 * editor is initialized for the first time. This is because setting
 * editor content does not cause editable destruction and creation.
 *
 * The {@link #contentDom} event goes along with {@link #contentDomUnload}
 * which is fired before the content DOM structure is destroyed. This is the
 * right moment to detach content DOM event listener. Otherwise
 * browsers like IE or Opera may throw exceptions when accessing
 * elements from the detached document.
 *
 * **Note:** {@link CKEDITOR.editable#attachListener} is a convenient
 * way to attach listeners that will be detached on {@link #contentDomUnload}.
 *
 *		editor.on( 'contentDom', function() {
 *			var editable = editor.editable();
 *
 *			editable.attachListener( editable, 'click', function() {
 *				console.log( 'The editable was clicked.' );
 *			});
 *		});
 *
 * @event contentDom
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired before the content DOM structure is destroyed.
 * See {@link #contentDom} documentation for more details.
 *
 * @event contentDomUnload
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Event fired when the content DOM changes and some of the references as well as
 * the native DOM event listeners could be lost.
 * This event is useful when it is important to keep track of references
 * to elements in the editable content from code.
 *
 * @since 4.3.0
 * @event contentDomInvalidated
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * If set to `true`, editor will be only created when its root element is attached to DOM.
 * In case the element is detached, the editor will wait for the element to be attached and initialized then.
 *
 * For more control over the entire process refer to {@link CKEDITOR.config#delayIfDetached_callback}
 * and {@link CKEDITOR.config#delayIfDetached_interval} configuration options.
 *
 *		config.delayIfDetached = true;
 *
 * @since 4.17.0
 * @cfg {Boolean} [delayIfDetached=false]
 * @member CKEDITOR.config
 */
CKEDITOR.config.delayIfDetached = false;

/**
 * Function used to initialize delayed editor creation.
 *
 * It accepts a single `callback` argument. A `callback` argument is another function that triggers editor creation.
 * This allows to store the editor creation function (`callback`) and invoke it whenever necessary instead of periodically
 * check if element is attached to DOM to improve performance.
 *
 * Used only if {@link CKEDITOR.config#delayIfDetached} is set to `true`.
 *
 * **Note**: This function (`callback`) should be called only if editor target element is reattached to DOM.
 *
 * If this option is defined, editor will not run the default {@link CKEDITOR.config#delayIfDetached_interval interval checks}.
 *
 *		// Store the reference to the editor creation function.
 *		var resumeEditorCreation;
 *
 *		config.delayIfDetached_callback = function( createEditor ) {
 *			resumeEditorCreation = createEditor;
 *		};
 *
 *		// Create editor calling `resumeEditorCreation()` whenever you choose (e.g. on button click).
 *		resumeEditorCreation();
 *
 * @since 4.17.0
 * @cfg {Function} [delayIfDetached_callback = undefined]
 * @member CKEDITOR.config
 */
CKEDITOR.config.delayIfDetached_callback = undefined;

/**
 * The amount of time (in milliseconds) between consecutive checks whether editor's target element is attached to DOM.
 *
 * Used only if {@link CKEDITOR.config#delayIfDetached} is set to `true` and
 * {@link CKEDITOR.config#delayIfDetached_callback delayIfDetached_callback} not set.
 *
 *		config.delayIfDetached_interval = 2000; // Try to create editor every 2 seconds.
 *
 * @since 4.17.0
 * @cfg {Number} [delayIfDetached_interval=50]
 * @member CKEDITOR.config
 */
CKEDITOR.config.delayIfDetached_interval = 50;
