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
		isIE = CKEDITOR.env.ie && CKEDITOR.env.version <= 11;

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'edge' // v18
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
			Heading_alignment: true,
			Simple_table: true,
			Table_background: true,
			Paragraph_format: true,
			Page_break: true
		},
		ignoreAll: isSafari || isIE || bender.tools.env.mobile
	} ) );
} )();
