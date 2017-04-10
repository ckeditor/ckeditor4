/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js,_helpers/pfwTools.js */
/* global createTestCase,pfwTools */

( function() {
	'use strict';

	var config = pfwTools.defaultConfig;
	config.colorButton_normalizeBackground = true;

	bender.editor = {
		config: config
	};

	var browsers = [
			'datatransfer', // chrome, safari
			'firefox_datatransfer', // ff
			'ie8'
		],
		wordVersions = [
			'excel2013'
		],
		tests = {
			'Table_text_attributes/Cell_text': true,
			'Table_text_attributes/Mixed': true
		},
		keys = CKEDITOR.tools.objectKeys( tests ),
		testData = {
			_should: {
				ignore: {
					'test Table_text_attributes/Mixed excel2013 datatransfer': CKEDITOR.env.gecko || CKEDITOR.env.ie,
					'test Table_text_attributes/Mixed excel2013 firefox_datatransfer': !CKEDITOR.env.gecko,
					'test Table_text_attributes/Mixed excel2013 ie8': !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ),
					'test Table_text_attributes/Cell_text excel2013 datatransfer': CKEDITOR.env.ie && CKEDITOR.env.version == 8,
					'test Table_text_attributes/Cell_text excel2013 ie8': !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 )
				}
			}
		};

	for ( var i = 0; i < keys.length; i++ ) {
		for ( var j = 0; j < wordVersions.length; j++ ) {
			for ( var k = 0; k < browsers.length; k++ ) {
				if ( tests[ keys[ i ] ] === true || CKEDITOR.tools.indexOf( tests[ keys[ i ] ], wordVersions[ j ] ) !== -1 ) {
					testData[ [ 'test', keys[ i ], wordVersions[ j ], browsers[ k ] ].join( ' ' ) ] = createTestCase( keys[ i ], wordVersions[ j ], browsers[ k ], false, false, [ pfwTools.filters.style ] );
				}
			}
		}
	}

	bender.test( testData );
} )();
