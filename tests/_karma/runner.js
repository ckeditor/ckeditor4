( function( window, bender ) {
	'use strict';

	var tools = CKEDITOR.tools,
		arrayTools = tools.array,
		MochaAdapter = window.MochaAdapter;

	// Translate bender tests format to mocha.
	bender.test = function( tests ) {
		var testKeys = arrayTools.filter( tools.objectKeys( tests ), function( key ) {
				return key.match( /^test/ );
			} );

		if ( testKeys.length ) {
			var mochaTestSuite = ( new MochaAdapter( tests, testKeys, window.test_tags ) ).generateTestSuite();
			mochaTestSuite();
		}
	};
} )( this, bender );
