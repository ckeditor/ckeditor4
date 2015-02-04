/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	var cssBanner = [
		'/*!',
		' Copyright (c) 2003-' + new Date().getFullYear() + ', CKSource - Frederico Knabben. All rights reserved.',
		' For licensing, see LICENSE.html or http://cksource.com/ckeditor/license',
		' */'
	].join( '\n' );

	grunt.config.merge( {
		less: {
			basicsample: {
				files: [
					{
						src: 'samples/less/sample.less',
						dest: 'samples/css/sample.css'
					}
				],

				options: {
					paths: [ 'samples/' ],

					sourceMap: true,
					sourceMapFilename: 'samples/css/sample.css.map',
					sourceMapURL: 'sample.css.map',
					sourceMapRootpath: '/'
				}
			},

			toolbareditor: {
				files: [
					{
						src: 'samples/toolbareditor/less/toolbarmodifier.less',
						dest: 'samples/toolbareditor/css/toolbarmodifier.css'
					}
				],

				options: {
					paths: [ 'samples/toolbareditor' ],

					sourceMap: true,
					sourceMapFilename: 'samples/toolbareditor/css/toolbarmodifier.css.map',
					sourceMapURL: 'toolbarmodifier.css.map',
					sourceMapRootpath: '/'
				}
			},

			'samples-production': {
				files: [
					'<%= less.basicsample.files %>',
					'<%= less.toolbareditor.files %>'
				],
				options: {
					banner: cssBanner,
					compress: true,
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
			},

			toolbareditor: {
				files: '<%= less.toolbareditor.options.paths[ 0 ] + "/**/*.less" %>',
				tasks: [ 'less:toolbareditor' ],
				options: {
					nospawn: true
				}
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
};