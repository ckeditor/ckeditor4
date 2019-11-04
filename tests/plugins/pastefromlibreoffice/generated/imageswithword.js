/* bender-tags: clipboard,pastefromlibreoffice */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromlibreoffice,pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: ../../pastefromword/generated/_helpers/promisePasteEvent.js,../../pastefromword/generated/_helpers/assertWordFilter.js */
/* bender-include: ../../pastefromword/generated/_helpers/createTestCase.js,../../pastefromword/generated/_helpers/createTestSuite.js */
/* bender-include: ./_helpers/config.js */
/* global pfloConfig,createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: pfloConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'edge' // v18
		],
		wordVersions: [
			'libreoffice6'
		],
		tests: {
			'Images/Simple_image': true,
			'Images/Multi_feature_document': true
		},
		ignoreAll: ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) || bender.tools.env.mobile,
		includeRTF: true
	} ) );
} )();
