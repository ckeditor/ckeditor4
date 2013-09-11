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
		requires: 'menubutton',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'languages', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {

			var languagesConfigStrings = ( editor.config.languages || [ 'ar:Arabic:rtl', 'fr:French', 'es:Spanish' ] ),
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
					ltr: ( String( parts[ 2 ] ).toLowerCase() != 'rtl' ),
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
 * Specifies the list of languages available in the languages plugin. Each entry
 * should be a string in the following format:
 *
 *		<languageCode>:<languageLabel>[:<textDirection>]
 *
 * * _languageCode_: language code used for the lang attribute in ISO 639 format.
 * 	Codes can be found at http://www.loc.gov/standards/iso639-2/php/English_list.php.
 * * _languageLabel_: label to show for this language in the list.
 * * _textDirection_: (optional) one of following values `rtl` or `ltr`,
 * 	indicating the reading direction for the language text direction. Defaults
 * 	to `ltr`.
 *
 *		config.languages = [ 'ar:Arabic:rtl', 'fr:French', 'de:Spanish' ];
 *
 * @cfg {Array} [languages = [ 'ar:Arabic:rtl', 'fr:French', 'de:Spanish' ]]
 * @member CKEDITOR.config
 */
