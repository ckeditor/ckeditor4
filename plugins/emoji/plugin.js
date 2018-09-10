/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var stylesLoaded = false;

	CKEDITOR.plugins.add( 'emoji', {
		requires: 'autocomplete,textmatch,ajax',
		lang: 'en', // %REMOVE_LINE_CORE%
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
			var that = this;
			var emojiListUrl = editor.config.emoji_emojiListUrl || 'plugins/emoji/emoji.json',
				lang = editor.lang.emoji,
				blockElement;
			var GROUPS = [
				{
					name: 'used',
					sectionName: 'Recently used'
				},
				{
					name: 'people',
					sectionName: 'People'
				},
				{
					name: 'nature',
					sectionName: 'Nature and animals'
				},
				{
					name: 'food',
					sectionName: 'Food and drinks'
				},
				{
					name: 'travel',
					sectionName: 'Travel and places'
				},
				{
					name: 'activities',
					sectionName: 'Activities'
				},
				{
					name: 'objects',
					sectionName: 'Objects'
				},
				{
					name: 'symbols',
					sectionName: 'Symbols'
				},
				{
					name: 'flags',
					sectionName: 'Flags'
				}
			];

			CKEDITOR.ajax.load( CKEDITOR.getUrl( emojiListUrl ), function( data ) {
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
					var emojiName = matchInfo.query.substr( 1 ).toLowerCase(),
						data = CKEDITOR.tools.array.filter( emojiList, function( item ) {
							// Comparing lowercased strings, because emoji should be case insensitive (#2167).
							return item.id.toLowerCase().indexOf( emojiName ) !== -1;
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
					blockElement = block.element;
					block.element.getAscendant( 'html' ).addClass( 'cke_emoji' );
					block.element.getDocument().appendStyleSheet( CKEDITOR.getUrl( '../../contents.css' ) );
					block.element.addClass( 'cke_emoji_panel_block' );
					block.element.setHtml( createEmojiBlock() );
					panel.element.addClass( 'cke_emoji_panel' );
				}

			} );

			var clickFn = CKEDITOR.tools.addFunction( function( event ) {
				if ( event.target.dataset.ckeEmojiName ) {
					editor.insertText( event.target.dataset.ckeEmojiSymbol );
				}
			} );

			var keyDownFn = CKEDITOR.tools.addFunction( function( event ) {
				if ( !event.key || event.key !== 'Enter' ) {
					return;
				}
				if ( event.target.dataset.ckeEmojiName ) {
					editor.insertText( event.target.dataset.ckeEmojiSymbol );
				}
			} );

			var filterFn = CKEDITOR.tools.addFunction( ( function() {
				var emojiItems;
				var sections;
				var buffer = CKEDITOR.tools.throttle( 200, function( searchElement ) {
					if ( !emojiItems ) {
						emojiItems = blockElement.findOne( '.cke_emoji-outer_emoji_block' ).find( 'li' ).toArray();
					}
					if ( !sections ) {
						sections = blockElement.findOne( '.cke_emoji-outer_emoji_block' ).find( 'h2' ).toArray();
					}
					var groups = {};
					var query = searchElement.value;

					CKEDITOR.tools.array.forEach( emojiItems, function( element ) {
						if ( isInNameOrKeywords( query, element.data( 'cke-emoji-name' ), element.data( 'cke-emoji-keywords' ) ) || query === '' ) {
							element.removeClass( 'hidden' );
							groups[ element.data( 'cke-emoji-group' ) ] = true;
						} else {
							element.addClass( 'hidden' );
						}

						function isInNameOrKeywords( query, name, keywordsString ) {
							if ( name.indexOf( query ) !== -1 ) {
								return true;
							}
							if ( keywordsString ) {
								var keywords = keywordsString.split( ',' );
								for ( var i = 0; i < keywords.length; i++ ) {
									if ( keywords[ i ].indexOf( query ) !== -1 ) {
										return true;
									}
								}
							}
							return false;
						}
					} );

					CKEDITOR.tools.array.forEach( sections, function( element ) {
						if ( groups[ element.getId() ] ) {
							element.removeClass( 'hidden' );
						} else {
							element.addClass( 'hidden' );
						}
					} );
				} );
				return buffer.input;
			} )() );

			var updateStatusFn = CKEDITOR.tools.addFunction( ( function() {
				var statusIcon,
					statusFullName,
					statusDescription;
				var buffer = CKEDITOR.tools.throttle( 100, function( emojiItem ) {
					if ( !statusIcon ) {
						statusIcon = blockElement.findOne( '.cke_emoji-status_icon' );
					}
					if ( !statusDescription ) {
						statusDescription = blockElement.findOne( 'p.cke_emoji-status_description' );
					}
					if ( !statusFullName ) {
						statusFullName = blockElement.findOne( 'p.cke_emoji-status_full_name' );
					}
					statusIcon.setText( emojiItem.getText() );
					statusDescription.setText( emojiItem.data( 'cke-emoji-name' ) );
					statusFullName.setText( emojiItem.data( 'cke-emoji-full-name' ) );
				}, this );
				return function( evt ) {
					var el = new CKEDITOR.dom.element( evt.target );
					if ( el.getName() !== 'li' ) {
						return;
					}
					buffer.input( el );
				};
			} )() );

			function createEmojiBlock() {
				var output = [];

				output.push( createGroupsNavigation() );

				output.push( createSeparator() );

				output.push( createSearchSection() );

				output.push( createEmojiListBlock() );

				output.push( createSeparator() );

				output.push( createStatusBar() );

				return '<div class="cke_emoji_inner_panel">' + output.join( '' ) + '</div>';
			}

			function createSeparator() {
				return '<hr>';
			}

			function createGroupsNavigation() {

				var svgUrl = CKEDITOR.getUrl( that.path + 'assets/icons-all.svg' );
				var itemTemplate = new CKEDITOR.template(
					'<li class="cke_emoji-navigation_item" data-cke-emoji-group="{group}"><a href={href}><svg viewBox="0 0 34 34"> <use xlink:href="' +
					svgUrl +
					'{href}"></use></svg></a></li>' );

				var items = CKEDITOR.tools.array.reduce( GROUPS, function( acc, item ) {
					return acc + itemTemplate.output( {
						group: item.name,
						href: '#' + item.name.toLowerCase()
					} );
				}, '' );

				return '<nav><ul>' + items + '</ul></nav>';
			}

			function createSearchSection() {
				var loupeUrl = CKEDITOR.getUrl( that.path + 'assets/loupe.svg' );
				return '<label class="cke_emoji-search"><img src="' + loupeUrl +
					'" /><input placeholder="' + lang.searchPlaceholder +
					'" type="search" oninput="CKEDITOR.tools.callFunction(' + filterFn +
					',this)"></label>';
			}

			function createEmojiListBlock() {
				return '<div class="cke_emoji-outer_emoji_block"' +
					'onclick="CKEDITOR.tools.callFunction(' + clickFn + ',event);return false;" ' +
					'onkeydown="CKEDITOR.tools.callFunction(' + keyDownFn + ',event);" ' +
					'onmouseover="CKEDITOR.tools.callFunction(' + updateStatusFn + ',event);return false;" ' +
					'>' + getEmojiSections() + '</div>';
			}

			function createStatusBar() {
				return '<div class="cke_emoji-status_bar">' +
					'<div class="cke_emoji-status_icon"></div>' +
					'<div class="cke_emoji-status_description"><p class="cke_emoji-status_description"></p><p class="cke_emoji-status_full_name"></p></div>' +
					'</div>';
			}

			function getEmojiSections() {
				return CKEDITOR.tools.array.reduce( GROUPS, function( acc, item ) {
					return acc + getEmojiSection( item );
				}, '' );
			}

			function getEmojiSection( item ) {
				var groupName = item.name;
				var sectionName = item.sectionName;
				var group = getEmojiListGroup( groupName );
				return group === '' ? '' : '<section><h2 id="' + groupName + '">' + sectionName + '</h2><ul>' + group + '</ul></section>';
			}

			function getEmojiListGroup( groupName ) {
				var emojiList = editor._.emoji.list;
				var emojiTpl = new CKEDITOR.template( '<li data-cke-emoji-full-name="{id}" data-cke-emoji-name="{name}" data-cke-emoji-symbol="{symbol}" data-cke-emoji-group="{group}" ' +
					'data-cke-emoji-keywords="{keywords}" title="{id}" class="cke_emoji_item" tabindex="0">{symbol}</li>' );
				return CKEDITOR.tools.array.reduce( CKEDITOR.tools.array.filter( emojiList, function( item ) {
					return item.group === groupName;
				} ), function( acc, item ) {
					return acc + emojiTpl.output( {
						symbol: item.symbol,
						id: item.id,
						name: item.id.replace( /::.*$/, ':' ).replace( /^:|:$/g, '' ).replace( /_/g, ' ' ),
						group: item.group, keywords: ( item.keywords || [] ).join( ',' )
					} );
				}, '' );

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

/**
 * Array with emoji names, which will be used as default one in emoji panel.
 * If value is not set, then first 30 emoji from `emoji.json` file will be displayed.
 *
 * @since 4.11.0
 * @cfg {String}[] [emoji_defaults]
 * @member CKEDITOR.config
 */
