/* jshint browser: false, node: true */

'use strict';

var config = {

	applications: {
		ckeditor: {
			path: '../../',
			files: [
				'ckeditor.js'
			]
		},

		codemirror: {
			path: '.',
			files: [
				'js/lib/codemirror/codemirror.js'
			]
		},

		toolbartool: {
			path: '.',
			files: [
				'js/fulltoolbareditor.js',
				'js/abstracttoolbarmodifier.js',
				'js/toolbarmodifier.js',
				'js/toolbartextmodifier.js'
			]
		}
	},

	plugins: [
		'node_modules/benderjs-mocha',
		'node_modules/benderjs-chai'
	],

	framework: 'mocha',

	tests: {
		'main': {
			applications: [ 'ckeditor', 'codemirror', 'toolbartool' ],
			basePath: 'tests/',
			paths: [
				'**',
				'!**/_*/**'
			]
		}
	}
};

module.exports = config;
