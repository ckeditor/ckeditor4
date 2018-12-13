/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'pastebutton', {
		requires: 'clipboard,pastefromword,pastetext,balloontoolbar,menubutton',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'paste,paste-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function( editor ) {
			editor.once( 'instanceReady', function() {
				var lang = editor.lang.pastebutton,
					menuItems,
					toolbarContext;

				editor.addCommand( 'pastebutton', {
					exec: function() {

					}
				} );

				menuItems = {
					pasteButton_html: {
						label: lang.pasteHtml,
						group: 'pastebutton',
						state: CKEDITOR.TRISTATE_ON,
						order: 1,
						onClick: function() {
							editor.execCommand( 'pastebutton', 'html' );
						}
					},

					pasteButton_word: {
						label: lang.pasteWord,
						group: 'pastebutton',
						state: CKEDITOR.TRISTATE_ON,
						order: 2,
						onClick: function() {
							editor.execCommand( 'pastebutton', 'word' );
						}
					},

					pasteButton_text: {
						label: lang.pasteText,
						group: 'pastebutton',
						state: CKEDITOR.TRISTATE_ON,
						order: 3,
						onClick: function() {
							editor.execCommand( 'pastebutton', 'text' );
						}
					}
				};

				editor.addMenuGroup( 'pastebutton', 1 );
				editor.addMenuItems( menuItems );

				editor.ui.add( 'PasteButton', CKEDITOR.UI_MENUBUTTON, {
					label: lang.button,
					icon: 'paste',
					command: 'pastebutton',
					onMenu: function() {
						return {
							pasteButton_text: CKEDITOR.TRISTATE_ON,
							pasteButton_html: CKEDITOR.TRISTATE_ON,
							pasteButton_word: CKEDITOR.TRISTATE_ON
						};
					}
				} );

				toolbarContext = editor.balloonToolbars.create( {
					buttons: 'PasteButton'
				} );

				editor.on( 'afterPaste', function() {
					var selection = editor.getSelection();

					toolbarContext.show( selection );

					editor.once( 'selectionChange', function() {
						toolbarContext.hide();
					} );
				} );
			} );
		}
	} );
}() );
