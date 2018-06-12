/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var stylesLoaded = false;

	CKEDITOR.plugins.add( 'emoji', {
		requires: 'autocomplete,textmatch,ajax',
		icons: 'emojipanel',
		beforeInit: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) {
				return;
			}
			if ( !stylesLoaded ) {
				CKEDITOR.document.appendStyleSheet( this.path + 'skins/default.css' );
				stylesLoaded = true;
			}
		},

		init: function( editor ) {

			var emojiListUrl = editor.config.emoji_emojiListUrl || 'plugins/emoji/emoji.json',
				lang = editor.lang.emoji,
				defaultEmojiList = null;

			CKEDITOR.ajax.load( CKEDITOR.getUrl( emojiListUrl ), function( data ) {
				defaultEmojiList = JSON.parse( data );

				if ( !editor._.emojiList ) {
					editor._.emojiList = defaultEmojiList;
				}

				if ( editor._.emoji === undefined ) {
					editor._.emoji = {};
				}

				if ( editor._.emoji.list === undefined ) {
					editor._.emoji.list = JSON.parse( data );
				}

				var emojiList = editor._.emoji.list,
					charactersToStart = editor.config.emoji_minChars === undefined ? 2 : editor.config.emoji_minChars;

				if ( editor.status !== 'ready' ) {
					editor.once( 'instanceReady', initPlugin );
				} else {
					initPlugin();
				}

				// HELPER FUNCTIONS:

				function initPlugin() {
					editor._.emoji.autocomplete = new CKEDITOR.plugins.autocomplete( editor, {
						textTestCallback: getTextTestCallback(),
						dataCallback: dataCallback,
						itemTemplate: '<li data-id="{id}" class="cke_emoji_suggestion_item">{symbol} {id}</li>',
						outputTemplate: '{symbol}'
					} );
				}

				function getTextTestCallback() {
					return function( range ) {
						if ( !range.collapsed ) {
							return null;
						}
						return CKEDITOR.plugins.textMatch.match( range, matchCallback );
					};
				}

				function matchCallback( text, offset ) {
					var left = text.slice( 0, offset ),
						// Emoji should be started with space or newline, but space shouldn't leak to output, hence it is in non captured group (#2195).
						match = left.match( new RegExp( '(?:\\s\|^)(:\\S{' + charactersToStart + '}\\S*)$' ) );

					if ( !match ) {
						return null;
					}

					// In case of space preceding colon we need to return the last index (#2394) of capturing grup.
					return { start: left.lastIndexOf( match[ 1 ] ), end: offset };
				}

				function dataCallback( matchInfo, callback ) {
					var emojiName =  matchInfo.query.substr( 1 ).toLowerCase(),
						data = CKEDITOR.tools.array.filter( emojiList, function( item ) {
							// Comparing lowercased strings, because emoji should be case insensitive (#2167).
							return item.id.toLowerCase().indexOf( emojiName ) !== -1;
						} ).sort( function( a, b ) {
							// Sort at the beginning emoji starts with given query.
							var isAStartWithEmojiName = a.id.substr( 1, emojiName.length ) === emojiName,
								isBStartWithEmojiName = b.id.substr( 1, emojiName.length ) === emojiName;

							if ( isAStartWithEmojiName && isBStartWithEmojiName || !isAStartWithEmojiName && !isBStartWithEmojiName ) {
								return a.id === b.id ? 0 : ( a.id > b.id ? 1 : -1 );
							} else if ( isAStartWithEmojiName ) {
								return -1;
							} else {
								return 1;
							}
						} );
					callback( data );
				}
			} );

			editor.addCommand( 'insertEmoji', {
				exec: function( editor, data ) {
					editor.insertText( data.emojiName );
				}
			} );

			// Name is responsible for icon name also.
			editor.ui.add( 'emojiPanel', CKEDITOR.UI_PANELBUTTON, {
				label: 'emoji',
				title: 'Emoji List',
				modes: { wysiwyg: 1 },
				editorFocus: 0,
				toolbar: 'emoji',
				panel: {
					css: [ CKEDITOR.skin.getPath( 'editor' ), this.path + 'skins/default.css' ],
					attributes: { role: 'listbox', 'aria-label': 'Emoji List' }
				},

				onBlock: function( panel, block ) {
					block.element.addClass( 'cke_emoji_panel_block' );
					block.element.setHtml( getEmojiBlock() );
					panel.element.addClass( 'cke_emoji_panel' );

				}

			} );

			var clickFn = CKEDITOR.tools.addFunction( function( event ) {
				if ( event.target.dataset.ckeEmojiName ) {
					editor.insertText( ':' + event.target.dataset.ckeEmojiName + ':' );
				}
			} );

			var filterFn = CKEDITOR.tools.addFunction( function( searchElement ) {
				var query = searchElement.value;
				var elements = searchElement.ownerDocument.getElementsByClassName( 'cke_emoji_item' );

				for ( var i = 0; i < elements.length; i++ ) {
					var name = elements[ i ].dataset.ckeEmojiName;
					if ( name.indexOf( query ) !== -1 || query === '' ) {
						elements[ i ].classList.add( 'cke_emoji_item_active' );
					} else {
						elements[ i ].classList.remove( 'cke_emoji_item_active' );
					}
				}
			} );

			function getEmojiBlock() {
				var output = [];
				// Search Box:
				output.push( '<input placeholder="', 'Search Emoji' ,'" type="search" oninput="CKEDITOR.tools.callFunction(', filterFn ,',this)">' );
				// Result box:
				var resultTpl = new CKEDITOR.template( '<h2>{langTitle}</h2>' );
				var emojiTpl = new CKEDITOR.template( '<li data-cke-emoji-name="{id}" class="cke_emoji_item cke_emoji_item_active">{symbol}</li>' );
				output.push( resultTpl.output( { langTitle: lang ? lang.resultTitle : 'Frequently used' } ) );

				output.push( '<div class="cke_emoji_list"><ul onclick="CKEDITOR.tools.callFunction(', clickFn, ',event);return false;">' );
				CKEDITOR.tools.array.forEach( defaultEmojiList, function( emoji ) {
					output.push( emojiTpl.output( { symbol: emoji.symbol, id: emoji.id.replace( /^:|:$/g, '' ) } ) );
				} );
				output.push( '</ul></div>' );

				return '<div class="cke_emoji_inner_panel">' + output.join( '' ) + '</div>';
			}

		}
	} );
} )();

