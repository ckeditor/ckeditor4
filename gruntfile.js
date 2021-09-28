/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	// First register the "default" task, so it can be analyzed by other tasks.
	grunt.registerTask( 'default', [ 'jshint:git', 'jscs:git' ] );

	// Files that will be ignored by the "jscs" and "jshint" tasks.
	var ignoreFiles = [
		// Automatically loaded from .gitignore. Add more if necessary.

		'lang/**',
		'vendor/**',
		'plugins/*/lib/**',
		'plugins/**/lang/**',
		'plugins/uicolor/yui/**',
		'samples/toolbarconfigurator/lib/**',
		'tests/adapters/jquery/_assets/**',
		'tests/core/dom/_assets/**',
		'tests/core/selection/_helpers/rangy.js'
	];

	// Basic configuration which will be overloaded by the tasks.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		jshint: {
			options: {
				ignores: ignoreFiles
			}
		},

		jscs: {
			options: {
				excludeFiles: ignoreFiles
			}
		},

		plugin: {
			externalDir: '../ckeditor-plugins/',
			installationDir: 'plugins/'
		},

		imagemin: {
			plugins: {
				files: [ {
					expand: true,
					cwd: '.',
					src: [
						'plugins/*/images/**/*.{png,jpg,gif}'
					]
				} ]
			},

			skins: {
				files: [ {
					expand: true,
					cwd: '.',
					src: [
						'skins/*/images/**/*.{png,jpg,gif}'
					]
				} ]
			},

			samples: {
				files: [ {
					expand: true,
					cwd: '.',
					src: [
						'samples/**/*.{png,jpg,gif}',
						'plugins/*/samples/**/*.{png,jpg,gif}'
					]
				} ]
			}
		}
	} );

	// Finally load the tasks.
	grunt.loadTasks( 'dev/tasks' );

	grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
	grunt.registerTask( 'images', 'Optimizes images which are not processed later by the CKBuilder (i.e. icons).', [ 'imagemin' ] );
};
