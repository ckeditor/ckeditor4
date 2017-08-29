/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function( window, bender ) {
	'use strict';

	// TODO config mockup - previously it was generated dynamically by bender server.
	bender.config = window.BENDER_CONFIG;

	// Bender global scope for storing current test suit and test case.
	bender._ = {};

	// Returns currently executed test suite or null.
	bender.getTestSuite = function() {
		return bender._.currentTestSuite;
	};

	// Sets currently executed test suite (should be set in `before` method).
	bender.setTestSuite = function( ts ) {
		bender._.currentTestSuite = ts;
	};

	// Returns currently executed test case or null.
	bender.getTestCase = function() {
		return bender._.currentTestCase;
	};

	// Sets currently executed test case (should be set in the beginning of the test run).
	bender.setTestCase = function( tc ) {
		bender._.currentTestCase = tc;
	};

	// bender.testSuite = function( tests, name ) {
	// 	this
	// };

	// bender.configureEditor = function( config, callback ) {
	// 	var toLoad = 0,
	// 		removePlugins,
	// 		regexp,
	// 		i;
    //
	// 	if ( config.plugins ) {
	// 		if ( typeof config.plugins == 'string') {
	// 			config.plugins = config.plugins.split( ',' );
	// 		}
    //
	// 		CKEDITOR.config.plugins = CKEDITOR.config.plugins.length ?
	// 			CKEDITOR.config.plugins.split( ',' ).concat( config.plugins ).join( ',' ) :
	// 			config.plugins.join( ',' );
	// 	}
    //
	// 	// support both Bender <= 0.2.2 and >= 0.2.3 directives
	// 	removePlugins = config[ 'remove-plugins' ] || ( config.remove && config.remove.plugins );
    //
	// 	if ( removePlugins ) {
	// 		CKEDITOR.config.removePlugins = removePlugins.join( ',' );
    //
	// 		regexp = new RegExp( '(?:^|,)(' + removePlugins.join( '|' ) + ')(?=,|$)', 'g' );
    //
	// 		CKEDITOR.config.plugins = CKEDITOR.config.plugins
	// 			.replace( regexp, '' )
	// 			.replace( /,+/g, ',' )
	// 			.replace( /^,|,$/g, '' );
    //
	// 		if ( config.plugins ) {
	// 			config.plugins = config.plugins.join( ',' )
	// 				.replace( regexp, '' )
	// 				.replace( /,+/g, ',' )
	// 				.replace( /^,|,$/g, '' )
	// 				.split( ',' );
	// 		}
	// 	}
    //
	// 	bender.plugins = config.plugins;
    //
	// 	if ( bender.plugins ) {
	// 		toLoad++;
	// 		// defer();
    //
	// 		CKEDITOR.plugins.load( config.plugins, onLoad );
	// 	}
    //
	// 	if ( config.adapters ) {
	// 		for ( i = 0; i < config.adapters.length; i++ ) {
	// 			config.adapters[ i ] = CKEDITOR.basePath + 'adapters/' + config.adapters[ i ] + '.js';
	// 		}
    //
	// 		toLoad++;
	// 		// defer();
    //
	// 		CKEDITOR.scriptLoader.load( config.adapters, onLoad );
	// 	}
    //
	// 	function onLoad() {
	// 		if ( toLoad ) {
	// 			toLoad--;
	// 		}
    //
	// 		if ( !toLoad ) {
	// 			bender.setupEditors( callback );
	// 		}
	// 	}
	// };

	// bender.setupEditors = function( callback ) {
	// 	startRunner( callback );
	// };

	bender.setupEditors = function( testCase, startTestsCallback ) {

		onDocumentReady( start );

		function start() {

			setUpEditor();

			// async:init stage 1: set up bender.editor.
			function setUpEditor() {
				if ( !bender.editor ) {
					// If there is no bender.editor jump to stage 2.
					setUpEditors();
					return;
				}

				bender.editorBot.create( bender.editor, function( bot ) {
					// bender.editor = bender.testCase.editor = bot.editor;
					bot.testCase.editor = bot.editor;
					// bender.testCase.editorBot = bot;
					bot.testCase.editorBot = bot;
					setUpEditors();
				} );
			}

			// async:init stage 2: set up bender.editors.
			function setUpEditors() {
				if ( !bender.editors ) {
					// If there is no bender.editor jump to stage 3.
					startTestsCallback(); // TODO
					return;
				}

				var editorsDefinitions = bender.editors,
					names = [],
					editors = {},
					bots = {},
					i = 0;

				// The funniest for-in loop I've ever seen.
				for ( names[ i++ ] in editorsDefinitions ); // jshint ignore:line

				next();

				function next() {
					var name = names.shift(),
						definition = editorsDefinitions[ name ];

					if ( !name ) {
						// bender.editors = bender.testCase.editors = editors;
						testCase.editors = editors;
						// bender.editorBots = bender.testCase.editorBots = bots;
						testCase.editorBots = bots;
						startTestsCallback();
						return;
					}

					if ( !definition.name ) {
						definition.name = name;
					}

					if ( bender.editorsConfig ) {
						if ( !definition.config ) {
							definition.config = {};
						}

						CKEDITOR.tools.extend( definition.config, bender.editorsConfig );
					}

					bender.editorBot.create( definition, function( bot ) {
						bots[ name ] = bot;
						editors[ name ] = bot.editor;
						next();
					} );
				}
			}

			// // async:init stage 3: call original async/async:init and finish async:init (testCase.callback).
			// function callback() {
			// 	debugger;
			// 	if ( bender._init ) {
			// 		var init = bender._init;
            //
			// 		delete bender._init;
            //
			// 		init.call( bender.testCase );
			// 	}
            //
			// 	if ( bender._asyncInit ) {
			// 		var asyncInit = bender._asyncInit;
            //
			// 		delete bender._asyncInit;
            //
			// 		asyncInit.call( bender.testCase );
			// 	} else {
			// 		bender.testCase.callback();
			// 	}
			// }
            //
			// // after setting up editors run tests
			// function startTests() {
			// 	callbackFn();
			// }
		}
	};

	function onDocumentReady( callback ) {
		function complete() {
			if ( document.addEventListener ||
				event.type === 'load' ||
				document.readyState === 'complete' ) {

				if ( document.removeEventListener ) {
					document.removeEventListener( 'DOMContentLoaded', complete, false );
					window.removeEventListener( 'load', complete, false );
				} else {
					document.detachEvent( 'onreadystatechange', complete );
					window.detachEvent( 'onload', complete );
				}

				callback();
			}
		}

		if ( document.readyState === 'complete' ) {
			setTimeout( callback );
		} else if ( document.addEventListener ) {
			document.addEventListener( 'DOMContentLoaded', complete, false );
			window.addEventListener( 'load', complete, false );
		} else {
			document.attachEvent( 'onreadystatechange', complete );
			window.attachEvent( 'onload', complete );
		}
	}
} )( this, bender );
