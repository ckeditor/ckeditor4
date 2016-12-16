/* bender-tags: selection,styles */
/* bender-ckeditor-plugins: toolbar,basicstyles */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test applying and removing bold from empty selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>foo{}</p>' );

			editor.execCommand( 'bold' );
			assert.areSame( 'strong', editor.getSelection().getStartElement().getName(), 'start element after applying' );

			editor.execCommand( 'bold' );
			assert.areSame( 'p', editor.getSelection().getStartElement().getName(), 'start element after removing' );
		}
	} );
} )();