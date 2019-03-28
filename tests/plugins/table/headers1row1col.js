/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,button,entities,dialog,table */

( function() {
	'use strict';

	bender.editors = {
		editor: {
			name: 'editor1'
		},
		inline: {
			name: 'editor2',
			creator: 'inline'
		}
	};

	bender.test( {
		'1 row, 1 col, none -> none': compareInputOutput( headerNone( 'input' ), headerNone(), 'none' ),

		'1 row, 1 col, none -> col': compareInputOutput( headerNone( 'input' ), headerCol(), 'col' ),

		'1 row, 1 col, none -> row': compareInputOutput( headerNone( 'input' ), headerRow(), 'row' ),

		'1 row, 1 col, none -> both': compareInputOutput( headerNone( 'input' ), headerBoth(), 'both' ),

		'1 row, 1 col, col -> none': compareInputOutput( headerCol( 'input' ), headerNone(), 'none' ),

		'1 row, 1 col, col -> col': compareInputOutput( headerCol( 'input' ), headerCol(), 'col' ),

		'1 row, 1 col, col -> row': compareInputOutput( headerCol( 'input' ), headerRow(), 'row' ),

		'1 row, 1 col, col -> both': compareInputOutput( headerCol( 'input' ), headerBoth(), 'both' ),

		'1 row, 1 col, row -> none': compareInputOutput( headerRow( 'input' ), headerNone(), 'none' ),

		'1 row, 1 col, row -> col': compareInputOutput( headerRow( 'input' ), headerCol(), 'col' ),

		'1 row, 1 col, row -> row': compareInputOutput( headerRow( 'input' ), headerRow(), 'row' ),

		'1 row, 1 col, row -> both': compareInputOutput( headerRow( 'input' ), headerBoth(), 'both' ),

		'1 row, 1 col, both -> none': compareInputOutput( headerBoth( 'input' ), headerNone(), 'none' ),

		'1 row, 1 col, both -> col': compareInputOutput( headerBoth( 'input' ), headerCol(), 'col' ),

		'1 row, 1 col, both -> row': compareInputOutput( headerBoth( 'input' ), headerRow(), 'row' ),

		'1 row, 1 col, both -> both': compareInputOutput( headerBoth( 'input' ), headerBoth(), 'both' )
	} );

	function compareInputOutput( input, output, headers ) {
		return function() {
			var bot = bender.editorBots.editor;

			bot.setHtmlWithSelection( input	);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', headers );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html( output,
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
