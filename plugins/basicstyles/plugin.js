/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'basicstyles', {
	lang: [ 'af', 'ar', 'bg', 'bn', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en-au', 'en-ca', 'en-gb', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fo', 'fr-ca', 'fr', 'gl', 'gu', 'he', 'hi', 'hr', 'hu', 'is', 'it', 'ja', 'ka', 'km', 'ko', 'lt', 'lv', 'mk', 'mn', 'ms', 'nb', 'nl', 'no', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr-latn', 'sr', 'sv', 'th', 'tr', 'ug', 'uk', 'vi', 'zh-cn', 'zh' ],
	icons: 'bold,italic,underline,strike,subscript,superscript', // %REMOVE_LINE_CORE%
	init: function( editor ) {
		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, buttonLabel, commandName, styleDefiniton ) {
				var style = new CKEDITOR.style( styleDefiniton );

				// Listen to contextual style activation.
				editor.attachStyleStateChange( style, function( state ) {
					!editor.readOnly && editor.getCommand( commandName ).setState( state );
				});

				// Create the command that can be used to apply the style.
				editor.addCommand( commandName, new CKEDITOR.styleCommand( style ) );

				// Register the button, if the button plugin is loaded.
				if ( editor.ui.addButton ) {
					editor.ui.addButton( buttonName, {
						label: buttonLabel,
						command: commandName
					});
				}
			};

		var config = editor.config,
			lang = editor.lang.basicstyles;

		addButtonCommand( 'Bold', lang.bold, 'bold', config.coreStyles_bold );
		addButtonCommand( 'Italic', lang.italic, 'italic', config.coreStyles_italic );
		addButtonCommand( 'Underline', lang.underline, 'underline', config.coreStyles_underline );
		addButtonCommand( 'Strike', lang.strike, 'strike', config.coreStyles_strike );
		addButtonCommand( 'Subscript', lang.subscript, 'subscript', config.coreStyles_subscript );
		addButtonCommand( 'Superscript', lang.superscript, 'superscript', config.coreStyles_superscript );

		editor.setKeystroke( [
			[ CKEDITOR.CTRL + 66 /*B*/, 'bold' ],
			[ CKEDITOR.CTRL + 73 /*I*/, 'italic' ],
			[ CKEDITOR.CTRL + 85 /*U*/, 'underline' ]
			] );
	}
});

// Basic Inline Styles.
/**
 * The style definition that applies the <strong>bold</strong> style to the text.
 * @type Object
 * @default <code>{ element : 'strong', overrides : 'b' }</code>
 * @example
 * config.coreStyles_bold = { element : 'b', overrides : 'strong' };
 * @example
 * config.coreStyles_bold =
 *     {
 *         element : 'span',
 *         attributes : { 'class' : 'Bold' }
 *     };
 */
CKEDITOR.config.coreStyles_bold = { element: 'strong', overrides: 'b' };

/**
 * The style definition that applies the <em>italics</em> style to the text.
 * @type Object
 * @default <code>{ element : 'em', overrides : 'i' }</code>
 * @example
 * config.coreStyles_italic = { element : 'i', overrides : 'em' };
 * @example
 * CKEDITOR.config.coreStyles_italic =
 *     {
 *         element : 'span',
 *         attributes : { 'class' : 'Italic' }
 *     };
 */
CKEDITOR.config.coreStyles_italic = { element: 'em', overrides: 'i' };

/**
 * The style definition that applies the <u>underline</u> style to the text.
 * @type Object
 * @default <code>{ element : 'u' }</code>
 * @example
 * CKEDITOR.config.coreStyles_underline =
 *     {
 *         element : 'span',
 *         attributes : { 'class' : 'Underline' }
 *     };
 */
CKEDITOR.config.coreStyles_underline = { element: 'u' };

/**
 * The style definition that applies the <strike>strike-through</strike> style to the text.
 * @type Object
 * @default <code>{ element : 'strike' }</code>
 * @example
 * CKEDITOR.config.coreStyles_strike =
 *     {
 *         element : 'span',
 *         attributes : { 'class' : 'StrikeThrough' },
 *         overrides : 'strike'
 *     };
 */
CKEDITOR.config.coreStyles_strike = { element: 'strike' };

/**
 * The style definition that applies the subscript style to the text.
 * @type Object
 * @default <code>{ element : 'sub' }</code>
 * @example
 * CKEDITOR.config.coreStyles_subscript =
 *     {
 *         element : 'span',
 *         attributes : { 'class' : 'Subscript' },
 *         overrides : 'sub'
 *     };
 */
CKEDITOR.config.coreStyles_subscript = { element: 'sub' };

/**
 * The style definition that applies the superscript style to the text.
 * @type Object
 * @default <code>{ element : 'sup' }</code>
 * @example
 * CKEDITOR.config.coreStyles_superscript =
 *     {
 *         element : 'span',
 *         attributes : { 'class' : 'Superscript' },
 *         overrides : 'sup'
 *     };
 */
CKEDITOR.config.coreStyles_superscript = { element: 'sup' };
