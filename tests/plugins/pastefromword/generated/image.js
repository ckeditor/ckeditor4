/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,ajax,indentblock,image,table */
/* bender-include: ././_helpers/promisePasteEvent.js,./_helpers/assertWordFilter.js,./_helpers/createTestCase.js */
/* bender-include: ./_helpers/createTestSuite.js,./_helpers/pfwTools.js */
/* global pfwTools,createTestSuite */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.imageDefaultConfig
	};

	bender.test( createTestSuite( {
		browsers: [
			'chrome',
			'firefox'
		],
		wordVersions: [
			'word2013_win',
			'word2016_win',
			'word2011_osx'
		],
		tests: {
			'PFW_image/Simple_offline_image': true,
			'PFW_image/Online_and_offline_image': true,
			'PFW_image/Shapes_and_online_and_offline_image': true,
			'PFW_image/Wrapped_image': true,
			'PFW_image/Link_image': true,
			'PFW_image/Gruped_adjacent_shapes_and_images': true,
			'PFW_image/Image_alternative_text': true,
			'PFW_image/Image_reflection': true,
			'PFW_image/Image_rotation': true
		},
		ignoreAll: CKEDITOR.env.ie || bender.tools.env.mobile,
		includeRTF: true
	} ) );
} )();
