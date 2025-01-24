/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.resourceManager} class, which is
 *		the base for resource managers, like plugins.
 */

/**
 * Base class for resource managers, like plugins. This class is not
 * intended to be used out of the CKEditor core code.
 *
 * @class
 * @constructor Creates a resourceManager class instance.
 * @param {String} basePath The path for the resources folder.
 * @param {String} fileName The name used for resource files.
 */
CKEDITOR.resourceManager = function( basePath, fileName ) {
	/**
	 * The base directory containing all resources.
	 *
	 * @property {String}
	 */
	this.basePath = basePath;

	/**
	 * The name used for resource files.
	 *
	 * @property {String}
	 */
	this.fileName = fileName;

	/**
	 * Contains references to all resources that have already been registered
	 * with {@link #add}.
	 */
	this.registered = {};

	/**
	 * Contains references to all resources that have already been loaded
	 * with {@link #load}.
	 */
	this.loaded = {};

	/**
	 * Contains references to all resources that have already been registered
	 * with {@link #addExternal}.
	 */
	this.externals = {};

	/**
	 * @private
	 */
	this._ = {
		// List of callbacks waiting for plugins to be loaded.
		waitingList: {}
	};
};

CKEDITOR.resourceManager.prototype = {
	/**
	 * Registers a resource.
	 *
	 *		CKEDITOR.plugins.add( 'sample', { ... plugin definition ... } );
	 *
	 * @param {String} name The resource name.
	 * @param {Object} [definition] The resource definition.
	 * @see CKEDITOR.pluginDefinition
	 */
	add: function( name, definition ) {
		if ( this.registered[ name ] )
			throw new Error( '[CKEDITOR.resourceManager.add] The resource name "' + name + '" is already registered.' );

		var resource = this.registered[ name ] = definition || {};
		resource.name = name;
		resource.path = this.getPath( name );

		CKEDITOR.fire( name + CKEDITOR.tools.capitalize( this.fileName ) + 'Ready', resource );

		return this.get( name );
	},

	/**
	 * Gets the definition of a specific resource.
	 *
	 *		var definition = CKEDITOR.plugins.get( 'sample' );
	 *
	 * @param {String} name The resource name.
	 * @returns {Object} The registered object.
	 */
	get: function( name ) {
		return this.registered[ name ] || null;
	},

	/**
	 * Get the folder path for a specific loaded resource.
	 *
	 *		alert( CKEDITOR.plugins.getPath( 'sample' ) ); // '<editor path>/plugins/sample/'
	 *
	 * @param {String} name The resource name.
	 * @returns {String}
	 */
	getPath: function( name ) {
		var external = this.externals[ name ];
		return CKEDITOR.getUrl( ( external && external.dir ) || this.basePath + name + '/' );
	},

	/**
	 * Get the file path for a specific loaded resource.
	 *
	 *		alert( CKEDITOR.plugins.getFilePath( 'sample' ) ); // '<editor path>/plugins/sample/plugin.js'
	 *
	 * @param {String} name The resource name.
	 * @returns {String}
	 */
	getFilePath: function( name ) {
		var external = this.externals[ name ];
		return CKEDITOR.getUrl( this.getPath( name ) + ( external ? external.file : this.fileName + '.js' ) );
	},

	/**
	 * Registers one or more resources to be loaded from an external path
	 * instead of the core base path.
	 *
	 * ```js
	 * // Loads a plugin from '/myplugins/sample/plugin.js'.
	 * CKEDITOR.plugins.addExternal( 'sample', '/myplugins/sample/' );
	 *
	 * // Loads a plugin from '/myplugins/sample/my_plugin.js'.
	 * CKEDITOR.plugins.addExternal( 'sample', '/myplugins/sample/', 'my_plugin.js' );
	 *
	 * // Loads a plugin from '/myplugins/sample/my_plugin.js'.
	 * CKEDITOR.plugins.addExternal( 'sample', '/myplugins/sample/my_plugin.js', '' );
	 *
	 * // Loads a plugin from '/myplugins/sample/my_plugin.js'.
	 * CKEDITOR.plugins.addExternal( 'sample', '/myplugins/sample/my_plugin.js' );
	 * ```
	 *
	 * @param {String} names Comma-separated resource names.
	 * @param {String} path The path of the folder containing the resource.
	 * @param {String} [fileName] The resource file name. If not provided and
	 * the `path` argument ends with a slash (`/`), the default `plugin.js` filename is used.
	 * Otherwise, if not provided and the `path` argument does not end with a slash (`/`)
	 * or if an empty string is provided, the function assumes that the `path` argument contains the full path.
	 */
	addExternal: function( names, path, fileName ) {
		// If "fileName" is not provided, we assume that it may be available
		// in "path". Try to extract it in this case.
		if ( !fileName ) {
			path = path.replace( /[^\/]+$/, function( match ) {
				fileName = match;
				return '';
			} );
		}

		// Use the default file name if there is no "fileName" and it
		// was not found in "path".
		fileName = fileName || ( this.fileName + '.js' );
		names = names.split( ',' );

		for ( var i = 0; i < names.length; i++ ) {
			var name = names[ i ];

			this.externals[ name ] = {
				dir: path,
				file: fileName
			};
		}
	},

	/**
	 * Loads one or more resources.
	 *
	 *		CKEDITOR.plugins.load( 'myplugin', function( plugins ) {
	 *			alert( plugins[ 'myplugin' ] ); // object
	 *		} );
	 *
	 * @param {String/Array} name The name of the resource to load. It may be a
	 * string with a single resource name, or an array with several names.
	 * @param {Function} callback A function to be called when all resources
	 * are loaded. The callback will receive an array containing all loaded names.
	 * @param {Object} [scope] The scope object to be used for the callback call.
	 */
	load: function( names, callback, scope ) {
		// Ensure that we have an array of names.
		if ( !CKEDITOR.tools.isArray( names ) )
			names = names ? [ names ] : [];

		var loaded = this.loaded,
			registered = this.registered,
			urls = [],
			urlsNames = {},
			resources = {};

		// Loop through all names.
		for ( var i = 0; i < names.length; i++ ) {
			var name = names[ i ];

			if ( !name )
				continue;

			// If not available yet.
			if ( !loaded[ name ] && !registered[ name ] ) {
				var url = this.getFilePath( name );
				urls.push( url );
				if ( !( url in urlsNames ) )
					urlsNames[ url ] = [];
				urlsNames[ url ].push( name );
			} else {
				resources[ name ] = this.get( name );
			}
		}

		CKEDITOR.scriptLoader.load( urls, function( completed, failed ) {
			if ( failed.length ) {
				throw new Error( '[CKEDITOR.resourceManager.load] Resource name "' + urlsNames[ failed[ 0 ] ].join( ',' ) +
					'" was not found at "' + failed[ 0 ] + '".' );
			}

			for ( var i = 0; i < completed.length; i++ ) {
				var nameList = urlsNames[ completed[ i ] ];
				for ( var j = 0; j < nameList.length; j++ ) {
					var name = nameList[ j ];
					resources[ name ] = this.get( name );

					loaded[ name ] = 1;
				}
			}

			callback.call( scope, resources );
		}, this );
	}
};
