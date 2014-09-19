module.exports = function( grunt ) {
	grunt.initConfig( {
		imagemin: {
			pluginsskins: {
				files: [ {
					expand: true,
					cwd: '.',
					src: [
						'skins/*/images/*.png',
						'plugins/*/images/*.png',
						'plugins/*/images/hidpi/*.png'
					]
				} ]
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
	grunt.registerTask( 'optimizeimages', [ 'imagemin' ] );
};