/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	var stylesLoaded = false;

	CKEDITOR.plugins.add( 'emoji', {
		requires: 'autocomplete,textmatch,ajax,panelbutton,floatpanel',
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
				blockElement,
				blockObject,
				listeners = [];
			var GROUPS = [
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
				if ( data === null ) {
					return;
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
					editor.insertHtml( data.emojiText );
					editor.focus( true );
				}
			} );
			editor.ui.addToolbarGroup( 'emoji', 'insert' );
			// Name is responsible for icon name also.
			editor.ui.add( 'emojiPanel', CKEDITOR.UI_PANELBUTTON, {
				label: 'emoji',
				title: 'Emoji List',
				modes: { wysiwyg: 1 },
				editorFocus: 0,
				toolbar: 'emoji',
				panel: {
					css: [ CKEDITOR.skin.getPath( 'editor' ), this.path + 'skins/default.css' ],
					attributes: { role: 'listbox', 'aria-label': 'Emoji List' },
					markFirst: false
				},

				onBlock: function( panel, block ) {


					var keys = block.keys;
					var rtl = editor.lang.dir == 'rtl';
					keys[ rtl ? 37 : 39 ] = 'next'; // ARROW-RIGHT
					keys[ 40 ] = 'next'; // ARROW-DOWN
					keys[ 9 ] = 'next'; // TAB
					keys[ rtl ? 39 : 37 ] = 'prev'; // ARROW-LEFT
					keys[ 38 ] = 'prev'; // ARROW-UP
					keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
					keys[ 32 ] = 'click'; // SPACE

					blockElement = block.element;
					block.element.getAscendant( 'html' ).addClass( 'cke_emoji' );
					block.element.getDocument().appendStyleSheet( CKEDITOR.getUrl( CKEDITOR.basePath + 'contents.css' ) );
					block.element.addClass( 'cke_emoji-panel_block' );
					block.element.setHtml( createEmojiBlock() );
					panel.element.addClass( 'cke_emoji_panel' );

					blockObject = block;

					registerListeners( listeners );
				},

				onOpen: openReset()
			} );

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
					'<li class="cke_emoji-navigation_item" data-cke-emoji-group="{group}"><a href={href} draggable="false" _cke_focus="1"><svg viewBox="0 0 34 34"> <use xlink:href="' +
					svgUrl +
					'{href}"></use></svg></a></li>' );

				var items = CKEDITOR.tools.array.reduce( GROUPS, function( acc, item ) {
					return acc + itemTemplate.output( {
						group: item.name,
						href: '#' + item.name.toLowerCase()
					} );
				}, '' );

				listeners.push( {
					selector: 'nav li',
					event: 'click',
					listener: function( event ) {
						var nodeArr = blockElement.find( 'nav li' ).toArray();
						var activeElement = event.sender;
						CKEDITOR.tools.array.forEach( nodeArr, function( node ) {
							if ( node.equals( activeElement ) ) {
								node.addClass( 'active' );
							} else {
								node.removeClass( 'active' );
							}
						} );
					}
				} );

				listeners.push( {
					selector: 'nav li',
					event: 'click',
					listener: clearSearchAndMoveFocus
				} );


				return '<nav><ul>' + items + '</ul></nav>';
			}

			function createSearchSection() {
				var loupeUrl = CKEDITOR.getUrl( that.path + 'assets/loupe.svg' );

				listeners.push( {
					selector: 'input',
					event: 'input',
					listener: ( function() {
						var buffer = CKEDITOR.tools.throttle( 200, filter );
						return buffer.input;
					} )()
				} );
				listeners.push( {
					selector: 'input',
					event: 'click',
					listener: ( function() {
						var inputNumber;
						return function() {
							if ( inputNumber === undefined ) {
								inputNumber = getItemIndex( blockObject._.getItems().toArray(), blockElement.findOne( 'input' ) );
							}
							blockObject._.markItem( inputNumber );
						};
					} )()
				} );

				return '<label class="cke_emoji-search"><img src="' + loupeUrl +
					'" /><input placeholder="' + lang.searchPlaceholder +
					'" type="search" _cke_focus="1"></label>';
			}

			function createEmojiListBlock() {
				listeners.push( {
					selector: '.cke_emoji-outer_emoji_block',
					event: 'scroll',
					listener: ( function() {
						var buffer = CKEDITOR.tools.throttle( 150, refreshNavigationStatus );
						return buffer.input;
					} )()
				} );

				listeners.push( {
					selector: '.cke_emoji-outer_emoji_block',
					event: 'click',
					listener: function( event ) {
						if ( event.data.getTarget().data( 'cke-emoji-name' ) ) {
							editor.execCommand( 'insertEmoji', { emojiText: event.data.getTarget().data( 'cke-emoji-symbol' ) } );
						}
					}
				} );

				listeners.push( {
					selector: '.cke_emoji-outer_emoji_block',
					event: 'mouseover',
					listener: updateStatusbar
				} );

				listeners.push( {
					selector: '.cke_emoji-outer_emoji_block',
					event: 'keyup',
					listener: updateStatusbar
				} );

				return '<div class="cke_emoji-outer_emoji_block">' + getEmojiSections() + '</div>';
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
				return '<section data-cke-emoji-group="' + groupName + '" ><h2 id="' + groupName + '">' + sectionName + '</h2><ul>' + group + '</ul></section>';
			}

			function getEmojiListGroup( groupName ) {
				var emojiList = editor._.emoji.list;
				var emojiTpl = new CKEDITOR.template( '<li class="cke_emoji_item">' +
				'<a draggable="false" data-cke-emoji-full-name="{id}" data-cke-emoji-name="{name}" data-cke-emoji-symbol="{symbol}" data-cke-emoji-group="{group}" ' +
				'data-cke-emoji-keywords="{keywords}" title="{id}" href="#" _cke_focus="1">{symbol}</a>' +
				'</li>' );
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

			// Apply filters to emoji items in dropdown.
			// Hidding not searched one.
			// Can accpet input event or string
			function filter( evt ) {
				var emojiItems = blockElement.findOne( '.cke_emoji-outer_emoji_block' ).find( 'li > a' ).toArray();
				var sections = blockElement.findOne( '.cke_emoji-outer_emoji_block' ).find( 'h2' ).toArray();
				var groups = {};
				var query = typeof evt === 'string' ? evt : evt.sender.getValue();

				CKEDITOR.tools.array.forEach( emojiItems, function( element ) {
					if ( isNameOrKeywords( query, element.data( 'cke-emoji-name' ), element.data( 'cke-emoji-keywords' ) ) || query === '' ) {
						element.removeClass( 'hidden' );
						element.getParent().removeClass( 'hidden' );
						groups[ element.data( 'cke-emoji-group' ) ] = true;
					} else {
						element.addClass( 'hidden' );
						element.getParent().addClass( 'hidden' );
					}

					function isNameOrKeywords( query, name, keywordsString ) {
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
						element.getParent().removeClass( 'hidden' );
						element.removeClass( 'hidden' );
					} else {
						element.addClass( 'hidden' );
						element.getParent().addClass( 'hidden' );
					}
				} );

				refreshNavigationStatus();
			}

			function clearSearchInput() {
				blockElement.findOne( 'input' ).setValue( '' );
				filter( '' );
			}

			// Resets state of emoji dropdown.
			// Clear filters, reset focus, etc.
			function openReset() {
				var firstCall,
					inputIndex,
					input;
				return function() {

					if ( !firstCall ) {
						filter( '' );

						input = blockElement.findOne( 'input' );
						inputIndex = getItemIndex( blockObject._.getItems().toArray(), input );

						firstCall = true;
					}

					refreshNavigationStatus();

					// Clear search results:
					clearSearchInput();

					// Reset focus:
					input.focus( true );
					blockObject._.markItem( inputIndex );

					// Remove statusbar icons:
					clearStatusbar();
				};
			}

			function refreshNavigationStatus() {
				var sections = blockElement.find( 'section' ).toArray();
				var containerOffset = blockElement.findOne( '.cke_emoji-outer_emoji_block' ).getClientRect().top;
				var section = CKEDITOR.tools.array.filter( sections, function( element ) {
					var rect = element.getClientRect();
					if ( !rect.height || element.findOne( 'h2' ).hasClass( 'hidden' ) ) {
						return false;
					}
					return rect.height + rect.top > containerOffset;
				} );
				var groupName = section.length ? section[ 0 ].data( 'cke-emoji-group' ) : false;
				var navigationElements = blockElement.find( 'nav li' ).toArray();
				CKEDITOR.tools.array.forEach( navigationElements, function( node ) {
					if ( node.data( 'cke-emoji-group' ) === groupName ) {
						node.addClass( 'active' );
					} else {
						node.removeClass( 'active' );
					}
				} );
			}

			function updateStatusbar( event ) {
				var target;
				if ( event instanceof CKEDITOR.dom.element ) {
					target = event;
				} else {
					target = event.data.getTarget();
				}

				if ( target.getName() !== 'a' ) {
					return;
				}

				blockElement.findOne( '.cke_emoji-status_icon' ).setText( target.getText() );
				blockElement.findOne( 'p.cke_emoji-status_description' ).setText( target.data( 'cke-emoji-name' ) );
				blockElement.findOne( 'p.cke_emoji-status_full_name' ).setText( target.data( 'cke-emoji-full-name' ) );
			}

			function clearStatusbar() {
				blockElement.findOne( '.cke_emoji-status_icon' ).setText( '' );
				blockElement.findOne( 'p.cke_emoji-status_description' ).setText( '' );
				blockElement.findOne( 'p.cke_emoji-status_full_name' ).setText( '' );
			}

			function clearSearchAndMoveFocus( event ) {
				clearSearchInput();
				moveFocus( event );
			}

			function moveFocus( event ) {
				var groupName = event.data.getTarget().getAscendant( 'li' ).data( 'cke-emoji-group' ),
					firstSectionItem = blockElement.findOne( 'a[data-cke-emoji-group="' + groupName + '"]' ),
					itemIndex = getItemIndex( blockObject._.getItems().toArray(), firstSectionItem );

				firstSectionItem.focus( true );
				blockObject._.markItem( itemIndex );
			}

			function getItemIndex( list, item ) {
				return CKEDITOR.tools.array.indexOf( list, function( element ) {
					return element.equals( item );
				} );
			}

			function registerListeners( list ) {
				CKEDITOR.tools.array.forEach( list, function( item ) {
					var root = blockElement,
						selector = item.selector,
						listener = item.listener,
						event = item.event;

					CKEDITOR.tools.array.forEach( root.find( selector ).toArray(), function( node ) {
						node.on( event, listener );
					} );
				} );
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
