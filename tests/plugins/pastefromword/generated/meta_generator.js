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
	config.disallowedContent = 'td{border-color}'; // Firefox adds `border-color:windowtext currentcolor windowtext windowtext;`

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'datatransfer'
		],
		wordVersions: [
			'excel2016'
		],
		tests: {
			'Meta_generator/Excel': true
		},
		ignoreAll: CKEDITOR.env.ie || CKEDITOR.env.edge,
		customFilters: [ pfwTools.filters.style ]
	} ) );
} )();
