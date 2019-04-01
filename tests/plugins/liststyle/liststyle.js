/* bender-tags: editor */
/* bender-ckeditor-plugins: list,liststyle */

( function() {

	'use strict';

	bender.editor = {};

	var unorderedListHtml = '<ul><li>foo</li><li>bar</li><li>buz</li>',
		orderedListHtml = '<ol><li>foo</li><li>bar</li><li>buz</li>';

	bender.test( {
		'test unordered list opens with correct context menu': function() {
			this.editorBot.setData( unorderedListHtml, function() {
				var editor = this.editor,
					list = editor.editable().findOne( 'ul' );

				editor.getSelection().selectElement( list );

				testContextMenuOptions( editor, [ 'bulletedListStyle' ] );
			} );
		},

		'test ordered list opens with correct context menu': function() {
			this.editorBot.setData( orderedListHtml, function() {
				var editor = this.editor,
					list = editor.editable().findOne( 'ol' );

				editor.getSelection().selectElement( list );

				testContextMenuOptions( editor, [ 'numberedListStyle' ] );
			} );
		}
	} );

	function testContextMenuOptions( editor, expected ) {
		editor.contextMenu.open( editor.editable() );

		var items = CKEDITOR.tools.array.map( editor.contextMenu.items, function( item ) {
			return item.command;
		} );

		editor.contextMenu.hide();

		arrayAssert.containsItems( expected, items );
	}

} )();
