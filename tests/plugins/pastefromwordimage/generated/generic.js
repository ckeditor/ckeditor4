/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image,pastefromwordimage */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: ../../pastefromword/generated/_lib/q.js,../../pastefromword/generated/_helpers/promisePasteEvent.js */
/* bender-include: ../../pastefromword/generated/_helpers/assertWordFilter.js,../../pastefromword/generated/_helpers/createTestCase.js */
/* bender-include: ../../pastefromword/generated/_helpers/createTestSuite.js,../../pastefromword/generated/_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.imageDefaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox'
		],
		wordVersions: [
			'word2013',
			'word2016',
			'macos'
		],
		tests: {
			'SimpleOfflineImage': true,
			'OnlineAndOfflineImage': true,
			'ShapesAndOnlineAndOfflineImage': true,
			'WrappedImage': true
		},
		ignoreAll: CKEDITOR.env.ie,
		includeRTF: true
	} ) );
} )();
