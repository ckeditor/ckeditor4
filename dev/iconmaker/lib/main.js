/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint browser: false, node: true */

'use strict';

var path = require( 'path' ),
	exec = require( 'child_process' ).exec,
	fs = require( 'fs' ),
	util = require( 'util' ),
	png = require( 'png-js' ),
	tmp = require( 'tmp' ),
	q = require( 'q' ),
	mkdir = require( 'mkdirp' ).sync,
	convertTpl = 'convert %s -crop %sx%s+%s+%s +repage -sharpen 0x1.0 png32:%s',

	DEFAULT_SIZE = 16;

tmp.setGracefulCleanup();

function iconmaker( png, locations, size, cold ) {
	console.log( '[i] Starting extraction.' );

	var chain = q.resolve( { total: 0, updated: 0 } );

	for ( var row in locations ) {
		( function( row ) {
			chain = chain.then( function( stats ) {
				return extractIconArray( { png: png, size: size, cold: cold ? '[C]' : '' }, locations[ row ], parseInt( row, 10 ), stats );
			} );
		} )( row );
	}

	chain = chain.then( function( stats ) {
		console.log( '[i] Done:' );
		console.log( '    * Icons checked: %s', stats.total );
		console.log( '    * Icons updated: %s', stats.updated );
	} );
}

function extractIconArray( that, array, row, stats, forceColumn ) {
	var chain = q.resolve( stats );

	array.forEach( function( element, column ) {
		chain = chain.then( function( stats ) {
			if ( element instanceof Array )
				return extractIconArray( that, element, row, stats, column );
			else {
				column = typeof forceColumn != 'undefined' ? forceColumn : column;

				return extractIcon( that, element, row, column, stats );
			}
		} );
	} );

	return chain;
}

function extractIcon( that, iconPath, row, column, stats ) {
	var deferred = q.defer(),

		size = that.size,
		cold = that.cold,
		png = that.png,

		// If size is non-standard, check if a new directory needs to be created.
		// Determine size directory, i.e. icons/32
		dirName = path.join( path.dirname( iconPath ), size != DEFAULT_SIZE ? 'hidpi' : '' ),
		fileName = path.basename( iconPath );

	// Update icon path because dirName may have changed.
	iconPath = path.join( dirName, fileName );

	// Create temp file. This file will store the extracted
	// icon until program decides if it should replace the old one.
	tmp.file( { prefix: 'iconmaker', postfix: 'png' }, function( error, tmpIconPath ) {
		if ( error )
			throw error;

		var command = util.format( convertTpl, png, size, size, 2 * column * size, 2 * row * size, tmpIconPath );

		// Extract the icon to temporary file using convert utiility.
		exec( command, function() {
			// Check if extracted icon is different than the old one.
			compareIcons( iconPath, tmpIconPath, function( areSame ) {
				console.log( '[i] Checking for changes of (%s,%s): %s', row, column, iconPath );

				if ( !fs.existsSync( iconPath ) )
					console.error( '    [W] Icon %s doesn\'t exist.', iconPath );

				// Icons differ. Will be updated.
				if ( !areSame )
					updateIcon( iconPath, tmpIconPath, dirName, cold );

				deferred.resolve( { total: stats.total + 1, updated: stats.updated + !areSame } );
			} );
		} );
	} );

	return deferred.promise;
}

function updateIcon( iconPath, tmpIconPath, dirName, cold ) {
	console.log( '    [+] Icon %s needs update.', iconPath );

	// Check if size directory exists.
	if ( !fs.existsSync( dirName ) ) {
		console.log( '       %s Creating directory %s', cold, dirName );

		// Create directory if doesn't exist.
		!cold && mkdir( dirName );
	}

	console.log( '       %s Moving new icon to %s', cold, iconPath );

	// Move new icon so it updates the old one.
	!cold && fs.createReadStream( tmpIconPath ).pipe( fs.createWriteStream( iconPath ) );
}

function compareIcons( icon1, icon2, callback ) {
	try {
		fs.statSync( icon1 );
	} catch ( error ) {
		// File doesn't exists. This is a new icon. So yes, it's different.
		return callback( false );
	}

	png.decode( icon1, function( pixels1 ) {
		png.decode( icon2, function( pixels2 ) {
			if ( pixels1.length != pixels2.length )
				return callback( false );

			for ( var i = pixels1.length ; i-- ; ) {
				if ( pixels1[ i ] !== pixels2[ i ] )
					return callback( false );
			}

			return callback( true );
		} );
	} );
}

module.exports = {
	DEFAULT_SIZE: DEFAULT_SIZE,
	iconmaker: iconmaker
};
