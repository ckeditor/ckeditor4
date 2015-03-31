/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	var banner = [
			'/**',
			' * Copyright (c) 2003-' + new Date().getFullYear() + ', CKSource - Frederico Knabben. All rights reserved.',
			' * For licensing, see LICENSE.html or http://cksource.com/ckeditor/license',
			' */',
		],
		jsBanner = banner.concat( [ '', '// jscs: disable', '// jshint ignore: start', '' ] ),
		samplesFrameworkDir = 'node_modules/cksource-samples-framework';

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

					banner: banner.join( '\n' ),
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
					samplesFrameworkDir + '/components/**/*.less'
				],
				tasks: [ 'less:basicsample' ],
				options: {
					nospawn: true
				}
			},

			concat: {
				files: [
					'<%= concat.dist.src %>'
				],
				tasks: [ 'concat' ]
			}
		},

		jsduck: {
			toolbarconfigurator: {
				src: [
					'samples/toolbarconfigurator/js'
				],
				dest: 'samples/toolbarconfigurator/docs'
			}
		},

		concat: {
			options: {
				stripBanners: true,
				banner: jsBanner.join( '\n' )
			},
			dist: {
				src: [
					samplesFrameworkDir + '/js/sf.js',
					samplesFrameworkDir + '/components/**/*.js'
				],
				dest: 'samples/js/sf.js'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jsduck' );
};
