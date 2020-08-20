/* bender-tags: editor,colorbutton,colordialog,1795 */
/* bender-ckeditor-plugins: colorbutton,colordialog,undo,toolbar,wysiwygarea */
/* bender-include: _helpers/tools.js */
/* global colorHistoryTools */

( function() {
	'use strict';

	var tests = {
		'test color box is not duplicated': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_colorboxduplication'
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[Foo bar baz]</p>' );

					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' );

					assert.areEqual( 1, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
						'Row should contain one tile.' );
				} );
		},

		'test color tiles are added to the beginning of row': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_newtiles'
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[Foo bar baz]</p>' );
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#ff00ff' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' );

					assert.areEqual( 2, colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ).getChildCount(),
						'Row should contain two tiles.' );
					assert.areEqual( 'FF00FF', colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', txtColorBtn )
						.getAttribute( 'data-value' ), 'New color should be displayed first.' );
				} );
		},

		'test color tiles move correctly': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_movingcolorBoxes'
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[Foo bar baz]</p>' );
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#ff00ff' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' );

					assert.areEqual( '00FF00',
						colorHistoryTools.findInPanel( '.cke_colorhistory_row .cke_colorbox', txtColorBtn ).getAttribute( 'data-value' ),
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
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#ff00ff' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#22aaff' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#ffaa22' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#888888' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' ),
						colorHistoryRow = colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ),
						firstTile,
						thirdTile;

					assert.areEqual( 4, colorHistoryRow.getChildCount(), 'There shouldn\'t be more colors in history than allowed limit.' );

					firstTile = colorHistoryRow.findOne( '[data-value="888888"]' );

					assert.areEqual( '26', firstTile.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
					assert.areEqual( '30', firstTile.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );

					thirdTile = colorHistoryRow.findOne( '[data-value="22AAFF"]' );

					assert.areEqual( '28', thirdTile.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect.' );
					assert.areEqual( '30', thirdTile.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect.' );
				} );
		},

		'test colorButton_historyRowLimit allows to create second row': function() {
			return bender.editorBot.createAsync( {
					name: 'editor_rowcreation',
					config: {
						colorButton_colorsPerRow: 4,
						colorButton_historyRowLimit: 2
					}
				} )
				.then( function( bot ) {
					bot.setHtmlWithSelection( '<p>[Foo bar baz]</p>' );
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#00ff00' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#ff00ff' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#22aaff' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#ffaa22' );
				} )
				.then( function( bot ) {
					return colorHistoryTools.asyncChooseColorFromDialog( bot, '#888888' );
				} )
				.then( function( bot ) {
					var txtColorBtn = bot.editor.ui.get( 'TextColor' ),
						firstHistoryRow = colorHistoryTools.findInPanel( '.cke_colorhistory_row', txtColorBtn ),
						firstTile,
						fifthTile;

					assert.areEqual( 4, firstHistoryRow.getChildCount(), 'There shouldn\'t be more colors in row than allowed limit.' );

					firstTile = firstHistoryRow.findOne( '[data-value="888888"]' );

					assert.areEqual( '26', firstTile.getAttribute( 'aria-posinset' ), 'Aria-posinset of 1st box is incorrect.' );
					assert.areEqual( '31', firstTile.getAttribute( 'aria-setsize' ), 'Aria-setsize of 1st box is incorrect.' );

					fifthTile = colorHistoryTools.findInPanel( '[data-value="00FF00"]', txtColorBtn );

					assert.areEqual( '30', fifthTile.getAttribute( 'aria-posinset' ), 'Aria-posinset of 5th box is incorrect.' );
					assert.areEqual( '31', fifthTile.getAttribute( 'aria-setsize' ), 'Aria-setsize of 5th is incorrect.' );
				} );
		}
	};

	tests = bender.tools.createAsyncTests( tests );

	bender.test( tests );
} )();
