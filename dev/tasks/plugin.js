/* jshint node: true, browser: false, es3: false */

'use strict';

var fs = require( 'fs' ),
	shjs = require( 'shelljs' );

shjs.config.silent = true;

module.exports = function( grunt ) {
	grunt.registerTask( 'plugin-install', 'Installs external plugin to the plugins/ directory.', function( pluginName ) {
		var installationDir = grunt.config.get( 'plugin.installationDir' ),
			externalPluginDir = getExternalPluginDir( pluginName ),
			installationPluginDir = installationDir + pluginName;

		if ( !pluginName ) {
			grunt.log.writeln( 'Use: grunt plugin-install:<pluginName>' );
			grunt.fail.fatal( 'Name of the plugin must be specified.' );
		}
		assertExternalPluginDir( pluginName );
		if ( isPluginInstalled( pluginName ) ) {
			grunt.log.writeln( 'The "' + pluginName + '" plugin is already installed. Aborting.' );
			return;
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
			grunt.log.writeln( 'Use: grunt plugin-uninstall:<pluginName>' );
			grunt.fail.fatal( 'Name of the plugin must be specified.' );
		}
		if ( !isPluginInstalled( pluginName ) ) {
			grunt.log.writeln( 'The "' + pluginName + '" plugin is not installed. Aborting.' );
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

	grunt.registerTask( 'plugin-update', 'Updates plugin to the commit ref/branch/tag specified in package.json.', function( pluginName ) {
		if ( !pluginName ) {
			grunt.log.writeln( 'Use: grunt plugin-update:<pluginName>' );
			grunt.fail.fatal( 'Name of the plugin must be specified.' );
		}
		assertExternalPluginDir( pluginName );

		var pluginConfig = getPluginConfig( pluginName );
		if ( !pluginConfig ) {
			grunt.log.writeln( 'Plugin "' + pluginName + '" is not configured in the package.json file.' );
			return;
		}

		grunt.log.writeln( 'Updating plugin "' + pluginName + '" to "' + pluginConfig.remote + '/' + pluginConfig.version + '"...' );

		shjs.pushd( getExternalPluginDir( pluginName ) );

		try {
			// Kinda weak way to check the status. But let's see if it does the job for now.
			if ( gitStatus() ) {
				grunt.log.error( 'Cannot update plugin "' + pluginName + '" due to messed status (e.g. uncommited changes or untracked files).' );
				return;
			}

			grunt.log.writeln( 'Fetching changes from the remote "' + pluginConfig.remote + '"...' );
			gitFetch( pluginConfig.remote );

			// We could use `git show-ref --verify refs/<tags|heads>/<version>`
			// but KISS...
			if ( !pluginConfig.isCommit ) {
				grunt.log.writeln( 'Reseting to "' + pluginConfig.remote + '/' + pluginConfig.version + '"...' );
				gitCheckout( pluginConfig.version );
				gitResetHard( pluginConfig.remote, pluginConfig.version );
			} else {
				grunt.log.writeln( 'Checking out "' + pluginConfig.version + '"...' );
				gitCheckout( pluginConfig.version );
			}
		} catch ( e ) {
			grunt.log.error( e.message );
			grunt.fail.fatal( 'Error when updating plugin "' + pluginName + '".' );
		} finally {
			shjs.popd();
		}

		grunt.log.ok( 'Updated plugin "' + pluginName + '".' );
	} );

	grunt.registerTask( 'plugins-list', 'Lists all installed external plugins.', function() {
		assertExternalDir();

		var installedPlugins = getExternalPlugins().filter( isPluginInstalled );
		if ( !installedPlugins.length ) {
			grunt.log.writeln( 'There are no external plugins installed.' );
		}
		grunt.log.writeln( 'Installed plugins:' );
		grunt.log.writeln( installedPlugins.join( ', ' ) );
	} );

	grunt.registerTask( 'plugins-list-external', 'Lists all available external plugins.', function() {
		assertExternalDir();

		var plugins = getExternalPlugins();
		if ( !plugins.length ) {
			grunt.log.writeln( 'There are no external plugins available.' );
		}
		grunt.log.writeln( 'Available plugins:' );
		grunt.log.writeln( plugins.join( ', ' ) );
	} );

	grunt.registerTask( 'plugins-install', 'Installs all external plugins specified in package.json to the plugins/ directory.', function() {
		var pluginsToInstall = grunt.config.get( 'pkg.ckeditorPlugins' );

		if ( !pluginsToInstall || !Object.keys( pluginsToInstall ).length ) {
			grunt.log.writeln( 'No plugins configured in the package.json file.' );
			return;
		}

		var pluginsToInstallNames = Object.keys( pluginsToInstall );

		grunt.log.writeln( 'Installing: ' + pluginsToInstallNames.join( ', ' ) + '...' );
		grunt.task.run( pluginsToInstallNames.map( function( pluginName ) {
			return 'plugin-install:' + pluginName
		} ) );
	} );

	grunt.registerTask( 'plugins-uninstall', 'Uninstalls all external plugins from the plugins/ directory.', function() {
		assertExternalDir();

		var pluginsToUnInstall = getExternalPlugins().filter( isPluginInstalled );

		grunt.log.writeln( 'Uninstalling: ' + pluginsToUnInstall.join( ', ' ) + '...' );
		grunt.task.run( pluginsToUnInstall.map( function( pluginName ) {
			return 'plugin-uninstall:' + pluginName
		} ) );
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

	// Returns an array of directories names inside dir.
	function getDirs( dir ) {
		var fileNames = fs.readdirSync( dir );

		return fileNames.filter( function( fileName ) {
			return fs.lstatSync( dir + fileName ).isDirectory();
		} );
	}

	// Returns an array of external plugins names.
	function getExternalPlugins() {
		return getDirs( grunt.config.get( 'plugin.externalDir' ) );
	}

	// Checks whether a plugin is installed.
	function isPluginInstalled( pluginName ) {
		return pathExists( grunt.config.get( 'plugin.installationDir' ) + pluginName );
	}

	// Checks that the external plugins directory exists.
	function assertExternalDir() {
		var externalDir = grunt.config.get( 'plugin.externalDir' );
		if ( !grunt.file.isDir( externalDir ) ) {
			grunt.fail.fatal( 'The "' + externalDir + '" directory must exist.' );
		}
	}

	function assertExternalPluginDir( pluginName ) {
		var externalPluginDir = getExternalPluginDir( pluginName );

		if ( !grunt.file.isDir( externalPluginDir ) ) {
			grunt.fail.fatal( 'The "' + externalPluginDir + '" directory must exist.' );
		}
	}

	function getExternalPluginDir( pluginName ) {
		return grunt.config.get( 'plugin.externalDir' ) + pluginName;
	}

	function getPluginConfig( pluginName ) {
		var pluginsConfig = grunt.config.get( 'pkg.ckeditorPlugins' );

		if ( pluginsConfig && ( pluginName in pluginsConfig ) ) {
			var pluginConfig = pluginsConfig[ pluginName ];

			// Normalization. Default version and default origin.
			if ( typeof pluginConfig != 'object' ) {
				pluginConfig = {
					version: pluginConfig
				};
			}
			if ( typeof pluginConfig.version != 'string' ) {
				pluginConfig.version = 'master';
			}
			if ( !pluginConfig.remote ) {
				pluginConfig.remote = 'origin';
			}

			return pluginConfig;
		} else {
			return null;
		}
	}

	function shExec( cmd ) {
		var ret = shjs.exec( cmd );

		if ( ret.code ) {
			throw new Error(
				'Error while executing `' + cmd + '`:\n\n' +
				ret.output
			);
		}
		return ret.output;
	}

	function gitStatus() {
		return shExec( 'git status --porcelain' );
	}

	function gitFetch( remote ) {
		return shExec( 'git fetch ' + remote );
	}

	function gitCheckout( ref ) {
		return shExec( 'git checkout ' + ref );
	}

	function gitResetHard( remote, ref ) {
		return shExec( 'git reset --hard ' + remote + '/' + ref );
	}
};