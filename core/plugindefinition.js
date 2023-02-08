/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.pluginDefinition} class which
 *		contains the defintion of a plugin. This file serves documentation
 *		purposes only.
 */

/**
 * A virtual class that just illustrates the features of plugin objects which are
 * passed to the {@link CKEDITOR.plugins#add} method.
 *
 * This class is not really a part of the API, so its constructor should not be called.
 *
 * See also:
 *
 * * {@glink guide/plugin_sdk_intro The Plugin SDK}
 * * {@glink guide/plugin_sdk_sample Creating a CKEditor plugin in 20 Lines of Code}
 * * {@glink guide/plugin_sdk_sample_1 Creating a Simple Plugin Tutorial}
 *
 * @class CKEDITOR.pluginDefinition
 * @abstract
 */

/**
 * A list of plugins that are required by this plugin. Note that this property
 * does not determine the loading order of the plugins.
 *
 *		CKEDITOR.plugins.add( 'sample', {
 *			requires: 'button,selection'
 *		} );
 *
 * Or:
 *
 *		CKEDITOR.plugins.add( 'sample', {
 *			requires: [ 'button', 'selection' ]
 *		} );
 *
 * @property {String/String[]} requires
 */

/**
 * The list of language files available for this plugin. These files are stored inside
 * the `lang` directory in the plugin directory, follow the name
 * pattern of `langCode.js`, and contain the language definition created with
 * {@link CKEDITOR.plugins#setLang}.
 *
 * When the plugin is being loaded, the editor checks this list to see if
 * a language file in the current editor language ({@link CKEDITOR.editor#langCode})
 * is available, and if so, loads it. Otherwise, the file represented by the first item
 * in the list is loaded.
 *
 *		CKEDITOR.plugins.add( 'sample', {
 *			lang: 'en,fr'
 *		} );
 *
 * Or:
 *
 *		CKEDITOR.plugins.add( 'sample', {
 *			lang: [ 'en', 'fr' ]
 *		} );
 *
 * @property {String/String[]} lang
 */

/**
 * A function called when the plugin definition is loaded for the first time.
 * It is usually used to execute some code once for the entire page,
 * for instance code that uses the {@link CKEDITOR}'s methods such as the {@link CKEDITOR#addCss} method.
 *
 *		CKEDITOR.plugins.add( 'sample', {
 *			onLoad: function() {
 *				CKEDITOR.addCss( '.cke_some_class { ... }' );
 *			}
 *		} );
 *
 * Read more about the initialization order in the {@link #init} method documentation.
 *
 * @method onLoad
 */

/**
 * A function called on initialization of every editor instance created on the
 * page before the {@link #init} call task. This feature makes it possible to
 * initialize things that could be used in the `init` function of other plugins.
 *
 *		CKEDITOR.plugins.add( 'sample1', {
 *			beforeInit: function( editor ) {
 *				editor.foo = 'bar';
 *			}
 *		} );
 *
 *		CKEDITOR.plugins.add( 'sample2', {
 *			init: function( editor ) {
 *				// This will work regardless of order in which
 *				// plugins sample1 and sample2 where initialized.
 *				console.log( editor.foo ); // 'bar'
 *			}
 *		} );
 *
 * Read more about the initialization order in the {@link #init} method documentation.
 *
 * @method beforeInit
 * @param {CKEDITOR.editor} editor The editor instance being initialized.
 */

/**
 * A function called on initialization of every editor instance created on the page.
 *
 *		CKEDITOR.plugins.add( 'sample', {
 *			init: function( editor ) {
 *				console.log( 'Editor "' + editor.name + '" is being initialized!' );
 *			}
 *		} );
 *
 * Initialization order:
 *
 * 1. The {@link #beforeInit} methods of all enabled plugins are executed.
 * 2. The {@link #init} methods of all enabled plugins are executed.
 * 3. The {@link #afterInit} methods of all enabled plugins are executed.
 * 4. The {@link CKEDITOR.editor#pluginsLoaded} event is fired.
 *
 * **Note:** The order in which the `init` methods are called does not depend on the plugins' {@link #requires requirements}
 * or the order set in the {@link CKEDITOR.config#plugins} option. It may be random and therefore it is
 * recommended to use the {@link #beforeInit} and {@link #afterInit} methods in order to ensure
 * the right execution sequence.
 *
 * See also the {@link #onLoad} method.
 *
 * @method init
 * @param {CKEDITOR.editor} editor The editor instance being initialized.
 */

/**
 * A function called on initialization of every editor instance created on the
 * page after the {@link #init} call task. This feature makes it possible to use things
 * that were initialized in the `init` function of other plugins.
 *
 *		CKEDITOR.plugins.add( 'sample1', {
 *			afterInit: function( editor ) {
 *				// This will work regardless of order in which
 *				// plugins sample1 and sample2 where initialized.
 *				console.log( editor.foo ); // 'bar'
 *			}
 *		} );
 *
 *		CKEDITOR.plugins.add( 'sample2', {
 *			init: function( editor ) {
 *				editor.foo = 'bar';
 *			}
 *		} );
 *
 * Read more about the initialization order in the {@link #init} method documentation.
 *
 * @method afterInit
 * @param {CKEDITOR.editor} editor The editor instance being initialized.
 */

/**
 * Announces the plugin as HiDPI-ready (optimized for high pixel density screens, e.g. *Retina*)
 * by providing high-resolution icons and images. HiDPI icons must be twice as big
 * (defaults are `16px x 16px`) and stored under `plugin_name/icons/hidpi/` directory.
 *
 * The common place for additional HiDPI images used by the plugin (**but not icons**)
 * is the `plugin_name/images/hidpi/` directory.
 *
 * This property is optional and only makes sense if `32px x 32px` icons
 * and high-resolution images actually exist. If this flag is set to `true`, the editor
 * will automatically detect the HiDPI environment and attempt to load the
 * high-resolution resources.
 *
 * @since 4.2.0
 * @property {Boolean} hidpi
 */

/**
 * The list of icon files registered by this plugin. These files are stored inside
 * the `icons` directory in the plugin directory and follow the name
 * pattern of `name.png`.
 *
 * ```javascript
 *	CKEDITOR.plugins.add( 'sample', {
 *		icons: 'first,second'
 *	} );
 * ```
 *
 * @property {String} [icons]
 */

/**
 * A function that should be implemented if a plugin is not supported in every
 * available environment according to
 * [Browser Compatibility](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_browsers.html)
 * or a specific editor configuration.
 *
 * This function will not be called by the plugin loader itself and it is not required for a proper
 * plugin initialization. However, it is recommended to implement the function if a plugin
 * has environment requirements. This information may be important for related features
 * and the testing environment.
 *
 * ```javascript
 * CKEDITOR.plugins.add( 'sample', {
 *		isSupportedEnvironment: function( editor ) {
 *			// A plugin supported only in modern browsers.
 *			return !CKEDITOR.env.ie || CKEDITOR.env.edge;
 *		}
 * } );
 * ```
 *
 * @since 4.12.0
 * @method isSupportedEnvironment
 * @param {CKEDITOR.editor} editor
 * @returns {Boolean} Information whether the plugin is supported in the current environment.
 */
