/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Languages plugin.
 */
(function() {

	var languagesButtonsGroup = 'languages';

	CKEDITOR.plugins.add( 'languages', {
		hidpi: true,
		requires: 'menubutton',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'languages',
		init: function( editor ) {

			var languagesConfigStrings = ( editor.config.languages || [ 'fr:French', 'es:Spanish', 'ar:Arabic:rtl' ] ),
				items = {},
				parts,
				curLanguageId, // 2-letter lanugage identifier.
				i;

			// Parse languagesConfigStrings, and create items entry for each lang.
			for ( i = 0 ; i < languagesConfigStrings.length ; i++ ) {
				parts = languagesConfigStrings[ i ].split( ':' );
				curLanguageId = parts[ 0 ];

				items[ curLanguageId ] = {
					label: parts[ 1 ],
					group: languagesButtonsGroup,
					order: i,
					// Tells if this language is left-to-right oriented (default: true).
					ltr: ( parts.length < 3 || String( parts[ 2 ] ).toLowerCase() != 'rtl' ),
					// Style property will be assigned after object initialization.
					style: null,
					onClick: function() {
						editor.applyStyle( this.style );
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

			// Initialize group/button.
			editor.addMenuGroup( languagesButtonsGroup, 1 );
			editor.addMenuItems( items );

			editor.ui.add( 'Languages', CKEDITOR.UI_MENUBUTTON, {
				label: editor.lang.languages.toolbarLabel,
				toolbar: 'bidi,30',
				modes: { wysiwyg: 1 },
				className: 'cke_button_languages',
				onMenu: function() {
					var activeItems = {};

					for ( var prop in items ) {
						activeItems[ prop ] = CKEDITOR.TRISTATE_ON;
					}

					return  activeItems;
				}
			} );

			// Exposes items variable for testing purposes. // %REMOVE_LINE%
			this.testOnly_items = items; // %REMOVE_LINE%
		}
	});

}());

/**
 * Specifies list of languages available in plugin. Each entry should be string
 * in following format:
 *
 *		<countryCode>:<countryDisplayedLabel>[:<textDirection>]
 *
 * * _countryCode_ &ndash;  language code passed to lang attribute in ISO 639 format.
 *	Codes can be found at http://www.loc.gov/standards/iso639-2/php/English_list.php
 * * _countryDisplayedLabel_ &ndash;  this string displayed as a label in dropdown
 * * _textDirection_ &ndash;  optional &ndash;  one of following values `rtl` or `ltr`,
 * 	indicating text direction. By default it's `ltr`.
 *
 * For example:
 *
 *		config.languages = [ 'fr:French', 'de:Spanish', 'ar:Arabic:rtl' ];
 *
 * @cfg {Array} [languages = [ 'fr:French', 'de:Spanish', 'ar:Arabic:rtl' ]]
 * @member CKEDITOR.config
 */
