/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,button,entities,dialog,table */

( function() {
	'use strict';

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				editor: {
					name: 'editor1'
				},
				inline: {
					name: 'editor2',
					creator: 'inline'
				}
			}, function( editors, bots ) {
				that.editorBots = bots;
				that.editors = editors;
				that.callback();
			} );
		},

		'test create table' : function() {
			var bot = this.editorBots.editor;

			bot.dialog( 'tableProperties', function( dialog ) {
				// Check defaults.
				assert.areSame( '500px', dialog.getValueOf( 'info', 'txtWidth' ) );
				assert.areSame( '3', dialog.getValueOf( 'info', 'txtRows' ) );
				assert.areSame( '2', dialog.getValueOf( 'info', 'txtCols' ) );

				dialog.fire( 'ok' );
				dialog.hide();

				wait( function() {
					// #8337: check cursor position after hand.
					var output = bender.tools.getHtmlWithSelection( bot.editor );
					output = bender.tools.fixHtml( bender.tools.compatHtml( output ) );
					var expected = bender.tools.compatHtml( bender.tools.getValueAsHtml( 'create-table' ) );
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

					assert.areSame( bender.tools.compatHtml(
						bender.tools.fixHtml( expected ) ),
									bot.getData( true ) );
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
			bender.tools.testInputOut( 'del-table', function( source, expected ) {
				bot.setHtmlWithSelection( source );
				bot.execCommand( 'tableDelete' );
				assert.isInnerHtmlMatching( '<p>@</p>', bot.editor.editable().getHtml(), 'div was removed too' );
			} );
		},

		// #12110.
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
		}
	} );

} )();