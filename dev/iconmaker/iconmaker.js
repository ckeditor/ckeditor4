#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint browser: false, node: true */

'use strict';

var fs = require( 'fs' ),
	argv = require( 'optimist' ).argv,
	util = require( 'util' ),
	exec = require( 'child_process' ).exec,

	// The heart of the application.
	main = require( './lib/main' ),
	iconmaker = main.iconmaker,

	// This is the size of the icon that makes it default, placed in directory/icon.png
	// Other sizes are stored under directory/size/icon.png
	DEFAULT_SIZE = main.DEFAULT_SIZE,

	helpString = util.format( [
		'Usage: iconmaker (options) [extra options]\n\n',

		'\tThis program slices CKEditor iconsets into individual icons placed in various locations.\n\n',
		'\tIconmaker depends on:\n',
		'\t\t * Node.js (see: http://nodejs.org/)\n',
		'\t\t * ImageMagick\'s command-line tool named convert (see: http://www.imagemagick.org/script/convert.php).\n\n',

		'\tSample call (cold run first):\n\n',
		'\t\t./dev/iconmaker/iconmaker.js -i skins/moono/dev/icons16.png -l skins/moono/dev/locations.json -c\n\n',

		'Options:\n\n',

		'    -i FILE    input PNG file with the iconset\n',
		'    -l FILE    icon location JSON file\n',

		'\nExtra options:\n\n',

		'    -s    icon size (%s is default)\n',
		'    -c    cold run (no file is touched)\n',
		'    -h    this message\n'
	].join( '' ), DEFAULT_SIZE );

function gracefulFailure( error ) {
	console.error( '[!] %s', error.stack ? error.stack : error );
	console.error( '[i] Bye bye!' );
	process.exit( 1 );
}

// Display help on demand.
if ( argv.h ) {
	console.log( helpString );
	process.exit( 0 );
}

// Display help if mandatory arguments are missing.
else if ( !( argv.i && argv.l ) ) {
	console.log( helpString );
	process.exit( 1 );
}

// Check if convert is installed.
exec( 'convert -version', function( error ) {
	if ( error )
		gracefulFailure( 'Convert not found in PATH. See http://www.imagemagick.org/ for more help.' );
} );

// Check if PNG exist.
try {
	fs.statSync( argv.i );
} catch ( error ) {
	gracefulFailure( error );
}

// Load locations file.
fs.readFile( argv.l, function( error, locations ) {
	if ( error )
		gracefulFailure( error );

	try {
		iconmaker( argv.i, JSON.parse( locations ), argv.s || DEFAULT_SIZE, argv.c );
	} catch ( e ) {
		gracefulFailure( e );
	}
} );
