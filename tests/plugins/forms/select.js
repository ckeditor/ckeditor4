/* bender-tags: editor */
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
	'test fill basic fields': function() {
		var bot = this.editorBot;

		bot.dialog( 'select', function( dialog ) {
			dialog.setValueOf( 'info', 'txtName', 'name' );
			dialog.setValueOf( 'info', 'txtValue', 'value' );
			dialog.setValueOf( 'info', 'txtSize', '8' );
			dialog.setValueOf( 'info', 'required', 'required' );
			dialog.setValueOf( 'info', 'chkMulti', 'checked' );

			dialog.getButton( 'ok' ).click();

			// IE needs delay as it runs asynchronous code in dialog's onOk.
			wait( function() {
				assert.isMatching( '<select multiple="(true|multiple)" name="name" required="required" size="8"></select>', bot.getData( false, true ) );
			}, 10 );
		} );
	},

	'test empty basic fields': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '[<select multiple="true" name="name" required="required" size="8"></select>]' );

		bot.dialog( 'select', function( dialog ) {
			assert.areSame( 'name', dialog.getValueOf( 'info', 'txtName' ) );
			assert.areSame( '', dialog.getValueOf( 'info', 'txtValue' ) );
			assert.areSame( '8', dialog.getValueOf( 'info', 'txtSize' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'required' ) );
			assert.areSame( true, dialog.getValueOf( 'info', 'chkMulti' ) );

			dialog.setValueOf( 'info', 'txtName', '' );
			dialog.setValueOf( 'info', 'txtValue', '' );
			dialog.setValueOf( 'info', 'txtSize', '' );
			dialog.setValueOf( 'info', 'required', '' );
			dialog.setValueOf( 'info', 'chkMulti', '' );

			dialog.getButton( 'ok' ).click();

			assert.areSame( '<select></select>', bot.getData( false, true ) );
		} );
	},

	'test required attribute collapsed': assertRequiredAttribute( {
		html: '[<select required></select>]',
		type: 'select',
		expected: true
	} ),

	'test required attribute without value': assertRequiredAttribute( {
		html: '[<select required=""></select>]',
		type: 'select',
		expected: true
	} ),

	'test required attribute with value `required`': assertRequiredAttribute( {
		html: '[<select required="required"></select>]',
		type: 'select',
		expected: true
	} ),

	'test required attribute absent': assertRequiredAttribute( {
		html: '[<select></select>]',
		type: 'select',
		expected: false
	} ),

	'test required attribute with invalid value': assertRequiredAttribute( {
		html: '[<select required="any value other than empty string or required"></select>]',
		type: 'select',
		expected: true
	} )
} );
