/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* globals describe, before, beforeEach, afterEach, after, it */

( function( window, bender ) {

	'use strict';

	var tools = CKEDITOR.tools,
		defaultWaitTimeoutMs = 7500;


	function MochaAdapter( benderTestSuite, benderTestNames, benderTestTags, editorsConfig ) {
		this._benderTestSuite = benderTestSuite;
		this._benderTestNames = benderTestNames;
		this._benderTestTags = benderTestTags;
		this._benderEditorsConfig = editorsConfig;
		this._isWaiting = false;
		this._isInTest = false;
		this._waitTimeoutId = null;
	}

	MochaAdapter.appendFixtures = function( testTags ) {
		if ( testTags.fixture ) {
			var fixturePath = testTags.fixture.path;

			if ( window.__html__ && window.__html__[ fixturePath ] ) {
				// All fixtures are placed directly in the end of the `body`. Fixtures needs to be placed directly in the body as
				// in some tests elements paths are checked (so the wrapper container will be additional element in this path, breaking the assertions).
				window.document.body.insertAdjacentHTML( 'beforeend', window.__html__[ fixturePath ] );
			}
		}
	};

	MochaAdapter.prototype.getBenderTestCase = function() {
		return this._benderTestSuite;
	};

	MochaAdapter.prototype.isWaiting = function() {
		return this._isWaiting;
	};

	MochaAdapter.prototype.isInTest = function() {
		return this._isInTest;
	};

	// Generate Mocha test suite.
	MochaAdapter.prototype.generateTestSuite = function() {
		var scope = this,
			ts = this._benderTestSuite,
			testNames = this._benderTestNames;

		return function() {

			describe( scope._benderTestTags.test.name, function() {

				before( scope._getBefore() );

				beforeEach( scope._getBeforeEach() );

				afterEach( scope._getAfterEach() );

				after( scope._getAfter() );

				for ( var i = 0; i < testNames.length; i++ ) {
					it( testNames[ i ], scope._getTestCase( ts[ testNames[ i ] ] ) );
				}
			} );
		};
	};

	// When starting execution of new test suite:
	// - Reset some CKEDITOR settings (compatible with what bender does).
	// - Configure and load editor plugins based on bender tags.
	// - Assign current testSuite to bender (it is used further in the execution).
	// - Assign editor/editors config so setupEditors can access it.
	// - Setup all editor instances.
	// - Run original "init" function.
	MochaAdapter.prototype._getBefore = function() {
		var scope = this,
			ts = this._benderTestSuite,
			tags = this._benderTestTags;

		return function( done ) {

			bender.resetCKEditorSettings();

			bender.configurePlugins( tags.ckeditor || {}, function() {

				bender.setTestSuite( scope );

				bender.editor = scope._benderEditorsConfig.editor;
				bender.editors = scope._benderEditorsConfig.editors;

				bender.setupEditors( ts, function() {
					if ( ts.init ) {
						ts.init();
						done();
					} else if ( ts[ 'async:init' ] ) {
						ts.callback = done;
						ts[ 'async:init' ]();
					} else {
						done();
					}
				} );
			} );
		};
	};

	// Before each test case:
	// - Run original "setUp" function.
	MochaAdapter.prototype._getBeforeEach = function() {
		var ts = this._benderTestSuite;

		return function() {
			if ( ts.setUp ) {
				ts.setUp();
			}
		};
	};

	// After each test case:
	// - Reset test specific flags/properties.
	// - Run original "tearDown" function.
	MochaAdapter.prototype._getAfterEach = function() {
		var scope = this,
			ts = this._benderTestSuite;

		return function() {
			scope._cleanupAfterTest();
			if ( ts.tearDown ) {
				ts.tearDown();
			}
		};
	};

	// After test suite:
	// - Reset current testSuite bender property.
	MochaAdapter.prototype._getAfter = function() {
		return function( done ) {
			bender.setTestSuite( null );
			done();
		};
	};

	// Running each test case:
	// - By default every test case is treated as async.
	// - Setup wait/resume.
	// - Setup assert.ignore;
	// - Run original test function.
	MochaAdapter.prototype._getTestCase = function( testFn ) {
		var scope = this,
			testScope = null,
			doneFn = null;

		function wait( fn, delay ) {
			var callback = fn,
				timeout = ( typeof fn === 'number' ) ? fn :
					( typeof delay === 'number' ) ? delay :
					defaultWaitTimeoutMs;

			scope._isWaiting = true;

			if ( fn && typeof fn === 'function' && delay === undefined ) {
				setTimeout( fn );
				callback = null;
			}

			scope._waitTimeoutId = setTimeout( function() {
				resume( callback );
			}, timeout );
		}

		function resume( callback ) {
			setTimeout( function() {
				if ( !scope._isWaiting ) {
					throw 'resume called without wait';
				} else {
					scope._isWaiting = false;
					if ( scope._waitTimeoutId ) {
						clearTimeout( scope._waitTimeoutId );
						scope._waitTimeoutId = null;
					}
					if ( callback ) {
						callback();
					}
					if ( !scope._isWaiting ) {
						scope._isInTest = false;
						doneFn();
					}
				}
			} );
		}

		function ignore() {
			testScope.skip();
		}

		return function( done ) {
			scope._isInTest = true;

			testScope = this;
			doneFn = done;

			// Globally used functions.
			window.wait = wait;
			window.resume = resume;
			window.assert.ignore = ignore;
			// Sometimes tc.wait() / tc.resume() is used.
			scope._benderTestSuite.wait = wait;
			scope._benderTestSuite.resume = resume;

			setTimeout( function() {
				tools.bind( testFn, scope._benderTestSuite )();

				if ( !scope._isWaiting ) {
					scope._isInTest = false;
					doneFn();
				}
			}, 0 );
		};
	};

	// If test failed some properties might be in a wrong state.
	MochaAdapter.prototype._cleanupAfterTest = function() {
		this._isWaiting = false;
		this._isInTest = false;
		if ( this._waitTimeoutId ) {
			this._waitTimeoutId = null;
			clearTimeout( this._waitTimeoutId );
		}
	};

	window.MochaAdapter = MochaAdapter;

} )( this, bender );
