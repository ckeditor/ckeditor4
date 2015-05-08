/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: button,indent,indentblock,divarea */

( function() {
	'use strict';

	bender.test( {
		'test indenting and outdenting block in divarea plugin container inside li': function() {
			bender.editorBot.create( {
				creator: 'replace',
				name: 'editor'
			}, function( bot ) {
				var editor = bot.editor;

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
			} );
		}
	} );
} )();
