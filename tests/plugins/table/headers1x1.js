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
		'1 row, 1 col, none -> none': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<td>^&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'none' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<tbody>' +
							'<tr>' +
								'<td>&nbsp;</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, none -> col': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<td>^&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'col' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<tbody>' +
							'<tr>' +
								'<th scope="row">&nbsp;</th>' +
							'</tr>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, none -> row': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<td>^&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'row' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<thead>' +
							'<tr>' +
								'<th scope="col">&nbsp;</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, none -> both': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<td>^&nbsp;</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'both' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<thead>' +
							'<tr>' +
								'<th scope="row">&nbsp;</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, col -> none': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">^&nbsp;</th>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'none' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<tbody>' +
							'<tr>' +
								'<td>&nbsp;</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, col -> col': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">^&nbsp;</th>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'col' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<tbody>' +
							'<tr>' +
								'<th scope="row">&nbsp;</th>' +
							'</tr>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, col -> row': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">^&nbsp;</th>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'row' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<thead>' +
							'<tr>' +
								'<th scope="col">&nbsp;</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, col -> both': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<tbody>' +
						'<tr>' +
							'<th scope="row">^&nbsp;</th>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'both' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<thead>' +
							'<tr>' +
								'<th scope="row">&nbsp;</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, row -> none': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">^&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'none' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<tbody>' +
							'<tr>' +
								'<td>&nbsp;</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, row -> col': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">^&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'col' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<tbody>' +
							'<tr>' +
								'<th scope="row">&nbsp;</th>' +
							'</tr>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, row -> row': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">^&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'row' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<thead>' +
							'<tr>' +
								'<th scope="col">&nbsp;</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		},

		'1 row, 1 col, row -> both': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
					'<thead>' +
						'<tr>' +
							'<th scope="col">^&nbsp;</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'both' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
						'<thead>' +
							'<tr>' +
								'<th scope="row">&nbsp;</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		}
	} );
} )();
