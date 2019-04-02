/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: dialog,button,forms,htmlwriter,toolbar */
/* bender-include: _helpers/tools.js */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {

		tearDown: function() {
			var dialog = CKEDITOR.dialog.getCurrent();

			if ( dialog ) {
				dialog.hide();
			}
		},

		// (#2423)
		'test dialog model during button creation': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '', function() {
				bot.dialog( 'button', function( dialog ) {
					assert.isNull( dialog.getModel( editor ) );
					assert.isFalse( dialog.isEditing( editor ) );
				} );
			} );
		},

		// (#2423)
		'test dialog model with existing button': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '<input type="button" value="click me" />', function() {
				bot.dialog( 'button', function( dialog ) {
					var button = editor.editable().findOne( 'input' );

					editor.getSelection().selectElement( button );

					assert.areEqual( button, dialog.getModel( editor ) );
					assert.isTrue( dialog.isEditing( editor ) );
				} );
			} );
		}
	} );

} )();
