/* bender-tags: clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword,ajax */
/* bender-include: ../../../plugins/clipboard/_helpers/pasting.js,  ../../../../plugins/pastefromword/filter/default.js, _helpers/pfwTools.js */
/* global pfwTools */

( function() {
	'use strict';

	bender.editor = {
		config: pfwTools.defaultConfig
	};

	bender.test( {
		setUp: function(  ) {
			// Map PFW namespaces, so it's more convenient to use them.
			this.pastefromword = CKEDITOR.plugins.pastefromword;
			this.heuristics = this.pastefromword.heuristics;
		},

		'test assignListLevels': function() {
			var paragraphs = this.getParserElementsFrom( 'tc1' ),
				stub = sinon.stub( this.heuristics, 'isEdgeListItem' ).returns( true ),
				ret = this.heuristics.assignListLevels( this.editor, paragraphs[ 0 ] );

			stub.restore();

			arrayAssert.itemsAreEqual( [ 48, 96, 96, 192, 192, 96, 146 ], ret.indents );
			arrayAssert.itemsAreEqual( [ 0, 48, 0, 96, 0, -96, 50 ], ret.diffs );
			arrayAssert.itemsAreEqual( [ 1, 2, 2, 4, 4, 2, 3 ], ret.levels );

			assert.beautified.html( CKEDITOR.document.getById( 'tc1expected' ).getHtml(),
				this.getFragmentsOutputHtml( paragraphs[ 0 ].parent ) );
		},

		'test assignListLevels zero indent': function() {
			var paragraphs = this.getParserElementsFrom( 'tc2' ),
				stub = sinon.stub( this.heuristics, 'isEdgeListItem' ).returns( true ),
				ret = this.heuristics.assignListLevels( this.editor, paragraphs[ 0 ] );

			stub.restore();

			arrayAssert.itemsAreEqual( [ 0, 0, 48 ], ret.indents );
			arrayAssert.itemsAreEqual( [ 0, 0, 48 ], ret.diffs );
			arrayAssert.itemsAreEqual( [ 1, 1, 2 ], ret.levels );
		},

		'test assignListLevels does early return': function() {
			// If cke-list-level is already calculated, there's no point in doing it again.
			var stub = sinon.stub( this.heuristics, 'guessIndentationStep' );

			this.heuristics.assignListLevels( this.editor, this.getParserElementsFrom( 'tc1expected' )[ 0 ] );

			stub.restore();

			assert.isFalse( stub.called, 'Stub was never called' );
		},

		'test guessIndentationStep': function() {
			assert.isNull( this.heuristics.guessIndentationStep( [] ), 'Returned value for empty array' );
			assert.areSame( 20, this.heuristics.guessIndentationStep( [ 20, 20 ] ), 'tc1' );
			assert.areSame( 20, this.heuristics.guessIndentationStep( [ 20, 40, 60 ] ), 'tc2' );
			assert.areSame( 10, this.heuristics.guessIndentationStep( [ 10, 20, 20, 10 ] ), 'tc3' );
			// In case of same occurrences, always use the lower number.
			assert.areSame( 10, this.heuristics.guessIndentationStep( [ 10, 20 ] ), 'tc4' );
			assert.areSame( 10, this.heuristics.guessIndentationStep( [ 20, 10 ] ), 'tc5' );

			// It should always prioritize the lowest number.
			assert.areSame( 10, this.heuristics.guessIndentationStep( [ 20, 20, 10 ] ), 'tc5' );
		},

		'test cleanupEdgeListItem': function() {
			var paragraph = this.getParserElementsFrom( 'tc3' )[ 0 ],
				html;

			this.heuristics.cleanupEdgeListItem( paragraph );

			html = this.getFragmentsOutputHtml( paragraph );

			assert.beautified.html( CKEDITOR.document.getById( 'tc3expected' ).getHtml(), html, 'Paragraph\'s html' );
		},

		// Creates CKEDITOR.htmlParser.fragment based on given element, and returns it's children.'
		//
		// @param {string} id
		// @returns {CKEDITOR.htmlParser.node/null}
		getParserElementsFrom: function( id ) {
			return CKEDITOR.htmlParser.fragment.fromHtml( CKEDITOR.document.getById( id ).getHtml() ).children;
		},

		getFragmentsOutputHtml: function( fragment ) {
			var writer = new CKEDITOR.htmlParser.basicWriter();
			fragment.writeHtml( writer );
			return writer.getHtml();
		}
	} );
} )();
