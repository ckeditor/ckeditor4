/* bender-tags: indent,indentblock */
/* bender-ckeditor-plugins: button,indent,indentblock,divarea */

'use strict';

bender.editor = {
	creator: 'replace',
	name: 'editor'
};

bender.test( {
	'test indenting and outdenting block in divarea plugin container inside li': function() {
		var editor = this.editor;
		editor.focus();
		bender.tools.selection.setWithHtml( editor, '<p>hello{}</p>' );

		assert.areSame( 2, editor.getCommand( 'indent' ).state, 'initial indent state' );
		assert.areSame( 0, editor.getCommand( 'outdent' ).state, 'initial outdent state' );

		editor.execCommand( 'indent' );

		assert.areSame( 2, editor.getCommand( 'indent' ).state, 'indent state after indenting' );
		assert.areSame( 2, editor.getCommand( 'outdent' ).state, 'outdent state after indenting' );

		editor.execCommand( 'outdent' );

		assert.areSame( 2, editor.getCommand( 'indent' ).state, 'indent state after outdenting' );
		assert.areSame( 0, editor.getCommand( 'outdent' ).state, 'outdent state after outdenting' );
	}
} );
