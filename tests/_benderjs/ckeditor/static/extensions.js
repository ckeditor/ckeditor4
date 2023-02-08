/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function( window, bender ) {
	'use strict';

	var overrides = [ 'areSame', 'areNotSame', 'areEqual', 'areNotEqual' ],
		YTest = bender.Y.Test,
		i;

	// Override and extend assertions.
	window.assert = bender.assert;
	window.arrayAssert = bender.arrayAssert;
	window.objectAssert = bender.objectAssert;

	// Clean-up data from previous tests if available.
	// TODO check if this could be deleted after separating test context from parent.
	if ( bender.editor ) {
		delete bender.editor;
	}

	if ( bender.testCase ) {
		delete bender.testCase;
	}

	function override( org ) {
		return function( expected, actual, message ) {
			org.apply( this,
				expected instanceof CKEDITOR.dom.node &&
				actual instanceof CKEDITOR.dom.node ?
				[ expected.$, actual.$, message ] :
				arguments
			);
		};
	}

	for ( i = 0; i < overrides.length; i++ ) {
		bender.assert[ overrides[ i ] ] = bender.tools.override(
			bender.assert[ overrides[ i ] ],
			override
		);
	}

	/*
	 * Load the given plugin via `CKEDITOR.plugins.addExternal` call when tests are run
	 * from an external repository. If tests are run from main `ckeditor4` repository,
	 * the given plugin is simply loaded automatically and there is no need for `CKEDITOR.plugins.addExternal` call.
	 *
	 * It uses the fact that bender labels all tests in `./plugins/tests/`
	 * directory as `External Plugins` for detection, which happens only in `ckeditor4` repository.
	 *
	 * @param {String} name Name of the plugin to be loaded.
	 * @param {String} path Path to the plugin directory.
	 */
	bender.loadExternalPlugin = function( name, path ) {
		if ( bender.testData.group !== 'External Plugins' ) {
			CKEDITOR.plugins.addExternal( name, path, 'plugin.js' );
		}
	};

	/*
	 * @param {RegExp} expected RegExp that must be matched.
	 * @param {String} actual String value to be tested.
	 * @param {String} [message]
	 * @param {Boolean} [reversed=false] If `true` will reverse assertion, and ensure that pattern is not included.
	 */
	bender.assert.isMatching = function( expected, actual, message, reversed ) {
		YTest.Assert._increment();
		var desiredMatchResult = reversed ? false : true;
		// Using regexp.test may lead to unpredictable bugs when using global flag for regexp.
		if ( typeof actual != 'string' || !!actual.match( expected ) !== desiredMatchResult ) {
			throw new YTest.ComparisonFailure(
				YTest.Assert._formatMessage( message, 'Value should match expected pattern.' ),
				expected.toString(), actual
			);
		}
	};

	/*
	 * @param {RegExp} expected RegExp that **must not** be matched.
	 * @param {String} actual String value to be tested.
	 * @param {String} [message]
	 */
	bender.assert.isNotMatching = function( expected, actual, message ) {
		this.isMatching( expected, actual, message || 'Value can not match the pattern.', true );
	};

	/**
	 * Asserts that `innerHTML`-like HTML strings are equal. See the {@link bender.tools.html#compareInnerHtml}
	 * method for more information.
	 *
	 * @param {String|Array} expected
	 * @param {String} actual
	 * @param {Object} [options] {@link #compareInnerHtml}'s options.
	 * @param {String} [message]
	 */
	bender.assert.isInnerHtmlMatching = function( expected, actual, options, message ) {
		if ( typeof options != 'object' ) {
			message = options;
			options = null;
		}

		YTest.Assert._increment();

		if ( !bender.tools.html.compareInnerHtml( expected, actual, options ) ) {
			throw new YUITest.ComparisonFailure(
				YUITest.Assert._formatMessage( message, 'Values should be the same.' ),
				expectedToString( expected ),
				bender.tools.html.prepareInnerHtmlForComparison( actual, options )
			);
		}

		function expectedToString( expected ) {
			var strings = [],
				i;

			if ( typeof expected === 'object' ) {
				for ( i = 0; i < expected.length; i++ ) {
					strings.push( bender.tools.html.prepareInnerHtmlPattern( expected[ i ] ).toString() );
				}
				return '\n' + strings.join( '\n' );
			} else {
				return bender.tools.html.prepareInnerHtmlPattern( expected ).toString();
			}

		}
	};

	/**
	 * Assert that expected value is in range (between min and max).
	 *
	 * @param {Number} expected
	 * @param {Number} min
	 * @param {Number} max
	 * @param {String} [message]
	 */
	bender.assert.isNumberInRange = function( expected, min, max, message ) {
		YTest.Assert._increment();

		YTest.Assert.isNumber( expected, 'Expected value should be number type.' );
		YTest.Assert.isNumber( min, 'Min value should be number type.' );
		YTest.Assert.isNumber( max, 'Max value should be number type.' );

		if ( min >= max ) {
			throw new YUITest.AssertionError( 'Min value is greater or equal than max.' );
		}

		if ( expected < min || expected > max ) {
			throw new YUITest.ComparisonFailure(
				YUITest.Assert._formatMessage( message ),
				'Greater than ' + min + ' and lower than ' + max + '.',
				expected
			);
		}
	};

	/**
	 * Asserts that HTML data are the same. Use {@link bender.tools.compatHtml} to sort attributes,
	 * fix styles and encode `nbsp`.
	 *
	 * @param {String} expected
	 * @param {String} actual
	 * @param {String} [message]
	 */
	bender.assert.sameData = function( expected, actual, message ) {
		assert.areSame( expected, bender.tools.compatHtml( actual, false, true, false, true, true ), message );
	};

	/**
	 * Asserts that two objects are deep equal.
	 *
	 * @param {Object} expected
	 * @param {Object} actual
	 * @param {String} [message]
	 */
	bender.objectAssert.areDeepEqual = function( expected, actual, message ) {
		// Based on http://yuilibrary.com/yui/docs/api/files/test_js_ObjectAssert.js.html#l12.
		var expectedKeys = YUITest.Object.keys( expected ),
			actualKeys = YUITest.Object.keys( actual );

		YUITest.Assert._increment();

		// First check keys array length.
		if ( expectedKeys.length != actualKeys.length ) {
			YUITest.Assert.fail( YUITest.Assert._formatMessage( message,
				'Object should have ' + expectedKeys.length + ' keys but has ' + actualKeys.length ) );
		}

		// Then check values.
		for ( var name in expected ) {
			if ( expected.hasOwnProperty( name ) ) {
				if ( expected[ name ] && typeof expected[ name ] === 'object' ) {
					bender.objectAssert.areDeepEqual( expected[ name ], actual[ name ] );
				}
				else if ( expected[ name ] !== actual[ name ] ) {
					throw new YUITest.ComparisonFailure( YUITest.Assert._formatMessage( message,
						'Values should be equal for property ' + name ), expected[ name ], actual[ name ] );
				}
			}
		}
	};

	// Add support test ignore.
	YUITest.Ignore = function() {};

	bender.assert.ignore = function() {
		throw new YUITest.Ignore();
	};

	YTest.Runner._ignoreTest = function( node ) {
		var that = this,
			test,
			name;

		function updateResult( testNode, testName ) {
			testNode.results[ testName ] = {
				result: 'ignore',
				message: 'Test ignored',
				type: 'test',
				name: testName.indexOf( 'ignore:' ) === 0 ? testName.substring( 7 ) : testName
			};

			testNode.results.ignored++;
			testNode.results.total++;

			that.fire( {
				type: that.TEST_IGNORE_EVENT,
				testCase: testNode.testObject,
				testName: testName
			} );
		}

		test = node.testObject;

		if ( typeof test == 'string' ) {
			updateResult( node.parent, test );
			// Ignore all tests in this whole test case.
		} else {
			for ( name in test ) {
				if ( typeof test[ name ] == 'function' && name.match( /^test/ ) ) {
					updateResult( node, name );
					this._next();
				}
			}
		}
	};

	YTest.Runner._resumeTest = function( segment ) {
		// Get relevant information.
		var node = this._cur,
			failed = false,
			ignored = false,
			error = null,
			testName, testCase, shouldFail, shouldError;

		// We know there's no more waiting now.
		this._waiting = false;

		// If there's no node, it probably means a wait() was called after resume().
		if ( !node ) {
			return;
		}

		testName = node.testObject;
		testCase = node.parent.testObject;

		// Cancel other waits if available.
		if ( testCase.__yui_wait ) {
			clearTimeout( testCase.__yui_wait );
			delete testCase.__yui_wait;
		}

		// Get the "should" test cases.
		shouldFail = testName.indexOf( 'fail:' ) === 0 ||
			( testCase._should.fail || {} )[ testName ];

		shouldError = ( testCase._should.error || {} )[ testName ];

		this._inTest = true;

		// Try the test.
		try {
			// Run the test.
			segment.call( testCase, this._context );

			// If the test hasn't already failed and doesn't have any asserts...
			if ( !YUITest.Assert._getCount() && !this._ignoreEmpty ) {
				throw new YUITest.AssertionError( 'Test has no asserts.' );
				// If it should fail, and it got here, then it's a fail because it didn't.
			} else if ( shouldFail ) {
				error = new YUITest.ShouldFail();
				failed = true;
			} else if ( shouldError ) {
				error = new YUITest.ShouldError();
				failed = true;
			}
		} catch ( thrown ) {
			// Cancel any pending waits, the test already failed.
			if ( testCase.__yui_wait ) {
				clearTimeout( testCase.__yui_wait );
				delete testCase.__yui_wait;
			}

			if ( thrown instanceof YUITest.Ignore ) {
				this._ignoreTest( node );
				ignored = true;
			} else if ( thrown instanceof YUITest.AssertionError ) {
				if ( !shouldFail ) {
					error = thrown;
					failed = true;
				}
			} else if ( thrown instanceof YUITest.Wait ) {
				if ( typeof thrown.segment == 'function' ) {
					if ( typeof thrown.delay == 'number' ) {
						// Some environments don't support setTimeout.
						if ( typeof setTimeout != 'undefined' ) {
							testCase.__yui_wait = setTimeout( function() {
								YUITest.TestRunner._resumeTest( thrown.segment );
							}, thrown.delay );

							this._waiting = true;
						} else {
							throw new Error( 'Asynchronous tests not supported in this environment.' );
						}
					}
				}

				return;
			} else {
				// First check to see if it should error.
				if ( !shouldError ) {
					error = new YUITest.UnexpectedError( thrown );
					failed = true;
				} else if ( typeof shouldError == 'string' && thrown.message != shouldError ) {
					error = new YUITest.UnexpectedError( thrown );
					failed = true;
				} else if ( typeof shouldError == 'function' && !( thrown instanceof shouldError ) ) {
					error = new YUITest.UnexpectedError( thrown );
					failed = true;
				} else if ( typeof shouldError == 'object' && shouldError !== null && !( thrown instanceof shouldError
						.constructor ) ||
					thrown.message != shouldError.message ) {
					error = new YUITest.UnexpectedError( thrown );
					failed = true;
				}

				bender.error( thrown );
			}
		}

		this._inTest = false;

		if ( !ignored ) {
			// Fire appropriate event.
			this.fire( {
				type: failed ? this.TEST_FAIL_EVENT : this.TEST_PASS_EVENT,
				testCase: testCase,
				testName: testName,
				error: failed ? error : undefined
			} );

			// Run the tear down.
			this._execNonTestMethod( node.parent, 'tearDown', false );

			// Reset the assert count.
			YUITest.Assert._reset();

			// Update results.
			node.parent.results[ testName ] = {
				result: failed ? 'fail' : 'pass',
				message: error ? error.getMessage() : 'Test passed',
				type: 'test',
				name: testName,
				duration: new Date() - node._start
			};

			if ( failed ) {
				node.parent.results.failed++;
			} else {
				node.parent.results.passed++;
			}

			node.parent.results.total++;
		}

		// Set timeout not supported in all environments.
		if ( typeof setTimeout != 'undefined' ) {
			setTimeout( function() {
				YUITest.TestRunner._run();
			} );
		} else {
			this._run();
		}

	};

	YTest.Runner._execNonTestMethod = function( node, methodName, allowAsync ) {
		var testObject = node.testObject,
			event = {
				type: this.ERROR_EVENT
			};

		try {
			if ( allowAsync && testObject[ 'async:' + methodName ] ) {
				testObject[ 'async:' + methodName ]( this._context );
				return true;
			} else {
				testObject[ methodName ]( this._context );
			}
		} catch ( ex ) {
			if ( ex instanceof YUITest.Ignore ) {
				this._ignoreTest( node );
			} else {
				node.results.errors++;
				event.error = ex;
				event.methodName = methodName;
				if ( testObject instanceof YUITest.TestCase ) {
					event.testCase = testObject;
				}

				this.fire( event );
			}
		}

		return false;
	};

	YTest.Runner.callback = function() {
		var names = arguments,
			data = this._context,
			that = this,
			i;

		for ( i = 0; i < arguments.length; i++ ) {
			data[ names[ i ] ] = arguments[ i ];
		}

		that._run();
	};

	if ( typeof CKEDITOR != 'undefined' ) {
		CKEDITOR.config.customConfig = '';
		CKEDITOR.replaceClass = false;
		CKEDITOR.disableAutoInline = true;
	}

	bender.configureEditor = function( config ) {
		var toLoad = 0,
			removePlugins,
			regexp,
			i;

		if ( config.plugins ) {
			CKEDITOR.config.plugins = CKEDITOR.config.plugins.length ?
				CKEDITOR.config.plugins.split( ',' ).concat( config.plugins ).join( ',' ) :
				config.plugins.join( ',' );
		}

		// support both Bender <= 0.2.2 and >= 0.2.3 directives
		removePlugins = config[ 'remove-plugins' ] || ( config.remove && config.remove.plugins );

		if ( removePlugins ) {
			CKEDITOR.config.removePlugins = removePlugins.join( ',' );

			regexp = new RegExp( '(?:^|,)(' + removePlugins.join( '|' ) + ')(?=,|$)', 'g' );

			CKEDITOR.config.plugins = CKEDITOR.config.plugins
				.replace( regexp, '' )
				.replace( /,+/g, ',' )
				.replace( /^,|,$/g, '' );

			if ( config.plugins ) {
				config.plugins = config.plugins.join( ',' )
					.replace( regexp, '' )
					.replace( /,+/g, ',' )
					.replace( /^,|,$/g, '' )
					.split( ',' );
			}
		}

		bender.plugins = config.plugins;

		if ( bender.plugins ) {
			toLoad++;
			defer();

			CKEDITOR.plugins.load( config.plugins, onLoad );
		}

		if ( config.adapters ) {
			for ( i = 0; i < config.adapters.length; i++ ) {
				config.adapters[ i ] = CKEDITOR.basePath + 'adapters/' + config.adapters[ i ] + '.js';
			}

			toLoad++;
			defer();

			CKEDITOR.scriptLoader.load( config.adapters, onLoad );
		}

		function onLoad() {
			if ( toLoad ) {
				toLoad--;
			}

			if ( !toLoad ) {
				startRunner();
			}
		}
	};

	var unlockDeferment, deferredTests;

	// Defers Bender's startup.
	function defer() {
		if ( !unlockDeferment ) {
			unlockDeferment = bender.defer();
		}
	}

	// Unlock the created Bender deferment.
	function unlock() {
		if ( unlockDeferment ) {
			unlockDeferment();
			unlockDeferment = null;
		}
	}

	// Keep a reference to the original bender.test function.
	var orgTest = bender.test;

	// Flag saying if we need to restart the tests, e.g. when bender.test was executed asynchronously.
	var restart = false;

	bender.test = function( tests ) {
		if ( unlockDeferment && !restart ) {
			deferredTests = tests;
		} else {
			startRunner( tests );
		}
	};

	function startRunner( tests ) {
		tests = tests || deferredTests;

		// startRunner was executed but there were no tests available yet.
		if ( !tests ) {
			restart = true;
			// Unlock Bender startup.
			unlock();
			return;
		}

		if ( !tests.name ) {
			tests.name = bender.testData.id;
		}

		onDocumentReady( start );

		function start() {
			if ( bender.editor || bender.editors ) {
				bender._init = tests.init;
				bender._asyncInit = tests[ 'async:init' ];

				tests[ 'async:init' ] = setUpEditor;

				if ( bender.runner._running ) {
					wait();
				}
			}

			if ( bender.regressions ) {
				for ( var name in bender.regressions ) {
					bender.regressions[ name ] = bender.regressions[ name ]
						.replace( /env/g, 'CKEDITOR.env' );
				}
			}

			// Run the original bender.test function.
			orgTest( tests );

			// Unlock Bender startup.
			unlock();

			// async:init stage 1: set up bender.editor.
			function setUpEditor() {
				if ( !bender.editor ) {
					// If there is no bender.editor jump to stage 2.
					setUpEditors();
					return;
				}

				bender.editorBot.create( bender.editor, function( bot ) {
					bender.editor = bender.testCase.editor = bot.editor;
					bender.testCase.editorBot = bot;
					setUpEditors();
				} );
			}

			// async:init stage 2: set up bender.editors.
			function setUpEditors() {
				if ( !bender.editors ) {
					// If there is no bender.editor jump to stage 3.
					callback();
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
						bender.editors = bender.testCase.editors = editors;
						bender.editorBots = bender.testCase.editorBots = bots;
						callback();
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

			// async:init stage 3: call original async/async:init and finish async:init (testCase.callback).
			function callback() {
				if ( bender._init ) {
					var init = bender._init;

					delete bender._init;

					init.call( bender.testCase );
				}

				if ( bender._asyncInit ) {
					var asyncInit = bender._asyncInit;

					delete bender._asyncInit;

					asyncInit.call( bender.testCase );
				} else {
					bender.testCase.callback();
				}
			}
		}
	}

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

	bender.getAbsolutePath = function( path ) {
		var suffixIndex, suffix, temp;

		// If this is not a full or absolute path.
		if ( path.indexOf( '://' ) == -1 && path.indexOf( '/' ) !== 0 ) {
			// Webkit bug: Avoid requesting with original file name (MIME type)
			// which will stop browser from interpreting resources from same URL.
			suffixIndex = path.lastIndexOf( '.' );
			suffix = suffixIndex == -1 ? '' : path.substring( suffixIndex, path.length );

			if ( suffix ) {
				path = path.substring( 0, suffixIndex );
			}

			temp = window.document.createElement( 'img' );
			temp.src = path;

			return temp.src + suffix;
		} else {
			return path;
		}
	};
} )( this, bender );

// Workaround for IE8 - window.resume / window.wait won't work in this environment...
var resume = bender.Y.Test.Case.prototype.resume = ( function() { // jshint ignore:line
		var org = bender.Y.Test.Case.prototype.resume;

		return function( segment ) {
			var that = this;

			setTimeout( function() {
				org.call( that, segment );
			} );
		};
	} )(),

	wait = function( callback ) { // jshint ignore:line
		var args = [].slice.apply( arguments );

		if ( args.length == 1 && typeof callback == 'function' ) {
			setTimeout( callback );
			bender.Y.Test.Case.prototype.wait.call( null );
		} else {
			bender.Y.Test.Case.prototype.wait.apply( null, args );
		}
	};
