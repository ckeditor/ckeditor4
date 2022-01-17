/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint node: true */

var fs = require( 'fs' ),
	path = require( 'path' ),
	OLD_COMPANY_NAME_REGEXP = /(\[)?CKSource(\]\(.+?\))? - Frederico Knabben/gi,
	COMPANY_NAME = 'CKSource Holding sp. z o.o',
	YEAR = new Date().getFullYear(),
	ACCEPTED_FORMATS = [ '.html', '.txt', '.js', '.md', '.sh', '.css', '.py', '.less', '.php', '.rb' ],
	EXCLUDED_DIRS = [ '.git', 'node_modules', 'release', 'coverage' ];

recursivelyUpdateLicenseDate( getExecutionPath() );

function getExecutionPath() {
	return process.argv[ 2 ] || path.join( __dirname, '../..' );
}

function recursivelyUpdateLicenseDate( filepath ) {
	if ( EXCLUDED_DIRS.indexOf( path.basename( filepath ) ) != -1 ) {
		return;
	}

	var stats = fs.statSync( filepath );

	if ( stats.isDirectory() ) {
		fs.readdirSync( filepath )
			.forEach( function( file ) {
				recursivelyUpdateLicenseDate( path.join( filepath, file ) );
			} );
	} else if ( ACCEPTED_FORMATS.indexOf( path.extname( filepath ) ) > -1 ) {
		updateLicenseBanner( filepath );
	}
}

function updateLicenseBanner( filepath ) {
	var data = fs.readFileSync( filepath, 'utf8' ),
		bannerRegexp = /(Copyright.*\d{4}.*-.*)\d{4}(.*CKSource.*\.)/gi,
		bannerMatch = bannerRegexp.exec( data ),
		updated = false,
		companyNamePart;

	while ( bannerMatch != null ) {
		updated = true;
		companyNamePart = bannerMatch[ 2 ];

		if ( OLD_COMPANY_NAME_REGEXP.test( companyNamePart ) ) {
			companyNamePart = companyNamePart.replace( OLD_COMPANY_NAME_REGEXP, '$1' + COMPANY_NAME + '$2' );
		}

		data = data.replace( bannerMatch[ 0 ], bannerMatch[ 1 ] + YEAR + companyNamePart );
		bannerMatch = bannerRegexp.exec( data );
	}

	if ( updated ) {
		fs.writeFileSync( filepath, data );
	}
}
