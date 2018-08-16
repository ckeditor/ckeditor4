/* bender-tags: editor */
/* bender-ckeditor-plugins: uicolor */

bender.editor = {};

bender.test(
{
	'test set ui color with color palette': function() {
		bender.editorBot.create( {
			name: 'editor1'
		}, function( bot ) {

			bot.dialog( 'uicolor', function( dialog ) {
				assert.areEqual( undefined, bot.editor.uiColor );

				dialog.getContentElement( 'picker', 'selectedColor' ).setValue( '#FFFFFF' );

				assert.areEqual( '#FFFFFF', bot.editor.uiColor );
			} );

		} );
	},

	'test set ui color with predefined color': function() {
		bender.editorBot.create( {
			name: 'editor2'
		}, function( bot ) {

			bot.dialog( 'uicolor', function( dialog ) {
				assert.areEqual( undefined, bot.editor.uiColor );

				dialog.getContentElement( 'picker', 'predefined' ).setValue( '#a2c980' );

				assert.areEqual( '#a2c980', bot.editor.uiColor );
			} );

		} );
	},

	'test ui color is active when dialog opened (color palette)': function() {
		bender.editorBot.create( {
			name: 'editor3',
			config: {
				uiColor: '#000'
			}
		}, function( bot ) {

			bot.dialog( 'uicolor', function( dialog ) {
				assert.areEqual( '#000000', bot.editor.uiColor );
				assert.areEqual( '#000000', dialog.getContentElement( 'picker', 'selectedColor' ).getValue() );
			} );
		} );
	},

	'test ui color is active when dialog opened (predefined)': function() {
		bender.editorBot.create( {
			name: 'editor4',
			config: {
				uiColor: '#14B8C4'
			}
		}, function( bot ) {

			bot.dialog( 'uicolor', function( dialog ) {
				assert.areEqual( '#14b8c4', bot.editor.uiColor );
				assert.areEqual( '#14b8c4', dialog.getContentElement( 'picker', 'selectedColor' ).getValue() );
			} );
		} );
	}
} );
