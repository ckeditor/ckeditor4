/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: dialog,button,forms,toolbar */
/* bender-include: _helpers/tools.js */
/* global formsTools */

var assertRequiredAttribute = formsTools.assertRequiredAttribute;

bender.editor = {
	config: {
		autoParagraph: false
	}
};

bender.test( {

	tearDown: function() {
		var dialog = CKEDITOR.dialog.getCurrent();

		if ( dialog ) {
			dialog.hide();
		}
	},

	// (#2423)
	'test dialog model during text field creation': function() {
		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '', function() {
			bot.dialog( 'textfield', function( dialog ) {
				assert.isNull( dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
			} );
		} );
	},

	// (#2423)
	'test dialog model with existing button': function() {
		// (#3700)
		if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '<input type="text" value="test" name="test"/ >', function() {
			bot.dialog( 'textfield', function( dialog ) {
				var txtField = editor.editable().findOne( 'input' );

				editor.getSelection().selectElement( txtField );

				assert.areEqual( txtField, dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );
			} );
		} );
	},

	'test fill fields (text) ': function() {
		var bot = this.editorBot;

		bot.setData( '', function() {
			bot.dialog( 'textfield', function( dialog ) {
				dialog.setValueOf( 'info', '_cke_saved_name', 'name' );
				dialog.setValueOf( 'info', 'value', 'value' );
				dialog.setValueOf( 'info', 'required', 'checked' );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<input name="name" required="required" type="text" value="value" />', bot.getData( true ) );
			} );
		} );
	},

	'test fill fields (password)': function() {
		var bot = this.editorBot;

		bot.setData( '', function() {
			bot.dialog( 'textfield', function( dialog ) {
				dialog.setValueOf( 'info', 'type', 'password' );
				dialog.setValueOf( 'info', '_cke_saved_name', 'name' );
				dialog.setValueOf( 'info', 'value', 'value' );
				dialog.setValueOf( 'info', 'required', 'checked' );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<input name="name" required="required" type="password" value="value" />', bot.getData( true ) );
			} );
		} );
	},

	'test empty fields': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input name="name" type="text" value="value" required="required" />]' );

		bot.dialog( 'textfield', function( dialog ) {
			assert.areSame( 'name', dialog.getValueOf( 'info', '_cke_saved_name' ) );
			assert.areSame( 'value', dialog.getValueOf( 'info', 'value' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'required' ) );

			dialog.setValueOf( 'info', '_cke_saved_name', '' );
			dialog.setValueOf( 'info', 'value', '' );
			dialog.setValueOf( 'info', 'required', '' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input type="text" />', bot.getData( false, true ) );
		} );
	},

	'test read attributes (email)': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input name="name" type="email" value="test@host.com" />]' );

		bot.dialog( 'textfield', function( dialog ) {
			assert.areSame( 'name', dialog.getValueOf( 'info', '_cke_saved_name' ) );
			assert.areSame( 'email', dialog.getValueOf( 'info', 'type' ) );
			assert.areSame( 'test@host.com', dialog.getValueOf( 'info', 'value' ) );

			dialog.setValueOf( 'info', 'type', 'text' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input name="name" type="text" value="test@host.com" />', bot.getData( true ) );
		} );
	},

	'test required attribute collapsed': assertRequiredAttribute( {
		html: '[<input type="text" required />]',
		type: 'textfield',
		expected: true
	} ),

	'test required attribute without value': assertRequiredAttribute( {
		html: '[<input type="text" required="" />]',
		type: 'textfield',
		expected: true
	} ),

	'test required attribute with value `required`': assertRequiredAttribute( {
		html: '[<input type="text" required="required" />]',
		type: 'textfield',
		expected: true
	} ),

	'test required attribute absent': assertRequiredAttribute( {
		html: '[<input type="text" />]',
		type: 'textfield',
		expected: false
	} ),

	'test required attribute with invalid value': assertRequiredAttribute( {
		html: '[<input type="text" required="any value other than empty string or required" />]',
		type: 'textfield',
		expected: true
	} )
} );
