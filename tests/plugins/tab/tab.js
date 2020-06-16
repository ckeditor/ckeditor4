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
		}
	} );

} )();
