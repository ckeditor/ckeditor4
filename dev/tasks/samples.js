/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	grunt.config.merge( {
		less: {
			'samples-dev': {
				files: {
					'samples/css/sample.css': 'samples/less/sample.less',
				},

				options: {
					banner: [
						'/*!',
						' Copyright (c) 2003-' + new Date().getFullYear() + ', CKSource - Frederico Knabben. All rights reserved.',
						' For licensing, see LICENSE.html or http://cksource.com/ckeditor/license',
						' */'
					].join( '\n' ),
					paths: [ 'samples/' ],
					sourceMap: true,
					sourceMapFilename: 'samples/css/sample.css.map',
					sourceMapURL: 'sample.css.map',
					sourceMapRootpath: '/'
				}
			},

			'samples-prod': {
				files: '<%= less[ "samples-dev" ].files %>',

				options: {
					banner: '<%= less[ "samples-dev" ].options.banner %>',
					paths: '<%= less[ "samples-dev" ].options.paths %>',
					compress: true
				}
			}
		},

		watch: {
			'less-samples-dev': {
				files: '<%= less[ "samples-dev" ].options.paths[ 0 ] + "/**/*.less" %>',
				tasks: [ 'less:samples-dev' ],
				options: {
					nospawn: true
				}
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
};