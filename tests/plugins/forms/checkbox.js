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
	'test fill fields': function() {
		// (#3700)
		if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
			assert.ignore();
		}

		var bot = this.editorBot;

		bot.dialog( 'checkbox', function( dialog ) {
			dialog.setValueOf( 'info', 'txtName', 'name' );
			dialog.setValueOf( 'info', 'txtValue', 'value' );
			dialog.setValueOf( 'info', 'cmbSelected', 'checked' );
			dialog.setValueOf( 'info', 'required', 'checked' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input checked="checked" name="name" required="required" type="checkbox" value="value" />', bot.getData( false, true ) );
		} );
	},
	// (#2423)
	'test dialog model during checkbox creation': function() {
		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '', function() {
			bot.dialog( 'checkbox', function( dialog ) {
				assert.isNull( dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
			} );
		} );
	},

	// (#2423)
	'test dialog model with existing checkbox': function() {
		// (#3700)
		if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '<input type="checkbox" value="value" />', function() {
			bot.dialog( 'checkbox', function( dialog ) {
				var button = editor.editable().findOne( 'input' );

				editor.getSelection().selectElement( button );

				assert.areEqual( button, dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );
			} );
		} );
	},

	'test empty fields': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<input checked="checked" name="name" required="required" type="checkbox" value="value" />]' );

		bot.dialog( 'checkbox', function( dialog ) {
			assert.areSame( 'name', dialog.getValueOf( 'info', 'txtName' ) );
			assert.areSame( 'value', dialog.getValueOf( 'info', 'txtValue' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'cmbSelected' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'required' ) );

			dialog.setValueOf( 'info', 'txtName', '' );
			dialog.setValueOf( 'info', 'txtValue', '' );
			dialog.setValueOf( 'info', 'cmbSelected', '' );
			dialog.setValueOf( 'info', 'required', '' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<input type="checkbox" />', bot.getData( false, true ) );
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
