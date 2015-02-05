/* jshint browser: false, node: true */

'use strict';

var config = {

	applications: {
		ckeditor: {
			path: '.',
			files: [
				'ckeditor.js'
			]
		},

		codemirror: {
			path: './samples/toolbareditor/',
			files: [
				'js/lib/codemirror/codemirror.js'
			]
		},

		toolbartool: {
			path: './samples/toolbareditor/',
			files: [
				'js/fulltoolbareditor.js',
				'js/abstracttoolbarmodifier.js',
				'js/toolbarmodifier.js',
				'js/toolbartextmodifier.js'
			]
		}
	},

	plugins: [
		'samples/toolbareditor/node_modules/benderjs-mocha',
		'samples/toolbareditor/node_modules/benderjs-chai'
	],

	framework: 'mocha',

	tests: {
		'main': {
			applications: [ 'ckeditor', 'codemirror', 'toolbartool' ],
			basePath: 'samples/toolbareditor/tests/',
			paths: [
				'**',
				'!**/_*/**'
			]
		}
	}
};

module.exports = config;
