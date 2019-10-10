/* bender-tags: specialchar */
/* bender-ckeditor-plugins: toolbar,wysiwygarea,specialchar */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		tearDown: function() {
			var dialog;

			while ( ( dialog = CKEDITOR.dialog.getCurrent() ) ) {
				dialog.hide();
			}
		},

		'test specialchar dialog should have table cells with role="presentation" and don\'t have empty table cells': function() {
			var bot = this.editorBot;

			bot.dialog( 'specialchar', function( dialog ) {
				var tableWithCharacters = dialog.parts.contents.findOne( 'td.cke_dialog_ui_hbox_first table[role="listbox"]' ),
					tableCells = tableWithCharacters.find( 'td' ).toArray(),
					i;

				for ( i = 0; i < tableCells.length; i++ ) {
					assert.areSame( 'presentation', tableCells[ i ].getAttribute( 'role' ),
						'Table cell with index: ' + i + ' should have role="presentation". Instead it has following html: ' + tableCells[ i ].getOuterHtml() );
					assert.areNotSame( '&nbsp;', tableCells[ i ].getHtml(), 'Table cell with index: ' + i + ' should not be empty.' );
				}
			} );
		}
	} );
} )();
