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

	coverage: {
		paths: [
			'adapters/**/*',
			'core/**/*',
			'dev/**/*',
			'lang/**/*',
			'plugins/**/*',
			'samples/**/*',
			'*.js'
		],
		options: {
			checkTrackerVar: true
		}
	},

	plugins: [
		'benderjs-coverage',
		'benderjs-yui',
		'benderjs-sinon',
		'benderjs-jquery',
		'tests/_benderjs/ckeditor',
		'benderjs-yui-beautified'
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
	},

	'yui-beautified': {
		indent_with_tabs: true,
		wrap_line_length: 0,
		// All tags should be reformatted.
		unformatted: 'none',
		indent_inner_html: true,
		preserve_newlines: true,
		max_preserve_newlines: 0,
		indent_handlebars: false,
		end_with_newline: true,
		extra_liners: 'head, body, div, p, /html'
	}
};

module.exports = config;
