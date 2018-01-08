( function( window, bender ) {
	'use strict';

	var tools = CKEDITOR.tools,
		arrayTools = tools.array,
		MochaAdapter = window.MochaAdapter;

	// Test files are loaded by Karma in a format like (thanks to karma-ckeditor4-preprocessor plugin):
	//
	//		bender.testSuite( {
	// 			tags: 'test tags parsed from the test file',
	// 			tests: function() { test file original content }
	// 		} );
	//
	// Such format enables execution of additional code before running test file
	// and encapsulates test code to not pollute global scope.
	bender.testSuite = function( testSuite ) {

		// Translate bender tests format to mocha overriding bender.test function.
		// This function is defined here to have a proper scope with access to 'testSuite' objects.
		bender.test = function( benderTestObject ) {
			var testKeys = getTestNames( benderTestObject ),
				mochaTestSuite;

			if ( testKeys.length ) {
				mochaTestSuite = ( new MochaAdapter( benderTestObject, testKeys, testSuite.tags, getEditorsConfig() ) ).generateTestSuite();
				mochaTestSuite();
			}
		};

		// Fixtures should ba appended here as some test access them in the global scope, e.g. `/tests/core/dom/range/blockindication.js`.
		MochaAdapter.appendFixtures( testSuite.tags.test );

		// Run original test file. This will trigger bender.test function defined above.
		testSuite.tests();
	};

	// Return all test functions from bender test object.
	function getTestNames( tests ) {
		return arrayTools.filter( tools.objectKeys( tests ), function( key ) {
			return key.match( /^test/ );
		} );
	}

	// Get and clean bender.editor|bender.editors config to not affect other tests run after.
	function getEditorsConfig() {
		var editorsConfig = {};

		if ( bender.editor ) {
			editorsConfig.editor = bender.editor;
			delete bender.editor;
		}

		if ( bender.editors ) {
			editorsConfig.editors = bender.editors;
			delete bender.editors;
		}

		return editorsConfig;
	}

} )( this, bender );
