/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: forms,toolbar */

bender.editor = {
	config: {
		autoParagraph: false
	}
};

bender.test( {
	test_createFillFields: function() {
		var editorBot = this.editorBot;

		editorBot.setHtmlWithSelection( '<p>^</p>' );

		editorBot.dialog( 'textarea', function( dialog ) {
			dialog.setValueOf( 'info', '_cke_saved_name', 'test_textarea' );
			dialog.setValueOf( 'info', 'cols', 80 );
			dialog.setValueOf( 'info', 'rows', 5 );
			dialog.setValueOf( 'info', 'value', 'Some testing value.' );
			dialog.setValueOf( 'info', 'required', 'checked' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<p><textarea cols="80" name="test_textarea" required="required" rows="5">some testing value.</textarea></p>', editorBot.getData( true ) );
		} );
	},

	test_emptyFields: function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<textarea cols="80" name="test_textarea" required="required" rows="5">some testing value.</textarea>]' );

		bot.dialog( 'textarea', function( dialog ) {
			assert.areSame( 'test_textarea', dialog.getValueOf( 'info', '_cke_saved_name' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'required' ) );
			assert.areSame( '80', dialog.getValueOf( 'info', 'cols' ) );
			assert.areSame( '5', dialog.getValueOf( 'info', 'rows' ) );

			dialog.setValueOf( 'info', '_cke_saved_name', '' );
			dialog.setValueOf( 'info', 'rows', '' );
			dialog.setValueOf( 'info', 'cols', '' );
			dialog.setValueOf( 'info', 'required', '' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<textarea>some testing value.</textarea>', bot.getData( false, true ) );
		} );
	},

	test_createSimple: function() {
		var editorBot = this.editorBot;

		editorBot.setHtmlWithSelection( '<p>^</p>' );

		editorBot.dialog( 'textarea', function( dialog ) {
			dialog.getButton( 'ok' ).click();
			assert.areSame( '<p><textarea></textarea></p>', editorBot.getData() );
		} );
	},

	test_specialValues: function() {
		var values = [
				'<HTML> content: <textarea>sample</textarea> tag.',
				'Line 1\nLine 2',
				'    Spaces before.',
				'Spaces after.   '
			],
			editorBot = this.editorBot,
			currentIndex = 0;

		function testValue( index ) {
			var value = values[ index ];

			if ( !value )
				return;

			editorBot.setHtmlWithSelection( '<p>^</p>' );

			editorBot.dialog( 'textarea', function( dialog ) {
				dialog.setValueOf( 'info', 'value', value );
				dialog.getButton( 'ok' ).click();

				assert.areSame( '<p><textarea>' + value.replace( /</g, '&lt;' ).replace( />/g, '&gt;' ) + '</textarea></p>', editorBot.getData().replace( '\r\n', '\n' ) );
				testValue.call( this, ++currentIndex );
			} );
		}

		// Start testing.
		testValue.call( this, 0 );
	}
} );