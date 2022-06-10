/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog */

bender.editor = true;

bender.test( {
	setUp: function() {
		this.editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
		CKEDITOR.dialog.add( 'testDialog', function() {
			return {
				title: 'Test Dialog',
				contents: [
					{
						id: 'info',
						elements: [
							{
								id: 'customRadio',
								type: 'radio',
								label: 'radio',
								items: [
									[ 'Test0', 'Test0', 'Test0' ],
									[ 'Test1', 'Test1', 'Test1' ],
									[ 'Test2', 'Test2', 'Test2' ]
								]
							},
							{
								id: 'customCheckbox',
								type: 'checkbox',
								label: 'checkbox'
							}
						]
					}
				]
			};
		} );
	},

	// (#5135)
	'test radio#setValue should be chainable': function() {
		var bot = this.editorBot;

		bot.dialog( 'testDialog', function( dialog ) {
			var field = dialog.getContentElement( 'info', 'customRadio' );

			field.setValue( 'Test1' ).setValue( 'Test2' );

			assert.areEqual( 'Test2', field.getValue() );

			// Close dialog.
			dialog.getButton( 'ok' ).click();
		} );
	},

	// (#5135)
	'test checkbox#setValue should be chainable': function() {
		var bot = this.editorBot;

		bot.dialog( 'testDialog', function( dialog ) {
			var field = dialog.getContentElement( 'info', 'customCheckbox' );

			field.setValue( true ).setValue( false );

			assert.isFalse( field.getValue() );

			// Close dialog.
			dialog.getButton( 'ok' ).click();
		} );
	}
} );
