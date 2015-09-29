/* jshint browser: false, node: true */

'use strict';

var config = {

	applications: {
		ckeditor: {
			path: '.',
			files: [
				'ckeditor.js'
			]
		}
	},

	framework: 'yui',

	// secure: true,
	privateKey: 'tests/_benderjs/ssl/key.pem',
	certificate: 'tests/_benderjs/ssl/cert.pem',

	plugins: [
		'benderjs-yui',
		'benderjs-sinon',
		'benderjs-jquery',
		'tests/_benderjs/ckeditor'
	],

	tests: {
		'Adapters': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'adapters/**',
				'!**/_*/**'
			],
			// Latest of the old API (1.8.3)
			// Latest of the 1.* branch
			// Latest of the 2.* branch
			jQuery: [ '1.8.3', '1.11.1', '2.1.1' ]
		},

		'Core': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'core/**',
				'!**/_*/**'
			]
		},

		'Plugins': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'plugins/**',
				'!**/_*/**'
			]
		},

		'External Plugins': {
			applications: [ 'ckeditor' ],
			basePath: 'plugins/',
			paths: [
				'*/tests/**',
				'!**/_*/**'
			]
		},

		'Tickets': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'tickets/**',
				'!**/_*/**'
			]
		},

		'Utils': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'utils/**',
				'!**/_*/**'
			]
		}
	}
};

module.exports = config;
