/* bender-tags: editor,unit */

'use strict';

bender.test( {
	setUp: function() {
		this.parse = CKEDITOR.tools.style.parse;
	},

	'test style.parse.background single background': function() {
		var ret = this.parse.background( 'red url(foo.bar) no-repeat' );

		assert.isInstanceOf( Array, ret, 'Return type' );
		assert.areSame( 1, ret.length, 'Returned item count' );
	},

	'test style.parse.background multiple backgrounds': function() {
		var ret = this.parse.background( 'red url(foo.bar) no-repeat, rgba(1,1,1,1.0), green, rgb(133,13,12)' );

		assert.isInstanceOf( Array, ret, 'Return type' );
		assert.areSame( 4, ret.length, 'Returned item count' );

		// Test values.
		objectAssert.areEqual( { color: 'red', unprocessed: 'url(foo.bar) no-repeat' }, ret[ 0 ], 'ret[ 0 ]' );
		objectAssert.areEqual( { color: 'rgba(1,1,1,1.0)' }, ret[ 1 ], 'ret[ 1 ]' );
		objectAssert.areEqual( { color: 'green' }, ret[ 2 ], 'ret[ 2 ]' );
		objectAssert.areEqual( { color: 'rgb(133,13,12)' }, ret[ 3 ], 'ret[ 3 ]' );
	},

	'test style.parse.background unknown markup': function() {
		var ret = this.parse.background( 'foo bar   baz!' );

		objectAssert.areEqual( { unprocessed: 'foo bar   baz!' }, ret[ 0 ], 'ret[ 0 ]' );
	},

	'test style.parse._findColor empty value': function() {
		var ret = this.parse._findColor( '' );

		assert.isInstanceOf( Array, ret, 'Return type' );
		assert.areSame( 0, ret.length, 'Returned item count' );
	},

	'test style.parse._findColor hex': function() {
		var ret = this.parse._findColor( 'foo #foo #aa1 #000 aa #1234 #123456 #aag #AAB #AAB' );

		arrayAssert.itemsAreEqual( [ '#aa1', '#000', '#123456', '#AAB', '#AAB' ], ret );
	},

	'test style.parse._findColor rgba': function() {
		var ret = this.parse._findColor( 'rgb(255,0,128), rgb(),rgb,rgba(0000), rgb(10%, 10% ,10%) rgba(0,0,0,0.3) rgba(0,0,0,0)' );

		arrayAssert.itemsAreEqual( [ 'rgb(255,0,128)', 'rgb(10%, 10% ,10%)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)' ], ret );
	},

	'test style.parse._findColor hsla': function() {
		var ret = this.parse._findColor( 'hsl(10,30%,30%)   hsla(10,30%,30%,1)' );

		arrayAssert.itemsAreEqual( [ 'hsl(10,30%,30%)', 'hsla(10,30%,30%,1)' ], ret );
	},

	'test style.parse._findColor predefined': function() {
		var ret = this.parse._findColor( 'xa orange red blueish' );

		arrayAssert.itemsAreEqual( [ 'orange', 'red' ], ret );
	}
} );