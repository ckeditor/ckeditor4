/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialogadvtab,table,tableselection */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {

		// #579
		'test advance table dialog for ignorig selection class': function() {
			if ( !CKEDITOR.plugins.tableselection.isSupportedEnvironment ) {
				assert.ignore();
			}

			var bot = this.editorBot;

			// Add table with fake selection.
			bot.setHtmlWithSelection( '<table border="1">[<tr><td>Cell1</td><td>Cell2</td></tr>]</table>' );

			bot.dialog( 'tableProperties', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'advanced', 'advCSSClasses' ) );
			} );
		}
	} );
} )();
