/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: dialog,button,forms,htmlwriter,toolbar */
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

	'test fill fields': function() {
		// (#3700)
		if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
			assert.ignore();
		}

		var bot = this.editorBot;

		bot.dialog( 'radio', function( dialog ) {
			dialog.setValueOf( 'info', 'name', 'name' );
			dialog.setValueOf( 'info', 'value', 'value' );
			dialog.setValueOf( 'info', 'checked', 'checked' );
			dialog.setValueOf( 'info', 'required', 'checked' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input checked="checked" name="name" required="required" type="radio" value="value" />', bot.getData( false, true ) );
		} );
	},

	// (#2423)
	'test dialog model during radio creation': function() {
		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '', function() {
			bot.dialog( 'radio', function( dialog ) {
				assert.isNull( dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
			} );
		} );
	},

	// (#2423)
	'test dialog model with existing radio': function() {
		// (#3700)
		if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '<input type="radio" />', function() {
			bot.dialog( 'radio', function( dialog ) {
				var radio = editor.editable().findOne( 'input' );

				editor.getSelection().selectElement( radio );

				assert.areEqual( radio, dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );
			} );
		} );
	},

	'test empty fields': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input checked="checked" name="name" required="required" type="radio" value="value" />]' );

		// We need to add attribute 'checked', after adding radio input to editable.
		// From uknown reason IE omits this attribute when add radio input element to DOM tree.
		if ( CKEDITOR.env.ie ) {
			this.editor.editable().findOne( 'input' ).setAttribute( 'checked', 'checked' );
		}

		bot.dialog( 'radio', function( dialog ) {
			assert.areSame( 'name', dialog.getValueOf( 'info', 'name' ) );
			assert.areSame( 'value', dialog.getValueOf( 'info', 'value' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'checked' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'required' ) );

			dialog.setValueOf( 'info', 'name', '' );
			dialog.setValueOf( 'info', 'value', '' );
			dialog.setValueOf( 'info', 'checked', '' );
			dialog.setValueOf( 'info', 'required', '' );

			dialog.getButton( 'ok' ).click();

			// IE is problematic: you cannot remove `value` from the input.
			// This customization should be removed if #844 will be fixed.
			if ( CKEDITOR.env.ie ) {
				assert.areSame( '<input type="radio" value="value" />', bot.getData( false, true ) );
			} else {
				assert.areSame( '<input type="radio" />', bot.getData( false, true ) );
			}
		} );
	},

	'test required attribute collapsed': assertRequiredAttribute( {
		html: '[<input type="checkbox" required />]',
		type: 'checkbox',
		expected: true
	} ),

	'test required attribute without value': assertRequiredAttribute( {
		html: '[<input type="checkbox" required="" />]',
		type: 'checkbox',
		expected: true
	} ),

	'test required attribute with value `required`': assertRequiredAttribute( {
		html: '[<input type="checkbox" required="required" />]',
		type: 'checkbox',
		expected: true
	} ),

	'test required attribute absent': assertRequiredAttribute( {
		html: '[<input type="checkbox" />]',
		type: 'checkbox',
		expected: false
	} ),

	'test required attribute with invalid value': assertRequiredAttribute( {
		html: '[<input type="checkbox" required="any value other than empty string or required" />]',
		type: 'checkbox',
		expected: true
	} )
} );
