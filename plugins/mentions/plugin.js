/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
	var MARKER = '@', MIN_CHARS = 2, ENCODED_QUERY = '{encodedQuery}'

	CKEDITOR.plugins.add( 'mentions', {
		requires: 'autocomplete,textmatch,ajax',
		instances: [],
		init: function( editor ) {
			var self = this;

			editor.on( 'instanceReady', function() {
				var mentions = editor.config.mentions || CKEDITOR.config.mentions;

				CKEDITOR.tools.array.forEach( mentions, function( config ) {
					self.instances.push( new Mentions( editor, config ) );
				} );
			} );
		},
	} );

	/**
	 * Mentions plugin allows you to type custom marker character and get suggested values for the usernames so that you don't have to write it on your own.
	 * Of course, you could use any source of data, but the plugin has been created in thoughts of users data.
	 *
	 * The recommended way to add mentions feature to an editor is by
	 * using {@link CKEDITOR.config#mentions} configuration property or pass it as the configuration option when instantiating an editor.
	 *
	 * ```javascript
	 * // Simple usage with CKEDITOR.config.mentions property.
	 * CKEDITOR.config.mentions = [ { feed: ['Anna', 'Thomas', 'John'], minChars: 0, marker: '#' } ];
	 *
	 * // Passing mentions configuration when creating editor.
	 * CKEDITOR.replace( 'editor', {
	 * 		mentions: [ { feed: ['Anna', 'Thomas', 'John'], minChars: 0, marker: '#' } ]
	 * } );
	 * ```
	 *
	 * There are different ways to feed mentions with users data.
	 *
	 * * Simple list of usernames, mentions plugin will use synchronous data feed.
	 * * Backend URL to get the list of users in JSON format using asynchronous data feed.
	 * * Function with signature `opts:Object, callback:Function` allowing you to use asynchronous callback to pass data from custom source to mentions instance.
	 *
	 * # Simple list of usernames
	 * The easiest way is to simply provide a list of usernames. Mentions plugin will use synchronous data feed and create user IDs by itself.
	 *
	 *```javascript
	 * CKEDITOR.replace( 'editor', {
	 * 		mentions: [ { feed: ['Anna', 'Thomas', 'John'], minChars: 0, marker: '#' } ]
	 * } );
	 * ```
	 *
	 * More complex case allows you to use an asynchronous feed to get a list of the users. You could pass URL string to fetch users data or use an asynchronous callback to load data by yourself.
	 *
	 * # URL string
	 * URL string features `encodedQuery` special variable that will be replaced with URL encoded query of current mentions query. Requested backend URL should response with JSON of matches
	 * that should appear in the dropdown.
	 *
	 * ```javascript
	 * {
	 * 		mentions: [ { feed: '/user-controller/get-list/{encodedQuery}' } ]
	 * }
	 * ```
	 * # Function
	 * If you want full control of how you feeding mentions feature with data you should take a look at a functional version of the feed.
	 * It allows you to query the data source and use a callback function to pass data to mentions autocomplete.
	 *
	 * ```javascript
	 * {
	 * 	mentions: [
	 * 		{
	 * 				feed: function( opts, callback ) {
	 * 					callMyBackend( opts.query, function( results ) {
	 * 						callback( results );
	 * 					} );
	 * 				}
	 * 			}
	 * 	]
	 * }
	 * ```
	 * `opts` object contains information about current mentions query and a {@link CKEDITOR.plugins.mentions#marker marker}.
	 *
	 * In both situations - using URL string or a function, you should provide correct object structure containing unique user id and a name.
	 * You can pass additional information also which can be used to create custom view template.
	 *
	 * ```javascript
	 * // Results from backend API.
	 * [
	 * 		{ id: 1, name: 'anna87', firstName: 'Anna', lastName: 'Doe' },
	 * 		{ id: 2, name: 'tho-mass', firstName: 'Thomas', lastName: 'Doe' },
	 * 		{ id: 3, name: 'ozzy', firstName: 'John', lastName: 'Doe' }
	 * ]
	 *
	 * // Mentions configuration.
	 * {
	 * 		mentions: [
	 * 			{
	 * 				feed: backendApiFunction,
	 * 				template: '<li data-id="{id}>{name} ({firstName} {lastName})</li>'
	 * 			}
	 * 		]
	 * }
	 * ```
	 *
	 * @class CKEDITOR.plugins.mentions
	 * @constructor Creates the new instance of mentions and attaches it to the editor using {@link CKEDITOR.plugins.autocomplete Autocomplete feature}.
	 * @param {CKEDITOR.editor} editor The editor to watch.
	 * @param {Object} config Configuration object keeping information how to instantiate mentions plugin.
	 * @param {Number} [config.minChars=2] A number of characters that should follow the marker character in order to trigger mentions feature.
	 * @param {String} [config.marker='@'] A character that should trigger autocompletion.
	 * @param {String} [config.template=CKEDITOR.plugins.autocomplete.view.itemTemplate] Template used to render matches in the dropdown.
	 * @param {String/String[]/Function} config.feed Feed of items to be displayed in mentions plugin.
	 */
	function Mentions( editor, config ) {
		var feed = config.feed,
			template = config.template;

		/**
		 * A character that should trigger autocompletion.
		 * @property {String} [marker='@']
		 */
		this.marker = config.marker || MARKER;

		/**
		 * A number of characters that should follow the marker character in order to trigger mentions feature.
		 * @property {Number} [minChars=2]
		 */
		this.minChars = config.minChars !== null && config.minChars !== undefined ? config.minChars : MIN_CHARS;

		/**
		 * {@link CKEDITOR.plugins.autocomplete Autocomplete} instance used by mentions feature to implement autocompletion logic.
		 * @readonly
		 * @property {CKEDITOR.plugins.autocomplete}
		 */
		this.autocomplete = new CKEDITOR.plugins.autocomplete( editor, getTextTestCallback( this.marker, this.minChars ), getDataCallback( feed, this.marker ) );

		template && this.changeViewTemplate( template );
	}

	Mentions.prototype = {

		/**
		 * Destroys the mentions instance.
		 * View element and event listeners will be removed from the DOM.
		 */
		destroy: function() {
			this.autocomplete.destroy();
		},

		/**
		 * Changes the view template. The given template will be used by {@link CKEDITOR.template}.
		 * @param {String} template
		 */
		changeViewTemplate: function( template ) {
			this.autocomplete.view.itemTemplate = new CKEDITOR.template( template )
		}
	}

	function getTextTestCallback( marker, minChars ) {
		var matchPattern = createPattern();

		return function( range ) {
			if ( !range.collapsed ) {
				return null;
			}

			return CKEDITOR.plugins.textMatch.match( range, matchCallback );
		};

		function matchCallback( text, offset ) {
			var match = text.slice( 0, offset ).match( matchPattern );

			if ( !match ) {
				return null;
			}

			return { start: match.index, end: offset };
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

	function getDataCallback( feed, marker ) {
		return function( query, range, callback ) {
			// We are removing marker here to give clean query result for the endpoint callback.
			if ( marker ) {
				query = query.replace( marker, '' );
			}

			callback = getDataCallbackWithMarkedItems( marker, callback );

			// Feed is a simple array e.g. [ 'Anna', 'John', 'Thomas' ].
			if ( CKEDITOR.tools.array.isArray( feed ) ) {
				callback(
					indexFeed( feed ).filter( function( item ) {
						return item.name.indexOf( query ) === 0;
					} )
				);
			}
			// Feed is a URL to be requested for a JSON of matches e.g. `/user-controller/get-list/{encodedQuery}`.
			else if ( typeof feed === 'string' ) {
				var encodedQueryRegex = new RegExp( ENCODED_QUERY, 'g' ),
					encodedUrl = feed.replace( encodedQueryRegex, query );

				CKEDITOR.ajax.load( encodedUrl, function( data ) {
					callback( JSON.parse( data ) );
				} );
			}
			// Feed is a function using callback to pass data through autocomplete plugin e.g.
			//
			// function dataSource( { query: query, marker: marker }, callback ) {
			// 		callMyBackend( query, function( results ) {
			// 			callback( results )
			// 		} );
			// }
			else {
				feed( { query: query, marker: marker }, callback );
			}
		}
	}

	function getDataCallbackWithMarkedItems( marker, callback ) {
		return function( data ) {
			if ( !data ) {
				return;
			}

			// We don't want to change user data, so lets create new one.
			var newData = CKEDITOR.tools.array.map( data, function( item ) {
				var markedName = marker + item.name;
				return CKEDITOR.tools.object.merge( item, { name: markedName } );
			} );

			callback( newData );
		}
	}

	function indexFeed( feed ) {
		var index = 1;
		return CKEDITOR.tools.array.reduce( feed, function( current, name ) {
			current.push( { name: name, id: index++ } );
			return current;
		}, [] );
	}

	CKEDITOR.plugins.mentions = Mentions;

	/**
	 * List of mentions configuration objects.
	 * For each configuration object new {@link CKEDITOR.plugins.mentions Mentions} instance will be created and attached to an editor.
	 *
	 * @cfg
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.mentions = [];

} )();
