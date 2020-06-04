/* bender-tags: tableselection,2235 */
/* bender-ckeditor-plugins: tableselection */

( function() {
	'use strict';

	bender.editor = true;

	var tests =  {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},

		'Is whole cell fake selected when img inside is selected': function() {
			var editor = this.editor,
				bot = this.editorBot,
				html = CKEDITOR.document.getById( 'test' ).getHtml();

			bot.setHtmlWithSelection( html );

			assert.isFalse( editor.getSelection().getSelectedElement().hasClass( 'cke_table-faked-selection' ) );
		}
	};

	bender.test( tests );

} )();
