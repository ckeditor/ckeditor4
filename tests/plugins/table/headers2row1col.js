/* bender-tags: editor */
/* bender-ckeditor-plugins: table*/

( function() {
	'use strict';

	bender.editors = {
		editor: {
			name: 'editor1'
		}
	};

	bender.test( {
		'2 rows, 1 col, none -> none': assertHeadersCorrectnesssAfterManipulation( 'header-none', 'header-none', 'none' ),

		'2 rows, 1 col, none -> col': assertHeadersCorrectnesssAfterManipulation( 'header-none', 'header-col', 'col' ),

		'2 rows, 1 col, none -> row': assertHeadersCorrectnesssAfterManipulation( 'header-none', 'header-row', 'row' ),

		'2 rows, 1 col, none -> both': assertHeadersCorrectnesssAfterManipulation( 'header-none', 'header-both', 'both' ),

		'2 rows, 1 col, col -> none': assertHeadersCorrectnesssAfterManipulation( 'header-col', 'header-none', 'none' ),

		'2 rows, 1 col, col -> col': assertHeadersCorrectnesssAfterManipulation( 'header-col', 'header-col', 'col' ),

		'2 rows, 1 col, col -> row': assertHeadersCorrectnesssAfterManipulation( 'header-col', 'header-row', 'row' ),

		'2 rows, 1 col, col -> both': assertHeadersCorrectnesssAfterManipulation( 'header-col', 'header-both', 'both' ),

		'2 rows, 1 col, row -> none': assertHeadersCorrectnesssAfterManipulation( 'header-row', 'header-none', 'none' ),

		'2 rows, 1 col, row -> col': assertHeadersCorrectnesssAfterManipulation( 'header-row', 'header-col', 'col' ),

		'2 rows, 1 col, row -> row': assertHeadersCorrectnesssAfterManipulation( 'header-row', 'header-row', 'row' ),

		'2 rows, 1 col, row -> both': assertHeadersCorrectnesssAfterManipulation( 'header-row', 'header-both', 'both' ),

		'2 rows, 1 col, both -> none': assertHeadersCorrectnesssAfterManipulation( 'header-both', 'header-none', 'none' ),

		'2 rows, 1 col, both -> col': assertHeadersCorrectnesssAfterManipulation( 'header-both', 'header-col', 'col' ),

		'2 rows, 1 col, both -> row': assertHeadersCorrectnesssAfterManipulation( 'header-both', 'header-row', 'row' ),

		'2 rows, 1 col, both -> both': assertHeadersCorrectnesssAfterManipulation( 'header-both', 'header-both', 'both' )
	} );

	function assertHeadersCorrectnesssAfterManipulation( input, expected, headerType ) {
		return function() {
			var bot = bender.editorBots.editor;
			bot.setHtmlWithSelection( bender.tools.getValueAsHtml( input ).replace( ';', '' ) );

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', headerType );

				dialog.fire( 'ok' );
				dialog.hide();

				var exp = bender.tools.getValueAsHtml( expected ).replace( ';', '' );

				assert.beautified.html( exp.replace( '^', '' ),
					dialog.getParentEditor().getData() );
			} );
		};
	}

} )();
