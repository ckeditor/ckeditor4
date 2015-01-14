/**
 * Copyright (c) 2015, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

( function( window, bender ) {
	'use strict';

	var overrides = [ 'areSame', 'areNotSame', 'areEqual', 'areNotEqual' ],
		YTest = bender.Y.Test,
		i;

	// override and extend assertions
	window.assert = bender.assert;
	window.arrayAssert = bender.arrayAssert;
	window.objectAssert = bender.objectAssert;

	// clean-up data from previous tests if available
	// TODO check if this could be deleted after separating test context from parent
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

	bender.assert.isMatching = function( expected, actual, message ) {
		YTest.Assert._increment();
		// Using regexp.test may lead to unpredictable bugs when using global flag for regexp.
		if ( typeof actual != 'string' || !actual.match( expected ) ) {
			throw new YTest.ComparisonFailure(
				YTest.Assert._formatMessage( message, 'Value should match expected pattern.' ),
				expected.toString(), actual
			);
		}
	};

	/**
	 * Asserts that `innerHTML`-like HTML strings are equal. See the {@link bender.tools.html#compareInnerHtml}
	 * method for more information.
	 *
	 * @param {String} expected
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
				bender.tools.html.prepareInnerHtmlPattern( expected ).toString(),
				bender.tools.html.prepareInnerHtmlForComparison( actual, options )
			);
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
				expected
			);
		}
	};

	// add support test ignore
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
			// Ignore all tests in this whole test case
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
		//get relevant information
		var node = this._cur,
			failed = false,
			ignored = false,
			error = null,
			testName, testCase, shouldFail, shouldError;

		//we know there's no more waiting now
		this._waiting = false;

		//if there's no node, it probably means a wait() was called after resume()
		if ( !node ) {
			return;
		}

		testName = node.testObject;
		testCase = node.parent.testObject;

		//cancel other waits if available
		if ( testCase.__yui_wait ) {
			clearTimeout( testCase.__yui_wait );
			delete testCase.__yui_wait;
		}

		//get the "should" test cases
		shouldFail = testName.indexOf( 'fail:' ) === 0 ||
			( testCase._should.fail || {} )[ testName ];

		shouldError = ( testCase._should.error || {} )[ testName ];

		this._inTest = true;

		//try the test
		try {
			//run the test
			segment.call( testCase, this._context );

			//if the test hasn't already failed and doesn't have any asserts...
			if ( !YUITest.Assert._getCount() && !this._ignoreEmpty ) {
				throw new YUITest.AssertionError( 'Test has no asserts.' );
				//if it should fail, and it got here, then it's a fail because it didn't
			} else if ( shouldFail ) {
				error = new YUITest.ShouldFail();
				failed = true;
			} else if ( shouldError ) {
				error = new YUITest.ShouldError();
				failed = true;
			}
		} catch ( thrown ) {
			//cancel any pending waits, the test already failed
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
						//some environments don't support setTimeout
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
				//first check to see if it should error
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
			//fire appropriate event
			this.fire( {
				type: failed ? this.TEST_FAIL_EVENT : this.TEST_PASS_EVENT,
				testCase: testCase,
				testName: testName,
				error: failed ? error : undefined
			} );

			//run the tear down
			this._execNonTestMethod( node.parent, 'tearDown', false );

			//reset the assert count
			YUITest.Assert._reset();

			//update results
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

		//set timeout not supported in all environments
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
		var regexp,
			toLoad = 0,
			i;

		if ( config.plugins ) {
			CKEDITOR.config.plugins = CKEDITOR.config.plugins.length ?
				CKEDITOR.config.plugins.split( ',' ).concat( config.plugins ).join( ',' ) :
				config.plugins.join( ',' );
		}

		if ( config[ 'remove-plugins' ] ) {
			CKEDITOR.config.removePlugins = config[ 'remove-plugins' ].join( ',' );

			regexp = new RegExp( '(?:^|,)(' + config[ 'remove-plugins' ].join( '|' ) + ')(?=,|$)', 'g' );

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
			bender.deferred = true;

			CKEDITOR.plugins.load( config.plugins, onLoad );
		}

		if ( config.adapters ) {
			for ( i = 0; i < config.adapters.length; i++ ) {
				config.adapters[ i ] = CKEDITOR.basePath + 'adapters/' + config.adapters[ i ] + '.js';
			}

			toLoad++;
			bender.deferred = true;

			CKEDITOR.scriptLoader.load( config.adapters, onLoad );
		}

		function onLoad() {
			if ( toLoad ) {
				toLoad--;
			}

			if ( !toLoad ) {
				if ( bender.deferred ) {
					delete bender.deferred;
				}

				bender.startRunner();
			}
		}
	};

	// keep reference to adapter's test function
	bender.oldTest = bender.test;

	bender.test = function( tests ) {
		if ( bender.deferred ) {
			if ( bender.deferred ) {
				delete bender.deferred;
			}

			bender.deferredTests = tests;
		} else {
			bender.startRunner( tests );
		}
	};

	function onReady( callback ) {
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

	bender.startRunner = function( tests ) {
		tests = tests || bender.deferredTests;

		if ( bender.deferredTests ) {
			delete bender.deferredTests;
		}

		if ( !tests ) {
			return;
		}

		if ( !tests.name ) {
			tests.name = bender.testData.id;
		}

		function startRunner() {
			// catch exceptions
			if ( bender.editor ) {
				if ( tests[ 'async:init' ] || tests.init ) {
					throw 'The "init/async:init" is not supported in conjunction' +
						' with bender.editor, use "setUp" instead.';
				}

				tests[ 'async:init' ] = function() {
					bender.editorBot.create( bender.editor, function( bot ) {
						bender.editor = bender.testCase.editor = bot.editor;
						bender.testCase.editorBot = bot;
						bender.testCase.callback();
					} );
				};

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

			bender.oldTest( tests );
		}

		onReady( startRunner );
	};

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

// workaround for IE8 - window.resume / window.wait won't work in this environment...
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
