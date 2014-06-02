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
			var counter = 0;

			window.onbeforeunload = function() {
				counter++;
			};

			this.editor.openDialog( 'testDialog', function( dialog ) {
				dialog.on( 'show', function() {
					var doc = new CKEDITOR.dom.document( document ),
						ok = doc.getById( dialog.getButton( 'ok' ).domId ).$;

					ok.click();

					resume( function() {
						assert.areSame( 0, counter, 'Event onbeforeunload should not be fired.' );
					} );
				} );
			} );

			wait();
		}
	} );
} )();