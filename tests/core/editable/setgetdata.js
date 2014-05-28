/* bender-tags: editor,unit */

'use strict';

bender.test( {
	'test setData/getData use main enter mode': function() {
		bender.editorBot.create( {
			name: 'test_data_enter_mode'
		}, function( bot ) {
			var editor = bot.editor,
				toHtml = 0,
				toDataFormat = 0,
				mode;

			editor.on( 'toHtml', function( evt ) {
				toHtml += 1;
				mode = evt.data.enterMode;
			} );
			editor.on( 'toDataFormat', function( evt ) {
				toDataFormat += 1;
				mode = evt.data.enterMode;
			} );

			editor.setActiveEnterMode( CKEDITOR.ENTER_BR );

			bot.setData( 'foo', function() {
				assert.areSame( CKEDITOR.ENTER_P, mode, 'main enter mode was used - setData' );

				editor.getData();
				assert.areSame( CKEDITOR.ENTER_P, mode, 'main enter mode was used - getData' );

				assert.areSame( 1, toHtml, 'toHtml was fired once' );
				assert.areSame( 1, toDataFormat, 'toDataFormat was fired once' );
			} );
		} );
	},

	'test setData/getData use main enter mode - inline': function() {
		bender.editorBot.create( {
			name: 'test_data_enter_mode_inline',
			creator: 'inline'
		}, function( bot ) {
			var editor = bot.editor,
				toHtml = 0,
				toDataFormat = 0,
				mode;

			editor.on( 'toHtml', function( evt ) {
				toHtml += 1;
				mode = evt.data.enterMode;
			} );
			editor.on( 'toDataFormat', function( evt ) {
				toDataFormat += 1;
				mode = evt.data.enterMode;
			} );

			editor.setActiveEnterMode( CKEDITOR.ENTER_BR );

			bot.setData( 'foo', function() {
				assert.areSame( CKEDITOR.ENTER_P, mode, 'main enter mode was used - setData' );

				editor.getData();
				assert.areSame( CKEDITOR.ENTER_P, mode, 'main enter mode was used - getData' );

				assert.areSame( 1, toHtml, 'toHtml was fired once' );
				assert.areSame( 1, toDataFormat, 'toDataFormat was fired once' );
			} );
		} );
	}
} );