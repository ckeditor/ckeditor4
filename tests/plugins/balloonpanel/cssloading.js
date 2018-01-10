/* bender-tags: balloonpanel, bug, 4.8.0, 1221 */
/* bender-ckeditor-plugins: balloonpanel */
/* bender-include: _helpers/tools.js */
/* global balloonTestsTools */

( function() {
	'use strict';

	bender.editor = {};

	CKEDITOR.skinName = 'kama,/apps/ckeditor/skins/kama/';
	var spy = sinon.spy( CKEDITOR.dom.document.prototype, 'appendStyleSheet' );

	bender.test( {
		_should: {
			ignore: {
				// Our release version is built with moono-lisa skin inlined, thus we can't
				// test it against other skin. We don't have straight way to recognise editor's
				// built version, such trick must be used (#1251).
				'test loading css with path': CKEDITOR.revision !== '%REV%'
			}
		},

		'test loading css with path': function() {
			assert.areSame( 'kama,/apps/ckeditor/skins/kama/', CKEDITOR.skinName, 'config skinName should be with path' );
			sinon.assert.calledWith( spy, balloonTestsTools.getDocumentOrigin() + '/apps/ckeditor/plugins/balloonpanel/skins/kama/balloonpanel.css' );
		}
	} );


} )();
