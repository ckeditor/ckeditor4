/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function( window, bender ) {
	'use strict';

	// TODO config mockup - previously it was generated dynamically by bender server.
	bender.config = window.BENDER_CONFIG;

	// Returns currently executed test suite or null.
	bender.getTestSuite = function() {
		return bender._currentTestSuite;
	};

	// Sets currently executed test suite (should be set in `before` method).
	bender.setTestSuite = function( ts ) {
		bender._currentTestSuite = ts;
	};

	bender.getBenderPlugins = function() {
		return bender._plugins;
	};

	bender.setBenderPlugins = function( plugins, removePlugins) {
		bender._plugins = {
			plugins: plugins,
			removePlugins: removePlugins
		};
	};

	bender.resetCKEditorSettings = function() {
		CKEDITOR.config.customConfig = '';
		CKEDITOR.replaceClass = false;
		CKEDITOR.disableAutoInline = true;
	};

	bender.configurePlugins = function( config ) {
		var pluginsToRemove,
			removePlugins,
			regexp,
			plugins;

		if ( config.plugins ) {
			plugins = config.plugins;
			if ( typeof plugins != 'string' ) {
				plugins = plugins.join( ',' );
			}
		}

		// support both Bender <= 0.2.2 and >= 0.2.3 directives
		pluginsToRemove = config[ 'remove-plugins' ] || ( config.remove && config.remove.plugins );

		if ( pluginsToRemove ) {
			removePlugins = pluginsToRemove.join( ',' );

			regexp = new RegExp( '(?:^|,)(' + pluginsToRemove.join( '|' ) + ')(?=,|$)', 'g' );

			plugins = plugins.replace( regexp, '' ).replace( /,+/g, ',' ).replace( /^,|,$/g, '' );
		}

		bender.setBenderPlugins( plugins, removePlugins );
	};

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
