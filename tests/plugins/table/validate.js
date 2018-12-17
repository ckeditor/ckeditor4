/* bender-tags: editor */
/* bender-ckeditor-plugins: dialogadvtab,table,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		// #2650
		'test validator when global scope is polluted': function() {
			this.editorBot.dialog( 'table', function( dialog ) {
				var spy = window.getValue = sinon.spy();

				dialog.getButton( 'ok' ).click();
				assert.isFalse( spy.called );
			} );
		}
	} );
} )();
