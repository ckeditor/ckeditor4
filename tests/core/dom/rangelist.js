/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document;

	bender.test( {
		test__constructor: function() {
			var rlist = new CKEDITOR.dom.rangeList(),
				range = new CKEDITOR.dom.range( doc );

			assert.areEqual( 0, rlist.length, 'No ranges - empty array returned' );
			assert.areSame( rlist, new CKEDITOR.dom.rangeList( rlist ), 'rangeList as an argument' );

			rlist = new CKEDITOR.dom.rangeList( range );
			assert.areEqual( 1, rlist.length );
			assert.areSame( range, rlist[ 0 ] );
		},

		test_createIterator: function() {
			var rlist,
				ranges = [],
				ranges2 = [],
				range,
				iterator,
				i;

			for ( i = 0 ; i < 3 ; ++i ) {
				range = new CKEDITOR.dom.range( doc );
				range.setStartBefore( doc.getById( 'createIterator' + i ) );
				range.setEndAfter( doc.getById( 'createIterator' + i ) );
				ranges[ i ] = range;
			}

			rlist = new CKEDITOR.dom.rangeList( ranges );
			iterator = rlist.createIterator();

			while ( range = iterator.getNextRange() )
				ranges2.push( range );

			assert.isTrue( CKEDITOR.tools.arrayCompare( ranges, ranges2 ) );

			iterator = rlist.createIterator();
			ranges2 = [];
			while ( range = iterator.getNextRange( true ) )
				ranges2.push( range );

			assert.areEqual( 1, ranges2.length, 'Adjacent nodes merged' );
		}
	} );
} )();
