/* bender-tags: editor,dialog,2423 */
/* bender-ckeditor-plugins: dialog,image,button,forms,htmlwriter,toolbar */
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

		'test dialog model during imagebutton creation': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '', function() {
				bot.dialog( 'imagebutton', function( dialog ) {
					assert.isNull( dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
				} );
			} );
		},

		'test dialog model with existing imagebutton': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '<input type="image" src="test" alt="alt" value="click me" />', function() {
				bot.dialog( 'imagebutton', function( dialog ) {
					var button = editor.editable().findOne( 'input' );

					editor.getSelection().selectElement( button );

					assert.areEqual( button, dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );
				} );
			} );
		}
	} );

} )();
