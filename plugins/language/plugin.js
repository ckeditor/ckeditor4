/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview [Language](http://ckeditor.com/addon/language) plugin.
 */

'use strict';

(function() {

	var allowedContent = 'span[!lang,!dir]',
		requiredContent = 'span[lang,dir]';

	CKEDITOR.plugins.add( 'language', {
		requires: 'menubutton',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'language', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		/**
		 * @param	{CKEDITOR.editor} editor
		 * @returns	{CKEDITOR.dom.element|null}	- first matching language indicator if any found, null otherwise
		 */
		getCurrentLangIndicator: function( editor ) {

			// IE8: upon initialization if there is no path elementPath() returns null
			if ( !editor.elementPath() )
				return null;

			var ret = null,
				activePath = editor.elementPath().elements,
				i = 0,
				pathMember;

			for ( ; i < activePath.length; i++ ) {
				pathMember = activePath[i];

				if ( !ret && pathMember.getName() == 'span' && pathMember.hasAttribute( 'dir' ) && pathMember.hasAttribute( 'lang' ) ) {
					ret = pathMember;
				}
			}

			return ret;
		},

		init: function( editor ) {
			var languagesConfigStrings = ( editor.config.language_list || [ 'ar:Arabic:rtl', 'fr:French', 'es:Spanish' ] ),
				plugin = this,
				lang = editor.lang.language,
				items = {},
				parts,
				curLanguageId, // 2-letter language identifier.
				i;

			// Registers command.
			editor.addCommand( 'language', {
				allowedContent: allowedContent,
				requiredContent: requiredContent,
				exec: function( editor, languageId ) {
					var item = items[ languageId ];

					if ( item )
						editor[ item.style.checkActive( editor.elementPath() ) ? 'removeStyle' : 'applyStyle' ]( item.style );
				}
			} );

			// Parse languagesConfigStrings, and create items entry for each lang.
			for ( i = 0; i < languagesConfigStrings.length; i++ ) {
				parts = languagesConfigStrings[ i ].split( ':' );
				curLanguageId = parts[ 0 ];

				items[ curLanguageId ] = {
					label: parts[ 1 ],
					langId: curLanguageId,
					group: 'language',
					order: i,
					// Tells if this language is left-to-right oriented (default: true).
					ltr: ( '' + parts[ 2 ] ).toLowerCase() != 'rtl',
					// Style property will be assigned after object initialization.
					style: null,
					onClick: function() {
						editor.execCommand( 'language', this.langId );
					}
				};

				// Init style property.
				items[ curLanguageId ].style = new CKEDITOR.style( {
					element: 'span',
					attributes: {
						lang: curLanguageId,
						dir: items[ curLanguageId ].ltr ? 'ltr' : 'rtl'
					}
				} );
			}

			// Remove language indicator button.
			items['lang-remove'] = {
				label: lang.remove,
				group: 'language',
				state: CKEDITOR.TRISTATE_DISABLED,
				order: items.length,
				ltr: null,
				style: null,
				onClick: function() {
					var currentLanguagedElement = plugin.getCurrentLangIndicator( editor );

					if ( currentLanguagedElement )
						editor.execCommand( 'language', currentLanguagedElement.getAttribute( 'lang' ) );
				}
			};

			// Initialize group/button.
			editor.addMenuGroup( 'language', 1 );
			editor.addMenuItems( items );

			editor.ui.add( 'language', CKEDITOR.UI_MENUBUTTON, {
				label: lang.button,
				// MenuButtons do not (yet) has toFeature method, so we cannot do this:
				// toFeature: function( editor ) { return editor.getCommand( 'language' ); }
				// Set feature's properties directly on button.
				allowedContent: allowedContent,
				requiredContent: requiredContent,
				toolbar: 'bidi,30',
				modes: { wysiwyg: 1 },
				className: 'cke_button_language',
				onMenu: function() {
					var activeItems = {},
						currentLanguagedElement = plugin.getCurrentLangIndicator( editor );

					for ( var prop in items )
						activeItems[ prop ] = CKEDITOR.TRISTATE_OFF;

					activeItems['lang-remove'] = currentLanguagedElement ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;

					if ( currentLanguagedElement )
						activeItems[ currentLanguagedElement.getAttribute('lang') ] = CKEDITOR.TRISTATE_ON;

					return activeItems;
				}
			} );

			editor.on( 'instanceReady', function() {
				var toolbarButton = editor.ui.get( 'language' );

				// Toolbar button events.
				if ( toolbarButton ) {

					editor.on( 'elementsPathUpdate', function( ev ) {
						toolbarButton.setState( plugin.getCurrentLangIndicator( ev.editor ) ?
							CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
						return;
					} );

				}
			} );

		}
	} );
})();

/**
 * Specifies the list of languages available in the
 * [Language](http://ckeditor.com/addon/language) plugin. Each entry
 * should be a string in the following format:
 *
 *		<languageCode>:<languageLabel>[:<textDirection>]
 *
 * * _languageCode_: The language code used for the `lang` attribute in ISO 639 format.
 * 	Language codes can be found [here](http://www.loc.gov/standards/iso639-2/php/English_list.php).
 * 	You can use both 2-letter ISO-639-1 codes and 3-letter ISO-639-2 codes, though
 * 	for consistency it is recommended to stick to ISO-639-1 2-letter codes.
 * * _languageLabel_: The label to show for this language in the list.
 * * _textDirection_: (optional) One of the following values: `rtl` or `ltr`,
 * 	indicating the reading direction of the language. Defaults to `ltr`.
 *
 *		config.language_list = [ 'he:Hebrew:rtl', 'pt:Portuguese', 'de:German' ];
 *
 * @cfg {Array} [language_list = [ 'ar:Arabic:rtl', 'fr:French', 'es:Spanish' ]]
 * @member CKEDITOR.config
 */