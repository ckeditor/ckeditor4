/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog */

( function() {
	'use strict';

	CKEDITOR.on( 'instanceLoaded', function() {
		CKEDITOR.dialog.add( 'testDialog', function() {
			return {
				title: 'Test Dialog',
				contents: [
					{
						id: 'info',
						label: 'Test',
						elements: []
					}
				]
			};
		} );
	} );

	bender.editor = {};

	// #9958
	bender.test( {
		'test ok button': function() {
			window.onbeforeunload = sinon.spy();

			this.editor.openDialog( 'testDialog', function( dialog ) {
				dialog.on( 'show', function() {
					var okButton = dialog.getButton( 'ok' ).getInputElement();

					okButton.$.click();

					resume( function() {
						assert.areSame( 0, window.onbeforeunload.callCount, 'Event onbeforeunload should not be fired.' );
					} );
				} );
			} );

			wait();
		}
	} );
} )();