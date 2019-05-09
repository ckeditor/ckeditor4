/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global createTestSuite,pfwTools */

( function() {
	'use strict';

	var config = pfwTools.defaultConfig;
	config.colorButton_normalizeBackground = true;
	// Firefox adds `border-color:windowtext currentcolor windowtext windowtext;`
	// for `td` elements with `colspan` attribute.
	config.disallowedContent = 'td{border-color}';

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'datatransfer', // chrome, safari, ff
			'ie8',
			'ie11'
		],
		wordVersions: [
			'excel2013',
			'excel2016'
		],
		tests: {
			'Table_text_attributes/Cell_text': true,
			'Table_text_attributes/Mixed': true,
			'Meta_generator/Excel': [ 'excel2016' ]
		},
		testData: {
			_should: {
				ignore: {
					// Ignore two IE8 tests, until #831 is not resolved.
					'test Table_text_attributes/Mixed excel2013 ie8': true,
					'test Table_text_attributes/Cell_text excel2013 ie8': true,
					'test Table_text_attributes/Mixed excel2016 ie11': !( CKEDITOR.env.ie && CKEDITOR.env.version == 11 ),
					'test Table_text_attributes/Cell_text excel2016 ie11': !( CKEDITOR.env.ie && CKEDITOR.env.version == 11 ),

					'test Table_text_attributes/Mixed excel2013 datatransfer': CKEDITOR.env.ie,
					'test Table_text_attributes/Cell_text excel2013 datatransfer': CKEDITOR.env.ie,
					'test Table_text_attributes/Mixed excel2016 datatransfer': CKEDITOR.env.ie,
					'test Table_text_attributes/Cell_text excel2016 datatransfer': CKEDITOR.env.ie,

					'test Meta_generator/Excel excel2016 ie8': CKEDITOR.env.ie,
					'test Meta_generator/Excel excel2016 ie11': CKEDITOR.env.ie,
					'test Meta_generator/Excel excel2016 datatransfer': CKEDITOR.env.ie
				}
			}
		},
		ignoreAll: CKEDITOR.env.edge || bender.tools.env.mobile,
		customFilters: [ pfwTools.filters.style ]
	} ) );
} )();
