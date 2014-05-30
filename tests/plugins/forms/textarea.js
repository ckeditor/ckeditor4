/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: forms,toolbar */

bender.editor = { config : { autoParagraph : false } };

bender.test(
{
	test_createFillFields : function() {
		var editorBot = this.editorBot;

		editorBot.setHtmlWithSelection( '<p>^</p>' );

		editorBot.dialog( 'textarea', function( dialog ) {
				dialog.setValueOf( 'info', '_cke_saved_name', 'test_textarea' );
				dialog.setValueOf( 'info', 'cols', 80 );
				dialog.setValueOf( 'info', 'rows', 5 );
				dialog.setValueOf( 'info', 'value', 'Some testing value.' );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<p><textarea cols="80" name="test_textarea" rows="5">some testing value.</textarea></p>', editorBot.getData( true ) );
			} );
	},

	test_createSimple : function() {
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
			'Spaces after.   ' ];

		var editorBot = this.editorBot,
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