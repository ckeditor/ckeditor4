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
		'test create table': function() {
			var bot = this.editorBots.editor,
				editable = bot.editor.editable();

			bot.dialog( 'tableProperties', function( dialog ) {
				var isSmallViewport = editable.getSize( 'width' ) < 500;
				// Check defaults.
				assert.areSame( '3', dialog.getValueOf( 'info', 'txtRows' ) );
				assert.areSame( '2', dialog.getValueOf( 'info', 'txtCols' ) );
				// Table width is set either to 100% or 500px depending on the editable size.
				assert.areSame( isSmallViewport ? '100%' : '500px', dialog.getValueOf( 'info', 'txtWidth' ) );

				dialog.fire( 'ok' );
				dialog.hide();

				wait( function() {
					// https://dev.ckeditor.com/ticket/8337: check cursor position after hand.
					var output = bender.tools.getHtmlWithSelection( bot.editor );
					output = bender.tools.fixHtml( bender.tools.compatHtml( output ) );
					var expected = bender.tools.compatHtml( bender.tools.getValueAsHtml( 'create-table' ) );

					if ( isSmallViewport ) {
						expected = expected.replace( /500\s*px/, '100%' );
					}

					assert.areSame( expected, output );
				}, 0 );
			} );
		},

		'test add caption/summary': function() {
			var bot = this.editorBots.editor;
			bender.tools.testInputOut( 'add-caption', function( source, expected ) {
				bot.setHtmlWithSelection( source );
				bot.dialog( 'tableProperties', function( dialog ) {
					var captionField = dialog.getContentElement( 'info', 'txtCaption' ),
					summaryField = dialog.getContentElement( 'info', 'txtSummary' );

					captionField.setValue( 'Caption' );
					summaryField.setValue( 'Summary' );

					dialog.fire( 'ok' );
					dialog.hide();

					assert.areSame( bender.tools.compatHtml( bender.tools.fixHtml( expected ) ), bot.getData( true ) );
				} );
			} );
		},

		'test table populates dialog': function() {
			var bot = this.editorBots.editor;
			bender.tools.testInputOut( 'read-table', function( source ) {
				bot.setHtmlWithSelection( source );
				bot.dialog( 'tableProperties', function( dialog ) {
					assert.areSame( '3', dialog.getValueOf( 'info', 'txtRows' ) );
					assert.areSame( '2', dialog.getValueOf( 'info', 'txtCols' ) );
					assert.areSame( '', dialog.getValueOf( 'info', 'txtWidth' ) );
					assert.areSame( 'row', dialog.getValueOf( 'info', 'selHeaders' ) );
					assert.areSame( 'caption', dialog.getValueOf( 'info', 'txtCaption' ) );

					dialog.getButton( 'ok' ).click();
				} );
			} );
		},

		'test table populates dialog - table width': function() {
			var bot = this.editorBots.editor;
			bender.tools.testInputOut( 'read-table-width', function( source ) {
				bot.setHtmlWithSelection( source );
				bot.dialog( 'tableProperties', function( dialog ) {
					assert.areSame( '50%', dialog.getValueOf( 'info', 'txtWidth' ) );

					dialog.getButton( 'ok' ).click();
				} );
			} );
		},

		'test delete table wrapped in div': function() {
			var bot = this.editorBots.editor;
			bender.tools.testInputOut( 'del-table', function( source ) {
				bot.setHtmlWithSelection( source );
				bot.execCommand( 'tableDelete' );
				assert.isInnerHtmlMatching( '<p>@@</p>', bot.editor.editable().getHtml(), 'div was removed too' );
			} );
		},

		// https://dev.ckeditor.com/ticket/12110.
		'test delete table directly in inline editor': function() {
			var bot = this.editorBots.inline,
				editable = bot.editor.editable();

			bot.setHtmlWithSelection(
				'<table>' +
					'<tbody>' +
						'<tr>' +
							'<td></td>' +
							'<td>x^x</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' );
			bot.execCommand( 'tableDelete' );

			assert.isTrue( CKEDITOR.document.getBody().contains( editable ), 'Editable should not be removed' );
			assert.areEqual( '', bot.editor.getData() );
		},

		// (#566)
		'test html border attribute behaviour when CSS border is 0': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="0" style="border:0px solid #ff0000">' +
					'<tbody>' +
						'<tr>' +
							'<td></td>' +
							'<td>x^x</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' );

			assert.isTrue( /border="0"/.test( bot.editor.getData() ), 'Border attribute should be zero' );
		},

		// (#566)
		'test html border attribute behaviour when CSS border is not  0': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="0" style="border:6px solid #ff0000">' +
					'<tbody>' +
						'<tr>' +
							'<td></td>' +
							'<td>x^x</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' );

			assert.isTrue( /border="1"/.test( bot.editor.getData() ), 'Border attribute should be one' );
		},

		// (#1397)
		'test table dialog error when only row is header': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellspacing="1" cellpadding="1" style="width:500px;">' +
					'<thead>' +
						'<tr>' +
							'<th>^<br></th>' +
							'<th><br></th>' +
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

				assert.isNull( dialog.parts.dialog.findOne( 'th' ) );
				assert.isTrue( !!dialog.parts.dialog.findOne( 'td' ) );
			} );
		},

		// (#1397)
		'test table remove headers': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection(
				'<table border="1" cellspacing="1" cellpadding="1" style="width:500px;">' +
					'<thead>' +
						'<tr>' +
							'<th>^Foo</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						'<tr>' +
							'<td>Bar</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
			);

			bot.dialog( 'tableProperties', function( dialog ) {
				dialog.setValueOf( 'info', 'selHeaders', 'none' );

				dialog.fire( 'ok' );
				dialog.hide();

				assert.beautified.html(
					'<table border="1" cellspacing="1" cellpadding="1" style="width:500px">' +
						'<tbody>' +
							'<tr>' +
								'<td>Foo</td>' +
							'</tr>' +
							'<tr>' +
								'<td>Bar</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>',
					dialog.getParentEditor().getData() );
			} );
		}
	} );
} )();
