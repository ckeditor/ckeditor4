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
			'chrome',
			'firefox',
			'safari'
		],
		wordVersions = [
			'word2007',
			'word2013'
		],
		tests = {
			'InlineStyles': true
		},
		keys = CKEDITOR.tools.objectKeys( tests ),
		testData = {
			_should: {
				ignore: {
					'InlineStyles': true
				}
			}
		};

	for ( var i = 0; i < keys.length; i++ ) {
		for ( var j = 0; j < wordVersions.length; j++ ) {
			for ( var k = 0; k < browsers.length; k++ ) {
				if ( tests[ keys[ i ] ] === true || CKEDITOR.tools.indexOf( tests[ keys[ i ] ], wordVersions[ j ] ) !== -1 ) {
					var testName = [ 'test', keys[ i ], wordVersions[ j ], browsers[ k ] ].join( ' ' );

					if ( CKEDITOR.env.ie ) {
						testData._should.ignore[ testName ] = true;
					}

					testData[ testName ] = createTestCase( keys[ i ], wordVersions[ j ], browsers[ k ], false, false, [ pfwTools.filters.style ] );
				}
			}
		}
	}

	bender.test( testData );
} )();
