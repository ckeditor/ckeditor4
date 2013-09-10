/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Languages plugin
 */
(function() {
	
	var languagesButtonsGroup = 'languages',
		toolbarOrder = 30,
		toolbarGroup = 'bidi';

	CKEDITOR.plugins.add( 'languages', {
		hidpi: true,
		requires: [ 'menubutton' ],
		init: function( editor ) {
			
			var languagesConfigString = editor.config.languages,
				items = {},
				parts,
				curLanguageId, // 2-letter lanugage identifier
				i;
	
			// parse languagesConfigString, and create items entry for each lang
			for ( i = 0 ; i < languagesConfigString.length ; i++ ) {
				parts = languagesConfigString[i].split( ':' );
				curLanguageId = parts[ 0 ];
				
				items[ 'language_' + curLanguageId ] = {
					label: parts[ 1 ],
					group: languagesButtonsGroup,
					order: i,
					// tells if this language is left-to-right oriented (default: true)
					ltr: ( parts.length < 3 || String( parts[ 2 ] ).toLowerCase() != 'rtl' ),
					// style property will be assigned after object initialization
					style: null,
					onClick: function() {
						editor.applyStyle( this.style );
					}
				};
				
				// init style property
				items[ 'language_' + curLanguageId ].style = new CKEDITOR.style( {
					element: 'span',
					attributes: {
						lang: curLanguageId,
						dir: items[ 'language_' + curLanguageId ].ltr ? 'ltr' : 'rtl'
					}
				} );
			}
			
			// initialize group/button
			editor.addMenuGroup( languagesButtonsGroup, 1 );
			editor.addMenuItems( items );
			
			editor.ui.add( 'Languages', CKEDITOR.UI_MENUBUTTON, {
				label: 'Language',
				title: 'Language',
				toolbar: toolbarGroup + ',' + toolbarOrder,
				modes: { wysiwyg: 1 },
				className: 'cke_button_languages',
				icon: this.path + 'icons/languages.png',
				onMenu: function() {
					var activeItems = {};
					
					for ( var prop in items ) {
						if ( items.hasOwnProperty( prop ) )
							activeItems[ prop ] = CKEDITOR.TRISTATE_ON;
					}
					
					return  activeItems;
				}
			} );
			
			// exposes items variable for testing purposes // %REMOVE_LINE%
			this.testOnly_items = items; // %REMOVE_LINE%
		}
	});
	
	// assign default configuration
	CKEDITOR.config.languages = CKEDITOR.config.languages ? CKEDITOR.config.languages : [ 'fr:French', 'de:Spanish', 'ar:Arabic:rtl' ];
}());
