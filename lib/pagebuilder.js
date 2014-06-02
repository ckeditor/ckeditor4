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
			var head = [ '<head>' ],
				reg;

			head.push( '<title>', data.id, '</title>' );

			files.forEach( function( file ) {
				head.push(
					'<script src="',
					path.join( '/plugins/', file ).split( path.sep ).join( '/' ),
					'"></script>\n'
				);
			} );

			head.push( '<script>(function (bender) {\n' );

			// add test regression configuration
			if ( ( reg = bender.conf.tests[ data.group ].regressions ) ) {
				head.push( 'bender.regressions = ', JSON.stringify( reg ), ';\n' );
			}

			// add CKEditor plugins configuration
			if ( data.editor && (
				data.editor.plugins || data.editor[ 'remove-plugins' ] || data.editor.adapters
			) ) {
				head.push(
					'bender.configureEditor(',
					JSON.stringify( data.editor ),
					');\n'
				);
			}

			head.push( '})(bender);</script></head>' );

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
