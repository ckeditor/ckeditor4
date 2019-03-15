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
		var bot = bender.editorBots.editor;

		bot.setHtmlWithSelection( input	);

		bot.dialog( 'tableProperties', function( dialog ) {
			dialog.setValueOf( 'info', 'selHeaders', headers );

			dialog.fire( 'ok' );
			dialog.hide();

			assert.beautified.html( output,
				dialog.getParentEditor().getData() );
		} );
	}

	function headerNone( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<td>' + ( role == 'input' ? '^' : '' ) + '&nbsp;</td>' +
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
					'</tbody>' +
				'</table>';
	}

	function headerBoth( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="row">' + ( role == 'input' ? '^' : '' ) + '&nbsp;</th>' +
							'<th scope="col">&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
					'</tbody>' +
				'</table>';
	}

	bender.test( {
		'1 row, 2 cols, none -> none': function() {
			compareInputOutput( headerNone( 'input' ), headerNone(), 'none' );
		},

		'1 row, 2 cols, none -> col': function() {
			compareInputOutput( headerNone( 'input' ), headerCol(), 'col' );
		},

		'1 row, 2 cols, none -> row': function() {
			compareInputOutput( headerNone( 'input' ), headerRow(), 'row' );
		},

		'1 row, 2 cols, none -> both': function() {
			compareInputOutput( headerNone( 'input' ), headerBoth(), 'both' );
		},

		'1 row, 2 cols, col -> none': function() {
			compareInputOutput( headerCol( 'input' ), headerNone(), 'none' );
		},

		'1 row, 2 cols, col -> col': function() {
			compareInputOutput( headerCol( 'input' ), headerCol(), 'col' );
		},

		'1 row, 2 cols, col -> row': function() {
			compareInputOutput( headerCol( 'input' ), headerRow(), 'row' );
		},

		'1 row, 2 cols, col -> both': function() {
			compareInputOutput( headerCol( 'input' ), headerBoth(), 'both' );
		},

		'1 row, 2 cols, row -> none': function() {
			compareInputOutput( headerRow( 'input' ), headerNone(), 'none' );
		},

		'1 row, 2 cols, row -> col': function() {
			compareInputOutput( headerRow( 'input' ), headerCol(), 'col' );
		},

		'1 row, 2 cols, row -> row': function() {
			compareInputOutput( headerRow( 'input' ), headerRow(), 'row' );
		},

		'1 row, 2 cols, row -> both': function() {
			compareInputOutput( headerRow( 'input' ), headerBoth(), 'both' );
		},

		'1 row, 2 cols, both -> none': function() {
			compareInputOutput( headerBoth( 'input' ), headerNone(), 'none' );
		},

		'1 row, 2 cols, both -> col': function() {
			compareInputOutput( headerBoth( 'input' ), headerCol(), 'col' );
		},

		'1 row, 2 cols, both -> row': function() {
			compareInputOutput( headerBoth( 'input' ), headerRow(), 'row' );
		},

		'1 row, 2 cols, both -> both': function() {
			compareInputOutput( headerBoth( 'input' ), headerBoth(), 'both' );
		}
	} );
} )();
