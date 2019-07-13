/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromgdocs,ajax,basicstyles,bidi,font,link,toolbar,colorbutton,image */
/* bender-ckeditor-plugins: list,liststyle,sourcearea,format,justify,table,tableresize,tabletools,indent,indentblock,div,dialog,pagebreak*/
/* jshint ignore:end */
/* bender-include: ../../pastefromword/generated/_helpers/promisePasteEvent.js,../../pastefromword/generated/_helpers/assertWordFilter.js,../../pastefromword/generated/_helpers/createTestCase.js */
/* bender-include: ../../pastefromword/generated/_helpers/createTestSuite.js,../../pastefromword/generated/_helpers/pfwTools.js */
/* global createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language: 'en',
			plugins: [
				'wysiwygarea',
				'toolbar',
				'pastefromgdocs',
				'sourcearea',
				'elementspath',
				'font',
				'format',
				'stylescombo',
				'justify',
				'colorbutton',
				'image',
				'link',
				'list',
				'tabletools'
			],
			disallowedContent: '*[data-cke-*];'
		}
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox',
			'safari',
			'ie11',
			'edge'
		],
		wordVersions: [
			'gdocs'
		],
		tests: {
			'Basic': true
		},

		ignoreAll: CKEDITOR.env.ie && CKEDITOR.env.version < 11,
		testData: {
			_should: {
				ignore: {
					'test Basic gdocs chrome': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test Basic gdocs firefox': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test Basic gdocs safari': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test Basic gdocs edge': CKEDITOR.env.ie && CKEDITOR.env.version <= 11,
					'test Basic gdocs ie11': !CKEDITOR.env.ie || CKEDITOR.env.version > 11
				}
			}
		}
	} ) );
} )();
