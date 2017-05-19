/* bender-tags: editor, tabletools */
/* bender-ckeditor-plugins: tabletools, toolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		setUp: function() {
			this.doc = CKEDITOR.document;
		},

		createRange: function() {
			return new CKEDITOR.dom.range( CKEDITOR.document.getBody() );
		},

		'test mergeRanges doesnt modify a single range': function() {
			var rng = this.createRange(),
				paragraph = this.doc.getById( 'mixed' ),
				ret;

			rng.selectNodeContents( this.doc.findOne( '#mixed strong' ) );

			ret = CKEDITOR.dom.range.mergeRanges( [ rng ] );

			assert.isArray( ret );

			assert.beautified.html( '[<strong>foo</strong>]<span>bar</span><em>baz</em>',
				bender.tools.range.getWithHtml( paragraph, ret[ 0 ] ) );
		},

		'test mergeRanges doesnt join non continuos ranges': function() {
			var ranges = [ this.createRange(), this.createRange() ],
				paragraph = this.doc.getById( 'mixed' ),
				ret;

			ranges[ 0 ].selectNodeContents( this.doc.findOne( '#mixed strong' ) );
			ranges[ 1 ].selectNodeContents( this.doc.findOne( '#mixed em' ) );

			ret = CKEDITOR.dom.range.mergeRanges( ranges );

			assert.areSame( 2, ret.length, 'Returned ranges count' );

			assert.beautified.html( '[<strong>foo</strong>]<span>bar</span> <em>baz</em>',
				bender.tools.range.getWithHtml( paragraph, ret[ 0 ] ) );

			assert.beautified.html( '<strong>foo</strong><span>bar</span> [<em>baz</em>]',
				bender.tools.range.getWithHtml( paragraph, ret[ 1 ] ) );
		},

		'test mergeRanges joins continuos ranges': function() {
			var ranges = [ this.createRange(), this.createRange() ],
				paragraph = this.doc.getById( 'mixed' ),
				ret;

			ranges[ 0 ].setStartBefore( this.doc.findOne( '#mixed strong' ) );
			ranges[ 0 ].setEndAfter( this.doc.findOne( '#mixed strong' ) );
			ranges[ 1 ].setStartAfter( this.doc.findOne( '#mixed strong' ) );
			ranges[ 1 ].setEndAfter( this.doc.findOne( '#mixed span' ) );

			ret = CKEDITOR.dom.range.mergeRanges( ranges );

			assert.areSame( 1, ret.length, 'Returned ranges count' );

			assert.beautified.html( '[<strong>foo</strong><span>bar</span>]<em>baz</em>',
				bender.tools.range.getWithHtml( paragraph, ret[ 0 ] ) );
		},

		'test mergeRanges intercepted with whitespace and diff parents': function() {
			var ranges = [ this.createRange(), this.createRange() ],
				paragraph = this.doc.getById( 'mixed' ),
				ret;

			ranges[ 0 ].selectNodeContents( this.doc.findOne( '#mixed strong' ) );
			ranges[ 1 ].selectNodeContents( this.doc.findOne( '#mixed span' ) );

			ret = CKEDITOR.dom.range.mergeRanges( ranges );

			assert.areSame( 1, ret.length, 'Returned ranges count' );

			assert.beautified.html( '[<strong>foo</strong><span>bar</span>]<em>baz</em>',
				bender.tools.range.getWithHtml( paragraph, ret[ 0 ] ) );
		},

		'test mergeRanges joins subsequent cells to a whole table': function() {
			// Let's create a range for each td, and then ensure it merges it into a whole
			// table range.
			var cells = this.doc.find( '#table3x2 td' ),
				ranges = [],
				rng,
				ret,
				i;

			for ( i = 0; i < cells.count(); i++ ) {
				rng = this.createRange();
				rng.selectNodeContents( cells.getItem( i ) );
				ranges.push( rng );
			}

			ret = CKEDITOR.dom.range.mergeRanges( ranges );

			assert.areSame( 1, ret.length, 'Returned ranges count' );

			// assert.beautified.html( '[<strong>foo</strong><span>bar</span>]<em>baz</em>',
			// 	bender.tools.range.getWithHtml( paragraph, ret[ 0 ] ) );
		}
	} );
} )();
