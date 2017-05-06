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

			ret = CKEDITOR.plugins.tabletools.mergeRanges( [ rng ] );

			assert.isArray( ret );

			assert.beautified.html( '<strong>[foo]</strong><span>bar</span><em>baz</em>',
				bender.tools.range.getWithHtml( paragraph, ret[ 0 ] ) );
		},

		'test mergeRanges doesnt join non continous ranges': function() {
			var ranges = [ this.createRange(), this.createRange() ],
				paragraph = this.doc.getById( 'mixed' ),
				ret;

			ranges[ 0 ].selectNodeContents( this.doc.findOne( '#mixed strong' ) );
			ranges[ 1 ].selectNodeContents( this.doc.findOne( '#mixed em' ) );

			ret = CKEDITOR.plugins.tabletools.mergeRanges( ranges );

			assert.areSame( 2, ret.length, 'Returned ranges count' );

			// assert.beautified.html( '<strong>[foo]</strong><span>bar</span><em>baz</em>',
			// 	bender.tools.range.getWithHtml( paragraph, ret[ 0 ] ) );
		}
	} );
} )();
