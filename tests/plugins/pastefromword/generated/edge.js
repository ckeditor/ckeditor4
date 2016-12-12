/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js,_helpers/pfwTools.js */
/* global createTestCase,pfwTools */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	var browsers = [
			'edge'
		],
		wordVersions = [
			'word2013'
		],
		tests = {
			'Ordered_list': true,
			'Ordered_list_multiple': true,
			//'Ordered_list_multiple_edgy': true,
			'Unordered_list': true,
			'Unordered_list_multiple': true
		},
		keys = CKEDITOR.tools.objectKeys( tests ),
		testData = {
			_should: {
				ignore: {}
			}
		},
		isEdge = CKEDITOR.env.edge;

	for ( var i = 0; i < keys.length; i++ ) {
		for ( var j = 0; j < wordVersions.length; j++ ) {
			for ( var k = 0; k < browsers.length; k++ ) {
				if ( tests[ keys[ i ] ] === true || CKEDITOR.tools.indexOf( tests[ keys[ i ] ], wordVersions[ j ] ) !== -1 ) {
					var testName = [ 'test', keys[ i ], wordVersions[ j ], browsers[ k ] ].join( ' ' );

					if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) {
						testData._should.ignore[ testName ] = true;
					}

					testData[ testName ] = createTestCase( keys[ i ], wordVersions[ j ], browsers[ k ], false, false );
				}
			}
		}
	}
	testData.setUp = function() {
		CKEDITOR.env.edge = true;
	};

	testData.tearDown = function() {
		CKEDITOR.env.edge = isEdge;
	};

	bender.test( testData );
} )();
