/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,undo,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test content colors row exists and custom colors row doesn\'t': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '[<p>Moo</p>]' );

			txtColorBtn.click( editor );
			assert.isNotNull( txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ), 'Content colors row should exist.' );
			assert.isNull( txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ), 'Custom colors row shouldn\'t exist.' );

			bgColorBtn.click( editor );
			assert.isNotNull( bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcontent_row', 'Content colors row should exist.' ) );
			assert.isNull( bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ), 'Custom colors row shouldn\'t exist.' );
		},

		'test label is hidden and row is empty when there are no colors in content': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '[<p>Moo</p>]' );

			txtColorBtn.click( editor );
			assert.isFalse( txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_label' ).isVisible(), 'Label shouldn\'t be visible.' );
			assert.areEqual( 0, txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ).getChildCount(), 'Row should be empty.' );

			bgColorBtn.click( editor );
			assert.isFalse( bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcontent_label' ).isVisible(), 'Label shouldn\'t be visible.' );
			assert.areEqual( 0, bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ).getChildCount(), 'Row should be empty.' );
		},

		'test label is visible and row is not empty when there is a color in content': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span>]</p>' );

			txtColorBtn.click( editor );
			assert.isTrue( txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_label' ).isVisible(), 'Label should be visible.' );
			assert.areNotEqual( 0, txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ).getChildCount(), 'Row shouldn\'t be empty.' );

			bgColorBtn.click( editor );
			assert.isTrue( bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcontent_label' ).isVisible(), 'Label should be visible.' );
			assert.areNotEqual( 0, bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ).getChildCount(), 'Row shouldn\'t be empty.' );
		},

		'test content color tiles work': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '<p>[<span style="color:#ff3333; background-color:#3333ff">Moo</span> and not moo]</p>' );

			txtColorBtn.click( editor );
			txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row .cke_colorbox' ).$.click();

			assert.areEqual( '<p><span style="color:#ff3333"><span style="background-color:#3333ff">Moo</span> and not moo</span></p>', editor.getData(), 'Text color didn\'t change.' );

			bgColorBtn.click( editor );
			bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcontent_row .cke_colorbox' ).$.click();

			assert.areEqual( '<p><span style="color:#ff3333"><span style="background-color:#3333ff">Moo and not moo</span></span></p>', editor.getData(), 'Background color didn\'t change.' );
		},

		'test new tiles are added when new color appears': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			this.editorBot.setHtmlWithSelection( '<p><span style="color:#ff3333; background-color:#3333ff">Moo</span>[ and not moo]</p>' );

			txtColorBtn.click( editor );
			txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '[data-value="1ABC9C"]' ).$.click();

			bgColorBtn.click( editor );
			bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '[data-value="D35400"]' ).$.click();

			// Colors are added on panel open, so refresh them.
			txtColorBtn.click( editor );
			bgColorBtn.click( editor );

			assert.areEqual( 2, txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ).getChildCount(), 'New text color tile didn\'t appear.' );
			assert.areEqual( 2, bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ).getChildCount(), 'New background color tile didn\'t appear.' );
		},

		'test colors are displayed in the correct order': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				firstTile,
				yellowTile;

			this.editorBot.setHtmlWithSelection( '<p><span style="color:#e74c3c">I&#39;m</span> an <span style="color:#3498db">instance</span> of <span style="color:#2ecc71">CKEditor</span>.</p>' );

			// 1. Test appearence order (equal number of occurrences).
			txtColorBtn.click( editor );
			assert.areEqual( 3, txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ).getChildCount(), 'Number of color tiles is incorrect.' );

			firstTile = txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row .cke_colorbox' );

			assert.areEqual( 'E74C3C', firstTile.getAttribute( 'data-value' ), 'Order is incorrect.' );
			assert.areEqual( '1', firstTile.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
			assert.areEqual( '3', firstTile.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );

			txtColorBtn.click( editor );

			// 2. Test occurrences number order.
			this.editorBot.setHtmlWithSelection( '<p><span style="color:#e74c3c">I&#39;m</span> <span style="color:#f1c40f">an</span> <span style="color:#3498db">instance</span> of <span style="color:#2ecc71">CKEditor</span>. <span style="color:#2ecc71">Enjoy</span> <span style="color:#2ecc71">my</span> <span style="color:#e74c3c">colors</span>!</p>' );

			txtColorBtn.click( editor );

			firstTile = txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row .cke_colorbox' );

			assert.areEqual( '2ECC71', firstTile.getAttribute( 'data-value' ), 'Order is incorrect.' );
			assert.areEqual( '1', firstTile.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
			assert.areEqual( '4', firstTile.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );

			yellowTile = txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( ' .cke_colorcontent_row [data-value="F1C40F"]' );

			assert.areEqual( 'Vivid Yellow', yellowTile.getAttribute( 'title' ), 'Color label is incorrect.' );
			assert.areEqual( '3', yellowTile.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
			assert.areEqual( '4', yellowTile.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );
		},

		'test more colors than colorsPerRow in the document': function() {
			bender.editorBot.create( {
				name: 'editor1',
				config: {
					colorButton_colorsPerRow: 4
				}
			}, function( bot ) {
				var editor = bot.editor,
					txtColorBtn = editor.ui.get( 'TextColor' );

				bot.setHtmlWithSelection( '<p><span style="color:#1abc9c">H</span>' +
					'<span style="color:#2ecc71">e</span><span style="color:#3498db">l</span><span style="color:#9b59b6">l</span>' +
					'<span style="color:#4e5f70">o</span> <span style="color:#f1c40f">w</span><span style="color:#16a085">o</span>' +
					'<span style="color:#2980b9">r</span><span style="color:#8e44ad">l</span><span style="color:#2c3e50">d</span>' +
					'<span style="color:#f39c12">!</span></p>' );

				txtColorBtn.click( editor );

				assert.areEqual( 4, txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcontent_row' ).getChildCount(), 'Tiles number is incorrect.' );
			} );
		}

	} );
} )();
