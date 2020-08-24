/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog,button,forms,htmlwriter,toolbar */
/* bender-include: _helpers/tools.js, ../../core/style/_helpers/createInlineStyleTestCase.js */
/* global createInlineStyleTestCase */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		// (#4141)
		'test applying style to <select> element': createInlineStyleTestCase( 'apply-select' ),

		// (#4141)
		'test applying to editor contents when <select> element is present': createInlineStyleTestCase( 'apply-select-whole-editor', {
			// IE produces code with broken formatting, which leads to false negative result.
			ignore: CKEDITOR.env.ie
		} )
	} );
} )();
