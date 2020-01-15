/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,colordialog,toolbar */

( function() {
	'use strict';

	var tests = {
		'test color tile is not duplicated': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_tileduplication'
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[Foo bar baz]</p>' );

					return chooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return chooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' );

					assert.areEqual( 1,
						txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ).getChildCount(),
						'Row should contain one tile.' );
				} );
		},

		'test color tiles are added to the beginning of row': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_newtiles'
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[Foo bar baz]</p>' );
					return chooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return chooseColorFromDialog( bot, '#ff00ff' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' ),
						customColorRow = txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row' );

					assert.areEqual( 2, customColorRow.getChildCount(), 'Row should contain two tiles.' );
					assert.areEqual( 'FF00FF', customColorRow.findOne( '.cke_colorbox' ).getAttribute( 'data-value' ), 'New color should be displayed first.' );
				} );
		},

		'test color tiles move correctly': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_movingtiles'
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[Foo bar baz]</p>' );
					return chooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return chooseColorFromDialog( bot, '#ff00ff' );
				} )
				.then( function( bot ) {
					return chooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' );

					assert.areEqual( '00FF00',
						txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row .cke_colorbox' ).getAttribute( 'data-value' ),
						'Last chosen color should be displayed first.' );
				} );
		},

		'test colorButton_colorPerRow limits number of custom colors': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_rowsize',
					config: {
						colorButton_colorsPerRow: 4
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[Foo bar baz]</p>' );
					return chooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return chooseColorFromDialog( bot, '#ff00ff' );
				} )
				.then( function( bot ) {
					return chooseColorFromDialog( bot, '#22aaff' );
				} )
				.then( function( bot ) {
					return chooseColorFromDialog( bot, '#ffaa22' );
				} )
				.then( function( bot ) {
					return chooseColorFromDialog( bot, '#888888' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' ),
						customColorRow = txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colorcustom_row' ),
						firstTile,
						thirdTile;

					assert.areEqual( 4, customColorRow.getChildCount(), 'There shouldn\'t be more custom colors than allowed row size.' );

					firstTile = customColorRow.findOne( '[data-value="888888"]' );

					assert.areEqual( '1', firstTile.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
					assert.areEqual( '4', firstTile.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );

					thirdTile = customColorRow.findOne( '[data-value="22AAFF"]' );

					assert.areEqual( '3', thirdTile.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
					assert.areEqual( '4', thirdTile.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );
				} );
		}
	};

	tests = bender.tools.createAsyncTests( tests );

	bender.test( tests );

	function chooseColorFromDialog( bot, color ) {
		return new CKEDITOR.tools.promise( function( resolve, reject ) {
			var editor = bot.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;

				dialog.setValueOf( 'picker', 'selectedColor', color );
				dialog.getButton( 'ok' ).click();

				CKEDITOR.tools.setTimeout( function() {
					try {
						resolve( bot );
					} catch ( e ) {
						reject( e );
					}
				}, 0, this );
			} );

			txtColorBtn.click( editor );
			txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.findOne( '.cke_colormore' ).$.click();
		} );
	}
} )();
