/* bender-tags: clipboard,pastefromword */
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

	// Removing `indent` plugin, because of (#1330).
	config.removePlugins = 'indent';
	config.extraAllowedContent = 'p{margin,margin-top,margin-right,margin-bottom,margin-left};span{margin,margin-top,margin-right,margin-bottom,margin-left}';
	config.disallowedContent = 'span{font-family}';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'edge'
		],
		wordVersions: [
			'Word2013',
			'Word2016'
		],
		tests: {
			'Paragraph_indentation': true
		},

		ignoreAll: CKEDITOR.env.ie || bender.tools.env.mobile
	} ) );
} )();
