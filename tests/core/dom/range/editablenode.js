/* bender-tags: editor,unit,dom,range */

( function() {
	'use strict';

	var getInnerHtml = bender.tools.getInnerHtml,
		doc = CKEDITOR.document;

	var tests =
	{
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

		'test getNextEditableNode - 13 - IE': function() {
			if ( !CKEDITOR.env.ie )
				assert.ignore();

			// <p>^</p>
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s"></p><p>cd</p>', false, 0 ) );
		},

		'test getNextEditableNode - 13a - FF': function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			// <p>^<br></p>
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s"><br></p><p>cd</p>', false, 0 ) );
		},

		'test getNextEditableNode - 13b - FF': function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			// <p>^<bookmark><br></p>
			assert.areSame( 'cd', this.rangeGetNextEditableNode( '<p id="s"><span data-cke-bookmark="1"></span><br></p><p>cd</p>', false, 0 ) );
		},

		'test getNextEditableNode - 13c - FF': function() {
			if ( !CKEDITOR.env.gecko )
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

		'test getPreviousEditableNode - 1': function() {
			// ab^
			assert.areSame( 'ab', this.rangeGetNextEditableNode( '<p id="s">ab</p>', 0, 2 , true ) );
		}
	};

	bender.test( tests );
} )();