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
		'test dialog model during form creation': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '', function() {
				bot.dialog( 'form', function( dialog ) {
					assert.isNull( dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
				} );
			} );
		},

		// (#2423)
		'test dialog model with existing form': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '<form name="test" action="index.html" method="get"></form>', function() {
				bot.dialog( 'form', function( dialog ) {
					var form = editor.editable().findOne( 'form' );

					editor.getSelection().selectElement( form );

					assert.areEqual( form, dialog.getModel( editor ) );
					assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );
				} );
			} );
		}
	} );

} )();
