/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* global createTestCase */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language: 'en'
		}
	};

	var browsers = [
			'chrome',
			'firefox',
			'ie8',
			'ie11',
			'safari'
		],
		wordVersions = [
			'word2007',
			'word2013'
		],
		// To test only particular word versions set the key value to an array in the form: [ 'word2007', 'word2013' ].
		tests = {
			'Unordered_list_multiple': true
		},
		keys = CKEDITOR.tools.objectKeys( tests ),
		testData = {
			_should: {
				ignore: {}
			}
		};

	for ( var i = 0; i < keys.length; i++ ) {
		for ( var j = 0; j < wordVersions.length; j++ ) {
			for ( var k = 0; k < browsers.length; k++ ) {
				if ( tests[ keys[ i ] ] === true || CKEDITOR.tools.indexOf( tests[ keys[ i ] ], wordVersions[ j ] ) !== -1 ) {
					testData[ [ 'test', keys[ i ], wordVersions[ j ], browsers[ k ] ].join( ' ' ) ] = createTestCase( keys[ i ], wordVersions[ j ], browsers[ k ], false, true );
				}
			}
		}
	}

	bender.test( testData );
} )();
