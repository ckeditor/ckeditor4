/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.config} object that stores the
 * default configuration settings.
 */

/**
 * Used in conjunction with the {@link CKEDITOR.config#enterMode}
 * and {@link CKEDITOR.config#shiftEnterMode} configuration
 * settings to make the editor produce `<p>` tags when
 * using the <kbd>Enter</kbd> key.
 *
 * Read more in the [documentation](#!/guide/dev_enterkey) and see the
 * [SDK sample](http://sdk.ckeditor.com/samples/enterkey.html).
 *
 * @readonly
 * @property {Number} [=1]
 * @member CKEDITOR
 */
CKEDITOR.ENTER_P = 1;

/**
 * Used in conjunction with the {@link CKEDITOR.config#enterMode}
 * and {@link CKEDITOR.config#shiftEnterMode} configuration
 * settings to make the editor produce `<br>` tags when
 * using the <kbd>Enter</kbd> key.
 *
 * Read more in the [documentation](#!/guide/dev_enterkey) and see the
 * [SDK sample](http://sdk.ckeditor.com/samples/enterkey.html).
 *
 * @readonly
 * @property {Number} [=2]
 * @member CKEDITOR
 */
CKEDITOR.ENTER_BR = 2;

/**
 * Used in conjunction with the {@link CKEDITOR.config#enterMode}
 * and {@link CKEDITOR.config#shiftEnterMode} configuration
 * settings to make the editor produce `<div>` tags when
 * using the <kbd>Enter</kbd> key.
 *
 * Read more in the [documentation](#!/guide/dev_enterkey) and see the
 * [SDK sample](http://sdk.ckeditor.com/samples/enterkey.html).
 *
 * @readonly
 * @property {Number} [=3]
 * @member CKEDITOR
 */
CKEDITOR.ENTER_DIV = 3;

/**
 * Stores default configuration settings. Changes to this object are
 * reflected in all editor instances, if not specified otherwise for a particular
 * instance.
 *
 * Read more about setting CKEditor configuration in the
 * [documentation](#!/guide/dev_configuration).
 *
 * @class
 * @singleton
 */
