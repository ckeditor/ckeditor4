/* bender-tags: balloonpanel, bug, 4.8.0, 1221 */
/* bender-ckeditor-plugins: balloonpanel */
/* bender-include: _helpers/tools.js */
/* global balloonTestsTools */

( function() {
	'use strict';

	bender.editor = {};

	CKEDITOR.skinName = 'kama,%BASE_PATH%../../apps/ckeditor/skins/kama/';
	var spy = sinon.spy( CKEDITOR.dom.document.prototype, 'appendStyleSheet' );

	bender.test( {
		_should: {
			ignore: {
				// Our release version is built with moono-lisa skin inlined, thus we can't
				// test it against other skin. We don't have straight way to recognise editor's
				// built version, such trick must be used (#1251).
				'test loading css with path': bender.tools.env.isBuild
			}
		},

		'test loading css with path': function() {
			assert.areSame( 'kama,%BASE_PATH%../../apps/ckeditor/skins/kama/', CKEDITOR.skinName, 'config skinName should be with path' );
			// (#2796)
			// 'removeDots' is necessary to properly compare URL. We cannot use absolute url, as test might have additional folders in URL.
			// Tests run in bender:
			// 	* from dashboard have address like: http://tests.ckeditor.test/tests/plugins/balloonpanel/cssloading
			// 	* from jobs on Travis have address like: http://tests.ckeditor.test/jobs/VY5lgovj70g1AOkv/tests/tests/plugins/balloonpanel/cssloading
			// This is why there have to be relative URL. However 'appendStyleSheet' receive final URL which does not contain dots in address.
			// It's necessary to adapt URL address to be properly compared in assertion.
			sinon.assert.calledWith( spy, balloonTestsTools.getDocumentOrigin() +
				balloonTestsTools.removeDotsFromUrl( '%BASE_PATH%../../apps/ckeditor/plugins/balloonpanel/skins/kama/balloonpanel.css' ) );
		}
	} );


} )();
