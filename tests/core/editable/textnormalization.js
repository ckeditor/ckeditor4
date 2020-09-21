/* bender-tags: editor,insertion */

( function() {
	'use strict';

	var setHtmlWithSelection = bender.tools.setHtmlWithSelection;

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}
		},

		// (#848).
		'arabic text should be composed correctly on insertion (case 1)': function() {
			var editor = this.editor;

			setHtmlWithSelection( editor, '<p>Text: ^</p>' );

			editor.insertText( 'عام' );
			editor.insertText( 'عام' );

			var paragraph = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNormalization( paragraph, 'Text: عامعام' );
		},

		// (#848).
		'arabic text should be composed correctly on insertion (case 2)': function() {
			var editor = this.editor;

			setHtmlWithSelection( editor, '<p>Text: ^</p>' );

			editor.insertText( 'عام' );
			editor.insertText( 'عام' );
			editor.insertText( 'عام' );

			var paragraph = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNormalization( paragraph, 'Text: عامعامعام' );
		},

		// (#848).
		'regular text should be normalized': function() {
			var editor = this.editor;

			setHtmlWithSelection( editor, '<p>Text: ^</p>' );

			editor.insertText( '123' );
			editor.insertText( ' 456' );

			var paragraph = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNormalization( paragraph, 'Text: 123 456' );
		},

		// (#848).
		'text nodes in other block elements should not be touched (before)': function() {
			var editor = this.editor;

			setHtmlWithSelection( editor, '<p>Foo Bar Baz</p><p>Text2: ^</p>' );

			var paragraph1 = editor.editable().find( 'p' ).getItem( 0 );

			// Split single text node into few separate text nodes in first paragraph.
			paragraph1.getChild( 0 ).split( 4 );

			assertTextNodes( paragraph1, [ 'Foo ', 'Bar Baz' ] );

			// Insert text which triggers normalization.
			editor.insertText( 'Bax' );
			editor.insertText( ' Bay' );

			var paragraph2 = editor.editable().find( 'p' ).getItem( 1 );

			assertTextNodes( paragraph1, [ 'Foo ', 'Bar Baz' ] );
			assertTextNormalization( paragraph2, 'Text2: Bax Bay' );
		},

		// (#848).
		'text nodes in other block elements should not be touched (after)': function() {
			var editor = this.editor;

			setHtmlWithSelection( editor, '<p>Text1: ^</p><p>Foo Bar Baz</p>' );

			var paragraph2 = editor.editable().find( 'p' ).getItem( 1 );

			// Split single text node into few separate text nodes in first paragraph.
			paragraph2.getChild( 0 ).split( 7 );

			assertTextNodes( paragraph2, [ 'Foo Bar', ' Baz' ] );

			// Insert text which triggers normalization.
			editor.insertText( 'Bax' );
			editor.insertText( ' Bay' );

			var paragraph1 = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNodes( paragraph2, [ 'Foo Bar', ' Baz' ] );
			assertTextNormalization( paragraph1, 'Text1: Bax Bay' );
		},

		// (#848).
		'composable text which is not normally merged should not be merged due to normalization': function() {
			var editor = this.editor;

			setHtmlWithSelection( editor, '<p>Text: ^</p>' );

			editor.insertText( 'ｈ' );
			editor.insertText( 'え' );

			var paragraph = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNormalization( paragraph, 'Text: ｈえ' );
		}
	} );

	function assertTextNormalization( element, expectedText ) {
		assertTextNodes( element, [ expectedText ] );
	}

	function assertTextNodes( element, textNodesContents ) {
		// Even native innerHTML() method normalizes text nodes when called
		// so we have to check text contents manually by iterating over text nodes.
		objectAssert.areDeepEqual( textNodesContents, getTextNodesContents( element ) );
	}

	function getTextNodesContents( element ) {
		// If the mapped array is joined (to create single text entry) it also merges text
		// creating correct arabic text (I guess that's how correct unicode handling should work)
		// so we need to return and compare array where each item represents single text node contents.
		return CKEDITOR.tools.array.map( element.getChildren().toArray(), function( child ) {
			return child.getText().replace( /\u00a0/g, ' ' );
		} );
	}
} )();
