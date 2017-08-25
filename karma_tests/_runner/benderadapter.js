( function() {
	'use strict';

	var ckTools = CKEDITOR.tools,
		arrayTools = ckTools.array,
		counter = 1,
		testEditorConfig = window.test_editor_config;


	// Mocha has before, beforeEach, afterEach and after methods (also can execute async code function( done ) { ... } ).
	// init -> before
	// setUp -> beforeEach
	// ? -> afterEach
	// tearDown -> after

	window.bender = {
		test: function( tests ) {
			var testKeys = arrayTools.filter( ckTools.objectKeys( tests ), function( key ) {
					return key.match( /^test/ );
				} ),
				i;

			bender.testCase = tests;

			if ( testKeys.length ) {

				describe( 'Test suite ' + counter, ( function( testIndex ) {

					return function() {
						before( function( done ) {
							function onEditorSetup() {
								if ( tests.init ) {
									tests.init();
								}
								done();
							}

							if ( testEditorConfig ) {
								window.bender.configureEditor( testEditorConfig, onEditorSetup );
							} else {
								window.bender.setupEditors( onEditorSetup );
							}
						} );

						if ( tests.setUp ) {
							beforeEach( function() {
								tests.setUp();
							} );
						}

						if ( tests.tearDown ) {
							after( function() {
								tests.tearDown();
							} );
						}

						for ( i = 0; i < testKeys.length; i++ ) {
							it( testKeys[ i ], ckTools.bind( tests[ testKeys[ i ] ], tests ) );
						}
					};
				} )( i ) );

				counter += 1;
			}
		}
	};
} )();
