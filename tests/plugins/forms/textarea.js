/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: forms,toolbar */
/* bender-include: _helpers/tools.js */
/* global formsTools */

var assertRequiredAttribute = formsTools.assertRequiredAttribute;

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
	},

	// (#2423)
	'test dialog model during textarea creation': function() {
		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '', function() {
			bot.dialog( 'textarea', function( dialog ) {
				assert.isNull( dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );

				dialog.hide();
			} );
		} );
	},

	// (#2423)
	'test dialog model with existing textarea': function() {
		// (#3700)
		if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '<textarea>test</textarea>', function() {
			bot.dialog( 'textarea', function( dialog ) {
				var textarea = editor.editable().findOne( 'textarea' );

				editor.getSelection().selectElement( textarea );

				assert.areEqual( textarea, dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );

				dialog.hide();
			} );
		} );
	},

	'test required attribute collapsed': assertRequiredAttribute( {
		html: '[<textarea required></textarea>]',
		type: 'textarea',
		expected: true
	} ),

	'test required attribute without value': assertRequiredAttribute( {
		html: '[<textarea required=""></textarea>]',
		type: 'textarea',
		expected: true
	} ),

	'test required attribute with value `required`': assertRequiredAttribute( {
		html: '[<textarea required="required"></textarea>]',
		type: 'textarea',
		expected: true
	} ),

	'test required attribute absent': assertRequiredAttribute( {
		html: '[<textarea></textarea>]',
		type: 'textarea',
		expected: false
	} ),

	'test required attribute with invalid value': assertRequiredAttribute( {
		html: '[<textarea required="any value other than empty string or required"></textarea>]',
		type: 'textarea',
		expected: true
	} )
} );
