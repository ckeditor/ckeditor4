/* bender-tags: balloonpanel, bug, 4.8, 1221 */
/* bender-ckeditor-plugins: balloonpanel */

( function() {
	'use strict';

	bender.editor = {
	};
	CKEDITOR.skinName = 'kama,/apps/ckeditor/skins/kama/';
	var spy = sinon.spy( CKEDITOR.dom.document.prototype, 'appendStyleSheet' );
	bender.test( {
		'test loading css with path': function() {
			assert.areSame( 'kama,/apps/ckeditor/skins/kama/', CKEDITOR.skinName, 'config skinName should be with path' );
			sinon.assert.calledWith( spy, document.location.origin + '/apps/ckeditor/plugins/balloonpanel/skins/kama/balloonpanel.css' );
		}
	} );
} )();