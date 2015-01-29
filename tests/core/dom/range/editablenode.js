/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var tests = {
		'rangeGetNextEditableNode': function( html, childIndex, startOffset, previous ) {
			var ct = new CKEDITOR.dom.element( 'div' );
			ct.setHtml( html );

			var start = ct.findOne( '#s' ),
				rangeStart = childIndex === false ? start : start.getChild( childIndex );

			var range = new CKEDITOR.dom.range( ct );
			range.setStart( rangeStart, startOffset );
			range.collapse( true );

			var next = range[ previous ? 'getPreviousEditableNode' : 'getNextEditableNode' ]();

			if ( !next )
				return null;

			if ( next.type == CKEDITOR.NODE_TEXT )
				return next.getText();

			return next.getName() + ( next.$.id ? '#' + next.$.id : '' );
		},

		'test getNextEditableNode - 1': function() {
			assert.areSame( 'ab', this.rangeGetNextEditableNode( '<p id="s">ab</p>', 0, 1 ) ); // a^b
		},

		'test getNextEditableNode - 2': function() {
			assert.areSame( 'ab', this.rangeGetNextEditableNode( '<p id="s">ab</p>', 0, 0 ) ); // ^ab (text)
		},

		'test getNextEditableNode - 3': function() {
			assert.areSame( 'ab', this.rangeGetNextEditableNode( '<p id="s">ab</p>', false, 0 ) ); // ^ab (el)
		},

		'test getNextEditableNode - 4': function() {
			// ab^<br> (text)
			assert.areSame( !CKEDITOR.env.needsBrFiller ? 'br' : 'cd', this.rangeGetNextEditableNode( '<p id="s">ab<br></p><p>cd</p>', 0, 2 ) );
		},

		'test getNextEditableNode - 5': function() {
			// ab^
			assert.areSame( 'br', this.rangeGetNextEditableNode( '<p id="s">ab</p><p><br></p><p>cd</p>', 0, 2 ) );
		},

		'test getNextEditableNode - 6': function() {
			// ab^
			assert.areSame( !CKEDITOR.env.needsBrFiller ? 'p#e' : 'cd', this.rangeGetNextEditableNode( '<p id="s">ab</p><p id="e"></p><p>cd</p>', 0, 2 ) );
		},

		'test getNextEditableNode - 7': function() {
			// ab^
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s">ab</p><ul><li>cd</li></ul>', 0, 2 ) );
		},

		'test getNextEditableNode - 8': function() {
			// ab^
			assert.areSame( 'br', this.rangeGetNextEditableNode( '<p id="s">ab</p><ul><li><br></li></ul>', 0, 2 ) );
		},

		'test getNextEditableNode - 9': function() {
			// ab^
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s">ab</p><table><tbody><tr><td>cd</td></tr></tbody></table>', 0, 2 ) );
		},

		'test getNextEditableNode - 10': function() {
			// ab^
			assert.areSame( 'i', this.rangeGetNextEditableNode( '<p id="s">ab<i contenteditable="false">cd</i></p>', 0, 2 ) );
		},

		'test getNextEditableNode - 11a': function() {
			// ab^
			assert.areSame( 'div', this.rangeGetNextEditableNode( '<p id="s">ab</p><div contenteditable="false">cd</div>', 0, 2 ) );
		},

		'test getNextEditableNode - 11b': function() {
			// ab^
			assert.areSame( 'ul', this.rangeGetNextEditableNode( '<p id="s">ab</p><ul contenteditable="false"><li>cd</li></ul>', 0, 2 ) );
		},

		'test getNextEditableNode - 12': function() {
			// ab^<bookmark>
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s">ab<span data-cke-bookmark="1"></span></p><p>cd</p>', 0, 2 ) );
		},

		'test getNextEditableNode - 13': function() {
			if ( CKEDITOR.env.needsBrFiller )
				assert.ignore();

			// <p>^</p>
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s"></p><p>cd</p>', false, 0 ) );
		},

		'test getNextEditableNode - 13a': function() {
			if ( !CKEDITOR.env.needsBrFiller )
				assert.ignore();

			// <p>^<br></p>
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s"><br></p><p>cd</p>', false, 0 ) );
		},

		'test getNextEditableNode - 13b': function() {
			if ( !CKEDITOR.env.needsBrFiller )
				assert.ignore();

			// <p>^<bookmark><br></p>
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s"><span data-cke-bookmark="1"></span><br></p><p>cd</p>', false, 0 ) );
		},

		'test getNextEditableNode - 13c': function() {
			if ( !CKEDITOR.env.needsBrFiller )
				assert.ignore();

			// <p>^ <br></p>
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s"> <br></p><p>cd</p>', false, 0 ) );
		},

		'test getNextEditableNode - 14': function() {
			// ab^
			assert.areSame( !CKEDITOR.env.needsBrFiller ? 'li#e' : 'cd', this.rangeGetNextEditableNode( '<p id="s">ab</p><ul><li id="e"></li><li>cd</li></ul>', 0, 2 ) );
		},

		'test getNextEditableNode - 15': function() {
			// ab^
			assert.areSame( !CKEDITOR.env.needsBrFiller ? 'div' : 'cd', this.rangeGetNextEditableNode( '<p id="s">ab</p>\n <div>    </div><p>cd</p>', 0, 2 ) );
		},

		'test getNextEditableNode - 16': function() {
			// ab^
			assert.areSame( null, this.rangeGetNextEditableNode( '<p id="s">ab</p>', 0, 2 ) );
		},

		'test getNextEditableNode - 17a': function() {
			// <table>^<tr>
			assert.areSame( 'ab', this.rangeGetNextEditableNode( '<table id="s"><tr><td>ab</td></tr></table>', false, 0 ) );
		},

		'test getNextEditableNode - 17b': function() {
			if ( !CKEDITOR.env.needsBrFiller )
				assert.ignore();

			// <table>^<tr>
			assert.areSame( 'br', this.rangeGetNextEditableNode( '<table id="s"><tr><td><br></td><td>ab</td></tr></table>', false, 0 ) );
		},

		// Similarly to tests 14 and 15.
		'test getNextEditableNode - 17c': function() {
			var expected = CKEDITOR.env.needsBrFiller ? 'ab' : 'td';

			// <table>^<tr>
			assert.areSame( expected, this.rangeGetNextEditableNode( '<table id="s"><tr><td></td><th>ab</th></tr></table>', false, 0 ) );
		},

		'test getPreviousEditableNode - 1': function() {
			// ab^
			assert.areSame( 'ab', this.rangeGetNextEditableNode( '<p id="s">ab</p>', 0, 2 , true ) );
		}
	};

	bender.test( tests );
} )();