/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

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
			grunt.fail.fatal(
				'Name of the plugin must be specified.\n' +
				'Use: grunt plugin-install:<pluginName>'
			);
		}
		assertExternalPluginDir( pluginName );
		if ( isPluginInstalled( pluginName ) ) {
			grunt.log.writeln( 'The "' + pluginName + '" plugin is already installed.' );
			return;
		}

		try {
			grunt.log.writeln( 'Creating a symlink...' );
			fs.symlinkSync( '../' + externalPluginDir, installationPluginDir, 'dir' );

			grunt.log.writeln( 'Adding the plugin to files ignored by Git...' );
			addPluginDirToGitExclude( installationPluginDir );
		} catch ( e ) {
			grunt.log.error( e.message );
			grunt.fail.fatal( 'Error when installing the plugin.' );
		}

		grunt.log.ok( 'Installed the plugin "' + pluginName + '" in "' + installationPluginDir + '" directory.' );
	} );

	grunt.registerTask( 'plugin-uninstall', 'Uninstalls external plugin from the plugins/ directory.', function( pluginName ) {
		var installationDir = grunt.config.get( 'plugin.installationDir' ),
			installationPluginDir = installationDir + pluginName;

		if ( !pluginName ) {
			grunt.fail.fatal(
				'Name of the plugin must be specified.\n' +
				'Use: grunt plugin-uninstall:<pluginName>'
			);
		}
		if ( !isPluginInstalled( pluginName ) ) {
			grunt.log.writeln( 'The "' + pluginName + '" plugin is not installed.' );
			return;
		}
		if ( !isSymlink( installationPluginDir ) ) {
			grunt.fail.warn( 'The "' + installationPluginDir + '" directory is not a symlink so plugin cannot be removed.' );
		}

		try {
			grunt.log.writeln( 'Removing a symlink...' );
			fs.unlinkSync( installationPluginDir );

			grunt.log.writeln( 'Remove the plugin from files ignored by Git...' );
			removePluginDirFromGitExclude( installationPluginDir );
		} catch ( e ) {
			grunt.log.error( e.message );
			grunt.fail.fatal( 'Error when uninstalling the plugin.' );
		}

		grunt.log.ok( 'Uninstalled the plugin "' + pluginName + '" from "' + installationPluginDir + '" directory.' );
	} );

	grunt.registerTask( 'plugin-update', 'Updates plugin to the commit ref/branch/tag specified in package.json.', function( pluginName ) {
		if ( !pluginName ) {
			grunt.fail.fatal(
				'Name of the plugin must be specified.\n' +
				'Use: grunt plugin-update:<pluginName>'
			);
		}
		assertExternalPluginDir( pluginName );

		var pluginConfig = getPluginConfig( pluginName );
		if ( !pluginConfig ) {
			grunt.fail.warn( 'Plugin "' + pluginName + '" is not configured in the package.json file.' );
		}

		grunt.log.writeln( 'Updating plugin "' + pluginName + '" to "' + pluginConfig.remote + '/' + pluginConfig.version + '"...' );

		shjs.pushd( getExternalPluginDir( pluginName ) );

		try {
			// Kinda weak way to check the status. But let's see if it does the job for now.
			if ( gitStatus() ) {
				grunt.log.error(
					'Cannot update the plugin "' + pluginName + '" due to messed status ' +
					'(e.g. uncommited changes or untracked files).'
				);
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
			grunt.fail.fatal( 'Error when updating the plugin "' + pluginName + '".' );
		} finally {
			shjs.popd();
		}

		grunt.log.ok( 'Updated the plugin "' + pluginName + '".' );
	} );

	// TODO Add information about branch or tag to which the plugin is checked out.
	grunt.registerTask( 'plugins-list', 'Lists all installed external plugins.', function() {
		assertExternalDir();

		var installedPlugins = getExternalPlugins().filter( isPluginInstalled );
		if ( !installedPlugins.length ) {
			grunt.log.writeln( 'There are no external plugins installed.' );
			return;
		}
		grunt.log.writeln( 'Installed plugins:' );
		grunt.log.writeln( '* ' + installedPlugins.join( '\n* ' ) );
	} );

	grunt.registerTask( 'plugins-list-all', 'Lists all available external plugins.', function() {
		assertExternalDir();

		var plugins = getExternalPlugins();
		if ( !plugins.length ) {
			grunt.log.writeln( 'There are no external plugins available.' );
			return;
		}
		grunt.log.writeln( 'Available plugins:' );
		grunt.log.writeln( '* ' + plugins.join( '\n* ' ) );
	} );

	grunt.registerTask( 'plugins-install', 'Installs all external plugins specified in package.json to the plugins/ directory.', function() {
		var pluginsToInstall = getPluginsNamesFromConfig();

		if ( !pluginsToInstall.length ) {
			grunt.log.writeln( 'There are no plugins configured in the package.json file.' );
			return;
		}

		grunt.log.writeln( 'Installing plugins: ' + pluginsToInstall.join( ', ' ) + '...' );
		grunt.task.run( pluginsToInstall.map( function( pluginName ) {
			return 'plugin-install:' + pluginName;
		} ) );
	} );

	grunt.registerTask( 'plugins-uninstall', 'Uninstalls all external plugins from the plugins/ directory.', function() {
		assertExternalDir();

		var pluginsToUninstall = getExternalPlugins().filter( isPluginInstalled );

		if ( !pluginsToUninstall.length ) {
			grunt.log.writeln( 'There are no external plugins installed.' );
			return;
		}

		grunt.log.writeln( 'Uninstalling plugins: ' + pluginsToUninstall.join( ', ' ) + '...' );
		grunt.task.run( pluginsToUninstall.map( function( pluginName ) {
			return 'plugin-uninstall:' + pluginName;
		} ) );
	} );

	grunt.registerTask( 'plugins-update',
		'Updates installed external plugins to the versions specified in package.json. ' +
		'When used with the :install option the task will also install the plugins specified in package.json.', function( install ) {
		assertExternalDir();

		var installedPlugins = getExternalPlugins().filter( isPluginInstalled ),
			pluginsToInstall = getPluginsNamesFromConfig(),
			tasks = [];

		if ( install ) {
			// Uinstall plugins which are not specified in package.json.
			tasks = tasks.concat(
				installedPlugins
					.filter( function( pluginName ) {
						return pluginsToInstall.indexOf( pluginName ) == -1;
					} )
					.map( function( pluginName ) {
						return 'plugin-uninstall:' + pluginName;
					} )
			);

			// Install plugins which are not yet installed.
			tasks = tasks.concat(
				pluginsToInstall
					.filter( function( pluginName ) {
						return installedPlugins.indexOf( pluginName ) == -1;
					} )
					.map( function( pluginName ) {
						return 'plugin-install:' + pluginName;
					} )
			);

			// Finally, update all installed plugins.
			// We could use the --install parameter instead of :install, but then we would
			// need to use grunt.option( 'install', false ) before calling plugins-update recursively ;/.
			tasks.push( 'plugins-update' );

			grunt.task.run( tasks );
			return;
		}


		if ( !installedPlugins.length ) {
			grunt.log.writeln( 'There are no external plugins installed.' );
			return;
		} else {
			grunt.log.writeln( 'Updating plugins: ' + installedPlugins.join( ', ' ) + '...' );
		}

		grunt.task.run( installedPlugins.map( function( pluginName ) {
			return 'plugin-update:' + pluginName;
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

	// Returns names of plugins specified in the package.json.
	function getPluginsNamesFromConfig() {
		var plugins = grunt.config.get( 'pkg.ckeditorPlugins' );

		if ( !plugins )
			return [];

		return Object.keys( plugins );
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
