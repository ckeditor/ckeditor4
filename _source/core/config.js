/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.config} object, which holds the
 * default configuration settings.
 */

/**
 * Holds the default configuration settings. Changes to this object are
 * reflected in all editor instances, if not specificaly specified for those
 * instances.
 * @namespace
 * @example
 * // All editor created after the following setting will not load custom
 * // configuration files.
 * CKEDITOR.config.customConfig = '';
 */
CKEDITOR.config = {
	/**
	 * The URL path for the custom configuration file to be loaded. If not
	 * overloaded with inline configurations, it defaults to the "config.js"
	 * file present in the root of the CKEditor installation directory.<br /><br />
	 *
	 * CKEditor will recursively load custom configuration files defined inside
	 * other custom configuration files.
	 * @type String
	 * @default '&lt;CKEditor folder&gt;/config.js'
	 * @example
	 * // Load a specific configuration file.
	 * CKEDITOR.replace( 'myfiled', { customConfig : '/myconfig.js' } );
	 * @example
	 * // Do not load any custom configuration file.
	 * CKEDITOR.replace( 'myfiled', { customConfig : '' } );
	 */
	customConfig: CKEDITOR.getUrl( 'config.js' ),

	autoUpdateElement: true,

	/**
	 * The base href URL used to resolve relative and absolute URLs in the
	 * editor content.
	 * @type String
	 * @default '' (empty string)
	 * @example
	 * config.baseHref = 'http://www.example.com/path/';
	 */
	baseHref: '',

	/**
	 * The CSS file to be used to apply style to the contents. It should
	 * reflect the CSS used in the final pages where the contents are to be
	 * used.
	 * @type String
	 * @default '&lt;CKEditor folder&gt;/contents.css'
	 * @example
	 * config.contentsCss = '/css/mysitestyles.css';
	 */
	contentsCss: CKEDITOR.basePath + 'contents.css',

	/**
	 * The writting direction of the language used to write the editor
	 * contents. Allowed values are 'ltr' for Left-To-Right language (like
	 * English), or 'rtl' for Right-To-Left languages (like Arabic).
	 * @default 'ltr'
	 * @type String
	 * @example
	 * config.contentsLangDirection = 'rtl';
	 */
	contentsLangDirection: 'ltr',

	/**
	 * Instructs the editor to automatically localize the editor to the user
	 * language, if possible. If set to false, the [@link #defaultLanguage]
	 * language is used.
	 * @default true
	 * @type Boolean
	 * @example
	 * // Forces the editor to always load the German interface.
	 * config.autoLanguage = false;
	 * config.defaultLanguage = 'de';
	 */
	autoLanguage: true,

	/**
	 * The language to be used if [@link #autoLanguage] is set to false, or
	 * when it's not possible to localize the editor to the user language.
	 * @default 'en'
	 * @type String
	 * @example
	 * config.defaultLanguage = 'it';
	 */
	defaultLanguage: 'en',

	enterMode: 'p',
	shiftEnterMode: 'br',

	/**
	 * A comma separated list of plugins that are not related to editor
	 * instances. Reserved to plugins that extend the core code only.<br /><br />
	 *
	 * There are no ways to override this setting, except by editing the source
	 * code of CKEditor (_source/core/config.js).
	 * @type String
	 * @example
	 */
	corePlugins: '',

	/**
	 * Sets the doctype to be used when loading the editor content as HTML.
	 * @type String
	 * @default '&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;'
	 * @example
	 * // Set the doctype to the HTML 4 (quirks) mode.
	 * config.docType = '&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"&gt;';
	 */
	docType: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',

	/**
	 * Indicates whether the contents to be edited are being inputted as a full
	 * HTML page. A full page includes the &lt;html&gt;, &lt;head&gt; and
	 * &lt;body&gt; tags. The final output will also reflect this setting,
	 * including the &lt;body&gt; contents only if this setting is disabled.
	 * @type Boolean
	 * @default false
	 * @example
	 * config.fullPage = true;
	 */
	fullPage: false,

	/**
	 * The editor height, in CSS size format or pixel integer.
	 * @type String|Number
	 * @default '200'
	 * @example
	 */
	height: 200,

	/**
	 * Comma separated list of plugins to load and initialize for an editor
	 * instance.
	 * @type String
	 * @default 'editingblock,elementspath,sourcearea,toolbar,wysiwygarea'
	 * @example
	 * config.plugins = 'elementspath,toolbar,wysiwygarea';
	 */
	plugins: 'basicstyles,button,dialog,elementspath,horizontalrule,htmldataprocessor,keystrokes,removeformat,smiley,link,sourcearea,tab,toolbar,wysiwygarea,forms,image,find,table,specialchar,flash,print,pagebreak,newpage',

	/**
	 * The theme to be used to build the UI.
	 * @type String
	 * @default 'default'
	 * @see CKEDITOR.config.skin
	 * @example
	 * config.theme = 'default';
	 */
	theme: 'default',

	/**
	 * The skin to load.
	 * @type String
	 * @default 'default'
	 * @example
	 * config.skin = 'v2';
	 */
	skin: 'default',

	/**
	 * The editor width in CSS size format or pixel integer.
	 * @type String|Number
	 * @default '100%'
	 * @example
	 */
	width: '100%',

	/**
	 * The base Z-index for floating dialogs and popups.
	 * @type Number
	 * @default 10000
	 * @example
	 * config.baseFloatZIndex = 2000
	 */
	baseFloatZIndex: 10000

};

// PACKAGER_RENAME( CKEDITOR.config )
