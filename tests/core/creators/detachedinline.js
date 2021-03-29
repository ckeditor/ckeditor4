/* bender-tags: editor, feature, 4461 */
/* bender-ckeditor-plugins: wysiwygarea */

/* bender-include: _helpers/tools.js */
/* global detachedTests */

( function() {
	'use strict';

	var tests = detachedTests.appendTests( 'inline',
	{
		'test CKEDITOR inlineAll dont create editor instances because cant find detached elements': function() {
			var inlineSpy = sinon.spy( CKEDITOR, 'inline' );

			CKEDITOR.document.getById( 'inlineEditable' ).remove();
			CKEDITOR.inlineAll();

			assert.areEqual( 0, inlineSpy.callCount, 'There should be not CKEDITOR.inline calls.' );

			inlineSpy.restore();
		}

	} );

	bender.test( tests );

}() );
