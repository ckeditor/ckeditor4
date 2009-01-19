/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.plugins} object, which is used to
 *		manage plugins registration and loading.
 */

/**
 * Manages plugins registration and loading.
 * @namespace
 * @augments CKEDITOR.resourceManager
 * @example
 */
CKEDITOR.plugins = new CKEDITOR.resourceManager( '_source/' + // %REMOVE_LINE%
	'plugins/', 'plugin' );

CKEDITOR.plugins.load = CKEDITOR.tools.override( CKEDITOR.plugins.load, function( originalLoad ) {
	return function( name, callback, scope ) {
		var allPlugins = {};

		var loadPlugins = function( names ) {
				originalLoad.call( this, names, function( plugins ) {
					CKEDITOR.tools.extend( allPlugins, plugins );

					var requiredPlugins = [];
					for ( var pluginName in plugins ) {
						var plugin = plugins[ pluginName ],
							requires = plugin && plugin.requires;

						if ( requires ) {
							for ( var i = 0; i < requires.length; i++ ) {
								if ( !allPlugins[ requires[ i ] ] )
									requiredPlugins.push( requires[ i ] );
							}
						}
					}

					if ( requiredPlugins.length )
						loadPlugins.call( this, requiredPlugins );
					else if ( callback )
						callback.call( scope || window, allPlugins );
				}, this );

			};

		loadPlugins.call( this, name );
	};
});

CKEDITOR.plugins.setLang = function( pluginName, languageCode, languageEntries ) {
	var plugin = this.get( pluginName );
	plugin.lang[ languageCode ] = languageEntries;
};
