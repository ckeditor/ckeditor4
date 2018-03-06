/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {

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

	function Mentions( editor, config ) {
		var feed = config.feed,
			template = config.template;

		this.marker = config.marker || '@';
		this.minChars = isNotDefined( config.minChars ) ? 2 : config.minChars;

		this.autocomplete = new CKEDITOR.plugins.autocomplete( editor, getTextTestCallback( this.marker, this.minChars ), getDataCallback( feed, this.marker ) );

		template && this.changeViewTemplate( template );
	}

	Mentions.prototype = {
		destroy: function() {
			this.autocomplete.destroy();
		},
		changeViewTemplate( template ) {
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
				var encodedQueryRegex = new RegExp( '{encodedQuery}', 'g' ),
					encodedUrl = feed.replace( encodedQueryRegex, query );

				CKEDITOR.ajax.load( encodedUrl, function( data ) {
					callback( JSON.parse( data ) );
				} );
			}
			// Feed is a function using callback to pass data to through autocomplete plugin e.g. callback( [ { id: 1, name: 'anna81', firstName: 'Anna', lastName: 'Doe' } ] ).
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

	function isNotDefined( prop ) {
		return prop == null || prop == undefined;
	}

	CKEDITOR.plugins.mentions = Mentions;

	CKEDITOR.config.mentions = [];

} )();
