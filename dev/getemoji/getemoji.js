/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint ignore:start */

const https = require( 'https' );
const fs = require( 'fs' );
const path = require( 'path' );

( () => {
	const GROUP_NAMES = {
		PEOPLE: 'people',
		NATURE: 'nature',
		FOOD: 'food',
		ACTIVITIES: 'activities',
		TRAVEL: 'travel',
		OBJECTS: 'objects',
		SYMBOLS: 'symbols',
		FLAGS: 'flags',
		IGNORE: null
	}
	const groupMap = {
		smileys: GROUP_NAMES.PEOPLE,
		people: GROUP_NAMES.PEOPLE,
		component: GROUP_NAMES.IGNORE,
		'animals_&amp;_nature': GROUP_NAMES.NATURE,
		'food_&amp;_drink': GROUP_NAMES.FOOD,
		'travel_&amp;_places': GROUP_NAMES.TRAVEL,
		activities: GROUP_NAMES.ACTIVITIES,
		objects: GROUP_NAMES.OBJECTS,
		symbols: GROUP_NAMES.SYMBOLS,
		flags: GROUP_NAMES.FLAGS
	}
	https.get( 'https://unicode.org/emoji/charts/emoji-list.html', response => {
		if ( response.statusCode !== 200 ) {
			throw new Error( 'Wrong status code' );
		}

		response.setEncoding( 'utf8' );
		let rawData = '';
		const ret = [];

		response.on( 'data', chunk => {
			rawData += chunk
		} );
		response.on( 'end', () => {
			let currentGroup = null;
			const rows = rawData.match( /<tr>[\s\S]*?<\/tr>/g );
			for ( const row of rows ) {
				if ( row.match( /class=\'bighead\'/ ) ) {
					currentGroup = groupMap[ row.match( /name=\'([^\']+)\'/ )[ 1 ] ] // Transform group names on page into groups used in emoji plugin.
				}
				if ( !row.match( /class=\'rchars\'>\d+/ ) ) {
					continue;
				}
				const [ full, id, symbol, name, keywords ] = /class=\'rchars\'>(\d+)[\s\S]*<img alt=\'([^\']+?)\'[\s\S]*class=\'name\'>([^<]+)[\s\S]*class=\'name\'>([^<]*)/.exec( row )
				if ( name.indexOf( '⊛' ) !== -1 || currentGroup === GROUP_NAMES.IGNORE ) {
					continue;
				}
				ret.push( {
					id: ':' + name.replace( / /g, '_' ).replace( /[:,]/g, '' ).toLowerCase() + ':',
					symbol,
					group: currentGroup,
					keywords: ( keywords.split( '|' ) || [] ).map( item => item.trim() )
				} );
			}
			fs.writeFile( path.join( __dirname, '..', '..', 'plugins', 'emoji', 'emoji.json' ), JSON.stringify( ret ), err => {
				if ( err ) {
					throw new Error( 'Something went wrong :(' + err );
				} else {
					console.log( 'Writing emoji complete' );
				}
			} );
		} );
	} );


} )();

/* jshint ignore:end */
