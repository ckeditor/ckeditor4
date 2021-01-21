/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint browser: false, node: true */

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
