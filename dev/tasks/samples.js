/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	var cssBanner = [
		'/*',
		'Copyright (c) 2003-' + new Date().getFullYear() + ', CKSource - Frederico Knabben. All rights reserved.',
		'For licensing, see LICENSE.html or http://cksource.com/ckeditor/license',
		'*/'
	].join( '\n' );

	grunt.config.merge( {
		less: {
			basicsample: {
				files: [
					{
						src: 'samples/less/samples.less',
						dest: 'samples/css/samples.css'
					}
				],

				options: {
					ieCompat: true,
					paths: [ 'samples/' ],
					relativeUrls: true,

					banner: cssBanner,
					sourceMap: true,
					sourceMapFileInline: true,
					sourceMapFilename: 'samples/css/samples.css.map',
					sourceMapURL: 'samples.css.map',
					sourceMapRootpath: '../../'
				}
			}
		},

		watch: {
			basicsample: {
				files: [
					'<%= less.basicsample.options.paths[ 0 ] + "/**/*.less" %>',
					'node_modules/cksource-samples-framework/components/**/*.less'
				],
				tasks: [ 'less:basicsample' ],
				options: {
					nospawn: true
				}
			}
		},

		jsduck: {
			toolbarconfigurator: {
				src: [
					'samples/toolbarconfigurator/js'
				],
				dest: 'samples/toolbarconfigurator/docs'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jsduck' );
};
