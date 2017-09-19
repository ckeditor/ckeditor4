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

			var editorsConfig = {};

			if ( bender.editor ) {
				editorsConfig.editor = bender.editor;
				delete bender.editor;
			}
			if ( bender.editors ) {
				editorsConfig.editors = bender.editors;
				delete bender.editors;
			}

			var mochaTestSuite = ( new MochaAdapter( tests, testKeys, window.test_tags, editorsConfig ) ).generateTestSuite();
			mochaTestSuite();
		}
	};
} )( this, bender );
