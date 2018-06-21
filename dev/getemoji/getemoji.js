/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint ignore:start */

const https = require( 'https' );
const fs = require( 'fs' );
const path = require( 'path' );

( () => {

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
			const rows = rawData.match( /<tr>[\s\S]*?<\/tr>/g ).filter( item => item.match( /class=\'rchars\'>\d+/ ) ) ;
			for ( const row of rows ) {
				const [ full, id, symbol, name, keywords ] = row.match( /class=\'rchars\'>(\d+)[\s\S]*<img alt=\'([^\']+?)\'[\s\S]*class=\'name\'>([^<]+)[\s\S]*class=\'name\'>([^<]*)/ );
				if ( name.indexOf( '⊛' ) !== -1 ) {
					continue;
				}
				ret.push( {
					id: ':' + name.replace( / /g, '_' ).replace( /,/g, '' ) + ':',
					symbol
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
