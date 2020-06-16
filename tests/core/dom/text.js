/* bender-tags: editor,dom */

( function() {
	'use strict';

	bender.test( {
		test_substring1: function() {
			var text = new CKEDITOR.dom.text( '0123456789' );

			assert.areSame( '123', text.substring( 1, 4 ) );
		},

		test_substring2: function() {
			var text = new CKEDITOR.dom.text( '0123456789' );

			assert.areSame( '56789', text.substring( 5 ) );
		},

		test_substring3: function() {
			var text = new CKEDITOR.dom.text( '0123456789' );

			assert.areSame( '', text.substring( 1, 1 ) );
		},

		test_substring4: function() {
			var text = new CKEDITOR.dom.text( '0123456789' );

			assert.areSame( '012', text.substring( -10, 3 ) );
		},

		test_substring5: function() {
			var text = new CKEDITOR.dom.text( '0123456789' );

			assert.areSame( '89', text.substring( 8, 100 ) );
		},

		test_substring6: function() {
			var text = new CKEDITOR.dom.text( '0123456789' );

			assert.areSame( '234', text.substring( 5, 2 ) );
		},

		test_split1: function() {
			var div = CKEDITOR.document.getById( 'playground' );
			div.setHtml( '01234' );

			var text = div.getFirst(),
				next = text.split( 3 );

			assert.areSame( '012', text.getText(), 'text.getText() is wrong' );
			assert.areSame( '34', next.getText(), 'next.getText() is wrong' );

			assert.areSame( div.$, next.$.parentNode, 'parentNode is wrong' );
			assert.areSame( text.$, next.$.previousSibling, 'sibling is wrong' );
		},

		'test split at text node boundary (end)': function() {
			var div = CKEDITOR.document.getById( 'playground' );
			div.setHtml( '01234' );

			var text = div.getFirst(),
				next = text.split( 5 );

			assert.areSame( '01234', text.getText(), 'text.getText() is wrong' );
			assert.areSame( '', next.getText(), 'next.getText() is wrong' );

			assert.areSame( div.$, next.$.parentNode, 'parentNode is wrong' );
			assert.areSame( text.$, next.$.previousSibling, 'sibling is wrong' );
		},

		'test split at text node boundary (start)': function() {
			var div = CKEDITOR.document.getById( 'playground' );
			div.setHtml( '01234' );

			var text = div.getFirst(),
				next = text.split( 0 );

			assert.areSame( '', text.getText(), 'text.getText() is wrong' );
			assert.areSame( '01234', next.getText(), 'next.getText() is wrong' );

			assert.areSame( div.$, next.$.parentNode, 'parentNode is wrong' );
			assert.areSame( text.$, next.$.previousSibling, 'sibling is wrong' );
		},

		test_split3: function() {
			var div = CKEDITOR.document.getById( 'playground' );
			div.setHtml( '01234' );

			var text = div.getFirst(),
				next = text.split( 0 );

			assert.areSame( '', text.getText(), 'text.getText() is wrong' );
			assert.areSame( '01234', next.getText(), 'next.getText() is wrong' );

			assert.areSame( div.$, next.$.parentNode, 'parentNode is wrong' );
			assert.areSame( text.$, next.$.previousSibling, 'sibling is wrong' );
		},

		test_split_3436: function() {
			var parent = CKEDITOR.document.getById( 'playground2' );
			parent.setHtml( 'A B <b>C </b>D E' );
			parent.getFirst().split( 2 );	// Right before "B"
			parent.getChildren().getItem( 3 ).split( 2 );	// Right before "E"
			assert.areSame( 5, parent.getChildren().count(), 'Child nodes num doesn\'t match after split' );
		},

		// (#3326)
		'test isEmpty': function() {
			var fillingCharSequence = CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE;

			assert.isFalse( isEmptyNode( 'foobar' ), 'Node should not be empty' );
			assert.isFalse( isEmptyNode( ' ' ), 'White space should be treated as valid charater' );
			assert.isFalse( isEmptyNode( ' ' + fillingCharSequence + ' ' ),
				'White space with filling char sequence should be treated as valid character' );

			assert.isTrue( isEmptyNode( '' ), 'Node should be empty when empty' );
			assert.isTrue( isEmptyNode( fillingCharSequence ), 'Node should be empty when filling char sequence' );
		},

		// (#3326)
		'test isEmpty ignore white space': function() {
			var fillingCharSequence = CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE;

			assert.isFalse( isEmptyNode( ' foobar ', true ), 'Mixed white space with text should not be empty' );

			assert.isTrue( isEmptyNode( ' ', true ), 'White space should be ignored' );
			assert.isTrue( isEmptyNode( ' ' + fillingCharSequence + ' ', true ),
				'Mixed white space with filling char sequence should be treated as empty' );
		}
	} );

	function isEmptyNode( text, ignoreWhiteSpace ) {
		return new CKEDITOR.dom.text( document.createTextNode( text ) ).isEmpty( ignoreWhiteSpace );
	}

} )();
