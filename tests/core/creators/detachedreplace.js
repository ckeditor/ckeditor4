/* bender-tags: editor, feature, 4461 */
/* bender-ckeditor-plugins: wysiwygarea */

/* bender-include: _helpers/tools.js */
/* global detachedTests */

( function() {
	'use strict';

	var tests = detachedTests.appendTests( 'replace', {
		'test CKEDITOR.replaceAll() does not call the shouldDelayEditorCreation() function when elements are detached': function() {
			var textarea = CKEDITOR.document.getById( 'ta1' ),
				replaceSpy = sinon.spy( CKEDITOR.editor, 'shouldDelayEditorCreation' );

			textarea.remove();
			CKEDITOR.replaceAll();

			assert.areEqual( 0, replaceSpy.callCount, 'There should be no CKEDITOR.replace calls.' );

			replaceSpy.restore();
		}
	} );

	bender.test( tests );
}() );
