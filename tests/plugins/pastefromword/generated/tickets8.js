/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global createTestSuite */

( function() {
	'use strict';

	var config = {
		language: 'en',
		removePlugins: 'dialogadvtab,flash,showborders,horizontalrule',
		colorButton_normalizeBackground: false,
		disallowedContent: 'td{vertical-align}; span; p{margin-*}',
		enterMode: CKEDITOR.ENTER_BR
	};

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome'
		],
		wordVersions: [
			'word2016'
		],
		tests: {
			'Tickets/423': true
		},

		compareRawData: false,
		ignoreAll: CKEDITOR.env.ie && CKEDITOR.env.version <= 11
	} ) );
} )();
