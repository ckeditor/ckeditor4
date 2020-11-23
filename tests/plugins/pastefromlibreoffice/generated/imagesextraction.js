/* bender-tags: clipboard,pastefromlibreoffice */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromlibreoffice,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog */
/* jshint ignore:end */
/* bender-include: ../../pastefromword/generated/_helpers/promisePasteEvent.js,../../pastefromword/generated/_helpers/assertWordFilter.js */
/* bender-include: ../../pastefromword/generated/_helpers/createTestCase.js,../../pastefromword/generated/_helpers/createTestSuite.js */
/* bender-include: ./_helpers/config.js */
/* global pfloConfig,createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: CKEDITOR.tools.object.merge( pfloConfig, {
			colorButton_normalizeBackground: false,
			disallowedContent: 'span',
			extraPlugins: 'pagebreak'
		} )
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox'
		],
		wordVersions: [
			'libreoffice7'
		],
		tests: {
			'ImagesExtraction/InHeader': true,
			'ImagesExtraction/InHeaderFooter': true,
			'ImagesExtraction/InFooter': true,
			'ImagesExtraction/InHeaderFooterComplex': true,
			'ImagesExtraction/InHeaderFooterCurlyBraces': true,
			'ImagesExtraction/UnsupportedFormats': true,
			'ImagesExtraction/DuplicatedImage': true,
			'ImagesExtraction/DrawnObject': true,
			'ImagesExtraction/WrappedImages': true,
			'ImagesExtraction/AnimatedGif': true
		},
		ignoreAll: CKEDITOR.env.safari || CKEDITOR.env.ie || bender.tools.env.mobile,
		includeRTF: true,
		customFilters: [
			new CKEDITOR.htmlParser.filter( {
				elements: {
					img: function( element ) {
						if ( 'data-cke-saved-src' in element.attributes ) {
							delete element.attributes[ 'data-cke-saved-src' ];
						}
					}
				}
			} )
		]
	} ) );
} )();
