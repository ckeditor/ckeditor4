'use strict';

module.exports = function( grunt ) {
	// Basic configuration which will be overloaded by the tasks.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

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
