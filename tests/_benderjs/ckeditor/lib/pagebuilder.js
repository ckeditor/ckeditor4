/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/* jshint browser: false, node: true */

'use strict';

var path = require( 'path' ),
	files = [
		path.join( __dirname, '..', 'static', 'tools.js' ),
		path.join( __dirname, '..', 'static', 'bot.js' ),
		path.join( __dirname, '..', 'static', 'extensions.js' ),
		path.join( __dirname, '..', 'static', 'activate.js' )
	];

module.exports = {

	name: 'bender-pagebuilder-ckeditor',

	files: files,

	build: null,

	attach: function() {
		var bender = this;

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
					data.ckeditor.plugins || data.ckeditor[ 'remove-plugins' ] ||
					( data.ckeditor.remove && data.ckeditor.remove.plugins ) || data.ckeditor.adapters
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

		var priority = bender.pagebuilders.getPriority( 'html' );

		bender.pagebuilders.add( 'ckeditor', build, priority - 1 );
	}
};
