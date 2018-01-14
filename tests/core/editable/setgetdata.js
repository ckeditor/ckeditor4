/* bender-tags: editor */

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
	},

	'test toDataFormat - preserves space after br': function() {
		bender.editorBot.create( {
			name: 'test_data_space_after_newline',
			creator: 'inline',
			config: {
				enterMode: CKEDITOR.ENTER_BR
			}
		}, function( bot ) {
			var editor = bot.editor;

			// Insert text in multiple steps so that selectionchange is triggered in between,
			// which causes CKEDITOR to insert fillingCharSequence.
			bot.htmlWithSelection( 'first line<br />^' );
			editor.insertText( ' ' );
			editor.insertText( 'second line' );

			// Removal of fillingCharSequence during `toDataFormat` may be performed incorrectly,
			// causing the space to be removed.
			assert.areSame( 'first line<br />&nbsp;second line', editor.getData(), 'getData preserved space' );
		} );
	}
} );
