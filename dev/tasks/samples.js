/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	var banner = [
			'/**',
			' * @license Copyright (c) 2003-' + new Date().getFullYear() + ', CKSource - Frederico Knabben. All rights reserved.',
			' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
			' */\n',
		],
		lintFreeBlockTemplate = [
			'// jshint ignore:start',
			'// jscs:disable',
			'<%= block %>',
			'// jscs:enable',
			'// jshint ignore:end'
		].join( '\n' ),
		samplesFrameworkDir = 'node_modules/cksource-samples-framework',
		samplesFrameworkJsFiles = [
			samplesFrameworkDir + '/js/sf.js',
			samplesFrameworkDir + '/components/**/*.js',
			samplesFrameworkDir + '/node_modules/picomodal/src/picoModal.js'
		];

	grunt.config.merge( {
		less: {
			samples: {
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
			'samples-less': {
				files: [
					'<%= less.samples.options.paths[ 0 ] + "/**/*.less" %>',
					samplesFrameworkDir + '/components/**/*.less'
				],
				tasks: [ 'less:samples' ],
				options: {
					nospawn: true
				}
			},

			'samples-js': {
				files: samplesFrameworkJsFiles,
				tasks: [ 'concat:samples' ]
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
			samples: {
				options: {
					stripBanners: true,
					banner: banner.join( '\n' ),

					// Don't run the linter on 3rd party libraries. You wouldn't be able to fix the errors anyway.
					process: function( src, path ) {
						console.log( path );
						if ( path.match( /cksource-samples-framework\/node_modules/ig ) ) {
							src = grunt.template.process( lintFreeBlockTemplate, { data: { block: src } } );
						}

						return src;
					}
				},
				src: samplesFrameworkJsFiles,
				dest: 'samples/js/sf.js'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jsduck' );
};
