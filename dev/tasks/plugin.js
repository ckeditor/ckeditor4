/* jshint node: true, browser: false, es3: false */

'use strict';

var fs = require( 'fs' );

module.exports = function( grunt ) {
	grunt.registerTask( 'plugin-install', 'Installs external plugin in the plugins/ directory.', function( pluginName ) {
		var externalDir = grunt.config.get( 'plugin.externalDir' ),
			installationDir = grunt.config.get( 'plugin.installationDir' ),
			externalPluginDir = externalDir + pluginName,
			installationPluginDir = installationDir + pluginName;

		if ( !pluginName ) {
			grunt.fail.fatal( 'Name of the plugin must be specified.' );
		}
		if ( !grunt.file.isDir( externalPluginDir ) ) {
			grunt.fail.fatal( 'The "' + externalPluginDir + '" directory must exist.' );
		}
		if ( !grunt.file.isFile( externalPluginDir + '/plugin.js' ) ) {
			grunt.fail.warn( 'The "' + externalPluginDir + '/plugin.js" file should exist.' );
		}
		if ( pathExists( installationPluginDir ) ) {
			grunt.fail.warn( 'The "' + pluginName + '" plugin is already installed.' );
		}

		grunt.log.verbose.writeln( 'Trying to create a symlink...' );
		try {
			fs.symlinkSync( externalPluginDir, installationPluginDir );
			grunt.log.verbose.ok( 'Created a symlink.' );
		} catch ( e ) {
			grunt.log.error( e.message );
			grunt.fail.fatal( 'Error when creating a symlink.' );
		}

		grunt.log.verbose.writeln( 'Trying to add the plugin to files ignored by Git...' );
		try {
			addPluginDirToGitExclude( installationPluginDir );
			grunt.log.verbose.ok( 'Added plugin to files ignored by Git.' );
		} catch ( e ) {
			grunt.log.error( e.message );
			grunt.fail.fatal( 'Error when creating a symlink.' );
		}

		grunt.log.ok( 'Installed plugin "' + pluginName + '" in "' + installationPluginDir + '" directory.' );
	} );

	grunt.registerTask( 'plugin-uninstall', 'Uninstalls external plugin from the plugins/ directory.', function( pluginName ) {
		var installationDir = grunt.config.get( 'plugin.installationDir' ),
			installationPluginDir = installationDir + pluginName;

		if ( !pluginName ) {
			grunt.fail.fatal( 'Name of the plugin must be specified.' );
		}
		if ( !pathExists( installationPluginDir ) ) {
			grunt.fail.writeln( 'The "' + pluginName + '" plugin is not installed.' );
			return;
		}
		if ( !isSymlink( installationPluginDir ) ) {
			grunt.fail.warn( 'The "' + installationPluginDir + '" directory is not a symlink so plugin cannot be removed.' );
		}

		grunt.log.verbose.writeln( 'Trying to remove a symlink...' );
		try {
			fs.unlink( installationPluginDir );
			grunt.log.verbose.ok( 'Removed a symlink.' );
		} catch ( e ) {
			grunt.log.error( e.message );
			grunt.fail.fatal( 'Error when removing a symlink.' );
		}

		grunt.log.verbose.writeln( 'Trying to remove the plugin from files ignored by Git...' );
		try {
			removePluginDirFromGitExclude( installationPluginDir );
			grunt.log.verbose.ok( 'Added plugin to files ignored by Git.' );
		} catch ( e ) {
			grunt.log.error( e.message );
			grunt.fail.fatal( 'Error when creating a symlink.' );
		}

		grunt.log.ok( 'Uninstalled plugin "' + pluginName + '" from "' + installationPluginDir + '" directory.' );
	} );


	// Grunt.file.* methods does not understand symlinks, neither fs.exists, so using the lstat.
	function pathExists( path ) {
		try {
			fs.lstatSync( path );
		} catch ( e ) {
			return false;
		}
		return true;
	}

	function isSymlink( path ) {
		try {
			return fs.lstatSync( path ).isSymbolicLink();
		} catch ( e ) {
			return false;
		}
		return false;
	}

	function addPluginDirToGitExclude( pluginDir ) {
		var excludedPaths = getGitExclude();

		if ( excludedPaths.indexOf( pluginDir ) > -1 ) {
			return;
		}

		excludedPaths.push( pluginDir );

		grunt.file.write( '.git/info/exclude', excludedPaths.join( '\n' ) + '\n' );
	}

	function removePluginDirFromGitExclude( pluginDir ) {
		var excludedPaths = getGitExclude(),
			index = excludedPaths.indexOf( pluginDir );

		if ( index < 0 ) {
			return;
		}

		excludedPaths.splice( index, 1 );

		grunt.file.write( '.git/info/exclude', excludedPaths.join( '\n' ) + '\n' );
	}

	function getGitExclude() {
		return grunt.file.read( '.git/info/exclude' ).toString()
			// Remove empty lines from the end of the file.
			.replace( /\n+$/g, '' )
			.split( /\n/ );
	}
};