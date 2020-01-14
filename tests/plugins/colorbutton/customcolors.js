/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,colordialog,undo,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = true;

	function openColorDialog( button ) {
		button._.panel.getBlock( button._.id ).element.findOne( '.cke_colormore' ).$.click();
		wait();
	}

	function chooseColorFromDialog( editor, button, color ) {
		button.click( editor );

		editor.once( 'dialogShow', function( evt ) {
			var dialog = evt.data;
			dialog.setValueOf( 'picker', 'selectedColor', color );
			dialog.getButton( 'ok' ).click();

			resume();
		} );

		openColorDialog( button );
	}

	bender.test( {
		'test custom colors row exists': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '[<p>Moo</p>]' );

			txtColorBtn.click( editor );
			assert.isNotNull( txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ), 'Custom colors row should exist.' );

			bgColorBtn.click( editor );
			assert.isNotNull( bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ), 'Custom colors row should exist.' );
		},

		'test label is hidden and row is empty before any color was chosen': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '[<p>Moo</p>]' );

			txtColorBtn.click( editor );
			assert.isFalse( txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_label' ).isVisible(), 'Label shouldn\'t be visible.' );
			assert.areEqual( 0, txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ).getChildCount(), 'Row should be empty.' );

			bgColorBtn.click( editor );
			assert.isFalse( bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcustom_label' ).isVisible(), 'Label shouldn\'t be visible.' );
			assert.areEqual( 0, bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ).getChildCount(), 'Row should be empty.' );
		},

		'test label is visible and row is not empty after choosing custom text color': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			this.editorBot.setHtmlWithSelection( '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span>]</p>' );

			editor.once( 'dialogHide', function() {
				txtColorBtn.click( editor );

				assert.isTrue( txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_label' ).isVisible(), 'Label should be visible.' );
				assert.areNotEqual( 0, txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ).getChildCount(), 'Row shouldn\'t be empty.' );
			} );

			chooseColorFromDialog( editor, txtColorBtn, '#33ff33' );
		},

		'test label is visible and row is not empty after choosing custom background color': function() {
			var editor = this.editor,
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span>]</p>' );

			editor.once( 'dialogHide', function() {
				bgColorBtn.click( editor );

				assert.isTrue( bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcustom_label' ).isVisible(), 'Label should be visible.' );
				assert.areNotEqual( 0, bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ).getChildCount(), 'Row shouldn\'t be empty.' );
			} );

			chooseColorFromDialog( editor, bgColorBtn, '#33ff33' );
		},

		'test custom color tiles don\'t disappear when they are no longer present in the document': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );
			editor.once( 'dialogHide', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>[Moo]</p>' );
				txtColorBtn.click();

				assert.isTrue( txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_label' ).isVisible(), 'Label should be visible.' );
				assert.areNotEqual( 0, txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ).getChildCount(), 'Row shouldn\'t be empty.' );
			} );

			chooseColorFromDialog( editor, txtColorBtn, '#33ff33' );
		},

		'test custom color tiles work': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			this.editorBot.setHtmlWithSelection( '<p>[Moo]</p>' );

			editor.once( 'dialogHide', function() {
				bender.tools.setHtmlWithSelection( editor, '<p>[Moo]</p>' );

				txtColorBtn.click( editor );
				txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row .cke_colorbox' ).$.click();

				assert.areEqual( '<p><span style="color:#33ff33">Moo</span></p>', editor.getData() );
			} );

			chooseColorFromDialog( editor, txtColorBtn, '#33ff33' );
		}

	} );
} )();
