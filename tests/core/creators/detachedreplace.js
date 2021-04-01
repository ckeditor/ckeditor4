/* bender-tags: editor, feature, 4461 */
/* bender-ckeditor-plugins: wysiwygarea */

/* bender-include: _helpers/tools.js */
/* global detachedTests */

( function() {
	'use strict';

	var tests = detachedTests.appendTests( 'replace', {
		'test CKEDITOR.replaceAll() doesnt call the _delayCreationOnDetachedElement() function when elements are detached': function() {
			var textareas = document.getElementsByTagName( 'textarea' ),
				replaceSpy = sinon.spy( CKEDITOR.editor, '_delayCreationOnDetachedElement' );

			CKEDITOR.tools.array.forEach( textareas, function( textareaElement ) {
				textareaElement.remove();
			} );

			CKEDITOR.replaceAll();

			assert.areEqual( 0, replaceSpy.callCount, 'There should be no CKEDITOR.replace calls.' );

			replaceSpy.restore();
		}
	} );

	bender.test( tests );
}() );
