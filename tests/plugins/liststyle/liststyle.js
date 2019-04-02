/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: list,liststyle */

( function() {

	'use strict';

	bender.editor = {};

	var unorderedListHtml = '<ul><li>foo</li><li>bar</li><li>buz</li>',
		orderedListHtml = '<ol><li>foo</li><li>bar</li><li>buz</li>';

	bender.test( {

		tearDown: function() {
			var dialog = CKEDITOR.dialog.getCurrent();

			if ( dialog ) {
				dialog.hide();
			}
		},

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
		},

		// (#2423)
		'test unordered list dialog model': function() {
			this.editorBot.setData( unorderedListHtml, function() {
				var editor = this.editor,
					list = editor.editable().findOne( 'ul' );

				editor.getSelection().selectElement( list );

				this.editorBot.dialog( 'bulletedListStyle', function( dialog ) {
					assert.areEqual( list, dialog.getModel( editor ) );
				} );
			} );
		},

		// (#2423)
		'test ordered list dialog model': function() {
			this.editorBot.setData( orderedListHtml, function() {
				var editor = this.editor,
					list = editor.editable().findOne( 'ol' );

				editor.getSelection().selectElement( list );

				this.editorBot.dialog( 'numberedListStyle', function( dialog ) {
					assert.areEqual( list, dialog.getModel( editor ) );
				} );
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
