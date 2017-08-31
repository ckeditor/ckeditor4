/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function( window, bender ) {

	'use strict';

	var tools = CKEDITOR.tools,
		arrayTools = tools.array;


	function MochaAdapter( benderTestSuite, benderTestNames, benderTestTags ) {
		this._benderTestSuite = benderTestSuite;
		this._benderTestNames = benderTestNames;
		this._benderTestTags = benderTestTags;
		this._htmlSandbox = null;
		this._isWaiting = false;
		this._isInTest = false;
	}

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

		debugger;

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
		}
	};

	// When starting execution of new test suite:
	// 1. Append HTML fixture to `fixtureContainer` (if any).
	// 2. Configure editor plugins config based on bender tags.
	// 3. Assign current testSuite to bender (it is used further in the execution).
	// 4. Setup all editor instances.
	// 5. Run original "init" function.
	MochaAdapter.prototype._getBefore = function() {
		var scope = this,
			ts = this._benderTestSuite,
			tags = this._benderTestTags;

		return function( done ) {
			scope._createHtmlSandbox();

			if ( tags.test.fixture ) {
				scope._appendFixture( tags.test.fixture.path );
			}

			bender.configurePlugins( tags.ckeditor || {} );

			bender.setTestSuite( scope );

			bender.setupEditors( ts, function() {
				if ( ts.init ) {
					ts.init();
				}
				done();
			} );
		}
	};

	// Before each test case:
	// 1. Run original "setUp" function.
	MochaAdapter.prototype._getBeforeEach = function() {
		var ts = this._benderTestSuite;

		return function() {
			if ( ts.setUp ) {
				ts.setUp();
			}
		}
	};

	// After each test case:
	// 1. Run original "tearDown" function.
	MochaAdapter.prototype._getAfterEach = function() {
		var ts = this._benderTestSuite;

		return function() {
			if ( ts.tearDown ) {
				ts.tearDown();
			}
		}
	};

	// After test suite:
	// 1. Destroy all editor instances (if any) initiated in this test suite.
	// 2. Reset "currentTestSuite" global bender property.
	// 3. Remove `htmlSandbox` container.
	MochaAdapter.prototype._getAfter = function() {
		var scope = this,
			allInstances = null,
			destroyedInstances = 0,
			doneFn = null;

		function onInstanceDestroyed() {
			destroyedInstances++;
			if ( destroyedInstances == allInstances.length ) {
				CKEDITOR.removeAllListeners();
				onDone();
			}
		}

		function onDone() {
			bender.setTestSuite( null );
			scope._removeHtmlSandbox();
			doneFn();
		}

		return function( done ) {
			allInstances = tools.objectKeys( CKEDITOR.instances );

			doneFn = done;

			if ( allInstances.length ) {
				CKEDITOR.on( 'instanceDestroyed', onInstanceDestroyed );

				arrayTools.forEach( allInstances, function( instanceName ) {
					if ( CKEDITOR.instances[ instanceName ].status === 'unloaded' ) {
						CKEDITOR.remove( CKEDITOR.instances[ instanceName ] );
						onInstanceDestroyed();

					} else if ( CKEDITOR.instances[ instanceName ].status !== 'destroyed' ) {
						CKEDITOR.instances[ instanceName ].destroy();

					} else {
						onInstanceDestroyed();
					}
				} );
			} else {
				onDone();
			}
		}
	};

	// Running each test case:
	// 1. By default every test case is treated as async.
	// 2. Setup wait/resume.
	// 3. Setup assert.ignore;
	// 4. Set "currentTestCase" global bender property so we know we are executing a test case.
	// 5. Run original test function.
	MochaAdapter.prototype._getTestCase = function( testFn ) {
		var scope = this,
			testScope = null,
			doneFn = null;

		function wait() {
			scope._isWaiting = true;
		}

		function resume( callback ) {
			if ( !scope._isWaiting ) {
				throw 'resume called without wait';
			} else {
				scope._isWaiting = false;
				callback();
				if ( !scope._isWaiting ) {
					scope._isInTest = false;
					doneFn();
				}
			}
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

			tools.bind( testFn, scope._benderTestSuite )();

			if ( !scope._isWaiting ) {
				scope._isInTest = false;
				doneFn();
			}
		}
	};

	// Creates HTML container in which fixtures are placed and also all editor instanced
	// created by `bender.editorBot.create`.
	MochaAdapter.prototype._createHtmlSandbox = function() {
		this._htmlSandbox = document.createElement( 'div' );
		this._htmlSandbox.setAttribute( 'id', 'html-container' );
		window.document.body.appendChild( this._htmlSandbox );
	};

	MochaAdapter.prototype._removeHtmlSandbox = function() {
		this._htmlSandbox.remove();
		this._htmlSandbox = null;
	};

	MochaAdapter.prototype._appendFixture = function( path ) {
		if ( window.__html__ && window.__html__[ path ] ) {
			this._htmlSandbox.innerHTML = window.__html__[ path ];
		}
	};

	window.MochaAdapter = MochaAdapter;

} )( this, bender );
