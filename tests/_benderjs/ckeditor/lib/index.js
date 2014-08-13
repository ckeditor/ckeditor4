/**
 * Copyright (c) 2014, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

'use strict';

var path = require( 'path' ),
	fs = require( 'fs' );

module.exports = {
	name: 'bender-ckeditor',

	attach: function() {
		var bender = this,
			files = [];

		fs.readdirSync( __dirname ).forEach( function( file ) {
			var plugin;

			if ( file === 'index.js' ) {
				return;
			}

			plugin = require( path.join( __dirname, file ) );

			if ( plugin.files ) {
				files = files.concat( plugin.files );
			}

			bender.use( plugin );
		} );

		bender.plugins.addFiles( files );
	}
};
