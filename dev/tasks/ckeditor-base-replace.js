/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/* jshint node: true, browser: false, es3: false, esversion: 6 */

'use strict';

const fs = require( 'fs' );
const uglify = require( 'uglify-js' );
const replace = require( 'replace-in-file' );

module.exports = function( grunt ) {
	grunt.registerTask( 'ckeditor-base-replace', 'Inline core/ckeditor_base.js to into ckeditor.js.', function() {
		const code = fs.readFileSync( './core/ckeditor_base.js', 'utf8' );
		const minified = uglify.minify( code, {
			ie8: true
		} );

		try {
			const results = replace.sync( {
				encoding: 'utf8',
				files: './ckeditor.js',
				from: /\/\/\s+replace_start\n(.|\n|\t|\r)*?\n\/\/\s+replace_end/,
				to: `// replace_start\n${ minified.code }\n// replace_end`
			} );

			console.log( `Replacement successful:` );
			console.log( results );
		}
		catch ( error ) {
			console.error( `Replacement failed: ${ error }` );
		}
	} );
};
