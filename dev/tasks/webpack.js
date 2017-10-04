/* jshint node: true */

'use strict';

var path = require( 'path' ),
	pluginPath = path.join( __dirname, '..', '..', 'plugins', 'easyimage' ),
	MinifyPlugin = require( 'babel-minify-webpack-plugin' );

module.exports = function( grunt ) {
	grunt.config.merge( {
		webpack: {
			all: function() {
				return {
					entry: path.join( pluginPath, 'src', 'cs-build-entry.js' ),

					output: {
						filename: 'cs.js',
						path: path.join( pluginPath, 'lib' ),
						libraryTarget: 'var',
						library: ''
					},

					module: {
						rules: [
							{
								test: /\.js$/,
								loader: 'babel-loader',
								query: {
									cacheDirectory: true,
									presets: [
										[ require( 'babel-preset-env' ), {
											modules: false,
											targets: {
												browsers: [
													'last 1 Chrome versions',
													'last 1 Firefox versions',
													'last 1 Safari versions',
													'last 1 Edge versions'
												]
											}
										} ]
									],
									plugins: [
										'transform-es3-property-literals',
										'transform-es3-member-expression-literals'
									]
								}
							}
						]
					},

					plugins: [
						new MinifyPlugin( null, {
							comments: false
						} )
					]
				};
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-webpack' );
};
