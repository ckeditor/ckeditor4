/* bender-tags: editor */
/* bender-ckeditor-plugins: colordialog,wysiwygarea,toolbar,colorbutton */
/* bender-include: _helpers/tools.js */
/* global openDialogManually */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		// (#2639)
		'test omitting default text color': function() {
			openDialogManually( this.editor, '', '<h1>Foo</h1>', 'TextColor' );
		},

		// (#2639)
		'test omitting default background color': function() {
			openDialogManually( this.editor, '', '<h1>Foo</h1>', 'BGColor' );
		}
	} );

} )();
