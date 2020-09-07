/* bender-tags: clipboard,pastefromword, 2870 */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,div,dialog */
/* jshint ignore:end */
/* bender-include: _helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	var config = pfwTools.defaultConfig;

	config.extraAllowedContent = 'li{margin-left};';
	config.disallowedContent = 'span';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome', // Chrome fixtures are identical to Firefox.
			'edge',
			'safari'
		],
		wordVersions: [
			'word2016',
			'word2013'
		],
		tests: {
			'List_indentation': true
		},

		ignoreAll: CKEDITOR.env.ie || bender.tools.env.mobile
	} ) );
} )();
