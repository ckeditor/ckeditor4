/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'pastebutton', {
		requires: 'undo,clipboard,pastefromword,pastetext,balloontoolbar,menubutton',
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'paste,paste-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function( editor ) {
			editor.once( 'instanceReady', function() {
				var lang = editor.lang.pastebutton,
					toolbar = new CKEDITOR.ui.balloonToolbar( editor ),
					menuItems;

				editor._.pasteButtonCache = {};

				editor.addCommand( 'pastebutton', {
					exec: function( editor, method ) {
						var cache = editor._.pasteButtonCache,
							editable = editor.editable(),
							start = editable.findOne( '[data-cke-pastebutton-marker="1"]' ),
							end = editable.findOne( '[data-cke-pastebutton-marker="2"]' ),
							range = editor.createRange();

						if ( !cache[ method ] || !start || !end ) {
							return;
						}

						cache.currentMethod = method;

						cache.lock = true;
						editor.fire( 'lockSnapshot' );

						range.setStartAfter( start );
						range.setEndBefore( end );
						range.select();
						range.deleteContents();
						editor.insertHtml( cache[ method ], 'html', range );

						editor.fire( 'unlockSnapshot' );
						cache.lock = false;
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
							pasteButton_html: getButtonState( editor, 'html' ),
							pasteButton_text: getButtonState( editor, 'text' ),
							pasteButton_word: getButtonState( editor, 'word' )
						};
					}
				} );

				toolbar.addItem( 'pastebutton', editor.ui.create( 'PasteButton' ) );

				editor.on( 'paste', function( evt ) {
					var data = evt.data.dataTransfer;

					editor.once( 'insertHtml', function( evt ) {
						var space = '\u200b';
						evt.data.dataValue = '<span data-cke-pastebutton-marker="1">' + space + '</span>' +
							evt.data.dataValue +
							'<span data-cke-pastebutton-marker="2">' + space + '</span>';
					}, null, null, 9 );

					editor._.pasteButtonCache = {
						currentMethod: 'html',

						html: data.getData( 'text/html' ),
						text: data.getData( 'text/plain' )
					};
				}, null, null, 999 );

				editor.on( 'afterPasteFromWord', function( evt ) {
					editor._.pasteButtonCache.word = evt.data.dataValue;
					editor._.pasteButtonCache.currentMethod = 'word';
				}, null, null, 9999 );

				editor.on( 'afterPaste', function() {
					var endMarker = editor.editable().findOne( '[data-cke-pastebutton-marker="2"]' ),
						listener;

					toolbar.attach( endMarker );

					listener = editor.on( 'change', function() {
						var cache = editor._.pasteButtonCache,
							markers = editor.editable().find( '[data-cke-pastebutton-marker]' ).toArray();

						if ( cache.lock ) {
							return;
						}

						toolbar.hide();
						editor._.pasteButtonCache = {};

						CKEDITOR.tools.array.forEach( markers, function( marker ) {
							marker.remove();
						} );

						listener.removeListener();
					} );
				} );
			} );
		}
	} );

	function getButtonState( editor, button ) {
		var cache = editor._.pasteButtonCache;

		if ( !cache[ button ] ) {
			return CKEDITOR.TRISTATE_DISABLED;
		}

		if ( cache.currentMethod === button ) {
			return CKEDITOR.TRISTATE_ON;
		}

		return CKEDITOR.TRISTATE_OFF;
	}
}() );
