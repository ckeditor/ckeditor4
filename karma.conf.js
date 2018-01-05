/* globals module, __dirname */

'use strict';

module.exports = function( config ) {
	config.set( {

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [ 'ckeditor4-yui-to-chai', 'mocha', 'ckeditor4-bender-iframes' ],

		files: [
			// Serve CKEditor files.
			{ pattern: 'ckeditor.js', included: false, served: true, watched: false, nocache: true },
			{ pattern: '+(core|plugins|skins|lang)/**/*', included: false, served: true, watched: false, nocache: true },
			{ pattern: '+(config|styles).js', included: false, served: true, watched: false, nocache: true },
			{ pattern: 'contents.css', included: false, served: true, watched: false, nocache: true },

			// Serve karma files.
			{ pattern: 'tests/_karma/runner.js', included: false, served: true, watched: false, nocache: true },
			{ pattern: 'tests/_karma/**/*.js', included: false, served: true, watched: false, nocache: true },

			// Serve helpers - 'tests/**/_helpers/*.js'. Do not load helpers for manual tests.
			{ pattern: 'tests/**/manual/**/_helpers/*.js', included: false, served: false, watched: false, nocache: false },
			{ pattern: 'tests/**/_helpers/*.js', included: false, served: true, watched: false, nocache: false },

			// Serve assets - 'tests/**/_assets/**/*.js'.
			{ pattern: 'tests/**/_assets/**/*', included: false, served: true, watched: false, nocache: false },

			// Skip manual tests '.html' files so they won't be included via 'tests/**/*.html'.
			{ pattern: 'tests/core/**/manual/**/*.html', included: false, served: false, watched: false, nocache: false },
			// Load html fixtures - 'tests/**/*.html'.
			'tests/core/**/*.html',

			// Load tests.
			'tests/core/editor/editor.js'

			// 'tests/adapters/**/*.js',
			// 'tests/core/**/*.js'
			// 'tests/tickets/**/*.js',
			// 'tests/utils/**/*.js'

			// 'tests/plugins/**/*.js'
		],


		// list of files to exclude
		exclude: [],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'tests/**/*.js': [ 'ckeditor4' ],
			'tests/**/*.html': [ 'html2js' ]
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [ 'progress' ],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [ 'Chrome' ],

		plugins: [
			'karma-mocha',
			'karma-chai',
			'karma-chrome-launcher',
			'karma-ckeditor4-yui-to-chai',
			'karma-ckeditor4-preprocessor',
			'karma-ckeditor4-bender-iframes',
			'karma-html2js-preprocessor'
		],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,
		// singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		client: {
			useIframe: false,
			clearContext: true,
			__filenameOverride: __dirname + '/../index.html',
			timeout: 20000,
			mocha: {
				timeout: 5000 // single test timeout
			}
		}
	} );
};
