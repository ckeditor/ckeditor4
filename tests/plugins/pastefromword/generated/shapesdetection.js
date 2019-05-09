/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	var config = pfwTools.defaultConfig;

	config.disallowedContent = 'td{vertical-align};img[data-cke-saved-src];span{font-family};';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox'
		],
		wordVersions: [
			'word2013_win',
			'word2011_osx'
		],
		tests: {
			'Shapes/Single': true,
			'Shapes/Nested_groups': true,
			'Shapes/Adjacent_shapes': true,
			'Shapes/Shape_and_image': true,
			'Shapes/Canvas': true
		},

		ignoreAll: CKEDITOR.env.ie || bender.tools.env.mobile
	} ) );
} )();
