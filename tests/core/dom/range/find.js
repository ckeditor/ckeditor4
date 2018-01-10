/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document;

	var tests = {
		'test no matches in range': function() {
			var range = new CKEDITOR.dom.range( doc ),
				results;

			range.selectNodeContents( doc.getById( 'empty' ) );
			results = range._find( '*' );

			assert.isArray( results, 'Return object type' );
			assert.areSame( 0, results.length, 'Result count' );
		},

		'test multiple matches in range': function() {
			var range = new CKEDITOR.dom.range( doc ),
				results;

			range.selectNodeContents( doc.getById( 'strongs' ) );
			results = range._find( 'strong' );

			assert.isArray( results, 'Return object type' );
			assert.areSame( 2, results.length, 'Result count' );
			assert.areSame( 'strong1', results[ 0 ].getId(), 'Id of a first matched element' );
			assert.areSame( 'strong2', results[ 1 ].getId(), 'Id of a second matched element' );
		},

		// (https://dev.ckeditor.com/ticket/17022)
		'test matching a contained node': function() {
			var range = new CKEDITOR.dom.range( doc ),
				strongsWrapper = doc.getById( 'strongs' ),
				results;

			range.setStartBefore( strongsWrapper );
			range.setEndAfter( strongsWrapper );
			results = range._find( 'div' );

			assert.isArray( results, 'Return object type' );
			assert.areSame( 1, results.length, 'Result count' );
			assert.areSame( 'strongs', results[ 0 ].getId(), 'Id of a first matched element' );
		},

		'test multiple matches in a spanned range': function() {
			// This range will span across two div containers. As a result, common ancestor is the container that holds
			// whole manual test HTML. There are more strongs in doc, so if scoping is wrong, more strongs than expected
			// will be matched.
			var range = new CKEDITOR.dom.range( doc ),
				firstContainer = doc.getById( 'empty' ),
				secondContainer = doc.getById( 'strongs' ),
				results;

			range.selectNodeContents( doc.getById( 'strongs' ) );
			range.setStartBefore( firstContainer );
			range.setEndAfter( secondContainer );
			results = range._find( 'strong' );

			assert.isArray( results, 'Return object type' );
			assert.areSame( 2, results.length, 'Result count' );
			assert.areSame( 'strong1', results[ 0 ].getId(), 'Id of a first matched element' );
			assert.areSame( 'strong2', results[ 1 ].getId(), 'Id of a second matched element' );
		},

		'test matching includeNonEditables': function() {
			var range = new CKEDITOR.dom.range( doc ),
				results;

			range.selectNodeContents( doc.getById( 'noneditables' ) );
			results = range._find( 'span' );

			assert.isArray( results, 'Return object type' );
			assert.areSame( 1, results.length, 'Result count' );
			assert.areSame( 'editablespan', results[ 0 ].getId(), 'Id of a first matched element' );
		},

		'test matching includeNonEditables=true': function() {
			var range = new CKEDITOR.dom.range( doc ),
				results;

			range.selectNodeContents( doc.getById( 'noneditables' ) );
			results = range._find( 'span', true );

			assert.isArray( results, 'Return object type' );
			assert.areSame( 2, results.length, 'Result count' );
			assert.areSame( 'editablespan', results[ 0 ].getId(), 'Id of a first matched element' );
			assert.areSame( 'noneditable', results[ 1 ].getId(), 'Id of a second matched element' );
		}
	};

	bender.test( tests );
} )();
