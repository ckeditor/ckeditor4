/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_lib/q.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js,_helpers/pfwTools.js */
/* global createTestCase,pfwTools */

( function() {
	'use strict';

	pfwTools.defaultConfig.disallowedContent = 'code';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	var browsers = [
			'chrome',
			'firefox',
			'ie8',
			'ie11'
		],
		wordVersion = 'word2013',
		ticketTests = {
			'6594': [ 'word2013' ],
			'6595': [ 'word2013' ],
			'6608': [ 'word2013' ],
			'6639nested_list_with_empty_lines': [ 'word2013' ],
			'6658CKEditor_Word_tabs_between_list_items_Sample': [ 'word2013' ],
			'6662bullets': [ 'word2013' ],
			'6662': [ 'word2013' ],
			'6751disappearing_spaces_example2': [ 'word2013' ],
			'6751TextToPaste': [ 'word2013' ],
			'6751': [ 'word2013' ],
			'682tester': [ 'word2013' ],
			'6956CKEditor_pasting_issue': [ 'word2013' ],
			'6973CKEditor_pasting_issue': [ 'word2013' ],
			'6973TestNegativeHeadingIndent': [ 'word2013' ],
			'6973This_is_a_line_of_text.2': [ 'word2013' ],
			'7131customNumbering': [ 'word2013' ],
			'7131TC_7131_2': [ 'word2013' ],
			'7131': [ 'word2013' ],
			'7209test2': [ 'word2013' ],
			'7262preformatted_list': [ 'word2013' ],
			'7371BugReport_Example': [ 'word2013' ],
			'7480BulletedList': [ 'word2013' ],
			'7494Numbers_&_Bulltes_lists': [ 'word2013' ],
			'7521simple_table': [ 'word2013' ],
			'7581Numbering': [ 'word2013' ],
			'7581fancyList': [ 'word2013' ],
			'7584Numbered_list_with_diff_start_value': [ 'word2013' ],
			'7593Numbere_&_Bullet_list_with_list_styles_applied': [ 'word2013' ],
			'7610Multi_level_Numbered_list': [ 'word2013' ],
			'7620AlphabeticNumberingLists': [ 'word2013' ]
		},
		testData = {
			_should: {
				ignore: {
					'test 7131 word2013 ie11': true, // Every alpha list item gets "a" numbering value (li[value=1]) while it shouldn't.'
					'test 7131customNumbering word2013 ie11': true, // li[value] issue present only in IE11.
					'test 7581Numbering word2013 ie11': true // Again li[value], same as above.
				}
			}
		},
		ticketKeys = CKEDITOR.tools.objectKeys( ticketTests ),
		i, k;

	for ( i = 0; i < ticketKeys.length; i++ ) {
		for ( k = 0; k < browsers.length; k++ ) {
			if ( ticketTests[ ticketKeys[ i ] ] === true || CKEDITOR.tools.indexOf( ticketTests[ ticketKeys[ i ] ], wordVersion ) !== -1 ) {
				var testName = [ 'test', ticketKeys[ i ], wordVersion, browsers[ k ] ].join( ' ' );

				if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 11 ) {
					testData._should.ignore[ testName ] = true;
				}

				testData[ testName ] = createTestCase( ticketKeys[ i ], wordVersion, browsers[ k ], true );
			}
		}
	}

	bender.test( testData );
} )();
