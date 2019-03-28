/* bender-tags: editor */
/* bender-ckeditor-plugins: table */

( function() {
	'use strict';

	bender.editors = {
		editor: {
			name: 'editor1'
		}
	};

	bender.test( {
		'1 row, 1 col, none -> none': assertHeadersCorrectnesssAfterManipulation( headerNone( 'input' ), headerNone(), 'none' ),

		'1 row, 1 col, none -> col': assertHeadersCorrectnesssAfterManipulation( headerNone( 'input' ), headerCol(), 'col' ),

		'1 row, 1 col, none -> row': assertHeadersCorrectnesssAfterManipulation( headerNone( 'input' ), headerRow(), 'row' ),

		'1 row, 1 col, none -> both': assertHeadersCorrectnesssAfterManipulation( headerNone( 'input' ), headerBoth(), 'both' ),

		'1 row, 1 col, col -> none': assertHeadersCorrectnesssAfterManipulation( headerCol( 'input' ), headerNone(), 'none' ),

		'1 row, 1 col, col -> col': assertHeadersCorrectnesssAfterManipulation( headerCol( 'input' ), headerCol(), 'col' ),

		'1 row, 1 col, col -> row': assertHeadersCorrectnesssAfterManipulation( headerCol( 'input' ), headerRow(), 'row' ),

		'1 row, 1 col, col -> both': assertHeadersCorrectnesssAfterManipulation( headerCol( 'input' ), headerBoth(), 'both' ),

		'1 row, 1 col, row -> none': assertHeadersCorrectnesssAfterManipulation( headerRow( 'input' ), headerNone(), 'none' ),

		'1 row, 1 col, row -> col': assertHeadersCorrectnesssAfterManipulation( headerRow( 'input' ), headerCol(), 'col' ),

		'1 row, 1 col, row -> row': assertHeadersCorrectnesssAfterManipulation( headerRow( 'input' ), headerRow(), 'row' ),

		'1 row, 1 col, row -> both': assertHeadersCorrectnesssAfterManipulation( headerRow( 'input' ), headerBoth(), 'both' ),

		'1 row, 1 col, both -> none': assertHeadersCorrectnesssAfterManipulation( headerBoth( 'input' ), headerNone(), 'none' ),

		'1 row, 1 col, both -> col': assertHeadersCorrectnesssAfterManipulation( headerBoth( 'input' ), headerCol(), 'col' ),

		'1 row, 1 col, both -> row': assertHeadersCorrectnesssAfterManipulation( headerBoth( 'input' ), headerRow(), 'row' ),

		'1 row, 1 col, both -> both': assertHeadersCorrectnesssAfterManipulation( headerBoth( 'input' ), headerBoth(), 'both' )
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
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerCol( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">' + ( role == 'input' ? '^' : '' ) + '&nbsp;</th>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerRow( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">' + ( role == 'input' ? '^' : '' ) + '&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
					'</tbody>' +
				'</table>';
	}

	function headerBoth( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">' + ( role == 'input' ? '^' : '' ) + '&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
					'</tbody>' +
				'</table>';
	}

} )();
