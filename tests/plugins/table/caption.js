/* bender-tags: editor,unit,table */
/* bender-ckeditor-plugins: toolbar,dialog,table */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {

		'test caption index in table without headers': function() {
			var bot = this.editorBot;

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'txtCaption', 'Caption1' );
				dialog.getButton( 'ok' ).click();

				var table = bot.editor.document.find( 'table' );
				assert.areSame( table.count(), 1, 'Table inserted.' );
				assert.areSame( table.getItem( 0 ).getChild( 0 ).getName(), 'caption', 'Caption element is first child of table.' );
			} );
		},

		'test caption index in table with headers row': function() {
			var bot = this.editorBot;

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'txtCaption', 'Caption2' );
				dialog.setValueOf( 'info', 'selHeaders', 'row' );
				dialog.getButton( 'ok' ).click();

				var table = bot.editor.document.find( 'table' );
				assert.areSame( table.count(), 1, 'Table inserted.' );
				assert.areSame( table.getItem( 0 ).getChild( 0 ).getName(), 'caption', 'Caption element is first child of table.' );
			} );
		},

		'test caption index in table with headers col': function() {
			var bot = this.editorBot;

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'txtCaption', 'Caption3' );
				dialog.setValueOf( 'info', 'selHeaders', 'col' );
				dialog.getButton( 'ok' ).click();

				var table = bot.editor.document.find( 'table' );
				assert.areSame( table.count(), 1, 'Table inserted.' );
				assert.areSame( table.getItem( 0 ).getChild( 0 ).getName(), 'caption', 'Caption element is first child of table.' );
			} );
		},

		'test caption index in table with both headers': function() {
			var bot = this.editorBot;

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'txtCaption', 'Caption4' );
				dialog.setValueOf( 'info', 'selHeaders', 'both' );
				dialog.getButton( 'ok' ).click();

				var table = bot.editor.document.find( 'table' );
				assert.areSame( table.count(), 1, 'Table inserted.' );
				assert.areSame( table.getItem( 0 ).getChild( 0 ).getName(), 'caption', 'Caption element is first child of table.' );
			} );
		}
	} );
} )();
