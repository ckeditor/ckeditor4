/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global createTestSuite,pfwTools */

( function() {
	'use strict';

	var config = pfwTools.defaultConfig;
	config.colorButton_normalizeBackground = true;

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'datatransfer', // chrome, safari
			'datatransfer_firefox', // ff
			'ie8'
		],
		wordVersions: [
			'excel2013',
			'excel2016'
		],
		tests: {
			'Table_text_attributes/Cell_text': true,
			'Table_text_attributes/Mixed': true
		},
		testData: {
			_should: {
				ignore: {
					'test Table_text_attributes/Mixed excel2013 datatransfer': CKEDITOR.env.gecko || CKEDITOR.env.ie,
					'test Table_text_attributes/Mixed excel2013 datatransfer_firefox': !CKEDITOR.env.gecko,
					'test Table_text_attributes/Mixed excel2016 datatransfer': CKEDITOR.env.gecko || CKEDITOR.env.ie,
					'test Table_text_attributes/Mixed excel2016 datatransfer_firefox': !CKEDITOR.env.gecko,

					'test Table_text_attributes/Mixed excel2013 ie8': !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ),
					'test Table_text_attributes/Cell_text excel2013 datatransfer': CKEDITOR.env.ie && CKEDITOR.env.version == 8,
					'test Table_text_attributes/Cell_text excel2013 ie8': !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 )
				}
			}
		},
		ignoreAll: CKEDITOR.env.edge,
		customFilters: [ pfwTools.filters.style ]
	} ) );
} )();
