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

	bender.test( {
		'2 rows, 2 cols, none -> none': compareInputOutput( headerNone( 'input' ), headerNone(), 'none' ),

		'2 rows, 2 cols, none -> col': compareInputOutput( headerNone( 'input' ), headerCol(), 'col' ),

		'2 rows, 2 cols, none -> row': compareInputOutput( headerNone( 'input' ), headerRow(), 'row' ),

		'2 rows, 2 cols, none -> both': compareInputOutput( headerNone( 'input' ), headerBoth(), 'both' ),

		'2 rows, 2 cols, col -> none': compareInputOutput( headerCol( 'input' ), headerNone(), 'none' ),

		'2 rows, 2 cols, col -> col': compareInputOutput( headerCol( 'input' ), headerCol(), 'col' ),

		'2 rows, 2 cols, col -> row': compareInputOutput( headerCol( 'input' ), headerRow(), 'row' ),

		'2 rows, 2 cols, col -> both': compareInputOutput( headerCol( 'input' ), headerBoth(), 'both' ),

		'2 rows, 2 cols, row -> none': compareInputOutput( headerRow( 'input' ), headerNone(), 'none' ),

		'2 rows, 2 cols, row -> col': compareInputOutput( headerRow( 'input' ), headerCol(), 'col' ),

		'2 rows, 2 cols, row -> row': compareInputOutput( headerRow( 'input' ), headerRow(), 'row' ),

		'2 rows, 2 cols, row -> both': compareInputOutput( headerRow( 'input' ), headerBoth(), 'both' ),

		'2 rows, 2 cols, both -> none': compareInputOutput( headerBoth( 'input' ), headerNone(), 'none' ),

		'2 rows, 2 cols, both -> col': compareInputOutput( headerBoth( 'input' ), headerCol(), 'col' ),

		'2 rows, 2 cols, both -> row': compareInputOutput( headerBoth( 'input' ), headerRow(), 'row' ),

		'2 rows, 2 cols, both -> both': compareInputOutput( headerBoth( 'input' ), headerBoth(), 'both' )
	} );
} )();
