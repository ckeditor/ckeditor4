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
						'</tr>' +
						'<tr>' +
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
						'</tr>' +
						'<tr>' +
							'<th scope="row">&nbsp;</th>' +
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
						'<tr>' +
							'<td>&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	function headerBoth( role ) {
		return '<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="row">' + ( role == 'input' ? '^' : '' ) + '&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">&nbsp;</th>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
	}

	bender.test( {
		'2 rows, 1 col, none -> none': function() {
			compareInputOutput( headerNone( 'input' ), headerNone(), 'none' );
		},

		'2 rows, 1 col, none -> col': function() {
			compareInputOutput( headerNone( 'input' ), headerCol(), 'col' );
		},

		'2 rows, 1 col, none -> row': function() {
			compareInputOutput( headerNone( 'input' ), headerRow(), 'row' );
		},

		'2 rows, 1 col, none -> both': function() {
			compareInputOutput( headerNone( 'input' ), headerBoth(), 'both' );
		},

		'2 rows, 1 col, col -> none': function() {
			compareInputOutput( headerCol( 'input' ), headerNone(), 'none' );
		},

		'2 rows, 1 col, col -> col': function() {
			compareInputOutput( headerCol( 'input' ), headerCol(), 'col' );
		},

		'2 rows, 1 col, col -> row': function() {
			compareInputOutput( headerCol( 'input' ), headerRow(), 'row' );
		},

		'2 rows, 1 col, col -> both': function() {
			compareInputOutput( headerCol( 'input' ), headerBoth(), 'both' );
		},

		'2 rows, 1 col, row -> none': function() {
			compareInputOutput( headerRow( 'input' ), headerNone(), 'none' );
		},

		'2 rows, 1 col, row -> col': function() {
			compareInputOutput( headerRow( 'input' ), headerCol(), 'col' );
		},

		'2 rows, 1 col, row -> row': function() {
			compareInputOutput( headerRow( 'input' ), headerRow(), 'row' );
		},

		'2 rows, 1 col, row -> both': function() {
			compareInputOutput( headerRow( 'input' ), headerBoth(), 'both' );
		},

		'2 rows, 1 col, both -> none': function() {
			compareInputOutput( headerBoth( 'input' ), headerNone(), 'none' );
		},

		'2 rows, 1 col, both -> col': function() {
			compareInputOutput( headerBoth( 'input' ), headerCol(), 'col' );
		},

		'2 rows, 1 col, both -> row': function() {
			compareInputOutput( headerBoth( 'input' ), headerRow(), 'row' );
		},

		'2 rows, 1 col, both -> both': function() {
			compareInputOutput( headerBoth( 'input' ), headerBoth(), 'both' );
		}
	} );
} )();
