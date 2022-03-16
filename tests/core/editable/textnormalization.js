/* bender-tags: editor,insertion */

( function() {
	'use strict';

	var setHtmlWithSelection = bender.tools.setHtmlWithSelection;

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.editors = {
		enterp: {
			creator: 'replace',
			name: 'enterp'
		},
		enterbr: {
			creator: 'replace',
			name: 'enterbr',
			config: {
				enterMode: CKEDITOR.ENTER_BR
			}
		}
	};

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}
		},

		// (#848).
		'test arabic text should be composed correctly on insertion (end, case 1)': function() {
			var editor = this.editors.enterp;

			setHtmlWithSelection( editor, '<p>Text:&nbsp;^</p>' );

			editor.insertText( 'عام' );
			editor.insertText( 'عام' );

			var paragraph = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNormalization( paragraph, 'Text: عامعام' );
			assertCaretPosition( '<p>Text:&nbsp;عامعام^</p>', editor );
		},

		// (#848).
		'test arabic text should be composed correctly on insertion (end, case 2)': function() {
			var editor = this.editors.enterp;

			setHtmlWithSelection( editor, '<p>Text:&nbsp;^</p>' );

			editor.insertText( 'عام' );
			editor.insertText( 'عام' );
			editor.insertText( 'عام' );

			var paragraph = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNormalization( paragraph, 'Text: عامعامعام' );
			assertCaretPosition( '<p>Text:&nbsp;عامعامعام^</p>', editor );
		},

		// (#848).
		'test arabic text should be composed correctly on insertion (enter_br, case 1)': function() {
			var editor = this.editors.enterbr;

			setHtmlWithSelection( editor, 'Text:&nbsp;^' );

			editor.insertText( 'عام' );
			editor.insertText( 'عام' );

			var body = editor.editable();

			assertTextNormalization( body, 'Text: عامعام' );
			assertCaretPosition( 'Text:&nbsp;عامعام^', editor );
		},

		// (#848).
		'test arabic text should be composed correctly on insertion (enter_br, case 2)': function() {
			var editor = this.editors.enterbr;

			setHtmlWithSelection( editor, 'Foo Bar<div>Text:&nbsp;^</div>' );

			editor.insertText( 'عام' );
			editor.insertText( 'عام' );

			var div = editor.editable().find( 'div' ).getItem( 0 );

			assertTextNormalization( div, 'Text: عامعام' );
			assertCaretPosition( 'Foo Bar<div>Text:&nbsp;عامعام^</div>', editor );
		},

		// (#848).
		'test regular text should be normalized': function() {
			var editor = this.editors.enterp;

			setHtmlWithSelection( editor, '<p>Text:&nbsp;^</p>' );

			editor.insertText( '123' );
			editor.insertText( ' 456' );

			var paragraph = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNormalization( paragraph, 'Text: 123 456' );
			assertCaretPosition( '<p>Text:&nbsp;123&nbsp;456^</p>', editor );
		},

		// (#848).
		'test regular text should be normalized (enter_br)': function() {
			var editor = this.editors.enterbr;

			setHtmlWithSelection( editor, 'Text:&nbsp;^' );

			editor.insertText( '123' );
			editor.insertText( ' 456' );

			var paragraph = editor.editable();

			assertTextNormalization( paragraph, 'Text: 123 456' );
			assertCaretPosition( 'Text:&nbsp;123&nbsp;456^', editor );
		},

		// (#848).
		'test text nodes in other block elements should not be touched (before)': function() {
			var editor = this.editors.enterp;

			setHtmlWithSelection( editor, '<p>Foo Bar Baz</p><p>Text2:&nbsp;^</p>' );

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
			assertCaretPosition( '<p>Foo Bar Baz</p><p>Text2:&nbsp;Bax&nbsp;Bay^</p>', editor );
		},

		// (#848).
		'test text nodes in other block elements should not be touched (after)': function() {
			var editor = this.editors.enterp;

			setHtmlWithSelection( editor, '<p>Text1:&nbsp;^</p><p>Foo Bar Baz</p>' );

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
			assertCaretPosition( '<p>Text1:&nbsp;Bax&nbsp;Bay^</p><p>Foo Bar Baz</p>', editor );
		},

		// (#848).
		'test text nodes in other block elements will be touched for root text (enter_br, after)': function() {
			var editor = this.editors.enterbr;

			setHtmlWithSelection( editor, 'Text1:&nbsp;^<div>Foo Bar Baz</div>' );

			var div = editor.editable().find( 'div' ).getItem( 0 );

			// Split single text node into few separate text nodes in first paragraph.
			div.getChild( 0 ).split( 7 );

			assertTextNodes( div, [ 'Foo Bar', ' Baz' ] );

			// Insert text which triggers normalization.
			editor.insertText( 'Bax' );
			editor.insertText( ' Bay' );

			var body = editor.editable();

			assertTextNodes( div, [ 'Foo Bar Baz' ] );
			assertTextNormalization( body, 'Text1: Bax Bay' );
			assertCaretPosition( 'Text1:&nbsp;Bax&nbsp;Bay^<div>Foo Bar Baz</div>', editor );
		},

		// (#848).
		'test composable text which is not normally merged should not be merged due to normalization': function() {
			var editor = this.editors.enterp;

			setHtmlWithSelection( editor, '<p>Text:&nbsp;^</p>' );

			editor.insertText( 'ｈ' );
			editor.insertText( 'え' );

			var paragraph = editor.editable().find( 'p' ).getItem( 0 );

			assertTextNormalization( paragraph, 'Text: ｈえ' );
			assertCaretPosition( '<p>Text:&nbsp;ｈえ^</p>', editor );
		}
	} );

	function assertTextNormalization( element, expectedText ) {
		assertTextNodes( element, [ expectedText ] );
	}

	function assertCaretPosition( expected, editor ) {
		assert.areSame( expected, normalizeText( bender.tools.getHtmlWithSelection( editor ) ) );
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

		var nonEmptyTextNodes = CKEDITOR.tools.array.filter( element.getChildren().toArray(), function( child ) {
			// Filter:
			// * non-text nodes
			// * empty text nodes
			// * text nodes containing "filling char sequence" only
			return child.type === CKEDITOR.NODE_TEXT &&
				( child.getText() !== CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE && child.getText().length > 0 );
		} );

		return CKEDITOR.tools.array.map( nonEmptyTextNodes, function( textNode ) {
			return normalizeText( textNode.getText() );
		} );
	}

	function normalizeText( str ) {
		// Replace "&nbsp;" and "filling char sequence" for easy text nodes comparison.
		return str
			.replace( /\u00a0/g, ' ' )
			.replace( new RegExp( CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE, 'g' ), '' );
	}
} )();
