/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* globals describe, before, beforeEach, afterEach, after, it */

( function( window, bender ) {

	'use strict';

	var tools = CKEDITOR.tools,
		arrayTools = tools.array;


	function MochaAdapter( benderTestSuite, benderTestNames, benderTestTags, editorsConfig ) {
		this._benderTestSuite = benderTestSuite;
		this._benderTestNames = benderTestNames;
		this._benderTestTags = benderTestTags;
		this._benderEditorsConfig = editorsConfig;
		this._workspaceStartMark = null;
		this._editorsWrapper = null;
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
		};
	};

	// When starting execution of new test suite:
	// - Mark workspace start with a comment. All tests specific DOM elements will ba added after it and removed
	//	 after test suite is finished.
	// - Append HTML fixture to `htmlSandbox` (if any).
	// - Create HTML container which will hold fixtures and editor instances.
	// - Reset some CKEDITOR settings (compatible with what bender does).
	// - Configure editor plugins config based on bender tags.
	// - Assign current testSuite to bender (it is used further in the execution).
	// - Assign editor/editors config so setupEditors can access it.
	// - Setup all editor instances.
	// - Run original "init" function.
	MochaAdapter.prototype._getBefore = function() {
		var scope = this,
			ts = this._benderTestSuite,
			tags = this._benderTestTags;

		return function( done ) {

			scope._markWorkspaceStart();

			if ( tags.test.fixture ) {
				scope._appendFixture( tags.test.fixture.path );
			}

			scope._createEditorsWrapper();

			bender.resetCKEditorSettings();

			bender.configurePlugins( tags.ckeditor || {} );

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
	// - Run original "tearDown" function.
	MochaAdapter.prototype._getAfterEach = function() {
		var ts = this._benderTestSuite;

		return function() {
			if ( ts.tearDown ) {
				ts.tearDown();
			}
		};
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

		function onInstanceLoaded( evt ) {
			evt.editor.destroy();
		}

		function onInstanceDestroyed( evt ) {
			destroyedInstances++;
			if ( evt && evt.editor ) {
				evt.editor.removeAllListeners();
			}
			if ( destroyedInstances == allInstances.length ) {
				CKEDITOR.removeListener( onInstanceDestroyed );
				onDone();
			}
		}

		function onDone() {
			bender.setTestSuite( null );
			scope._cleanup();
			doneFn();
		}

		return function( done ) {
			allInstances = tools.objectKeys( CKEDITOR.instances );

			doneFn = done;

			if ( allInstances.length ) {
				CKEDITOR.on( 'instanceDestroyed', onInstanceDestroyed );

				arrayTools.forEach( allInstances, function( instanceName ) {
					if ( CKEDITOR.instances[ instanceName ].status === 'unloaded' ) {
						CKEDITOR.instances[ instanceName ].on( 'loaded', onInstanceLoaded );

					} else if ( CKEDITOR.instances[ instanceName ].status !== 'destroyed' ) {
						CKEDITOR.instances[ instanceName ].destroy();

					} else {
						onInstanceDestroyed();
					}
				} );
			} else {
				onDone();
			}
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
		};
	};

	MochaAdapter.prototype._markWorkspaceStart = function() {
		this._workspaceStartMark = window.document.createComment( 'Workspace:Start' );
		window.document.body.appendChild( this._workspaceStartMark );
	};

	// Creates HTML container in which all editor instances created by `bender.editorBot.create` are inserted.
	MochaAdapter.prototype._createEditorsWrapper = function() {
		this._editorsWrapper = document.createElement( 'div' );
		this._editorsWrapper.setAttribute( 'id', 'editors-wrapper' );
		window.document.body.appendChild( this._editorsWrapper );
	};

	// All fixtures are placed directly in the `body` and after `this._workspaceStartMark` element. Fixtures needs
	// to be placed directly in the body as in some tests elements paths are checked (so the wrapper container
	// will be additional element in this path, breaking the assertions). Also some tests uses generic selectors like
	// `getElementsByTagName` so any element with the same name before fixtures may break the test, so that is the reason
	// fixtures are placed right after script tags (after `this._workspaceStartMark` element).
	MochaAdapter.prototype._appendFixture = function( path ) {
		if ( window.__html__ && window.__html__[ path ] ) {
			window.document.body.insertAdjacentHTML( 'beforeend', window.__html__[ path ] );
		}
	};

	// Removes all nodes placed after `this._workspaceStartMark` in the DOM.
	MochaAdapter.prototype._cleanup = function() {
		var children = window.document.body.children,
			childrenLength = children.length,
			child;

		this._editorsWrapper = null;

		// Removes all nodes after 'workspaceStartMark' (including 'workspaceStartMark').
		for ( var i = childrenLength - 1; i >= 0; i-- ) {
			child = children[ i ];
			if ( child === this._workspaceStartMark ) {
				child.remove();
				break;
			}
			child.remove();
		}
	};

	window.MochaAdapter = MochaAdapter;

} )( this, bender );
