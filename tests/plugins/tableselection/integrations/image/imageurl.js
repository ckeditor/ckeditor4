/* bender-tags: tableselection,2235 */
/* bender-ckeditor-plugins: tableselection */
/* bender-include: ../../_helpers/tableselection.js */
/* global tableSelectionHelpers */

( function() {
	'use strict';

	bender.editor = true;

	var tests =  {
		'is cell fake selected when img inside is selected': function() {
			var editor = this.editor,
				bot = this.editorBot;

			var html = CKEDITOR.document.getById( 'test' ).getHtml();
			bot.setHtmlWithSelection( html );

			assert.isFalse( editor.getSelection().getSelectedElement().hasClass( 'cke_table-faked-selection' ) );
		}
	};

	// Tests should be ignored in browsers which don't support tableselection plugin, i.e. IE < 11
	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );
	bender.test( tests );

} )();
