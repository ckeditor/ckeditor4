/* bender-tags: editor, feature, 4461 */
/* bender-ckeditor-plugins: floatingspace,toolbar,font */

/* bender-include: _helpers/tools.js */
/* global detachedTests */

( function() {
	'use strict';

	var tests = detachedTests.appendTests( 'inline', {
		'test CKEDITOR.inlineAll() doesnt call the shouldDelayEditorCreation() function when elements are detached': function() {
			var inlineSpy = sinon.spy( CKEDITOR.editor, 'shouldDelayEditorCreation' ),
				editableParent = CKEDITOR.document.getById( 'inlineEditableParent' );

			editableParent.remove();
			CKEDITOR.on( 'inline', bindToInline, null, null, 0 );
			CKEDITOR.inlineAll();

			assert.areEqual( 0, inlineSpy.callCount, 'There should be no CKEDITOR.editor.shouldDelayEditorCreation() calls.' );

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
