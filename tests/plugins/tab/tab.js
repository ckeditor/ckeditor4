/* bender-tags: editor */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'p em',
			tabSpaces: 3,
			plugins: 'tab'
		}
	};

	bender.test( {
		'test tabSpaces setting': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>foo{}bar</p>' );

			this.editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) );

			assert.areSame( '<p>foo&nbsp;&nbsp;&nbsp;bar</p>', this.editorBot.getData( true ), '3 spaces were inserted' );
		},

		// https://dev.ckeditor.com/ticket/12157
		'test tab preserves inline styles': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p><em>foo{}</em>bar</p>' );

			this.editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) );
			this.editor.insertText( 'x' );

			assert.areSame( '<p><em>foo&nbsp;&nbsp;&nbsp;x</em>bar</p>', this.editorBot.getData( true ),
				'spaces and text were inserted into the inline element' );
		},

		// (#4829)
		'test tab preserves undo step in table cells': function() {
			bender.editorBot.create( {
				name: 'tab-undo',
				config: {
					plugins: 'tab, undo'
				}
			}, function( bot ) {
				var editor = bot.editor;

				bot.setHtmlWithSelection(
					'<table>' +
						'<tbody>' +
							'<tr>' +
								'<td>text[]</td>' +
								'<td><br></td>' +
							'</tr>' +
						'</tbody>' +
					'</table>'
				);

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) );
				editor.insertText( 'foo' );

				assert.areEqual(
					editor.getSelection().getRanges()[ 0 ]._getTableElement().getText(),
					'foo',
					'Inserted text does not match'
				);
				editor.execCommand( 'undo' );
				assert.beautified.html(
					editor.getData(),
					'<table>' +
						'<tbody>' +
							'<tr><td>text</td><td>&nbsp;</td></tr>' +
						'</tbody>' +
					'</table>'
				);
			} );
		}
	} );

} )();
