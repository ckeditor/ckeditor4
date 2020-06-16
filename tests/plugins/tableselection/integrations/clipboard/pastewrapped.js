/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: tableselection */
/* bender-ckeditor-remove-plugins: dialogadvtab */
/* bender-include: ../../_helpers/tableselection.js */

( function() {

	'use strict';

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		// (#2403)
		'test pasting table': function() {
			var editor = CKEDITOR.inline( CKEDITOR.document.getById( 'wrapped' ), {
					allowedContent: true
				} ),
				tableHtml = CKEDITOR.document.getById( '2x2-table' ).getOuterHtml();

			editor.once( 'instanceReady', function() {
				bender.tools.setHtmlWithSelection( editor, '^' );
				bender.tools.emulatePaste( editor, tableHtml );

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.beautified.html( tableHtml, editor.getData() );
					} );
				} );
			} );

			wait();
		}
	};

	bender.test( tests );

} )();
