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

	bender.editor = {
		config: {
			language: 'en',
			pasteFromWordRemoveFontStyles: true
		}
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie8',
			'ie11',
			'safari'
		],
		wordVersions: [
			'word2007',
			'word2013'
		],
		tests: {
			'Config_remove_font_styles': true
		},
		compareRawData: true
	} ) );
} )();
