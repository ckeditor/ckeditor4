/* bender-tags: clipboard,pastefromword */
/* jshint ignore:start */
/* bender-ckeditor-plugins: pastefromword,ajax, */
/* jshint ignore:end */
/* bender-include: _lib/q.js,_helpers/promisePasteEvent.js,_helpers/assertWordFilter.js,_helpers/createTestCase.js */
/* bender-include: _helpers/createTestSuite.js,_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: CKEDITOR.tools.extend( pfwTools.imageDefaultConfig, {
			extraPlugins: 'pagebreak'
		} )
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox'
		],
		wordVersions: [
			'word365'
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

		ignoreAll: CKEDITOR.env.ie || bender.tools.env.mobile,
		compareRawData: true,
		includeRTF: true,
		customFilters: [
			pfwTools.filters.style
		]
	} ) );
} )();
