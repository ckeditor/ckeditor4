/**
 * Copyright (c) 2015, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

/* jshint browser: false, node: true */

'use strict';

var path = require( 'path' ),
	files = [
		path.join( __dirname, '/../static/tools.js' ),
		path.join( __dirname, '/../static/bot.js' ),
		path.join( __dirname, '/../static/extensions.js' )
	];

module.exports = {

	name: 'bender-pagebuilder-ckeditor',

	files: files,

	build: null,

	attach: function() {
		var bender = this,
			html,
			idx;

		function build( data ) {
			var head = [ '<head>\n', '<title>', data.id, '</title>\n' ];

			files.forEach( function( file ) {
				head.push(
					'<script src="',
					path.join( '/plugins/', file ).split( path.sep ).join( '/' ),
					'"></script>\n'
				);
			} );

			// add CKEditor plugins/adapters configuration if needed
			if ( data.ckeditor && (
				data.ckeditor.plugins || data.ckeditor[ 'remove-plugins' ] || data.ckeditor.adapters
			) ) {
				head.push(
					'<script>\n(function (bender) {\n',
					'bender.configureEditor(',
					JSON.stringify( data.ckeditor ),
					');\n',
					'})(bender);\n</script>'
				);
			}

			head.push( '\n</head>' );

			data.parts.push( head.join( '' ) );

			return data;
		}

		module.exports.build = build;

		html = bender.plugins[ 'bender-pagebuilder-html' ];

		// add plugin before pagebuilder-html
		if ( html && ( idx = bender.pagebuilders.indexOf( html.build ) ) > -1 ) {
			bender.pagebuilders.splice( idx, 0, build );
		} else {
			bender.pagebuilders.push( build );
		}
	}
};
