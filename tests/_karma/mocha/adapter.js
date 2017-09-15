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
		this._htmlWorkspace = null;
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
	// - Create HTML container which will hold fixtures and editor instances.
	// - Append HTML fixture to `htmlSandbox` (if any).
	// - Reset some CKEDITOR settings.
	// - Configure editor plugins config based on bender tags.
	// - Assign current testSuite to bender (it is used further in the execution).
	// - Setup all editor instances.
	// - Run original "init" function.
	MochaAdapter.prototype._getBefore = function() {
		var scope = this,
			ts = this._benderTestSuite,
			tags = this._benderTestTags;

		return function( done ) {
			scope._createHtmlWorkspace();

			if ( tags.test.fixture ) {
				scope._appendFixture( tags.test.fixture.path );
			}

			bender.resetCKEditorSettings();

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
	// - Run original "setUp" function.
	MochaAdapter.prototype._getBeforeEach = function() {
		var ts = this._benderTestSuite;

		return function() {
			if ( ts.setUp ) {
				ts.setUp();
			}
		}
	};

	// After each test case:
	// - Run original "tearDown" function.
	MochaAdapter.prototype._getAfterEach = function() {
		var ts = this._benderTestSuite;

		return function() {
			if ( ts.tearDown ) {
				ts.tearDown();
			}
		}
	};

	// After test suite:
	// - Destroy all editor instances (if any) initiated in this test suite.
	// - Reset current testSuite bender property.
	// - Remove `htmlSandbox` container.
	MochaAdapter.prototype._getAfter = function() {
		var scope = this,
			allInstances = null,
			destroyedInstances = 0,
			doneFn = null;

		function onInstanceDestroyed( evt ) {
			destroyedInstances++;
			evt.editor.removeAllListeners();
			if ( destroyedInstances == allInstances.length ) {
				CKEDITOR.removeListener( onInstanceDestroyed );
				onDone();
			}
		}

		function onDone() {
			bender.setTestSuite( null );
			scope._clearFixtures();
			scope._clearHtmlWorkspace();
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
	// - By default every test case is treated as async.
	// - Setup wait/resume.
	// - Setup assert.ignore;
	// - Run original test function.
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

	// Creates HTML container in which all editor instances created by `bender.editorBot.create` are inserted.
	MochaAdapter.prototype._createHtmlWorkspace = function() {
		this._htmlWorkspace = document.createElement( 'div' );
		this._htmlWorkspace.setAttribute( 'id', 'html-workspace' );
		window.document.body.appendChild( this._htmlWorkspace );
	};

	MochaAdapter.prototype._clearHtmlWorkspace = function() {
		this._htmlWorkspace.remove();
		this._htmlWorkspace = null;
	};

	// All fixtures are placed directly in the `body` and after `#html-workspace` element. Fixtures needs to be placed
	// directly in the body as in some tests elements path is checked (so the wrapper container
	// will be additional element in this path, breaking the assertions).
	MochaAdapter.prototype._appendFixture = function( path ) {
		if ( window.__html__ && window.__html__[ path ] ) {
			window.document.body.insertAdjacentHTML( 'beforeend', window.__html__[ path ] );
		}
	};

	// Removes all nodes placed after `#html-workspace` in the DOM (fixtures).
	MochaAdapter.prototype._clearFixtures = function() {
		var children = window.document.body.children,
			childrenLength = children.length,
			child;

		for ( var i = childrenLength - 1; i >= 0; i-- ) {
			child = children[ i ];
			if ( child.id === 'html-workspace' ) {
				break;
			}
			child.remove();
		}
	};

	window.MochaAdapter = MochaAdapter;

} )( this, bender );
