#!/bin/node

var fs = require( 'fs' ),
	path = require( 'path' ),
	destination = process.argv[2],
	YEAR = new Date().getFullYear(),
	ACCEPTED_FORMATS = [ '.html', '.txt', '.js', '.md', '.sh', '.css', '.py', '.less', '.php', '.rb' ],
	EXCLUDED_DIRS = [ '.git' ];

if ( !destination ) {
	console.log( 'Give the path to the directory of the repository.' );
	process.exit( 0 );
}

recursivelyUpdateLicenseDate( destination );

function recursivelyUpdateLicenseDate( filepath ) {
	if ( EXCLUDED_DIRS.indexOf( path.basename( filepath ) ) != -1 ) return;

	var stats = fs.statSync( filepath );

	if ( stats.isDirectory() ) {
		fs.readdirSync( filepath )
			.forEach( function( file ) {
				recursivelyUpdateLicenseDate( path.join( filepath, file ) );
			} );
	} else if ( ACCEPTED_FORMATS.indexOf( path.extname( filepath ) ) > -1 ) {
		updateLicenseDate( filepath );
	}
}

function updateLicenseDate( filepath ) {
	var data = fs.readFileSync( filepath, 'utf8' ),
		regexp = /(Copyright.*\d{4}.*-.*)\d{4}(.*CKSource)/gi,
		match = regexp.exec( data ),
		updated = false;

	while ( match != null ) {
		updated = true;
		data = data.replace( match[0], match[1] + YEAR + match[2] );
		match = regexp.exec( data );
	}

	if ( updated ) fs.writeFileSync( filepath, data );
}