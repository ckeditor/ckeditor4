/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: dialog,forms,htmlwriter,toolbar */
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
		'test dialog model during hidden field creation': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '', function() {
				bot.dialog( 'hiddenfield', function( dialog ) {
					assert.isNull( dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
				} );
			} );
		},

		// (#2423)
		'test dialog model with existing hidden field': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '<input type="hidden" value="test" name="test" />', function() {
				bot.dialog( 'hiddenfield', function( dialog ) {
					var fakeInput = editor.editable().findOne( '[data-cke-real-element-type="hiddenfield"]' );

					editor.getSelection().selectElement( fakeInput );

					assert.areEqual( fakeInput, dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ), 'Dialog is in editing mode' );
				} );
			} );
		}
	} );

} )();
