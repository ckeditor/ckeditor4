/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	grunt.config.merge( {
		less: {
			basicsample: {
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
					compress: true
				}
			}
		},

		watch: {
			basicsample: {
				files: '<%= less.basicsample.options.paths[ 0 ] + "/**/*.less" %>',
				tasks: [ 'less:basicsample' ],
				options: {
					nospawn: true
				}
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
};