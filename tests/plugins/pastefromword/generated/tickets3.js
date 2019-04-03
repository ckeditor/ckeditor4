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

	pfwTools.defaultConfig.disallowedContent = ( pfwTools.defaultConfig.disallowedContent ? pfwTools.defaultConfig.disallowedContent + ';' : '' ) + 'code';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'ie8',
			'ie11'
		],
		wordVersions: [
			'word2013'
		],
		tests: {
			'Tickets/6594': [ 'word2013' ],
			'Tickets/6595': [ 'word2013' ],
			'Tickets/6608': [ 'word2013' ],
			'Tickets/6639nested_list_with_empty_lines': [ 'word2013' ],
			'Tickets/6658CKEditor_Word_tabs_between_list_items_Sample': [ 'word2013' ],
			'Tickets/6662bullets': [ 'word2013' ],
			'Tickets/6662': [ 'word2013' ],
			'Tickets/6751disappearing_spaces_example2': [ 'word2013' ],
			'Tickets/6751TextToPaste': [ 'word2013' ],
			'Tickets/6751': [ 'word2013' ],
			'Tickets/682tester': [ 'word2013' ],
			'Tickets/6956CKEditor_pasting_issue': [ 'word2013' ],
			'Tickets/6973CKEditor_pasting_issue': [ 'word2013' ],
			'Tickets/6973TestNegativeHeadingIndent': [ 'word2013' ],
			'Tickets/6973This_is_a_line_of_text.2': [ 'word2013' ],
			'Tickets/7131customNumbering': [ 'word2013' ],
			'Tickets/7131TC_7131_2': [ 'word2013' ],
			'Tickets/7131': [ 'word2013' ],
			'Tickets/7209test2': [ 'word2013' ],
			'Tickets/7262preformatted_list': [ 'word2013' ],
			'Tickets/7371BugReport_Example': [ 'word2013' ],
			'Tickets/7480BulletedList': [ 'word2013' ],
			'Tickets/7494Numbers_&_Bulltes_lists': [ 'word2013' ],
			'Tickets/7521simple_table': [ 'word2013' ],
			'Tickets/7581Numbering': [ 'word2013' ],
			'Tickets/7581fancyList': [ 'word2013' ],
			'Tickets/7584Numbered_list_with_diff_start_value': [ 'word2013' ],
			'Tickets/7593Numbere_&_Bullet_list_with_list_styles_applied': [ 'word2013' ],
			'Tickets/7610Multi_level_Numbered_list': [ 'word2013' ],
			'Tickets/7620AlphabeticNumberingLists': [ 'word2013' ]
		},
		testData: {
			_should: {
				ignore: {
					'test Tickets/7131 word2013 ie11': true, // Every alpha list item gets "a" numbering value (li[value=1]) while it shouldn't.'
					'test Tickets/7131customNumbering word2013 ie11': true, // li[value] issue present only in IE11.
					'test Tickets/7581Numbering word2013 ie11': true, // Again li[value], same as above.
					// Edge lists heuristics make slight difference in one list item.
					'test Tickets/6658CKEditor_Word_tabs_between_list_items_Sample word2013 ie11': CKEDITOR.env.edge
				}
			}
		},
		customFilters: [
			pfwTools.filters.span
		],
		ignoreAll: ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) || bender.tools.env.mobile
	} ) );
} )();
