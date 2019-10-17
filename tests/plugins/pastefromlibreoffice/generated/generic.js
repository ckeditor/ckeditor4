/* bender-tags: clipboard,pastefromlibreoffice */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromlibreoffice,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: ../../pastefromword/generated/_helpers/promisePasteEvent.js,../../pastefromword/generated/_helpers/assertWordFilter.js */
/* bender-include: ../../pastefromword/generated/_helpers/createTestCase.js,../../pastefromword/generated/_helpers/createTestSuite.js */
/* bender-include: ../../pastefromword/generated/_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie11',
			'safari'
		],
		wordVersions: [
			'libreoffice6'
		],
		tests: {
			Simple_text: true,
			Link: true,
			Basic_styles: true
		},
		ignoreAll: ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) || bender.tools.env.mobile
	} ) );
} )();
