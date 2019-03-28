/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,button,entities,dialog,table */

( function() {
	'use strict';

	bender.editors = {
		editor: {
			name: 'editor1'
		}
	};

	bender.test( {
		'2 rows, 2 cols, none -> none': assertHeadersCorrectnesssAfterManipulation( headerNone( 'input' ), headerNone(), 'none' ),

		'2 rows, 2 cols, none -> col': assertHeadersCorrectnesssAfterManipulation( headerNone( 'input' ), headerCol(), 'col' ),

		'2 rows, 2 cols, none -> row': assertHeadersCorrectnesssAfterManipulation( headerNone( 'input' ), headerRow(), 'row' ),

		'2 rows, 2 cols, none -> both': assertHeadersCorrectnesssAfterManipulation( headerNone( 'input' ), headerBoth(), 'both' ),

		'2 rows, 2 cols, col -> none': assertHeadersCorrectnesssAfterManipulation( headerCol( 'input' ), headerNone(), 'none' ),

		'2 rows, 2 cols, col -> col': assertHeadersCorrectnesssAfterManipulation( headerCol( 'input' ), headerCol(), 'col' ),

		'2 rows, 2 cols, col -> row': assertHeadersCorrectnesssAfterManipulation( headerCol( 'input' ), headerRow(), 'row' ),

		'2 rows, 2 cols, col -> both': assertHeadersCorrectnesssAfterManipulation( headerCol( 'input' ), headerBoth(), 'both' ),

		'2 rows, 2 cols, row -> none': assertHeadersCorrectnesssAfterManipulation( headerRow( 'input' ), headerNone(), 'none' ),

		'2 rows, 2 cols, row -> col': assertHeadersCorrectnesssAfterManipulation( headerRow( 'input' ), headerCol(), 'col' ),

		'2 rows, 2 cols, row -> row': assertHeadersCorrectnesssAfterManipulation( headerRow( 'input' ), headerRow(), 'row' ),

		'2 rows, 2 cols, row -> both': assertHeadersCorrectnesssAfterManipulation( headerRow( 'input' ), headerBoth(), 'both' ),

		'2 rows, 2 cols, both -> none': assertHeadersCorrectnesssAfterManipulation( headerBoth( 'input' ), headerNone(), 'none' ),

		'2 rows, 2 cols, both -> col': assertHeadersCorrectnesssAfterManipulation( headerBoth( 'input' ), headerCol(), 'col' ),

		'2 rows, 2 cols, both -> row': assertHeadersCorrectnesssAfterManipulation( headerBoth( 'input' ), headerRow(), 'row' ),

		'2 rows, 2 cols, both -> both': assertHeadersCorrectnesssAfterManipulation( headerBoth( 'input' ), headerBoth(), 'both' )
	} );

	function assertHeadersCorrectnesssAfterManipulation( input, expected, headerType ) {
		return function() {
			var bot = bender.editorBots.editor;

			bot.setHtmlWithSelection( input	);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', headerType );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html( expected,
					dialog.getParentEditor().getData() );
			} );
		};
	}

	function headerNone( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<td>' + ( role == 'input' ? '^' : '' ) + '&nbsp;</td>' +
							'<td>&nbsp;</td>' +
						'</tr>' +
						'<tr>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerCol( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">' + ( role == 'input' ? '^' : '' ) + '&nbsp;</th>' +
							'<td>&nbsp;</td>' +
						'</tr>' +
						'<tr>' +
							'<th scope="row">&nbsp;</th>' +
							'<td>&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerRow( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">' + ( role == 'input' ? '^' : '' ) + '&nbsp;</th>' +
							'<th scope="col">&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerBoth( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">' + ( role == 'input' ? '^' : '' ) + '&nbsp;</th>' +
							'<th scope="col">&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">&nbsp;</th>' +
							'<td>&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

} )();
