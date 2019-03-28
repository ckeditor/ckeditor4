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
		'2 rows, 2 cols, none -> none': assertHeadersCorrectnesssAfterManipulation( headerNone(), headerNone(), 'none' ),

		'2 rows, 2 cols, none -> col': assertHeadersCorrectnesssAfterManipulation( headerNone(), headerCol(), 'col' ),

		'2 rows, 2 cols, none -> row': assertHeadersCorrectnesssAfterManipulation( headerNone(), headerRow(), 'row' ),

		'2 rows, 2 cols, none -> both': assertHeadersCorrectnesssAfterManipulation( headerNone(), headerBoth(), 'both' ),

		'2 rows, 2 cols, col -> none': assertHeadersCorrectnesssAfterManipulation( headerCol(), headerNone(), 'none' ),

		'2 rows, 2 cols, col -> col': assertHeadersCorrectnesssAfterManipulation( headerCol(), headerCol(), 'col' ),

		'2 rows, 2 cols, col -> row': assertHeadersCorrectnesssAfterManipulation( headerCol(), headerRow(), 'row' ),

		'2 rows, 2 cols, col -> both': assertHeadersCorrectnesssAfterManipulation( headerCol(), headerBoth(), 'both' ),

		'2 rows, 2 cols, row -> none': assertHeadersCorrectnesssAfterManipulation( headerRow(), headerNone(), 'none' ),

		'2 rows, 2 cols, row -> col': assertHeadersCorrectnesssAfterManipulation( headerRow(), headerCol(), 'col' ),

		'2 rows, 2 cols, row -> row': assertHeadersCorrectnesssAfterManipulation( headerRow(), headerRow(), 'row' ),

		'2 rows, 2 cols, row -> both': assertHeadersCorrectnesssAfterManipulation( headerRow(), headerBoth(), 'both' ),

		'2 rows, 2 cols, both -> none': assertHeadersCorrectnesssAfterManipulation( headerBoth(), headerNone(), 'none' ),

		'2 rows, 2 cols, both -> col': assertHeadersCorrectnesssAfterManipulation( headerBoth(), headerCol(), 'col' ),

		'2 rows, 2 cols, both -> row': assertHeadersCorrectnesssAfterManipulation( headerBoth(), headerRow(), 'row' ),

		'2 rows, 2 cols, both -> both': assertHeadersCorrectnesssAfterManipulation( headerBoth(), headerBoth(), 'both' )
	} );

	function assertHeadersCorrectnesssAfterManipulation( input, expected, headerType ) {
		return function() {
			var bot = bender.editorBots.editor;

			bot.setHtmlWithSelection( input );

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', headerType );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html( expected.replace( '^', '' ),
					dialog.getParentEditor().getData() );
			} );
		};
	}

	function headerNone() {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<td>^cell 1.1</td>' +
							'<td>cell 1.2</td>' +
						'</tr>' +
						'<tr>' +
							'<td>cell 2.1</td>' +
							'<td>cell 2.2</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerCol() {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">^cell 1.1</th>' +
							'<td>cell 1.2</td>' +
						'</tr>' +
						'<tr>' +
							'<th scope="row">cell 2.1</th>' +
							'<td>cell 2.2</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerRow() {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">^cell 1.1</th>' +
							'<th scope="col">cell 1.2</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<td>cell 2.1</td>' +
							'<td>cell 2.2</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerBoth() {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">^cell 1.1</th>' +
							'<th scope="col">cell 1.2</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">cell 2.1</th>' +
							'<td>cell 2.2</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

} )();
