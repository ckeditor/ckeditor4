/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */


( function() {
	'use strict';

	var DATA = [
		{ id: 1, name: '@john' },
		{ id: 2, name: '@thomas' },
		{ id: 3, name: '@anna' },
		{ id: 4, name: '@cris' },
		{ id: 5, name: '@julia' }
	];

	window.autocompleteUtils = {

		getTextTestCallback: function( config ) {
			config = config || {};
			return function( range ) {
				return CKEDITOR.plugins.textMatch.match( range, matchCallback );
			};

			function matchCallback( text, offset ) {
				var left = text.slice( 0, offset ),
					match = left.match( new RegExp( config.regex || '@\\w*$' ) );

				if ( !match ) {
					return null;
				}

				return { start: match.index, end: offset };
			}
		},

		getDataCallback: function( config ) {
			config = config || {};

			var dataSource = config.data || DATA;

			return function( matchInfo, callback ) {
				var data = dataSource.filter( function( item ) {
					return item.name.indexOf( matchInfo.query.toLowerCase() ) == 0;
				} );

				setTimeout( function() {
					callback( data );
				}, config.async || 0 );
			};
		}
	};
} )();