CKEDITOR.config = {
	/**
	 * The URL path to the custom configuration file to be loaded. If not
	 * overwritten with inline configuration, it defaults to the `config.js`
	 * file present in the root of the CKEditor installation directory.
	 *
	 * CKEditor will recursively load custom configuration files defined inside
	 * other custom configuration files.
	 *
	 * Read more about setting CKEditor configuration in the
	 * [documentation](#!/guide/dev_configuration).
	 *
	 *		// Load a specific configuration file.
	 *		CKEDITOR.replace( 'myfield', { customConfig: '/myconfig.js' } );
	 *
	 *		// Do not load any custom configuration file.
	 *		CKEDITOR.replace( 'myfield', { customConfig: '' } );
	 *
	 * @cfg {String} [="<CKEditor folder>/config.js"]
	 */
	customConfig: 'config.js',

	/**
	 * Whether the element replaced by the editor (usually a `<textarea>`)
	 * is to be updated automatically when posting the form containing the editor.
	 *
	 * @cfg
	 */
	autoUpdateElement: true,

	/**
	 * The user interface language localization to use. If left empty, the editor
	 * will automatically be localized to the user language. If the user language is not supported,
	 * the language specified in the {@link CKEDITOR.config#defaultLanguage}
	 * configuration setting is used.
	 *
	 * Read more in the [documentation](#!/guide/dev_uilanguage) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/uilanguages.html).
	 *
	 *		// Load the German interface.
	 *		config.language = 'de';
	 *
	 * @cfg
	 */
	language: '',

	/**
	 * The language to be used if the {@link CKEDITOR.config#language}
	 * setting is left empty and it is not possible to localize the editor to the user language.
	 *
	 * Read more in the [documentation](#!/guide/dev_uilanguage) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/uilanguages.html).
	 *
	 *		config.defaultLanguage = 'it';
	 *
	 * @cfg
	 */
	defaultLanguage: 'en',

	/**
	 * The writing direction of the language which is used to create editor content.
	 * Allowed values are:
	 *
	 * * `''` (an empty string) &ndash; Indicates that content direction will be the same as either
	 *      the editor UI direction or the page element direction depending on the editor type:
	 *     * [Classic editor](#!/guide/dev_framed) &ndash; The same as the user interface language direction.
	 *     * [Inline editor](#!/guide/dev_inline)&ndash; The same as the editable element text direction.
	 * * `'ltr'` &ndash; Indicates a Left-To-Right text direction (like in English).
	 * * `'rtl'` &ndash; Indicates a Right-To-Left text direction (like in Arabic).
	 *
	 * See the [SDK sample](http://sdk.ckeditor.com/samples/language.html).
	 *
	 * Example:
	 *
	 *		config.contentsLangDirection = 'rtl';
	 *
	 * @cfg
	 */
	contentsLangDirection: '',

	/**
	 * Sets the behavior of the <kbd>Enter</kbd> key. It also determines other behavior
	 * rules of the editor, like whether the `<br>` element is to be used
	 * as a paragraph separator when indenting text.
	 * The allowed values are the following constants that cause the behavior outlined below:
	 *
	 * * {@link CKEDITOR#ENTER_P} (1) &ndash; New `<p>` paragraphs are created.
	 * * {@link CKEDITOR#ENTER_BR} (2) &ndash; Lines are broken with `<br>` elements.
	 * * {@link CKEDITOR#ENTER_DIV} (3) &ndash; New `<div>` blocks are created.
	 *
	 * **Note**: It is recommended to use the {@link CKEDITOR#ENTER_P} setting because of
	 * its semantic value and correctness. The editor is optimized for this setting.
	 *
	 * Read more in the [documentation](#!/guide/dev_enterkey) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/enterkey.html).
	 *
	 *		// Not recommended.
	 *		config.enterMode = CKEDITOR.ENTER_BR;
	 *
	 * @cfg {Number} [=CKEDITOR.ENTER_P]
	 */
	enterMode: CKEDITOR.ENTER_P,

	/**
	 * Forces the use of {@link CKEDITOR.config#enterMode} as line break regardless
	 * of the context. If, for example, {@link CKEDITOR.config#enterMode} is set
	 * to {@link CKEDITOR#ENTER_P}, pressing the <kbd>Enter</kbd> key inside a
	 * `<div>` element will create a new paragraph with a `<p>`
	 * instead of a `<div>`.
	 *
	 * Read more in the [documentation](#!/guide/dev_enterkey) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/enterkey.html).
	 *
	 *		// Not recommended.
	 *		config.forceEnterMode = true;
	 *
	 * @since 3.2.1
	 * @cfg
	 */
	forceEnterMode: false,

	/**
	 * Similarly to the {@link CKEDITOR.config#enterMode} setting, it defines the behavior
	 * of the <kbd>Shift+Enter</kbd> key combination.
	 *
	 * The allowed values are the following constants that cause the behavior outlined below:
	 *
	 * * {@link CKEDITOR#ENTER_P} (1) &ndash; New `<p>` paragraphs are created.
	 * * {@link CKEDITOR#ENTER_BR} (2) &ndash; Lines are broken with `<br>` elements.
	 * * {@link CKEDITOR#ENTER_DIV} (3) &ndash; New `<div>` blocks are created.
	 *
	 * Read more in the [documentation](#!/guide/dev_enterkey) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/enterkey.html).
	 *
	 * Example:
	 *
	 *		config.shiftEnterMode = CKEDITOR.ENTER_P;
	 *
	 * @cfg {Number} [=CKEDITOR.ENTER_BR]
	 */
	shiftEnterMode: CKEDITOR.ENTER_BR,

	/**
	 * Sets the `DOCTYPE` to be used when loading the editor content as HTML.
	 *
	 *		// Set the DOCTYPE to the HTML 4 (Quirks) mode.
	 *		config.docType = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">';
	 *
	 * @cfg
	 */
	docType: '<!DOCTYPE html>',

	/**
	 * Sets the `id` attribute to be used on the `body` element
	 * of the editing area. This can be useful when you intend to reuse the original CSS
	 * file you are using on your live website and want to assign the editor the same ID
	 * as the section that will include the contents. In this way ID-specific CSS rules will
	 * be enabled.
	 *
	 *		config.bodyId = 'contents_id';
	 *
	 * @since 3.1
	 * @cfg
	 */
	bodyId: '',

	/**
	 * Sets the `class` attribute to be used on the `body` element
	 * of the editing area. This can be useful when you intend to reuse the original CSS
	 * file you are using on your live website and want to assign the editor the same class
	 * as the section that will include the contents. In this way class-specific CSS rules will
	 * be enabled.
	 *
	 *		config.bodyClass = 'contents';
	 *
	 * **Note:** The editor needs to load stylesheets containing contents styles. You can either
	 * copy them to the `contents.css` file that the editor loads by default or set the {@link #contentsCss}
	 * option.
	 *
	 * **Note:** This setting only applies to [classic editor](#!/guide/dev_framed) (the one that uses `iframe`).
	 *
	 * @since 3.1
	 * @cfg
	 */
	bodyClass: '',

	/**
	 * Indicates whether the content to be edited is being input as a full HTML page.
	 * A full page includes the `<html>`, `<head>`, and `<body>` elements.
	 * The final output will also reflect this setting, including the
	 * `<body>` content only if this setting is disabled.
	 *
	 * Read more in the [documentation](#!/guide/dev_fullpage) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/fullpage.html).
	 *
	 *		config.fullPage = true;
	 *
	 * @since 3.1
	 * @cfg
	 */
	fullPage: false,

	/**
	 * The height of the editing area that includes the editor content. This configuration
	 * option accepts an integer (to denote a value in pixels) or any CSS-defined length unit
	 * except percent (`%`) values which are not supported.
	 *
	 * **Note:** This configuration option is ignored by [inline editor](#!/guide/dev_inline).
	 *
	 * Read more in the [documentation](#!/guide/dev_size) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/size.html).
	 *
	 *		config.height = 500;		// 500 pixels.
	 *		config.height = '25em';		// CSS length.
	 *		config.height = '300px';	// CSS length.
	 *
	 * @cfg {Number/String}
	 */
	height: 200,

	/**
	 * The CSS file(s) to be used to apply style to editor content. It should
	 * reflect the CSS used in the target pages where the content is to be
	 * displayed.
	 *
	 * **Note:** This configuration value is ignored by [inline editor](#!/guide/dev_inline)
	 * as it uses the styles that come directly from the page that CKEditor is
	 * rendered on. It is also ignored in the {@link #fullPage full page mode} in
	 * which the developer has full control over the page HTML code.
	 *
	 * Read more in the [documentation](#!/guide/dev_styles) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/styles.html).
	 *
	 *		config.contentsCss = '/css/mysitestyles.css';
	 *		config.contentsCss = [ '/css/mysitestyles.css', '/css/anotherfile.css' ];
	 *
	 * @cfg {String/Array} [contentsCss=CKEDITOR.getUrl( 'contents.css' )]
	 */
	contentsCss: CKEDITOR.getUrl( 'contents.css' ),

	/**
	 * Comma-separated list of plugins to be used in an editor instance. Note that
	 * the actual plugins that are to be loaded could still be affected by two other settings:
	 * {@link CKEDITOR.config#extraPlugins} and {@link CKEDITOR.config#removePlugins}.
	 *
	 * @cfg {String} [="<default list of plugins>"]
	 */
	plugins: '', // %REMOVE_LINE%

	/**
	 * A list of additional plugins to be loaded. This setting makes it easier
	 * to add new plugins without having to touch the {@link CKEDITOR.config#plugins} setting.
	 *
	 * **Note:** The most recommended way to
	 * [add CKEditor plugins](http://docs.ckeditor.com/#!/guide/dev_plugins) is through
	 * [CKEditor Builder](https://ckeditor.com/builder). Read more in the
	 * [documentation](#!/guide/dev_plugins).
	 *
	 *		config.extraPlugins = 'myplugin,anotherplugin';
	 *
	 * @cfg
	 */
	extraPlugins: '',

	/**
	 * A list of plugins that must not be loaded. This setting makes it possible
	 * to avoid loading some plugins defined in the {@link CKEDITOR.config#plugins}
	 * setting without having to touch it.
	 *
	 * **Note:** A plugin required by another plugin cannot be removed and will cause
	 * an error to be thrown. So for example if `contextmenu` is required by `tabletools`,
	 * it can only be removed if `tabletools` is not loaded.
	 *
	 *		config.removePlugins = 'elementspath,save,font';
	 *
	 * @cfg
	 */
	removePlugins: '',

	/**
	 * A list of regular expressions to be executed on input HTML,
	 * indicating HTML source code that when matched, must **not** be available in the WYSIWYG
	 * mode for editing.
	 *
	 *		config.protectedSource.push( /<\?[\s\S]*?\?>/g );											// PHP code
	 *		config.protectedSource.push( /<%[\s\S]*?%>/g );												// ASP code
	 *		config.protectedSource.push( /(<asp:[^\>]+>[\s|\S]*?<\/asp:[^\>]+>)|(<asp:[^\>]+\/>)/gi );	// ASP.NET code
	 *
	 * @cfg
	 */
	protectedSource: [],

	/**
	 * The editor `tabindex` value.
	 *
	 * Read more in the [documentation](#!/guide/dev_tabindex) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/tabindex.html).
	 *
	 *		config.tabIndex = 1;
	 *
	 * @cfg
	 */
	tabIndex: 0,

	/**
	 * The editor UI outer width. This configuration option accepts an integer
	 * (to denote a value in pixels) or any CSS-defined length unit.
	 *
	 * Unlike the {@link CKEDITOR.config#height} setting, this
	 * one will set the outer width of the entire editor UI, not for the
	 * editing area only.
	 *
	 * **Note:** This configuration option is ignored by [inline editor](#!/guide/dev_inline).
	 *
	 * Read more in the [documentation](#!/guide/dev_size) and see the
	 * [SDK sample](http://sdk.ckeditor.com/samples/size.html).
	 *
	 *		config.width = 850;		// 850 pixels wide.
	 *		config.width = '75%';	// CSS unit.
	 *
	 * @cfg {String/Number}
	 */
	width: '',

	/**
	 * The base Z-index for floating dialog windows and popups.
	 *
	 *		config.baseFloatZIndex = 2000;
	 *
	 * @cfg
	 */
	baseFloatZIndex: 10000,

	/**
	 * The keystrokes that are blocked by default as the browser implementation
	 * is buggy. These default keystrokes are handled by the editor.
	 *
	 *		// Default setting.
	 *		config.blockedKeystrokes = [
	 *			CKEDITOR.CTRL + 66, // Ctrl+B
	 *			CKEDITOR.CTRL + 73, // Ctrl+I
	 *			CKEDITOR.CTRL + 85 // Ctrl+U
	 *		];
	 *
	 * @cfg {Array} [blockedKeystrokes=see example]
	 */
	blockedKeystrokes: [
		CKEDITOR.CTRL + 66, // Ctrl+B
		CKEDITOR.CTRL + 73, // Ctrl+I
		CKEDITOR.CTRL + 85 // Ctrl+U
	]
};

/**
 * Indicates that some of the editor features, like alignment and text
 * direction, should use the "computed value" of the feature to indicate its
 * on/off state instead of using the "real value".
 *
 * If enabled in a Left-To-Right written document, the "Left Justify"
 * alignment button will be shown as active, even if the alignment style is not
 * explicitly applied to the current paragraph in the editor.
 *
 *		config.useComputedState = false;
 *
 * @since 3.4
 * @cfg {Boolean} [useComputedState=true]
 */

/**
 * The base user interface color to be used by the editor. Not all skins are
 * [compatible with this setting](#!/guide/skin_sdk_chameleon).
 *
 * Read more in the [documentation](#!/guide/dev_uicolor) and see the
 * [SDK sample](http://sdk.ckeditor.com/samples/uicolor.html).
 *
 *		// Using a color code.
 *		config.uiColor = '#AADC6E';
 *
 *		// Using an HTML color name.
 *		config.uiColor = 'Gold';
 *
 * @cfg {String} uiColor
 */

// PACKAGER_RENAME( CKEDITOR.config )
