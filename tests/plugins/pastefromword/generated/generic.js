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

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie8',
			'ie11',
			'safari',
			'datatransfer'
		],
		wordVersions: [
			'word2007',
			'word2013'
		],
		tests: {
			'Bold': true,
			'Colors': true,
			'Custom_list_markers': true,
			'Fonts': true,
			'Image': true,
			'Italic': true,
			'Link': true,
			'Object': [ 'word2013' ],
			'Only_paragraphs': true,
			'Ordered_list': true,
			'Ordered_list_multiple': true,
			'Ordered_list_multiple_edgy': true,
			'Paragraphs_with_headers': true,
			'Simple_table': true,
			'Spacing': true,
			'Text_alignment': true,
			'Underline': true,
			'Unordered_list': true,
			'Unordered_list_special_char_bullet': true,
			'Table_alignment': true,
			'Table_vertical_alignment': true
		},
		testData: {
			_should: {
				ignore: {
					'test Object word2013 datatransfer': CKEDITOR.env.edge,
					'test Unordered_list_special_char_bullet word2013 chrome': CKEDITOR.env.edge,
					'test Unordered_list_special_char_bullet word2013 firefox': CKEDITOR.env.edge
				}
			}
		},
		customFilters: [
			pfwTools.filters.style,
			pfwTools.filters.span
		],
		ignoreAll: ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) || bender.tools.env.mobile
	} ) );
} )();
