/* jshint node: true */

'use strict';

module.exports = function( grunt ) {
	grunt.config.merge( {
		babel: {
			dist: {
				files: [ {
					flatten: true,
					src: [ 'node_modules/@ckeditor/ckeditor-cloudservices-core/src/uploadgateway/uploadgateway.js' ],
					dest: 'plugins/easyimage/lib/cs.js'
				} ]
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-babel' );
};
