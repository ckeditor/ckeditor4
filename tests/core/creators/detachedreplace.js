/* bender-tags: editor, feature, 4461 */
/* bender-ckeditor-plugins: wysiwygarea */

/* bender-include: _helpers/tools.js */
/* global detachedTests */

( function() {
	'use strict';

	var tests = detachedTests.appendTests( 'replace',
	{
		'test CKEDITOR replaceAll dont create editor instances because cant find detached textareas': function() {
			var textareas = document.getElementsByTagName( 'textarea' ),
				replaceSpy = sinon.spy( CKEDITOR, 'replace' );

			CKEDITOR.tools.array.forEach( textareas, function( textareaElem ) {
				textareaElem.remove();
			} );

			CKEDITOR.replaceAll();

			assert.areEqual( 0, replaceSpy.callCount, 'There should be no CKEDITOR.replace calls.' );

			replaceSpy.restore();
		}

	} );

	bender.test( tests );

}() );