/**
 * A number that defines how many characters are required to start displaying emoji's autocomplete suggestion box.
 * Delimiter `:`, which activates the emoji suggestion box, is not included in this value.
 *
 * ```js
 * 	editor.emoji_minChars = 0; // Emoji suggestion box appears after typing ':'.
 * ```
 *
 * @since 4.10.0
 * @cfg {Number} [emoji_minChars=2]
 * @member CKEDITOR.config
 */

/**
 * Address of the JSON file containing the emoji list. The file is downloaded through the {@link CKEDITOR.ajax#load} method
 * and the URL address is processed by {@link CKEDITOR#getUrl}.
 * Emoji list has to be an array of objects with the `id` and `symbol` properties. These keys represent the text to match and the
 * UTF symbol for its replacement.
 * An emoji has to start with the `:` (colon) symbol.
 *
 * ```json
 * [
 * 	{
 * 		"id": ":grinning_face:",
 * 		"symbol":"😀"
 * 	},
 * 	{
 * 		"id": ":bug:",
 * 		"symbol":"🐛"
 * 	},
 * 	{
 * 		"id": ":star:",
 * 		"symbol":"⭐"
 * 	}
 * ]
 * ```
 *
 * ```js
 * 	editor.emoji_emojiListUrl = 'https://my.custom.domain/ckeditor/emoji.json';
 * ```
 *
 * @since 4.10.0
 * @cfg {String} [emoji_emojiListUrl='plugins/emoji/emoji.json']
 * @member CKEDITOR.config
 */
