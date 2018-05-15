/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
	var MARKER = '@',
		MIN_CHARS = 2,
		cache = {};

	CKEDITOR.plugins.add( 'mentions', {
		requires: 'autocomplete,textmatch,ajax',
		instances: [],
		init: function( editor ) {
			var self = this;

			editor.on( 'instanceReady', function() {
				CKEDITOR.tools.array.forEach( editor.config.mentions || [], function( config ) {
					self.instances.push( new Mentions( editor, config ) );
				} );
			} );
		}
	} );

	/**
	 * Mentions plugin allows you to type marker character and get suggested values for the text matches so that you don't have to write it on your own.
	 *
	 * The recommended way to add mentions feature to an editor is by
	 * using {@link CKEDITOR.config#mentions config.mentions} property or by passing it as the configuration option when instantiating an editor.
	 *
	 * ```javascript
	 * // Simple usage with CKEDITOR.config.mentions property.
	 * CKEDITOR.config.mentions = [ { feed: ['Anna', 'Thomas', 'John'], minChars: 0 } ];
	 *
	 * // Passing mentions configuration when creating editor.
	 * CKEDITOR.replace( 'editor', {
	 * 		mentions: [ { feed: ['Anna', 'Thomas', 'John'], minChars: 0 } ]
	 * } );
	 * ```
	 *
	 * @class CKEDITOR.plugins.mentions
	 * @since 4.10.0
	 * @constructor Creates the new instance of mentions and attaches it to the editor.
	 * @param {CKEDITOR.editor} editor The editor to watch.
	 * @param {CKEDITOR.plugins.mentions.configDefinition} config Configuration object keeping information how to instantiate mentions plugin.
	 */
	function Mentions( editor, config ) {
		var feed = config.feed;

		/**
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#caseSensitive caseSensitive}.
		 *
		 * @property {Boolean} [caseSensitive=false]
		 * @readonly
		 */
		this.caseSensitive = config.caseSensitive;

		/**
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#marker marker}.
		 *
		 * @property {String} [marker='@']
		 * @readonly
		 */
		this.marker = config.hasOwnProperty( 'marker' ) ? config.marker : MARKER;

		/**
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#minChars minChars}.
		 *
		 * @property {Number} [minChars=2]
		 * @readonly
		 */
		this.minChars = config.minChars !== null && config.minChars !== undefined ? config.minChars : MIN_CHARS;

		/**
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#template template}. Use {@link #changeViewTemplate changeViewTemplate} function to change view template.
		 *
		 * @property {String} [template=CKEDITOR.plugins.autocomplete.view.itemTemplate]
		 * @readonly
		 */
		this.template = config.template;

		/**
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#pattern pattern}.
		 *
		 * @property {RegExp} pattern
		 * @readonly
		 */
		this.pattern = config.pattern || createPattern( this.marker, this.minChars );

		/**
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#cache cache}.
		 *
		 * @property {Boolean} [cache=false]
		 * @readonly
		 */
		this.cache = Boolean( config.cache );

		/**
		 * {@link CKEDITOR.plugins.autocomplete Autocomplete} instance used by mentions feature to implement autocompletion logic.
		 *
		 * @property {CKEDITOR.plugins.autocomplete}
		 * @private
		 */
		this._autocomplete = new CKEDITOR.plugins.autocomplete( editor,
			getTextTestCallback( this.marker, this.minChars, this.pattern ),
			getDataCallback( feed, this ) );

		if ( this.template ) {
			this.changeViewTemplate( this.template );
		}
	}

	Mentions.prototype = {

		/**
		 * Destroys the mentions instance.
		 *
		 * View element and event listeners will be removed from the DOM.
		 */
		destroy: function() {
			this._autocomplete.destroy();
		},

		/**
		 * Changes the view template. The given template will be used to render matches in the dropdown.
		 *
		 * ```javascript
		 * mentions.changeViewTemplate( '<li data-id="{id}" ><img src="{iconSrc}" alt="{name}" /><span>{name}</span></li>' );
		 *
		 * ```
		 *
		 * @param {String} template
		 */
		changeViewTemplate: function( template ) {
			this.template = template;
			this._autocomplete.view.itemTemplate = new CKEDITOR.template( template );
		}
	};

	function createPattern( marker, minChars ) {
		var pattern = '\\' + marker + '\\w';

		if ( minChars ) {
			pattern += '{' + minChars + ',}';
		} else {
			pattern += '*';
		}

		pattern += '$';

		return new RegExp( pattern );
	}

	function getTextTestCallback( marker, minChars, pattern ) {
		return function( range ) {
			if ( !range.collapsed ) {
				return null;
			}

			return CKEDITOR.plugins.textMatch.match( range, matchCallback );
		};

		function matchCallback( text, offset ) {
			var match = text.slice( 0, offset )
				.match( pattern );

			if ( !match ) {
				return null;
			}

			return {
				start: match.index,
				end: offset
			};
		}
	}

	function getDataCallback( feed, mentions ) {
		return function( query, range, callback ) {
			// We are removing marker here to give clean query result for the endpoint callback.
			if ( mentions.marker ) {
				query = query.substring( 1 );
			}

			if ( CKEDITOR.tools.array.isArray( feed ) ) {
				createArrayFeed();
			} else if ( typeof feed === 'string' ) {
				createUrlFeed();
			} else {
				feed( {
					query: query,
					marker: mentions.marker
				}, resolveCallbackData );
			}

			function createArrayFeed() {
				var data = indexArrayFeed( feed ).filter( function( item ) {
					var itemName = item.name;

					if ( !mentions.caseSensitive ) {
						itemName = itemName.toLowerCase();
						query = query.toLowerCase();
					}

					return itemName.indexOf( query ) === 0;
				} );

				resolveCallbackData( data );
			}

			function indexArrayFeed( feed ) {
				var index = 1;
				return CKEDITOR.tools.array.reduce( feed, function( current, name ) {
					current.push( { name: name, id: index++ } );
					return current;
				}, [] );
			}

			function createUrlFeed() {
				var encodedUrl = new CKEDITOR.template( feed )
					.output( { encodedQuery: encodeURIComponent( query ) } );

				if ( mentions.cache && cache[ encodedUrl ] ) {
					resolveCallbackData( cache[ encodedUrl ] );
					return;
				}

				CKEDITOR.ajax.load( encodedUrl, function( data ) {
					var items = JSON.parse( data );

					if ( mentions.cache ) {
						cache[ encodedUrl ] = items;
					}

					resolveCallbackData( items );
				} );
			}

			function resolveCallbackData( data ) {
				if ( !data ) {
					return;
				}

				// We don't want to change item data, so lets create new one.
				var newData = CKEDITOR.tools.array.map( data, function( item ) {
					var name = mentions.marker + item.name;
					return CKEDITOR.tools.object.merge( item, { name: name } );
				} );

				callback( newData );
			}
		};
	}

	CKEDITOR.plugins.mentions = Mentions;

	/**
	 * List of mentions configuration objects.
	 *
	 * For each configuration object new {@link CKEDITOR.plugins.mentions Mentions} instance will be created and attached to an editor.
	 *
	 * ```javascript
	 * config.mentions = [
	 * 	{ feed: [ 'Anna', 'Thomas', 'Jack' ], minChars: 0 },
	 * 	{ feed: backendApiFunction, marker: '#' },
	 * 	{ feed: '/users?query={encodedQuery}', marker: '$' }
	 * ];
	 *
	 * ```
	 *
	 * @cfg {CKEDITOR.plugins.mentions.configDefinition[]} [mentions]
	 * @since 4.10.0
	 * @member CKEDITOR.config
	 */

	/**
	 * Abstract class describing the definition of a {@link CKEDITOR.plugins.mentions mentions} plugin configuration.
	 *
	 * This virtual class illustrates the properties that developers can use to define and create
	 * mentions configuration definition.
	 * A mentions definition object represents an object as a set of properties defining a mentions
	 * data feed and it's optional parameters.
	 *
	 * Simple usage:
	 *
	 * ```javascript
	 * var definition = { feed: ['Anna', 'Thomas', 'John'], minChars: 0 };
	 * ```
	 *
	 * @class CKEDITOR.plugins.mentions.configDefinition
	 * @abstract
	 * @since 4.10.0
	 */

	/**
	 * Feed of items to be displayed in the mentions plugin.
	 *
	 * Essential option which should be configured to create correct mentions configuration definition.
	 * There are tree different ways to create data feed:
	 *
	 * * A simple array of text matches as synchronous data feed.
	 * * A backend URL string responding with a list of items in JSON format. This method utilizes asynchronous data feed.
	 * * A function allowing to use asynchronous callback to customize data source.
	 * Gives the freedom to use any data source depending on your implementation.
	 *
	 * # An array of text matches
	 * The easiest way to configure data feed is to provide an array of text matches.
	 * Mentions plugin will use synchronous data feed and create item IDs by itself.
	 * The biggest advantage of this method is its simplicity, although it's limited to synchronous data feed.
	 * Please see two other methods if you need more complex techniques to fetch text matches.
	 *
	 *```javascript
	 * var definition = { feed: ['Anna', 'Thomas', 'John'], minChars: 0 };
	 * ```
	 *
	 * By default query matching for an array feed is case insensitive.
	 * You can change this behavior by setting {@link #caseSensitive caseSensitive} property to `true`.
	 *
	 * # A backend URL string
	 * You can provide a backend URL string which will be used to fetch text matches from custom endpoint service.
	 * Each time when a user types matching text into an editor your backend service will be queried for text matches.
	 * Ajax URL request should response with an array of matches in JSON format. A URL response will appear in the mentions dropdown.
	 *
	 * A backend URL string features `encodedQuery` special variable replaced with a mentions query.
	 * `encodedQuery` variable allows you to create customized URL which can be both RESTful API compliant or any other
	 * URL which suits your needs. E.g. for query `@anna` and the given URL `/users?name={encodedQuery}` your endpoint
	 * service will be queried with `/users?name=anna`.
	 *
	 * ```javascript
	 * var definition = { feed: '/users?query={encodedQuery}' };
	 * ```
	 *
	 * # Function feed
	 * This method is recommended for advanced users who would like to take full control of the data feed.
	 * It allows you to provide data feed as an function which accepts two parameters: `options` and `callback`.
	 * Provided function will be called every time when user types matching text into an editor.
	 *
	 * The `options` object contains information about current query and a {@link #marker marker}.
	 *
	 * ```javascript
	 * { query: 'anna', marker: '@' }
	 * ```
	 *
	 * The `callback` argument should be used to pass an array of text match items into mentions instance.
	 *
	 * ```javascript
	 * callback( [ { id: 1, name: 'anna' }, { id: 2, name: 'annabelle' } ] );
	 * ```
	 *
	 * Depending on your use case, you can use this code as an example boilerplate to create your own function feed:
	 *
	 * ```javascript
	 * var definition = {
	 *		feed: function( opts, callback ) {
	 *			var xhr = new XMLHttpRequest();
	 *
	 *			xhr.onreadystatechange = function() {
	 *				if ( xhr.readyState == 4 ) {
	 *					if ( xhr.status == 200 ) {
	 *						callback( JSON.parse( this.responseText ) );
	 *					} else {
	 *						callback( [] );
	 *					}
	 *				}
	 *			}
	 *
	 *			xhr.open( 'GET', '/users?name=' + opts.query );
	 *			xhr.send();
	 *		}
	 * };
	 * ```
	 *
	 * **Other details**
	 *
	 * When using asynchronous method i.e. backend URL string or a function,
	 *  you should provide correct object structure containing unique item ID and a name.
	 *
	 * You can pass additional information also which can be used to create custom view template.
	 *
	 * ```javascript
	 * // Example of expected results from backend API.
	 * // `firstName` and `lastName` properties are optional.
	 * [
	 * 		{ id: 1, name: 'anna87', firstName: 'Anna', lastName: 'Doe' },
	 * 		{ id: 2, name: 'tho-mass', firstName: 'Thomas', lastName: 'Doe' },
	 * 		{ id: 3, name: 'ozzy', firstName: 'John', lastName: 'Doe' }
	 * ]
	 *
	 * // Setting custom view template by utilizing additional `firstname` and `lastname` attributes.
	 * var definition = {
	 *	 feed: backendApiFunction,
	 *	 template: '<li data-id="{id}><strong>{name}</strong><i>({firstName} {lastName})</i></li>'
	 * }
	 *
	 * ```
	 *
	 * @property {String/String[]/Function} feed
	 */

	/**
	 * Template used to render matches in the dropdown.
	 *
	 * A minimal template should be wrapped with HTML `li` element containing `data-id={id}` attribute.
	 * Template accepts `id` and `name` parameters.
	 * Also with {@link #feed asynchronous feed} you can pass additional parameters and use them inside template.
	 *
	 * ```javascript
	 * var definition = {
	 * 		feed: feed,
	 * 		template: '<li data-id={id}><img src="{iconSrc}" alt="{name}">{name}</li>'
	 * }
	 *
	 * ```
	 *
	 * @property {String} [template=CKEDITOR.plugins.autocomplete.view.itemTemplate]
	 */

	/**
	 * A character that should trigger autocompletion.
	 *
	 * @property {String} [marker='@']
	 */

	/**
	 * A number of characters that should follow the marker character in order to trigger mentions feature.
	 *
	 * @property {Number} [minChars=2]
	 */

	/**
	 * Indicates that mentions instance is character case sensitive for simple items feed i.e. array feed.
	 *
	 * Note that this will take no effect on feeds using callback or URLs, as in this case results are expected to
	 * be already filtered.
	 *
	 * @property {Boolean} [caseSensitive=false]
	 */

	/**
	 * Indicates if backend URL feed query responses will be cached.
	 *
	 * The cache is based on URL request and shared between all mentions instances (including different editors).
	 *
	 * @property {Boolean} [cache=false]
	 */

	/**
	 * Pattern used to match queries.
	 *
	 * Default pattern matches words with query including {@link #marker marker} and {@link #minChars minChars} properties.
	 *
	 * ```javascript
	 * // Match only words starting with "a".
	 * config.pattern = { feed: [ 'Anna', 'Thomas', 'Jack' ], pattern: /^a+\w*$/, marker: null };
	 * ```
	 *
	 * @property {RegExp} pattern
	 */
} )();
