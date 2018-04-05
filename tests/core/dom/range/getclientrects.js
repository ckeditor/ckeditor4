/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		tests = {
		setUp: function() {
			this.playground = doc.getById( 'playground' );
			this.playground.focus(); // todo check if focus is really needed
		},

		'test simple single line selection': function() {
			var range = this._selectFixture( 'simple-selection' ),
				rects = range.getClientRects();

			assert.areSame( 120, rects[ 0 ].left, 'rect[ 0 ].left' );
			assert.areSame( 150, rects[ rects.length - 1 ].right, 'rect[ last ].right' );
			// todo rest of the assertions
		},

		_selectFixture: function( fixtureId ) {
			var range = bender.tools.range.setWithHtml( this.playground, doc.getById( fixtureId ).getHtml().replace( /[\t\r\n]/g, '' ) );

			doc.getSelection().selectRanges( [ range ] );

			return range;
		}
	};

	bender.test( tests );
} )();
