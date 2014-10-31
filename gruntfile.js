/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	grunt.initConfig( {
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

	grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
	grunt.registerTask( 'images', [ 'imagemin' ] );
};