/* bender-tags: editor, feature, 4461 */
/* bender-ckeditor-plugins: floatingspace,toolbar,font */

/* bender-include: _helpers/tools.js */
/* global detachedTests */

( function() {
	'use strict';

	var tests = detachedTests.appendTests( 'inline', {
		'test CKEDITOR.inlineAll() doesnt call the _delayCreationOnDetachedElement() function when elements are detached': function() {
			var inlineSpy = sinon.spy( CKEDITOR.editor, '_delayCreationOnDetachedElement' ),
				editableParent = CKEDITOR.document.getById( 'inlineEditableParent' );

			editableParent.remove();
			CKEDITOR.on( 'inline', bindToInline, null, null, 0 );
			CKEDITOR.inlineAll();

			assert.areEqual( 0, inlineSpy.callCount, 'There should be no CKEDITOR.editor._delayCreationOnDetachedElement() calls.' );

			inlineSpy.restore();
			CKEDITOR.removeListener( 'inline' , bindToInline );
		}
	} );

	bender.test( tests );

	function bindToInline( evt ) {
		evt && evt.removeListener();

		evt.data.config = {
			delayIfDetached: true
		};
	}
}() );
