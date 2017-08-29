( function( window ) {
	'use strict';

	var ckTools = CKEDITOR.tools,
		arrayTools = ckTools.array,
		counter = 1,
		testEditorConfig = window.test_editor_config;

	// TODO
	// Many tests and helpers operates on global bender property which stores current tc, editor instances etc.
	// We should rewrite it as much as possible (without changing tests) to use instances defined per test suite.

	window.bender = {
		// Translate bender tests format to mocha.
		test: function( tests ) {
			var testKeys = arrayTools.filter( ckTools.objectKeys( tests ), function( key ) {
					return key.match( /^test/ );
				} ),
				bender = window.bender,
				testSuite,
				i;

			if ( testKeys.length ) {
				testSuite = tests;
				testSuite.name = 'Test suite ' + counter;

				describe( testSuite.name, ( function( testIndex ) {

					return function() {

						// When starting execution of new test suite:
						// 1. Assign current testSuite to bender (it is used further in the execution).
						// 2. Setup all editor instances.
						// 3. Run original "init" function.
						before( function( done ) {

							bender.setTestSuite( testSuite );
							// TODO pass editor config (testEditorConfig)
							bender.setupEditors( testSuite, function() {
								if ( tests.init ) {
									tests.init();
								}
								done();
							} );
						} );

						// Before each test case:
						// 1. Reset "currentTestCase" global bender property.
						// 2. Run original "setUp" function.
						beforeEach( function() {
							bender.currentTestCase = null;
							if ( tests.setUp ) {
								tests.setUp();
							}
						} );

						// After each test case:
						// 1. Reset "currentTestCase" global bender property.
						afterEach( function() {
							bender.currentTestCase = null;
						} );

						// After each test suite:
						// 1. Run original "tearDown" function.
						// 2. Destroy all editor instances (if any) initiated in this test suite.
						after( function( done ) {
							if ( tests.tearDown ) {
								tests.tearDown();
							}

							var destroyedInstances = 0,
								instances = ckTools.objectKeys( CKEDITOR.instances );

							if ( instances.length ) {
								CKEDITOR.on( 'instanceDestroyed', function( evt ) {
									destroyedInstances++;
									if ( destroyedInstances == instances.length ) {
										// CKEDITOR.removeAllListeners();
										console.log( testSuite.name, 'instanceDestroyed' , destroyedInstances, instances.length );
										bender.setTestSuite( null );
										done();
									}
								} );

								arrayTools.forEach( instances, function( instanceName ) {
									CKEDITOR.instances[ instanceName ].destroy();
								} );
							} else {
								bender.setTestSuite( null );
								done();
							}
						} );

						for ( i = 0; i < testKeys.length; i++ ) {
							// Running each test case:
							// 1. By default it is treated as async - done passed.
							// 2. Setup wait/resume.
							// 3. Set "currentTestCase" global bender property so we know we are executing a test case.
							// 4. Run original test function.
							it( testKeys[ i ], ( function() {
								var testFn = tests[ testKeys[ i ] ],
									testName = testKeys[ i ];

								return function( done ) {
									var scope = this;

									// TODO
									window.wait = function() {
										// console.log( 'wait' );
										bender.currentTestCase.isWaiting = true;
									};

									// TODO
									window.resume = function( callback ) {
										// console.log( 'resume' );
										if ( !bender.currentTestCase.isWaiting ) {
											// TODO throw 'resume called without wait'; done();
										} else {
											bender.currentTestCase.isWaiting = false;
											callback();
											if ( !bender.currentTestCase.isWaiting ) {
												done();
											}
										}
									};

									window.assert.ignore = function() {
										scope.skip();
									};

									bender.currentTestCase = {
										name: testName,
										isWaiting: false,
										wait: window.wait,
										resume: window.resume,
										done: done
									};

									ckTools.bind( testFn, testSuite )();

									if ( !bender.currentTestCase.isWaiting ) {
										done();
									}
								}
							} )() );
						}
					};
				} )( i ) );

				counter += 1;
			}
		}
	};
} )( this );


// wait = function ( callback, delay ) {
// 	delay = ( typeof callback === 'number') ? callback : ( typeof delay === 'number') ? delay : 10000;
//
// 	if ( typeof callback !== 'function' ) {
// 		callback = function() {};
// 	}
//
// 	var timeoutId = setTimeout( callback, delay );
// },




// /**
//  * Resumes a paused test and runs the given function.
//  * @param {Function} segment (Optional) The function to run.
//  *      If omitted, the test automatically passes.
//  * @method resume
//  */
// resume : function (segment) {
// 	YUITest.TestRunner.resume(segment);
// },
//
// /**
//  * Resumes the TestRunner after wait() was called.
//  * @param {Function} segment The function to run as the rest
//  *      of the haulted test.
//  * @method resume
//  * @static
//  */
// resume : function (segment) {
// 	if (this._waiting){
// 		this._resumeTest(segment || function(){});
// 	} else {
// 		throw new Error("resume() called without wait().");
// 	}
// },
//
// /**
//  * Causes the test case to wait a specified amount of time and then
//  * continue executing the given code.
//  * @param {Function} segment (Optional) The function to run after the delay.
//  *      If omitted, the TestRunner will wait until resume() is called.
//  * @param {Number} delay (Optional) The number of milliseconds to wait before running
//  *      the function. If omitted, defaults to `DEFAULT_WAIT` ms (10s).
//  * @method wait
//  */
// wait : function (segment, delay){
// 	delay = (typeof segment === 'number') ? segment :
// 		(typeof delay   === 'number') ? delay :
// 			YUITest.TestCase.DEFAULT_WAIT;
//
// 	if (typeof segment !== 'function') {
// 		segment = YUITest.TestCase._waitTimeout;
// 	}
//
// 	throw new YUITest.Wait(segment, delay);
// },
//
//
// // Workaround for IE8 - window.resume / window.wait won't work in this environment...
// var resume = bender.Y.Test.Case.prototype.resume = ( function() { // jshint ignore:line
// 	var org = bender.Y.Test.Case.prototype.resume;
//
// 	return function( segment ) {
// 		var that = this;
//
// 		setTimeout( function() {
// 			org.call( that, segment );
// 		} );
// 	};
// } )();
//
// var wait = function( callback ) { // jshint ignore:line
// 	var args = [].slice.apply( arguments );
//
// 	if ( args.length == 1 && typeof callback == 'function' ) {
// 		setTimeout( callback );
// 		bender.Y.Test.Case.prototype.wait.call( null );
// 	} else {
// 		bender.Y.Test.Case.prototype.wait.apply( null, args );
// 	}
// };
