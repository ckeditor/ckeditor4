/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* exported autocompleteUtils */

'use strict';

var autocompleteUtils = {
	generateData: function( object, prefix ) {
		return Object.keys( object ).sort().map( function( prop, index ) {
			return {
				id: index,
				name: prefix + prop
			};
		} );
	},

	getAsyncDataCallback: function( data ) {
		return function( query, range, callback ) {
			setTimeout( function() {
				callback(
					data.filter( function( item ) {
						return item.name.indexOf( query ) === 0;
					} )
				);
			}, Math.random() * 500 );
		};
	},

	getSyncDataCallback: function( data ) {
		return function( query, range, callback ) {
			callback(
				data.filter( function( item ) {
					return item.name.indexOf( query ) === 0;
				} )
			);
		};
	},

	getTextTestCallback: function( prefix, minChars, requireSpaceAfter ) {
		var matchPattern = createPattern();

		return function( range ) {
			if ( !range.collapsed ) {
				return null;
			}

			return CKEDITOR.plugins.textMatch.match( range, matchCallback );
		};

		function matchCallback( text, offset ) {
			var left = text.slice( 0, offset ),
				right = text.slice( offset ),
				match = left.match( matchPattern );

			if ( !match ) {
				return null;
			}

			if ( requireSpaceAfter ) {
				// Require space (or end of text) after the caret.
				if ( right && !right.match( /^\s/ ) ) {
					return null;
				}
			}

			return { start: match.index, end: offset };
		}

		function createPattern() {
			var pattern = prefix + '\\w';

			if ( minChars ) {
				pattern += '{' + minChars + ',}';
			} else {
				pattern += '*';
			}

			pattern += '$';

			return new RegExp( pattern );
		}
	}
};











