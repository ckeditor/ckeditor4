/* bender-tags: editor,unit,dom */

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
		}
	} );

} )();