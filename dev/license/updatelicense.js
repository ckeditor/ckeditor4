/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint node: true */

var fs = require( 'fs' ),
	path = require( 'path' ),
	execSync = require( 'child_process' ).execSync,
	dirname = require( 'path' ).dirname,
	OLD_COMPANY_NAME_REGEXP = /(\[|<a.+?>)?CKSource(\]\(.+?\)|<\/a>)?\s*?(?:-|&ndash;)? Holding/gi,
	NEW_COMPANY_NAME_REPLACEMENT = '$1CKSource$2 Holding',
	YEAR = new Date().getFullYear(),
	ACCEPTED_FORMATS = [
		'.css',
		'.html',
		'.js',
		'.json',
		'.jsx',
		'.less',
		'.md',
		'.php',
		'.py',
		'.rb',
		'.sh',
		'.ts',
		'.tsx',
		'.txt'
	],
	EXCLUDED_DIRS = [ '.git', 'node_modules', 'release', 'coverage' ];

recursivelyUpdateLicenseDate( getExecutionPath() );

function getExecutionPath() {
	return process.argv[ 2 ] || path.join( __dirname, '../..' );
}

function recursivelyUpdateLicenseDate( filepath ) {
	if ( EXCLUDED_DIRS.indexOf( path.basename( filepath ) ) != -1 ) {
		return;
	}

	var stats = fs.lstatSync( filepath );

	if ( stats.isSymbolicLink() ) {
		return;
	}

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
	if ( checkIsGitSubmodule( filepath ) || checkIsGitIgnored( filepath ) ) {
		return;
	}

	console.log( 'Updating ' + filepath );

	var data = fs.readFileSync( filepath, 'utf8' ),
		bannerRegexp = /(Copyright.*\d{4}.*-.*)\d{4}(.*CKSource)/gi,
		bannerMatch = bannerRegexp.exec( data ),
		updated = false;

	if ( OLD_COMPANY_NAME_REGEXP.test( data ) ) {
		updated = true;
		data = data.replace( OLD_COMPANY_NAME_REGEXP, NEW_COMPANY_NAME_REPLACEMENT );
	}

	while ( bannerMatch != null ) {
		updated = true;
		data = data.replace( bannerMatch[ 0 ], bannerMatch[ 1 ] + YEAR + bannerMatch[ 2 ] );
		bannerMatch = bannerRegexp.exec( data );
	}

	if ( updated ) {
		fs.writeFileSync( filepath, data );
	}
}

function checkIsGitSubmodule( filepath ) {
	try {
		var isSubmodule = execSync( 'git rev-parse --show-superproject-working-tree', {
			cwd: dirname( filepath )
		} );

		return isSubmodule.length > 0;
	} catch ( e ) {
		return false;
	}
}

function checkIsGitIgnored( filepath ) {
	try {
		var isIgnored = execSync( 'git check-ignore "' + filepath + '"', {
			cwd: getExecutionPath()
		} );

		return isIgnored.length > 0;
	} catch ( e ) {
		return false;
	}
}
