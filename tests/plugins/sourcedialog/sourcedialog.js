/* bender-tags: editor */
/* bender-ckeditor-plugins: sourcedialog,dialog,entities */

( function() {
	'use strict';

	bender.test( {
		'empty editor data': function() {
			bender.editorBot.create( {
				creator: 'inline',
				startupData: '<p>Bar</p>',
				name: 'editor1',
				config: {}
			}, function( bot ) {
				bot.dialog( 'sourcedialog', function( dialog ) {
					dialog.setValueOf( 'main', 'data', '' );
					dialog.getButton( 'ok' ).click();

					wait( function() {
						assert.areEqual( '<p>^&nbsp;</p>', bot.htmlWithSelection(), 'Editor is empty.' );
					}, 0 );
				} );
			} );
		},

		'load and change editor data': function() {
			bender.editorBot.create( {
				creator: 'inline',
				startupData: '<p>Foo</p>',
				name: 'editor2',
				config: {}
			}, function( bot ) {
				bot.dialog( 'sourcedialog', function( dialog ) {
					assert.areEqual( '<p>Foo</p>', dialog.getValueOf( 'main', 'data' ), 'Editor data has been loaded.' );

					dialog.setValueOf( 'main', 'data', '<p>Bar</p>' );
					dialog.getButton( 'ok' ).click();

					wait( function() {
						assert.areEqual( '<p>^Bar</p>', bot.htmlWithSelection(), 'Editor data has been altered.' );
					}, 0 );
				} );
			} );
		},

		'preserve selection if data isn\'t changed': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'editor3',
				config: {}
			}, function( bot ) {
				bot.setHtmlWithSelection( '<p>F[o]o</p>' );
				bot.dialog( 'sourcedialog', function( dialog ) {
					dialog.getButton( 'ok' ).click();

					wait( function() {
						assert.areEqual( '<p>F[o]o</p>', bot.htmlWithSelection(), 'Editor data remains unchanged.' );
					}, 0 );
				} );
			} );
		}
	} );

} )();
