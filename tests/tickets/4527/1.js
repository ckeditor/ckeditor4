/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,forms */

( function() {
	'use strict';

	bender.editor = {
		editorName: 'editor1',
		startupData: '',
		name: document.title,
		config: {
			forceSimpleAmpersand: true,
			mailProtection: 'encode'
		}
	};

	bender.test( {
		setUp: function() {
			// Force result data unformatted.
			this.editor.dataProcessor.writer._.rules = {};
			this.editor.focus();
		},

		/**
		 * Test email address attribute are well protected into encoded chars.
		 */
		test_insert_checkbox: function() {
			var bot = this.editorBot,
				editor = bot.editor;

			// waiting for dialog to open.
			bot.dialog( 'checkbox', function( dialog ) {
				var nameField = dialog.getContentElement( 'info', 'txtName' ),
					valueField = dialog.getContentElement( 'info', 'txtValue' ),
					checkedField = dialog.getContentElement( 'info', 'cmbSelected' );

				nameField.setValue( 'name' );
				valueField.setValue( '' );
				checkedField.setValue( 'checked' );
				dialog.fire( 'ok' );
				dialog.hide();

				assert.areEqual( '<p><input checked="checked" name="name" type="checkbox" /></p>',
					bender.tools.fixHtml( editor.getData(), true, false ), 'Inserted checkbox doesn\'t match.' );
			} );
		},

		test_update_checkbox: function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setHtmlWithSelection( '[<input checked="checked" name="name" type="checkbox" value="value" />]' );

			// waiting for dialog to open.
			bot.dialog( 'checkbox', function( dialog ) {
				var nameField = dialog.getContentElement( 'info', 'txtName' ),
					valueField = dialog.getContentElement( 'info', 'txtValue' ),
					checkedField = dialog.getContentElement( 'info', 'cmbSelected' );

				nameField.setValue( '' );
				valueField.setValue( '' );
				checkedField.setValue( '' );
				dialog.fire( 'ok' );
				dialog.hide();

				assert.areEqual( '<p><input type="checkbox" /></p>', editor.getData(), 'Inserted checkbox doesn\'t match.' );
			} );
		}
	} );
} )();
