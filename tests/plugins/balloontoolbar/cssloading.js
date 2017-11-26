/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: balloontoolbar */

( function() {
	'use strict';

	bender.editor = {};

	CKEDITOR.skinName = 'kama,/apps/ckeditor/skins/kama/';

	var spy = sinon.spy( CKEDITOR.dom.document.prototype, 'appendStyleSheet' );

	bender.test( {
		'test loading CSS with path': function() {
			assert.areSame( 'kama,/apps/ckeditor/skins/kama/', CKEDITOR.skinName, 'Config skinName should be with path' );
			sinon.assert.calledWith( spy, document.location.origin + '/apps/ckeditor/plugins/balloontoolbar/skins/kama/inlinetoolbar.css' );
		}
	} );
} )();
