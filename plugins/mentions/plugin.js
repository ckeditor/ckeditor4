/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
	var MARKER = '@',
		MIN_CHARS = 2,
		ENCODED_QUERY = '{encodedQuery}';

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
	 * Mentions plugin allows you to type custom marker character and get suggested values for the text matches so that you don't have to write it on your own.
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
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#caseSensitive caseSensitive}
		 *
		 * @property {Boolean} [caseSensitive=false]
		 * @readonly
		 */
		this.caseSensitive = config.caseSensitive;

		/**
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#marker marker}
		 *
		 * @property {String} [marker='@']
		 * @readonly
		 */
		this.marker = config.marker || MARKER;

		/**
		 * See {@link CKEDITOR.plugins.mentions.configDefinition#minChars minChars}
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
		 * {@link CKEDITOR.plugins.autocomplete Autocomplete} instance used by mentions feature to implement autocompletion logic.
		 *
		 * @property {CKEDITOR.plugins.autocomplete}
		 * @private
		 */
		this._autocomplete = new CKEDITOR.plugins.autocomplete( editor,
			getTextTestCallback( this.marker, this.minChars ),
			getDataCallback( feed, this.marker, this.caseSensitive ) );

		if ( this.template ) {
			this.changeViewTemplate( this.template );
		}
	}

	Mentions.prototype = {

		/**
		 * Destroys the mentions instance.
		 * View element and event listeners will be removed from the DOM.
		 */
		destroy: function() {
			this._autocomplete.destroy();
		},

		/**
		 * Changes the view template. The given template will be used to render matches in the dropdown.
		 *
		 * @param {String} template
		 */
		changeViewTemplate: function( template ) {
			this._autocomplete.view.itemTemplate = new CKEDITOR.template( template );
		}
	};

	function getTextTestCallback( marker, minChars ) {
		var matchPattern = createPattern();

		return function( range ) {
			if ( !range.collapsed ) {
				return null;
			}

			return CKEDITOR.plugins.textMatch.match( range, matchCallback );
		};

		function matchCallback( text, offset ) {
			var match = text.slice( 0, offset )
				.match( matchPattern );

			if ( !match ) {
				return null;
			}

			return {
				start: match.index,
				end: offset
			};
		}

		function createPattern() {
			var pattern = '[' + marker + ']\\w';

			if ( minChars ) {
				pattern += '{' + minChars + ',}';
			} else {
				pattern += '*';
			}

			pattern += '$';

			return new RegExp( pattern );
		}
	}

	function getDataCallback( feed, marker, caseSensitive ) {
		return function( query, range, callback ) {
			// We are removing marker here to give clean query result for the endpoint callback.
			if ( marker ) {
				query = query.replace( marker, '' );
			}

			// Array feed.
			if ( CKEDITOR.tools.array.isArray( feed ) ) {
				arrayFeed();
				// Url feed.
			} else if ( typeof feed === 'string' ) {
				urlFeed();
				// Function feed.
			} else {
				feed( { query: query, marker: marker }, resolveData );
			}

			function arrayFeed() {
				var data = indexFeed( feed ).filter( function( item ) {
					var itemName = item.name;

					if ( !caseSensitive ) {
						itemName = itemName.toLowerCase();
						query = query.toLowerCase();
					}

					return itemName.indexOf( query ) === 0;
				} );

				resolveData( data );
			}

			function urlFeed() {
				var encodedQueryRegex = new RegExp( ENCODED_QUERY, 'g' ),
					encodedUrl = feed.replace( encodedQueryRegex, encodeURIComponent( query ) );

				CKEDITOR.ajax.load( encodedUrl, function( data ) {
					resolveData( JSON.parse( data ) );
				} );
			}

			function resolveData( data ) {
				if ( !data ) {
					return;
				}

				// We don't want to change item data, so lets create new one.
				var newData = CKEDITOR.tools.array.map( data, function( item ) {
					var name = marker + item.name;
					return CKEDITOR.tools.object.merge( item, { name: name } );
				} );

				callback( newData );
			}

			function indexFeed( feed ) {
				var index = 1;
				return CKEDITOR.tools.array.reduce( feed, function( current, name ) {
					current.push( { name: name, id: index++ } );
					return current;
				}, [] );
			}
		};
	}

	CKEDITOR.plugins.mentions = Mentions;

	/**
	 * List of mentions configuration objects.
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
	 * @cfg {CKEDITOR.plugins.mentions.configDefinition[]} [=[]]
	 * @since 4.10.0
	 * @member CKEDITOR.config
	 */

	/**
	 * Abstract class describing the definition of a {@link CKEDITOR.plugins.mentions mentions} plugin configuration.
	 *
	 * This virtual class illustrates the properties that developers can use to define and create
	 * mentions configuration definition.
	 *
	 * A mentions definition object represents an object as a set of properties defining a mentions data feed and it's optional parameters.
	 *
	 * Simple usage:
	 *
	 * ```javascript
	 * var definition = { feed: ['Anna', 'Thomas', 'John'], minChars: 0, marker: '#', caseSensitive: true };
	 * ```
	 *
	 * Essential option which should be configured to create correct mentions configuration definition is its data feed. There are different ways to create data feed:
	 *
	 * * Simple list of text matches as synchronous data feed.
	 * * Backend URL to get the list of items in JSON format using asynchronous data feed.
	 * * Function with signature `opts:Object, callback:Function` allowing to use asynchronous callback to pass data from custom data source into mentions instance.
	 *
	 * # Simple list of data
	 * The easiest way to configure data feed is to simply provide a list of text matches. Mentions plugin will use synchronous data feed and create item IDs by itself.
	 *
	 *```javascript
	 * var definition = { feed: ['Anna', 'Thomas', 'John'], minChars: 0, marker: '#' };
	 * ```
	 *
	 * More complex case allows you to use an asynchronous feed to get a list of the items. You could pass URL string to fetch text matches or use an asynchronous callback to load data by yourself.
	 *
	 * # URL string
	 * URL string features `encodedQuery` special variable that will be replaced with URL encoded query of current mentions query. Requested backend URL should response with JSON of matches
	 * that should appear in the dropdown.
	 *
	 * ```javascript
	 * var definition = { feed: '/user-controller/get-list/{encodedQuery}' };
	 * ```
	 *
	 * # Function
	 * If you want to get full control of how you feeding mentions feature with data you should take a look at a functional version of the feed.
	 * It allows you to query the data source and use a callback function to pass data into mentions instance.
	 *
	 * ```javascript
	 * var definition = {
	 *		feed: function( opts, callback ) {
	 *			callMyBackend( opts.query, function( results ) {
	 *				callback( results );
	 *			} );
	 *		}
	 * };
	 * ```
	 *
	 * `opts` object contains information about current mentions query and a {@link CKEDITOR.plugins.mentions#marker marker}.
	 *
	 * In both situations - using URL string or a function, you should provide correct object structure containing unique item ID and a name.
	 * You can pass additional information also which can be used to create custom view template.
	 *
	 * ```javascript
	 * // Example of expected results from backend API. `firstName` and `lastName` properties are optional.
	 * [
	 * 		{ id: 1, name: 'anna87', firstName: 'Anna', lastName: 'Doe' },
	 * 		{ id: 2, name: 'tho-mass', firstName: 'Thomas', lastName: 'Doe' },
	 * 		{ id: 3, name: 'ozzy', firstName: 'John', lastName: 'Doe' }
	 * ]
	 *
	 * // Custom mentions configuration definition taking advantage of additional `firstName` and `lastName` properties by setting custom view template.
	 * var definition = {
	 *	 feed: backendApiFunction,
	 *	 template: '<li data-id="{id}>{name} ({firstName} {lastName})</li>'
	 * }
	 *
	 * ```
	 *
	 * @class CKEDITOR.plugins.mentions.configDefinition
	 * @abstract
	 * @since 4.10.0
	 */

	/**
	 * Feed of items to be displayed in mentions plugin.
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
} )();
