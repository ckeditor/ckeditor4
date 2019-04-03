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

	var config = CKEDITOR.tools.clone( pfwTools.defaultConfig );

	config.disallowedContent = config.disallowedContent.replace( 'span{text-indent}', 'span' );

	bender.editor = {
		config: config
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie11',
			'edge',
			'ie8'
		],
		wordVersions: [
			'Word2013',
			'Word2016'
		],
		tests: {
			'Ordered_list_symbol_in_text': true
		},
		ignoreAll: bender.tools.env.mobile
	} ) );
} )();
