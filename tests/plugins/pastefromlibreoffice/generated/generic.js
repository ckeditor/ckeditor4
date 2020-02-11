/* bender-tags: clipboard,pastefromlibreoffice */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromlibreoffice,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image,pagebreak */
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

	var isSafari = CKEDITOR.env.webkit && !CKEDITOR.env.chrome,
		isOldIE = CKEDITOR.env.ie && CKEDITOR.env.version < 11,
		isIE11 = CKEDITOR.env.ie && CKEDITOR.env.version === 11,
		// IE 11 does not support logical CSS properties.
		customFilters = isIE11 ? [
			new CKEDITOR.htmlParser.filter( {
				attributes: {
					style: function( attribute ) {
						if ( attribute.indexOf( 'text-align:start' ) !== -1 ) {
							return false;
						}
					}
				}
			} )
		] : [];

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'edge', // v18
			'ie11',
			'safari'
		],
		wordVersions: [
			'libreoffice6'
		],
		tests: {
			Simple_text: true,
			Link: true,
			Basic_styles: true,
			Font_color: true,
			Font: true,
			Lists: true,
			Mixed_list: true,
			Text_align: true,
			Table_background: true,
			Paragraph_format: true,
			Page_break: true
		},
		testData: {
			_should: {
				// IE 11 generates borders differently than everyone else.
				ignore: {
					'test Table_background libreoffice6 chrome': isIE11,
					'test Table_background libreoffice6 edge': isIE11,
					'test Table_background libreoffice6 firefox': isIE11,
					'test Table_background libreoffice6 safari': isIE11
				}
			}
		},
		ignoreAll: isSafari || isOldIE || bender.tools.env.mobile,
		customFilters: customFilters
	} ) );
} )();
